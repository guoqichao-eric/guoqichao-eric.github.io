/* 图表引擎：framework 图例 SVG 渲染（源自框架库静态页） */

const CHART_PALETTE = ["#1a3a5c", "#2e577f", "#4a7ba6", "#7d94ab", "#b3403a", "#8a6d3b", "#3b6e5e", "#5e4a7d", "#a05a2c"];

function chartSampleOf(f) {
  let vc = f.viz_config;
  if (typeof vc === "string") { try { vc = JSON.parse(vc); } catch (e) { vc = null; } }
  return (vc && vc.sample) || null;
}
function chartTypeOf(f) { return f.viz_type || "bar"; }

function svgNum(v, dflt) { const n = parseFloat(v); return isFinite(n) ? n : dflt; }
function svgText(x, y, str, cls, anchor) {
  return `<text x="${x}" y="${y}" text-anchor="${anchor || "middle"}" class="cs-t${cls ? " " + cls : ""}">${esc(String(str))}</text>`;
}
function svgLegend(items, x0, y0) {
  let off = 0;
  return `<g>${items.map(it => {
    const g = `<rect x="${x0 + off}" y="${y0 - 9}" width="12" height="12" rx="2" fill="${it.color}"/>` +
      svgText(x0 + off + 17, y0 + 2, it.name, "cs-legend", "start");
    off += 17 + it.name.length * 12 + 16;
    return g;
  }).join("")}</g>`;
}

