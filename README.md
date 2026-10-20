# Ben1524.github.io

**Ben1524** 的个人知识雷达与系统工程学习地图——专注于沉淀**高并发商城与交易业务架构、操作系统内核、Go 语言运行时、分布式一致性、云原生异构算力调度与 AI 基础设施**的核心知识体系。

- 在线访问（部署后）：`https://ben1524.github.io/`
- 专题笔记直达：`https://ben1524.github.io/#notes`

## 页面模块设计

1. **Hero 铭牌与第一性原理星图**：涵盖高并发商城交易架构、云原生算力调度、分布式系统与 Go 运行时，支持浅色/深色主题切换。
2. **`01 / THE KNOWLEDGE QUEST`（`#journey`）**：自底向上的 6 层认知阶梯交互式推演（含第 4 层「商城交易与高并发业务架构」）+ 22 个核心知识节点背包 + 每层必答自检问题。
3. **`02 / CORE FOCUS AREAS`（`#projects`）**：当前最应深耕的 9 大核心课题卡片（3 张商城与交易业务 + 2 张云原生调度 + 2 张分布式与运行时 + 2 张 AI Infra 与可靠性），支持按领域即时筛选。
4. **`03 / WRITING & NOTES`（`#notes`）**：8 篇可折叠展开的结构化知识卡片（含商城交易订单/计价/分库分表、三层库存防超卖/秒杀/TCC/对账、K8s 调度器、声明式控制面、分布式共识、Go 运行时、AI Infra、Fail-Closed 可靠性）。
5. **`04 / KNOWLEDGE GRAPH`（`#library`）**：三大支柱领域的必读开源源码包（`dtm`、`seata`、`shardingsphere`、`canal`、`Leaf`、`k8s/pkg/scheduler`、`client-go`、`go/src/runtime`、`etcd/raft`、`vllm` 等）。
6. **`05 / CURATED READING LIST`（`#bookmarks`）**：45 条精选必读论文、大厂架构实践与官方文档（美团 Leaf/DDD/缓存、Stripe 幂等键、Uber 复式记账、Borg、Raft、Spanner、PagedAttention 等），支持多关键词实时搜索。
7. **`06 & 07 / ENGINEERING HABITS & PHILOSOPHY`（`#social` & `#about`）**：交易系统与底层架构自检清单，以及为什么同时关注复杂业务与底层系统。

## 本地预览

```bash
python3 -m http.server 4173
```

浏览器访问 `http://localhost:4173/#notes`。
