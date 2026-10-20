# 把知识连成体系，让复杂系统更可控。

这里是 **Ben1524** 的个人知识雷达与系统工程学习指南。  
向下扎根**操作系统内核、Go 语言运行时与分布式存储**，向上贯通**高并发商城交易架构（商品 SKU / 订单状态机 / 秒杀防超卖 / 柔性事务对账）**、**云原生异构算力调度（K8s / AI Infra）**与**具备反思、记忆演进及技能自动合成能力的 Agent 自进化体系**。

- **个人知识主页（六层进阶推演 / 九大课题 / `#notes` 专题笔记 / 必读文献检索）**：**[https://ben1524.github.io/](https://ben1524.github.io/)**
- **核心知识卡片直达**：**[https://ben1524.github.io/#notes](https://ben1524.github.io/#notes)**
- **完整知识大纲（商城业务 + 云原生 + Agent 自进化）**：**[docs/profile.md](https://github.com/Ben1524/Ben1524.github.io/blob/main/docs/profile.md)**
- **微信交流**：`CMCC-5-30M`

---

### 01 / 当前重点关注的九大核心课题 (Core Focus Areas)

| 领域 | 课题方向 | 关注核心机制与工程问题 | 关联知识标签 |
| :--- | :--- | :--- | :--- |
| **商城业务 / 交易核心** | **订单状态机、计价分摊与基因法分库分表** | 促销满减按实付比例分摊与「最后一笔尾差兜底」（防拆单退货一分钱误差）、带前置状态校验的订单 FSM、`buyer_id` 基因嵌入订单号免跨分片路由、延时关单 | `Order FSM` `Pricing Engine` `Gene Sharding` |
| **商城业务 / 库存秒杀** | **三层库存模型、热点分桶与防超卖削峰** | 可售/锁定（预占）/实物三层库存流转、`Redis Lua` 原子限购与预扣减、极端爆款 SKU 库存分桶（Inventory Sharding）与异步流水落库 | `Anti-Oversell` `Redis Lua` `Hotspot Sharding` |
| **商城业务 / 资金安全** | **商品 SPU/SKU 多级缓存、柔性事务与对账** | 商详页「本地缓存 + Redis + Singleflight + Binlog 失效」、本地消息表（Outbox）与 TCC（防空回滚/防悬挂/幂等）、支付主动查单与日终 T+1 长短款对账 | `SPU / SKU` `TCC & Outbox` `Zero Capital Loss` |
| **云原生 / 算力调度** | **K8s 调度器内核与异构拓扑调度** | `ActiveQ/BackoffQ/UnschedulablePods` 三级队列、串行调度与异步绑定两阶段（`Assume/Unreserve`）、Gang 成组调度防死锁、GPU/NUMA 拓扑亲和 | `Scheduler Framework` `Coscheduling` `DRA` |
| **云原生 / 控制面** | **声明式调谐循环与多集群联邦** | 为什么坚持 Level-Triggered（水平触发）而非边缘触发；`Reflector/DeltaFIFO/Indexer` 缓存一致性、乐观锁冲突重试、Lease 选主与 Virtual Kubelet | `client-go` `Informer` `Virtual Kubelet` |
| **运行时 / 并发性能** | **Go 运行时内核与低延迟调优** | TCMalloc 多级内存分配、三色标记 + 混合写屏障 GC、逃逸分析、`sync.Pool` 零分配复用，以及用 `pprof` / `trace` 排查锁竞争与长尾延迟 | `Go Runtime` `GC Tuning` `Memory Model` |
| **分布式 / 状态存储** | **共识协议、租约安全与流式同步** | Raft 选主与日志复制安全性、`ReadIndex` 线性一致读、`Fencing Token` 防止 GC 停顿引发脑裂写覆盖、Redis Streams `XAUTOCLAIM` 幂等消费 | `Raft / etcd` `Fencing Token` `Redis Streams` |
| **智能体 / 自进化** | **Agent 自进化：在线自愈、记忆演进与技能合成** | 结构化工具错误恢复（Online Recovery）、Reflexion 轨迹反思、情景/语义/程序性分层记忆沉淀、Voyager 式 Skill 自动合成、DSPy/TextGrad 与防退化评测门禁 | `Self-Evolving Agent` `Memory Evolution` `Skill Synthesis` |
| **AI Infra / 算力韧性** | **GPU 拓扑、推理调度与 Fail-Closed 架构** | GPU HBM 带宽与 NVLink/RDMA 通信、vLLM `PagedAttention` 显存页表管理、配额/权限快照显式 TTL 与 Fail-Closed 边界、Prometheus 低基数指标治理 | `GPU Topology` `vLLM / Ray` `Fail-Closed SRE` |

---

### 02 / 自底向上的六层认知阶梯 (The Knowledge Quest)

1. **LAYER 01 · 计算机系统与内核基石** — 虚拟内存与页表、Linux CFS/EEVDF 调度、VFS/PageCache、Epoll 零拷贝与容器网络栈 (`Cgroups v2` / `conntrack` / `eBPF`)
2. **LAYER 02 · 语言运行时与高并发编程** — Go GMP 调度器、内存分配器、垃圾回收屏障、Happens-Before 内存序与无锁并发原语
3. **LAYER 03 · 分布式存储、缓存与消息流** — Raft 状态机、LSM-Tree 存储引擎、多级缓存一致性、基因法分库分表与幂等消息流
4. **LAYER 04 · 商城交易与高并发业务架构** — DDD 领域建模、SPU/SKU 商品中心、优惠分摊计价引擎、订单状态机、秒杀防超卖库存、TCC/Outbox 柔性事务与 T+1 清结算对账
5. **LAYER 05 · 云原生控制面与异构算力调度** — Kubernetes 控制器模式、调度器框架扩展点、批量计算 Gang 调度、GPU 拓扑感知与 Virtual Kubelet
6. **LAYER 06 · Agent 自进化、AI Infra 与韧性工程** — 在线工具容错、Reflexion 反思回环、分层记忆演进与 Skill 合成、评测门禁、分布式训推算力底座与 Fail-Closed 架构

> _把知识连成体系，把确定性留给系统。_
