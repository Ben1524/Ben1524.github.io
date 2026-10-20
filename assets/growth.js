"use strict";

const GROWTH_SKILLS = {
  cpp: { name: "C++ / Python", icon: "cpp.svg" },
  onnx: { name: "模型量化与 ONNX", icon: "cube.svg" },
  tensorrt: { name: "TensorRT 推理加速", icon: "bolt.svg" },
  triton: { name: "视觉模型服务化部署", icon: "eye.svg" },
  dcgm: { name: "DCGM GPU 遥测", icon: "gpu.svg" },
  prometheus: { name: "Prometheus 监控体系", icon: "radar.svg" },
  rdma: { name: "RDMA / 算力网络监控", icon: "network.svg" },
  xid: { name: "Xid 故障感知与诊断", icon: "shield.svg" },
  linux: { name: "Linux 与容器隔离", icon: "linux.svg" },
  k8s: { name: "Kubernetes 编排", icon: "k8s.svg" },
  operator: { name: "异构算力 Operator", icon: "gear.svg" },
  storage: { name: "分布式存储与镜像加速", icon: "database.svg" },
  embodied: { name: "具身多模态数据管线", icon: "bot.svg" },
  workflow: { name: "分布式训练与工作流", icon: "flame.svg" },
  sim: { name: "仿真评测与数据回流", icon: "gamepad.svg" },
  datalake: { name: "海量传感器数据湖", icon: "database.svg" },
  go: { name: "Go 高并发控制面", icon: "go.svg" },
  scheduler: { name: "K8s Scheduler 调度器", icon: "radar.svg" },
  vk: { name: "Virtual Kubelet 联邦", icon: "cube.svg" },
  sre: { name: "Fail-Closed 韧性架构", icon: "shield.svg" },
  mall: { name: "高并发商城与柔性事务", icon: "redis.svg" },
  agent: { name: "Agent 自进化与记忆", icon: "bot.svg" },
};

