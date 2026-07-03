import type { PipelineMetrics } from "../types";

const METRIC_ROWS: { key: keyof PipelineMetrics; label: string; color: string }[] = [
  { key: "recording_duration_s", label: "Recording", color: "#f9a8d4" },
  { key: "stt_latency_s", label: "STT", color: "#86efac" },
  { key: "llm_latency_s", label: "LLM", color: "#fde68a" },
  { key: "tts_latency_s", label: "TTS", color: "#c4b5fd" },
  { key: "playback_start_delay_s", label: "Playback", color: "#67e8f9" },
];

interface MetricsPanelProps {
  metrics: PipelineMetrics | null;
  averages: PipelineMetrics | null;
  runCount: number;
}

export function MetricsPanel({ metrics, averages, runCount }: MetricsPanelProps) {
  if (!metrics) return null;

  const maxBar = Math.max(
    ...METRIC_ROWS.map((r) => metrics[r.key]),
    metrics.end_to_end_latency_s * 0.25,
    0.1
  );

  return (
    <section className="metrics">
      <div className="metrics__header">
        <span className="metrics__title">✦ Pipeline Metrics</span>
        {runCount > 1 && (
          <span className="metrics__runs">{runCount} runs</span>
        )}
      </div>

      <div className="metrics__chart">
        {METRIC_ROWS.map((row) => (
          <Bar
            key={row.key}
            label={row.label}
            value={metrics[row.key]}
            avg={averages?.[row.key]}
            max={maxBar}
            color={row.color}
          />
        ))}
      </div>

      <div className="metrics__total">
        <span>End-to-End</span>
        <strong>{metrics.end_to_end_latency_s.toFixed(2)} s</strong>
        {averages && (
          <span className="metrics__avg">
            avg {averages.end_to_end_latency_s.toFixed(2)} s
          </span>
        )}
      </div>
    </section>
  );
}

function Bar({
  label,
  value,
  avg,
  max,
  color,
}: {
  label: string;
  value: number;
  avg?: number;
  max: number;
  color: string;
}) {
  const pct = Math.min(100, (value / max) * 100);

  return (
    <div className="metrics__row">
      <span className="metrics__label">{label}</span>
      <div className="metrics__bar-track">
        <div
          className="metrics__bar-fill"
          style={{ width: `${pct}%`, background: color }}
        />
        {avg !== undefined && (
          <div
            className="metrics__bar-avg"
            style={{ left: `${Math.min(100, (avg / max) * 100)}%` }}
            title={`avg: ${avg.toFixed(2)}s`}
          />
        )}
      </div>
      <span className="metrics__value">{value.toFixed(2)}s</span>
    </div>
  );
}