/* ===== 数值轴工具 ===== */
function makeScale(vals, min0) {
  const arr = (Array.isArray(vals) ? vals : []).flat(9).filter(v => typeof v === "number" && isFinite(v));
  const mn = min0 ? 0 : Math.min(0, ...arr);
  const mx = Math.max(...arr, 1);
  return { mn, mx, rng: (mx - mn) || 1 };
}
function mapV(v, sc, lo, hi) { return lo + (v - sc.mn) / sc.rng * (hi - lo); }
function polyPath(vals, labels, sc, pad, W, H, lo, hi) {
  return (vals || []).map((v, i) => {
    const x = pad.l + i / Math.max((labels || []).length - 1, 1) * (W - pad.l - pad.r);
    const y = mapV(v, sc, hi, lo);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" ");
}

/* ============================================================
 * 渲染器主分发
 * ============================================================ */
function renderChartSVG(type, sample, W, H) {
  W = W || 420; H = H || 280;
  let inner = "";
  try {
    switch (type) {
      case "bar": inner = drawBars(sample, W, H); break;
      case "line": inner = drawLines(sample, W, H); break;
      case "area": inner = drawArea(sample, W, H); break;
      case "combo": inner = drawCombo(sample, W, H); break;
      case "scurve": inner = drawScurve(sample, W, H); break;
      case "control": inner = drawControl(sample, W, H); break;
      case "burn": inner = drawBurn(sample, W, H); break;
      case "gantt": inner = drawGantt(sample, W, H); break;
      case "waterfall": inner = drawWaterfall(sample, W, H); break;
      case "pie": inner = drawPie(sample, W, H); break;
      case "rose": inner = drawRose(sample, W, H); break;
      case "sankey": inner = drawSankey(sample, W, H); break;
      case "funnel": inner = drawFunnel(sample, W, H); break;
      case "treemap": inner = drawTreemap(sample, W, H); break;
      case "mekko": inner = drawMekko(sample, W, H); break;
      case "histogram": inner = drawBars(sample, W, H); break;
      case "boxplot": inner = drawBoxplot(sample, W, H); break;
      case "scatter": inner = drawScatter(sample, W, H); break;
      case "bubble": inner = drawBubble(sample, W, H); break;
      case "dotmatrix": inner = drawDotmatrix(sample, W, H); break;
      case "heatmap": inner = drawHeatmap(sample, W, H); break;
      case "quadrant": inner = drawQuadrant(sample, W, H); break;
      case "ge": inner = drawGE(sample, W, H); break;
      case "kano": inner = drawKano(sample, W, H); break;
      case "swot": inner = drawSwot(sample, W, H); break;
      case "risk": inner = drawRisk(sample, W, H); break;
      case "ife": inner = drawIfe(sample, W, H); break;
      case "space": inner = drawSpace(sample, W, H); break;
      case "fishbone": inner = drawFishbone(sample, W, H); break;
      case "loop": inner = drawLoop(sample, W, H); break;
      case "tree": inner = drawTree(sample, W, H); break;
      case "flow": inner = drawFlow(sample, W, H); break;
      case "swimlane": inner = drawSwimlane(sample, W, H); break;
      case "network": inner = drawNetwork(sample, W, H); break;
      case "vsm": inner = drawVsm(sample, W, H); break;
      case "sysarch": inner = drawSysarch(sample, W, H); break;
      case "topology": inner = drawTopology(sample, W, H); break;
      case "mindmap": inner = drawMindmap(sample, W, H); break;
      case "pyramid": inner = drawPyramid(sample, W, H); break;
      case "milestone": inner = drawMilestone(sample, W, H); break;
      case "roadmap": inner = drawRoadmap(sample, W, H); break;
      case "kpi": inner = drawKpi(sample, W, H); break;
      case "gauge": inner = drawGauge(sample, W, H); break;
      case "liquid": inner = drawLiquid(sample, W, H); break;
      case "ring": inner = drawRing(sample, W, H); break;
      case "status": inner = drawStatus(sample, W, H); break;
      case "thermo": inner = drawThermo(sample, W, H); break;
      case "geomap": inner = drawGeomap(sample, W, H); break;
      case "flyline": inner = drawFlyline(sample, W, H); break;
      case "wordcloud": inner = drawWordcloud(sample, W, H); break;
      case "ranking": inner = drawRanking(sample, W, H); break;
      case "racing": inner = drawRacing(sample, W, H); break;
      case "sunburst": inner = drawSunburst(sample, W, H); break;
      case "force": inner = drawForce(sample, W, H); break;
      default: inner = drawBars(sample, W, H);
    }
  } catch (e) {
    inner = svgText(W / 2, H / 2, "示例图渲染失败：" + e.message, "cs-err");
  }
  return `<svg class="cs-svg" viewBox="0 0 ${W} ${H}" role="img" preserveAspectRatio="xMidYMid meet"><defs><marker id="csArrow" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6 z" fill="#7d94ab"/></marker></defs>${inner}</svg>`;
}

/* ===== A 比较类 ===== */
function drawBars(s, W, H) {
  // 单系列柱状 / 直方
  const pad = { l: 46, r: 14, t: 22, b: 34 };
  const labels = s.labels || [];
  let values = s.values || [];
  const sc = makeScale(values, true);
  const iw = (W - pad.l - pad.r) / Math.max(labels.length, 1);
  const bw = Math.min(iw * 0.62, 46);
  let bars = "", maxV = Math.max(...values, 1);
  values.forEach((v, i) => {
    const x = pad.l + i * iw + (iw - bw) / 2;
    const h = (v / maxV) * (H - pad.t - pad.b);
    const y = H - pad.b - h;
    bars += `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${bw.toFixed(1)}" height="${Math.max(h, 1).toFixed(1)}" rx="2" fill="${CHART_PALETTE[0]}"/>`;
    bars += svgText(x + bw / 2, y - 6, v, "cs-val");
    bars += svgText(x + bw / 2, H - pad.b + 16, labels[i], "cs-x", "middle");
  });
  return `<line x1="${pad.l}" y1="${H - pad.b}" x2="${W - pad.r}" y2="${H - pad.b}" stroke="#93a3b4" stroke-width="1"/>` +
    svgText(pad.l - 8, pad.t, "数值", "cs-axis", "middle") + bars;
}
function drawRanking(s, W, H) {
  const pad = { l: 46, r: 60, t: 20, b: 20 };
  const labels = s.labels || [], values = s.values || [];
  const maxV = Math.max(...values, 1);
  const bh = (H - pad.t - pad.b) / Math.max(labels.length, 1);
  let out = "";
  values.forEach((v, i) => {
    const y = pad.t + i * bh + 5;
    const w = (v / maxV) * (W - pad.l - pad.r);
    const color = i < 3 ? ["#1a3a5c", "#2e577f", "#4a7ba6"][i] : "#93a3b4";
    out += `<rect x="${pad.l}" y="${y.toFixed(1)}" width="${Math.max(w, 2).toFixed(1)}" height="${(bh - 10).toFixed(1)}" rx="2" fill="${color}"/>`;
    out += svgText(pad.l - 10, y + (bh - 10) / 2 + 4, labels[i], "cs-x", "end");
    out += svgText(pad.l + w + 8, y + (bh - 10) / 2 + 4, v, "cs-val", "start");
  });
  return out;
}
function drawGroupBars(s, W, H) {
  const pad = { l: 46, r: 14, t: 30, b: 34 };
  const labels = s.labels || [], series = s.series || [];
  const allV = series.flatMap(x => x.values || []);
  const sc = makeScale(allV, true);
  const iw = (W - pad.l - pad.r) / Math.max(labels.length, 1);
  const bw = (iw * 0.72) / Math.max(series.length, 1);
  let out = "";
  labels.forEach((lb, i) => {
    series.forEach((sr, j) => {
      const v = (sr.values || [])[i] || 0;
      const x = pad.l + i * iw + (iw - iw * 0.72) / 2 + j * bw;
      const h = mapV(v, sc, 6, H - pad.t - pad.b);
      out += `<rect x="${x.toFixed(1)}" y="${(H - pad.b - h).toFixed(1)}" width="${Math.max(bw - 3, 2).toFixed(1)}" height="${h.toFixed(1)}" rx="2" fill="${CHART_PALETTE[j % CHART_PALETTE.length]}"/>`;
    });
    out += svgText(pad.l + i * iw + iw / 2, H - pad.b + 16, lb, "cs-x");
  });
  out += `<line x1="${pad.l}" y1="${H - pad.b}" x2="${W - pad.r}" y2="${H - pad.b}" stroke="#93a3b4"/>`;
  out += svgLegend(series.map((x, j) => ({ name: x.name, color: CHART_PALETTE[j % CHART_PALETTE.length] })), pad.l, 16);
  return out;
}
function drawStackBars(s, W, H) {
  const pad = { l: 46, r: 14, t: 30, b: 34 };
  const labels = s.labels || [], series = s.series || [];
  const iw = (W - pad.l - pad.r) / Math.max(labels.length, 1);
  const bw = Math.min(iw * 0.6, 48);
  let out = "";
  labels.forEach((lb, i) => {
    const x = pad.l + i * iw + (iw - bw) / 2;
    const baseH = H - pad.b;
    let acc = 0;
    const segVals = series.map(sr => (sr.values || [])[i] || 0);
    const total = segVals.reduce((a, b) => a + b, 0) || 1;
    segVals.forEach((v, j) => {
      const h = (s.percent ? v / total : v / (Math.max(...labels.map((_, k) => series.reduce((a, sr) => a + ((sr.values || [])[k] || 0), 0)), 1))) * (H - pad.t - pad.b);
      const hh = s.percent ? v / total * (H - pad.t - pad.b) : v / (Math.max(...labels.map((_, k) => series.reduce((a, sr) => a + ((sr.values || [])[k] || 0), 0)), 1)) * (H - pad.t - pad.b);
      out += `<rect x="${x.toFixed(1)}" y="${(baseH - acc - hh).toFixed(1)}" width="${bw.toFixed(1)}" height="${Math.max(hh, 1).toFixed(1)}" rx="1" fill="${CHART_PALETTE[j % CHART_PALETTE.length]}"/>`;
      acc += hh;
    });
    if (s.percent) out += svgText(x + bw / 2, H - pad.b + 16, lb, "cs-x");
  });
  out += `<line x1="${pad.l}" y1="${H - pad.b}" x2="${W - pad.r}" y2="${H - pad.b}" stroke="#93a3b4"/>`;
  out += svgLegend(series.map((x, j) => ({ name: x.name, color: CHART_PALETTE[j % CHART_PALETTE.length] })), pad.l, 16);
  return out;
}
function drawButterfly(s, W, H) {
  const pad = { l: 60, r: 60, t: 20, b: 34 };
  const labels = s.labels || [], left = s.left || [], right = s.right || [];
  const maxV = Math.max(...left, ...right, 1);
  const bh = (H - pad.t - pad.b) / Math.max(labels.length, 1);
  let out = "";
  labels.forEach((lb, i) => {
    const y = pad.t + i * bh + 5;
    const wl = (left[i] / maxV) * (W / 2 - pad.l - 8);
    const wr = (right[i] / maxV) * (W / 2 - pad.r - 8);
    out += `<rect x="${(W / 2 - wl).toFixed(1)}" y="${y.toFixed(1)}" width="${wl.toFixed(1)}" height="${(bh - 10).toFixed(1)}" rx="2" fill="#2e577f"/>`;
    out += `<rect x="${(W / 2 + 8).toFixed(1)}" y="${y.toFixed(1)}" width="${wr.toFixed(1)}" height="${(bh - 10).toFixed(1)}" rx="2" fill="#b3403a"/>`;
    out += svgText(W / 2, y + (bh - 10) / 2 + 4, lb, "cs-x");
  });
  out += `<line x1="${W / 2}" y1="${pad.t - 6}" x2="${W / 2}" y2="${H - pad.b}" stroke="#93a3b4" stroke-dasharray="4 3"/>`;
  out += svgLegend([{ name: "左组", color: "#2e577f" }, { name: "右组", color: "#b3403a" }], 16, 16);
  return out;
}
function drawPareto(s, W, H) {
  const pad = { l: 46, r: 52, t: 30, b: 34 };
  const labels = s.labels || [], values = s.values || [];
  const total = values.reduce((a, b) => a + b, 0) || 1;
  const maxV = Math.max(...values, 1);
  const iw = (W - pad.l - pad.r) / Math.max(labels.length, 1);
  const bw = Math.min(iw * 0.62, 44);
  let cum = 0, out = "";
  const cumVals = values.map(v => { cum += v; return cum / total * 100; });
  values.forEach((v, i) => {
    const x = pad.l + i * iw + (iw - bw) / 2;
    const h = (v / maxV) * (H - pad.t - pad.b);
    out += `<rect x="${x.toFixed(1)}" y="${(H - pad.b - h).toFixed(1)}" width="${bw.toFixed(1)}" height="${h.toFixed(1)}" rx="2" fill="#7d94ab"/>`;
    out += svgText(x + bw / 2, H - pad.b + 16, labels[i], "cs-x");
  });
  const pts = cumVals.map((cv, i) => {
    const x = pad.l + i * iw + iw / 2;
    const y = mapV(cv, { mn: 0, mx: 100, rng: 100 }, H - pad.b, pad.t);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  out += `<polyline points="${pts.join(" ")}" fill="none" stroke="#b3403a" stroke-width="2"/>`;
  out += `<line x1="${pad.l}" y1="${mapV(80, { mn: 0, mx: 100, rng: 100 }, H - pad.b, pad.t)}" x2="${W - pad.r}" y2="${mapV(80, { mn: 0, mx: 100, rng: 100 }, H - pad.b, pad.t)}" stroke="#b3403a" stroke-dasharray="4 3"/>`;
  out += svgText(W - pad.r + 4, mapV(80, { mn: 0, mx: 100, rng: 100 }, H - pad.b, pad.t), "80%", "cs-axis", "start");
  return out;
}
function drawBullet(s, W, H) {
  const cats = s.categories || [], actual = s.actual || [], target = s.target || [], ranges = s.ranges || [];
  const bh = (H - 50) / Math.max(cats.length, 1);
  let out = "";
  cats.forEach((c, i) => {
    const y = 20 + i * bh + 6;
    const bw = W - 120;
    const seg = bw / 3;
    const colors = ["#d8dee6", "#aebbc9", "#2e577f"];
    let off = 80;
    ranges.forEach((_, k) => {
      const w = (ranges[k] - (k === 0 ? 0 : ranges[k - 1])) / (ranges[ranges.length - 1] || 1) * bw;
      out += `<rect x="${off}" y="${y}" width="${w.toFixed(1)}" height="${(bh - 12).toFixed(1)}" fill="${colors[k]}"/>`;
      off += w;
    });
    const aw = (actual[i] / (ranges[ranges.length - 1] || 1)) * bw;
    out += `<rect x="80" y="${(y + (bh - 12) / 2 - 2).toFixed(1)}" width="${Math.max(aw, 3).toFixed(1)}" height="4" fill="#12293f"/>`;
    const tx = 80 + (target[i] / (ranges[ranges.length - 1] || 1)) * bw;
    out += `<line x1="${tx.toFixed(1)}" y1="${(y - 3).toFixed(1)}" x2="${tx.toFixed(1)}" y2="${(y + bh - 9).toFixed(1)}" stroke="#b3403a" stroke-width="2.5"/>`;
    out += svgText(76, y + (bh - 12) / 2 + 4, c, "cs-x", "end");
  });
  return out;
}
/* ===== B 趋势类 ===== */
function polyPath(vals, labels, sc, pad, H, lo, hi) {
  return vals.map((v, i) => {
    const x = pad.l + i / Math.max(labels.length - 1, 1) * (W - pad.l - pad.r);
    const y = mapV(v, sc, hi, lo);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" ");
}
function drawLines(s, W, H) {
  const pad = { l: 44, r: 16, t: 30, b: 34 };
  const labels = s.labels || [];
  let series = s.series || [{ values: s.values || [] }];
  const allV = series.flatMap(x => x.values || []);
  const sc = makeScale(allV, true);
  let out = "";
  series.forEach((sr, j) => {
    const pts = polyPath(sr.values || [], labels, sc, pad, W, H, H - pad.b, pad.t);
    out += `<polyline points="${pts}" fill="none" stroke="${CHART_PALETTE[j % CHART_PALETTE.length]}" stroke-width="2.2"/>`;
    (sr.values || []).forEach((v, i) => {
      const x = pad.l + i / Math.max(labels.length - 1, 1) * (W - pad.l - pad.r);
      out += `<circle cx="${x.toFixed(1)}" cy="${mapV(v, sc, H - pad.b, pad.t).toFixed(1)}" r="3" fill="#fff" stroke="${CHART_PALETTE[j % CHART_PALETTE.length]}" stroke-width="1.6"/>`;
    });
  });
  labels.forEach((lb, i) => {
    const x = pad.l + i / Math.max(labels.length - 1, 1) * (W - pad.l - pad.r);
    out += svgText(x, H - pad.b + 16, lb, "cs-x");
  });
  out += `<line x1="${pad.l}" y1="${H - pad.b}" x2="${W - pad.r}" y2="${H - pad.b}" stroke="#93a3b4"/>`;
  if (series.length > 1) out += svgLegend(series.map((x, j) => ({ name: x.name, color: CHART_PALETTE[j % CHART_PALETTE.length] })), pad.l, 16);
  return out;
}
function drawArea(s, W, H) {
  const pad = { l: 44, r: 16, t: 30, b: 34 };
  const labels = s.labels || [], values = s.values || [];
  const sc = makeScale(values, true);
  const pts = polyPath(values, labels, sc, pad, W, H, H - pad.b, pad.t);
  const base = `${pad.l},${H - pad.b} ${pts} ${W - pad.r},${H - pad.b}`;
  return `<polygon points="${base}" fill="#2e577f" opacity="0.22"/>` +
    `<polyline points="${pts}" fill="none" stroke="#1a3a5c" stroke-width="2.4"/>` +
    labels.map((lb, i) => {
      const x = pad.l + i / Math.max(labels.length - 1, 1) * (W - pad.l - pad.r);
      return svgText(x, H - pad.b + 16, lb, "cs-x");
    }).join("") + `<line x1="${pad.l}" y1="${H - pad.b}" x2="${W - pad.r}" y2="${H - pad.b}" stroke="#93a3b4"/>`;
}
function drawCombo(s, W, H) {
  const pad = { l: 44, r: 52, t: 30, b: 34 };
  const labels = s.labels || [], bars = s.bars || [], line = s.line || [];
  const scB = makeScale(bars, true), scL = makeScale(line, true);
  const iw = (W - pad.l - pad.r) / Math.max(labels.length, 1);
  const bw = Math.min(iw * 0.5, 36);
  let out = "";
  bars.forEach((v, i) => {
    const x = pad.l + i * iw + (iw - bw) / 2;
    const h = mapV(v, scB, 6, H - pad.t - pad.b);
    out += `<rect x="${x.toFixed(1)}" y="${(H - pad.b - h).toFixed(1)}" width="${bw.toFixed(1)}" height="${h.toFixed(1)}" rx="2" fill="#7d94ab"/>`;
    out += svgText(x + bw / 2, H - pad.b + 16, labels[i], "cs-x");
  });
  const pts = line.map((v, i) => {
    const x = pad.l + i * iw + iw / 2;
    return `${x.toFixed(1)},${mapV(v, scL, H - pad.b, pad.t).toFixed(1)}`;
  }).join(" ");
  out += `<polyline points="${pts}" fill="none" stroke="#b3403a" stroke-width="2.4"/>`;
  line.forEach((v, i) => {
    const x = pad.l + i * iw + iw / 2;
    out += `<circle cx="${x.toFixed(1)}" cy="${mapV(v, scL, H - pad.b, pad.t).toFixed(1)}" r="3.4" fill="#fff" stroke="#b3403a" stroke-width="1.8"/>`;
  });
  out += `<line x1="${pad.l}" y1="${H - pad.b}" x2="${W - pad.r}" y2="${H - pad.b}" stroke="#93a3b4"/>`;
  out += svgLegend([{ name: "柱（左轴）", color: "#7d94ab" }, { name: "线（右轴）", color: "#b3403a" }], pad.l, 16);
  return out;
}
function drawScurve(s, W, H) {
  const pad = { l: 44, r: 16, t: 30, b: 34 };
  const labels = s.labels || [];
  const sc = makeScale([...(s.plan || []), ...(s.actual || [])], true);
  const path = (arr, color, dash) => {
    const pts = arr.map((v, i) => {
      const x = pad.l + i / Math.max(labels.length - 1, 1) * (W - pad.l - pad.r);
      return `${x.toFixed(1)},${mapV(v, sc, H - pad.b, pad.t).toFixed(1)}`;
    }).join(" ");
    return `<polyline points="${pts}" fill="none" stroke="${color}" stroke-width="2.4" ${dash ? `stroke-dasharray="5 4"` : ""}/>`;
  };
  let out = path(s.plan || [], "#1a3a5c") + path(s.actual || [], "#b3403a");
  labels.forEach((lb, i) => {
    const x = pad.l + i / Math.max(labels.length - 1, 1) * (W - pad.l - pad.r);
    out += svgText(x, H - pad.b + 16, lb, "cs-x");
  });
  out += `<line x1="${pad.l}" y1="${H - pad.b}" x2="${W - pad.r}" y2="${H - pad.b}" stroke="#93a3b4"/>`;
  out += svgLegend([{ name: "计划", color: "#1a3a5c" }, { name: "实际", color: "#b3403a" }], pad.l, 16);
  return out;
}
function drawControl(s, W, H) {
  const pad = { l: 44, r: 16, t: 34, b: 34 };
  const vals = s.values || [];
  const mean = svgNum(s.mean, 52), ucl = svgNum(s.ucl, 57), lcl = svgNum(s.lcl, 47);
  const sc = { mn: Math.min(lcl - 2, ...vals), mx: Math.max(ucl + 2, ...vals), rng: Math.max(ucl - lcl + 4, 1) };
  const yOf = v => mapV(v, sc, H - pad.b, pad.t);
  let out = "";
  [ucl, mean, lcl].forEach((v, i) => {
    const y = yOf(v);
    const dash = i === 1 ? "" : `stroke-dasharray="6 4"`;
    out += `<line x1="${pad.l}" y1="${y.toFixed(1)}" x2="${W - pad.r}" y2="${y.toFixed(1)}" stroke="${i === 1 ? "#1a3a5c" : "#b3403a"}" stroke-width="${i === 1 ? 1.8 : 1.2}" ${dash}/>`;
    out += svgText(W - pad.r - 4, y - 5, i === 1 ? "CL" : (i === 0 ? "UCL" : "LCL"), "cs-axis", "end");
  });
  vals.forEach((v, i) => {
    const x = pad.l + i / Math.max(vals.length - 1, 1) * (W - pad.l - pad.r);
    const y = yOf(v);
    const oob = v > ucl || v < lcl;
    out += `<line x1="${x.toFixed(1)}" y1="${yOf(mean).toFixed(1)}" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}" stroke="${oob ? "#b3403a" : "#4a7ba6"}" stroke-width="1.2" opacity="0.6"/>`;
    out += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="3.4" fill="${oob ? "#b3403a" : "#1a3a5c"}"/>`;
  });
  out += `<line x1="${pad.l}" y1="${H - pad.b}" x2="${W - pad.r}" y2="${H - pad.b}" stroke="#93a3b4"/>`;
  return out;
}
function drawBurn(s, W, H) {
  const pad = { l: 44, r: 16, t: 30, b: 34 };
  const days = s.days || [];
  const sc = makeScale([...(s.ideal || []), ...(s.actual || [])], true);
  const path = (arr, color, dash) => arr.map((v, i) => {
    const x = pad.l + i / Math.max(days.length - 1, 1) * (W - pad.l - pad.r);
    return `${x.toFixed(1)},${mapV(v, sc, H - pad.b, pad.t).toFixed(1)}`;
  }).join(" ");
  let out = `<line x1="${pad.l}" y1="${mapV(s.ideal[0], sc, H - pad.b, pad.t)}" x2="${W - pad.r}" y2="${mapV(s.ideal[s.ideal.length - 1], sc, H - pad.b, pad.t)}" stroke="#7d94ab" stroke-width="1.8" stroke-dasharray="6 4"/>`;
  out += `<polyline points="${path(s.actual || [], "#b3403a")}" fill="none" stroke="#b3403a" stroke-width="2.4"/>`;
  days.forEach((lb, i) => {
    const x = pad.l + i / Math.max(days.length - 1, 1) * (W - pad.l - pad.r);
    out += svgText(x, H - pad.b + 16, lb, "cs-x");
  });
  out += `<line x1="${pad.l}" y1="${H - pad.b}" x2="${W - pad.r}" y2="${H - pad.b}" stroke="#93a3b4"/>`;
  out += svgLegend([{ name: "理想燃尽", color: "#7d94ab" }, { name: "实际", color: "#b3403a" }], pad.l, 16);
  return out;
}
function drawGantt(s, W, H) {
  const tasks = s.tasks || [];
  const maxEnd = Math.max(...tasks.map(t => t.start + t.dur), 20);
  const pad = { l: 64, r: 16, t: 20, b: 28 };
  const bh = (H - pad.t - pad.b) / Math.max(tasks.length, 1);
  let out = "";
  for (let i = 0; i <= 4; i++) {
    const x = pad.l + i / 4 * (W - pad.l - pad.r);
    out += `<line x1="${x.toFixed(1)}" y1="${pad.t}" x2="${x.toFixed(1)}" y2="${H - pad.b}" stroke="#e4e9ee" stroke-width="1"/>`;
    out += svgText(x, H - pad.b + 14, Math.round(i / 4 * maxEnd), "cs-axis");
  }
  tasks.forEach((t, i) => {
    const y = pad.t + i * bh + bh / 2;
    const x0 = pad.l + t.start / maxEnd * (W - pad.l - pad.r);
    const w = t.dur / maxEnd * (W - pad.l - pad.r);
    out += `<rect x="${x0.toFixed(1)}" y="${(y - 7).toFixed(1)}" width="${Math.max(w, 3).toFixed(1)}" height="14" rx="3" fill="#2e577f"/>`;
    out += svgText(pad.l - 8, y + 4, t.name, "cs-x", "end");
  });
  return out;
}
function drawWaterfall(s, W, H) {
  const labels = s.labels || [], values = s.values || [];
  const pad = { l: 46, r: 14, t: 26, b: 34 };
  const sc = makeScale(values, true);
  const iw = (W - pad.l - pad.r) / Math.max(labels.length, 1);
  const bw = Math.min(iw * 0.6, 44);
  let cum = values[0] || 0, out = "";
  values.forEach((v, i) => {
    const x = pad.l + i * iw + (iw - bw) / 2;
    let y, h;
    if (i === 0 || i === values.length - 1) {
      h = mapV(v, sc, 6, H - pad.t - pad.b);
      y = H - pad.b - h;
      out += `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${bw.toFixed(1)}" height="${h.toFixed(1)}" rx="2" fill="#1a3a5c"/>`;
    } else {
      const prev = cum;
      cum = prev + v;
      const yTop = mapV(Math.max(prev, cum), sc, pad.t, H - pad.b);
      const yBot = mapV(Math.min(prev, cum), sc, pad.t, H - pad.b);
      const col = v >= 0 ? "#2e577f" : "#b3403a";
      out += `<rect x="${x.toFixed(1)}" y="${yTop.toFixed(1)}" width="${bw.toFixed(1)}" height="${Math.max(yBot - yTop, 2).toFixed(1)}" rx="2" fill="${col}"/>`;
      out += svgText(x + bw / 2, yBot + (v >= 0 ? 14 : -6), (v > 0 ? "+" : "") + v, "cs-val", "middle");
    }
    out += svgText(x + bw / 2, H - pad.b + 16, labels[i], "cs-x");
  });
  out += `<line x1="${pad.l}" y1="${H - pad.b}" x2="${W - pad.r}" y2="${H - pad.b}" stroke="#93a3b4"/>`;
  return out;
}
/* ===== C 构成类 ===== */
function pieArcs(values, cx, cy, R, r0) {
  const total = values.reduce((a, b) => a + b, 0) || 1;
  let ang = -Math.PI / 2, out = "";
  values.forEach((v, i) => {
    const sweep = v / total * Math.PI * 2;
    const a1 = ang, a2 = ang + sweep;
    const x1 = cx + R * Math.cos(a1), y1 = cy + R * Math.sin(a1);
    const x2 = cx + R * Math.cos(a2), y2 = cy + R * Math.sin(a2);
    const large = sweep > Math.PI ? 1 : 0;
    const d = r0 ? "" : `<path d="M${cx},${cy} L${x1.toFixed(1)},${y1.toFixed(1)} A${R},${R} 0 ${large} 1 ${x2.toFixed(1)},${y2.toFixed(1)} Z" fill="${CHART_PALETTE[i % CHART_PALETTE.length]}"/>`;
    if (r0) {
      const x0 = cx + r0 * Math.cos(a1), y0 = cy + r0 * Math.sin(a1);
      const x3 = cx + r0 * Math.cos(a2), y3 = cy + r0 * Math.sin(a2);
      out += `<path d="M${x0.toFixed(1)},${y0.toFixed(1)} L${x1.toFixed(1)},${y1.toFixed(1)} A${R},${R} 0 ${large} 1 ${x2.toFixed(1)},${y2.toFixed(1)} L${x3.toFixed(1)},${y3.toFixed(1)} A${r0},${r0} 0 ${large} 0 ${x0.toFixed(1)},${y0.toFixed(1)} Z" fill="${CHART_PALETTE[i % CHART_PALETTE.length]}"/>`;
    }
    out += d;
    const ma = (a1 + a2) / 2;
    const lx = cx + (R + 18) * Math.cos(ma), ly = cy + (R + 18) * Math.sin(ma);
    if (v / total > 0.05) out += svgText(lx, ly + 4, v + "%", "cs-val");
    ang = a2;
  });
  return { g: out, total };
}
function drawPie(s, W, H) {
  const labels = s.labels || [], values = s.values || [];
  const cx = W / 2 - 60, cy = H / 2, R = Math.min(H / 2 - 24, 96);
  const isDonut = s.donut || /圆环/.test(s.name || "");
  const { g } = pieArcs(values, cx, cy, R, isDonut ? R * 0.58 : 0);
  let out = g;
  let lx = W - 70, ly = 40;
  labels.forEach((lb, i) => {
    out += `<rect x="${lx}" y="${ly - 10}" width="12" height="12" rx="2" fill="${CHART_PALETTE[i % CHART_PALETTE.length]}"/>`;
    out += svgText(lx + 18, ly, `${lb}  ${values[i]}%`, "cs-legend", "start");
    ly += 24;
  });
  return out;
}
function drawRose(s, W, H) {
  const labels = s.labels || [], values = s.values || [];
  const cx = W / 2 - 40, cy = H / 2, R = Math.min(H / 2 - 30, 90);
  const total = values.reduce((a, b) => a + b, 0) || 1;
  const maxV = Math.max(...values, 1);
  const sweep = Math.PI * 2 / values.length;
  let out = "";
  values.forEach((v, i) => {
    const a1 = -Math.PI / 2 + i * sweep, a2 = a1 + sweep;
    const r = v / maxV * R;
    const p = (a) => [cx + r * Math.cos(a), cy + r * Math.sin(a)];
    const [x1, y1] = p(a1), [x2, y2] = p(a2);
    const large = sweep > Math.PI ? 1 : 0;
    out += `<path d="M${cx},${cy} L${x1.toFixed(1)},${y1.toFixed(1)} A${r},${r} 0 ${large} 1 ${x2.toFixed(1)},${y2.toFixed(1)} Z" fill="${CHART_PALETTE[i % CHART_PALETTE.length]}" opacity="0.85"/>`;
  });
  out += svgText(W - 40, 30, labels.map((l, i) => `${l}`).join(" · "), "cs-legend");
  return out;
}
function drawSankey(s, W, H) {
  const nodes = s.nodes || [];
  const links = s.links || [];
  const pad = { l: 16, r: 16, t: 20, b: 20 };
  const maxV = Math.max(...links.map(l => l[2]), 1);
  const colX = { first: 40, mid: W / 2, last: W - 40 };
  const yMap = {};
  const nodeYs = [];
  nodes.forEach((n, i) => {
    const col = i === 0 ? "first" : (i === nodes.length - 1 ? "last" : "mid");
    if (!yMap[col]) { yMap[col] = []; }
    yMap[col].push({ name: n, i });
  });
  const colPos = { first: 40, mid: W / 2, last: W - 40 };
  let out = "";
  const nY = {};
  Object.keys(yMap).forEach(col => {
    const arr = yMap[col];
    arr.forEach((item, j) => {
      nY[item.name] = { x: colPos[col], y: pad.t + 24 + j * (H - pad.t - pad.b - 24) / Math.max(arr.length, 1) + 12 };
    });
  });
  links.forEach(lk => {
    const [a, b, v] = lk;
    const pa = nY[a], pb = nY[b];
    if (!pa || !pb) return;
    const w = 4 + v / maxV * 14;
    const off = w / 2;
    const d = `M${pa.x},${pa.y - off} C${(pa.x + pb.x) / 2},${pa.y - off} ${(pa.x + pb.x) / 2},${pb.y - off} ${pb.x},${pb.y - off} L${pb.x},${pb.y + off} C${(pa.x + pb.x) / 2},${pb.y + off} ${(pa.x + pb.x) / 2},${pa.y + off} ${pa.x},${pa.y + off} Z`;
    out += `<path d="${d}" fill="#4a7ba6" opacity="0.55"/>`;
  });
  Object.keys(nY).forEach(name => {
    const p = nY[name];
    out += `<rect x="${p.x - 6}" y="${p.y - 14}" width="12" height="28" rx="3" fill="#1a3a5c"/>`;
    out += svgText(p.x, p.y - 20, name, "cs-legend");
  });
  return out;
}
function drawFunnel(s, W, H) {
  const labels = s.labels || [], values = s.values || [];
  const maxV = Math.max(...values, 1);
  const pad = { l: 70, r: 70, t: 18, b: 18 };
  const stepH = (H - pad.t - pad.b) / Math.max(values.length, 1);
  let out = "";
  values.forEach((v, i) => {
    const w = (v / maxV) * (W - pad.l - pad.r);
    const y = pad.t + i * stepH;
    const rate = i > 0 ? Math.round(v / values[i - 1] * 100) : 100;
    out += `<path d="M${(W - w) / 2},${y} L${(W + w) / 2},${y} L${(W + w) / 2 + (stepH * 0.25)},${y + stepH * 0.92} L${(W - w) / 2 - (stepH * 0.25)},${y + stepH * 0.92} Z" fill="${CHART_PALETTE[i % CHART_PALETTE.length]}" opacity="${0.95 - i * 0.1}"/>`;
    out += svgText(W / 2, y + stepH * 0.55, `${labels[i]} ${v}${i > 0 ? ` (${rate}%)` : ""}`, "cs-val");
  });
  return out;
}
function drawTreemap(s, W, H) {
  const children = s.children || [];
  const total = children.reduce((a, c) => a + (c.value || 0), 0) || 1;
  let x = 8, out = "";
  children.forEach((c, i) => {
    const w = (c.value / total) * (W - 16);
    out += `<rect x="${x.toFixed(1)}" y="8" width="${Math.max(w - 4, 8).toFixed(1)}" height="${H - 52}" rx="4" fill="${CHART_PALETTE[i % CHART_PALETTE.length]}" opacity="0.9"/>`;
    out += svgText(x + (w - 4) / 2, H / 2 - 4, c.name, "cs-val", "middle");
    out += svgText(x + (w - 4) / 2, H / 2 + 14, c.value + "%", "cs-legend", "middle");
    x += w;
  });
  out += svgText(W / 2, H - 16, "面积 = 数值占比（" + s.name + "）", "cs-legend");
  return out;
}
function drawMekko(s, W, H) {
  const labels = s.labels || [], widths = s.widths || [], heights = s.heights || [];
  const totalW = widths.reduce((a, b) => a + b, 0) || 1;
  const pad = { l: 36, r: 16, t: 24, b: 30 };
  let x = pad.l, out = "";
  labels.forEach((lb, i) => {
    const cw = widths[i] / totalW * (W - pad.l - pad.r);
    const segs = heights[i] || [];
    const segTotal = segs.reduce((a, b) => a + b, 0) || 1;
    let y = pad.t;
    segs.forEach((v, j) => {
      const h = v / segTotal * (H - pad.t - pad.b);
      out += `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${Math.max(cw - 3, 4).toFixed(1)}" height="${Math.max(h - 1.5, 2).toFixed(1)}" fill="${CHART_PALETTE[j % CHART_PALETTE.length]}" opacity="${0.5 + j * 0.2}"/>`;
      y += h;
    });
    out += svgText(x + (cw - 3) / 2, H - pad.b + 16, lb, "cs-x");
    x += cw;
  });
  return out;
}
/* ===== D 分布类 ===== */
function drawBoxplot(s, W, H) {
  const labels = s.labels || [];
  const pad = { l: 50, r: 16, t: 30, b: 34 };
  const all = [];
  labels.forEach((_, i) => [s.min, s.q1, s.median, s.q3, s.max].forEach(arr => all.push((arr || [])[i] || 0)));
  const sc = makeScale(all, false);
  const iw = (W - pad.l - pad.r) / Math.max(labels.length, 1);
  const bw = Math.min(iw * 0.5, 52);
  let out = "";
  labels.forEach((lb, i) => {
    const cx = pad.l + i * iw + iw / 2;
    const y = v => mapV(v, sc, H - pad.b, pad.t);
    const ymin = y(s.min[i]), ymax = y(s.max[i]);
    out += `<line x1="${cx}" y1="${ymin.toFixed(1)}" x2="${cx}" y2="${ymax.toFixed(1)}" stroke="#7d94ab" stroke-width="1.6"/>`;
    out += `<rect x="${(cx - bw / 2).toFixed(1)}" y="${y(s.q3[i]).toFixed(1)}" width="${bw.toFixed(1)}" height="${Math.max(y(s.q1[i]) - y(s.q3[i]), 2).toFixed(1)}" rx="2" fill="#c8d4e0" stroke="#1a3a5c" stroke-width="1.4"/>`;
    out += `<line x1="${(cx - bw / 2 - 3).toFixed(1)}" y1="${y(s.median[i]).toFixed(1)}" x2="${(cx + bw / 2 + 3).toFixed(1)}" y2="${y(s.median[i]).toFixed(1)}" stroke="#b3403a" stroke-width="2.2"/>`;
    out += svgText(cx, H - pad.b + 16, lb, "cs-x");
  });
  out += `<line x1="${pad.l}" y1="${H - pad.b}" x2="${W - pad.r}" y2="${H - pad.b}" stroke="#93a3b4"/>`;
  return out;
}
function drawScatter(s, W, H) {
  const pad = { l: 44, r: 16, t: 26, b: 36 };
  const pts = s.points || [];
  const xs = pts.map(p => p[0]), ys = pts.map(p => p[1]);
  const scX = makeScale(xs, true), scY = makeScale(ys, true);
  let out = "";
  pts.forEach(p => {
    const x = mapV(p[0], scX, pad.l, W - pad.r);
    const y = mapV(p[1], scY, H - pad.b, pad.t);
    out += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="4.2" fill="#2e577f" opacity="0.8"/>`;
  });
  // 趋势线
  const n = pts.length;
  const mx = xs.reduce((a, b) => a + b, 0) / n, my = ys.reduce((a, b) => a + b, 0) / n;
  let num = 0, den = 0;
  pts.forEach(p => { num += (p[0] - mx) * (p[1] - my); den += (p[0] - mx) ** 2; });
  const slope = den ? num / den : 0;
  const yAt = x => my + slope * (x - mx);
  const x1 = Math.min(...xs), x2 = Math.max(...xs);
  out += `<line x1="${mapV(x1, scX, pad.l, W - pad.r)}" y1="${mapV(yAt(x1), scY, H - pad.b, pad.t)}" x2="${mapV(x2, scX, pad.l, W - pad.r)}" y2="${mapV(yAt(x2), scY, H - pad.b, pad.t)}" stroke="#b3403a" stroke-width="1.8" stroke-dasharray="5 4"/>`;
  out += svgText(pad.l, H - pad.b + 16, "自变量 X", "cs-x", "start");
  out += svgText(pad.l - 10, pad.t, "Y", "cs-axis");
  return out;
}
function drawBubble(s, W, H) {
  const pad = { l: 44, r: 16, t: 26, b: 36 };
  const bubs = s.bubbles || [];
  const scX = makeScale(bubs.map(b => b.x), true), scY = makeScale(bubs.map(b => b.y), true);
  let out = "";
  bubs.forEach(b => {
    const x = mapV(b.x, scX, pad.l, W - pad.r);
    const y = mapV(b.y, scY, H - pad.b, pad.t);
    const r = (b.r || 8) / 20 * 30;
    out += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r.toFixed(1)}" fill="#2e577f" opacity="0.4" stroke="#1a3a5c" stroke-width="1.4"/>`;
    out += svgText(x, y + 4, b.label, "cs-val");
  });
  out += svgText(W / 2, H - 10, "气泡大小 = 第三维数值", "cs-legend");
  return out;
}
function drawDotmatrix(s, W, H) {
  const labels = s.labels || [], values = s.values || [];
  const pad = { l: 40, r: 16, t: 18, b: 22 };
  const maxV = Math.max(...values, 1);
  const cell = 16, cols = 10;
  let out = "";
  values.forEach((v, i) => {
    const y0 = pad.t + i * ((H - pad.t - pad.b) / Math.max(values.length, 1));
    let cnt = 0;
    const n = Math.round(v / maxV * (cols * 2));
    for (let r = 0; r < 2 && cnt < n; r++) {
      for (let c = 0; c < cols && cnt < n; c++, cnt++) {
        out += `<circle cx="${(pad.l + c * (cell * 0.8) + 5).toFixed(1)}" cy="${(y0 + 6 + r * (cell * 0.72)).toFixed(1)}" r="4" fill="${cnt < n * 0.6 ? "#1a3a5c" : "#aebbc9"}"/>`;
      }
    }
    out += svgText(pad.l - 8, y0 + 12, labels[i], "cs-x", "end");
    out += svgText(pad.l + cols * cell * 0.8 + 8, y0 + 12, v, "cs-val", "start");
  });
  return out;
}
function drawHeatmap(s, W, H) {
  const rows = s.rows || [], cols = s.cols || [], grid = s.grid || [];
  const pad = { l: 52, r: 16, t: 30, b: 22 };
  const cellW = (W - pad.l - pad.r) / Math.max(cols.length, 1);
  const cellH = (H - pad.t - pad.b) / Math.max(rows.length, 1);
  const allV = grid.flat();
  const vmin = Math.min(...allV, 0), vmax = Math.max(...allV, 0.01);
  const colorOf = v => {
    const t = (v - vmin) / (vmax - vmin || 1);
    const r = Math.round(26 + (180 - 26) * t), g = Math.round(58 + (58 - 58) * t), b = Math.round(127 + (92 - 127) * t);
    return `rgb(${Math.round(200 - 100 * t)},${Math.round(215 - 120 * t)},${Math.round(230 - 90 * t)})`;
  };
  let out = "";
  grid.forEach((row, i) => {
    row.forEach((v, j) => {
      const x = pad.l + j * cellW, y = pad.t + i * cellH;
      const t = (v - vmin) / (vmax - vmin || 1);
      out += `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${Math.max(cellW - 2, 3).toFixed(1)}" height="${Math.max(cellH - 2, 3).toFixed(1)}" rx="2" fill="${t > 0.8 ? "#1a3a5c" : t > 0.5 ? "#4a7ba6" : t > 0.25 ? "#aebbc9" : "#e4e9ee"}"/>`;
      out += svgText(x + cellW / 2, y + cellH / 2 + 3, v, "cs-heat");
    });
  });
  rows.forEach((r, i) => out += svgText(pad.l - 8, pad.t + i * cellH + cellH / 2 + 3, r, "cs-x", "end"));
  cols.forEach((c, j) => out += svgText(pad.l + j * cellW + cellW / 2, pad.t - 8, c, "cs-x"));
  return out;
}
function drawQuadrant(s, W, H) {
  const pad = { l: 40, r: 20, t: 24, b: 40 };
  const qs = s.quadrants || ["高/高", "高/低", "低/高", "低/低"];
  const cx = pad.l + (W - pad.l - pad.r) / 2, cy = pad.t + (H - pad.t - pad.b) / 2;
  let out = `<line x1="${cx}" y1="${pad.t}" x2="${cx}" y2="${H - pad.b}" stroke="#93a3b4" stroke-dasharray="4 4"/>` +
    `<line x1="${pad.l}" y1="${cy}" x2="${W - pad.r}" y2="${cy}" stroke="#93a3b4" stroke-dasharray="4 4"/>`;
  const cells = [[qs[0], pad.l, pad.t, cx - pad.l, cy - pad.t], [qs[1], cx, pad.t, W - pad.r - cx, cy - pad.t], [qs[2], pad.l, cy, cx - pad.l, H - pad.b - cy], [qs[3], cx, cy, W - pad.r - cx, H - pad.b - cy]];
  cells.forEach((c, i) => {
    out += `<rect x="${c[1] + 3}" y="${c[2] + 3}" width="${c[3] - 6}" height="${c[4] - 6}" rx="4" fill="${i % 2 ? "#f0f4f8" : "#e4ebf2"}"/>`;
    out += svgText(c[1] + c[3] / 2, c[2] + 20, c[0], "cs-axis");
  });
  (s.points || []).forEach(p => {
    const x = pad.l + p.x / 100 * (W - pad.l - pad.r);
    const y = H - pad.b - p.y / 100 * (H - pad.t - pad.b);
    const r = p.r ? p.r / 20 * 30 : 7;
    out += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r.toFixed(1)}" fill="#b3403a" opacity="0.75" stroke="#fff" stroke-width="1.4"/>`;
    out += svgText(x, y - r - 5, p.label, "cs-val");
  });
  return out;
}
function drawGE(s, W, H) {
  const rows = s.rows || ["高", "中", "低"], cols = s.cols || ["强", "中", "弱"];
  const pad = { l: 30, r: 14, t: 20, b: 34 };
  const cw = (W - pad.l - pad.r) / 3, ch = (H - pad.t - pad.b) / 3;
  const zone = (i, j) => {
    const score = (2 - i) + (2 - j); // 行越高、列越强 → 分数越高
    return score >= 3 ? "#cfe0d8" : score === 2 ? "#e8e4cc" : "#e8d4d0";
  };
  let out = "";
  rows.forEach((r, i) => cols.forEach((c, j) => {
    out += `<rect x="${(pad.l + j * cw + 2).toFixed(1)}" y="${(pad.t + i * ch + 2).toFixed(1)}" width="${(cw - 4).toFixed(1)}" height="${(ch - 4).toFixed(1)}" rx="4" fill="${zone(i, j)}"/>`;
  }));
  rows.forEach((r, i) => out += svgText(pad.l - 8, pad.t + i * ch + ch / 2 + 4, r, "cs-x", "end"));
  cols.forEach((c, j) => out += svgText(pad.l + j * cw + cw / 2, pad.t - 8, c, "cs-x"));
  (s.points || []).forEach(p => {
    const x = pad.l + p.col * cw + cw / 2, y = pad.t + p.row * ch + ch / 2;
    const r = (p.r || 10) / 20 * 26;
    out += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r.toFixed(1)}" fill="#1a3a5c" opacity="0.5" stroke="#12293f" stroke-width="1.4"/>`;
    out += svgText(x, y + 4, p.label, "cs-val");
  });
  return out;
}
function drawKano(s, W, H) {
  const pad = { l: 46, r: 20, t: 24, b: 40 };
  const cx = pad.l, cy = H - pad.b;
  let out = `<line x1="${pad.l}" y1="${H - pad.b}" x2="${W - pad.r}" y2="${H - pad.b}" stroke="#93a3b4"/>` +
    `<line x1="${pad.l}" y1="${pad.t}" x2="${pad.l}" y2="${H - pad.b}" stroke="#93a3b4"/>`;
  // 满意度(纵) vs 实现度(横)，三条示意曲线
  const curves = [
    { pts: [[10, 10], [30, 20], [55, 38], [75, 60], [90, 82]], color: "#1a3a5c", label: "期望型" },
    { pts: [[10, 15], [30, 35], [50, 58], [70, 80], [90, 95]], color: "#b3403a", label: "魅力型" },
    { pts: [[10, 92], [30, 72], [55, 55], [75, 42], [90, 30]], color: "#7d94ab", label: "基本型" }
  ];
  curves.forEach(c => {
    const pts = c.pts.map(p => {
      const x = pad.l + p[0] / 100 * (W - pad.l - pad.r);
      const y = H - pad.b - p[1] / 100 * (H - pad.t - pad.b);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(" ");
    out += `<polyline points="${pts}" fill="none" stroke="${c.color}" stroke-width="2.2"/>`;
  });
  out += svgLegend(curves.map(c => ({ name: c.label, color: c.color })), pad.l, 16);
  out += svgText(W / 2, H - 10, "实现程度 →", "cs-axis");
  out += svgText(pad.l - 10, pad.t + 4, "满意度", "cs-axis");
  return out;
}
function drawSwot(s, W, H) {
  const pad = { l: 16, r: 16, t: 16, b: 16 };
  const cw = (W - pad.l - pad.r) / 2, ch = (H - pad.t - pad.b) / 2;
  const cells = [
    ["S 优势", s.S || [], "#e4ebf2", "#1a3a5c"],
    ["W 劣势", s.W || [], "#f5ecea", "#b3403a"],
    ["O 机会", s.O || [], "#e8efe8", "#3b6e5e"],
    ["T 威胁", s.T || [], "#f0ece4", "#8a6d3b"]
  ];
  let out = "";
  cells.forEach((c, i) => {
    const x = pad.l + (i % 2) * cw, y = pad.t + Math.floor(i / 2) * ch;
    out += `<rect x="${x}" y="${y}" width="${cw - 6}" height="${ch - 6}" rx="6" fill="${c[2]}"/>`;
    out += svgText(x + cw / 2 - 3, y + 24, c[0], "cs-axis");
    (c[1] || []).forEach((item, j) => {
      out += svgText(x + 16, y + 44 + j * 18, "· " + item, "cs-legend", "start");
    });
    out += `<text x="${x + cw / 2 - 3}" y="${y + ch - 12}" text-anchor="middle" class="cs-t cs-strategy" fill="${c[3]}">${["SO 增长型", "WO 扭转型", "ST 多元化", "WT 防御型"][i]}</text>`;
  });
  return out;
}
function drawRisk(s, W, H) {
  const rows = s.rows || ["极高", "高", "中", "低", "极低"], cols = s.cols || ["极低", "低", "中", "高", "极高"];
  const pad = { l: 40, r: 16, t: 24, b: 30 };
  const cw = (W - pad.l - pad.r) / 5, ch = (H - pad.t - pad.b) / 5;
  let out = "";
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 5; j++) {
      const lvl = i + j;
      const col = lvl >= 6 ? "#d8a0a0" : lvl >= 3 ? "#e8dfc0" : "#cfe0d8";
      out += `<rect x="${(pad.l + j * cw + 1).toFixed(1)}" y="${(pad.t + i * ch + 1).toFixed(1)}" width="${(cw - 2).toFixed(1)}" height="${(ch - 2).toFixed(1)}" fill="${col}" rx="2"/>`;
    }
  }
  rows.forEach((r, i) => out += svgText(pad.l - 8, pad.t + i * ch + ch / 2 + 4, r, "cs-x", "end"));
  cols.forEach((c, j) => out += svgText(pad.l + j * cw + cw / 2, pad.t - 8, c, "cs-x"));
  (s.points || []).forEach(p => {
    const x = pad.l + p.col * cw + cw / 2, y = pad.t + p.row * ch + ch / 2;
    out += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="7" fill="#b3403a" stroke="#fff" stroke-width="1.6"/>`;
    out += svgText(x, y - 10, p.label, "cs-val");
  });
  return out;
}
function drawIfe(s, W, H) {
  const items = s.items || [];
  const pad = { l: 16, r: 16, t: 16, b: 16 };
  const rowH = 26, headH = 24;
  const cols = [W * 0.34, W * 0.18, W * 0.18, W * 0.2];
  let out = "";
  ["关键因素", "权重", "评分", "加权分"].forEach((h, i) => {
    const x = pad.l + cols.slice(0, i).reduce((a, b) => a + b, 0);
    out += `<rect x="${x}" y="${pad.t}" width="${cols[i]}" height="${headH}" fill="#1a3a5c"/>`;
    out += svgText(x + cols[i] / 2, pad.t + headH / 2 + 4, h, "cs-heat");
  });
  let tw = 0;
  items.forEach((it, i) => {
    const y = pad.t + headH + i * rowH;
    const vals = [it.name, it.weight, it.score, (it.weight * it.score).toFixed(2)];
    tw += it.weight * it.score;
    vals.forEach((v, j) => {
      const x = pad.l + cols.slice(0, j).reduce((a, b) => a + b, 0);
      out += `<rect x="${x}" y="${y}" width="${cols[j]}" height="${rowH}" fill="${i % 2 ? "#f0f4f8" : "#fff"}"/>`;
      out += svgText(x + cols[j] / 2, y + rowH / 2 + 4, v, "cs-val");
    });
  });
  const by = pad.t + headH + items.length * rowH + 10;
  const bw = (tw / 4) * (W - pad.l - pad.r - 40);
  out += `<rect x="${pad.l + 20}" y="${by}" width="${Math.max(bw, 4)}" height="12" rx="3" fill="#2e577f"/>`;
  out += svgText(pad.l + 20 + Math.max(bw, 4) + 8, by + 10, "总加权 " + tw.toFixed(2), "cs-val", "start");
  return out;
}
function drawSpace(s, W, H) {
  const cx = W / 2, cy = H / 2;
  let out = `<line x1="${cx}" y1="20" x2="${cx}" y2="${H - 20}" stroke="#93a3b4"/>` +
    `<line x1="20" y1="${cy}" x2="${W - 20}" y2="${cy}" stroke="#93a3b4"/>`;
  const fs = svgNum(s.fs, 4), is = svgNum(s.is, 4), ca = svgNum(s.ca, -2), es = svgNum(s.es, -3);
  const scale = Math.min(W / 2 - 40, H / 2 - 40) / 5;
  out += svgText(W / 2, 16, "FS 财务强势", "cs-axis");
  out += svgText(W / 2, H - 6, "ES 环境稳定", "cs-axis");
  out += svgText(12, cy + 4, "CA 竞争优势", "cs-axis", "start");
  out += svgText(W - 6, cy + 4, "IS 产业实力", "cs-axis", "end");
  const px = cx + (is - ca) / 2 * scale, py = cy - (fs - es) / 2 * scale;
  out += `<line x1="${cx}" y1="${cy}" x2="${px.toFixed(1)}" y2="${py.toFixed(1)}" stroke="#b3403a" stroke-width="2.4"/>`;
  out += `<circle cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" r="6" fill="#b3403a"/>`;
  return out;
}
/* ===== F 因果类 ===== */
function drawFishbone(s, W, H) {
  const bones = s.bones || [];
  const problem = s.problem || "问题";
  const cx = W / 2, cy = H / 2;
  let out = `<rect x="${cx + 30}" y="${cy - 24}" width="${W - cx - 44}" height="48" rx="6" fill="#1a3a5c"/>` +
    svgText(cx + 30 + (W - cx - 44) / 2, cy + 4, problem, "cs-heat") +
    `<line x1="${cx - 30}" y1="${cy}" x2="${cx + 30}" y2="${cy}" stroke="#1a3a5c" stroke-width="3"/>`;
  bones.forEach((b, i) => {
    const ang = (i - (bones.length - 1) / 2) * 0.6;
    const len = 70;
    const x2 = cx - 30 - len * Math.cos(ang), y2 = cy - len * Math.sin(ang);
    const bx = x2 - 34 * Math.cos(ang), by = y2 - 34 * Math.sin(ang);
    out += `<line x1="${cx - 30}" y1="${cy}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="#2e577f" stroke-width="2"/>`;
    out += `<line x1="${x2.toFixed(1)}" y1="${y2.toFixed(1)}" x2="${bx.toFixed(1)}" y2="${by.toFixed(1)}" stroke="#4a7ba6" stroke-width="1.6"/>`;
    out += svgText(bx - 6, by + 4, b, "cs-axis", "end");
  });
  out += svgText(W / 2, 20, "人 · 机 · 料 · 法 · 环 · 测", "cs-legend");
  return out;
}
function drawLoop(s, W, H) {
  const nodes = s.nodes || [], links = s.links || [];
  const cx = W / 2, cy = H / 2, R = Math.min(W, H) / 2 - 52;
  const pos = {};
  nodes.forEach((n, i) => {
    const a = i / nodes.length * Math.PI * 2 - Math.PI / 2;
    pos[n] = [cx + R * Math.cos(a), cy + R * Math.sin(a)];
  });
  let out = "";
  links.forEach(lk => {
    const [a, b, pol] = lk;
    const p1 = pos[a], p2 = pos[b];
    if (!p1 || !p2) return;
    const mx = (p1[0] + p2[0]) / 2, my = (p1[1] + p2[1]) / 2;
    out += `<line x1="${p1[0].toFixed(1)}" y1="${p1[1].toFixed(1)}" x2="${p2[0].toFixed(1)}" y2="${p2[1].toFixed(1)}" stroke="#7d94ab" stroke-width="1.8" marker-end="url(#csArrow)"/>`;
    out += svgText(mx, my - 6, pol === "+" ? "＋ 增强" : "－ 平衡", "cs-axis");
  });
  Object.keys(pos).forEach(n => {
    const p = pos[n];
    out += `<circle cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="26" fill="#f0f4f8" stroke="#1a3a5c" stroke-width="1.8"/>`;
    out += svgText(p[0], p[1] + 4, n, "cs-val");
  });
  return out;
}
function drawTree(s, W, H) {
  const root = s.root || "根";
  const children = s.children || [];
  const pad = { l: 30, r: 30, t: 30, b: 20 };
  const depth = 1 + Math.max(0, ...children.map(c => (c.children || []).length ? 1 : 0));
  const nodeW = 64, nodeH = 22;
  const render = (name, x, y, isRoot) => {
    const w = nodeW, h = nodeH;
    return `<rect x="${(x - w / 2).toFixed(1)}" y="${y}" width="${w}" height="${h}" rx="4" fill="${isRoot ? "#1a3a5c" : "#e4ebf2"}" stroke="${isRoot ? "#1a3a5c" : "#7d94ab"}" stroke-width="1.2"/>` +
      svgText(x, y + h / 2 + 4, String(name).slice(0, 7) + (String(name).length > 7 ? "…" : ""), isRoot ? "cs-heat" : "cs-val");
  };
  let out = render(root, W / 2, pad.t, true);
  const cw = (W - pad.l - pad.r) / Math.max(children.length, 1);
  children.forEach((c, i) => {
    const cx = pad.l + i * cw + cw / 2;
    out += `<line x1="${W / 2}" y1="${pad.t + nodeH}" x2="${cx.toFixed(1)}" y2="${pad.t + 52}" stroke="#93a3b4"/>`;
    out += render(c.name, cx, pad.t + 54, false);
    const gc = c.children || [];
    const gcw = (cw - 8) / Math.max(gc.length, 1);
    gc.forEach((g, j) => {
      const gx = cx - cw / 2 + 4 + j * gcw + gcw / 2;
      out += `<line x1="${cx.toFixed(1)}" y1="${pad.t + 54 + nodeH}" x2="${gx.toFixed(1)}" y2="${pad.t + 92}" stroke="#c3ccd6"/>`;
      out += render(g.name, gx, pad.t + 94, false);
    });
  });
  return out;
}
/* ===== G 流程类 ===== */
function drawFlow(s, W, H) {
  const steps = s.steps || [];
  const pad = { l: 16, r: 16, t: 30, b: 20 };
  const boxW = Math.min(92, (W - pad.l - pad.r) / Math.max(steps.length, 1) * 0.62);
  const boxH = 40, gap = (W - pad.l - pad.r - boxW * steps.length) / Math.max(steps.length - 1, 1);
  let out = "";
  steps.forEach((st, i) => {
    const x = pad.l + i * (boxW + gap) + (boxW + gap - boxW) / 2;
    const y = H / 2 - boxH / 2;
    const isDecision = s.decision === i || /[？?]/.test(st);
    if (isDecision) {
      out += `<polygon points="${(x + boxW / 2)},${y} ${x + boxW},${y + boxH / 2} ${x + boxW / 2},${y + boxH} ${x},${y + boxH / 2}" fill="#f5ecea" stroke="#8a6d3b" stroke-width="1.4"/>`;
      out += svgText(x + boxW / 2, y + boxH / 2 + 4, String(st).slice(0, 5), "cs-val");
    } else {
      out += `<rect x="${x}" y="${y}" width="${boxW}" height="${boxH}" rx="6" fill="${i === 0 || i === steps.length - 1 ? "#1a3a5c" : "#e4ebf2"}" stroke="${i === 0 || i === steps.length - 1 ? "#1a3a5c" : "#7d94ab"}" stroke-width="1.2"/>`;
      out += svgText(x + boxW / 2, y + boxH / 2 + 4, String(st).slice(0, 6), i === 0 || i === steps.length - 1 ? "cs-heat" : "cs-val");
    }
    if (i < steps.length - 1) {
      const ax = pad.l + (i + 1) * (boxW + gap) - gap / 2;
      out += `<line x1="${x + boxW}" y1="${H / 2}" x2="${ax - 4}" y2="${H / 2}" stroke="#93a3b4" stroke-width="1.6" marker-end="url(#csArrow)"/>`;
    }
  });
  return out;
}
function drawSwimlane(s, W, H) {
  const lanes = s.lanes || [], steps = s.steps || [];
  const pad = { l: 56, r: 16, t: 16, b: 16 };
  const laneH = (H - pad.t - pad.b) / Math.max(lanes.length, 1);
  const bw = (W - pad.l - pad.r - 20) / Math.max(steps.length, 1);
  let out = "";
  lanes.forEach((l, i) => {
    const y = pad.t + i * laneH;
    out += `<rect x="${pad.l}" y="${y}" width="${W - pad.l - pad.r}" height="${laneH - 2}" fill="${i % 2 ? "#f7f9fb" : "#fff"}"/>`;
    out += `<rect x="${pad.l - 56}" y="${y}" width="56" height="${laneH - 2}" fill="#1a3a5c"/>`;
    out += svgText(pad.l - 28, y + laneH / 2 + 4, l, "cs-heat");
  });
  steps.forEach((st, i) => {
    const [name, lane] = st;
    const y = pad.t + lane * laneH + 8;
    out += `<rect x="${pad.l + 6 + i * bw}" y="${y.toFixed(1)}" width="${Math.max(bw - 12, 18)}" height="${Math.max(laneH - 16, 16)}" rx="4" fill="#c8d4e0" stroke="#2e577f" stroke-width="1.2"/>`;
    out += svgText(pad.l + 6 + i * bw + Math.max(bw - 12, 18) / 2, y + Math.max(laneH - 16, 16) / 2 + 4, String(name).slice(0, 5), "cs-val");
    if (i < steps.length - 1) {
      out += `<line x1="${pad.l + 6 + i * bw + Math.max(bw - 12, 18)}" y1="${y + Math.max(laneH - 16, 16) / 2}" x2="${pad.l + 6 + (i + 1) * bw - 2}" y2="${pad.t + steps[i + 1][1] * laneH + laneH / 2}" stroke="#b3403a" stroke-width="1.4" marker-end="url(#csArrow)"/>`;
    }
  });
  return out;
}
function drawNetwork(s, W, H) {
  const tasks = s.tasks || [], links = s.links || [];
  const pad = { l: 40, r: 40, t: 30, b: 30 };
  const ids = tasks.map(t => t.id);
  const pos = {};
  const n = tasks.length;
  tasks.forEach((t, i) => {
    const angle = i / n * Math.PI * 2 - Math.PI / 2;
    pos[t.id] = [W / 2 + (W / 2 - 50) * Math.cos(angle), H / 2 + (H / 2 - 46) * Math.sin(angle)];
  });
  let out = "";
  links.forEach(lk => {
    const p1 = pos[lk[0]], p2 = pos[lk[1]];
    if (!p1 || !p2) return;
    out += `<line x1="${p1[0].toFixed(1)}" y1="${p1[1].toFixed(1)}" x2="${p2[0].toFixed(1)}" y2="${p2[1].toFixed(1)}" stroke="#7d94ab" stroke-width="1.6" marker-end="url(#csArrow)"/>`;
  });
  tasks.forEach(t => {
    const p = pos[t.id];
    out += `<rect x="${(p[0] - 26).toFixed(1)}" y="${(p[1] - 20).toFixed(1)}" width="52" height="40" rx="5" fill="#f0f4f8" stroke="#1a3a5c" stroke-width="1.5"/>`;
    out += svgText(p[0], p[1] - 2, t.id, "cs-val");
    out += svgText(p[0], p[1] + 14, t.dur + "d", "cs-legend");
  });
  return out;
}
function drawVsm(s, W, H) {
  const steps = s.steps || [];
  const pad = { l: 16, r: 16, t: 26, b: 26 };
  const sw = (W - pad.l - pad.r) / Math.max(steps.length, 1);
  const sh = 36;
  let out = "";
  steps.forEach((st, i) => {
    const x = pad.l + i * sw + 6;
    const y = H / 2 - sh / 2;
    const isWait = (s.waitIdx || []).includes(i);
    if (isWait) {
      out += `<polygon points="${(x + sw / 2)},${y} ${x + sw},${y + sh / 2} ${x + sw / 2},${y + sh} ${x},${y + sh / 2}" fill="#f5ecea" stroke="#8a6d3b" stroke-width="1.4"/>`;
      out += svgText(x + sw / 2, y + sh / 2 + 4, "等待", "cs-val");
    } else {
      out += `<rect x="${x}" y="${y}" width="${sw - 12}" height="${sh}" rx="4" fill="#e4ebf2" stroke="#2e577f" stroke-width="1.3"/>`;
      out += svgText(x + (sw - 12) / 2, y + 16, st.name, "cs-val");
      out += svgText(x + (sw - 12) / 2, y + 30, st.time + "h", "cs-legend");
    }
    if (i < steps.length - 1) out += `<line x1="${x + sw - 12}" y1="${H / 2}" x2="${x + sw - 2}" y2="${H / 2}" stroke="#93a3b4" marker-end="url(#csArrow)"/>`;
  });
  const total = steps.reduce((a, b) => a + b.time, 0);
  const wait = steps.filter((_, i) => (s.waitIdx || []).includes(i)).reduce((a, b) => a + b.time, 0);
  const va = total - wait;
  const vw = (va / total) * (W - pad.l - pad.r - 120);
  out += `<rect x="20" y="${H - 22}" width="${vw}" height="12" rx="3" fill="#3b6e5e"/>`;
  out += svgText(20 + vw + 6, H - 12, `增值 ${va}h / 总 ${total}h`, "cs-legend", "start");
  return out;
}
/* ===== H 结构类 ===== */
function drawSysarch(s, W, H) {
  const layers = s.layers || [];
  const pad = { l: 60, r: 60, t: 20, b: 20 };
  const lh = (H - pad.t - pad.b) / Math.max(layers.length, 1);
  let out = "";
  layers.forEach((ly, i) => {
    const y = pad.t + i * lh + 10;
    out += `<rect x="10" y="${y.toFixed(1)}" width="42" height="${lh - 20}" rx="4" fill="#1a3a5c"/>`;
    out += svgText(31, y + (lh - 20) / 2 + 4, String(ly.name).slice(0, 5), "cs-heat");
    const items = ly.items || [];
    const iw = (W - pad.l - pad.r) / Math.max(items.length, 1);
    items.forEach((it, j) => {
      const x = pad.l + j * iw + 4;
      out += `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${Math.max(iw - 8, 30)}" height="${lh - 20}" rx="4" fill="#e4ebf2" stroke="#2e577f" stroke-width="1.2"/>`;
      out += svgText(x + (iw - 8) / 2, y + (lh - 20) / 2 + 4, String(it).slice(0, 7), "cs-val");
    });
  });
  return out;
}
function drawTopology(s, W, H) {
  const nodes = s.nodes || [], links = s.links || [];
  const pos = {};
  const n = nodes.length;
  nodes.forEach((nd, i) => {
    const angle = i / n * Math.PI * 2 - Math.PI / 2;
    pos[nd] = [W / 2 + (W / 2 - 60) * Math.cos(angle), H / 2 + (H / 2 - 55) * Math.sin(angle)];
  });
  let out = "";
  links.forEach(lk => {
    const p1 = pos[lk[0]], p2 = pos[lk[1]];
    if (!p1 || !p2) return;
    out += `<line x1="${p1[0].toFixed(1)}" y1="${p1[1].toFixed(1)}" x2="${p2[0].toFixed(1)}" y2="${p2[1].toFixed(1)}" stroke="#7d94ab" stroke-width="2"/>`;
  });
  nodes.forEach(nd => {
    const p = pos[nd];
    out += `<circle cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="24" fill="${nd.includes("核心") || nd.includes("防火墙") ? "#1a3a5c" : "#e4ebf2"}" stroke="#2e577f" stroke-width="1.6"/>`;
    out += svgText(p[0], p[1] + 4, String(nd).slice(0, 6), nd.includes("核心") || nd.includes("防火墙") ? "cs-heat" : "cs-val");
  });
  return out;
}
function drawMindmap(s, W, H) {
  const root = s.root || "中心", children = s.children || [];
  const cx = 66, cy = H / 2;
  let out = `<rect x="${cx - 44}" y="${cy - 18}" width="88" height="36" rx="18" fill="#1a3a5c"/>` +
    svgText(cx, cy + 4, String(root).slice(0, 8), "cs-heat");
  const cw = (W - 150) / Math.max(children.length, 1);
  children.forEach((c, i) => {
    const x = 170 + i * cw, y = 20 + i * ((H - 40) / Math.max(children.length - 1, 1));
    out += `<line x1="${cx + 44}" y1="${cy}" x2="${x - 18}" y2="${y}" stroke="#93a3b4" stroke-width="1.4"/>`;
    out += `<rect x="${x - 18}" y="${y - 16}" width="${Math.max(cw - 12, 60)}" height="32" rx="6" fill="${CHART_PALETTE[i % CHART_PALETTE.length]}" opacity="0.9"/>`;
    out += svgText(x - 18 + Math.max(cw - 12, 60) / 2, y + 4, String(c).slice(0, 7), "cs-heat");
  });
  return out;
}
function drawPyramid(s, W, H) {
  const top = s.top || "结论", middle = s.middle || [], bottom = s.bottom || [];
  const pad = { t: 40, b: 26 };
  const layers = [
    { label: top, w: 0.32, h: 40, color: "#12293f" },
    ...middle.map((m, i) => ({ label: m, w: 0.62, h: 34, color: ["#1a3a5c", "#2e577f", "#4a7ba6"][i % 3] })),
    ...bottom.map((b, i) => ({ label: b, w: 0.9, h: 28, color: ["#7d94ab", "#aebbc9", "#c3ccd6"][i % 3] }))
  ];
  let out = "", y = pad.t;
  layers.forEach((ly, i) => {
    const lw = ly.w * W;
    const x = (W - lw) / 2;
    out += `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${lw.toFixed(1)}" height="${ly.h}" rx="4" fill="${ly.color}"/>`;
    out += svgText(W / 2, y + ly.h / 2 + 4, String(ly.label).slice(0, 12), "cs-heat");
    y += ly.h + 6;
  });
  return out;
}
function drawMilestone(s, W, H) {
  const ms = s.milestones || [];
  const pad = { l: 46, r: 30, t: 40, b: 40 };
  const maxT = Math.max(...ms.map(m => m.time), 1);
  let out = `<line x1="${pad.l}" y1="${H / 2}" x2="${W - pad.r}" y2="${H / 2}" stroke="#93a3b4" stroke-width="2"/>`;
  ms.forEach(m => {
    const x = pad.l + m.time / maxT * (W - pad.l - pad.r);
    const lift = ms.indexOf(m) % 2 === 0 ? 26 : 46;
    const y = H / 2 - lift;
    out += `<polygon points="${x.toFixed(1)},${y - 9} ${x + 7},${y} ${x.toFixed(1)},${y + 9} ${x - 7},${y}" fill="#2e577f"/>`;
    out += `<line x1="${x.toFixed(1)}" y1="${H / 2}" x2="${x.toFixed(1)}" y2="${y}" stroke="#2e577f" stroke-dasharray="3 3"/>`;
    out += svgText(x, y - 16, m.name, "cs-val");
    out += svgText(x, H / 2 + 20, "T+" + m.time, "cs-legend");
  });
  return out;
}
function drawRoadmap(s, W, H) {
  const phases = s.phases || [];
  const pad = { l: 16, r: 16, t: 20, b: 20 };
  const pw = (W - pad.l - pad.r) / Math.max(phases.length, 1);
  const laneMax = Math.max(...phases.map(p => (p.items || []).reduce((a, it) => Math.max(a, it.lane || 0), 0)), 0) + 1;
  const lh = (H - pad.t - pad.b) / Math.max(laneMax, 1);
  let out = "";
  phases.forEach((ph, i) => {
    const x = pad.l + i * pw + 4;
    out += svgText(x + (pw - 8) / 2, pad.t + 8, ph.name, "cs-axis");
    (ph.items || []).forEach(it => {
      const y = pad.t + 16 + (it.lane || 0) * lh + 4;
      out += `<rect x="${x}" y="${y.toFixed(1)}" width="${pw - 8}" height="${Math.max(lh - 8, 16)}" rx="4" fill="${CHART_PALETTE[(it.lane || 0) % CHART_PALETTE.length]}" opacity="0.85"/>`;
      out += svgText(x + (pw - 8) / 2, y + Math.max(lh - 8, 16) / 2 + 4, String(it.name).slice(0, 8), "cs-heat");
    });
  });
  return out;
}
/* ===== I 驾驶舱/大屏类 ===== */
function drawKpi(s, W, H) {
  const metrics = s.metrics || [];
  const mw = (W - 40) / Math.max(metrics.length, 1);
  let out = "";
  metrics.forEach((m, i) => {
    const x = 16 + i * mw;
    const up = (m.delta || "").startsWith("+");
    const col = up ? "#3b6e5e" : "#b3403a";
    out += `<rect x="${x}" y="20" width="${mw - 10}" height="${H - 40}" rx="6" fill="#f0f4f8" stroke="#dfe4ea"/>`;
    out += svgText(x + (mw - 10) / 2, 48, m.name, "cs-axis");
    out += svgText(x + (mw - 10) / 2, H / 2 + 10, String(m.value), "cs-big");
    const col2 = up ? "#3b6e5e" : "#b3403a";
    out += `<text x="${x + (mw - 10) / 2}" y="${H - 32}" text-anchor="middle" class="cs-t" font-size="17" font-weight="700" fill="${col2}">${esc(m.delta || "")}</text>`;
  });
  return out;
}
function drawGauge(s, W, H) {
  const value = svgNum(s.value, 72), max = svgNum(s.max, 100);
  const cx = W / 2, cy = H - 40, R = Math.min(W / 2 - 30, H - 70);
  const a0 = Math.PI, a1 = 2 * Math.PI;
  const seg = 100;
  let out = "";
  for (let i = 0; i < seg; i++) {
    const aa = a0 + (a1 - a0) * i / seg;
    const bb = a0 + (a1 - a0) * (i + 1) / seg;
    const r = R - (i % 5 === 0 ? 3 : 0);
    out += `<path d="M${(cx + r * Math.cos(aa)).toFixed(1)},${(cy + r * Math.sin(aa)).toFixed(1)} A${r},${r} 0 0 1 ${(cx + r * Math.cos(bb)).toFixed(1)},${(cy + r * Math.sin(bb)).toFixed(1)}" stroke="${i / seg < value / max ? "#1a3a5c" : "#e4ebf2"}" stroke-width="7" fill="none"/>`;
  }
  const va = a0 + (a1 - a0) * value / max;
  const vx = cx + (R - 24) * Math.cos(va), vy = cy + (R - 24) * Math.sin(va);
  out += `<line x1="${cx}" y1="${cy}" x2="${vx.toFixed(1)}" y2="${vy.toFixed(1)}" stroke="#b3403a" stroke-width="3"/>`;
  out += `<circle cx="${cx}" cy="${cy}" r="8" fill="#b3403a"/>`;
  out += svgText(cx, cy + 16, value + " / " + max, "cs-big");
  out += svgText(cx, cy + 34, s.target ? "目标 " + s.target : "", "cs-legend");
  return out;
}
function drawLiquid(s, W, H) {
  const value = svgNum(s.value, 68);
  const cx = W / 2, cy = H / 2, R = Math.min(W / 2 - 60, H / 2 - 40);
  const waterH = (value / 100) * R * 2;
  const y0 = cy + R - waterH;
  let out = `<circle cx="${cx}" cy="${cy}" r="${R}" fill="#e8f0f6" stroke="#2e577f" stroke-width="2"/>`;
  out += `<path d="M${cx - R},${y0} Q${cx - R / 2},${y0 - 8} ${cx},${y0} T${cx + R},${y0} L${cx + R},${cy + R} L${cx - R},${cy + R} Z" fill="#4a7ba6" opacity="0.7"/>`;
  out += `<circle cx="${cx}" cy="${cy}" r="${R - 3}" fill="none" stroke="#2e577f" stroke-width="2"/>`;
  out += svgText(cx, cy + 6, value + "%", "cs-big");
  out += svgText(cx, cy + 24, s.label || "", "cs-legend");
  return out;
}
function drawRing(s, W, H) {
  const value = svgNum(s.value, 75);
  const cx = W / 2, cy = H / 2, R = Math.min(W / 2 - 80, H / 2 - 44), r0 = R * 0.7;
  const arc = (a, b) => {
    const x1 = cx + R * Math.cos(a), y1 = cy + R * Math.sin(a);
    const x2 = cx + R * Math.cos(b), y2 = cy + R * Math.sin(b);
    return `M${x1.toFixed(1)},${y1.toFixed(1)} A${R},${R} 0 ${b - a > Math.PI ? 1 : 0} 1 ${x2.toFixed(1)},${y2.toFixed(1)}`;
  };
  const a0 = -Math.PI / 2, a1 = a0 + value / 100 * Math.PI * 2;
  return `<circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="#e4ebf2" stroke-width="16"/>` +
    `<path d="${arc(a0, a1)}" stroke="#1a3a5c" stroke-width="16" fill="none" stroke-linecap="round"/>` +
    svgText(cx, cy + 8, value + "%", "cs-big") +
    svgText(cx, cy + 26, s.label || "", "cs-legend");
}
function drawStatus(s, W, H) {
  const items = s.items || [];
  const mw = (W - 30) / Math.max(items.length, 1);
  const colors = { "正常": "#3b6e5e", "警告": "#8a6d3b", "故障": "#b3403a" };
  let out = "";
  items.forEach((it, i) => {
    const x = 15 + i * mw;
    const col = colors[it.state] || "#93a3b4";
    out += `<circle cx="${x + mw / 2}" cy="40" r="14" fill="${col}" opacity="0.2"/>` +
      `<circle cx="${x + mw / 2}" cy="40" r="7" fill="${col}"/>` +
      svgText(x + mw / 2, 80, it.name, "cs-val") +
      svgText(x + mw / 2, 100, it.state, "cs-legend");
  });
  out += svgLegend([{ name: "正常", color: "#3b6e5e" }, { name: "警告", color: "#8a6d3b" }, { name: "故障", color: "#b3403a" }], 20, H - 24);
  return out;
}
function drawThermo(s, W, H) {
  const value = svgNum(s.value, 82), max = svgNum(s.max, 100);
  const cx = W / 2, tubeW = 26;
  const topY = 30, botY = H - 40;
  const h = (value / max) * (botY - topY);
  let out = `<rect x="${(cx - tubeW / 2)}" y="${topY}" width="${tubeW}" height="${botY - topY}" rx="13" fill="#e4ebf2" stroke="#93a3b4"/>`;
  out += `<rect x="${(cx - tubeW / 2)}" y="${(botY - h).toFixed(1)}" width="${tubeW}" height="${h.toFixed(1)}" rx="13" fill="${value > 90 ? "#b3403a" : "#2e577f"}"/>`;
  out += `<circle cx="${cx}" cy="${botY + 8}" r="18" fill="${value > 90 ? "#b3403a" : "#2e577f"}"/>`;
  for (let i = 0; i <= 4; i++) {
    const y = botY - (botY - topY) * i / 4;
    out += `<line x1="${cx + tubeW / 2 + 2}" y1="${y}" x2="${cx + tubeW / 2 + 12}" y2="${y}" stroke="#93a3b4"/>`;
    out += svgText(cx + tubeW / 2 + 16, y + 4, Math.round(max * i / 4), "cs-axis", "start");
  }
  out += svgText(cx, topY - 8, s.label || "", "cs-val");
  return out;
}
function drawGeomap(s, W, H) {
  const regions = s.regions || [];
  const pad = { l: 16, r: 16, t: 20, b: 20 };
  const cols = 3;
  const maxV = Math.max(...regions.map(r => r.value), 1);
  const cw = (W - pad.l - pad.r) / cols;
  const ch = (H - pad.t - pad.b) / Math.ceil(regions.length / cols);
  let out = "";
  regions.forEach((r, i) => {
    const x = pad.l + (i % cols) * cw + 6, y = pad.t + Math.floor(i / cols) * ch + 6;
    const t = r.value / maxV;
    out += `<rect x="${x}" y="${y}" width="${cw - 12}" height="${ch - 12}" rx="6" fill="${t > 0.75 ? "#1a3a5c" : t > 0.5 ? "#2e577f" : t > 0.25 ? "#7d94ab" : "#c3ccd6"}"/>`;
    out += svgText(x + (cw - 12) / 2, y + (ch - 12) / 2 - 4, r.name, "cs-heat");
    out += svgText(x + (cw - 12) / 2, y + (ch - 12) / 2 + 14, r.value, "cs-legend");
  });
  return out;
}
function drawFlyline(s, W, H) {
  const flows = s.flows || [];
  const pts = {};
  const names = [...new Set(flows.flatMap(f => [f[0], f[1]]))];
  const n = names.length;
  const maxV = Math.max(...flows.map(f => f[2]), 1);
  names.forEach((nm, i) => {
    const angle = i / n * Math.PI * 2 - Math.PI / 2;
    pts[nm] = [W / 2 + (W / 2 - 60) * Math.cos(angle), H / 2 + (H / 2 - 55) * Math.sin(angle)];
  });
  let out = "";
  flows.forEach(f => {
    const p1 = pts[f[0]], p2 = pts[f[1]];
    if (!p1 || !p2) return;
    const mx = (p1[0] + p2[0]) / 2, my = Math.min(p1[1], p2[1]) - 30;
    out += `<path d="M${p1[0].toFixed(1)},${p1[1].toFixed(1)} Q${mx.toFixed(1)},${my.toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}" fill="none" stroke="#2e577f" stroke-width="${(1 + f[2] / maxV * 2.5).toFixed(1)}" opacity="0.7"/>`;
  });
  names.forEach(nm => {
    const p = pts[nm];
    out += `<circle cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="22" fill="#1a3a5c"/>`;
    out += svgText(p[0], p[1] + 4, String(nm).slice(0, 4), "cs-heat");
  });
  return out;
}
function drawWordcloud(s, W, H) {
  const words = s.words || [];
  const pad = { l: 20, r: 20, t: 20, b: 20 };
  const maxS = Math.max(...words.map(w => w.size), 1);
  const cols = 3;
  const cw = (W - pad.l - pad.r) / cols;
  const ch = (H - pad.t - pad.b) / Math.ceil(words.length / cols);
  let out = "";
  words.forEach((w, i) => {
    const x = pad.l + (i % cols) * cw, y = pad.t + Math.floor(i / cols) * ch;
    const fs = 12 + w.size / maxS * 26;
    out += `<text x="${(x + cw / 2).toFixed(1)}" y="${(y + ch / 2).toFixed(1)}" text-anchor="middle" class="cs-t cs-word" font-size="${fs.toFixed(1)}" fill="${CHART_PALETTE[i % CHART_PALETTE.length]}">${esc(w.text)}</text>`;
  });
  return out;
}
function drawRacing(s, W, H) {
  const years = s.years || [], labels = s.labels || [], series = s.series || [];
  const pad = { l: 40, r: 16, t: 30, b: 20 };
  const maxV = Math.max(...series.flat(), 1);
  const colW = (W - pad.l - pad.r) / Math.max(years.length, 1);
  const bh = (H - pad.t - pad.b) / Math.max(labels.length, 1);
  let out = "";
  series.forEach((vals, i) => {
    const y = pad.t + i * bh + 4;
    let x = pad.l;
    years.forEach((yr, j) => {
      const w = vals[j] / maxV * (colW - 6);
      out += `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${Math.max(w, 2).toFixed(1)}" height="${Math.max(bh - 8, 6)}" rx="2" fill="${CHART_PALETTE[j % CHART_PALETTE.length]}" opacity="${0.5 + j * 0.17}"/>`;
      x += colW;
    });
    out += svgText(pad.l - 8, y + (bh - 8) / 2 + 4, labels[i], "cs-x", "end");
  });
  years.forEach((yr, j) => out += svgText(pad.l + j * colW + colW / 2, pad.t - 8, yr, "cs-axis"));
  return out;
}
function drawSunburst(s, W, H) {
  const root = s.root || "中心", children = s.children || [];
  const cx = W / 2, cy = H / 2;
  const R = Math.min(W / 2 - 24, H / 2 - 24);
  const total = children.reduce((a, c) => a + (c.value || 0), 0) || 1;
  const arcs = (items, r0, r1, aStart, aSpan) => {
    let out = "", ang = aStart;
    items.forEach((it, i) => {
      const sweep = (it.value || 0) / total * aSpan;
      const a1 = ang, a2 = ang + sweep;
      const x1 = cx + r1 * Math.cos(a1), y1 = cy + r1 * Math.sin(a1);
      const x2 = cx + r1 * Math.cos(a2), y2 = cy + r1 * Math.sin(a2);
      const x0 = cx + r0 * Math.cos(a2), y0 = cy + r0 * Math.sin(a2);
      const x3 = cx + r0 * Math.cos(a1), y3 = cy + r0 * Math.sin(a1);
      const large = sweep > Math.PI ? 1 : 0;
      out += `<path d="M${x3.toFixed(1)},${y3.toFixed(1)} L${x1.toFixed(1)},${y1.toFixed(1)} A${r1},${r1} 0 ${large} 1 ${x2.toFixed(1)},${y2.toFixed(1)} L${x0.toFixed(1)},${y0.toFixed(1)} A${r0},${r0} 0 ${large} 0 ${x3.toFixed(1)},${y3.toFixed(1)} Z" fill="${CHART_PALETTE[i % CHART_PALETTE.length]}" opacity="${r0 / R + 0.3}"/>`;
      const ma = (a1 + a2) / 2;
      const lx = cx + (r0 + r1) / 2 * Math.cos(ma), ly = cy + (r0 + r1) / 2 * Math.sin(ma);
      if (sweep > 0.25) out += svgText(lx, ly + 4, String(it.name).slice(0, 5), "cs-heat");
      out += arcs(it.children || [], r0 + (r1 - r0) * 0.55, r1, a1, sweep);
      ang = a2;
    });
    return out;
  };
  let out = `<circle cx="${cx}" cy="${cy}" r="${R}" fill="#f0f4f8" stroke="#c3ccd6"/>`;
  out += arcs(children, 0, R * 0.78, -Math.PI / 2, Math.PI * 2);
  out += svgText(cx, cy, root, "cs-big");
  out += svgText(cx, cy + 18, "层级占比", "cs-legend");
  return out;
}
function drawForce(s, W, H) {
  const nodes = s.nodes || [], links = s.links || [];
  const pos = {};
  const n = nodes.length;
  nodes.forEach((nd, i) => {
    const angle = i / n * Math.PI * 2 - Math.PI / 2;
    const r = Math.min(W, H) / 2 - 66;
    pos[nd] = [W / 2 + r * Math.cos(angle) * 0.92, H / 2 + r * Math.sin(angle) * 0.85];
  });
  let out = "";
  links.forEach(lk => {
    const p1 = pos[lk[0]], p2 = pos[lk[1]];
    if (!p1 || !p2) return;
    out += `<line x1="${p1[0].toFixed(1)}" y1="${p1[1].toFixed(1)}" x2="${p2[0].toFixed(1)}" y2="${p2[1].toFixed(1)}" stroke="#aebbc9" stroke-width="1.6"/>`;
  });
  nodes.forEach(nd => {
    const p = pos[nd];
    const deg = links.filter(l => l.includes(nd)).length;
    out += `<circle cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="${(10 + deg * 4).toFixed(1)}" fill="${deg > 2 ? "#1a3a5c" : "#4a7ba6"}" opacity="0.85"/>`;
    out += svgText(p[0], p[1] + 4, nd, "cs-heat");
  });
  return out;
}