const GROWTH_STAGES = [
  {
    title: "图像模型部署",
    land: "第一站 · 视觉推理工坊",
    boss: "端侧算力与延迟瓶颈",
    period: "STAGE 01 · MODEL DEPLOYMENT",
    place: "中国科大先研院 · 实习",
    favoritePlace: "科大先研院",
    description: "从算法模型走向工程落地：负责视觉/图像模型的算子对齐、ONNX/TensorRT 量化编译加速、流水线批处理优化与高吞吐推理服务部署。",
    skills: ["cpp", "onnx", "tensorrt", "triton"],
    link: "#note-aiinfra",
  },
  {
    title: "GPU 集群监控",
    land: "第二站 · 算力观测哨所",
    boss: "幽灵掉卡与网络拥塞怪",
    period: "STAGE 02 · GPU CLUSTER OBSERVABILITY",
    place: "基流科技 · 实习",
    favoritePlace: "基流科技",
    description: "深入大规模 GPU 算力集群可观测性：基于 DCGM 采集显存/SM 利用率/NVLink 带宽与 Xid 硬件错误，结合 RDMA 网络指标构建全链路监控告警与故障定位体系。",
    skills: ["dcgm", "prometheus", "rdma", "xid"],
    link: "#note-aiinfra",
  },
  {
    title: "AI-Infra 部署",
    land: "第三站 · 云原生算力堡垒",
    boss: "异构环境与交付迷宫",
    period: "STAGE 03 · AI INFRASTRUCTURE DELIVERY",
    place: "华为南研所 · 实习",
    favoritePlace: "华为南研所",
    description: "打磨云原生 AI 基础设施底座：围绕 Kubernetes 容器编排、异构加速卡 Device Plugin / Operator、容器镜像按需加载与分布式训练环境自动化部署。",
    skills: ["linux", "k8s", "operator", "storage"],
    link: "#note-controller",
  },
  {
    title: "具身智能基建和平台",
    land: "第四站 · 具身智能矩阵",
    boss: "多模态异构数据洪流",
    period: "STAGE 04 · EMBODIED AI PLATFORM",
    place: "Seed-Robotics · 实习",
    favoritePlace: "Seed-Robotics",
    description: "连接物理世界与具身大模型：构建机器人真机/仿真多源数据采集、清洗、标注与回流管道，支撑 VLA 具身模型训练工作流编排与闭环评测平台。",
    skills: ["embodied", "workflow", "sim", "datalake"],
    link: "#note-aiinfra",
  },
  {
    title: "计算平台构建",
    land: "第五站 · 科学计算星海",
    boss: "跨平面海量算力洪峰",
    period: "STAGE 05 · COMPUTE PLATFORM ARCHITECTURE",
    place: "Seed-AI4S · 实习",
    favoritePlace: "Seed-AI4S",
    description: "构建大规模 Serverless GPU 与科学计算平台：深耕 K8s Scheduler Framework 异构配额与拓扑调度、Virtual Kubelet 多集群节点池、双平面解耦与 Fail-Closed 控制面。",
    skills: ["go", "scheduler", "vk", "sre"],
    link: "#note-scheduler",
  },
  {
    title: "高并发业务与 Agent 自进化",
    land: "第六站 · 全景演化边疆",
    boss: "复杂交易与智能体退化",
    period: "STAGE 06 · BIZ ARCH & SELF-EVOLVING AGENT",
    place: "长期知识雷达 · 持续进化",
    favoritePlace: "持续进化",
    description: "横向融通高并发商城交易架构（SPU/SKU、订单状态机、秒杀防超卖、TCC 与对账）与 Agent 自进化体系（在线自愈、Reflexion 记忆演进、Skill 合成与评测门禁）。",
    skills: ["mall", "agent"],
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
    doc.getElementById("growth-loot").textContent = stage.ongoing ? "✧ NEXT FRONTIER!" : "✧ SKILL GET!";
    doc.getElementById("growth-title").textContent = stage.title;
    doc.getElementById("growth-period").textContent = stage.period;
    doc.getElementById("growth-place").textContent = stage.place;
    const favorite = doc.getElementById("growth-favorite");
    favorite.hidden = !stage.favoritePlace;
    favorite.textContent = stage.favoritePlace ? `坐标：${stage.favoritePlace}` : "";
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
        `第 ${index + 1} 关 · ${GROWTH_STAGES[index].title}${favoritePlace ? `，${favoritePlace}` : ""}${state.completed.includes(index) ? "，已点亮" : ""}`
      );
      button.dataset.completed = String(state.completed.includes(index));
    });
    const unlocked = unlockedSkills(state.completed);
    bagItems.forEach((item, id) => {
      item.dataset.unlocked = String(unlocked.has(id));
      item.setAttribute("aria-label", `${GROWTH_SKILLS[id].name}，${unlocked.has(id) ? "已点亮" : "待点亮"}`);
    });
    doc.getElementById("growth-skill-count").textContent = `已点亮 ${unlocked.size} / ${bagItems.size}`;
    doc.getElementById("growth-progress").textContent = `成长回放 ${state.completed.length} / ${GROWTH_STAGES.length}`;
    scene.setAttribute(
      "aria-label",
      `${stage.land}：迎战「${stage.boss}」`
    );
    next.disabled = state.stage === GROWTH_STAGES.length - 1;
    play.disabled = Boolean(motion?.matches && state.phase === "won");
    play.textContent = motion?.matches
      ? state.phase === "won"
        ? "本关已点亮"
        : "点亮本关"
      : state.playing
        ? "暂停冒险"
        : state.phase === "finished"
          ? "再玩一遍"
          : state.phase === "ready"
            ? "开始冒险"
            : "继续冒险";
    const message =
      state.phase === "finished"
        ? state.completed.length === GROWTH_STAGES.length
          ? "五段实习与知识进阶回放完成，下一座高峰仍在探索。"
          : "本段回放完成，可点击任意关卡查看实习历练与技术栈。"
        : state.phase === "won"
          ? stage.ongoing
            ? "融合复杂业务与 Agent 自进化，探索仍在继续。"
            : `本关点亮：${stage.skills.map((id) => GROWTH_SKILLS[id].name).join(" / ")}`
          : state.phase === "battle"
            ? `正在攻克：「${stage.boss}」…`
            : `第 ${state.stage + 1} 关 · ${stage.place} · ${stage.title}`;
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
  doc.getElementById("growth-history").open = true;
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
