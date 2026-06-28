import * as cheerio from 'cheerio';
import { browserPool } from '@/lib/playwright/browser-pool';
import { NAVIGATION_OPTIONS } from '@/lib/playwright/config';
import { safeGet } from './utils';
import {
  ANALYTICS_PATTERNS,
  PAID_PATTERNS,
  SOCIAL_DOMAINS,
  CTA_PHRASES,
  COMMON_PROBES,
  DEFAULT_TOPICS,
  WORDPRESS_PATTERNS,
  BLOG_URL_PATTERNS,
  EMAIL_MARKETING_PATTERNS,
  NEWSLETTER_KEYWORDS,
} from './constants';

/**
 * Check WordPress REST API for blog posts
 * WordPress sites expose /wp-json/wp/v2/posts endpoint
 */
async function checkWordPressAPI(baseUrl: string): Promise<{ isWordPress: boolean; postCount: number; postUrls: string[] }> {
  try {
    const wpJsonUrl = new URL('/wp-json/wp/v2/posts', baseUrl).toString();
    const response = await safeGet(wpJsonUrl, 8000);
    
    if (response?.status === 200 && response.text) {
      try {
        const posts = JSON.parse(response.text);
        if (Array.isArray(posts) && posts.length > 0) {
          const postUrls = posts
            .filter((post: any) => post.link)
            .map((post: any) => post.link);
          
          console.log(`[DEBUG][WordPress] Found ${posts.length} posts via REST API`);
          return { isWordPress: true, postCount: posts.length, postUrls };
        }
      } catch (parseError) {
        // Not valid JSON or not a posts array
      }
    }
  } catch (error) {
    // WordPress API not available
  }
  
  return { isWordPress: false, postCount: 0, postUrls: [] };
}

export interface StructuredSignals {
  url: string;
  timestamp: number;
  title?: string;
  meta_description?: string;
  canonical?: boolean;
  robots_meta?: boolean;
  h1_count?: number;
  forms_count?: number;
  has_email_input?: boolean;
  cta_count?: number;
  social_profiles?: string[];
  blog_urls?: string[];
  article_count?: number;
  word_count?: number;
  analytics_found?: string[];
  paid_found?: string[];
  email_present?: boolean;
  logo?: boolean;
  favicon?: boolean;
  baseline: {
    seo?: number;
    content?: number;
    social?: number;
    lead_gen?: number;
    lead_forms_detected?: number;
    dynamic_forms_ratio?: number;
    analytics?: number;
    analytics_scripts?: number;
    analytics_count?: number;
    email_marketing?: number;
    paid_ads?: number;
    paid_scripts_detected?: number;
    paid_ads_count?: number;
    brand?: number;
    ux_score?: number;
    responsive_score?: number;
    modern_seo_score?: number;
    title_present?: boolean;
    meta_description_present?: boolean;
    social_profiles_count?: number;
    blog_count?: number;
    email_capture?: number;
    [key: string]: any;
  };
  baseline_score?: number;
  baseline_confidence?: string;
  stabilized_score?: number;
  baseline_category?: string;
  ux_score?: number;
  responsive_score?: number;
  modern_seo_score?: number;
}

