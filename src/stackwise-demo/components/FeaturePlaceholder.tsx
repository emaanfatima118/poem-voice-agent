import { Card } from "@/stackwise-demo/components/ui/card";
import { Button } from "@/stackwise-demo/components/ui/button";
import { Link } from "wouter";
import { LucideIcon, ArrowLeft } from "lucide-react";

interface FeaturePlaceholderProps {
  title: string;
  description: string;
  icon: LucideIcon;
  backLink: string;
  backLabel?: string;
}

export function FeaturePlaceholder({
  title,
  description,
  icon: Icon,
  backLink,
  backLabel = "Back to Dashboard",
}: FeaturePlaceholderProps) {
  return (
    <div className="p-6 space-y-6 max-w-[1200px] mx-auto">
      <Link href={backLink}>
        <Button variant="ghost" size="sm" data-testid="button-back">
          <ArrowLeft className="w-4 h-4 mr-2" />
          {backLabel}
        </Button>
      </Link>

      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="max-w-lg text-center p-12">
          <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Icon className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-3xl font-bold mb-4">{title}</h1>
          <p className="text-lg text-muted-foreground mb-8">{description}</p>
          <div className="bg-muted/50 rounded-lg p-4 mb-6">
            <p className="text-sm text-muted-foreground">
              This feature is currently under development and will be available soon.
            </p>
          </div>
          <Link href={backLink}>
            <Button className="bg-gradient-purple" data-testid="button-go-back">
              {backLabel}
            </Button>
          </Link>
        </Card>
      </div>
    </div>
  );
}
