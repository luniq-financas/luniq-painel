import { useId } from "react";
import { T, CA, MONO, TYPE, RADII } from "./theme";
import { fmt } from "./hooks/useSheets";
import { Tooltip, AreaChart, Area, ResponsiveContainer } from "recharts";

// - Card ----------------------------------------------------------------------
export const Card = ({ children, style={} }) => (
  <div style={{ background:T.card, border:`1px solid ${T.brd}`, borderRadius:RADII.md, boxShadow:T.shadow, overflow:"hidden", ...style }}>
    {children}
  </div>
);

// - KPI card ------------------------------------------------------------------
export const Kpi = ({ label, value, sub, cor, accent, urgent, delta, deltaGood = "up", deltaFormatter = fmt.brlk, deltaLabel, spark }) => {
  const gid = useId().replace(/:/g, "");
  const sc = cor || accent || T.blue;
  const hasSpark = Array.isArray(spark) && spark.length > 1;
  return (
    <div style={{ background: urgent ? "rgba(239,68,68,0.07)" : T.card, border:`1px solid ${urgent ? "rgba(239,68,68,0.35)" : T.brd}`, borderRadius:RADII.md, boxShadow:T.shadow, padding:"16px 18px", position:"relative", overflow:"hidden" }}>
      <div style={{ position:"absolute", top:0, left:0, right:0, height:3, background: accent || cor || T.blue }} />
      <div style={{ ...TYPE.kpiLabel, color:T.muted, marginBottom:6 }}>{label}</div>
      <div style={{ ...TYPE.kpiValue, color: cor || T.txt }}>{value}</div>
      {(typeof delta === "number" || deltaLabel) && (
        <div style={{ ...TYPE.caption, marginTop:5, display:"flex", alignItems:"baseline", gap:6, flexWrap:"wrap" }}>
          {typeof delta === "number" && (
            <span style={{ color:(deltaGood === "down" ? delta <= 0 : delta >= 0) ? T.grn : T.red, fontFamily:MONO, fontWeight:600 }}>
              {delta >= 0 ? "▲ " : "▼ "}{deltaFormatter(Math.abs(delta))}
            </span>
          )}
          {deltaLabel && <span style={{ color:T.dim }}>{deltaLabel}</span>}
        </div>
      )}
      {sub && <div style={{ ...TYPE.caption, color:T.muted, marginTop:4 }}>{sub}</div>}
      {hasSpark && (
        <div style={{ marginTop:10, marginLeft:-18, marginRight:-18, marginBottom:-16 }}>
          <ResponsiveContainer width="100%" height={38}>
            <AreaChart data={spark.map((v, i) => ({ i, v }))} margin={{ top:2, right:0, bottom:0, left:0 }}>
              <defs>
                <linearGradient id={`sp${gid}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={sc} stopOpacity={0.3} />
                  <stop offset="100%" stopColor={sc} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="v" stroke={sc} strokeWidth={1.75} fill={`url(#sp${gid})`} dot={false} isAnimationActive={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

// - Badge ---------------------------------------------------------------------
export const Badge = ({ children, color }) => {
  const map = { grn:"rgba(34,197,94,.13)", red:"rgba(239,68,68,.13)", amb:"rgba(245,158,11,.13)", blue:"rgba(245,158,11,.14)" };
  const tc  = { grn:"#4ade80", red:"#f87171", amb:"#f59e0b", blue:"#fbbf24" };
  const bg  = map[color] || map.blue;
  const c   = tc[color]  || tc.blue;
  return <span style={{ display:"inline-block", padding:"2px 8px", borderRadius:RADII.sm, ...TYPE.badge, background:bg, color:c }}>{children}</span>;
};

// - Section title -------------------------------------------------------------
export const Sec = ({ title, badge, live, children }) => (
  <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
      <span style={{ ...TYPE.sectionLabel, color:T.muted }}>{title}</span>
      <div style={{ display:"flex", gap:8, alignItems:"center" }}>
        {badge && <span style={{ fontSize:10, color:T.dim }}>{badge}</span>}
        {live  && <span style={{ fontSize:10, color:T.grn, fontWeight:600 }}>ao vivo</span>}
      </div>
    </div>
    {children}
  </div>
);

// - Period selector -----------------------------------------------------------
const MESES = ["JAN","FEV","MAR","ABR","MAI","JUN","JUL","AGO","SET","OUT","NOV","DEZ"];

export const PeriodBtn = ({ label, ativo, onClick, dim }) => (
  <button onClick={onClick} style={{ padding:"4px 11px", borderRadius:RADII.sm, border:`1px solid ${ativo ? T.blue : T.brd}`, background: ativo ? "rgba(245,158,11,0.15)" : "transparent", color: ativo ? T.blue2 : T.muted, fontSize:11, fontWeight: ativo ? 700 : 400, cursor:"pointer", whiteSpace:"nowrap", opacity: dim ? 0.35 : 1, fontFamily:"inherit", letterSpacing:".06em", transition:"all 0.1s" }}>
  {label}
  </button>
);

export const PeriodSelector = ({ filtro, setFiltro, mesesRealizados=[] }) => (
  <Card style={{ padding:"9px 13px" }}>
    <div style={{ display:"flex", alignItems:"center", gap:4, flexWrap:"wrap" }}>
      <span style={{ fontSize:9, fontWeight:600, color:T.dim, textTransform:"uppercase", letterSpacing:"0", marginRight:4 }}>Período</span>
      {["YTD","ANO"].map(f => <PeriodBtn key={f} label={f} ativo={filtro===f} onClick={()=>setFiltro(f)} />)}
      <div style={{ width:1, height:14, background:T.brd, margin:"0 2px" }} />
      {["T1","T2","T3","T4"].map(f => <PeriodBtn key={f} label={f} ativo={filtro===f} onClick={()=>setFiltro(f)} />)}
      <div style={{ width:1, height:14, background:T.brd, margin:"0 2px" }} />
      {MESES.map(m => <PeriodBtn key={m} label={m} ativo={filtro===m} onClick={()=>setFiltro(m)} dim={mesesRealizados.length>0 && !mesesRealizados.includes(m)} />)}
    </div>
  </Card>
);

// - Tab selector --------------------------------------------------------------
export const TabBar = ({ tabs, ativo, onChange }) => (
  <div style={{ display:"flex", borderBottom:`1px solid ${T.brd}`, background:T.surf }}>
    {tabs.map(t => (
      <button key={t} onClick={()=>onChange(t)}
        style={{ padding:"9px 18px", background:"transparent", border:"none", borderBottom:`2px solid ${ativo===t ? T.blue : "transparent"}`, color: ativo===t ? T.blue2 : T.muted, fontSize:12, fontWeight: ativo===t ? 700 : 400, cursor:"pointer", whiteSpace:"nowrap", fontFamily:"inherit", transition:"all 0.12s" }}>
        {t}
      </button>
    ))}
  </div>
);

// - Recharts tooltip - BRL values ---------------------------------------------
export const TipBRL = ({ active, payload, label, formatter = fmt.brl }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background:T.surf, border:`1px solid ${T.brd2}`, borderRadius:RADII.sm, padding:"10px 14px", fontSize:11, boxShadow: T.mode === "light" ? "0 8px 24px rgba(0,0,0,0.12)" : "0 8px 24px rgba(0,0,0,0.5)" }}>
      <div style={{ ...TYPE.sectionLabel, color:T.sub, marginBottom:6 }}>{label}</div>
      {payload.map((p,i) => (
        <div key={i} style={{ display:"flex", justifyContent:"space-between", gap:18, margin:"2px 0" }}>
          <span style={{ color:T.muted }}>{p.name}</span>
          <span style={{ fontFamily:MONO, color:p.color||T.txt }}>{formatter(p.value)}</span>
        </div>
      ))}
    </div>
  );
};

// - Recharts tooltip - percentage values --------------------------------------
export const TipPct = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background:T.surf, border:`1px solid ${T.brd2}`, borderRadius:RADII.sm, padding:"10px 14px", fontSize:11, boxShadow: T.mode === "light" ? "0 8px 24px rgba(0,0,0,0.12)" : "0 8px 24px rgba(0,0,0,0.5)" }}>
      <div style={{ ...TYPE.sectionLabel, color:T.sub, marginBottom:6 }}>{label}</div>
      {payload.map((p,i) => (
        <div key={i} style={{ display:"flex", justifyContent:"space-between", gap:18, margin:"2px 0" }}>
          <span style={{ color:T.muted }}>{p.name}</span>
          <span style={{ fontFamily:MONO, color:p.color||T.txt }}>{typeof p.value==="number" ? p.value.toFixed(1)+"%" : p.value}</span>
        </div>
      ))}
    </div>
  );
};