async function probeCommonPages(baseUrl: string, timeout: number = 10000, renderFallback: boolean = true): Promise<Record<string, any>> {
  const results: Record<string, any> = {};
  
  for (const path of COMMON_PROBES) {
    try {
      const fullUrl = new URL(path, baseUrl).toString();
      const response = await safeGet(fullUrl, timeout);
      
      // Skip 404s and other errors silently (this is expected)
      if (!response || response.status !== 200) {
        continue;
      }
      
      let body = response.text || '';
      
      // Only use Playwright if we got a 200 but empty/minimal content (JS-rendered sites)
      if ((!body || body.trim().length < 200) && renderFallback) {
        try {
          body = await renderWithPlaywright(fullUrl, false);
        } catch (playwrightErr) {
          // If Playwright fails, just skip this path
          continue;
        }
      }
      
      if (!body || body.trim().length < 200) continue;
      
      const $ = cheerio.load(body);
      const forms = $('form');
      const formsCount = forms.length;
      const hasEmail = forms.toArray().some(f => $(f).find('input[type="email"]').length > 0);
      
      let ctaCount = 0;
      $('a, button').each((_, el) => {
        const text = $(el).text().trim().toLowerCase();
        if (CTA_PHRASES.some(phrase => text.includes(phrase))) {
          ctaCount++;
        }
      });
      
      // Count blog articles on this page
      let articleCount = 0;
      articleCount += $('article').length;
      articleCount += $('.post, .blog-post, .entry, .hentry').length;
      articleCount += $('[class*="post-"], [class*="entry-"]').length;
      
      if (formsCount || hasEmail || ctaCount || articleCount > 0) {
        results[path] = {
          status: response.status,
          forms_count: formsCount,
          has_email_input: hasEmail,
          cta_count: ctaCount,
          article_count: articleCount,
        };
        console.log(`[DEBUG][PROBE] ${path} -> forms=${formsCount}, email=${hasEmail}, CTA=${ctaCount}, articles=${articleCount}`);
      }
    } catch (err) {
      // Silently skip errors (404s and timeouts are expected)
      continue;
    }
  }
  
  if (Object.keys(results).length > 0) {
    console.log(`[DEBUG][PROBE] Found ${Object.keys(results).length} pages with signals`);
  }
  return results;
}

