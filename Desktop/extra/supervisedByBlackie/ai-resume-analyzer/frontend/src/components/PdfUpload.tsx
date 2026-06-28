import { useRef, useState } from "react";
import { FileUp, FileText, X } from "lucide-react";

interface PdfUploadProps {
  file: File | null;
  onFileChange: (file: File | null) => void;
  error?: string;
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function PdfUpload({ file, onFileChange, error }: PdfUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [localError, setLocalError] = useState("");

  const acceptFile = (selected: File | null) => {
    setLocalError("");
    if (!selected) {
      onFileChange(null);
      return;
    }
    if (selected.type !== "application/pdf") {
      setLocalError("Only PDF files are allowed");
      return;
    }
    onFileChange(selected);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    acceptFile(dropped ?? null);
  };

  const displayError = error || localError;

  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-gray-300">Resume (PDF)</label>

      {file ? (
        <div className="flex items-center gap-4 rounded-xl border border-accent-500/30 bg-accent-500/5 px-4 py-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-red-500/15 text-red-400">
            <FileText className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate font-medium text-white">{file.name}</p>
            <p className="text-sm text-gray-400">{formatSize(file.size)}</p>
          </div>
          <button
            type="button"
            onClick={() => {
              onFileChange(null);
              if (inputRef.current) inputRef.current.value = "";
            }}
            className="rounded-lg p-2 text-gray-400 transition hover:bg-white/5 hover:text-white"
            aria-label="Remove file"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-10 transition ${
            dragOver
              ? "border-accent-500/60 bg-accent-500/10"
              : "border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]"
          }`}
        >
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 text-gray-400">
            <FileUp className="h-6 w-6" />
          </div>
          <p className="text-sm font-medium text-white">
            Drop your PDF here or <span className="text-accent-400">browse</span>
          </p>
          <p className="mt-1 text-xs text-gray-500">PDF only · max recommended 10 MB</p>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="application/pdf,.pdf"
        className="hidden"
        onChange={(e) => acceptFile(e.target.files?.[0] ?? null)}
      />

      {displayError && <p className="text-xs text-red-400">{displayError}</p>}
    </div>
  );
}