// - Table ---------------------------------------------------------------------
export const Table = ({ headers, rows, footer, emptyMsg="Sem dados", scrollMax, compact }) => {
  const pad  = compact ? "4px 9px" : "8px 13px";
  const padH = compact ? "6px 9px" : "9px 13px";
  const fs   = compact ? 11 : 12;
  const hasWidths = headers.some(h => typeof h === "object" && h?.width);
  return (
  <Card style={{ overflow:"hidden" }}>
    <div style={{ overflowX:"auto", maxHeight: scrollMax || undefined }}>
      <table style={{ width:"100%", borderCollapse:"collapse", minWidth: headers.length * (compact ? 70 : 100), tableLayout: hasWidths ? "fixed" : undefined }}>
        {hasWidths && (
          <colgroup>
            {headers.map((h, i) => (
              <col key={i} style={{ width: (typeof h === "object" && h?.width) || undefined }} />
            ))}
          </colgroup>
        )}
        <thead>
          <tr style={{ background:T.surf, borderBottom:`1px solid ${T.brd}`, position: scrollMax ? "sticky" : undefined, top: scrollMax ? 0 : undefined, zIndex: scrollMax ? 1 : undefined }}>
            {headers.map((h,i) => (
              <th key={i} style={{ ...TYPE.tableHeader, textAlign: h.right ? "right" : "left", padding:padH, color:T.muted, whiteSpace:"nowrap" }}>{h.label || h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0
            ? <tr><td colSpan={headers.length} style={{ padding:24, textAlign:"center", color:T.dim, fontSize:12 }}>{emptyMsg}</td></tr>
            : rows.map((row, i) => (
              <tr key={i} className="ui-table-row" style={{ borderBottom: i === rows.length - 1 ? "none" : `1px solid ${T.line}` }}>
                {row.map((cell, j) => {
                  const hdr = headers[j];
                  const isRight = hdr?.right || (typeof hdr === "object" && hdr.right);
                  const isMono  = hdr?.mono  || (typeof cell === "number");
                  const hasRender = !!hdr?.render;
                  const cellColor = hdr?.color ? hdr.color(cell) : (typeof cell === "number" && cell < 0 ? T.red : T.txt);
                  return (
                    <td key={j} style={{ textAlign:isRight?"right":"left", padding:pad, fontSize:fs, fontFamily: isMono ? MONO : undefined, color: cellColor, whiteSpace: hasRender ? "normal" : "nowrap", maxWidth: (compact && !hasWidths) ? 180 : undefined, overflow: (compact && !hasWidths) ? "hidden" : undefined, textOverflow: (compact && !hasWidths) ? "ellipsis" : undefined }}>
                      {hasRender ? hdr.render(cell) : (typeof cell==="number" ? fmt.brl(cell) : cell)}
                    </td>
                  );
                })}
              </tr>
            ))
          }
        </tbody>
        {footer && (
          <tfoot>
            <tr style={{ borderTop:`1px solid ${T.brd2}`, background:T.surf }}>
              {footer.map((cell, i) => {
                const hdr = headers[i];
                const isRight = hdr?.right;
                const hasRender = !!hdr?.render;
                return (
                  <td key={i} style={{ textAlign: isRight ? "right" : "left", padding:pad, fontSize:fs, fontFamily: MONO, fontWeight:600, color:T.blue2, whiteSpace: hasRender ? "normal" : "nowrap" }}>
                    {hasRender ? hdr.render(cell) : (typeof cell==="number" ? fmt.brl(cell) : cell)}
                  </td>
                );
              })}
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  </Card>
  );
};

// - Live indicator -------------------------------------------------------------
export const LiveBadge = ({ time }) => (
  <div style={{ display:"flex", alignItems:"center", gap:6, fontSize:11, color:T.muted }}>
    <div style={{ width:6, height:6, borderRadius:"50%", background:T.grn, boxShadow:`0 0 5px ${T.grn}` }} />
    Dados ao vivo{time && ` • ${time}`}
  </div>
);

// - Alert bar -----------------------------------------------------------------
export const Alert = ({ children, level="warn" }) => {
  const map = { warn:T.amb, danger:T.red, info:T.blue };
  const c = map[level] || T.amb;
  return (
    <div style={{ background:`rgba(${level==="danger"?"239,68,68":level==="info"?"59,130,246":"245,158,11"},0.08)`, border:`1px solid rgba(${level==="danger"?"239,68,68":level==="info"?"59,130,246":"245,158,11"},0.3)`, borderLeft:`3px solid ${c}`, borderRadius:RADII.md, padding:"11px 15px", display:"flex", alignItems:"center", gap:10 }}>
      <div style={{ width:7, height:7, borderRadius:"50%", background:c, flexShrink:0, animation:"pulse 1.5s infinite" }} />
      <div style={{ fontSize:12, color:T.txt, lineHeight:1.4 }}>{children}</div>
    </div>
  );
};

export default { Card, Kpi, Badge, Sec, PeriodSelector, PeriodBtn, TabBar, TipBRL, TipPct, Table, LiveBadge, Alert };
