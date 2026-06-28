import { Card, CardContent, CardHeader, CardTitle } from "@/stackwise-demo/components/ui/card";
import { Button } from "@/stackwise-demo/components/ui/button";
import { Badge } from "@/stackwise-demo/components/ui/badge";
import { Trash2, RotateCcw, X, Calendar } from "lucide-react";

export default function RecycleBin() {
  // Mock data - would come from API in production
  const deletedItems = [
    {
      id: "1",
      type: "Campaign Recipe",
      name: "Holiday Email Series",
      deletedDate: "2025-10-28",
      daysRemaining: 25,
      module: "Strategy Studio",
    },
    {
      id: "2",
      type: "My Play",
      name: "Q4 Product Launch Ideas",
      deletedDate: "2025-10-25",
      daysRemaining: 22,
      module: "Strategy Studio",
    },
    {
      id: "3",
      type: "Campaign",
      name: "October Newsletter",
      deletedDate: "2025-10-20",
      daysRemaining: 17,
      module: "Flight Deck",
    },
    {
      id: "4",
      type: "Content Draft",
      name: "Thought Leadership: AI in Marketing",
      deletedDate: "2025-10-15",
      daysRemaining: 12,
      module: "Brand Craft",
    },
  ];

  const handleRestore = (itemId: string, itemName: string) => {
    console.log(`Restoring item: ${itemId} - ${itemName}`);
    // TODO: Implement restore API call
  };

  const handlePermanentDelete = (itemId: string, itemName: string) => {
    console.log(`Permanently deleting item: ${itemId} - ${itemName}`);
    // TODO: Implement permanent delete API call
  };

  const getDaysRemainingColor = (days: number) => {
    if (days <= 7) return "text-red-600";
    if (days <= 14) return "text-orange-600";
    return "text-muted-foreground";
  };

  return (
    <div className="h-full overflow-y-auto bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-md bg-gradient-to-br from-[#6218df] to-[#c009ba] flex items-center justify-center">
              <Trash2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-foreground" data-testid="text-recycle-bin-title">
                Recycle Bin
              </h1>
              <p className="text-sm text-muted-foreground">
                Recover deleted items within 30 days
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-8">
        {deletedItems.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Trash2 className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No deleted items to recover</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {/* Info Banner */}
            <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950/20 dark:border-blue-900">
              <CardContent className="py-4">
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-blue-900 dark:text-blue-100">
                      <strong>30-Day Recovery Window:</strong> Items are permanently deleted after 30 days. 
                      Restore items before their expiration date to recover them.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Deleted Items List */}
            <div className="space-y-3">
              {deletedItems.map((item) => (
                <Card key={item.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className="text-xs">
                            {item.type}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {item.module}
                          </Badge>
                        </div>
                        <CardTitle className="text-lg" data-testid={`text-item-name-${item.id}`}>
                          {item.name}
                        </CardTitle>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground mb-1">
                          Deleted on {new Date(item.deletedDate).toLocaleDateString()}
                        </p>
                        <p className={`text-sm font-medium ${getDaysRemainingColor(item.daysRemaining)}`}>
                          {item.daysRemaining} days remaining
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleRestore(item.id, item.name)}
                        className="gap-2"
                        data-testid={`button-restore-${item.id}`}
                      >
                        <RotateCcw className="w-4 h-4" />
                        Restore
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handlePermanentDelete(item.id, item.name)}
                        className="gap-2"
                        data-testid={`button-delete-permanent-${item.id}`}
                      >
                        <X className="w-4 h-4" />
                        Delete Permanently
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
