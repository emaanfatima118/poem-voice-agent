import QRCode from 'qrcode';

/**
 * Generate standardized tracking code components from campaign, channel, and asset info
 */
export function generateTrackingCodeComponents(params: {
  campaignName: string;
  channelName: string;
  assetName?: string;
}) {
  const { campaignName, channelName, assetName } = params;

  // Standardized slugification (lowercase, replace spaces with hyphens)
  const slugify = (text: string) => {
    return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  };

  // Generate UTM parameters
  const utmCampaign = slugify(campaignName);
  const utmSource = slugify(channelName);
  
  // Determine UTM medium based on channel
  const channelLower = channelName.toLowerCase();
  let utmMedium = 'other';
  if (channelLower.includes('email')) utmMedium = 'email';
  else if (channelLower.includes('linkedin') || channelLower.includes('facebook') || 
           channelLower.includes('twitter') || channelLower.includes('instagram') ||
           channelLower.includes('tiktok') || channelLower.includes('x')) utmMedium = 'social';
  else if (channelLower.includes('google') || channelLower.includes('bing')) utmMedium = 'cpc';
  else if (channelLower.includes('blog') || channelLower.includes('content')) utmMedium = 'content';
  else if (channelLower.includes('display') || channelLower.includes('banner')) utmMedium = 'display';

  // Generate UTM content (asset identifier)
  const utmContent = assetName ? slugify(assetName) : undefined;

  // Generate unique tracking code
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 6);
  const code = `${utmCampaign}-${utmSource}${utmContent ? '-' + utmContent : ''}-${timestamp}-${randomPart}`;

  return {
    code,
    utmSource,
    utmMedium,
    utmCampaign,
    utmContent,
  };
}

/**
 * Build tracking URL with UTM parameters
 */
export function buildTrackingUrl(params: {
  baseUrl: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  utmContent?: string;
  utmTerm?: string;
}) {
  const { baseUrl, utmSource, utmMedium, utmCampaign, utmContent, utmTerm } = params;
  
  const url = new URL(baseUrl);
  url.searchParams.set('utm_source', utmSource);
  url.searchParams.set('utm_medium', utmMedium);
  url.searchParams.set('utm_campaign', utmCampaign);
  if (utmContent) url.searchParams.set('utm_content', utmContent);
  if (utmTerm) url.searchParams.set('utm_term', utmTerm);
  
  return url.toString();
}

/**
 * Generate QR code data URL for a tracking URL
 */
export async function generateQRCode(trackingUrl: string): Promise<string> {
  try {
    const qrDataUrl = await QRCode.toDataURL(trackingUrl, {
      errorCorrectionLevel: 'M',
      margin: 1,
      width: 300,
    });
    return qrDataUrl;
  } catch (error) {
    console.error('QR code generation failed:', error);
    return '';
  }
}

/**
 * Complete tracking code generation for a campaign asset
 */
export async function generateCompleteTrackingCode(params: {
  campaignName: string;
  channelName: string;
  assetName?: string;
  destinationUrl?: string;
}) {
  const { campaignName, channelName, assetName, destinationUrl = 'https://example.com' } = params;

  // Generate UTM components
  const { code, utmSource, utmMedium, utmCampaign, utmContent } = generateTrackingCodeComponents({
    campaignName,
    channelName,
    assetName,
  });

  // Build tracking URL
  const trackingUrl = buildTrackingUrl({
    baseUrl: destinationUrl,
    utmSource,
    utmMedium,
    utmCampaign,
    utmContent,
  });

  // Generate QR code
  const qrCodeData = await generateQRCode(trackingUrl);

  return {
    code,
    utmSource,
    utmMedium,
    utmCampaign,
    utmContent,
    trackingUrl,
    qrCodeData,
  };
}
