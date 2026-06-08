"use client";

import { useState } from "react";

/**
 * MiniChart — Lightweight SVG chart component
 * Supports "bar" and "area" variants.
 * No external chart library required.
 */

const CHART_COLORS = {
  blue: { fill: "rgba(110, 142, 168, 0.4)", stroke: "#6e8ea8", bar: "rgba(110, 142, 168, 0.6)" },
  green: { fill: "rgba(74, 222, 128, 0.2)", stroke: "#4ade80", bar: "rgba(74, 222, 128, 0.5)" },
  amber: { fill: "rgba(251, 191, 36, 0.2)", stroke: "#fbbf24", bar: "rgba(251, 191, 36, 0.5)" },
};

function BarChart({ data, labels, color = "blue", width = 320, height = 140 }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const palette = CHART_COLORS[color] || CHART_COLORS.blue;
  const max = Math.max(...data, 1);
  const barCount = data.length;
  const gap = 6;
  const barW = (width - gap * (barCount + 1)) / barCount;

  return (
    <svg
      width={width}
      height={height + 24}
      viewBox={`0 0 ${width} ${height + 24}`}
      style={{ display: "block" }}
    >
      {/* Grid lines */}
      {[0.25, 0.5, 0.75, 1].map((frac) => (
        <line
          key={frac}
          x1={0}
          y1={height - height * frac}
          x2={width}
          y2={height - height * frac}
          stroke="rgba(255,255,255,0.04)"
          strokeDasharray="4 4"
        />
      ))}

      {data.map((val, i) => {
        const barH = (val / max) * (height - 12);
        const x = gap + i * (barW + gap);
        const y = height - barH;
        const isHovered = hoveredIndex === i;

        return (
          <g key={i}>
            <rect
              x={x}
              y={y}
              width={barW}
              height={barH}
              rx={4}
              fill={palette.bar}
              opacity={isHovered ? 1 : 0.7}
              style={{ transition: "opacity 0.15s ease, y 0.2s ease, height 0.2s ease" }}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            />
            {/* Value tooltip on hover */}
            {isHovered && (
              <text
                x={x + barW / 2}
                y={y - 6}
                textAnchor="middle"
                fill="var(--text-white)"
                fontSize="11"
                fontFamily="var(--font-body)"
                fontWeight="600"
              >
                {val}
              </text>
            )}
            {/* Label */}
            {labels?.[i] && (
              <text
                x={x + barW / 2}
                y={height + 16}
                textAnchor="middle"
                fill="var(--text-muted)"
                fontSize="10"
                fontFamily="var(--font-body)"
              >
                {labels[i]}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

function AreaChart({ data, color = "blue", width = 320, height = 100 }) {
  const palette = CHART_COLORS[color] || CHART_COLORS.blue;
  const max = Math.max(...data, 1);
  const padY = 8;

  const points = data.map((val, i) => ({
    x: (i / (data.length - 1)) * width,
    y: height - padY - ((val / max) * (height - padY * 2)),
  }));

  // Build smooth path using cardinal spline
  const linePath = points.map((p, i) => (i === 0 ? `M ${p.x},${p.y}` : `L ${p.x},${p.y}`)).join(" ");
  const areaPath = `${linePath} L ${width},${height} L 0,${height} Z`;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ display: "block" }}
    >
      <defs>
        <linearGradient id={`area-grad-${color}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={palette.fill} />
          <stop offset="100%" stopColor="transparent" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill={`url(#area-grad-${color})`} />
      <path d={linePath} fill="none" stroke={palette.stroke} strokeWidth="2" strokeLinecap="round" />
      {/* Dots */}
      {points.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="3" fill={palette.stroke} opacity="0.8" />
      ))}
    </svg>
  );
}

export default function MiniChart({ variant = "bar", ...props }) {
  if (variant === "area") return <AreaChart {...props} />;
  return <BarChart {...props} />;
}
