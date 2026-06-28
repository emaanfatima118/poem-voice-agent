interface ConfidenceBarProps {
  confidence: number;
  showLabel?: boolean;
  className?: string;
}

export function ConfidenceBar({
  confidence,
  showLabel = true,
  className = "",
}: ConfidenceBarProps) {
  const getConfidenceColor = (value: number) => {
    if (value >= 90) return "bg-green-500";
    if (value >= 75) return "bg-blue-500";
    if (value >= 60) return "bg-amber-500";
    return "bg-red-500";
  };

  const getConfidenceLabel = (value: number) => {
    if (value >= 90) return "High Confidence";
    if (value >= 75) return "Likely Useful";
    if (value >= 60) return "Consideration";
    return "Low Confidence";
  };

  return (
    <div className={`space-y-1 ${className}`}>
      {showLabel && (
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Confidence</span>
          <span className="font-medium">{getConfidenceLabel(confidence)}</span>
        </div>
      )}
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div className="h-full relative">
          <div className="absolute inset-0 confidence-gradient opacity-20" />
          <div
            className={`h-full transition-all duration-500 ${getConfidenceColor(confidence)}`}
            style={{ width: `${confidence}%` }}
          />
        </div>
      </div>
      {showLabel && (
        <div className="text-right text-xs font-medium text-muted-foreground">
          {confidence}%
        </div>
      )}
    </div>
  );
}
