import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/stackwise-demo/components/ui/card";
import { Button } from "@/stackwise-demo/components/ui/button";
import { Input } from "@/stackwise-demo/components/ui/input";
import { Badge } from "@/stackwise-demo/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { QRCodeGenerator } from "@/stackwise-demo/components/QRCodeGenerator";
import { Copy, Check, Trash2, Search, QrCode, ExternalLink, Download } from "lucide-react";
import { useToast } from "@/stackwise-demo/hooks/use-toast";
import type { TrackingCode } from "@shared/schema";

export function TrackingCodeManager() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const { data: trackingCodes = [], isLoading } = useQuery<TrackingCode[]>({
    queryKey: ["/api/tracking-codes"],
  });

  const filteredCodes = trackingCodes.filter((code) =>
    code.campaign.toLowerCase().includes(searchQuery.toLowerCase()) ||
    code.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCopy = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    toast({
      title: "URL Copied",
      description: "Tracking URL copied to clipboard.",
    });
  };

  const handleDownloadQR = (code: TrackingCode) => {
    if (!code.qrCodeData) return;

    const link = document.createElement("a");
    link.href = code.qrCodeData;
    link.download = `qr-code-${code.code}.png`;
    link.click();

    toast({
      title: "QR Code Downloaded",
      description: `QR code for ${code.campaign} downloaded.`,
    });
  };

  const buildTrackingUrl = (code: TrackingCode) => {
    const params = new URLSearchParams();
    if (code.utmSource) params.set("utm_source", code.utmSource);
    if (code.utmMedium) params.set("utm_medium", code.utmMedium);
    if (code.utmCampaign) params.set("utm_campaign", code.utmCampaign);
    if (code.utmContent) params.set("utm_content", code.utmContent);
    if (code.utmTerm) params.set("utm_term", code.utmTerm);

    return params.toString()
      ? `${code.destinationUrl}?${params.toString()}`
      : code.destinationUrl;
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Tracking Code Manager</CardTitle>
            <QRCodeGenerator />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search campaigns or codes..."
                className="pl-9"
                data-testid="input-search-codes"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">
              Loading tracking codes...
            </div>
          ) : filteredCodes.length === 0 ? (
            <div className="text-center py-12">
              <QrCode className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-30" />
              <p className="text-sm text-muted-foreground mb-4">
                {searchQuery ? "No tracking codes match your search" : "No tracking codes yet"}
              </p>
              <QRCodeGenerator trigger={
                <Button variant="outline" size="sm" data-testid="button-create-first-code">
                  Create Your First Tracking Code
                </Button>
              } />
            </div>
          ) : (
            <div className="space-y-3">
              {filteredCodes.map((code) => {
                const trackingUrl = buildTrackingUrl(code);
                const isCopied = copiedId === code.id;

                return (
                  <Card key={code.id} className="p-4" data-testid={`tracking-code-${code.id}`}>
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-sm">{code.campaign}</h4>
                            <Badge variant="secondary" className="text-xs">
                              {code.code}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground break-all">
                            {code.destinationUrl}
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          {code.qrCodeData && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDownloadQR(code)}
                              title="Download QR Code"
                              data-testid={`button-download-qr-${code.id}`}
                            >
                              <Download className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 text-xs">
                        {code.utmSource && (
                          <Badge variant="outline" className="text-xs">
                            Source: {code.utmSource}
                          </Badge>
                        )}
                        {code.utmMedium && (
                          <Badge variant="outline" className="text-xs">
                            Medium: {code.utmMedium}
                          </Badge>
                        )}
                        {code.utmContent && (
                          <Badge variant="outline" className="text-xs">
                            Content: {code.utmContent}
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center gap-2 p-2 bg-muted/30 rounded border">
                        <div className="flex-1 font-mono text-xs break-all">
                          {trackingUrl}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopy(trackingUrl, code.id)}
                          className="h-7 flex-shrink-0"
                          data-testid={`button-copy-url-${code.id}`}
                        >
                          {isCopied ? (
                            <Check className="w-3 h-3" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </Button>
                      </div>

                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-4">
                          <span>
                            Scans: <strong className="text-foreground">{code.scans}</strong>
                          </span>
                          <span>
                            Created: {new Date(code.createdAt!).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {filteredCodes.length > 0 && (
        <div className="text-xs text-muted-foreground bg-blue-50 dark:bg-blue-950/20 p-3 rounded border border-blue-200 dark:border-blue-800">
          <p className="font-medium text-blue-900 dark:text-blue-200 mb-1">💡 Tracking Tips:</p>
          <ul className="list-disc list-inside space-y-0.5 text-blue-700 dark:text-blue-300">
            <li>Use QR codes on print materials, events, and physical locations</li>
            <li>Track scan data in PulseHub for campaign performance analysis</li>
            <li>Create unique codes for each channel to measure attribution</li>
          </ul>
        </div>
      )}
    </div>
  );
}
