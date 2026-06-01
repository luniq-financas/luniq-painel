import { fmt } from "../../hooks/useSheets";
import { CA } from "../../theme";
import { CartesianGrid } from "recharts";

// Eixo padronizado vem do chartTheme (fonte única de verdade dos gráficos).
export { AX } from "../../chartTheme";
export const money = fmt.brl0;
export const GRD = <CartesianGrid strokeDasharray="2 4" stroke={CA.grid} vertical={false} />;
