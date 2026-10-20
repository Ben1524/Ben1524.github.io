"use strict";

const GROWTH_SKILLS = {
  linux: { name: "Linux 内核与 eBPF", icon: "linux.svg" },
  memory: { name: "虚拟内存与分配器", icon: "chip.svg" },
  netstack: { name: "TCP/IP 与网络栈", icon: "network.svg" },
  io: { name: "Epoll 与零拷贝 I/O", icon: "bolt.svg" },
  go: { name: "Go 语言运行时", icon: "go.svg" },
  gmp: { name: "GMP 协程调度", icon: "gear.svg" },
  gc: { name: "三色 GC 与逃逸分析", icon: "clock.svg" },
  lockfree: { name: "内存模型与无锁并发", icon: "code.svg" },
  raft: { name: "Raft / Paxos 共识", icon: "cube.svg" },
  storage: { name: "LSM-Tree 与分库分表", icon: "database.svg" },
  cache: { name: "多级缓存与一致性", icon: "redis.svg" },
  stream: { name: "消息流与幂等投递", icon: "bolt.svg" },
  ddd: { name: "DDD 与商品域建模", icon: "cube.svg" },
  order: { name: "订单状态机与履约", icon: "gear.svg" },
  seckill: { name: "热点库存与秒杀削峰", icon: "flame.svg" },
  tx: { name: "分布式事务与对账", icon: "shield.svg" },
  k8s: { name: "K8s 声明式控制面", icon: "k8s.svg" },
  scheduler: { name: "异构算力调度框架", icon: "radar.svg" },
  gpu: { name: "GPU 拓扑与虚拟节点", icon: "gpu.svg" },
  aiinfra: { name: "大模型训推基础设施", icon: "flame.svg" },
  agent: { name: "Agent 自进化与记忆", icon: "bot.svg" },
  sre: { name: "Fail-Closed 与可观测性", icon: "eye.svg" },
};

const GROWTH_STAGES = [
  {
    title: "计算机系统与内核基石",
    land: "第一层 · 机械同情谷",
    boss: "黑盒抽象迷雾",
    period: "LAYER 01 · OS & KERNEL INTERNALS",
    place: "必修底座 · 操作系统与网络栈",
    favoritePlace: "底座基石",
    description: "深入虚拟内存、多级页表、TCMalloc/ptmalloc 分配模型、Linux CFS/EEVDF 调度，以及 Epoll、PageCache、Zero-Copy 与 TCP 拥塞控制。",
    skills: ["linux", "memory", "netstack", "io"],
    link: "#notes",
  },
  {
    title: "语言运行时与高并发编程",
    land: "第二层 · 并发回廊",
    boss: "GC 抖动与竞争怪",
    period: "LAYER 02 · RUNTIME & CONCURRENCY",
    place: "核心内功 · Go Runtime 与并发原语",
    description: "吃透 Go GMP 抢占式调度、三色标记混合写屏障 GC、Happens-Before 内存序、Channel/Mutex 底层状态机，以及 pprof/trace 火焰图调优。",
    skills: ["go", "gmp", "gc", "lockfree"],
    link: "#notes",
  },
  {
    title: "分布式存储、缓存与消息流",
    land: "第三层 · 状态迷宫",
    boss: "脑裂与时钟漂移巨兽",
    period: "LAYER 03 · DISTRIBUTED & STORAGE",
    place: "架构支柱 · 共识算法与数据密集型系统",
    description: "掌握 Raft 选主与日志复制、Linearizable Read、Fencing Token、多级缓存穿透/击穿/雪崩防护、基因法分库分表，以及流式消息的幂等投递。",
    skills: ["raft", "storage", "cache", "stream"],
    link: "#notes",
  },
  {
    title: "商城交易与高并发业务架构",
    land: "第四层 · 洪峰集市",
    boss: "超卖与资损风暴",
    period: "LAYER 04 · E-COMMERCE & BUSINESS ARCH",
    place: "业务纵深 · 商品 / 交易 / 库存 / 支付清结算",
    favoritePlace: "业务核心",
    description: "深耕 SPU/SKU 商品建模、优惠分摊计价引擎、订单有限状态机（FSM）、延时关单、热点库存预占与防超卖、TCC/本地消息表分布式事务及 T+1 账务核对。",
    skills: ["ddd", "order", "seckill", "tx"],
    link: "#note-ecommerce-order",
  },
  {
    title: "云原生控制面与异构算力调度",
    land: "第五层 · 算力星图",
    boss: "状态漂移与资源碎片怪",
    period: "LAYER 05 · CLOUD-NATIVE & SCHEDULING",
    place: "核心主线 · Kubernetes 控制面与调度器内核",
    favoritePlace: "重点深耕",
    description: "掌握 Informer 水平触发调谐、Lease 选主、Scheduler Framework 三级队列与两阶段绑定、Gang 成组调度、GPU 拓扑亲和与 Virtual Kubelet。",
    skills: ["k8s", "scheduler", "gpu"],
    link: "#note-scheduler",
  },
  {
    title: "Agent 自进化、AI Infra 与韧性",
    land: "第六层 · 演化边疆",
    boss: "静态退化与级联故障",
    period: "LAYER 06 · SELF-EVOLVING AGENT & AI INFRA",
    place: "前沿深耕 · 智能体自进化闭环与高可靠算力底座",
    favoritePlace: "前沿探索",
    description: "研究 Agent 在线工具容错、Reflexion 反思回环、情景/程序性记忆沉淀、Skill 库自动合成与防退化评测门禁，结合 vLLM/Ray 训推底座与 Fail-Closed 韧性工程。",
    skills: ["agent", "aiinfra", "sre"],
    link: "#note-agent-evolution",
    ongoing: true,
  },
];