/* ============================================================
 * 图库视图 + 详情增强
 * ============================================================ */
function chartItems() { return (FRAMEWORKS || []).filter(f => f.domain_code === "CHART"); }

function renderChartView() {
  const kw = searchText || chartKw || "";
  const list = chartItems().filter(f => {
    if (chartActiveGroup !== "ALL" && (f.category || "") !== chartActiveGroup && (f.triggers || "") !== chartActiveGroup) return false;
    if (kw) {
      const hay = (f.name + " " + (f.aliases || "") + " " + (f.summary || "") + " " + (f.problem_statement || "") + " " + (f.related_frameworks || "") + " " + (f.keywords || "")).toLowerCase();
      if (!hay.includes(kw.toLowerCase())) return false;
    }
    return true;
  });
  const bar = $("chartGroups");
  bar.innerHTML = `<button class="m-chip ${chartActiveGroup === "ALL" ? "active" : ""}" data-g="ALL">全部 ${chartItems().length}</button>` +
    CHART_GROUPS.map(g => {
      const cnt = chartItems().filter(f => f.category === g || f.triggers === g).length;
      return `<button class="m-chip ${chartActiveGroup === g ? "active" : ""}" data-g="${esc(g)}">${esc(g)} ${cnt}</button>`;
    }).join("");
  bar.querySelectorAll("button").forEach(b => b.addEventListener("click", () => {
    chartActiveGroup = b.dataset.g;
    renderChartView();
  }));
  $("shownCount").textContent = list.length;
  $("currentScope").textContent = "展示图库 · 方法论成果展示配图选择";
  const area = $("listArea");
  const empty = $("emptyState");
  if (!list.length) { area.innerHTML = ""; empty.style.display = "block"; return; }
  empty.style.display = "none";
  area.innerHTML = `<div class="chart-grid">` + list.map(f => {
    const sample = chartSampleOf(f);
    const svg = renderChartSVG(chartTypeOf(f), sample, 420, 280);
    return `<div class="chart-card" data-code="${esc(f.code)}">
      <div class="chart-thumb">${svg}</div>
      <div class="chart-name">${esc(f.name)}</div>
      <div class="chart-sum">${esc(f.summary)}</div>
      <div class="chart-prob">${esc((f.problem_statement || "").slice(0, 46))}${(f.problem_statement || "").length > 46 ? "…" : ""}</div>
    </div>`;
  }).join("") + `</div>`;
  area.querySelectorAll(".chart-card").forEach(card => {
    card.addEventListener("click", () => openDetail(card.dataset.code));
  });
}

