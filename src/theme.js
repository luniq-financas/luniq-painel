const DARK = {
  bg:    "#050505",
  surf:  "#0f0f0f",
  card:  "#161616",
  brd:   "#1e1e1e",
  brd2:  "#2a2a2a",
  txt:   "#ffffff",
  sub:   "#aaaaaa",
  muted: "#666666",
  dim:   "#444444",
  blue:  "#f59e0b",
  blue2: "#fbbf24",
  grn:   "#22c55e",
  red:   "#ef4444",
  amb:   "#f59e0b",
  purp:  "#2fb7c6",
  rec:   "#22c55e",
  desp:  "#ef4444",
  orc:   "#3a3a3a",
  line:  "#1a1a1a",                 // divisor suave (hairline) em tabelas
  hover: "rgba(255,255,255,0.045)", // hover de linha
  shadow: "0 1px 2px rgba(0,0,0,0.35), 0 10px 30px rgba(0,0,0,0.42)", // elevação de card
};

const LIGHT = {
  bg:    "#f0f0ea",   // warm parchment — fundo da página
  surf:  "#fafaf7",   // off-white quente — topbar, sidebar
  card:  "#ffffff",   // branco limpo — cards de conteúdo
  brd:   "#e2e2dc",   // borda quente
  brd2:  "#d0d0ca",   // borda secundária
  txt:   "#0a0a0a",
  sub:   "#333333",   // texto secundário mais definido
  muted: "#606060",   // texto de apoio
  dim:   "#999999",   // ghost / decorativo
  blue:  "#d97706",   // âmbar para texto (contraste em fundo claro)
  blue2: "#d97706",   // âmbar consistente (era #b45309, marrom demais)
  grn:   "#16803c",
  red:   "#dc2626",
  amb:   "#f59e0b",   // âmbar vivo para elementos decorativos
  purp:  "#087f8f",
  rec:   "#16803c",
  desp:  "#dc2626",
  orc:   "#8d8379",
  line:  "#efede8",                 // divisor suave (hairline) em tabelas
  hover: "rgba(10,10,10,0.028)",    // hover de linha
  shadow: "0 1px 2px rgba(16,15,12,0.05), 0 6px 22px rgba(16,15,12,0.08)", // elevação de card
};

const CHARTS = {
  dark: {
    grid: "#1e1e1e",
    tick: "#666666",
    zero: "#333333",
  },
  light: {
    grid: "#e4e4e0",
    tick: "#666666",
    zero: "#999999",
  },
};

export const THEMES = { dark: DARK, light: LIGHT };

// Design tokens - match index.css :root vars
export const T = {
  ...LIGHT,
  mode: "light",
  // helpers
  corV: v => v >= 0 ? T.grn : T.red,
  corDesp: p => p <= 100 ? T.grn : T.red, // desp: bom abaixo do orc
  corRec: p => p >= 80 ? T.grn : T.red, // rec: bom acima do orc
};

// Chart grid / axis
export const CA = { ...CHARTS.dark };

export function applyThemeMode(mode) {
  const nextMode = mode === "light" ? "light" : "dark";
  Object.assign(T, THEMES[nextMode], { mode: nextMode });
  Object.assign(CA, CHARTS[nextMode]);

  if (typeof document !== "undefined") {
    const root = document.documentElement;
    root.dataset.theme = nextMode;
    Object.entries(THEMES[nextMode]).forEach(([key, value]) => {
      root.style.setProperty(`--${key}`, value);
    });
    Object.entries(CHARTS[nextMode]).forEach(([key, value]) => {
      root.style.setProperty(`--chart-${key}`, value);
    });
  }

  return nextMode;
}

export function getInitialThemeMode() {
  if (typeof window === "undefined") return "light";
  const saved = window.localStorage.getItem("painel-theme");
  return saved === "dark" ? "dark" : "light"; // light como padrão
}

// Shared font — DM Mono for data labels and numeric values
export const MONO = "'DM Mono', monospace";

// ─── Escala tipográfica ──────────────────────────────────────────────────────
// Papéis semânticos por tipo de dado. Texto herda a fonte do painel; papéis
// numéricos fixam MONO. Aplicar via spread: style={{ ...TYPE.kpiValue }}.
// Para recharts (SVG), usar só fontSize/fontWeight/fontFamily (sem textTransform).
export const TYPE = {
  display:      { fontSize: 21, fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1.15 },
  sectionTitle: { fontSize: 13, fontWeight: 700, letterSpacing: "-0.01em", lineHeight: 1.3 },
  sectionLabel: { fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", lineHeight: 1.4 },
  kpiValue:     { fontSize: 23, fontWeight: 600, letterSpacing: "-0.02em", lineHeight: 1.08, fontFamily: MONO },
  kpiLabel:     { fontSize: 10, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", lineHeight: 1.35 },
  tableHeader:  { fontSize: 10, fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase", lineHeight: 1.3 },
  tableCell:    { fontSize: 12, fontWeight: 400, lineHeight: 1.45 },
  tableMono:    { fontSize: 12, fontWeight: 500, lineHeight: 1.45, fontFamily: MONO },
  axisTick:     { fontSize: 11, fontWeight: 500, fontFamily: MONO },
  dataLabel:    { fontSize: 11, fontWeight: 600, fontFamily: MONO },
  badge:        { fontSize: 9,  fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase", lineHeight: 1.3 },
  body:         { fontSize: 13, fontWeight: 400, lineHeight: 1.55 },
  caption:      { fontSize: 10, fontWeight: 400, letterSpacing: "0.02em", lineHeight: 1.4 },
};

// Raios padronizados
export const RADII = { sm: 6, md: 10, lg: 14, pill: 999 };
