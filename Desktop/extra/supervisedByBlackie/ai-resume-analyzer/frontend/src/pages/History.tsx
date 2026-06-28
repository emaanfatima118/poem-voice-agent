import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { History as HistoryIcon, ChevronRight, X, Sparkles } from "lucide-react";
import { getHistory } from "../api/history";
import { Button, Card, EmptyState } from "../components/ui";
import type { QueryHistory } from "../types";

export default function History() {
  const [items, setItems] = useState<QueryHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<QueryHistory | null>(null);

  useEffect(() => {
    getHistory()
      .then((data) =>
        setItems(
          data.sort(
            (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          )
        )
      )
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">History</h1>
        <p className="mt-1 text-gray-400">Your past queries and analysis results.</p>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading history...</p>
      ) : items.length === 0 ? (
        <Card>
          <EmptyState
            icon={<HistoryIcon className="h-8 w-8" />}
            title="No history yet"
            description="Run an analysis and your results will appear here."
            action={
              <Link to="/analyze">
                <Button>
                  <Sparkles className="h-4 w-4" />
                  Run analysis
                </Button>
              </Link>
            }
          />
        </Card>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <button
              key={item._id}
              type="button"
              onClick={() => setSelected(item)}
              className="w-full text-left"
            >
              <Card hover className="transition hover:border-accent-500/20">
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-white">{item.query}</p>
                    <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-gray-400">
                      {item.response}
                    </p>
                    <time className="mt-2 block text-xs text-gray-500">
                      {new Date(item.created_at).toLocaleString()}
                    </time>
                  </div>
                  <ChevronRight className="h-5 w-5 shrink-0 text-gray-500" />
                </div>
              </Card>
            </button>
          ))}
        </div>
      )}

      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onClick={() => setSelected(null)}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <Card className="max-h-[85vh] w-full max-w-2xl overflow-y-auto">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-white">{selected.query}</h2>
                <time className="mt-1 block text-xs text-gray-500">
                  {new Date(selected.created_at).toLocaleString()}
                </time>
              </div>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="rounded-lg p-2 text-gray-400 transition hover:bg-white/5 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-6 rounded-xl border border-white/6 bg-white/[0.02] p-4">
              <p className="text-sm leading-relaxed text-gray-300 whitespace-pre-wrap">
                {selected.response}
              </p>
            </div>

            <div className="mt-6 flex gap-3">
              <Link to="/analyze" onClick={() => setSelected(null)}>
                <Button>
                  <Sparkles className="h-4 w-4" />
                  Run new analysis
                </Button>
              </Link>
              <Button variant="secondary" onClick={() => setSelected(null)}>
                Close
              </Button>
            </div>
          </Card>
          </div>
        </div>
      )}
    </div>
  );
}