function chartHeroHTML(f) {
  const sample = chartSampleOf(f);
  const svg = renderChartSVG(chartTypeOf(f), sample, 560, 360);
  const rel = listify(f.related_frameworks);
  return `<div class="chart-hero">
    <div class="chart-hero-viz">${svg}</div>
    <div class="chart-hero-info">
      <div class="d-label">类别</div><p class="d-text">${esc(f.category || "展示图")}</p>
      <div class="d-label">一句话</div><p class="d-text">${esc(f.summary || "")}</p>
      ${rel.length ? `<div class="d-label">匹配方法论</div><div class="chips">${rel.map(r => `<span class="chip" data-related="${esc(r)}">${esc(r)}</span>`).join("")}</div>` : ""}
    </div>
  </div>`;
}

function recommendedChartsHTML(f) {
  if ((f.domain_code || "") === "CHART") return "";
  const hayFields = [f.name, f.aliases, f.summary, f.problem_statement, f.related_frameworks, f.keywords, f.triggers, f.tools].join(" ");
  const matched = chartItems().filter(c => {
    const rel = listify(c.related_frameworks);
    return rel.some(r => r && (hayFields.includes(r) || (f.name || "").includes(r) || r.includes(f.name) || (f.aliases || "").includes(r)));
  }).slice(0, 8);
  if (!matched.length) return "";
  return `<div class="d-section"><div class="d-label">推荐展示图</div>
    <div class="rec-charts">${matched.map(c => {
      const sample = chartSampleOf(c);
      return `<div class="rec-chart" data-code="${esc(c.code)}">
        <div class="rec-thumb">${renderChartSVG(chartTypeOf(c), sample, 180, 120)}</div>
        <div class="rec-name">${esc(c.name)}</div>
      </div>`;
    }).join("")}</div></div>`;
}

