"use client";

import { localPoint } from "@visx/event";
import { LinearGradient as VisxLinearGradient } from "@visx/gradient";
import { GridColumns, GridRows } from "@visx/grid";
import { ParentSize } from "@visx/responsive";
import { scaleBand, scaleLinear } from "@visx/scale";
import {
  AnimatePresence,
  motion,
  useSpring,
} from "motion/react";
import {
  Children,
  createContext,
  isValidElement,
  useCallback,
  useContext,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type Dispatch,
  type ReactNode,
  type RefObject,
  type SetStateAction,
} from "react";
import useMeasure from "react-use-measure";
import { createPortal } from "react-dom";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const chartCssVars = {
  background: "var(--chart-background)",
  foreground: "var(--chart-foreground)",
  foregroundMuted: "var(--chart-foreground-muted)",
  label: "var(--chart-label)",
  linePrimary: "var(--chart-line-primary)",
  lineSecondary: "var(--chart-line-secondary)",
  crosshair: "var(--chart-crosshair)",
  grid: "var(--chart-grid)",
};

export interface Margin {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface TooltipData {
  point: Record<string, unknown>;
  index: number;
  x: number;
  yPositions: Record<string, number>;
  xPositions?: Record<string, number>;
}

export interface TooltipRow {
  color: string;
  label: string;
  value: string | number;
}

export interface LineConfig {
  dataKey: string;
  stroke: string;
  strokeWidth: number;
}

type ScaleLinearType<Output> = ReturnType<typeof scaleLinear<Output>>;
type ScaleBandType<Domain extends { toString(): string }> = ReturnType<typeof scaleBand<Domain>>;

export interface BarChartContextValue {
  data: Record<string, unknown>[];
  xScale: ScaleBandType<string>;
  yScale: ScaleLinearType<number>;
  width: number;
  height: number;
  innerWidth: number;
  innerHeight: number;
  margin: Margin;
  bandWidth: number;
  tooltipData: TooltipData | null;
  setTooltipData: Dispatch<SetStateAction<TooltipData | null>>;
  containerRef: RefObject<HTMLDivElement | null>;
  bars: BarConfig[];
  isLoaded: boolean;
  animationDuration: number;
  xDataKey: string;
  hoveredBarIndex: number | null;
  setHoveredBarIndex: (index: number | null) => void;
  orientation: "vertical" | "horizontal";
  stacked: boolean;
  stackGap: number;
  stackOffsets: Map<number, Map<string, number>>;
  barGap: number;
  barWidth?: number;
}

interface BarConfig {
  dataKey: string;
  fill: string;
  stroke?: string;
}

const BarChartContext = createContext<BarChartContextValue | null>(null);

function BarChartProvider({ children, value }: { children: ReactNode; value: BarChartContextValue }) {
  return <BarChartContext.Provider value={value}>{children}</BarChartContext.Provider>;
}

export function useChart(): BarChartContextValue {
  const context = useContext(BarChartContext);
  if (!context) throw new Error("useChart must be used within a BarChartProvider.");
  return context;
}

// ─── TooltipDot ───────────────────────────────────────────────────────────────

function TooltipDot({ x, y, visible, color, size = 5, strokeColor = chartCssVars.background, strokeWidth = 2 }: {
  x: number; y: number; visible: boolean; color: string; size?: number; strokeColor?: string; strokeWidth?: number;
}) {
  const sc = { stiffness: 300, damping: 30 };
  const ax = useSpring(x, sc);
  const ay = useSpring(y, sc);
  useEffect(() => { ax.set(x); ay.set(y); }, [x, y, ax, ay]);
  if (!visible) return null;
  return <motion.circle cx={ax} cy={ay} fill={color} r={size} stroke={strokeColor} strokeWidth={strokeWidth} />;
}

// ─── TooltipIndicator ─────────────────────────────────────────────────────────

function TooltipIndicator({ x, height, visible, width = 1, colorEdge = chartCssVars.crosshair, colorMid = chartCssVars.crosshair, fadeEdges = true, gradientId = "bar-tooltip-indicator-gradient" }: {
  x: number; height: number; visible: boolean; width?: number; colorEdge?: string; colorMid?: string; fadeEdges?: boolean; gradientId?: string;
}) {
  const sc = { stiffness: 300, damping: 30 };
  const ax = useSpring(x - width / 2, sc);
  useEffect(() => { ax.set(x - width / 2); }, [x, ax, width]);
  if (!visible) return null;
  const eo = fadeEdges ? 0 : 1;
  return (
    <g>
      <defs>
        <linearGradient id={gradientId} x1="0%" x2="0%" y1="0%" y2="100%">
          <stop offset="0%"   style={{ stopColor: colorEdge, stopOpacity: eo }} />
          <stop offset="10%"  style={{ stopColor: colorEdge, stopOpacity: 1 }} />
          <stop offset="50%"  style={{ stopColor: colorMid,  stopOpacity: 1 }} />
          <stop offset="90%"  style={{ stopColor: colorEdge, stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: colorEdge, stopOpacity: eo }} />
        </linearGradient>
      </defs>
      <motion.rect fill={`url(#${gradientId})`} height={height} width={width} x={ax} y={0} />
    </g>
  );
}

// ─── TooltipContent ───────────────────────────────────────────────────────────

function TooltipContent({ title, rows, children }: { title?: string; rows: TooltipRow[]; children?: ReactNode }) {
  const [measureRef, bounds] = useMeasure({ debounce: 0, scroll: false });
  const [committedHeight, setCommittedHeight] = useState<number | null>(null);
  const committedChildrenStateRef = useRef<boolean | null>(null);
  const frameRef = useRef<number | null>(null);
  const hasChildren = !!children;
  const markerKey = hasChildren ? "has-marker" : "no-marker";
  const isWaiting = committedChildrenStateRef.current !== null && committedChildrenStateRef.current !== hasChildren;

  useEffect(() => {
    if (bounds.height <= 0) return;
    if (frameRef.current) { cancelAnimationFrame(frameRef.current); frameRef.current = null; }
    if (isWaiting) {
      frameRef.current = requestAnimationFrame(() => {
        frameRef.current = requestAnimationFrame(() => {
          setCommittedHeight(bounds.height);
          committedChildrenStateRef.current = hasChildren;
        });
      });
    } else {
      setCommittedHeight(bounds.height);
      committedChildrenStateRef.current = hasChildren;
    }
    return () => { if (frameRef.current) cancelAnimationFrame(frameRef.current); };
  }, [bounds.height, hasChildren, isWaiting]);

  return (
    <motion.div
      animate={committedHeight !== null ? { height: committedHeight } : undefined}
      className="overflow-hidden"
      initial={false}
      transition={committedHeight !== null ? { type: "spring", stiffness: 500, damping: 35, mass: 0.8 } : { duration: 0 }}
    >
      <div className="px-3 py-2.5" ref={measureRef}>
        {title && <div className="mb-2 font-medium text-[var(--chart-tooltip-foreground)] text-xs">{title}</div>}
        <div className="space-y-1.5">
          {rows.map((row) => (
            <div className="flex items-center justify-between gap-4" key={`${row.label}-${row.color}`}>
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: row.color }} />
                <span className="text-xs" style={{ color: "var(--chart-tooltip-muted)" }}>{row.label}</span>
              </div>
              <span className="font-medium text-xs tabular-nums" style={{ color: "var(--chart-tooltip-foreground)" }}>
                {typeof row.value === "number" ? row.value.toLocaleString() : row.value}
              </span>
            </div>
          ))}
        </div>
        <AnimatePresence mode="wait">
          {children && (
            <motion.div animate={{ opacity: 1, filter: "blur(0px)" }} className="mt-2" exit={{ opacity: 0, filter: "blur(4px)" }} initial={{ opacity: 0, filter: "blur(4px)" }} key={markerKey} transition={{ duration: 0.2, ease: "easeOut" }}>
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// ─── TooltipBox ───────────────────────────────────────────────────────────────

function TooltipBox({ x, y, visible, containerRef, containerWidth, containerHeight, offset = 16, className = "", children, top: topOverride }: {
  x: number; y: number; visible: boolean; containerRef: RefObject<HTMLDivElement | null>; containerWidth: number; containerHeight: number; offset?: number; className?: string; children: ReactNode; top?: number | ReturnType<typeof useSpring>;
}) {
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [tooltipWidth, setTooltipWidth] = useState(180);
  const [tooltipHeight, setTooltipHeight] = useState(80);
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  useLayoutEffect(() => {
    if (tooltipRef.current) {
      const w = tooltipRef.current.offsetWidth;
      const h = tooltipRef.current.offsetHeight;
      if (w > 0 && w !== tooltipWidth) setTooltipWidth(w);
      if (h > 0 && h !== tooltipHeight) setTooltipHeight(h);
    }
  }, [tooltipWidth, tooltipHeight]);

  const shouldFlipX = x + tooltipWidth + offset > containerWidth;
  const targetX = shouldFlipX ? x - offset - tooltipWidth : x + offset;
  const targetY = Math.max(offset, Math.min(y - tooltipHeight / 2, containerHeight - tooltipHeight - offset));
  const prevFlipRef = useRef(shouldFlipX);
  const [flipKey, setFlipKey] = useState(0);
  useEffect(() => {
    if (prevFlipRef.current !== shouldFlipX) { setFlipKey((k) => k + 1); prevFlipRef.current = shouldFlipX; }
  }, [shouldFlipX]);

  const sc = { stiffness: 100, damping: 20 };
  const al = useSpring(targetX, sc);
  const at = useSpring(targetY, sc);
  useEffect(() => { al.set(targetX); }, [targetX, al]);
  useEffect(() => { at.set(targetY); }, [targetY, at]);

  const finalTop = topOverride ?? at;
  const container = containerRef.current;
  if (!(mounted && container) || !visible) return null;

  return createPortal(
    <motion.div animate={{ opacity: 1 }} className={cn("pointer-events-none absolute z-50", className)} exit={{ opacity: 0 }} initial={{ opacity: 0 }} ref={tooltipRef} style={{ left: al, top: finalTop }} transition={{ duration: 0.1 }}>
      <motion.div animate={{ scale: 1, opacity: 1, x: 0 }} className="min-w-[140px] overflow-hidden rounded-lg shadow-lg backdrop-blur-md" initial={{ scale: 0.85, opacity: 0, x: shouldFlipX ? 20 : -20 }} key={flipKey} style={{ transformOrigin: shouldFlipX ? "right top" : "left top", backgroundColor: "var(--chart-tooltip-background)", color: "var(--chart-tooltip-foreground)" }} transition={{ type: "spring", stiffness: 300, damping: 25 }}>
        {children}
      </motion.div>
    </motion.div>,
    container
  );
}

// ─── ChartTooltip ─────────────────────────────────────────────────────────────

export interface ChartTooltipProps {
  showCrosshair?: boolean;
  showDots?: boolean;
  content?: (props: { point: Record<string, unknown>; index: number }) => ReactNode;
  rows?: (point: Record<string, unknown>) => TooltipRow[];
  children?: ReactNode;
  className?: string;
}

export function ChartTooltip({ showCrosshair = true, showDots = true, content, rows: rowsRenderer, children, className = "" }: ChartTooltipProps) {
  const { tooltipData, width, height, innerHeight, margin, bars, xDataKey, containerRef, orientation } = useChart();
  const isHorizontal = orientation === "horizontal";
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const visible = tooltipData !== null;
  const x = tooltipData?.x ?? 0;
  const xWithMargin = x + margin.left;
  const firstBarY = bars[0]?.dataKey ? (tooltipData?.yPositions[bars[0].dataKey] ?? 0) : 0;
  const yWithMargin = firstBarY + margin.top;

  const sc = { stiffness: 300, damping: 30 };
  const ax = useSpring(xWithMargin, sc);
  useEffect(() => { ax.set(xWithMargin); }, [xWithMargin, ax]);

  const tooltipRows = useMemo(() => {
    if (!tooltipData) return [];
    if (rowsRenderer) return rowsRenderer(tooltipData.point);
    return bars.map((bar) => ({ color: bar.stroke || bar.fill, label: bar.dataKey, value: (tooltipData.point[bar.dataKey] as number) ?? 0 }));
  }, [tooltipData, bars, rowsRenderer]);

  const title = useMemo(() => tooltipData ? String(tooltipData.point[xDataKey] ?? "") : undefined, [tooltipData, xDataKey]);
  const container = containerRef.current;
  if (!(mounted && container)) return null;

  return createPortal(
    <>
      {showCrosshair && !isHorizontal && (
        <svg aria-hidden="true" className="pointer-events-none absolute inset-0" height="100%" width="100%">
          <g transform={`translate(${margin.left},${margin.top})`}>
            <TooltipIndicator height={innerHeight} visible={visible} width={1} x={x} />
          </g>
        </svg>
      )}
      {showDots && visible && !isHorizontal && (
        <svg aria-hidden="true" className="pointer-events-none absolute inset-0" height="100%" width="100%">
          <g transform={`translate(${margin.left},${margin.top})`}>
            {bars.map((bar) => (
              <TooltipDot color={bar.stroke || bar.fill} key={bar.dataKey} strokeColor={chartCssVars.background} visible={visible} x={tooltipData?.xPositions?.[bar.dataKey] ?? x} y={tooltipData?.yPositions[bar.dataKey] ?? 0} />
            ))}
          </g>
        </svg>
      )}
      <TooltipBox className={className} containerHeight={height} containerRef={containerRef} containerWidth={width} top={isHorizontal ? undefined : margin.top} visible={visible} x={xWithMargin} y={isHorizontal ? yWithMargin : margin.top}>
        {content ? content({ point: tooltipData?.point ?? {}, index: tooltipData?.index ?? 0 }) : <TooltipContent rows={tooltipRows} title={title}>{children}</TooltipContent>}
      </TooltipBox>
    </>,
    container
  );
}

ChartTooltip.displayName = "ChartTooltip";

// ─── Grid ─────────────────────────────────────────────────────────────────────

export interface GridProps {
  horizontal?: boolean; vertical?: boolean; numTicksRows?: number; numTicksColumns?: number;
  rowTickValues?: number[]; stroke?: string; strokeOpacity?: number; strokeWidth?: number;
  strokeDasharray?: string; fadeHorizontal?: boolean; fadeVertical?: boolean;
}

export function Grid({ horizontal = true, vertical = false, numTicksRows = 5, numTicksColumns = 10, rowTickValues, stroke = chartCssVars.grid, strokeOpacity = 1, strokeWidth = 1, strokeDasharray = "4,4", fadeHorizontal = true, fadeVertical = false }: GridProps) {
  const { xScale, yScale, innerWidth, innerHeight, orientation } = useChart();
  const isHorizontalBar = orientation === "horizontal";
  const columnScale = isHorizontalBar ? yScale : xScale;
  const uniqueId = useId();
  const hMaskId = `grid-rows-fade-${uniqueId}`;
  const hGradientId = `${hMaskId}-gradient`;
  const vMaskId = `grid-cols-fade-${uniqueId}`;
  const vGradientId = `${vMaskId}-gradient`;

  return (
    <g className="chart-grid">
      {horizontal && fadeHorizontal && (
        <defs>
          <linearGradient id={hGradientId} x1="0%" x2="100%" y1="0%" y2="0%">
            <stop offset="0%"   style={{ stopColor: "white", stopOpacity: 0 }} />
            <stop offset="10%"  style={{ stopColor: "white", stopOpacity: 1 }} />
            <stop offset="90%"  style={{ stopColor: "white", stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: "white", stopOpacity: 0 }} />
          </linearGradient>
          <mask id={hMaskId}><rect fill={`url(#${hGradientId})`} height={innerHeight} width={innerWidth} x="0" y="0" /></mask>
        </defs>
      )}
      {vertical && fadeVertical && (
        <defs>
          <linearGradient id={vGradientId} x1="0%" x2="0%" y1="0%" y2="100%">
            <stop offset="0%"   style={{ stopColor: "white", stopOpacity: 0 }} />
            <stop offset="10%"  style={{ stopColor: "white", stopOpacity: 1 }} />
            <stop offset="90%"  style={{ stopColor: "white", stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: "white", stopOpacity: 0 }} />
          </linearGradient>
          <mask id={vMaskId}><rect fill={`url(#${vGradientId})`} height={innerHeight} width={innerWidth} x="0" y="0" /></mask>
        </defs>
      )}
      {horizontal && (
        <g mask={fadeHorizontal ? `url(#${hMaskId})` : undefined}>
          <GridRows numTicks={rowTickValues ? undefined : numTicksRows} scale={yScale} stroke={stroke} strokeDasharray={strokeDasharray} strokeOpacity={strokeOpacity} strokeWidth={strokeWidth} tickValues={rowTickValues} width={innerWidth} />
        </g>
      )}
      {vertical && columnScale && typeof columnScale === "function" && (
        <g mask={fadeVertical ? `url(#${vMaskId})` : undefined}>
          <GridColumns height={innerHeight} numTicks={numTicksColumns} scale={columnScale} stroke={stroke} strokeDasharray={strokeDasharray} strokeOpacity={strokeOpacity} strokeWidth={strokeWidth} />
        </g>
      )}
    </g>
  );
}

Grid.displayName = "Grid";

// ─── BarXAxis ─────────────────────────────────────────────────────────────────

export function BarXAxis({ tickerHalfWidth = 50, showAllLabels = false, maxLabels = 12 }: { tickerHalfWidth?: number; showAllLabels?: boolean; maxLabels?: number }) {
  const { xScale, margin, tooltipData, containerRef, bandWidth } = useChart();
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const labelsToShow = useMemo(() => {
    const domain = xScale.domain();
    if (domain.length === 0) return [];
    let labels = domain.map((label) => ({ label, x: (xScale(label) ?? 0) + bandWidth / 2 + margin.left }));
    if (!showAllLabels && labels.length > maxLabels) {
      const step = Math.ceil(labels.length / maxLabels);
      labels = labels.filter((_, i) => i % step === 0);
    }
    return labels;
  }, [xScale, margin.left, bandWidth, showAllLabels, maxLabels]);

  const isHovering = tooltipData !== null;
  const crosshairX = tooltipData ? tooltipData.x + margin.left : null;
  const container = containerRef.current;
  if (!(mounted && container)) return null;

  return createPortal(
    <div className="pointer-events-none absolute inset-0">
      {labelsToShow.map((item) => {
        let opacity = 1;
        if (isHovering && crosshairX !== null) {
          const fadeBuffer = 20;
          const fadeRadius = tickerHalfWidth + fadeBuffer;
          const distance = Math.abs(item.x - crosshairX);
          if (distance < tickerHalfWidth) opacity = 0;
          else if (distance < fadeRadius) opacity = (distance - tickerHalfWidth) / fadeBuffer;
        }
        return (
          <div className="absolute" key={item.label} style={{ left: item.x, bottom: 12, width: 0, display: "flex", justifyContent: "center" }}>
            <motion.span animate={{ opacity }} className="whitespace-nowrap text-xs" initial={{ opacity: 1 }} style={{ color: "var(--chart-label)" }} transition={{ duration: 0.4, ease: "easeInOut" }}>
              {item.label}
            </motion.span>
          </div>
        );
      })}
    </div>,
    container
  );
}

BarXAxis.displayName = "BarXAxis";

// ─── Bar ──────────────────────────────────────────────────────────────────────

export interface BarProps {
  dataKey: string; fill?: string; stroke?: string; lineCap?: "round" | "butt" | number;
  animate?: boolean; animationType?: "grow" | "fade"; fadedOpacity?: number; staggerDelay?: number; stackGap?: number;
}

function resolveRadius(lineCap: "round" | "butt" | number, barWidth: number): number {
  if (lineCap === "butt") return 0;
  if (lineCap === "round") return barWidth / 2;
  return lineCap;
}

export function Bar({ dataKey, fill = chartCssVars.linePrimary, stroke, lineCap = "round", animate = true, animationType = "grow", fadedOpacity = 0.3, staggerDelay, stackGap = 0 }: BarProps) {
  const { data, xScale, yScale, innerHeight, innerWidth, bandWidth, hoveredBarIndex, isLoaded, animationDuration, xDataKey, orientation, stacked, stackOffsets, bars, barWidth: fixedBarWidth } = useChart();
  const isHorizontal = orientation === "horizontal";
  const barIndex = bars.findIndex((b) => b.dataKey === dataKey);
  const barCount = bars.length;
  const singleBarWidth = stacked ? bandWidth : bandWidth / barCount;
  const actualBarWidth = fixedBarWidth ?? singleBarWidth;
  const radius = resolveRadius(lineCap, actualBarWidth);
  const autoStagger = staggerDelay ?? Math.min(0.06, 0.8 / data.length);

  return (
    <>
      {data.map((d, i) => {
        const category = String(d[xDataKey] ?? "");
        const value = typeof d[dataKey] === "number" ? (d[dataKey] as number) : 0;
        const bandStart = xScale(category) ?? 0;
        const stackOffset = stacked ? stackOffsets.get(i)?.get(dataKey) ?? 0 : 0;

        let barX: number, barY: number, barW: number, barH: number;
        if (isHorizontal) {
          const barLength = innerWidth - (yScale(value) ?? innerWidth);
          barY = bandStart + (stacked ? 0 : barIndex * singleBarWidth);
          barH = actualBarWidth; barW = barLength; barX = stacked ? stackOffset : 0;
          if (stacked && stackGap > 0 && barIndex > 0) { barX += stackGap; barW = Math.max(0, barW - stackGap); }
        } else {
          const scaledY = yScale(value) ?? innerHeight;
          barX = bandStart + (stacked ? 0 : barIndex * singleBarWidth);
          barW = actualBarWidth; barH = innerHeight - scaledY; barY = stacked ? scaledY - stackOffset : scaledY;
          if (stacked && stackGap > 0 && barIndex > 0) { barY += stackGap; barH = Math.max(0, barH - stackGap); }
        }

        if (barW <= 0 || barH <= 0) return null;

        const isHovered = hoveredBarIndex === i;
        const someoneHovered = hoveredBarIndex !== null;
        const barOpacity = someoneHovered ? (isHovered ? 1 : fadedOpacity) : 1;
        const delay = i * autoStagger;
        const r = Math.min(radius, barW / 2, barH / 2);
        let path: string;
        if (isHorizontal) {
          path = `M${barX},${barY} L${barX + barW - r},${barY} Q${barX + barW},${barY} ${barX + barW},${barY + r} L${barX + barW},${barY + barH - r} Q${barX + barW},${barY + barH} ${barX + barW - r},${barY + barH} L${barX},${barY + barH}Z`;
        } else {
          path = `M${barX},${barY + barH} L${barX},${barY + r} Q${barX},${barY} ${barX + r},${barY} L${barX + barW - r},${barY} Q${barX + barW},${barY} ${barX + barW},${barY + r} L${barX + barW},${barY + barH}Z`;
        }

        const originX = isHorizontal ? barX : barX + barW / 2;
        const originY = isHorizontal ? barY + barH / 2 : innerHeight;
        const shouldAnimateEntry = animate && !isLoaded;
        const growInitial = isHorizontal ? { scaleX: 0, opacity: 0 } : { scaleY: 0, opacity: 0 };
        const growAnimate = isHorizontal ? { scaleX: 1, opacity: barOpacity } : { scaleY: 1, opacity: barOpacity };
        const growTransition = {
          [isHorizontal ? "scaleX" : "scaleY"]: { duration: animationDuration / 1000, ease: [0.85, 0, 0.15, 1] as [number, number, number, number], delay },
          opacity: { duration: 0.3, ease: "easeInOut" as const },
        };

        return (
          <motion.path
            key={`${category}-${dataKey}`}
            d={path}
            fill={fill}
            style={{ transformOrigin: `${originX}px ${originY}px` }}
            initial={shouldAnimateEntry && animationType === "grow" ? growInitial : shouldAnimateEntry && animationType === "fade" ? { opacity: 0, filter: "blur(4px)" } : { opacity: barOpacity }}
            animate={shouldAnimateEntry && animationType === "grow" ? growAnimate : shouldAnimateEntry && animationType === "fade" ? { opacity: barOpacity, filter: "blur(0px)" } : { opacity: barOpacity }}
            transition={shouldAnimateEntry && animationType === "grow" ? growTransition : shouldAnimateEntry && animationType === "fade" ? { duration: 0.5, delay, ease: "easeOut" } : { opacity: { duration: 0.3, ease: "easeInOut" } }}
          />
        );
      })}
    </>
  );
}

Bar.displayName = "Bar";

// ─── BarChart ─────────────────────────────────────────────────────────────────

function extractBarConfigs(children: ReactNode): BarConfig[] {
  const configs: BarConfig[] = [];
  Children.forEach(children, (child) => {
    if (!isValidElement(child)) return;
    const childType = child.type as { displayName?: string; name?: string };
    const componentName = typeof child.type === "function" ? childType.displayName || childType.name || "" : "";
    const props = child.props as BarProps | undefined;
    const isBarComponent = componentName === "Bar" || child.type === Bar || (props && typeof props.dataKey === "string" && props.dataKey.length > 0);
    if (isBarComponent && props?.dataKey) {
      configs.push({ dataKey: props.dataKey, fill: props.fill || "var(--chart-line-primary)", stroke: props.stroke });
    }
  });
  return configs;
}

export interface BarChartProps {
  data: Record<string, unknown>[]; xDataKey?: string; margin?: Partial<Margin>; animationDuration?: number;
  aspectRatio?: string; barGap?: number; barWidth?: number; orientation?: "vertical" | "horizontal";
  stacked?: boolean; stackGap?: number; className?: string; children: ReactNode;
}

const DEFAULT_MARGIN: Margin = { top: 40, right: 40, bottom: 40, left: 40 };

interface BarChartInnerProps {
  width: number; height: number; data: Record<string, unknown>[]; xDataKey: string; margin: Margin;
  animationDuration: number; barGap: number; barWidth?: number; orientation: "vertical" | "horizontal";
  stacked: boolean; stackGap: number; children: ReactNode; containerRef: RefObject<HTMLDivElement | null>;
}

function BarChartInner({ width, height, data, xDataKey, margin, animationDuration, barGap, barWidth, orientation, stacked, stackGap, children, containerRef }: BarChartInnerProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hoveredBarIndex, setHoveredBarIndex] = useState<number | null>(null);
  const bars = useMemo(() => extractBarConfigs(children), [children]);
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  const isHorizontal = orientation === "horizontal";

  const xScale = useMemo(() => scaleBand<string>({ range: isHorizontal ? [0, innerHeight] : [0, innerWidth], domain: data.map((d) => String(d[xDataKey] ?? "")), padding: barGap }), [data, xDataKey, innerWidth, innerHeight, barGap, isHorizontal]);
  const bandWidth = xScale.bandwidth();

  const yScale = useMemo(() => {
    let maxValue = 0;
    if (stacked) {
      for (const d of data) { let sum = 0; for (const bar of bars) { const v = d[bar.dataKey]; if (typeof v === "number") sum += v; } if (sum > maxValue) maxValue = sum; }
    } else {
      for (const bar of bars) for (const d of data) { const v = d[bar.dataKey]; if (typeof v === "number" && v > maxValue) maxValue = v; }
    }
    if (maxValue === 0) maxValue = 100;
    return scaleLinear<number>({ range: isHorizontal ? [innerWidth, 0] : [innerHeight, 0], domain: [0, maxValue * 1.1], nice: true });
  }, [data, bars, innerWidth, innerHeight, stacked, isHorizontal]);

  const stackOffsets = useMemo(() => {
    if (!stacked) return new Map<number, Map<string, number>>();
    const offsets = new Map<number, Map<string, number>>();
    for (let i = 0; i < data.length; i++) {
      const d = data[i]!; let cumulative = 0; const barOffsets = new Map<string, number>();
      for (const bar of bars) {
        barOffsets.set(bar.dataKey, cumulative);
        const value = d[bar.dataKey];
        if (typeof value === "number") cumulative += isHorizontal ? innerWidth - (yScale(value) ?? innerWidth) : innerHeight - (yScale(value) ?? innerHeight);
      }
      offsets.set(i, barOffsets);
    }
    return offsets;
  }, [data, bars, stacked, yScale, innerHeight, innerWidth, isHorizontal]);

  const [tooltipData, setTooltipData] = useState<TooltipData | null>(null);
  useEffect(() => { const t = setTimeout(() => setIsLoaded(true), animationDuration); return () => clearTimeout(t); }, [animationDuration]);

  const handleMouseMove = useCallback((event: React.MouseEvent<SVGGElement>) => {
    const point = localPoint(event);
    if (!point) return;
    const chartX = point.x - margin.left;
    const chartY = point.y - margin.top;
    const domain = xScale.domain();
    let foundIndex = -1;
    for (let i = 0; i < domain.length; i++) {
      const cat = domain[i]!;
      const bandStart = xScale(cat) ?? 0;
      const bandEnd = bandStart + bandWidth;
      if (isHorizontal ? (chartY >= bandStart && chartY <= bandEnd) : (chartX >= bandStart && chartX <= bandEnd)) { foundIndex = i; break; }
    }
    if (foundIndex >= 0) {
      setHoveredBarIndex(foundIndex);
      const d = data[foundIndex]!;
      const yPositions: Record<string, number> = {};
      const xPositions: Record<string, number> = {};
      for (const bar of bars) {
        const value = d[bar.dataKey];
        if (typeof value === "number") {
          if (isHorizontal) { xPositions[bar.dataKey] = innerWidth - (yScale(value) ?? innerWidth); yPositions[bar.dataKey] = (xScale(domain[foundIndex]!) ?? 0) + bandWidth / 2; }
          else { yPositions[bar.dataKey] = yScale(value) ?? 0; xPositions[bar.dataKey] = (xScale(domain[foundIndex]!) ?? 0) + bandWidth / 2; }
        }
      }
      const tooltipX = isHorizontal ? innerWidth - (yScale(Number(d[bars[0]?.dataKey ?? ""] ?? 0)) ?? 0) : (xScale(domain[foundIndex]!) ?? 0) + bandWidth / 2;
      setTooltipData({ point: d, index: foundIndex, x: tooltipX, yPositions, xPositions });
    } else { setHoveredBarIndex(null); setTooltipData(null); }
  }, [xScale, yScale, data, bars, margin, bandWidth, isHorizontal, innerWidth]);

  const handleMouseLeave = useCallback(() => { setHoveredBarIndex(null); setTooltipData(null); }, []);
  if (width < 10 || height < 10) return null;

  const contextValue: BarChartContextValue = { data, xScale, yScale, width, height, innerWidth, innerHeight, margin, bandWidth, tooltipData, setTooltipData, containerRef, bars, isLoaded, animationDuration, xDataKey, hoveredBarIndex, setHoveredBarIndex, orientation, stacked, stackGap, stackOffsets, barGap, barWidth };

  return (
    <BarChartProvider value={contextValue}>
      <svg aria-hidden="true" height={height} width={width}>
        <rect fill="transparent" height={height} width={width} x={0} y={0} />
        <g onMouseMove={isLoaded ? handleMouseMove : undefined} onMouseLeave={isLoaded ? handleMouseLeave : undefined} style={{ cursor: isLoaded ? "crosshair" : "default", touchAction: "none" }} transform={`translate(${margin.left},${margin.top})`}>
          <rect fill="transparent" height={innerHeight} width={innerWidth} x={0} y={0} />
          {children}
        </g>
      </svg>
    </BarChartProvider>
  );
}

export function BarChart({ data, xDataKey = "name", margin: marginProp, animationDuration = 1100, aspectRatio = "2 / 1", barGap = 0.2, barWidth, orientation = "vertical", stacked = false, stackGap = 0, className = "", children }: BarChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const margin = { ...DEFAULT_MARGIN, ...marginProp };
  return (
    <div className={cn("relative w-full", className)} ref={containerRef} style={{ aspectRatio, touchAction: "none" }}>
      <ParentSize debounceTime={10}>
        {({ width, height }) => (
          <BarChartInner animationDuration={animationDuration} barGap={barGap} barWidth={barWidth} containerRef={containerRef} data={data} height={height} margin={margin} orientation={orientation} stacked={stacked} stackGap={stackGap} width={width} xDataKey={xDataKey}>
            {children}
          </BarChartInner>
        )}
      </ParentSize>
    </div>
  );
}

export default BarChart;

export { VisxLinearGradient as LinearGradient };

export function PatternLines({ id, width = 6, height = 6, stroke = "var(--chart-line-primary)", strokeWidth = 1, orientation = ["diagonal"] }: {
  id: string; width?: number; height?: number; stroke?: string; strokeWidth?: number; orientation?: ("diagonal" | "horizontal" | "vertical")[];
}) {
  const paths: string[] = [];
  for (const o of orientation) {
    if (o === "diagonal") { paths.push(`M0,${height}l${width},${-height}`); paths.push(`M${-width / 4},${height / 4}l${width / 2},${-height / 2}`); paths.push(`M${(3 * width) / 4},${height + height / 4}l${width / 2},${-height / 2}`); }
    else if (o === "horizontal") paths.push(`M0,${height / 2}l${width},0`);
    else if (o === "vertical") paths.push(`M${width / 2},0l0,${height}`);
  }
  return (
    <defs>
      <pattern id={id} width={width} height={height} patternUnits="userSpaceOnUse">
        <path d={paths.join(" ")} fill="none" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="square" />
      </pattern>
    </defs>
  );
}
