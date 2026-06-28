import { HelpCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/stackwise-demo/components/ui/tooltip";
import { Badge } from "@/stackwise-demo/components/ui/badge";

interface GuidanceTooltipProps {
  title: string;
  definition: string;
  explanation: string;
  bestPractice?: string;
  example?: string;
  warning?: string;
  iconSize?: number;
}

export function GuidanceTooltip({
  title,
  definition,
  explanation,
  bestPractice,
  example,
  warning,
  iconSize = 16
}: GuidanceTooltipProps) {
  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <HelpCircle 
            className="inline-block cursor-help text-muted-foreground hover:text-foreground transition-colors" 
            size={iconSize}
            data-testid="icon-guidance"
          />
        </TooltipTrigger>
        <TooltipContent 
          side="right" 
          className="max-w-sm p-4 space-y-3"
          data-testid="tooltip-guidance"
        >
          <div>
            <h4 className="font-semibold text-sm mb-1">{title}</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">{definition}</p>
          </div>
          
          <div>
            <p className="text-xs leading-relaxed">{explanation}</p>
          </div>

          {bestPractice && (
            <div className="pt-2 border-t">
              <Badge variant="secondary" className="mb-2 text-xs">
                Best Practice
              </Badge>
              <p className="text-xs leading-relaxed text-muted-foreground">{bestPractice}</p>
            </div>
          )}

          {example && (
            <div className="pt-2 border-t">
              <Badge variant="outline" className="mb-2 text-xs">
                Example
              </Badge>
              <p className="text-xs leading-relaxed italic text-muted-foreground">{example}</p>
            </div>
          )}

          {warning && (
            <div className="pt-2 border-t border-destructive/20 bg-destructive/5 -mx-4 -mb-4 px-4 py-3">
              <Badge variant="destructive" className="mb-2 text-xs">
                Warning
              </Badge>
              <p className="text-xs leading-relaxed text-destructive">{warning}</p>
            </div>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

// Quick helper for inline guidance from guidance data
import { getGuidance } from "@/stackwise-demo/data/gtmGuidance";

interface QuickGuidanceProps {
  guidanceKey: string;
  iconSize?: number;
}

export function QuickGuidance({ guidanceKey, iconSize }: QuickGuidanceProps) {
  const guidance = getGuidance(guidanceKey);
  
  if (!guidance) {
    return null;
  }

  return <GuidanceTooltip {...guidance} iconSize={iconSize} />;
}
