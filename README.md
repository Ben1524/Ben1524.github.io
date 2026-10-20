# Ben1524.github.io

**Ben1524** 的个人知识雷达与系统工程学习地图——专注于沉淀**高并发商城与交易业务架构、操作系统内核、Go 语言运行时、分布式一致性、云原生异构算力调度与 Agent 自进化（Self-Evolving Agents）**的核心知识体系。

- 在线访问（部署后）：`https://ben1524.github.io/`
- 专题笔记直达：`https://ben1524.github.io/#notes`
- 微信联系：`CMCC-5-30M`

## 页面模块设计

1. **Hero 铭牌与第一性原理星图**：涵盖高并发商城交易架构、云原生算力调度、分布式系统、Go 运行时与 Agent 自进化，支持浅色/深色主题切换。
2. **`01 / THE KNOWLEDGE QUEST`（`#journey`）**：自底向上的 6 层认知阶梯交互式推演（系统内核 → 语言运行时 → 分布式存储 → 商城与交易 → 云原生算力调度 → Agent 自进化）+ 22 个核心知识节点背包。
3. **`02 / CORE FOCUS AREAS`（`#projects`）**：当前最应深耕的 9 大核心课题卡片（含商城交易/库存秒杀/资金对账、K8s 调度/控制面、Go 运行时/分布式共识、Agent 自进化/AI Infra），支持按领域即时筛选。
4. **`03 / WRITING & NOTES`（`#notes`）**：8 篇可折叠展开的结构化知识卡片（含商城订单与计价分摊、三层库存与秒杀/TCC/对账、Agent 自进化四层闭环、K8s 调度器、声明式控制面、分布式共识、Go 运行时、AI Infra 与 Fail-Closed）。
5. **`04 / KNOWLEDGE GRAPH`（`#library`）**：三大支柱领域的必读开源源码包（`dtm`、`seata`、`shardingsphere`、`Leaf`、`k8s/pkg/scheduler`、`go/src/runtime`、`dspy`、`textgrad`、`Voyager`、`mem0`、`vllm` 等）。
6. **`05 / CURATED READING LIST`（`#bookmarks`）**：45 条精选必读论文、大厂架构实践与官方文档（含 Reflexion、Voyager、DSPy、TextGrad、Self-Evolution Survey、美团 Leaf/DDD、Stripe 幂等键、Uber 复式记账、Borg、Raft 等），支持多关键词实时搜索。
7. **`06 & 07 / CONNECT & PHILOSOPHY`（`#social` & `#about`）**：微信号（`CMCC-5-30M`）一键复制卡片、GitHub 主页卡片、上线自检口诀，以及从底层系统、复杂业务到自进化智能体的架构思考。

## 本地预览

```bash
python3 -m http.server 4173
```

浏览器访问 `http://localhost:4173/#notes`。
