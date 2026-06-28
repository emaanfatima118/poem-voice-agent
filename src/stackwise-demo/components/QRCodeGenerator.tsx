import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/stackwise-demo/components/ui/dialog";
import { Button } from "@/stackwise-demo/components/ui/button";
import { Input } from "@/stackwise-demo/components/ui/input";
import { Label } from "@/stackwise-demo/components/ui/label";
import { Card } from "@/stackwise-demo/components/ui/card";
import { QrCode, Download, Copy, Check } from "lucide-react";
import { useToast } from "@/stackwise-demo/hooks/use-toast";
import QRCode from "qrcode";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/stackwise-demo/lib/queryClient";

interface QRCodeGeneratorProps {
  trigger?: React.ReactNode;
  defaultUrl?: string;
  campaign?: string;
}

export function QRCodeGenerator({ trigger, defaultUrl = "", campaign = "New Campaign" }: QRCodeGeneratorProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [destinationUrl, setDestinationUrl] = useState(defaultUrl);
  const [utmSource, setUtmSource] = useState("");
  const [utmMedium, setUtmMedium] = useState("qrcode");
  const [utmCampaign, setUtmCampaign] = useState(campaign);
  const [utmContent, setUtmContent] = useState("");
  const [utmTerm, setUtmTerm] = useState("");
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [trackingUrl, setTrackingUrl] = useState("");
  const [copied, setCopied] = useState(false);

  const createTrackingCodeMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest("POST", "/api/tracking-codes", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tracking-codes"] });
      toast({
        title: "QR Code Created",
        description: "Your QR code and tracking link have been saved.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Save",
        description: error.message || "Could not save tracking code. Please try again.",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    generateQRCode();
  }, [destinationUrl, utmSource, utmMedium, utmCampaign, utmContent, utmTerm]);

  const generateQRCode = async () => {
    if (!destinationUrl) {
      setQrDataUrl("");
      setTrackingUrl("");
      return;
    }

    const params = new URLSearchParams();
    if (utmSource) params.set("utm_source", utmSource);
    if (utmMedium) params.set("utm_medium", utmMedium);
    if (utmCampaign) params.set("utm_campaign", utmCampaign);
    if (utmContent) params.set("utm_content", utmContent);
    if (utmTerm) params.set("utm_term", utmTerm);

    const fullUrl = params.toString()
      ? `${destinationUrl}?${params.toString()}`
      : destinationUrl;

    setTrackingUrl(fullUrl);

    try {
      const dataUrl = await QRCode.toDataURL(fullUrl, {
        width: 300,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
      });
      setQrDataUrl(dataUrl);
    } catch (error) {
      console.error("Failed to generate QR code:", error);
    }
  };

  const handleDownload = () => {
    if (!qrDataUrl) return;

    const link = document.createElement("a");
    link.href = qrDataUrl;
    link.download = `qr-code-${utmCampaign || "download"}.png`;
    link.click();

    toast({
      title: "QR Code Downloaded",
      description: "Your QR code has been downloaded successfully.",
    });
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(trackingUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: "URL Copied",
      description: "Tracking URL copied to clipboard.",
    });
  };

  const handleSave = () => {
    if (!destinationUrl || !qrDataUrl) {
      toast({
        title: "Missing Information",
        description: "Please provide a destination URL.",
        variant: "destructive",
      });
      return;
    }

    const trackingCode = `${utmCampaign.toLowerCase().replace(/\s+/g, "-")}-${Date.now().toString().slice(-6)}`;

    createTrackingCodeMutation.mutate({
      campaign: utmCampaign,
      code: trackingCode,
      utmSource,
      utmMedium,
      utmCampaign,
      utmContent,
      utmTerm,
      destinationUrl,
      qrCodeData: qrDataUrl,
      scans: 0,
    });

    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" data-testid="button-qr-generator">
            <QrCode className="w-4 h-4 mr-2" />
            Generate QR Code
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>QR Code Generator</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-6 mt-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="destination-url">Destination URL *</Label>
              <Input
                id="destination-url"
                value={destinationUrl}
                onChange={(e) => setDestinationUrl(e.target.value)}
                placeholder="https://example.com/landing"
                data-testid="input-destination-url"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="utm-campaign">Campaign Name *</Label>
              <Input
                id="utm-campaign"
                value={utmCampaign}
                onChange={(e) => setUtmCampaign(e.target.value)}
                placeholder="Q4 Product Launch"
                data-testid="input-utm-campaign"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="utm-source">Source</Label>
                <Input
                  id="utm-source"
                  value={utmSource}
                  onChange={(e) => setUtmSource(e.target.value)}
                  placeholder="print, event"
                  data-testid="input-utm-source"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="utm-medium">Medium</Label>
                <Input
                  id="utm-medium"
                  value={utmMedium}
                  onChange={(e) => setUtmMedium(e.target.value)}
                  placeholder="qrcode"
                  data-testid="input-utm-medium"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="utm-content">Content (Optional)</Label>
              <Input
                id="utm-content"
                value={utmContent}
                onChange={(e) => setUtmContent(e.target.value)}
                placeholder="poster, flyer, booth"
                data-testid="input-utm-content"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="utm-term">Term (Optional)</Label>
              <Input
                id="utm-term"
                value={utmTerm}
                onChange={(e) => setUtmTerm(e.target.value)}
                placeholder="keywords"
                data-testid="input-utm-term"
              />
            </div>

            <Card className="p-3 bg-muted/30">
              <div className="text-xs font-medium mb-2 text-muted-foreground">Tracking URL Preview</div>
              <div className="text-xs break-all font-mono bg-background p-2 rounded border">
                {trackingUrl || "Enter a destination URL to see preview"}
              </div>
              {trackingUrl && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopyUrl}
                  className="mt-2 h-7 text-xs"
                  data-testid="button-copy-url"
                >
                  {copied ? <Check className="w-3 h-3 mr-1" /> : <Copy className="w-3 h-3 mr-1" />}
                  {copied ? "Copied!" : "Copy URL"}
                </Button>
              )}
            </Card>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>QR Code Preview</Label>
              <Card className="p-6 flex items-center justify-center min-h-[300px] bg-muted/20">
                {qrDataUrl ? (
                  <img src={qrDataUrl} alt="QR Code" className="w-full max-w-[280px]" />
                ) : (
                  <div className="text-center text-muted-foreground">
                    <QrCode className="w-16 h-16 mx-auto mb-2 opacity-30" />
                    <p className="text-sm">Enter URL to generate QR code</p>
                  </div>
                )}
              </Card>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleDownload}
                disabled={!qrDataUrl}
                variant="outline"
                className="flex-1"
                data-testid="button-download-qr"
              >
                <Download className="w-4 h-4 mr-2" />
                Download PNG
              </Button>
              <Button
                onClick={handleSave}
                disabled={!qrDataUrl || createTrackingCodeMutation.isPending}
                className="flex-1"
                data-testid="button-save-qr"
              >
                {createTrackingCodeMutation.isPending ? "Saving..." : "Save & Track"}
              </Button>
            </div>

            <div className="text-xs text-muted-foreground space-y-1 bg-blue-50 dark:bg-blue-950/20 p-3 rounded border border-blue-200 dark:border-blue-800">
              <p className="font-medium text-blue-900 dark:text-blue-200">💡 Tracking Tips:</p>
              <ul className="list-disc list-inside space-y-0.5 text-blue-700 dark:text-blue-300">
                <li>Use descriptive campaign names</li>
                <li>Source: Where QR code appears (event, print)</li>
                <li>Content: Specific placement (booth, poster)</li>
              </ul>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
