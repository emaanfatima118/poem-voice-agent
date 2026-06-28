import { Progress } from "@/stackwise-demo/components/ui/progress";
import { Calendar } from "lucide-react";

interface QuarterlyCountdownProps {
  daysRemaining: number;
  totalDays?: number;
}

export function QuarterlyCountdown({
  daysRemaining,
  totalDays = 90,
}: QuarterlyCountdownProps) {
  const progress = ((totalDays - daysRemaining) / totalDays) * 100;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium">Quarterly Review In</span>
        </div>
        <span className="text-2xl font-bold text-primary">{daysRemaining}</span>
      </div>
      <div className="space-y-1">
        <Progress value={progress} className="h-2" />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Day {totalDays - daysRemaining}</span>
          <span>Day {totalDays}</span>
        </div>
      </div>
      <p className="text-xs text-muted-foreground">
        Your next strategy review is automatically scheduled. Keep your plays active!
      </p>
    </div>
  );
}
