# BeyondAlice · 实习历练与系统工程知识地图

> 把算力与知识连成体系，让复杂系统更可控。  
> 在线主页: [https://ben1524.github.io/](https://ben1524.github.io/) · 专题笔记: [https://ben1524.github.io/#notes](https://ben1524.github.io/#notes) · 微信: `CMCC-5-30M`

---

## 1. 实习经历与技术演进脉络

| 阶段 | 实习单位 / 团队 | 核心方向 | 关键工程内容与沉淀技术栈 |
| :--- | :--- | :--- | :--- |
| **Stage 01** | **中国科大先研院** | **图像模型部署** | 视觉/图像深度学习模型算子对齐、ONNX 转换、TensorRT FP16/INT8 校准量化、动态批处理流水线与高吞吐推理服务封装 |
| **Stage 02** | **基流科技** | **GPU 集群监控** | 基于 NVIDIA DCGM 采集显存/SM/TensorCore 利用率、PCIe/NVLink 带宽与 Xid 硬件错误码，联动 RoCEv2/IB RDMA 网络指标构建 Prometheus/Grafana 监控告警与故障自愈 |
| **Stage 03** | **华为南研所** | **AI-Infra 部署** | Kubernetes 容器编排底座交付、异构加速卡 Device Plugin 与训练任务 Operator 部署、容器镜像按需拉取加速与分布式存储挂载管理 |
| **Stage 04** | **字节跳动 Seed-Robotics** | **具身智能基建和平台** | 多模态机器人传感器轨迹数据（图像/点云/关节动作）端云采集、时间戳对齐清洗、Lance/MCAP 入湖，以及 VLA 模型分布式训练编排与并行仿真评测闭环 |
| **Stage 05** | **字节跳动 Seed-AI4S** | **计算平台构建** | 大规模 Serverless GPU 与科学计算平台研发：K8s Scheduler Framework 异构配额与存储调度插件、Virtual Kubelet 多集群节点池、双平面控制面解耦与 Fail-Closed 容灾 |
| **Stage 06** | **全景系统工程拓展** | **高并发商城 & Agent 自进化** | 横向深耕商城交易架构（SPU/SKU、订单状态机、三层库存防超卖、TCC/对账）与 Agent 自进化体系（在线自愈、Reflexion 记忆演进、Skill 自动合成与评测门禁） |

---

## 2. 核心技术专题拆解

### 2.1 计算平台构建与 AI-Infra（字节跳动 Seed-AI4S / 华为南研所 / 基流科技 / 科大先研院）
- **调度器与多集群联邦**：
  - K8s Scheduler `ActiveQ / BackoffQ / UnschedulablePods` 三级队列流转，串行 `Filter → Score → Reserve (Assume)` 与异步 `Bind / Unreserve` 两阶段提交。
  - 跨平面单向数据同步（Controller 写本地 Redis 快照，Scheduler 纯本地读取）与 **Fail-Closed 铁律**（缓存缺失/超期/权限不明时强制保持 Pod Pending）。
  - 基于 Virtual Kubelet 将异构算力池（Merlin / MLP）抽象为虚拟节点，容器内进程管理器（PM）通过 Redis Streams `XAUTOCLAIM` 实现控制指令幂等认领。
- **GPU 集群监控与图像模型部署**：
  - 单卡侧：ONNX 算子融合 + TensorRT INT8/FP16 量化编译 + CUDA Stream 异步流水线。
  - 集群侧：DCGM 深度硬件指标（`SM_ACTIVE`、`TENSOR_ACTIVE`、`DRAM_ACTIVE`、NVLink）+ 内核 `Xid` 故障感知隔离 + RDMA PFC/ECN 拥塞监控。

### 2.2 具身智能基建和平台（字节跳动 Seed-Robotics）
- **多模态数据飞轮**：解决多路相机、激光雷达与高频机械臂关节数据（30Hz～1000Hz）的时间戳对齐、异常帧裁剪、列式/向量化存储（Lance / Parquet）与语义检索。
- **高吞吐训练与仿真评测**：分片预取 + GPU 硬件解码（NVDEC）消除视频 Data Loader 瓶颈；云端容器化 Isaac / MuJoCo 并行 Rollout 仿真评测，失败轨迹自动回流。

### 2.3 高并发商城与交易业务架构
- **商品与交易履约**：`SPU/SKU` 领域解耦与商详多级缓存（Ristretto + Redis + Singleflight + Binlog 失效）；促销计价「前 $N-1$ 项向下取整 + 第 $N$ 项尾差兜底」分摊算法；带前置状态校验的订单有限状态机（FSM）；`buyer_id` 基因嵌入订单号免跨分片查询。
- **三层库存、秒杀与对账**：分离可售（Available）、预占（Reserved）与实物（Physical）库存；秒杀场景采用 `Redis Lua` 原子预扣 + 极端爆款 SKU 库存分桶（Inventory Sharding）；结合本地消息表（Outbox）、TCC（防空回滚/防悬挂/幂等）与 T+1 渠道账单双向核对守住零资损底线。

### 2.4 Agent 自进化体系（Self-Evolving Agents）
- **四层自进化闭环**：
  1. **执行期在线自愈（Online Recovery）**：6 类 `StructuredError` 分类学 + 参数自省修复/工具切换/局部重规划。
  2. **轨迹反思与分层记忆（Reflexion & Memory）**：将轨迹归因提炼至情景记忆（Episodic）与程序性 SOP（Procedural），定期执行记忆去重合并与陈旧剪枝。
  3. **技能合成与提示词演化（Skill Synthesis）**：借鉴 `Voyager` 自动合成可复用代码技能库，结合 `DSPy / TextGrad` 优化路由与 Prompt。
  4. **防退化评测门禁（Regression Gate）**：入库前强制执行沙箱单测 + 历史失败轨迹回放 + 黄金基准集验证，杜绝错误经验自我强化。
