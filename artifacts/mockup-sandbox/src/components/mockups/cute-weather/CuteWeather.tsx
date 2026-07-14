import { useState, useEffect } from "react";
import "./CuteWeather.css";

type WeatherType = "sunny" | "rainy" | "windy" | "snowy";

const scenes: { type: WeatherType; label: string; emoji: string }[] = [
  { type: "sunny", label: "Sunny", emoji: "☀️" },
  { type: "rainy", label: "Rainy", emoji: "🌧️" },
  { type: "windy", label: "Windy", emoji: "💨" },
  { type: "snowy", label: "Snowy", emoji: "❄️" },
];

const bgColors: Record<WeatherType, string> = {
  sunny: "linear-gradient(160deg, #FFE066 0%, #FFB347 50%, #FF8C42 100%)",
  rainy: "linear-gradient(160deg, #4A6FA5 0%, #6B8CBE 50%, #9BB5D5 100%)",
  windy: "linear-gradient(160deg, #7EC8C8 0%, #A8D8A8 50%, #C8E6C9 100%)",
  snowy: "linear-gradient(160deg, #B8D4E8 0%, #D6EAF8 50%, #EBF5FB 100%)",
};

// ── Sun ──────────────────────────────────────────────────────────────────────
function SunFace() {
  return (
    <div className="cw-sun-wrap">
      <div className="cw-sun-glow" />
      <div className="cw-sun-rays">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="cw-ray" style={{ transform: `rotate(${i * 45}deg)` }} />
        ))}
      </div>
      <div className="cw-sun-body">
        {/* eyes */}
        <div className="cw-sun-eyes">
          <div className="cw-eye cw-eye-left">
            <div className="cw-pupil" />
          </div>
          <div className="cw-eye cw-eye-right">
            <div className="cw-pupil" />
          </div>
        </div>
        {/* blush */}
        <div className="cw-sun-blush">
          <div className="cw-blush-dot" />
          <div className="cw-blush-dot" />
        </div>
        {/* smile */}
        <div className="cw-smile" />
      </div>
    </div>
  );
}

// ── Rain ─────────────────────────────────────────────────────────────────────
function Raindrop({ delay }: { delay: number }) {
  return (
    <div className="cw-drop-wrap" style={{ animationDelay: `${delay}s` }}>
      <div className="cw-drop-body">
        <div className="cw-drop-eye" />
        <div className="cw-drop-eye" />
        <div className="cw-drop-smile" />
      </div>
      <div className="cw-drop-tail" />
    </div>
  );
}

function RainCloud() {
  return (
    <div className="cw-rain-scene">
      <div className="cw-cloud-body">
        <div className="cw-cloud-bump cw-bump1" />
        <div className="cw-cloud-bump cw-bump2" />
        <div className="cw-cloud-bump cw-bump3" />
        <div className="cw-cloud-face">
          <div className="cw-cloud-eye" />
          <div className="cw-cloud-eye" />
          <div className="cw-cloud-frown" />
        </div>
        <div className="cw-cloud-base" />
      </div>
      <div className="cw-drops-row">
        {[0, 0.2, 0.4, 0.15, 0.35, 0.05].map((d, i) => (
          <Raindrop key={i} delay={d} />
        ))}
      </div>
    </div>
  );
}

// ── Wind ─────────────────────────────────────────────────────────────────────
function WindFace() {
  return (
    <div className="cw-wind-scene">
      {/* Main wind puff face */}
      <div className="cw-wind-face">
        <div className="cw-wind-cheek-puff" />
        <div className="cw-eye cw-wind-eye-l"><div className="cw-pupil" /></div>
        <div className="cw-eye cw-wind-eye-r"><div className="cw-pupil" /></div>
        <div className="cw-wind-mouth" />
        <div className="cw-wind-blow-dot" />
      </div>
      {/* Wind lines */}
      <div className="cw-wind-lines">
        {[
          { w: 180, delay: 0,    top: "0px"  },
          { w: 140, delay: 0.3,  top: "28px" },
          { w: 200, delay: 0.15, top: "56px" },
          { w: 120, delay: 0.5,  top: "84px" },
          { w: 160, delay: 0.1,  top: "112px"},
        ].map((line, i) => (
          <div
            key={i}
            className="cw-wind-line"
            style={{ width: line.w, animationDelay: `${line.delay}s`, top: line.top }}
          />
        ))}
      </div>
    </div>
  );
}

// ── Snow ─────────────────────────────────────────────────────────────────────
function Snowflake({ delay, left, size }: { delay: number; left: string; size: number }) {
  return (
    <div
      className="cw-snowflake"
      style={{ animationDelay: `${delay}s`, left, fontSize: size }}
    >
      ❄
    </div>
  );
}

function SnowScene() {
  const flakes = [
    { delay: 0,   left: "10%", size: 24 },
    { delay: 0.5, left: "25%", size: 18 },
    { delay: 1.0, left: "40%", size: 28 },
    { delay: 0.3, left: "60%", size: 20 },
    { delay: 0.7, left: "75%", size: 22 },
    { delay: 1.2, left: "88%", size: 16 },
  ];
  return (
    <div className="cw-snow-scene">
      <div className="cw-snow-cloud">
        <div className="cw-cloud-bump cw-bump1" />
        <div className="cw-cloud-bump cw-bump2" />
        <div className="cw-cloud-bump cw-bump3" />
        <div className="cw-cloud-face">
          <div className="cw-cloud-eye" />
          <div className="cw-cloud-eye" />
          <div className="cw-cloud-smile-small" />
        </div>
        <div className="cw-cloud-base" style={{ background: "#d6eaf8" }} />
      </div>
      <div className="cw-snowflakes-field">
        {flakes.map((f, i) => (
          <Snowflake key={i} {...f} />
        ))}
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export function CuteWeather() {
  const [active, setActive] = useState<WeatherType>("sunny");

  return (
    <div className="cw-root" style={{ background: bgColors[active] }}>
      {/* Tabs */}
      <div className="cw-tabs">
        {scenes.map((s) => (
          <button
            key={s.type}
            className={`cw-tab ${active === s.type ? "cw-tab-active" : ""}`}
            onClick={() => setActive(s.type)}
          >
            {s.emoji} {s.label}
          </button>
        ))}
      </div>

      {/* Scene */}
      <div className="cw-stage">
        {active === "sunny" && <SunFace />}
        {active === "rainy" && <RainCloud />}
        {active === "windy" && <WindFace />}
        {active === "snowy" && <SnowScene />}
      </div>

      {/* Label */}
      <div className="cw-label">
        {scenes.find((s) => s.type === active)?.label}
      </div>
    </div>
  );
}