export async function extractStructuredSignals(
  url: string,
  render: boolean = false,
  debug: boolean = false,
  selectedTopics: string[] = DEFAULT_TOPICS
): Promise<StructuredSignals> {
  const structured: StructuredSignals = {
    url,
    timestamp: Date.now(),
    baseline: {},
  };

  let html = '';

  if (debug) console.log(`[DEBUG] 🚀 Starting signal extraction for ${url} (render=${render})`);

  // Try static fetch first
  const response = await safeGet(url);
  if (debug) {
    console.log(`[DEBUG] safeGet status: ${response?.status || 'None'}, content length: ${response?.text?.length || 0}`);
    if (response?.text) {
      console.log(`[DEBUG] First 400 chars of static HTML: ${response.text.substring(0, 400)}`);
    }
  }

  // Smart rendering decision: only use Playwright when really needed
  if (render || !response || !response.text || response.text.length < 1000) {
    const reason = !response ? 'fetch failed' : !response.text ? 'empty response' : response.text.length < 1000 ? 'minimal content' : 'render=True';
    if (debug) console.log(`[DEBUG] ${reason}, rendering via Playwright...`);
    html = await renderWithPlaywright(url, debug);
    
    // If Playwright failed but we have static content, use that as fallback
    if ((!html || html.length < 500) && response?.text && response.text.length > 100) {
      const staticLength = response.text.length;
      console.warn(`[DEBUG] ⚠️ Playwright failed (${html?.length || 0} bytes), falling back to static content (${staticLength} bytes)`);
      html = response.text;
      if (debug) {
        console.log(`[DEBUG] 📄 Using static HTML as fallback`);
        console.log(`[DEBUG] Static fallback HTML preview: ${html.substring(0, 800)}`);
      }
    } else if (!html || html.length < 500) {
      // Both Playwright and static failed - throw error
      const errorMsg = `Failed to extract content from ${url}. Static fetch: ${response?.text?.length || 0} bytes, Playwright: ${html?.length || 0} bytes`;
      console.error(`[DEBUG] ❌ ${errorMsg}`);
      throw new Error(errorMsg);
    } else {
      if (debug) console.log(`[DEBUG] ✅ Playwright successfully rendered ${html.length} bytes`);
    }
  } else {
    html = response.text;
    // Only force Playwright if content is minimal (< 3000 chars of text) - JS sites often have minimal SSR
    const textContent = html.replace(/<[^>]*>/g, '').trim();
    if (textContent.length < 3000) {
      if (debug) console.log(`[DEBUG] Minimal content detected (${textContent.length} chars), trying Playwright...`);
      try {
        const renderedHtml = await renderWithPlaywright(url, debug);
        // Only use Playwright result if it's actually better
        const renderedText = renderedHtml.replace(/<[^>]*>/g, '').trim();
        if (renderedText.length > textContent.length) {
          html = renderedHtml;
          if (debug) console.log(`[DEBUG] ✅ Playwright improved content: ${textContent.length} -> ${renderedText.length} chars`);
        } else {
          if (debug) console.log(`[DEBUG] Playwright didn't improve content, using static HTML`);
        }
      } catch (renderError) {
        if (debug) console.error(`[DEBUG] Playwright failed: ${renderError}, using static HTML`);
      }
    } else {
      if (debug) console.log(`[DEBUG] ✅ Using static HTML (${textContent.length} chars of text)`);
    }
  }

  if (debug) console.log(`[DEBUG] 📄 Total HTML length: ${html.length} bytes, proceeding with parsing...`);

  const $ = cheerio.load(html);
  const visibleText = $('body').text().trim();

  // Metadata - Enhanced SEO detection
  const title = $('title').text().trim() || '';
  const metaDescription = $('meta[name="description"]').attr('content')?.trim() || '';
  const canonical = $('link[rel="canonical"]').length > 0;
  const robotsMeta = $('meta[name="robots"]').length > 0;
  const h1Primary = $('h1').first().text().trim() || '';
  
  // Open Graph tags (Facebook, LinkedIn sharing)
  const ogTitle = $('meta[property="og:title"]').length > 0;
  const ogDescription = $('meta[property="og:description"]').length > 0;
  const ogImage = $('meta[property="og:image"]').length > 0;
  const ogUrl = $('meta[property="og:url"]').length > 0;
  const hasOpenGraph = ogTitle && ogDescription;
  
  // Twitter Cards
  const twitterCard = $('meta[name="twitter:card"]').length > 0;
  const twitterTitle = $('meta[name="twitter:title"]').length > 0;
  const twitterDescription = $('meta[name="twitter:description"]').length > 0;
  const hasTwitterCards = twitterCard && (twitterTitle || twitterDescription);
  
  // Structured Data (Schema.org)
  const hasJsonLd = $('script[type="application/ld+json"]').length > 0;
  const hasMicrodata = $('[itemtype], [itemscope]').length > 0;
  const hasStructuredData = hasJsonLd || hasMicrodata;

  let hasRobotsTxt = false;
  let hasSitemap = false;
  try {
    const robotsUrl = new URL(url);
    robotsUrl.pathname = '/robots.txt';
    const robotsResponse = await safeGet(robotsUrl.toString(), 5000);
    if (robotsResponse?.status === 200) {
      hasRobotsTxt = robotsResponse.text.includes('Disallow') || robotsResponse.text.includes('User-agent');
      hasSitemap = robotsResponse.text.includes('Sitemap:');
    }
  } catch {}

  const robots = robotsMeta || hasRobotsTxt;
  const favicon = $('link[rel*="icon"]').length > 0;
  const logo = $('img[alt*="logo" i], img[src*="logo" i], .logo, #logo, [class*="logo"]').length > 0;

  if (debug) {
    console.log(
      `[DEBUG] Meta found -> title=${!!title}, desc=${!!metaDescription}, canonical=${canonical}, robots=${robots}, h1=${!!h1Primary}`
    );
  }

  // Forms & CTAs
  const forms = $('form');
  let hasEmailInput = false;
  forms.each((_, form) => {
    if ($(form).find('input[type="email"]').length > 0) {
      hasEmailInput = true;
    }
  });

  // Check iframes for embedded forms
  $('iframe[src]').each((_, iframe) => {
    const src = $(iframe).attr('src') || '';
    const formKeywords = ['form', 'subscribe', 'newsletter', 'email-signup', 'mailchimp', 'sendinblue', 'klaviyo'];
    if (formKeywords.some((kw) => src.toLowerCase().includes(kw))) {
      hasEmailInput = true;
    }
  });

  let ctaCount = 0;
  $('a, button').each((_, el) => {
    const text = $(el).text().trim().toLowerCase();
    if (CTA_PHRASES.some((phrase) => text.includes(phrase))) {
      ctaCount++;
    }
  });

  if (debug) console.log(`[DEBUG] Found ${forms.length} forms, email_input=${hasEmailInput}, CTA=${ctaCount}`);

  // Lead gen probing - check common pages for forms
  const probeResults = await probeCommonPages(url);
  let formsCount = forms.length;
  if (Object.keys(probeResults).length > 0) {
    const extraForms = Object.values(probeResults).reduce((sum, v: any) => sum + (v.forms_count || 0), 0);
    formsCount = Math.max(forms.length, extraForms);
    hasEmailInput = hasEmailInput || Object.values(probeResults).some((v: any) => v.has_email_input);
    ctaCount = Math.max(ctaCount, Math.max(...Object.values(probeResults).map((v: any) => v.cta_count || 0), 0));
  }
  
  if (debug) console.log(`[DEBUG] Final lead gen forms_count=${formsCount}, CTA=${ctaCount}`);

  // Social media links
  const socialFound = new Set<string>();
  $('a[href], button[aria-label]').each((_, el) => {
    const href = ($(el).attr('href') || '').toLowerCase();
    const ariaLabel = ($(el).attr('aria-label') || '').toLowerCase();
    const combined = href + ariaLabel;
    SOCIAL_DOMAINS.forEach((domain) => {
      if (combined.includes(domain)) {
        socialFound.add(domain);
      }
    });
  });

  if (debug) console.log(`[DEBUG] Socials found: ${Array.from(socialFound).join(', ')}`);

  // Analytics detection
  const analyticsScripts = new Set<string>();
  $('script[src]').each((_, script) => {
    const src = $(script).attr('src') || '';
    ANALYTICS_PATTERNS.forEach((pattern) => {
      if (src.includes(pattern)) {
        analyticsScripts.add(pattern);
      }
    });
  });

  // Check inline scripts for analytics
  $('script:not([src])').each((_, script) => {
    const content = $(script).html() || '';
    ANALYTICS_PATTERNS.forEach((pattern) => {
      if (content.includes(pattern)) {
        analyticsScripts.add(pattern);
      }
    });
  });

  if (debug) console.log(`[DEBUG] Analytics found: ${Array.from(analyticsScripts).join(', ')}`);

  // Paid advertising detection
  const paidScripts = new Set<string>();
  $('script[src]').each((_, script) => {
    const src = $(script).attr('src') || '';
    PAID_PATTERNS.forEach((pattern) => {
      if (src.includes(pattern)) {
        paidScripts.add(pattern);
      }
    });
  });

  $('script:not([src])').each((_, script) => {
    const content = $(script).html() || '';
    PAID_PATTERNS.forEach((pattern) => {
      if (content.includes(pattern)) {
        paidScripts.add(pattern);
      }
    });
  });

  if (debug) console.log(`[DEBUG] Paid ads found: ${Array.from(paidScripts).join(', ')}`);

  // Content analysis
  const headings = $('h1, h2, h3, h4, h5, h6').length;
  const paragraphs = $('p').length;
  const images = $('img').length;
  const links = $('a[href]').length;
  const textLength = visibleText.length;

  // UX signals
  const hasViewport = $('meta[name="viewport"]').length > 0;
  const hasAltTags = $('img[alt]').length;
  const totalImages = $('img').length;
  const altCoverage = totalImages > 0 ? hasAltTags / totalImages : 0;

  // Blog/article detection - Check WordPress API first
  const wpData = await checkWordPressAPI(url);
  const blogUrls = new Set<string>();
  let articleCount = 0;

  // If WordPress API found posts, use that count
  if (wpData.isWordPress && wpData.postCount > 0) {
    articleCount = wpData.postCount;
    wpData.postUrls.forEach(postUrl => blogUrls.add(postUrl));
    if (debug) console.log(`[DEBUG] WordPress API detected ${articleCount} posts`);
  }

  // Also check HTML for blog links and articles
  $('a[href]').each((_, el) => {
    const href = $(el).attr('href') || '';
    if (BLOG_URL_PATTERNS.some(pattern => pattern.test(href))) {
      try {
        const fullUrl = new URL(href, url).toString();
        blogUrls.add(fullUrl);
      } catch {}
    }
  });

  // Count article elements with WordPress-specific selectors
  let articleElements = 0;
  articleElements += $('article').length;
  articleElements += $('.post, .blog-post, .entry, .hentry, .entry-content').length;
  articleElements += $('.post-content, [class*="post-"], [class*="entry-"]').length;
  articleElements += $('[itemtype*="BlogPosting"], [itemtype*="Article"]').length;
  
  // Use the maximum of API count, article elements, or blog URLs
  articleCount = Math.max(articleCount, articleElements, blogUrls.size);
  
  if (debug) console.log(`[DEBUG] Total articles detected: ${articleCount} (WP API: ${wpData.postCount}, elements: ${articleElements}, URLs: ${blogUrls.size})`);

  // Detect JS-heavy site for UX scoring
  const scriptCount = $('script[src]').length;
  const jsHeavy = scriptCount > 10 || render;

  if (debug) {
    console.log(`[DEBUG][UX] Mode: ${jsHeavy ? 'JS-rendered' : 'Static'}`);
    console.log(`[DEBUG][UX] script_count=${scriptCount}, js_heavy=${jsHeavy}, render=${render}`);
  }

  // Accessibility: image alt text
  const imagesWithAlt = $('img[alt]').length;
  const totalImgs = $('img').length;
  const altRatio = totalImgs > 0 ? imagesWithAlt / totalImgs : 0;

  // Visual clarity: clutter (links + buttons vs text)
  const linkCount = $('a').length;
  const buttonCount = $('button').length;
  const clutterRatio = (linkCount + buttonCount) / Math.max(textLength, 1);

  // Structure: heading depth jumps
  const headingStructure: number[] = [];
  $('h1, h2, h3, h4, h5, h6').each((_, h) => {
    const tagName = $(h).prop('tagName') as string | undefined;
    if (tagName) {
      const level = parseInt(tagName.substring(1));
      headingStructure.push(level);
    }
  });

  const badHeadingJump = headingStructure.some((level, i) => {
    if (i === 0) return false;
    return Math.abs(level - headingStructure[i - 1]) > 2;
  });

  const structureScore = badHeadingJump ? 85 : 100;

  // Accessibility & visual clarity (normalized)
  const accessibility = Math.round(altRatio * 100);
  const visualClarity = Math.round(Math.max(0, (1 - clutterRatio * 5)) * 100);
  const modernization = jsHeavy ? 100 : 80;

  if (debug) {
    console.log(`[DEBUG][UX] alt_ratio=${altRatio.toFixed(2)}, clutter_ratio=${clutterRatio.toFixed(4)}, bad_heading_jump=${badHeadingJump}`);
    console.log(`[DEBUG][UX] accessibility=${accessibility}, visual_clarity=${visualClarity}, structure=${structureScore}`);
  }

  // Weighted UX logic
  let uxWeights: Record<string, number>;
  if (jsHeavy) {
    // Looser weighting for modern JS-heavy designs
    uxWeights = { access: 0.3, clarity: 0.4, structure: 0.1, modern: 0.2 };
  } else {
    // Stricter weighting for static HTML sites
    uxWeights = { access: 0.4, clarity: 0.4, structure: 0.2, modern: 0.0 };
  }

  const weightedSum =
    accessibility * uxWeights.access +
    visualClarity * uxWeights.clarity +
    structureScore * uxWeights.structure +
    modernization * uxWeights.modern;

  const uxScoreFinal = Math.max(0, Math.min(100, Math.round(weightedSum)));

  if (debug) {
    console.log(`[DEBUG][UX] Weights -> ${JSON.stringify(uxWeights)}`);
    console.log(`[DEBUG][UX] modernization=${modernization}, final_ux_score=${uxScoreFinal}`);
  }

  // Compute baseline signals
  const baseline: any = {};

  // SEO Score (using 5-point system from Python)
  const seoComponents = [
    !!title,
    !!metaDescription,
    canonical,
    robots,
    !!h1Primary
  ];
  baseline.seo = seoComponents.filter(Boolean).length / 5.0;
  baseline.title_present = !!title;
  baseline.meta_description_present = !!metaDescription;

  // Content Score (Python version: word count based)
  const wordCount = visibleText.split(/\s+/).length;
  baseline.content = Math.min(1.0, 0.5 + 0.5 * (wordCount > 800 ? 1 : 0));
  baseline.blog_count = articleCount;

  // Social Score (Python: min(1.0, len(social_found) / 2.0))
  baseline.social = Math.min(1.0, socialFound.size / 2.0);
  baseline.social_profiles_count = socialFound.size;

  // Lead Generation Score (Python: min(1.0, (1 if forms_count > 0 else 0) + (0.5 if has_email_input else 0)))
  baseline.lead_gen = Math.min(1.0, (formsCount > 0 ? 1 : 0) + (hasEmailInput ? 0.5 : 0));
  baseline.lead_forms_detected = hasEmailInput ? 1 : 0;
  baseline.dynamic_forms_ratio = render ? 0.3 : 0;
  
  if (debug) {
    console.log(`[DEBUG] Lead Gen Calculation: forms=${formsCount}, email=${hasEmailInput}, score=${baseline.lead_gen}`);
  }

  // Analytics Score (Python: min(1.0, len(analytics_found) / 1.5))
  baseline.analytics = Math.min(1.0, analyticsScripts.size / 1.5);
  baseline.analytics_scripts = analyticsScripts.size;
  baseline.analytics_count = analyticsScripts.size;

  // Email Marketing Score (Python: 1.0 if has_email_input or "newsletter" in visible_text else 0.0)
  const hasNewsletterText = /newsletter/i.test(visibleText);
  baseline.email_marketing = hasEmailInput || hasNewsletterText ? 1.0 : 0.0;
  baseline.email_capture = hasEmailInput ? 1 : 0;

  // Paid Advertising Score (Python: min(1.0, len(paid_found) / 2.0))
  baseline.paid_ads = Math.min(1.0, paidScripts.size / 2.0);
  baseline.paid_scripts_detected = paidScripts.size / 5.0;
  baseline.paid_ads_count = paidScripts.size;

  // Brand Score (Python: min(1.0, (1 if logo else 0) + (0.5 if favicon else 0)))
  baseline.brand = Math.min(1.0, (logo ? 1 : 0) + (favicon ? 0.5 : 0));

  // UX Score (already computed above as uxScoreFinal)
  baseline.ux_score = uxScoreFinal / 100;

  // Responsive Score
  baseline.responsive_score = hasViewport ? 0.9 : 0.3;

  // Modern SEO Score
  let modernSeoScore = 0;
  if (canonical) modernSeoScore += 0.3;
  if (robots) modernSeoScore += 0.3;
  if ($('meta[property^="og:"]').length > 0) modernSeoScore += 0.2;
  if ($('meta[name="twitter:card"]').length > 0) modernSeoScore += 0.2;
  baseline.modern_seo_score = Math.min(1, modernSeoScore);

  structured.baseline = baseline;

  // Add metadata to structured output
  structured.title = title;
  structured.meta_description = metaDescription;
  structured.canonical = canonical;
  structured.robots_meta = robots;
  structured.h1_count = $('h1').length;
  structured.forms_count = formsCount;
  structured.has_email_input = hasEmailInput;
  structured.cta_count = ctaCount;
  structured.social_profiles = Array.from(socialFound);
  structured.blog_urls = Array.from(blogUrls);
  structured.article_count = articleCount;
  structured.word_count = wordCount;
  structured.analytics_found = Array.from(analyticsScripts);
  structured.paid_found = Array.from(paidScripts);
  structured.email_present = /@/.test(visibleText);
  structured.logo = logo;
  structured.favicon = favicon;
  structured.ux_score = uxScoreFinal;
  structured.responsive_score = baseline.responsive_score! * 100;
  structured.modern_seo_score = baseline.modern_seo_score! * 100;

  if (debug) {
    console.log('[DEBUG] 🧩 Baseline breakdown:');
    Object.entries(baseline).forEach(([key, value]) => {
      if (typeof value === 'number') {
        console.log(`    ${key}: ${value.toFixed(2)}`);
      }
    });
  }

  return structured;
}