/* ===== 覆盖视图切换 ===== */
function setViewBtns() {
  $("viewDomainBtn").classList.toggle("active", activeView === "domain");
  $("viewProblemBtn").classList.toggle("active", activeView === "problem");
  $("viewChartBtn").classList.toggle("active", activeView === "chart");
  const cl = $("chartGroups");
  if (cl) cl.style.display = activeView === "chart" ? "flex" : "none";
}

function renderList() {
  if (activeView === "chart") { renderChartView(); return; }
  if (activeView === "problem") { renderProblemView(); return; }
  const list = filtered();
  $("shownCount").textContent = list.length;
  const scopeName = activeDomain === "ALL" ? "全部领域" : (DOMAIN_NAMES[activeDomain] || activeDomain);
  $("currentScope").textContent = `${scopeName} · ${activeMastery === "ALL" ? "全部掌握度" : activeMastery}`;
  const area = $("listArea");
  const empty = $("emptyState");
  if (!list.length) {
    area.innerHTML = "";
    empty.style.display = "block";
    return;
  }
  empty.style.display = "none";
  area.innerHTML = list.map(f => {
    const mcolor = MASTERY_COLORS[f.mastery_level] || "#93a3b4";
    const domName = DOMAIN_NAMES[f.domain_code] || f.domain_code;
    return `<div class="frow" data-code="${esc(f.code)}">
      <span class="fcode">${esc(f.code)}</span>
      <span class="fname">${esc(f.name)}</span>
      <span class="fdom">${esc(domName)}</span>
      <span class="fmastery" style="color:${mcolor}"><span class="m-dot" style="background:${mcolor}"></span>${esc(f.mastery_level)}</span>
      <span class="fsummary">${esc(f.summary)}</span>
    </div>`;
  }).join("");
  area.querySelectorAll(".frow").forEach(row => {
    row.addEventListener("click", () => openDetail(row.dataset.code));
  });
}

