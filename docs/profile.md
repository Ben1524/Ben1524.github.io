# Ben1524 · 高并发商城业务、分布式系统与云原生知识大纲

> 把知识连成体系，让复杂系统更可控。  
> 在线知识地图: [https://ben1524.github.io/](https://ben1524.github.io/) · 专题笔记: [https://ben1524.github.io/#notes](https://ben1524.github.io/#notes)

---

## 1. 知识体系总览（六层认知阶梯）

| 层级 | 核心领域 | 关注焦点与必学机制 | 旨在攻克的系统难题 |
| :--- | :--- | :--- | :--- |
| **Layer 01** | **操作系统与内核基石** | 虚拟内存与多级页表、TCMalloc 分级分配、CFS/EEVDF 进程调度、VFS/PageCache、Epoll、Zero-Copy、Cgroups v2、TCP 拥塞与 conntrack | I/O 毛刺、内存碎片、上下文切换开销、容器网络丢包 |
| **Layer 02** | **语言运行时与高并发** | Go GMP 抢占式调度、三色标记混合写屏障 GC、逃逸分析、Happens-Before 内存序、Channel/Mutex 饥饿模式、`pprof` / `trace` 诊断 | GC STW 抖动、Goroutine 泄漏、锁竞争、伪共享（False Sharing） |
| **Layer 03** | **分布式存储、缓存与消息** | Raft 选主与日志复制、ReadIndex / LeaseRead 线性一致读、Fencing Token、LSM-Tree vs B+Tree、Redis 多级缓存、流式消息 `XAUTOCLAIM` | 网络分区脑裂、陈旧读（Stale Read）、缓存雪崩/击穿、消息丢失与重复消费 |
| **Layer 04** | **高并发商城与交易架构** | DDD 领域建模、SPU/SKU 商品模型、促销计价引擎与尾差分摊、订单有限状态机（FSM）、基因法分库分表、三层库存防超卖、秒杀热点分桶、TCC / 本地消息表、支付幂等与 T+1 账务核对 | 库存超卖与少卖、拆单退货一分钱误差、跨分片查询性能、TCC 空回滚与悬挂、支付长短款资损 |
| **Layer 05** | **云原生控制面与算力调度** | Kubernetes API 约定、Informer 水平触发调谐、Lease 选主、Scheduler Framework 三级队列与 `Assume/Unreserve` 两阶段绑定、Gang Scheduling、GPU 拓扑与 Virtual Kubelet | 状态漂移、控制器写冲突、异构资源碎片、多卡分布式任务死锁 |
| **Layer 06** | **AI Infra 与韧性工程** | GPU HBM 显存与 NVLink/RDMA 通信、vLLM PagedAttention、Serverless GPU 冷启动优化、Agent 工具调用确定性容错状态机、Fail-Closed 与低基数可观测性 | 算力利用率（MFU）低下、LLM 工具调用幻觉/失败、级联雪崩与高基数指标爆炸 |

---

## 2. 商城项目与交易业务核心知识拆解

### 2.1 商品中心与多级读缓存
- **SPU 与 SKU 解耦**：
  - `SPU`（Standard Product Unit）：标准化产品单元（如「MacBook Pro 14」），承载商品标题、类目、品牌、公共规格树与图文详情。
  - `SKU`（Stock Keeping Unit）：最小库存与计价单元（如「M4 Pro / 24GB / 512GB / 深空黑」），承载独立价格、条形码与库存。
- **高并发商详页读架构**：
  - 采用 **「进程内本地缓存（Ristretto / BigCache）+ 分布式缓存（Redis）+ `Singleflight` 防并发击穿 + 订阅 MySQL Binlog（Canal）异步失效/更新」**。
  - 空值缓存 / 布隆过滤器防止恶意请求穿透 DB；热点 Key 探测自动晋升至本地缓存。

### 2.2 购物车、促销计价与订单履约核心
- **营销算价与优惠分摊（「一分钱尾差」问题）**：
  - 当订单包含多个商品行（`OrderItem`）并叠加跨店满减、店铺券、红包与积分时，必须将优惠金额按各商品行实付比例分摊到最小粒度。
  - **尾差兜底公式**：前 $N-1$ 个子项按比例计算并向下取整（或四舍五入）到「分」，**第 $N$ 个子项分摊额 = 总优惠额 - $\sum_{i=1}^{N-1}$ 已分摊额**，确保发生部分逆向退货时退还金额严格准确，绝不发生超退资损。
- **订单有限状态机（FSM）**：
  - 正向主状态：`UNPAID`（待支付）→ `PAID`（已支付/待发货）→ `SHIPPED`（已发货/待收货）→ `COMPLETED`（已完成）或 `CLOSED`（已关闭）。
  - 所有状态变更必须由明确事件（`PaySuccessEvent`、`TimeoutCloseEvent`、`RefundApproveEvent`）触发，且 SQL 层必须带上前置状态条件（`WHERE order_id = ? AND status = ?`）防止并发乱序覆盖。
- **基因法订单号与分库分表**：
  - 将 `buyer_id` 的后 $k$ 位二进制（如后 6 bit 对应 64 个分表）作为「分片基因」拼接到分布式订单号 `order_id` 尾部。
  - 使得按 `buyer_id` 查询买家历史订单与按 `order_id` 查询订单详情都能直接路由到同一物理分表，彻底消除买家端跨库聚合查询；卖家端与运营后台查询则通过订阅 Binlog 异步同步至卖家维度分库或 Elasticsearch 宽表。

### 2.3 高并发库存、秒杀削峰与资金安全
- **三层库存模型**：
  - 区分 **可售库存（Available）**、**预占/锁定库存（Reserved）** 与 **实物库存（Physical）**。
  - 下单预占（`Available - N, Reserved + N`）→ 支付成功转实扣（`Reserved - N, Physical - N`）→ 超时未支付自动关单释放（`Reserved - N, Available + N`）。
- **秒杀与热点 SKU 防超卖**：
  - 流量漏斗：CDN 静态化 → 网关层限流/风控防刷 → `Redis Lua` 脚本原子校验用户限购 + 扣减库存 → 发送 MQ 消息异步落库建单。
  - 极端热点 SKU 采用**库存分桶（Inventory Sharding）**：将单品库存拆分为多个 Redis 子 Key 分散在不同哈希槽，消除单实例网卡与单核瓶颈。
- **柔性事务（Transactional Outbox / TCC / Saga）与 T+1 对账**：
  - 高吞吐异步解耦优先采用**本地消息表（Transactional Outbox）**；强资源预留（优惠券核销、库存预扣、储值卡扣款）采用 **TCC**，并通过独立事务控制表解决**空回滚**、**幂等**与**防悬挂**。
  - 支付与清结算坚持 **「单笔实时幂等回调 + 定时主动查单兜底 + 日终 T+1 渠道账单与本地流水双向对账」**，发现长短款立即触发告警与平账工单。
