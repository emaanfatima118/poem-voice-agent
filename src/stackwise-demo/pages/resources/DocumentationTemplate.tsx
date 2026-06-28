import { Card, CardContent, CardHeader, CardTitle } from "@/stackwise-demo/components/ui/card";
import { Button } from "@/stackwise-demo/components/ui/button";
import { FileText, Download, ExternalLink, BookOpen } from "lucide-react";

export default function DocumentationTemplate() {
  return (
    <div className="h-full overflow-y-auto bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 dark:from-gray-900 dark:via-indigo-900/20 dark:to-gray-900 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Stackwise Documentation
          </h1>
          <p className="text-muted-foreground">
            Comprehensive guides, templates, and resources for strategic marketing execution
          </p>
        </div>

        {/* Coming Soon Notice */}
        <Card className="border-2 border-dashed border-purple-200 dark:border-purple-800">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-purple-600" />
            </div>
            <h2 className="text-2xl font-semibold mb-2">Documentation Coming Soon</h2>
            <p className="text-muted-foreground mb-6">
              We're preparing comprehensive documentation to help you maximize the Stackwise platform.
            </p>
            <div className="inline-block px-4 py-2 bg-purple-50 dark:bg-purple-950/30 rounded text-sm text-purple-700 dark:text-purple-300">
              Expected: Q2 2025
            </div>
          </CardContent>
        </Card>

        {/* Planned Documentation Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card data-testid="card-doc-getting-started">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Getting Started Guide
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Step-by-step onboarding, strategy setup, and first 90-day workflow walkthrough
              </p>
              <Button variant="outline" size="sm" disabled data-testid="button-download-getting-started">
                <Download className="w-3 h-3 mr-2" />
                Coming Soon
              </Button>
            </CardContent>
          </Card>

          <Card data-testid="card-doc-strategy">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Strategy Studio Guide
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Quarterly planning, evaluation matrix, milestone tracking, and playbook management
              </p>
              <Button variant="outline" size="sm" disabled data-testid="button-download-strategy">
                <Download className="w-3 h-3 mr-2" />
                Coming Soon
              </Button>
            </CardContent>
          </Card>

          <Card data-testid="card-doc-pulsehub">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <FileText className="w-4 h-4" />
                PulseHub Guide
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Performance analytics, signal tracking, competitive intelligence, and channel optimization
              </p>
              <Button variant="outline" size="sm" disabled data-testid="button-download-pulsehub">
                <Download className="w-3 h-3 mr-2" />
                Coming Soon
              </Button>
            </CardContent>
          </Card>

          <Card data-testid="card-doc-brandcraft">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <FileText className="w-4 h-4" />
                BrandCraft Guide
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Content creation, brand voice consistency, messaging frameworks, and keyword research
              </p>
              <Button variant="outline" size="sm" disabled data-testid="button-download-brandcraft">
                <Download className="w-3 h-3 mr-2" />
                Coming Soon
              </Button>
            </CardContent>
          </Card>

          <Card data-testid="card-doc-flightdeck">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Flight Deck Guide
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Campaign execution, budget management, distribution channels, and personalization
              </p>
              <Button variant="outline" size="sm" disabled data-testid="button-download-flightdeck">
                <Download className="w-3 h-3 mr-2" />
                Coming Soon
              </Button>
            </CardContent>
          </Card>

          <Card data-testid="card-doc-integrations">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Integration Templates
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Cross-module workflows, data propagation patterns, and HITL validation guides
              </p>
              <Button variant="outline" size="sm" disabled data-testid="button-download-integrations">
                <Download className="w-3 h-3 mr-2" />
                Coming Soon
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Helpful Links Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Additional Resources</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              variant="ghost"
              className="w-full justify-start h-auto py-3"
              data-testid="button-link-glossary"
            >
              <div className="flex items-start gap-3">
                <BookOpen className="w-4 h-4 mt-0.5" />
                <div className="text-left">
                  <div className="font-medium text-sm">Stackwise Glossary & Definitions</div>
                  <div className="text-xs text-muted-foreground">
                    Key terms, concepts, and framework definitions
                  </div>
                </div>
              </div>
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start h-auto py-3"
              disabled
              data-testid="button-link-video-library"
            >
              <div className="flex items-start gap-3">
                <ExternalLink className="w-4 h-4 mt-0.5" />
                <div className="text-left">
                  <div className="font-medium text-sm">Video Tutorial Library (Coming Soon)</div>
                  <div className="text-xs text-muted-foreground">
                    Walkthrough videos for each module and feature
                  </div>
                </div>
              </div>
            </Button>
          </CardContent>
        </Card>

        {/* Budget Management Note */}
        <Card className="border-indigo-200 bg-indigo-50/50 dark:bg-indigo-950/10 dark:border-indigo-800">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                <FileText className="w-4 h-4 text-indigo-600" />
              </div>
              <div className="text-sm">
                <h4 className="font-semibold mb-1 text-indigo-900 dark:text-indigo-200">Budget Management Note</h4>
                <p className="text-indigo-700 dark:text-indigo-300">
                  Budget is set in <strong>Strategy Studio</strong> during onboarding, reviewed during quarterly reviews, and executed/managed in <strong>Flight Deck</strong>. 
                  This cross-module workflow ensures strategic alignment with tactical execution.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