/* ===== 覆盖详情 ===== */
function openDetail(code) {
  const f = FRAMEWORKS.find(x => x.code === code);
  if (!f) return;
  selectedCode = code;
  $("dCode").textContent = f.code || "";
  $("dTitle").textContent = f.name || "";
  const mcolor = MASTERY_COLORS[f.mastery_level] || "#93a3b4";
  $("dMeta").innerHTML =
    `<span class="tag dom">${esc(DOMAIN_NAMES[f.domain_code] || f.domain_code)}</span>` +
    (f.aliases ? `<span class="tag">别名：${esc(f.aliases)}</span>` : "") +
    (f.domain_code === "CHART" ? `<span class="tag">展示图例</span>` : `<span class="tag" style="background:${mcolor}">掌握度 ${esc(f.mastery_level)}</span>`);
  const body = (f.domain_code === "CHART" ? chartHeroHTML(f) : "") + buildDetailBody(f) + (f.domain_code === "CHART" ? "" : recommendedChartsHTML(f));
  $("drawerBody").innerHTML = body;
  $("drawer").classList.add("open");
  $("drawerMask").classList.add("open");
  document.body.style.overflow = "hidden";
  $("drawerBody").scrollTop = 0;
  $("drawerBody").querySelectorAll("[data-related]").forEach(el => {
    el.addEventListener("click", () => {
      const target = FRAMEWORKS.find(x => x.name === el.dataset.related || x.name.includes(el.dataset.related) || el.dataset.related.includes(x.name));
      if (target) openDetail(target.code);
    });
  });
  $("drawerBody").querySelectorAll(".rec-chart").forEach(el => {
    el.addEventListener("click", () => openDetail(el.dataset.code));
  });
}

/* ===== 绑定 ===== */
(function bindChartView() {
  const btn = document.getElementById("viewChartBtn");
  if (btn) {
    btn.addEventListener("click", () => { activeView = "chart"; setViewBtns(); renderList(); });
  }
  const inp = document.getElementById("chartSearch");
  if (inp) {
    inp.addEventListener("input", e => { chartKw = e.target.value; if (activeView === "chart") renderChartView(); });
  }
  const cs = document.getElementById("chartGroups");
  if (cs) cs.style.display = "none";
})();






/* ============================================================
 * 展示图库增强 v2 —— 22 个新增图例渲染 + chartType 兼容
 * 注入 index.html 末尾（script 闭合标签前），覆盖 chartTypeOf / renderChartSVG
 * ============================================================ */

/* 优先读 viz_config.chartType（应用版导出后 viz_type 可能为 process） */
function chartTypeOf(f) {
  let vc = f.viz_config;
  if (typeof vc === "string") { try { vc = JSON.parse(vc); } catch (e) { vc = null; } }
  if (vc && vc.chartType) return vc.chartType;
  return f.viz_type || "bar";
}

