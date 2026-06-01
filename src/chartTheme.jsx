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
