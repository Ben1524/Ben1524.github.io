"use strict";

function preferredTheme(storage, systemDark) {
  try {
    const saved = storage.getItem("ben1524-theme");
    if (saved === "dark" || saved === "light") return saved;
  } catch {
    // Theme switching also works when browser storage is unavailable.
  }
  return systemDark ? "dark" : "light";
}

function matchesCategory(category, filter) {
  return filter === "all" || category === filter;
}

function initSite(doc, win) {
  const themeButton = doc.querySelector(".theme-toggle");
  const systemTheme = typeof win.matchMedia === "function" ? win.matchMedia("(prefers-color-scheme: dark)") : null;
  const systemDark = systemTheme ? systemTheme.matches : false;
  let storage;
  try {
    storage = win.localStorage;
  } catch {
    storage = { getItem: () => null, setItem: () => {} };
  }
  let userSelectedTheme = false;
  try {
    userSelectedTheme = ["light", "dark"].includes(storage.getItem("ben1524-theme"));
  } catch {
    // With no saved preference, follow the system until a theme is selected.
  }
  function applyTheme(theme) {
    doc.documentElement.dataset.theme = theme;
    if (themeButton) {
      themeButton.setAttribute("aria-pressed", String(theme === "dark"));
      themeButton.setAttribute("aria-label", theme === "dark" ? "切换到浅色主题" : "切换到深色主题");
    }
    const metaTheme = doc.querySelector('meta[name="theme-color"]');
    if (metaTheme) metaTheme.content = theme === "dark" ? "#171c1a" : "#f6f5f0";
  }
  applyTheme(preferredTheme(storage, systemDark));
  if (systemTheme && typeof systemTheme.addEventListener === "function") {
    systemTheme.addEventListener("change", (event) => {
      if (!userSelectedTheme) applyTheme(event.matches ? "dark" : "light");
    });
  }
  if (themeButton) {
    themeButton.hidden = false;
    themeButton.addEventListener("click", () => {
      userSelectedTheme = true;
      const theme = doc.documentElement.dataset.theme === "dark" ? "light" : "dark";
      applyTheme(theme);
      try {
        storage.setItem("ben1524-theme", theme);
      } catch {
        // Keep the selected theme for this visit even if it cannot be saved.
      }
    });
  }

  // Scroll Progress Bar
  const progressBar = doc.querySelector(".scroll-progress-bar");
  if (progressBar && typeof win.addEventListener === "function") {
    const updateScroll = () => {
      const docEl = doc.documentElement;
      const scrollTop = win.scrollY || docEl.scrollTop || 0;
      const maxScroll = Math.max(1, docEl.scrollHeight - docEl.clientHeight);
      const ratio = Math.min(100, Math.max(0, (scrollTop / maxScroll) * 100));
      progressBar.style.width = `${ratio.toFixed(1)}%`;
    };
    win.addEventListener("scroll", updateScroll, { passive: true });
    updateScroll();
  }

  // Hero Multi-View Switcher (Topology / Radar / Terminal)
  const heroTabs = Array.from(doc.querySelectorAll("[data-hero-view]"));
  const heroPanels = Array.from(doc.querySelectorAll("[data-hero-panel]"));
  if (heroTabs.length > 0 && heroPanels.length > 0) {
    heroTabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        const target = tab.dataset.heroView;
        heroTabs.forEach((t) => t.setAttribute("aria-pressed", String(t === tab)));
        heroPanels.forEach((panel) => {
          panel.hidden = panel.dataset.heroPanel !== target;
        });
      });
    });
  }

  // Interactive Architecture Blueprints Workbench
  const bpTabs = Array.from(doc.querySelectorAll("[data-bp-tab]"));
  const bpPanels = Array.from(doc.querySelectorAll("[data-bp-panel]"));
  if (bpTabs.length > 0 && bpPanels.length > 0) {
    bpTabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        const target = tab.dataset.bpTab;
        bpTabs.forEach((t) => t.setAttribute("aria-selected", String(t === tab)));
        bpPanels.forEach((panel) => {
          panel.hidden = panel.dataset.bpPanel !== target;
        });
      });
    });
  }

  // Notes Expand / Collapse All
  const expandAll = doc.getElementById("notes-expand-all");
  const collapseAll = doc.getElementById("notes-collapse-all");
  const noteCards = Array.from(doc.querySelectorAll(".note-card"));
  if (expandAll && collapseAll && noteCards.length > 0) {
    expandAll.addEventListener("click", () => {
      noteCards.forEach((card) => {
        card.open = true;
      });
    });
    collapseAll.addEventListener("click", () => {
      noteCards.forEach((card) => {
        card.open = false;
      });
    });
  }

  // Auto-open target <details> when jumping to #note-* anchor links
  doc.querySelectorAll('a[href^="#note-"]').forEach((anchor) => {
    anchor.addEventListener("click", () => {
      const targetId = anchor.getAttribute("href").slice(1);
      const targetEl = doc.getElementById(targetId);
      if (targetEl && targetEl.tagName === "DETAILS") {
        targetEl.open = true;
      }
    });
  });

  // Project / Topic Filters
  const filters = doc.querySelector(".filters");
  if (!filters) return;
  const buttons = Array.from(filters.querySelectorAll("button"));
  const projects = Array.from(doc.querySelectorAll(".project-card"));
  filters.hidden = false;
  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter;
      buttons.forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
      let visibleCount = 0;
      projects.forEach((project) => {
        const visible = matchesCategory(project.dataset.category, filter);
        project.hidden = !visible;
        if (visible) visibleCount += 1;
      });
      const status = doc.getElementById("project-status");
      if (status) {
        status.textContent = `已显示 ${visibleCount} 个${filter === "all" ? "" : button.textContent}课题`;
      }
    });
  });
}

if (typeof document !== "undefined") initSite(document, window);
if (typeof module !== "undefined") module.exports = { preferredTheme, matchesCategory, initSite };
