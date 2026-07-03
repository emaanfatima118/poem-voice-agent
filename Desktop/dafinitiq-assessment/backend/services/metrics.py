import json
import logging
from datetime import datetime, timezone
from pathlib import Path

LOG_DIR = Path(__file__).resolve().parent.parent / "logs"
METRICS_FILE = LOG_DIR / "pipeline_metrics.jsonl"

# ANSI colors for terminal output
CYAN = "\033[96m"
GREEN = "\033[92m"
YELLOW = "\033[93m"
MAGENTA = "\033[95m"
BLUE = "\033[94m"
BOLD = "\033[1m"
DIM = "\033[2m"
RESET = "\033[0m"

logger = logging.getLogger("pipeline.metrics")


def _ensure_log_dir() -> None:
    LOG_DIR.mkdir(parents=True, exist_ok=True)


def format_duration(seconds: float) -> str:
    return f"{seconds:.2f} s"


def log_pipeline_metrics(metrics: dict) -> None:
    """Print colorized, timestamped metrics table to the terminal."""
    ts = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC")

    lines = [
        "",
        f"{BOLD}{CYAN}========== AI Voice Pipeline Metrics =========={RESET}",
        f"{DIM}[{ts}]{RESET}",
        f"{GREEN}Recording Duration      {RESET}: {YELLOW}{format_duration(metrics.get('recording_duration_s', 0))}{RESET}",
        f"{GREEN}STT Latency             {RESET}: {YELLOW}{format_duration(metrics['stt_latency_s'])}{RESET}",
        f"{GREEN}LLM Latency             {RESET}: {YELLOW}{format_duration(metrics['llm_latency_s'])}{RESET}",
        f"{GREEN}TTS Latency             {RESET}: {YELLOW}{format_duration(metrics['tts_latency_s'])}{RESET}",
        f"{GREEN}Playback Start Delay    {RESET}: {YELLOW}{format_duration(metrics.get('playback_start_delay_s', 0))}{RESET}",
        f"{DIM}-----------------------------------------------{RESET}",
        f"{BOLD}{MAGENTA}End-to-End Latency      {RESET}: {BOLD}{YELLOW}{format_duration(metrics['end_to_end_latency_s'])}{RESET}",
        f"{BOLD}{CYAN}==============================================={RESET}",
        "",
    ]

    output = "\n".join(lines)
    print(output)
    logger.info("Pipeline metrics recorded", extra={"metrics": metrics})


def save_metrics(metrics: dict) -> None:
    """Append structured JSON metrics to a log file."""
    _ensure_log_dir()
    entry = {
        "timestamp": datetime.now(timezone.utc).isoformat(),
        **metrics,
    }
    with METRICS_FILE.open("a", encoding="utf-8") as f:
        f.write(json.dumps(entry) + "\n")


def get_average_metrics(limit: int = 20) -> dict | None:
    """Compute average metrics from the last N log entries."""
    if not METRICS_FILE.exists():
        return None

    entries: list[dict] = []
    with METRICS_FILE.open(encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if line:
                entries.append(json.loads(line))

    if not entries:
        return None

    recent = entries[-limit:]
    keys = [
        "recording_duration_s",
        "stt_latency_s",
        "llm_latency_s",
        "tts_latency_s",
        "playback_start_delay_s",
        "end_to_end_latency_s",
    ]

    averages: dict[str, float] = {}
    for key in keys:
        values = [e[key] for e in recent if key in e and e[key] is not None]
        if values:
            averages[key] = sum(values) / len(values)

    averages["run_count"] = len(recent)
    return averages
