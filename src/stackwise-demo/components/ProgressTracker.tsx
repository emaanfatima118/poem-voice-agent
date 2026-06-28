interface ProgressTrackerProps {
  currentStep: number;
  totalSteps: number;
  stepLabels: string[];
}

export function ProgressTracker({
  currentStep,
  totalSteps,
  stepLabels,
}: ProgressTrackerProps) {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between relative">
        {stepLabels.map((label, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;
          const isUpcoming = stepNumber > currentStep;

          return (
            <div key={index} className="flex flex-col items-center relative flex-1">
              {index > 0 && (
                <div
                  className={`absolute top-5 right-1/2 h-0.5 w-full -z-10 ${
                    isCompleted || isCurrent ? "bg-primary" : "bg-border"
                  }`}
                  style={{ left: "-50%" }}
                />
              )}

              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-medium text-sm transition-all duration-300 ${
                  isCompleted
                    ? "bg-primary text-white"
                    : isCurrent
                    ? "bg-primary text-white ring-4 ring-primary/20"
                    : "bg-muted text-muted-foreground"
                }`}
                data-testid={`step-${stepNumber}`}
              >
                {isCompleted ? "✓" : stepNumber}
              </div>

              <div className="mt-2 text-center">
                <div
                  className={`text-xs font-medium ${
                    isCurrent ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {label}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