/* ===== 修复：旧库中 polyPath 缺 W 参数，此覆盖版修正 ===== */function polyPath(vals, labels, sc, pad, W, H, lo, hi) {
  if (!W || !H) { W = 420; H = 280; }
  return (vals || []).map((v, i) => {
    const x = pad.l + i / Math.max((labels || []).length - 1, 1) * (W - pad.l - pad.r);
    const y = mapV(v, sc, hi, lo);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" ");
}

/* ===== 柱状图三形态（应用版新增独立类型） ===== */
function drawGroupedBar(s, W, H) {
  const pad = { l: 46, r: 14, t: 26, b: 34 };
  const labels = s.labels || [];
  const series = s.series || [];
  const allV = series.flatMap(x => x.values || []);
  const sc = makeScale(allV, true);
  const iw = (W - pad.l - pad.r) / Math.max(labels.length, 1);
  const gw = iw * 0.8;
  const bw = gw / Math.max(series.length, 1) - 3;
  let out = "";
  labels.forEach((lb, i) => {
    const gx = pad.l + i * iw + (iw - gw) / 2;
    series.forEach((sr, j) => {
      const v = (sr.values || [])[i];
      if (v == null) return;
      const x = gx + j * (bw + 3);
      const h = mapV(v, sc, 4, H - pad.t - pad.b);
      out += `<rect x="${x.toFixed(1)}" y="${(H - pad.b - h).toFixed(1)}" width="${bw.toFixed(1)}" height="${Math.max(h, 1).toFixed(1)}" rx="2" fill="${CHART_PALETTE[j % CHART_PALETTE.length]}"/>`;
    });
    out += svgText(pad.l + i * iw + iw / 2, H - pad.b + 16, lb, "cs-x");
  });
  out += `<line x1="${pad.l}" y1="${H - pad.b}" x2="${W - pad.r}" y2="${H - pad.b}" stroke="#93a3b4"/>`;
  out += svgLegend(series.map((x, j) => ({ name: x.name, color: CHART_PALETTE[j % CHART_PALETTE.length] })), pad.l, 14);
  return out;
}
function drawStackedBar(s, W, H) {
  const pad = { l: 46, r: 14, t: 26, b: 34 };
  const labels = s.labels || [];
  const series = s.series || [];
  const iw = (W - pad.l - pad.r) / Math.max(labels.length, 1);
  const bw = Math.min(iw * 0.62, 46);
  let out = "";
  const maxStack = Math.max(...labels.map((_, i) => series.reduce((a, g) => a + ((g.values || [])[i] || 0), 0)), 1);
  labels.forEach((lb, i) => {
    const x = pad.l + i * iw + (iw - bw) / 2;
    let acc = 0;
    series.forEach((sr, j) => {
      const v = (sr.values || [])[i] || 0;
      if (!v) return;
      const h = v / maxStack * (H - pad.t - pad.b);
      out += `<rect x="${x.toFixed(1)}" y="${(H - pad.b - acc - h).toFixed(1)}" width="${bw.toFixed(1)}" height="${Math.max(h, 1).toFixed(1)}" rx="1" fill="${CHART_PALETTE[j % CHART_PALETTE.length]}"/>`;
      acc += h;
    });
    out += svgText(x + bw / 2, H - pad.b + 16, lb, "cs-x");
  });
  out += `<line x1="${pad.l}" y1="${H - pad.b}" x2="${W - pad.r}" y2="${H - pad.b}" stroke="#93a3b4"/>`;
  out += svgLegend(series.map((x, j) => ({ name: x.name, color: CHART_PALETTE[j % CHART_PALETTE.length] })), pad.l, 14);
  return out;
}
function drawPercentStacked(s, W, H) {
  const pad = { l: 46, r: 14, t: 26, b: 34 };
  const labels = s.labels || [];
  const series = s.series || [];
  const iw = (W - pad.l - pad.r) / Math.max(labels.length, 1);
  const bw = Math.min(iw * 0.62, 46);
  let out = "";
  labels.forEach((lb, i) => {
    const x = pad.l + i * iw + (iw - bw) / 2;
    const total = series.reduce((a, g) => a + ((g.values || [])[i] || 0), 0) || 1;
    let acc = 0;
    series.forEach((sr, j) => {
      const v = (sr.values || [])[i] || 0;
      if (!v) return;
      const h = v / total * (H - pad.t - pad.b);
      out += `<rect x="${x.toFixed(1)}" y="${(H - pad.b - acc - h).toFixed(1)}" width="${bw.toFixed(1)}" height="${Math.max(h, 1).toFixed(1)}" rx="1" fill="${CHART_PALETTE[j % CHART_PALETTE.length]}"/>`;
      acc += h;
    });
    out += svgText(x + bw / 2, H - pad.b + 16, lb, "cs-x");
  });
  out += `<line x1="${pad.l}" y1="${H - pad.b}" x2="${W - pad.r}" y2="${H - pad.b}" stroke="#93a3b4"/>`;
  out += svgText(W - pad.r, pad.t - 6, "各分类合计 100%", "cs-axis", "end");
  out += svgLegend(series.map((x, j) => ({ name: x.name, color: CHART_PALETTE[j % CHART_PALETTE.length] })), pad.l, 14);
  return out;
}

/* ===== 新增 22 个图例渲染函数 ===== */
function drawLollipop(s, W, H) {
  const pad = { l: 44, r: 16, t: 24, b: 34 };
  const labels = s.labels || [], values = s.values || [];
  const sc = makeScale(values, true);
  const iw = (W - pad.l - pad.r) / Math.max(labels.length, 1);
  let out = "";
  values.forEach((v, i) => {
    const x = pad.l + i * iw + iw / 2;
    const y = mapV(v, sc, H - pad.b, pad.t);
    out += `<line x1="${x.toFixed(1)}" y1="${H - pad.b}" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}" stroke="#4a7ba6" stroke-width="1.6"/>`;
    out += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="6" fill="#1a3a5c"/>`;
    out += svgText(x, y - 10, v, "cs-val");
    out += svgText(x, H - pad.b + 16, labels[i], "cs-x");
  });
  out += `<line x1="${pad.l}" y1="${H - pad.b}" x2="${W - pad.r}" y2="${H - pad.b}" stroke="#93a3b4"/>`;
  return out;
}
function drawDumbbell(s, W, H) {
  const pad = { l: 56, r: 16, t: 24, b: 34 };
  const labels = s.labels || [], lo = s.lo || [], hi = s.hi || [], lo2 = s.lo2 || [], hi2 = s.hi2 || [];
  const sc = makeScale([...lo, ...hi, ...lo2, ...hi2], false);
  const bh = (H - pad.t - pad.b) / Math.max(labels.length, 1);
  let out = "";
  labels.forEach((lb, i) => {
    const y = pad.t + i * bh + bh / 2;
    const x1 = mapV(lo[i], sc, pad.l, W - pad.r), x2 = mapV(hi[i], sc, pad.l, W - pad.r);
    const x3 = mapV(lo2[i], sc, pad.l, W - pad.r), x4 = mapV(hi2[i], sc, pad.l, W - pad.r);
    out += `<line x1="${x1.toFixed(1)}" y1="${y}" x2="${x2.toFixed(1)}" y2="${y}" stroke="#7d94ab" stroke-width="2"/>`;
    out += `<circle cx="${x1.toFixed(1)}" cy="${y}" r="5.5" fill="#c3ccd6" stroke="#7d94ab" stroke-width="1.4"/>`;
    out += `<circle cx="${x2.toFixed(1)}" cy="${y}" r="5.5" fill="#c3ccd6" stroke="#7d94ab" stroke-width="1.4"/>`;
    out += `<line x1="${x3.toFixed(1)}" y1="${y + 12}" x2="${x4.toFixed(1)}" y2="${y + 12}" stroke="#b3403a" stroke-width="2"/>`;
    out += `<circle cx="${x3.toFixed(1)}" cy="${y + 12}" r="5.5" fill="#f2dcd8" stroke="#b3403a" stroke-width="1.4"/>`;
    out += `<circle cx="${x4.toFixed(1)}" cy="${y + 12}" r="5.5" fill="#f2dcd8" stroke="#b3403a" stroke-width="1.4"/>`;
    out += svgText(pad.l - 10, y + 4, lb, "cs-x", "end");
  });
  out += svgLegend([{ name: "前期区间", color: "#7d94ab" }, { name: "后期区间", color: "#b3403a" }], pad.l, 14);
  return out;
}
function drawVariance(s, W, H) {
  const pad = { l: 44, r: 16, t: 34, b: 34 };
  const labels = s.labels || [], plan = s.plan || [], actual = s.actual || [];
  const sc = makeScale([...plan, ...actual], true);
  const iw = (W - pad.l - pad.r) / Math.max(labels.length, 1);
  const bw = Math.min(iw * 0.24, 22);
  let out = "";
  labels.forEach((lb, i) => {
    const cx = pad.l + i * iw + iw / 2;
    const hp = mapV(plan[i], sc, 6, H - pad.t - pad.b);
    const ha = mapV(actual[i], sc, 6, H - pad.t - pad.b);
    out += `<rect x="${(cx - bw - 2).toFixed(1)}" y="${(H - pad.b - hp).toFixed(1)}" width="${bw.toFixed(1)}" height="${hp.toFixed(1)}" rx="2" fill="#aebbc9"/>`;
    out += `<rect x="${(cx + 2).toFixed(1)}" y="${(H - pad.b - ha).toFixed(1)}" width="${bw.toFixed(1)}" height="${ha.toFixed(1)}" rx="2" fill="#1a3a5c"/>`;
    const diff = actual[i] - plan[i];
    const dy = H - pad.b - Math.max(ha, hp) - 8;
    out += svgText(cx, dy, (diff > 0 ? "+" : "") + diff, "cs-val");
    out += svgText(cx, H - pad.b + 16, lb, "cs-x");
  });
  out += `<line x1="${pad.l}" y1="${H - pad.b}" x2="${W - pad.r}" y2="${H - pad.b}" stroke="#93a3b4"/>`;
  out += svgLegend([{ name: "计划", color: "#aebbc9" }, { name: "实际", color: "#1a3a5c" }], pad.l, 16);
  return out;
}
function drawColin(s, W, H) {
  const pad = { l: 44, r: 16, t: 30, b: 34 };
  const labels = s.labels || [], outer = s.outer || [], inner = s.inner || [];
  const sc = makeScale([...outer, ...inner], true);
  const iw = (W - pad.l - pad.r) / Math.max(labels.length, 1);
  const bw = Math.min(iw * 0.56, 44);
  let out = "";
  labels.forEach((lb, i) => {
    const x = pad.l + i * iw + (iw - bw) / 2;
    const ho = mapV(outer[i], sc, 6, H - pad.t - pad.b);
    const hi = mapV(inner[i], sc, 6, H - pad.t - pad.b);
    out += `<rect x="${x.toFixed(1)}" y="${(H - pad.b - ho).toFixed(1)}" width="${bw.toFixed(1)}" height="${ho.toFixed(1)}" rx="2" fill="#c8d4e0"/>`;
    out += `<rect x="${(x + bw * 0.24).toFixed(1)}" y="${(H - pad.b - hi).toFixed(1)}" width="${(bw * 0.52).toFixed(1)}" height="${hi.toFixed(1)}" rx="2" fill="#1a3a5c"/>`;
    out += svgText(x + bw / 2, H - pad.b + 16, lb, "cs-x");
  });
  out += `<line x1="${pad.l}" y1="${H - pad.b}" x2="${W - pad.r}" y2="${H - pad.b}" stroke="#93a3b4"/>`;
  out += svgLegend([{ name: "基准", color: "#c8d4e0" }, { name: "实际", color: "#1a3a5c" }], pad.l, 16);
  return out;
}
function drawPanel(s, W, H) {
  const labels = s.labels || [], series = s.series || [];
  const sc = makeScale(series.flatMap(x => x.values || []), true);
  const cols = 2, rows = 2;
  const pw = (W - 40) / cols, ph = (H - 40) / rows;
  let out = "";
  series.slice(0, cols * rows).forEach((sr, k) => {
    const px = 14 + (k % cols) * pw, py = 14 + Math.floor(k / cols) * ph;
    const inL = 8, inR = 8, inT = 14, inB = 14;
    const pts = (sr.values || []).map((v, i) => {
      const x = px + inL + i / Math.max(labels.length - 1, 1) * (pw - inL - inR);
      const y = mapV(v, sc, py + ph - inB, py + inT);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(" ");
    out += `<rect x="${px}" y="${py}" width="${pw - 10}" height="${ph - 10}" rx="6" fill="#f7f9fb" stroke="#dfe4ea"/>`;
    out += `<polyline points="${pts}" fill="none" stroke="${CHART_PALETTE[k % CHART_PALETTE.length]}" stroke-width="1.8"/>`;
    out += svgText(px + (pw - 10) / 2, py + 12, sr.name, "cs-axis");
  });
  return out;
}
function drawClustack(s, W, H) {
  const pad = { l: 44, r: 16, t: 30, b: 34 };
  const labels = s.labels || [], groups = s.groups || [];
  const iw = (W - pad.l - pad.r) / Math.max(labels.length, 1);
  const gw = iw * 0.78;
  let out = "";
  const allMax = Math.max(...labels.map((_, i) => groups.reduce((a, g) => a + ((g.series || [])[i] || 0), 0)), 1);
  labels.forEach((lb, i) => {
    const gx = pad.l + i * iw + (iw - gw) / 2;
    groups.forEach((g, j) => {
      const bw = gw / groups.length - 4;
      const x = gx + j * (bw + 4);
      let acc = 0;
      (g.series || []).forEach((v, k) => {
        if (k !== i) return;
        const h = v / allMax * (H - pad.t - pad.b);
        out += `<rect x="${x.toFixed(1)}" y="${(H - pad.b - acc - h).toFixed(1)}" width="${bw.toFixed(1)}" height="${Math.max(h, 1).toFixed(1)}" rx="1" fill="${CHART_PALETTE[(j * 3 + k) % CHART_PALETTE.length]}"/>`;
        acc += h;
      });
    });
    out += svgText(pad.l + i * iw + iw / 2, H - pad.b + 16, lb, "cs-x");
  });
  out += `<line x1="${pad.l}" y1="${H - pad.b}" x2="${W - pad.r}" y2="${H - pad.b}" stroke="#93a3b4"/>`;
  const legendItems = [];
  groups.forEach((g, j) => (g.series || []).forEach((_, k) => {
    legendItems.push({ name: (g.name || "组" + (j + 1)) + "-" + (k + 1), color: CHART_PALETTE[(j * 3 + k) % CHART_PALETTE.length] });
  }));
  out += svgLegend(legendItems, pad.l, 16);
  return out;
}
function drawAvgline(s, W, H) {
  const pad = { l: 44, r: 16, t: 30, b: 34 };
  const labels = s.labels || [], values = s.values || [];
  const ref = svgNum(s.ref, 78);
  const sc = makeScale([...values, ref], true);
  const iw = (W - pad.l - pad.r) / Math.max(labels.length, 1);
  const bw = Math.min(iw * 0.6, 44);
  let out = "";
  values.forEach((v, i) => {
    const x = pad.l + i * iw + (iw - bw) / 2;
    const h = mapV(v, sc, 6, H - pad.t - pad.b);
    const over = v >= ref;
    out += `<rect x="${x.toFixed(1)}" y="${(H - pad.b - h).toFixed(1)}" width="${bw.toFixed(1)}" height="${h.toFixed(1)}" rx="2" fill="${over ? "#2e577f" : "#aebbc9"}"/>`;
    out += svgText(x + bw / 2, H - pad.b + 16, labels[i], "cs-x");
  });
  const ry = mapV(ref, sc, H - pad.b, pad.t);
  out += `<line x1="${pad.l}" y1="${ry.toFixed(1)}" x2="${W - pad.r}" y2="${ry.toFixed(1)}" stroke="#b3403a" stroke-width="1.8" stroke-dasharray="6 4"/>`;
  out += svgText(W - pad.r - 4, ry - 6, "参考 " + ref, "cs-axis", "end");
  out += `<line x1="${pad.l}" y1="${H - pad.b}" x2="${W - pad.r}" y2="${H - pad.b}" stroke="#93a3b4"/>`;
  return out;
}
function drawColbubble(s, W, H) {
  const pad = { l: 44, r: 16, t: 34, b: 34 };
  const labels = s.labels || [], bars = s.bars || [], bubbles = s.bubbles || [];
  const scB = makeScale(bars, true), scBub = makeScale(bubbles, true);
  const iw = (W - pad.l - pad.r) / Math.max(labels.length, 1);
  const bw = Math.min(iw * 0.55, 40);
  let out = "";
  labels.forEach((lb, i) => {
    const x = pad.l + i * iw + (iw - bw) / 2;
    const h = mapV(bars[i], scB, 6, H - pad.t - pad.b - 20);
    out += `<rect x="${x.toFixed(1)}" y="${(H - pad.b - h).toFixed(1)}" width="${bw.toFixed(1)}" height="${h.toFixed(1)}" rx="2" fill="#7d94ab"/>`;
    const r = mapV(bubbles[i], scBub, 8, 24);
    out += `<circle cx="${(x + bw / 2).toFixed(1)}" cy="${(H - pad.b - h - r).toFixed(1)}" r="${r.toFixed(1)}" fill="#1a3a5c" opacity="0.85"/>`;
    out += svgText(x + bw / 2, H - pad.b + 16, lb, "cs-x");
  });
  out += `<line x1="${pad.l}" y1="${H - pad.b}" x2="${W - pad.r}" y2="${H - pad.b}" stroke="#93a3b4"/>`;
  out += svgLegend([{ name: "柱=主指标", color: "#7d94ab" }, { name: "气泡=次指标", color: "#1a3a5c" }], pad.l, 16);
  return out;
}
function drawHbubble(s, W, H) {
  const labels = s.labels || [], values = s.values || [];
  const sc = makeScale(values, true);
  const bh = (H - 40) / Math.max(labels.length, 1);
  let out = "";
  values.forEach((v, i) => {
    const y = 20 + i * bh + bh / 2;
    const r = mapV(v, sc, 8, 26);
    out += `<circle cx="${(50 + r).toFixed(1)}" cy="${y.toFixed(1)}" r="${r.toFixed(1)}" fill="${CHART_PALETTE[i % CHART_PALETTE.length]}" opacity="0.8"/>`;
    out += svgText(50 + r + 12, y + 4, labels[i] + "  " + v, "cs-val", "start");
  });
  return out;
}
function drawArc(s, W, H) {
  const labels = s.labels || [], values = s.values || [];
  const cx = 90, cy = H / 2 + 10, R = 92;
  const maxV = Math.max(...values, 1);
  let out = "";
  const a0 = -Math.PI / 2;
  values.forEach((v, i) => {
    const sweep = v / maxV * Math.PI * 1.6;
    const a1 = a0 + i * 0.06, a2 = a1 + sweep;
    const big = sweep > Math.PI ? 1 : 0;
    out += `<path d="M${(cx + R * Math.cos(a1)).toFixed(1)},${(cy + R * Math.sin(a1)).toFixed(1)} A${R},${R} 0 ${big} 1 ${(cx + R * Math.cos(a2)).toFixed(1)},${(cy + R * Math.sin(a2)).toFixed(1)}" fill="none" stroke="${CHART_PALETTE[i % CHART_PALETTE.length]}" stroke-width="16" stroke-linecap="butt"/>`;
    const ma = (a1 + a2) / 2;
    const lx = cx + (R + 26) * Math.cos(ma), ly = cy + (R + 26) * Math.sin(ma);
    out += svgText(lx, ly + 4, labels[i] + " " + v, "cs-val");
  });
  return out;
}
function drawSurfdef(s, W, H) {
  const pad = { l: 44, r: 16, t: 30, b: 34 };
  const labels = s.labels || [], values = s.values || [];
  const sc = makeScale(values, false);
  const y0 = mapV(0, sc, H - pad.b, pad.t);
  const pts = values.map((v, i) => {
    const x = pad.l + i / Math.max(labels.length - 1, 1) * (W - pad.l - pad.r);
    return `${x.toFixed(1)},${mapV(v, sc, H - pad.b, pad.t).toFixed(1)}`;
  }).join(" ");
  let out = "";
  let prevX = pad.l, prevY = mapV(values[0], sc, H - pad.b, pad.t);
  values.forEach((v, i) => {
    const x = pad.l + i / Math.max(labels.length - 1, 1) * (W - pad.l - pad.r);
    const y = mapV(v, sc, H - pad.b, pad.t);
    const col = v >= 0 ? "#3b6e5e" : "#b3403a";
    out += `<polygon points="${prevX.toFixed(1)},${prevY.toFixed(1)} ${x.toFixed(1)},${y.toFixed(1)} ${x.toFixed(1)},${y0.toFixed(1)} ${prevX.toFixed(1)},${y0.toFixed(1)}" fill="${col}" opacity="0.35"/>`;
    prevX = x; prevY = y;
  });
  out += `<polyline points="${pts}" fill="none" stroke="#1a3a5c" stroke-width="2.2"/>`;
  out += `<line x1="${pad.l}" y1="${y0.toFixed(1)}" x2="${W - pad.r}" y2="${y0.toFixed(1)}" stroke="#93a3b4" stroke-dasharray="4 3"/>`;
  labels.forEach((lb, i) => {
    const x = pad.l + i / Math.max(labels.length - 1, 1) * (W - pad.l - pad.r);
    out += svgText(x, H - pad.b + 16, lb, "cs-x");
  });
  out += svgLegend([{ name: "盈利", color: "#3b6e5e" }, { name: "亏损", color: "#b3403a" }], pad.l, 16);
  return out;
}
function drawStepline(s, W, H) {
  const pad = { l: 44, r: 16, t: 30, b: 34 };
  const labels = s.labels || [], values = s.values || [];
  const sc = makeScale(values, true);
  let d = "";
  values.forEach((v, i) => {
    const x = pad.l + i / Math.max(labels.length - 1, 1) * (W - pad.l - pad.r);
    const y = mapV(v, sc, H - pad.b, pad.t);
    if (i === 0) d += `M${x.toFixed(1)},${y.toFixed(1)}`;
    else {
      const px = pad.l + (i - 1) / Math.max(labels.length - 1, 1) * (W - pad.l - pad.r);
      const py = mapV(values[i - 1], sc, H - pad.b, pad.t);
      d += ` L${x.toFixed(1)},${py.toFixed(1)} L${x.toFixed(1)},${y.toFixed(1)}`;
    }
  });
  let out = `<path d="${d}" fill="none" stroke="#1a3a5c" stroke-width="2.4"/>`;
  values.forEach((v, i) => {
    const x = pad.l + i / Math.max(labels.length - 1, 1) * (W - pad.l - pad.r);
    out += `<circle cx="${x.toFixed(1)}" cy="${mapV(v, sc, H - pad.b, pad.t).toFixed(1)}" r="3.4" fill="#fff" stroke="#1a3a5c" stroke-width="1.8"/>`;
    out += svgText(x, H - pad.b + 16, labels[i], "cs-x");
  });
  out += `<line x1="${pad.l}" y1="${H - pad.b}" x2="${W - pad.r}" y2="${H - pad.b}" stroke="#93a3b4"/>`;
  return out;
}
function drawGrowth(s, W, H) {
  const pad = { l: 56, r: 50, t: 24, b: 20 };
  const labels = s.labels || [], values = s.values || [];
  const maxA = Math.max(...values.map(v => Math.abs(v)), 1);
  const bh = (H - pad.t - pad.b) / Math.max(labels.length, 1);
  const mid = W / 2;
  let out = `<line x1="${mid}" y1="${pad.t}" x2="${mid}" y2="${H - pad.b}" stroke="#dfe4ea" stroke-dasharray="4 3"/>`;
  values.forEach((v, i) => {
    const y = pad.t + i * bh + bh / 2;
    const w = Math.abs(v) / maxA * (W / 2 - 60);
    const col = v >= 0 ? "#b3403a" : "#3b6e5e";
    const dir = v >= 0 ? 1 : -1;
    const x0 = v >= 0 ? mid : mid - w;
    out += `<rect x="${x0.toFixed(1)}" y="${(y - 7).toFixed(1)}" width="${Math.max(w, 3).toFixed(1)}" height="14" rx="3" fill="${col}" opacity="0.85"/>`;
    out += `<polygon points="${(x0 + (v >= 0 ? w + 4 : -4)).toFixed(1)},${y - 9} ${(x0 + (v >= 0 ? w + 4 : -4)).toFixed(1)},${y + 9} ${(x0 + (v >= 0 ? w + 14 : -14)).toFixed(1)},${y}" fill="${col}"/>`;
    out += svgText(pad.l - 10, y + 4, labels[i], "cs-x", "end");
    out += svgText(x0 + (v >= 0 ? w + 22 : -22), y + 4, (v > 0 ? "+" : "") + v + "%", v >= 0 ? "cs-val" : "cs-val", v >= 0 ? "start" : "end");
  });
  return out;
}
function drawHill(s, W, H) {
  const hills = s.hills || [];
  const pad = { l: 20, r: 20, t: 24, b: 24 };
  const maxP = Math.max(...hills.map(h => h.peak), 1);
  const bw = (W - pad.l - pad.r) / Math.max(hills.length, 1);
  let out = "";
  hills.forEach((h, i) => {
    const cx = pad.l + i * bw + bw / 2;
    const peakH = h.peak / maxP * (H - pad.t - pad.b) * 0.9 + 20;
    const baseY = H - pad.b;
    const d = `M${(cx - bw / 2 + 8)},${baseY} Q${(cx - bw / 4).toFixed(1)},${(baseY - peakH * 0.5).toFixed(1)} ${cx},${(baseY - peakH).toFixed(1)} Q${(cx + bw / 4).toFixed(1)},${(baseY - peakH * 0.5).toFixed(1)} ${(cx + bw / 2 - 8)},${baseY} Z`;
    out += `<path d="${d}" fill="${CHART_PALETTE[i % CHART_PALETTE.length]}" opacity="0.75"/>`;
    const posX = cx + (h.pos / 100 - 0.5) * bw * 0.7;
    const posY = baseY - (h.pos / 100) * peakH;
    out += `<circle cx="${posX.toFixed(1)}" cy="${posY.toFixed(1)}" r="5" fill="#fff" stroke="#12293f" stroke-width="2"/>`;
    out += svgText(cx, baseY - peakH - 8, h.name, "cs-val");
  });
  out += `<line x1="${pad.l}" y1="${H - pad.b}" x2="${W - pad.r}" y2="${H - pad.b}" stroke="#93a3b4"/>`;
  out += svgText(W / 2, H - 6, "山脚=启动 · 山顶=发布", "cs-legend");
  return out;
}
function drawRunway(s, W, H) {
  const value = svgNum(s.value, 68);
  const labels = s.labels || [];
  const cx = W / 2, cy = H / 2, rx = Math.min(W / 2 - 30, 140), ry = Math.min(H / 2 - 34, 88);
  let out = `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="none" stroke="#e4ebf2" stroke-width="16"/>`;
  // 进度弧（上弧+下弧分段：简化用上弧）
  const sweep = value / 100 * Math.PI * 2;
  const steps = 40;
  for (let i = 0; i < steps; i++) {
    const a1 = -Math.PI / 2 + sweep * i / steps;
    const a2 = -Math.PI / 2 + sweep * (i + 1) / steps;
    const p1x = cx + rx * Math.cos(a1), p1y = cy + ry * Math.sin(a1);
    const p2x = cx + rx * Math.cos(a2), p2y = cy + ry * Math.sin(a2);
    out += `<path d="M${p1x.toFixed(1)},${p1y.toFixed(1)} L${p2x.toFixed(1)},${p2y.toFixed(1)}" stroke="#1a3a5c" stroke-width="16"/>`;
  }
  out += svgText(cx, cy - 4, value + "%", "cs-big");
  out += svgText(cx, cy + 18, labels.join(" → ") || "进度跑道", "cs-legend");
  return out;
}
function drawRidge(s, W, H) {
  const pad = { l: 44, r: 16, t: 24, b: 30 };
  const labels = s.labels || [], series = s.series || [];
  const allV = series.flatMap(x => x.values || []);
  const sc = makeScale(allV, false);
  const step = (H - pad.t - pad.b) / Math.max(series.length, 1);
  let out = "";
  series.forEach((sr, k) => {
    const off = pad.t + k * step + step * 0.5;
    const pts = (sr.values || []).map((v, i) => {
      const x = pad.l + i / Math.max(labels.length - 1, 1) * (W - pad.l - pad.r);
      const y = off - mapV(v, sc, 0, step * 0.75);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(" ");
    out += `<polygon points="${pad.l},${off} ${pts} ${W - pad.r},${off}" fill="${CHART_PALETTE[k % CHART_PALETTE.length]}" opacity="0.28"/>`;
    out += `<polyline points="${pts}" fill="none" stroke="${CHART_PALETTE[k % CHART_PALETTE.length]}" stroke-width="1.8"/>`;
    out += svgText(pad.l - 6, off + 4, sr.name, "cs-x", "end");
  });
  labels.forEach((lb, i) => {
    const x = pad.l + i / Math.max(labels.length - 1, 1) * (W - pad.l - pad.r);
    out += svgText(x, H - pad.b + 16, lb, "cs-x");
  });
  return out;
}
function drawSpark(s, W, H) {
  const rows = s.rows || [];
  const pad = { l: 56, r: 16, t: 12, b: 12 };
  const bh = (H - pad.t - pad.b) / Math.max(rows.length, 1);
  let out = "";
  rows.forEach((r, k) => {
    const vals = r.values || [];
    const sc = makeScale(vals, true);
    const y = pad.t + k * bh + bh / 2;
    const pts = vals.map((v, i) => {
      const x = pad.l + i / Math.max(vals.length - 1, 1) * (W - pad.l - pad.r);
      return `${x.toFixed(1)},${(y - mapV(v, sc, -bh * 0.22, bh * 0.22)).toFixed(1)}`;
    }).join(" ");
    out += `<polyline points="${pts}" fill="none" stroke="${CHART_PALETTE[k % CHART_PALETTE.length]}" stroke-width="1.8"/>`;
    out += svgText(pad.l - 10, y + 4, r.name, "cs-x", "end");
  });
  return out;
}
function drawWaffle(s, W, H) {
  const value = svgNum(s.value, 68);
  const segments = s.segments || [{ name: "已完成", value: value }, { name: "剩余", value: 100 - value }];
  const cols = 10, rows = 5;
  const cell = Math.min((W - 20) / cols, (H - 60) / rows);
  const x0 = (W - cell * cols) / 2, y0 = 24;
  let filled = 0;
  const total = segments.reduce((a, b) => a + (b.value || 0), 0) || 100;
  const segWithStart = [];
  let acc = 0;
  segments.forEach(seg => { segWithStart.push({ ...seg, start: acc, end: acc + (seg.value || 0) }); acc += seg.value || 0; });
  let out = "";
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const idx = r * cols + c;
      const pct = (idx + 1) / (cols * rows) * total;
      let col = "#e4ebf2";
      for (const seg of segWithStart) {
        if (pct <= seg.end) { col = seg.start === 0 ? "#1a3a5c" : "#7d94ab"; break; }
      }
      out += `<rect x="${(x0 + c * cell).toFixed(1)}" y="${(y0 + r * cell).toFixed(1)}" width="${(cell - 1.5).toFixed(1)}" height="${(cell - 1.5).toFixed(1)}" rx="1.5" fill="${col}"/>`;
    }
  }
  out += svgText(W / 2, y0 + rows * cell + 18, value + "% · 每格 1%", "cs-legend");
  return out;
}
function drawBubblepie(s, W, H) {
  const bubbles = s.bubbles || [];
  const pad = { l: 20, r: 20, t: 24, b: 20 };
  const bw = (W - pad.l - pad.r) / Math.max(bubbles.length, 1);
  const cy = H / 2;
  let out = "";
  bubbles.forEach((b, i) => {
    const cx = pad.l + i * bw + bw / 2;
    const R = Math.min((b.r || 14) / 20 * 44, bw * 0.36, H / 2 - 30);
    const parts = b.parts || [];
    const total = parts.reduce((a, c) => a + c, 0) || 1;
    let ang = -Math.PI / 2;
    parts.forEach((v, j) => {
      const sweep = v / total * Math.PI * 2;
      const a1 = ang, a2 = ang + sweep;
      const x1 = cx + R * Math.cos(a1), y1 = cy + R * Math.sin(a1);
      const x2 = cx + R * Math.cos(a2), y2 = cy + R * Math.sin(a2);
      const large = sweep > Math.PI ? 1 : 0;
      out += `<path d="M${cx},${cy} L${x1.toFixed(1)},${y1.toFixed(1)} A${R},${R} 0 ${large} 1 ${x2.toFixed(1)},${y2.toFixed(1)} Z" fill="${CHART_PALETTE[(i + j) % CHART_PALETTE.length]}" opacity="0.9"/>`;
      ang = a2;
    });
    out += `<circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="#12293f" stroke-width="1.4"/>`;
    out += svgText(cx, cy + 4, b.label, "cs-val");
    out += svgText(cx, cy + R + 16, "规模 " + (b.r || 0), "cs-legend");
  });
  return out;
}
function drawNested(s, W, H) {
  const outer = s.outer || {}, inners = s.inners || [];
  const cx = W / 2 - 30, cy = H / 2;
  const R = Math.min(W / 2 - 80, H / 2 - 30);
  const maxIn = Math.max(...inners.map(i => i.value || 1), 1);
  let out = `<circle cx="${cx}" cy="${cy}" r="${R}" fill="#c8d4e0" opacity="0.6" stroke="#2e577f" stroke-width="1.6"/>`;
  out += svgText(cx, cy - R - 14, outer.name || "整体", "cs-axis");
  out += svgText(cx, cy - R + 20, outer.value || "", "cs-val");
  inners.forEach((it, i) => {
    const r = Math.max((it.value / maxIn) * R * 0.4, 8);
    const ang = -Math.PI / 2 + (i - (inners.length - 1) / 2) * 0.55;
    const x = cx + (R - r - 18) * Math.cos(ang);
    const y = cy + (R - r - 18) * Math.sin(ang) * 0.9;
    out += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r.toFixed(1)}" fill="${CHART_PALETTE[i % CHART_PALETTE.length]}" opacity="0.85"/>`;
    out += svgText(x, y + 4, String(it.name).slice(0, 4), "cs-heat");
  });
  return out;
}
function drawCircular(s, W, H) {
  const center = s.center || "中心", nodes = s.nodes || [];
  const cx = W / 2 - 30, cy = H / 2;
  const R = Math.min(W / 2 - 90, H / 2 - 40);
  let out = `<circle cx="${cx}" cy="${cy}" r="34" fill="#1a3a5c"/>` +
    svgText(cx, cy + 4, String(center).slice(0, 5), "cs-heat");
  nodes.forEach((n, i) => {
    const ang = i / nodes.length * Math.PI * 2 - Math.PI / 2;
    const x = cx + R * Math.cos(ang), y = cy + R * Math.sin(ang);
    out += `<line x1="${cx}" y1="${cy}" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}" stroke="#c3ccd6" stroke-width="1.2"/>`;
    out += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="20" fill="${CHART_PALETTE[i % CHART_PALETTE.length]}" opacity="0.9"/>`;
    out += svgText(x, y + 4, String(n).slice(0, 4), "cs-heat");
  });
  return out;
}
function drawRadarbubble(s, W, H) {
  const indicators = s.indicators || [], bubbles = s.bubbles || [];
  const cx = W / 2 - 40, cy = H / 2, R = Math.min(W / 2 - 70, H / 2 - 40);
  const n = indicators.length;
  const pt = (i, ratio) => {
    const a = i / n * Math.PI * 2 - Math.PI / 2;
    return [cx + R * ratio * Math.cos(a), cy + R * ratio * Math.sin(a)];
  };
  let out = "";
  for (let g = 1; g <= 4; g++) {
    const pts = indicators.map((_, i) => pt(i, g / 4).map(v => v.toFixed(1)).join(",")).join(" ");
    out += `<polygon points="${pts}" fill="none" stroke="#e4ebf2" stroke-width="1"/>`;
  }
  indicators.forEach((ind, i) => {
    const [x, y] = pt(i, 1.14);
    out += svgText(x, y + 4, ind, "cs-x");
  });
  bubbles.forEach((b, k) => {
    const pts = b.values.map((v, i) => pt(i, Math.max(v / 100, 0.05)).map(v2 => v2.toFixed(1)).join(",")).join(" ");
    out += `<polygon points="${pts}" fill="${CHART_PALETTE[k % CHART_PALETTE.length]}" opacity="0.2" stroke="${CHART_PALETTE[k % CHART_PALETTE.length]}" stroke-width="1.6"/>`;
    const avg = b.values.reduce((a, c) => a + c, 0) / Math.max(b.values.length, 1);
    const [bx, by] = pt(0, avg / 100);
    out += `<circle cx="${bx.toFixed(1)}" cy="${by.toFixed(1)}" r="${Math.max((b.r || 10) / 20 * 22, 8)}" fill="${CHART_PALETTE[k % CHART_PALETTE.length]}" opacity="0.75"/>`;
    out += svgText(bx, by + 4, b.label, "cs-heat");
  });
  return out;
}

/* ===== 覆盖主分发（含新增 22 类型） ===== */
function renderChartSVG(type, sample, W, H) {
  W = W || 420; H = H || 280;
  let inner = "";
  try {
    switch (type) {
      case "bar": inner = drawBars(sample, W, H); break;
      case "groupedbar": inner = drawGroupedBar(sample, W, H); break;
      case "stacked": inner = drawStackedBar(sample, W, H); break;
      case "percentstacked": inner = drawPercentStacked(sample, W, H); break;
      case "line": inner = drawLines(sample, W, H); break;
      case "area": inner = drawArea(sample, W, H); break;
      case "combo": inner = drawCombo(sample, W, H); break;
      case "scurve": inner = drawScurve(sample, W, H); break;
      case "control": inner = drawControl(sample, W, H); break;
      case "burn": inner = drawBurn(sample, W, H); break;
      case "gantt": inner = drawGantt(sample, W, H); break;
      case "waterfall": inner = drawWaterfall(sample, W, H); break;
      case "pie": inner = drawPie(sample, W, H); break;
      case "rose": inner = drawRose(sample, W, H); break;
      case "sankey": inner = drawSankey(sample, W, H); break;
      case "funnel": inner = drawFunnel(sample, W, H); break;
      case "treemap": inner = drawTreemap(sample, W, H); break;
      case "mekko": inner = drawMekko(sample, W, H); break;
      case "histogram": inner = drawBars(sample, W, H); break;
      case "boxplot": inner = drawBoxplot(sample, W, H); break;
      case "scatter": inner = drawScatter(sample, W, H); break;
      case "bubble": inner = drawBubble(sample, W, H); break;
      case "dotmatrix": inner = drawDotmatrix(sample, W, H); break;
      case "heatmap": inner = drawHeatmap(sample, W, H); break;
      case "quadrant": inner = drawQuadrant(sample, W, H); break;
      case "ge": inner = drawGE(sample, W, H); break;
      case "kano": inner = drawKano(sample, W, H); break;
      case "swot": inner = drawSwot(sample, W, H); break;
      case "risk": inner = drawRisk(sample, W, H); break;
      case "ife": inner = drawIfe(sample, W, H); break;
      case "space": inner = drawSpace(sample, W, H); break;
      case "fishbone": inner = drawFishbone(sample, W, H); break;
      case "loop": inner = drawLoop(sample, W, H); break;
      case "tree": inner = drawTree(sample, W, H); break;
      case "flow": inner = drawFlow(sample, W, H); break;
      case "swimlane": inner = drawSwimlane(sample, W, H); break;
      case "network": inner = drawNetwork(sample, W, H); break;
      case "vsm": inner = drawVsm(sample, W, H); break;
      case "sysarch": inner = drawSysarch(sample, W, H); break;
      case "topology": inner = drawTopology(sample, W, H); break;
      case "mindmap": inner = drawMindmap(sample, W, H); break;
      case "pyramid": inner = drawPyramid(sample, W, H); break;
      case "milestone": inner = drawMilestone(sample, W, H); break;
      case "roadmap": inner = drawRoadmap(sample, W, H); break;
      case "kpi": inner = drawKpi(sample, W, H); break;
      case "gauge": inner = drawGauge(sample, W, H); break;
      case "liquid": inner = drawLiquid(sample, W, H); break;
      case "ring": inner = drawRing(sample, W, H); break;
      case "status": inner = drawStatus(sample, W, H); break;
      case "thermo": inner = drawThermo(sample, W, H); break;
      case "geomap": inner = drawGeomap(sample, W, H); break;
      case "flyline": inner = drawFlyline(sample, W, H); break;
      case "wordcloud": inner = drawWordcloud(sample, W, H); break;
      case "ranking": inner = drawRanking(sample, W, H); break;
      case "racing": inner = drawRacing(sample, W, H); break;
      case "sunburst": inner = drawSunburst(sample, W, H); break;
      case "force": inner = drawForce(sample, W, H); break;
      /* 新增 22 类型 */
      case "lollipop": inner = drawLollipop(sample, W, H); break;
      case "dumbbell": inner = drawDumbbell(sample, W, H); break;
      case "variance": inner = drawVariance(sample, W, H); break;
      case "colin": inner = drawColin(sample, W, H); break;
      case "panel": inner = drawPanel(sample, W, H); break;
      case "clustack": inner = drawClustack(sample, W, H); break;
      case "avgline": inner = drawAvgline(sample, W, H); break;
      case "colbubble": inner = drawColbubble(sample, W, H); break;
      case "hbubble": inner = drawHbubble(sample, W, H); break;
      case "arc": inner = drawArc(sample, W, H); break;
      case "surfdef": inner = drawSurfdef(sample, W, H); break;
      case "stepline": inner = drawStepline(sample, W, H); break;
      case "growth": inner = drawGrowth(sample, W, H); break;
      case "hill": inner = drawHill(sample, W, H); break;
      case "runway": inner = drawRunway(sample, W, H); break;
      case "ridge": inner = drawRidge(sample, W, H); break;
      case "spark": inner = drawSpark(sample, W, H); break;
      case "waffle": inner = drawWaffle(sample, W, H); break;
      case "bubblepie": inner = drawBubblepie(sample, W, H); break;
      case "nested": inner = drawNested(sample, W, H); break;
      case "circular": inner = drawCircular(sample, W, H); break;
      case "radarbubble": inner = drawRadarbubble(sample, W, H); break;
      default: inner = drawBars(sample, W, H);
    }
  } catch (e) {
    inner = svgText(W / 2, H / 2, "示例图渲染失败：" + e.message, "cs-err");
  }
  return `<svg class="cs-svg" viewBox="0 0 ${W} ${H}" role="img" preserveAspectRatio="xMidYMid meet"><defs><marker id="csArrow" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6 z" fill="#7d94ab"/></marker></defs>${inner}</svg>`;
}
