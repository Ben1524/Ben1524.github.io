# 把算力与知识连成体系，让复杂系统更可控。

我是 **BeyondAlice**。  
一路从 **中国科大先研院**（图像模型部署）、**基流科技**（GPU 集群监控）、**华为南研所**（AI-Infra 部署），走到 **字节跳动 Seed-Robotics**（具身智能基建和平台）与 **字节跳动 Seed-AI4S**（计算平台构建）。同时持续深耕**高并发商城交易架构**、**Go 运行时与分布式共识**以及 **Agent 自进化体系**。

- **个人主页（五段实习闯关回放 / 九大核心课题 / `#notes` 专题笔记 / 45 篇必读文献检索）**：**[https://ben1524.github.io/](https://ben1524.github.io/)**
- **核心知识卡片直达**：**[https://ben1524.github.io/#notes](https://ben1524.github.io/#notes)**
- **完整实习履历与系统工程大纲**：**[docs/profile.md](https://github.com/Ben1524/Ben1524.github.io/blob/main/docs/profile.md)**
- **微信交流**：`CMCC-5-30M`

---

### 01 / 实习经历与成长路线 (The Growth Quest)

1. **STAGE 01 · 中国科大先研院 — 图像模型部署**  
   视觉模型算子对齐、ONNX 转换、TensorRT FP16/INT8 量化编译加速与高吞吐推理服务部署。
2. **STAGE 02 · 基流科技 — GPU 集群监控**  
   基于 NVIDIA DCGM 采集 SM/TensorCore 利用率、NVLink 带宽与 Xid 硬件错误，联动 RDMA (RoCEv2/IB) 通信指标与 Prometheus 全链路告警诊断。
3. **STAGE 03 · 华为南研所 — AI-Infra 部署**  
   Kubernetes 云原生算力编排、异构加速卡 Device Plugin / 训练作业 Operator 部署、镜像按需加载与分布式存储管理。
4. **STAGE 04 · 字节跳动 Seed-Robotics — 具身智能基建和平台**  
   多模态机器人轨迹数据（视频/点云/高频关节）端云采集、时间戳对齐清洗、Lance/MCAP 入湖，以及 VLA 模型训练编排与容器化并行仿真评测闭环。
5. **STAGE 05 · 字节跳动 Seed-AI4S — 计算平台构建**  
   面向大规模科学计算与 AI 负载的 Serverless GPU 平台：K8s Scheduler Framework 异构配额与拓扑调度、Virtual Kubelet 多集群节点池、双平面解耦与 Fail-Closed 高可靠控制面。
6. **STAGE 06 · 全景工程拓展 — 高并发商城交易与 Agent 自进化**  
   商品 SPU/SKU、订单状态机、三层库存秒杀防超卖、TCC/T+1 对账；以及 Agent 在线工具容错、Reflexion 分层记忆演进、Skill 自动合成与防退化评测门禁。

---

### 02 / 当前重点深耕的九大核心课题 (Core Focus Areas)

| 领域 | 课题方向 | 核心机制与工程要点 | 关联标签 |
| :--- | :--- | :--- | :--- |
| **计算平台 / 算力调度** | **K8s 异构算力调度、Virtual Kubelet 与双平面控制面** | 三级调度队列、`Assume/Unreserve` 两阶段绑定、配额与 NAS 快照 Fail-Closed 校验、多 VK 节点池与水平触发调谐 | `字节跳动 Seed-AI4S` `Scheduler` `Virtual Kubelet` |
| **算力监控 / 推理部署** | **从 TensorRT 量化到万卡级 DCGM/RDMA 遥测** | ONNX 算子融合与 INT8 校准、DCGM 硬件指标（`SM_ACTIVE`/`DRAM_ACTIVE`）、Xid 掉卡隔离与 RoCEv2 PFC/ECN 监控 | `基流科技` `科大先研院` `DCGM / TensorRT` |
| **具身智能 / 数据平台** | **多模态机器人数据飞轮、训练编排与仿真评测** | 多源传感器时间戳对齐、MCAP/Lance 存储入湖、NVDEC 视频流式加载、Isaac/MuJoCo 云端并行仿真 Rollout | `字节跳动 Seed-Robotics` `Embodied AI` `VLA Infra` |
| **智能体 / 自进化** | **Agent 自进化：在线自愈、记忆演进与技能合成** | 6 类 `StructuredError` 在线恢复、Reflexion 轨迹反思、情景/程序性记忆沉淀、Voyager 式 Skill 合成与评测门禁 | `Self-Evolving Agent` `Memory` `DSPy/TextGrad` |
| **商城业务 / 交易核心** | **订单状态机、计价分摊与基因法分库分表** | 满减「最后一笔尾差兜底」分摊（防拆单退货一分钱误差）、乐观锁订单 FSM、`buyer_id` 基因嵌入订单号单分片路由 | `Order FSM` `Pricing Engine` `Gene Sharding` |
| **商城业务 / 库存秒杀** | **三层库存模型、热点分桶与防超卖削峰** | 可售/预占/实物三层库存、`Redis Lua` 原子限购与预扣减、极端爆款 SKU 库存分桶（Inventory Sharding）与异步落库 | `Anti-Oversell` `Redis Lua` `Hotspot Sharding` |
| **商城业务 / 资金安全** | **商品 SPU/SKU 多级缓存、柔性事务与对账** | 商详「本地缓存 + Redis + Singleflight + Binlog」、Outbox 本地消息表与 TCC（防空回滚/防悬挂）、日终 T+1 对账 | `SPU / SKU` `TCC & Outbox` `Zero Capital Loss` |
| **运行时 / 并发性能** | **Go 运行时内核、内存分配器与低延迟调优** | TCMalloc 分级分配、三色标记混合写屏障 GC、逃逸分析、`sync.Pool` 零分配复用与 `pprof/trace` 火焰图诊断 | `Go Runtime` `GC Tuning` `Memory Model` |
| **分布式 / 状态存储** | **分布式共识、租约安全与流式状态同步** | Raft 选主与 `ReadIndex` 线性一致读、`Fencing Token` 防 GC 停顿脑裂写覆盖、Redis Streams `XAUTOCLAIM` 幂等消费 | `Raft / etcd` `Fencing Token` `Redis Streams` |

> _把算力与知识连成体系，把确定性留给系统。_