const GROWTH_DELAYS = { ready: 650, battle: 1450, won: 1700 };

function initialAdventure() {
  return { stage: 0, phase: "ready", completed: [], playing: false };
}

function finishStage(state) {
  return { ...state, phase: "won", completed: [...new Set([...state.completed, state.stage])] };
}

function reduceAdventure(state, action, count = GROWTH_STAGES.length) {
  switch (action.type) {
    case "play":
      return { ...(state.phase === "finished" ? initialAdventure() : state), playing: true };
    case "pause":
      return { ...state, playing: false };
    case "restart":
      return initialAdventure();
    case "select":
      if (!Number.isInteger(action.stage) || action.stage < 0 || action.stage >= count) return state;
      return { ...state, stage: action.stage, phase: "ready", playing: false };
    case "next":
      if (state.stage >= count - 1) return state;
      return { ...state, stage: state.stage + 1, phase: "ready", playing: false };
    case "light":
      return { ...finishStage(state), playing: false };
    case "tick":
      if (!state.playing) return state;
      if (state.phase === "ready") return { ...state, phase: "battle" };
      if (state.phase === "battle") return finishStage(state);
      if (state.phase === "won") {
        return state.stage < count - 1
          ? { ...state, stage: state.stage + 1, phase: "ready" }
          : { ...state, phase: "finished", playing: false };
      }
      return state;
    default:
      return state;
  }
}

function unlockedSkills(completed) {
  return new Set(completed.flatMap((stage) => GROWTH_STAGES[stage].skills));
}

