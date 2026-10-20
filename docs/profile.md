# Ben1524 · 高并发商城业务、分布式云原生与 Agent 自进化知识大纲

> 把知识连成体系，让复杂系统更可控。  
> 在线知识地图: [https://ben1524.github.io/](https://ben1524.github.io/) · 专题笔记: [https://ben1524.github.io/#notes](https://ben1524.github.io/#notes) · 微信: `CMCC-5-30M`

---

## 1. 知识体系总览（六层认知阶梯）

| 层级 | 核心领域 | 关注焦点与必学机制 | 旨在攻克的系统难题 |
| :--- | :--- | :--- | :--- |
| **Layer 01** | **操作系统与内核基石** | 虚拟内存与多级页表、TCMalloc 分级分配、CFS/EEVDF 进程调度、VFS/PageCache、Epoll、Zero-Copy、Cgroups v2、TCP 拥塞与 conntrack | I/O 毛刺、内存碎片、上下文切换开销、容器网络丢包 |
| **Layer 02** | **语言运行时与高并发** | Go GMP 抢占式调度、三色标记混合写屏障 GC、逃逸分析、Happens-Before 内存序、Channel/Mutex 饥饿模式、`pprof` / `trace` 诊断 | GC STW 抖动、Goroutine 泄漏、锁竞争、伪共享（False Sharing） |
| **Layer 03** | **分布式存储、缓存与消息** | Raft 选主与日志复制、ReadIndex / LeaseRead 线性一致读、Fencing Token、LSM-Tree vs B+Tree、Redis 多级缓存、流式消息 `XAUTOCLAIM` | 网络分区脑裂、陈旧读（Stale Read）、缓存雪崩/击穿、消息丢失与重复消费 |
| **Layer 04** | **高并发商城与交易架构** | DDD 领域建模、SPU/SKU 商品模型、促销计价引擎与尾差分摊、订单有限状态机（FSM）、基因法分库分表、三层库存防超卖、秒杀热点分桶、TCC / 本地消息表、支付幂等与 T+1 账务核对 | 库存超卖与少卖、拆单退货一分钱误差、跨分片查询性能、TCC 空回滚与悬挂、支付长短款资损 |
| **Layer 05** | **云原生控制面与算力调度** | Kubernetes API 约定、Informer 水平触发调谐、Lease 选主、Scheduler Framework 三级队列与 `Assume/Unreserve` 两阶段绑定、Gang Scheduling、GPU 拓扑与 Virtual Kubelet | 状态漂移、控制器写冲突、异构资源碎片、多卡分布式任务死锁 |
| **Layer 06** | **Agent 自进化、AI Infra 与韧性** | 执行期在线工具容错（Online Recovery）、Reflexion 轨迹反思、情景/语义/程序性记忆演进、Voyager 式 Skill 库自动合成、DSPy/TextGrad 提示自优化、防退化评测门禁、vLLM PagedAttention 与 Fail-Closed | Agent 静态脆弱与重复犯错、错误经验自我强化、算力利用率（MFU）瓶颈、级联雪崩 |

---

## 2. 商城项目与交易业务核心知识拆解

### 2.1 商品中心与多级读缓存
- **SPU 与 SKU 解耦**：
  - `SPU`（Standard Product Unit）：标准化产品单元，承载商品标题、类目、品牌、公共规格树与图文详情。
  - `SKU`（Stock Keeping Unit）：最小库存与计价单元，承载独立价格、条形码与库存。
- **高并发商详页读架构**：
  - 采用 **「进程内本地缓存（Ristretto / BigCache）+ 分布式缓存（Redis）+ `Singleflight` 防并发击穿 + 订阅 MySQL Binlog（Canal）异步失效/更新」**。

### 2.2 购物车、促销计价与订单履约核心
- **营销算价与优惠分摊（「一分钱尾差」问题）**：
  - 叠加跨店满减、店铺券、红包与积分时，按各商品行（`OrderItem`）实付比例分摊：前 $N-1$ 项向下取整到「分」，**第 $N$ 项分摊额 = 总优惠额 - $\sum_{i=1}^{N-1}$ 已分摊额**，确保部分逆向退货时零资损。
- **订单有限状态机（FSM）与基因法分库分表**：
  - 状态机跃迁强制携带前置状态乐观锁（`WHERE order_id = ? AND status = 'UNPAID'`）。
  - 将 `buyer_id` 低 $k$ 位二进制作为「分片基因」嵌入 `order_id`，实现买家与订单双维度单分片路由；卖家维度通过 Binlog 异步同步至 ES 宽表。

### 2.3 高并发库存、秒杀削峰与资金安全
- **三层库存模型**：分离 **可售库存（Available）**、**预占/锁定库存（Reserved）** 与 **实物库存（Physical）**，配合时间轮/延迟队列自动关单回滚预占。
- **秒杀与热点 SKU 库存分桶**：`Redis Lua` 原子限购与预扣 + 极端爆款拆分为 $K$ 个子桶（Inventory Sharding）分散单分片压力。
- **柔性事务与 T+1 对账**：本地消息表（Transactional Outbox）与 TCC（严格防空回滚、防悬挂、保幂等）结合；每日凌晨执行渠道账单与本地流水的 T+1 双向核对与差错平账。

---

## 3. Agent 自进化（Self-Evolving Agents）核心知识拆解

1. **执行期在线故障自愈（Online Failure Recovery）**：
   - 将工具/MCP 调用异常归纳为 6 类 `StructuredError`（Schema 校验失败、必参缺失、权限/配额拒绝、超时限流、下游故障、空结果/语义偏离），通过确定性恢复状态机执行参数自修正、备选工具切换与局部重规划（Re-plan）。
2. **事后轨迹反思与分层记忆演进（Reflexion & Memory Evolution）**：
   - 任务结束后对执行轨迹（Trajectory）进行归因反思（Verbal RL），将原始案例写入**情景记忆（Episodic Memory）**，将跨任务复用的领域知识与 SOP 提炼为**语义记忆（Semantic）**与**程序性记忆（Procedural Playbook）**。
   - 定期执行记忆去重合并（Consolidation）、矛盾消解与过期剪枝（Pruning），防止长上下文污染。
3. **技能与提示词自演化（Skill Synthesis & Prompt Optimization）**：
   - 借鉴 `Voyager` 将高频成功的多步工具调用自动封装为可复用的代码技能（Skill Library），并结合 `DSPy` / `TextGrad` 利用验证集反馈自动迭代系统 Prompt 与少样本示例。
4. **防退化评测门禁（Evaluator-Optimizer & Regression Gate）**：
   - 严防「错误经验固化（Reward Hacking / Hallucination Amplification）」：任何新合成的 Skill、记忆规则或 Prompt 变更入库前，必须通过**沙箱单测 + 历史失败轨迹回放（Trajectory Replay）+ 黄金基准集（Golden Benchmark）**门禁验证。
