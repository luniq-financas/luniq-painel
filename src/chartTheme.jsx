/**
 * chartTheme — configuração compartilhada dos gráficos recharts.
 *
 * Centraliza estilo de eixo, grade, raio de barra e rótulos de dados para que
 * todos os gráficos do painel tenham a mesma linguagem visual e rótulos legíveis.
 *
 * Notas de reatividade ao tema:
 *  - `CA.tick` é invariável entre temas (#666), então `AX` pode ser estático.
 *  - `CA.grid` muda com o tema → aplique inline: <CartesianGrid {...GRID} stroke={CA.grid} />
 *  - cores de série (T.grn/T.red/...) também mudam com o tema → mantenha inline nas páginas.
 */
import { CA, TYPE } from "./theme";

// Estilo de tick dos eixos (X/Y). Uso: <XAxis tick={AX} axisLine={false} tickLine={false} />
export const AX = { fill: CA.tick, ...TYPE.axisTick };

// Props padrão do CartesianGrid (linhas horizontais suaves, tracejado discreto).
// stroke deve ser passado inline para acompanhar o tema: <CartesianGrid {...GRID} stroke={CA.grid} />
export const GRID = { strokeDasharray: "2 4", vertical: false };

// Raio padrão de barras — cantos levemente arredondados no topo.
export const BAR_RADIUS = [4, 4, 0, 0];
export const BAR_MAX = 30;

// Estilo base de rótulo de dado em gráfico — legível e consistente (corrige o fontSize:8).
// Uso: label={{ position: "top", ...LBL, fill: cor, formatter }}
export const LBL = { ...TYPE.dataLabel };

// Espessura padrão de linhas/áreas.
export const STROKE_W = 2;

// Formatador compacto para eixos (R$ 50k, R$ 1,5M) — mais limpo que o BRL completo.
export const fmtAxis = (v) => {
  const a = Math.abs(v), s = v < 0 ? "-" : "";
  if (a >= 1e6) return `${s}R$${(a / 1e6).toFixed(a >= 1e7 ? 0 : 1).replace(".", ",")}M`;
  if (a >= 1e3) return `${s}R$${Math.round(a / 1e3)}k`;
  return `${s}R$${Math.round(a)}`;
};

// Defaults de linha/área: curva suave, sem pontos fixos (ponto só no hover).
export const LINE = { type: "monotone", strokeWidth: STROKE_W, dot: false, activeDot: { r: 4 } };
export const AREA = { type: "monotone", strokeWidth: STROKE_W, dot: false, activeDot: { r: 4 } };