function createAdventureController({ render, setTimer, clearTimer, now }) {
  let state = initialAdventure();
  let timer = null;
  let deadline = 0;
  let remaining = null;
  let generation = 0;

  function stopTimer(preserveTime) {
    generation += 1;
    if (timer !== null) {
      if (preserveTime) remaining = Math.max(0, deadline - now());
      clearTimer(timer);
      timer = null;
    }
    if (!preserveTime) remaining = null;
  }

  function schedule() {
    if (!state.playing) return;
    const delay = remaining ?? GROWTH_DELAYS[state.phase];
    remaining = null;
    deadline = now() + delay;
    const token = generation;
    timer = setTimer(() => {
      if (token !== generation) return;
      timer = null;
      state = reduceAdventure(state, { type: "tick" });
      render(state);
      schedule();
    }, delay);
  }

  function dispatch(action) {
    if (action.type === "pause") stopTimer(true);
    else if (action.type !== "play") stopTimer(false);
    else if (state.playing) return;
    state = reduceAdventure(state, action);
    render(state);
    schedule();
  }

  render(state);
  return {
    dispatch,
    getState: () => state,
    dispose: () => {
      stopTimer(false);
      state = reduceAdventure(state, { type: "pause" });
      render(state);
    },
  };
}

function initGrowth(doc, win) {
  const root = doc.getElementById("growth-adventure");
  if (!root) return;
  const motion = typeof win.matchMedia === "function" ? win.matchMedia("(prefers-reduced-motion: reduce)") : null;
  const play = doc.getElementById("growth-play");
  const next = doc.getElementById("growth-next");
  const restart = doc.getElementById("growth-restart");
  const loadout = doc.getElementById("growth-loadout");
  const bag = doc.getElementById("growth-inventory");
  const levels = Array.from(root.querySelectorAll("[data-growth-stage]"));
  const status = doc.getElementById("growth-status");
  const scene = doc.getElementById("growth-scene");
  const bagItems = new Map();
  let shownStage = -1;
  let firstVisit = true;

  function skillBadge(id) {
    const item = doc.createElement("li");
    const image = doc.createElement("img");
    image.src = `assets/icons/${GROWTH_SKILLS[id].icon}`;
    image.alt = "";
    image.width = 30;
    image.height = 30;
    image.loading = "lazy";
    const name = doc.createElement("span");
    name.textContent = GROWTH_SKILLS[id].name;
    item.append(image, name);
    return item;
  }

  Object.keys(GROWTH_SKILLS).forEach((id) => {
    const item = skillBadge(id);
    item.className = "growth-skill";
    item.dataset.unlocked = "false";
    bagItems.set(id, item);
    bag.append(item);
  });

  function render(state) {
    const stage = GROWTH_STAGES[state.stage];
    root.dataset.phase = state.phase;
    root.dataset.playing = String(state.playing);
    root.dataset.stage = String(state.stage);
    doc.getElementById("growth-level").textContent = `LV.${String(state.stage + 1).padStart(2, "0")}`;
    doc.getElementById("growth-land").textContent = stage.land;
    doc.getElementById("growth-boss").textContent = stage.boss;
    doc.getElementById("growth-loot").textContent = stage.ongoing ? "✧ NEXT FRONTIER!" : "✧ KNOWLEDGE GET!";
    doc.getElementById("growth-title").textContent = stage.title;
    doc.getElementById("growth-period").textContent = stage.period;
    doc.getElementById("growth-place").textContent = stage.place;
    const favorite = doc.getElementById("growth-favorite");
    favorite.hidden = !stage.favoritePlace;
    favorite.textContent = stage.favoritePlace ? `优先级：${stage.favoritePlace}` : "";
    doc.getElementById("growth-description").textContent = stage.description;
    const link = doc.getElementById("growth-source");
    link.href = stage.link;
    link.textContent = "查看对应专题笔记 ↘";
    if (shownStage !== state.stage) {
      loadout.replaceChildren(...stage.skills.map(skillBadge));
      shownStage = state.stage;
    }
    levels.forEach((button, index) => {
      button.setAttribute("aria-pressed", String(index === state.stage));
      const favoritePlace = GROWTH_STAGES[index].favoritePlace;
      button.setAttribute(
        "aria-label",
        `第 ${index + 1} 层 · ${GROWTH_STAGES[index].title}${favoritePlace ? `，${favoritePlace}` : ""}${state.completed.includes(index) ? "，已掌握" : ""}`
      );
      button.dataset.completed = String(state.completed.includes(index));
    });
    const unlocked = unlockedSkills(state.completed);
    bagItems.forEach((item, id) => {
      item.dataset.unlocked = String(unlocked.has(id));
      item.setAttribute("aria-label", `${GROWTH_SKILLS[id].name}，${unlocked.has(id) ? "已点亮" : "待点亮"}`);
    });
    doc.getElementById("growth-skill-count").textContent = `已点亮 ${unlocked.size} / ${bagItems.size}`;
    doc.getElementById("growth-progress").textContent = `知识进度 ${state.completed.length} / ${GROWTH_STAGES.length}`;
    scene.setAttribute(
      "aria-label",
      `${stage.land}：攻克「${stage.boss}」`
    );
    next.disabled = state.stage === GROWTH_STAGES.length - 1;
    play.disabled = Boolean(motion?.matches && state.phase === "won");
    play.textContent = motion?.matches
      ? state.phase === "won"
        ? "本层已点亮"
        : "点亮本层"
      : state.playing
        ? "暂停推演"
        : state.phase === "finished"
          ? "重新推演"
          : state.phase === "ready"
            ? "开始推演"
            : "继续推演";
    const message =
      state.phase === "finished"
        ? state.completed.length === GROWTH_STAGES.length
          ? "六层知识体系已全部点亮，保持空杯心态持续迭代。"
          : "本段推演完成，可点击任意层级查看核心知识点。"
        : state.phase === "won"
          ? stage.ongoing
            ? "迈向 Agent 自进化与 AI Infra 深水区，持续精进。"
            : `本层点亮：${stage.skills.map((id) => GROWTH_SKILLS[id].name).join(" / ")}`
          : state.phase === "battle"
            ? `正在拆解系统难题：「${stage.boss}」…`
            : `第 ${state.stage + 1} 层 · ${stage.title}`;
    status.textContent = state.playing ? message : `${message}${motion?.matches ? "（减少动态效果模式）" : ""}`;
  }

  const controller = createAdventureController({
    render,
    setTimer: (callback, delay) => win.setTimeout(callback, delay),
    clearTimer: (id) => win.clearTimeout(id),
    now: () => win.Date.now(),
  });
  function interact(action) {
    firstVisit = false;
    controller.dispatch(action);
  }
  play.addEventListener("click", () =>
    interact({ type: motion?.matches ? "light" : controller.getState().playing ? "pause" : "play" })
  );
  next.addEventListener("click", () => interact({ type: "next" }));
  restart.addEventListener("click", () => interact({ type: "restart" }));
  levels.forEach((button) =>
    button.addEventListener("click", () => interact({ type: "select", stage: Number(button.dataset.growthStage) }))
  );
  doc.addEventListener("visibilitychange", () => {
    if (doc.hidden) controller.dispatch({ type: "pause" });
  });
  win.addEventListener("pagehide", () => controller.dispatch({ type: "pause" }));
  motion?.addEventListener?.("change", () => controller.dispatch({ type: "pause" }));
  if (typeof win.IntersectionObserver === "function") {
    const observer = new win.IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting || entry.intersectionRatio < 0.25) controller.dispatch({ type: "pause" });
          else if (firstVisit) {
            firstVisit = false;
            if (!motion?.matches && !doc.hidden) controller.dispatch({ type: "play" });
          }
        });
      },
      { threshold: 0.25 }
    );
    observer.observe(scene);
  }
  doc.getElementById("growth-history").open = false;
  root.hidden = false;
  return controller;
}

if (typeof document !== "undefined") initGrowth(document, window);
if (typeof module !== "undefined")
  module.exports = {
    GROWTH_SKILLS,
    GROWTH_STAGES,
    GROWTH_DELAYS,
    initialAdventure,
    reduceAdventure,
    unlockedSkills,
    createAdventureController,
    initGrowth,
  };
