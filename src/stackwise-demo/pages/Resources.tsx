import { Card, CardContent, CardHeader, CardTitle } from "@/stackwise-demo/components/ui/card";
import { Link } from "wouter";
import { BookOpen, BookText, ArrowRight, Compass } from "lucide-react";
import { Button } from "@/stackwise-demo/components/ui/button";

export default function Resources() {
  const resources = [
    {
      id: "orientation",
      title: "Platform Orientation",
      description: "Interactive tour of Stackwise modules, navigation, and strategic framework",
      icon: Compass,
      path: "/strategy-studio/onboarding?step=orientation",
    },
    {
      id: "documentation",
      title: "Documentation",
      description: "Comprehensive guides and templates for all Stackwise modules",
      icon: BookOpen,
      path: "/resources/documentation",
    },
    {
      id: "glossary",
      title: "Stackwise Glossary",
      description: "Searchable glossary of key terms, concepts, and framework definitions",
      icon: BookText,
      path: "/resources/glossary",
    },
  ];

  return (
    <div className="h-full overflow-y-auto bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-md bg-gradient-to-br from-[#6218df] to-[#c009ba] flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-foreground" data-testid="text-resources-title">
                Resources
              </h1>
              <p className="text-sm text-muted-foreground">
                Access documentation, guides, and glossary
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl">
          {resources.map((resource) => (
            <Link key={resource.id} href={resource.path}>
              <Card className="h-full hover-elevate cursor-pointer transition-all">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#6218df] to-[#c009ba] flex items-center justify-center flex-shrink-0">
                      <resource.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2" data-testid={`text-${resource.id}-title`}>
                        {resource.title}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {resource.description}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="gap-2" data-testid={`button-view-${resource.id}`}>
                    View {resource.title}
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
