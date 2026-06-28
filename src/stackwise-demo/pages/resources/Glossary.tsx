import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/stackwise-demo/components/ui/card";
import { Input } from "@/stackwise-demo/components/ui/input";
import { Badge } from "@/stackwise-demo/components/ui/badge";
import { BookOpen, Search } from "lucide-react";

export default function Glossary() {
  const [searchTerm, setSearchTerm] = useState("");

  // Placeholder glossary items
  const glossaryItems = [
    {
      id: "1",
      term: "Adaptive Intelligence",
      category: "Personalization",
      definition: "--- Document coming soon ---",
    },
    {
      id: "2",
      term: "Brand Voice Check",
      category: "BrandCraft",
      definition: "--- Document coming soon ---",
    },
    {
      id: "3",
      term: "HITL (Human-in-the-Loop)",
      category: "General",
      definition: "--- Document coming soon ---",
    },
    {
      id: "4",
      term: "Evaluation Matrix",
      category: "Strategy Studio",
      definition: "--- Document coming soon ---",
    },
    {
      id: "5",
      term: "Quarterly Rhythm",
      category: "Strategy Studio",
      definition: "--- Document coming soon ---",
    },
    {
      id: "6",
      term: "Signal Tracking",
      category: "PulseHub",
      definition: "--- Document coming soon ---",
    },
    {
      id: "7",
      term: "Campaign Recipe",
      category: "Flight Deck",
      definition: "--- Document coming soon ---",
    },
    {
      id: "8",
      term: "Messaging House",
      category: "BrandCraft",
      definition: "--- Document coming soon ---",
    },
    {
      id: "9",
      term: "30/60/90 Milestones",
      category: "Strategy Studio",
      definition: "--- Document coming soon ---",
    },
    {
      id: "10",
      term: "Cross-Module Propagation",
      category: "General",
      definition: "--- Document coming soon ---",
    },
  ];

  const filteredItems = glossaryItems.filter(
    (item) =>
      item.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.definition.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Strategy Studio":
        return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400";
      case "PulseHub":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case "BrandCraft":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400";
      case "Flight Deck":
        return "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400";
      case "Personalization":
        return "bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
    }
  };

  return (
    <div className="h-full overflow-y-auto bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-gray-900 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Stackwise Glossary & Definitions
          </h1>
          <p className="text-muted-foreground">
            Key terms, concepts, and framework definitions across the Stackwise platform
          </p>
        </div>

        {/* Coming Soon Notice */}
        <Card className="border-2 border-dashed border-purple-200 dark:border-purple-800">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
              <BookOpen className="w-6 h-6 text-purple-600" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Definitions Coming Soon</h2>
            <p className="text-sm text-muted-foreground">
              Comprehensive definitions and usage examples are being prepared for all Stackwise terms and concepts.
            </p>
          </CardContent>
        </Card>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search terms or categories..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            data-testid="input-search-glossary"
          />
        </div>

        {/* Glossary Items */}
        <div className="space-y-3">
          {filteredItems.map((item) => (
            <Card key={item.id} className="hover-elevate" data-testid={`glossary-item-${item.id}`}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-base">{item.term}</CardTitle>
                  <Badge variant="outline" className={getCategoryColor(item.category)}>
                    {item.category}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground italic">{item.definition}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground">No matching terms found</p>
            </CardContent>
          </Card>
        )}

        {/* Info Box */}
        <Card className="border-purple-200 bg-purple-50/50 dark:bg-purple-950/10 dark:border-purple-800">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-4 h-4 text-purple-600" />
              </div>
              <div className="text-sm">
                <h4 className="font-semibold mb-1 text-purple-900 dark:text-purple-200">About This Glossary</h4>
                <p className="text-purple-700 dark:text-purple-300">
                  This glossary will provide comprehensive definitions for all strategic frameworks, technical terms, and module-specific concepts 
                  used throughout the Stackwise platform. Each entry will include usage examples and cross-module context where applicable.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