async function renderWithPlaywright(url: string, debug: boolean = false): Promise<string> {
  const maxRetries = 3;
  let lastError: any = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    let page = null;
    try {
      // Progressive timeouts - longer waits on retries for difficult sites
      const baseTimeout = attempt === 1 ? 120000 : attempt === 2 ? 180000 : 240000; // 2min, 3min, 4min
      const jsWaitTime = attempt === 1 ? 3000 : attempt === 2 ? 8000 : 15000; // 3s, 8s, 15s
      const networkIdleTimeout = attempt === 1 ? 15000 : attempt === 2 ? 25000 : 40000; // 15s, 25s, 40s
      const antiDetectionWait = attempt === 1 ? 15000 : attempt === 2 ? 30000 : 45000; // 15s, 30s, 45s
      
      if (debug) {
        console.log(`[DEBUG] Creating browser page from pool (attempt ${attempt}/${maxRetries})...`);
        if (attempt > 1) {
          console.log(`[DEBUG] 🔄 Retry ${attempt}: Using extended timeouts (base: ${baseTimeout}ms, JS: ${jsWaitTime}ms)`);
        }
      }
      page = await browserPool.createPage();

      // Set dynamic timeouts based on retry attempt
      page.setDefaultTimeout(baseTimeout);
      page.setDefaultNavigationTimeout(baseTimeout);

      if (debug) console.log(`[DEBUG] Navigating to ${url}...`);
      
      // Try multiple wait strategies to ensure page loads
      try {
        // Strategy 1: Wait until 'load' event (all resources loaded)
        await page.goto(url, { 
          waitUntil: 'load', 
          timeout: 120000 
        });
        if (debug) console.log(`[DEBUG] Page 'load' event fired`);
      } catch (loadError) {
        if (debug) console.log(`[DEBUG] 'load' event timeout, trying domcontentloaded...`);
        // Fallback: Try domcontentloaded if load fails
        await page.goto(url, { 
          waitUntil: 'domcontentloaded', 
          timeout: 120000 
        });
        if (debug) console.log(`[DEBUG] DOM content loaded`);
      }
      
      // Check for anti-bot/cloudflare protection pages
      try {
        const bodyText = await page.evaluate(() => document.body?.innerText?.toLowerCase() || '');
        if (bodyText.includes('checking your browser') || bodyText.includes('cloudflare') || bodyText.includes('just a moment') || bodyText.includes('please wait') || bodyText.includes('verifying you are human')) {
          if (debug) console.log(`[DEBUG] ⚠️ Detected anti-bot protection page, waiting ${antiDetectionWait}ms (attempt ${attempt})...`);
          await page.waitForTimeout(antiDetectionWait);
          // Check again after wait
          const bodyTextAfter = await page.evaluate(() => document.body?.innerText?.toLowerCase() || '');
          if (debug) console.log(`[DEBUG] After wait, page text length: ${bodyTextAfter.length} chars`);
        }
      } catch (e) {
        // Ignore if body doesn't exist yet
      }
      
      // Wait for network to be mostly idle - longer on retries
      if (debug) console.log(`[DEBUG] Waiting for network idle (timeout: ${networkIdleTimeout}ms)...`);
      try {
        await page.waitForLoadState('networkidle', { timeout: networkIdleTimeout });
        if (debug) console.log(`[DEBUG] Network idle achieved`);
      } catch (e) {
        if (debug) console.log(`[DEBUG] Network idle timeout (continuing anyway)`);
      }
      
      // Wait for body element to ensure basic DOM structure
      if (debug) console.log(`[DEBUG] Waiting for body element...`);
      try {
        await page.waitForSelector('body', { timeout: 10000 });
      } catch (e) {
        if (debug) console.log(`[DEBUG] Body element timeout`);
      }
      
      // Additional wait for JavaScript execution - longer on retries
      if (debug) console.log(`[DEBUG] Waiting for JavaScript execution (${jsWaitTime}ms)...`);
      await page.waitForTimeout(jsWaitTime);

      // Try to scroll to trigger lazy loading
      if (debug) console.log(`[DEBUG] Scrolling page to trigger lazy content...`);
      try {
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        await page.waitForTimeout(1000);
        await page.evaluate(() => window.scrollTo(0, 0));
        await page.waitForTimeout(500);
      } catch (e) {
        if (debug) console.log(`[DEBUG] Scroll failed: ${e}`);
      }

      // Get the final rendered HTML
      const html = await page.content();
      const textContent = html.replace(/<[^>]*>/g, '').trim();

      if (debug) {
        console.log(`[DEBUG] Playwright rendered ${html.length} bytes (${textContent.length} text chars)`);
        console.log(`[DEBUG] First 400 chars of text: ${textContent.substring(0, 400)}`);
        console.log(`[DEBUG] First 600 chars of HTML: ${html.substring(0, 600)}`);
      }
      
      // Validate that we got meaningful content - lowered thresholds for minimal sites
      // Some sites serve very minimal HTML but it's still valid content
      if (html.length < 500 && textContent.length < 50) {
        throw new Error(`Insufficient content rendered: ${html.length} bytes HTML, ${textContent.length} chars text (expected >500 bytes or >50 chars)`);
      }

      // Success - return the HTML
      if (debug) console.log(`[DEBUG] ✅ Successfully rendered page with meaningful content`);
      return html;

    } catch (error: any) {
      lastError = error;
      if (debug) console.error(`[DEBUG] ⚠️ Playwright attempt ${attempt} failed: ${error.message}`);
      
      // If this is the last attempt, we'll fall through to return empty
      if (attempt === maxRetries) {
        console.error(`[DEBUG] ❌ All ${maxRetries} Playwright attempts failed for ${url}`);
        console.error(`[DEBUG] Last error:`, error);
      } else {
        // Progressive backoff - much longer waits on later retries for bot detection cooldown
        const waitTime = attempt === 1 ? 5000 : attempt === 2 ? 12000 : 20000; // 5s, 12s, 20s
        if (debug) console.log(`[DEBUG] Waiting ${waitTime}ms before retry ${attempt + 1}...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
        
        // Force close and recreate browser for clean retry
        try {
          await browserPool.closeBrowser();
          if (debug) console.log(`[DEBUG] Browser closed, will create fresh instance for retry`);
        } catch (e) {
          if (debug) console.error(`[DEBUG] Error closing browser: ${e}`);
        }
      }
    } finally {
      if (page) {
        await browserPool.closePage(page).catch((err) => {
          if (debug) console.error(`[DEBUG] Error closing page: ${err}`);
        });
      }
    }
  }

  // All retries failed - return empty string
  if (debug) console.error(`[DEBUG] ❌ Returning empty HTML after all retries failed`);
  return '';
}
