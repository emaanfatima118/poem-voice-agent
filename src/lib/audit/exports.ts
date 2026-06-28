import fs from 'fs/promises';
import path from 'path';
import { AuditResult, getFilenameBase } from './utils';
import { loadAuditLog } from './audit-log';
import { uploadToGCS, getMimeType } from '../gcs';
import { documents } from '../db/queries';

// All reports are uploaded directly to Google Cloud Storage
// No local file storage is used for reports

export async function exportMarkdown(result: AuditResult, base: string, userId?: number): Promise<string> {
  try {
    const filename = `${base}.md`;
    console.log('[exportMarkdown] Creating markdown:', filename);

    let content = `# Audit Report — ${result.audit_meta?.url || result.url || 'Unknown URL'}\n\n`;
    content += `**Overall Score:** ${result.overall_score || 'N/A'} | `;
    content += `**Grade:** ${result.overall_grade || 'N/A'}\n\n`;

    content += `## Executive Summary\n`;
    content += `${result.executive_summary || ''}\n\n`;

    content += `## Sections\n`;
    const sections = result.sections || {};
    Object.entries(sections).forEach(([secName, sec]: [string, any]) => {
      content += `### ${secName.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())} — ${sec.score || ''}/100\n`;
      (sec.findings || []).forEach((finding: any) => {
        content += `- **${finding.severity || ''}**: ${finding.title || ''} — ${finding.why_it_matters || ''}\n`;
      });
      content += '\n';
    });

    // Upload to GCS
    const buffer = Buffer.from(content, 'utf-8');
    const uploadResult = await uploadToGCS(buffer, filename, 'text/markdown', `reports/${userId || 'default'}`);

    // Save document record to database if userId provided
    if (userId) {
      await documents.create({
        user_id: userId,
        feature_id: 1, // Pulse Hub
        sub_id: 1, // Audit Performance
        document_name: filename,
        document_type: 'md',
        url: uploadResult.url,
        gcs_bucket: uploadResult.bucket,
        gcs_path: uploadResult.path,
        file_size: uploadResult.size,
        mime_type: uploadResult.mimeType,
        uploaded_by: userId,
        is_public: true,
        metadata: {
          audit_url: result.audit_meta?.url || result.url,
          audit_score: result.overall_score,
          generated_at: new Date().toISOString()
        }
      });
    }

    console.log('[exportMarkdown] Successfully uploaded:', uploadResult.url);
    return uploadResult.url;
  } catch (e: any) {
    console.error('[exportMarkdown] Failed to export:', e);
    console.error('[exportMarkdown] Error stack:', e.stack);
    return '';
  }
}

// Generate markdown content in memory without saving to GCS
export async function generateMarkdownContent(result: AuditResult, userId?: number): Promise<string> {
  let content = `# Audit Report — ${result.audit_meta?.url || result.url || 'Unknown URL'}\n\n`;
  content += `**Overall Score:** ${result.overall_score || 'N/A'} | `;
  content += `**Grade:** ${result.overall_grade || 'N/A'}\n\n`;

  content += `## Executive Summary\n`;
  content += `${result.executive_summary || ''}\n\n`;

  content += `## Sections\n`;
  const sections = result.sections || {};
  Object.entries(sections).forEach(([secName, sec]: [string, any]) => {
    content += `### ${secName.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())} — ${sec.score || ''}/100\n`;
    (sec.findings || []).forEach((finding: any) => {
      content += `- **${finding.severity || ''}**: ${finding.title || ''} — ${finding.why_it_matters || ''}\n`;
    });
    content += '\n';
  });

  return content;
}

// Generate PDF buffer in memory without saving to GCS
export async function generatePdfBuffer(result: AuditResult, userId?: number): Promise<Buffer> {
  console.log('[generatePdfBuffer] Generating PDF in memory');
  
  // Read logo file and convert to base64
  const logoPath = path.join(process.cwd(), 'public', 'images', 'stackwise-full-logo.png');
  let logoBase64 = '';
  try {
    const logoBuffer = await fs.readFile(logoPath);
    logoBase64 = logoBuffer.toString('base64');
    console.log(`[generatePdfBuffer] Logo loaded successfully, size: ${logoBuffer.length} bytes`);
  } catch (e) {
    console.error('[generatePdfBuffer] Failed to read logo:', e);
  }

  // Generate trendline chart from performance_audit_log
  const auditUrl = (result.audit_meta as any)?.url || result.url || '';
  let trendlineBase64 = '';
  if (auditUrl) {
    trendlineBase64 = await generateTrendlineChart(auditUrl, userId);
  }
  
  // Use Playwright to generate PDF from styled HTML
  const { browserPool } = await import('@/lib/playwright/browser-pool');
  const { PDF_OPTIONS } = await import('@/lib/playwright/config');

  const createPdfOnce = async (): Promise<Buffer> => {
    const page = await browserPool.createPage();
    try {
      const meta = result.audit_meta || {};
      const urlForDisplay = (meta as any).url || 'N/A';
      const dateStr = new Date(((meta as any).timestamp || Date.now() / 1000) * 1000).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      const htmlContent = generateStyledHtml(result, urlForDisplay, dateStr, logoBase64, trendlineBase64);
      await page.setContent(htmlContent);
      return await page.pdf(PDF_OPTIONS);
    } finally {
      await browserPool.closePage(page);
    }
  };

  let pdfBuffer: Buffer | null = null;
  let lastError: any = null;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      if (attempt > 1) {
        console.warn(`[generatePdfBuffer] Retry attempt ${attempt} after error:`, lastError?.message || lastError);
        await browserPool.closeBrowser();
      }
      pdfBuffer = await createPdfOnce();
      break;
    } catch (err: any) {
      lastError = err;
      if (attempt === 3) {
        console.error('[generatePdfBuffer] All PDF generation attempts failed:', err);
        throw err;
      }
      await new Promise(r => setTimeout(r, attempt * 500));
    }
  }
  
  if (!pdfBuffer) throw new Error('PDF buffer not created');
  
  console.log(`[generatePdfBuffer] PDF generated successfully, size: ${pdfBuffer.length} bytes`);
  return pdfBuffer;
}

export async function exportJson(result: AuditResult, base: string, userId?: number): Promise<string> {
  try {
    const filename = `${base}.json`;
    console.log('[exportJson] Creating JSON:', filename);

    const content = JSON.stringify(result, null, 2);

    // Upload to GCS
    const buffer = Buffer.from(content, 'utf-8');
    const uploadResult = await uploadToGCS(buffer, filename, 'application/json', `reports/${userId || 'default'}`);

    // Save document record to database if userId provided
    if (userId) {
      await documents.create({
        user_id: userId,
        feature_id: 1, // Pulse Hub
        sub_id: 1, // Audit Performance
        document_name: filename,
        document_type: 'json',
        url: uploadResult.url,
        gcs_bucket: uploadResult.bucket,
        gcs_path: uploadResult.path,
        file_size: uploadResult.size,
        mime_type: uploadResult.mimeType,
        uploaded_by: userId,
        is_public: true,
        metadata: {
          audit_url: result.audit_meta?.url || result.url,
          audit_score: result.overall_score,
          generated_at: new Date().toISOString()
        }
      });
    }

    console.log('[exportJson] Successfully uploaded:', uploadResult.url);
    return uploadResult.url;
  } catch (e: any) {
    console.error('[exportJson] Failed to export:', e);
    console.error('[exportJson] Error stack:', e.stack);
    return '';
  }
}

async function generateTrendlineChart(url: string, userId?: number): Promise<string> {
  try {
    const auditLog = await loadAuditLog(userId);
    const audits = auditLog[url] || [];
    
    if (audits.length < 1) {
      console.log('[generateTrendlineChart] No audit history for trendline');
      return '';
    }

    // Extract timestamps and scores from performance_audit_log
    const entries: Array<{ date: Date; score: number }> = [];
    audits.forEach((audit: any) => {
      // Handle both old format (audit_meta.timestamp) and new format (date)
      let date: Date;
      if (audit.date) {
        date = new Date(audit.date);
      } else if (audit.audit_meta && audit.audit_meta.timestamp) {
        date = new Date(audit.audit_meta.timestamp * 1000);
      } else {
        return; // Skip if no date
      }
      const score = audit.overall_score || 0;
      entries.push({ date, score });
    });

    if (entries.length === 0) {
      console.log('[generateTrendlineChart] No valid entries for trendline');
      return '';
    }

    // Sort by date
    entries.sort((a, b) => a.date.getTime() - b.date.getTime());

    // Create chart using SVG - no native dependencies needed
    const width = 700;
    const height = 280;

    // Colors matching Django
    const bgColor = '#1e1e1e';
    const lineColor = '#7C5CFF';
    const pointColor = '#EDEBFA';
    const pointBorderColor = '#4B32A8';
    const gridColor = 'rgba(255, 255, 255, 0.1)';
    const textColor = '#BBBBBB';
    const titleColor = '#FFFFFF';

    // Chart dimensions
    const paddingLeft = 55;
    const paddingRight = 25;
    const paddingTop = 45;
    const paddingBottom = 75;
    const chartWidth = width - paddingLeft - paddingRight;
    const chartHeight = height - paddingTop - paddingBottom;
    const chartLeft = paddingLeft;
    const chartTop = paddingTop;
    const chartBottom = chartTop + chartHeight;
    
    const xStep = entries.length > 1 ? chartWidth / (entries.length - 1) : chartWidth / 2;

    // Generate grid lines
    const gridLines = Array.from({ length: 10 }, (_, i) => {
      const score = (i + 1) * 10;
      const y = chartBottom - (score / 100) * chartHeight;
      return `<line x1="${chartLeft}" y1="${y}" x2="${chartLeft + chartWidth}" y2="${y}" stroke="${gridColor}" stroke-width="1" stroke-dasharray="5,5"/>
              <text x="${chartLeft - 15}" y="${y}" text-anchor="end" dominant-baseline="middle" fill="${textColor}" font-size="12" font-family="Arial">${score}</text>`;
    }).join('');

    // Generate X-axis labels
    const xLabels = entries.map((entry, i) => {
      const x = chartLeft + (entries.length > 1 ? i * xStep : chartWidth / 2);
      const label = entry.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const time = entry.date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
      return `<line x1="${x}" y1="${chartBottom}" x2="${x}" y2="${chartBottom + 5}" stroke="#444444" stroke-width="2"/>
              <text x="${x}" y="${chartBottom + 20}" text-anchor="end" fill="${textColor}" font-size="11" font-family="Arial" transform="rotate(-45 ${x} ${chartBottom + 20})">${label} ${time}</text>`;
    }).join('');

    // Generate filled area path
    const areaPoints = entries.map((entry, i) => {
      const x = chartLeft + (entries.length > 1 ? i * xStep : chartWidth / 2);
      const y = chartBottom - (entry.score / 100) * chartHeight;
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');
    const lastX = chartLeft + (entries.length > 1 ? (entries.length - 1) * xStep : chartWidth / 2);
    const areaPath = `${areaPoints} L ${lastX} ${chartBottom} L ${chartLeft} ${chartBottom} Z`;

    // Generate line path
    const linePath = entries.map((entry, i) => {
      const x = chartLeft + (entries.length > 1 ? i * xStep : chartWidth / 2);
      const y = chartBottom - (entry.score / 100) * chartHeight;
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');

    // Generate points and labels
    const points = entries.map((entry, i) => {
      const x = chartLeft + (entries.length > 1 ? i * xStep : chartWidth / 2);
      const y = chartBottom - (entry.score / 100) * chartHeight;
      const isLast = i === entries.length - 1;
      const radius = isLast ? 7 : 6;
      
      return `
        ${isLast ? `<circle cx="${x}" cy="${y}" r="9" fill="rgba(167, 139, 250, 0.3)"/>` : ''}
        <circle cx="${x}" cy="${y}" r="${radius}" fill="${pointColor}" stroke="${pointBorderColor}" stroke-width="${isLast ? 3 : 2}"/>
        <text x="${x}" y="${y - 15}" text-anchor="middle" fill="${titleColor}" font-size="${isLast ? '14' : '12'}" font-weight="bold" font-family="Arial" style="text-shadow: 0 0 4px rgba(0,0,0,0.8)">${entry.score}</text>
      `;
    }).join('');

    // Generate SVG
    const svg = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <rect width="${width}" height="${height}" fill="${bgColor}"/>
        
        <!-- Title -->
        <text x="${width / 2}" y="30" text-anchor="middle" fill="${titleColor}" font-size="16" font-weight="bold" font-family="Arial">Audit Score Trend</text>
        
        <!-- Axes -->
        <line x1="${chartLeft}" y1="${chartTop}" x2="${chartLeft}" y2="${chartBottom}" stroke="#444444" stroke-width="2"/>
        <line x1="${chartLeft}" y1="${chartBottom}" x2="${chartLeft + chartWidth}" y2="${chartBottom}" stroke="#444444" stroke-width="2"/>
        
        <!-- Grid and Y-axis labels -->
        ${gridLines}
        
        <!-- X-axis labels -->
        ${xLabels}
        
        <!-- Axis labels -->
        <text x="20" y="${chartTop + chartHeight / 2}" text-anchor="middle" fill="#CCCCCC" font-size="12" font-weight="bold" font-family="Arial" transform="rotate(-90 20 ${chartTop + chartHeight / 2})">Overall Score</text>
        <text x="${chartLeft + chartWidth / 2}" y="${height - 15}" text-anchor="middle" fill="#CCCCCC" font-size="12" font-weight="bold" font-family="Arial">Audit Date</text>
        
        <!-- Filled area -->
        <path d="${areaPath}" fill="rgba(124, 92, 255, 0.15)"/>
        
        <!-- Line -->
        <path d="${linePath}" stroke="${lineColor}" stroke-width="3" fill="none"/>
        
        <!-- Points and labels -->
        ${points}
      </svg>
    `;

    // Convert SVG to base64
    const imageBase64 = Buffer.from(svg).toString('base64');
    
    console.log(`[generateTrendlineChart] Chart generated successfully, ${entries.length} data points`);
    return imageBase64;
    
  } catch (error) {
    console.error('[generateTrendlineChart] Error:', error);
    return '';
  }
}

export async function exportPdf(result: AuditResult, base: string, userId?: number): Promise<string> {
  const filename = `${base}.pdf`;
  
  try {
    console.log('[exportPdf] Generating PDF:', filename);
    
    // Read logo file and convert to base64
    const logoPath = path.join(process.cwd(), 'public', 'images', 'stackwise-full-logo.png');
    let logoBase64 = '';
    try {
      const logoBuffer = await fs.readFile(logoPath);
      logoBase64 = logoBuffer.toString('base64');
      console.log(`[exportPdf] Logo loaded successfully, size: ${logoBuffer.length} bytes`);
    } catch (e) {
      console.error('[exportPdf] Failed to read logo from public/images/stackwise-full-logo.png:', e);
    }

    // Generate trendline chart from performance_audit_log
    const auditUrl = (result.audit_meta as any)?.url || result.url || '';
    let trendlineBase64 = '';
    if (auditUrl) {
      trendlineBase64 = await generateTrendlineChart(auditUrl, userId);
    }
    
    // Use Playwright to generate PDF from styled HTML with retries
    const { browserPool } = await import('@/lib/playwright/browser-pool');
    const { PDF_OPTIONS } = await import('@/lib/playwright/config');

    const createPdfOnce = async (): Promise<Buffer> => {
      const page = await browserPool.createPage();
      try {
        const meta = result.audit_meta || {};
        const urlForDisplay = (meta as any).url || 'N/A';
        const dateStr = new Date(((meta as any).timestamp || Date.now() / 1000) * 1000).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });

        const htmlContent = generateStyledHtml(result, urlForDisplay, dateStr, logoBase64, trendlineBase64);
        await page.setContent(htmlContent);
        return await page.pdf(PDF_OPTIONS);
      } finally {
        await browserPool.closePage(page);
      }
    };

    let pdfBuffer: Buffer | null = null;
    let lastError: any = null;
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        if (attempt > 1) {
          console.warn(`[exportPdf] Retry attempt ${attempt} after error:`, lastError?.message || lastError);
          // Force close and relaunch browser to recover from crashes
          await browserPool.closeBrowser();
        }
        pdfBuffer = await createPdfOnce();
        break;
      } catch (err: any) {
        lastError = err;
        if (attempt === 3) {
          console.error('[exportPdf] All PDF generation attempts failed:', err);
          throw err;
        }
        await new Promise(r => setTimeout(r, attempt * 500));
      }
    }
    if (!pdfBuffer) throw new Error('PDF buffer not created');
    
    // Upload to GCS
    const uploadResult = await uploadToGCS(pdfBuffer, filename, 'application/pdf', `reports/${userId || 'default'}`);

    // Save document record to database if userId provided
    if (userId) {
      await documents.create({
        user_id: userId,
        feature_id: 1, // Pulse Hub
        sub_id: 1, // Audit Performance
        document_name: filename,
        document_type: 'pdf',
        url: uploadResult.url,
        gcs_bucket: uploadResult.bucket,
        gcs_path: uploadResult.path,
        file_size: uploadResult.size,
        mime_type: uploadResult.mimeType,
        uploaded_by: userId,
        is_public: true,
        metadata: {
          audit_url: result.audit_meta?.url || result.url,
          audit_score: result.overall_score,
          generated_at: new Date().toISOString()
        }
      });
    }
    
    console.log(`[exportPdf] PDF uploaded: ${uploadResult.url}`);
    return uploadResult.url;
    
  } catch (e) {
    console.error('[exportPdf] Failed to export:', e);
    return '';
  }
}

function generateStyledHtml(result: AuditResult, url: string, dateStr: string, logoBase64: string, trendlineBase64: string = ''): string {
  const primaryColor = '#4B32A8';
  const accentColor = '#EDEBFA';
  const grayText = '#555555';
  
  let html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    @page { size: A4; margin: 0; }
    body { 
      font-family: 'Helvetica', Arial, sans-serif; 
      margin: 40px; 
      color: #333; 
      font-size: 10pt;
      line-height: 1.4;
    }
    h1 { 
      color: ${primaryColor}; 
      font-size: 20pt; 
      margin-bottom: 8px; 
      font-weight: bold;
    }
    h2 { 
      color: ${primaryColor}; 
      font-size: 13pt; 
      margin-top: 16px; 
      margin-bottom: 8px; 
      background-color: ${accentColor}; 
      padding: 6px 8px;
      font-weight: bold;
      page-break-after: avoid;
    }
    h3 { 
      color: ${primaryColor}; 
      font-size: 11pt; 
      margin-top: 8px; 
      margin-bottom: 4px;
      font-weight: bold;
    }
    .info-table { 
      width: 100%; 
      border-collapse: collapse; 
      margin: 12px 0;
      background-color: whitesmoke;
    }
    .info-table td { 
      border: 0.7px solid black; 
      padding: 4px; 
      font-size: 9pt;
      vertical-align: middle;
    }
    .info-table td:nth-child(odd) { font-weight: bold; width: 20%; }
    .summary-stats { 
      margin: 12px 0; 
      font-size: 10pt;
    }
    .summary-cards { 
      display: grid; 
      grid-template-columns: 1fr 1fr; 
      gap: 10px; 
      margin: 10px 0;
      page-break-inside: avoid;
    }
    .card { 
      background-color: whitesmoke; 
      border: 0.25px solid #dddddd; 
      padding: 8px;
      page-break-inside: avoid;
      min-height: 80px;
    }
    .card h4 { 
      margin: 0 0 4px 0; 
      font-size: 10pt;
      font-weight: bold;
    }
    .card ul { 
      margin: 0; 
      padding-left: 10px; 
      list-style-type: disc;
    }
    .card li { 
      margin: 2px 0; 
      font-size: 9pt;
    }
    .section { 
      margin: 12px 0 16px 0; 
      page-break-inside: avoid;
    }
    .findings-table { 
      width: 100%; 
      margin: 4px 0;
      border-collapse: collapse;
    }
    .findings-table th { 
      text-align: left; 
      font-size: 9pt;
      font-weight: bold;
      padding-bottom: 3px;
      color: black;
    }
    .findings-table td { 
      vertical-align: top; 
      padding: 4px 10px 4px 0; 
      font-size: 9pt;
      line-height: 1.4;
      word-wrap: break-word;
    }
    .findings-table td:first-child { width: 50%; }
    .severity-critical { color: #d32f2f; font-weight: bold; }
    .severity-high { color: #f57c00; font-weight: bold; }
    .severity-medium { color: #fbc02d; font-weight: bold; }
    .severity-low { color: #388e3c; font-weight: bold; }
    .plan ul { 
      margin: 0; 
      padding-left: 10px;
      list-style-type: disc;
    }
    .plan li { 
      margin: 3px 0; 
      font-size: 9pt;
      line-height: 1.3;
    }
    .plan h3 {
      page-break-after: avoid;
    }
    .footer { 
      position: fixed; 
      bottom: 20px; 
      left: 40px; 
      right: 40px; 
      text-align: left; 
      font-size: 8pt; 
      color: ${grayText};
    }
    .page-break { page-break-after: always; }
    .logo-container {
      text-align: center;
      margin-bottom: 10px;
    }
    .logo {
      width: 133px;
      height: 60px;
    }
  </style>
</head>
<body>
  <!-- Logo -->
  <div class="logo-container">
    <img class="logo" src="data:image/png;base64,${logoBase64}" alt="Stackwise" />
  </div>
  
  <table class="info-table">
    <tr>
      <td>Website</td>
      <td>${url}</td>
      <td>Report Date</td>
      <td>${dateStr}</td>
    </tr>
    <tr>
      <td>Overall Score</td>
      <td>${result.overall_score || 'N/A'}</td>
      <td>Performance Level</td>
      <td>${result.performance_level || 'N/A'}</td>
    </tr>
  </table>
  
  <h1 style="font-size: 16pt; margin-top: 12px; page-break-after: avoid;">Audit Report Summary</h1>
  <p style="line-height: 1.5; margin-bottom: 10px;">${result.executive_summary || 'No summary available.'}</p>
  
  <div class="summary-stats">
    <strong>Overall Score:</strong> ${result.overall_score || 'N/A'} | 
    <strong>Grade:</strong> ${result.overall_grade || 'N/A'} | 
    <strong>Performance Level:</strong> ${result.performance_level || 'N/A'}
  </div>
`;

  // Summary Cards
  const summaryCards = result.summary_cards || {};
  if (Object.keys(summaryCards).length > 0) {
    html += '<h2>Summary Overview</h2><div class="summary-cards">';
    
    const cardKeys = ['Top Strengths', 'Top Gaps', 'Top Priorities', 'Quick Wins'];
    cardKeys.forEach(key => {
      const items = (summaryCards as any)[key] || [];
      html += `<div class="card"><h4>${key}</h4><ul>`;
      if (items.length > 0) {
        items.forEach((item: string) => {
          html += `<li>${item}</li>`;
        });
      } else {
        html += '<li><i>No data</i></li>';
      }
      html += '</ul></div>';
    });
    html += '</div><div class="page-break"></div>';
  }
  
  // Sections
  const sections = result.sections || {};
  if (Object.keys(sections).length > 0) {
    Object.entries(sections).forEach(([secName, sec]: [string, any]) => {
      const displayName = secName.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
      html += `<div class="section"><h2>${displayName} — ${sec.score || 'N/A'}/100</h2>`;
      
      const findings = sec.findings || [];
      if (findings.length > 0) {
        html += '<table class="findings-table"><tr><th>Finding</th><th>Why It Matters</th></tr>';
        findings.forEach((finding: any) => {
          const severityClass = `severity-${(finding.severity || 'low').toLowerCase()}`;
          html += `<tr>
            <td><span class="${severityClass}">${finding.severity || ''}</span> — ${finding.title || ''}</td>
            <td>${finding.why_it_matters || ''}</td>
          </tr>`;
        });
        html += '</table>';
      }
      html += '</div>';
    });
  }
  
  // Competitor Snapshot - only include if data exists
  const comp = result.competitor_snapshot || {};
  if (comp && Object.keys(comp).length > 0 && 
      (comp.gaps?.length > 0 || comp.opportunities?.length > 0 || comp.insights?.length > 0 || comp.recommendations?.length > 0)) {
    html += '<h2>Competitor Snapshot</h2>';
    Object.entries(comp).forEach(([key, vals]: [string, any]) => {
      if (Array.isArray(vals) && vals.length > 0) {
        html += `<h3>${key.charAt(0).toUpperCase() + key.slice(1)}</h3><ul>`;
        vals.forEach((v: string) => {
          html += `<li>${v}</li>`;
        });
        html += '</ul>';
      }
    });
  }
  
  // 30-60-90 Day Plan
  const plan = result.plan_30_60_90 || {};
  if (Object.keys(plan).length > 0) {
    html += '<div class="page-break"></div><h2>30 / 60 / 90-Day Plan</h2><div class="plan">';
    ['30_days', '60_days', '90_days'].forEach(phase => {
      const tasks = (plan as any)[phase] || [];
      if (tasks.length > 0) {
        html += `<h3 style="margin-top: 12px; margin-bottom: 6px; color: ${primaryColor};">${phase.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}</h3><ul>`;
        tasks.forEach((task: string) => {
          html += `<li style="margin-bottom: 4px;">${task}</li>`;
        });
        html += '</ul>';
      }
    });
    html += '</div>';
  }
  
  // Short Next Steps
  const nextSteps = result.short_next_steps || [];
  if (Array.isArray(nextSteps) && nextSteps.length > 0) {
    html += '<h2 style="margin-top: 18px;">Short Next Steps</h2><ul style="margin-top: 8px; line-height: 1.5;">';
    nextSteps.forEach((step: string) => {
      html += `<li style="margin-bottom: 5px;">${step}</li>`;
    });
    html += '</ul>';
  }
  
  // Trendline Chart
  if (trendlineBase64) {
    html += `
    <h2 style="margin-top: 24px; page-break-before: avoid;">Audit Score Trendline</h2>
    <div style="text-align: center; margin: 16px auto; max-width: 720px;">
      <img src="data:image/png;base64,${trendlineBase64}" alt="Audit Score Trend" style="width: 100%; height: auto; display: block; margin: 0 auto;" />
    </div>
    <p style="font-size: 9pt; color: ${grayText}; text-align: center; margin-top: 10px; line-height: 1.4;">
      Historical audit scores showing performance trends over time
    </p>`;
  }
  
  // Notes
  const notes = result.notes || '';
  if (notes) {
    html += `<h2>Notes</h2><p>${notes}</p>`;
  }
  
  html += `
  <div class="footer">Generated by Stackwise — Pulse Hub</div>
</body>
</html>`;
  
  return html;
}

export interface ExportAuditOptions {
  url: string;
  auditName?: string;
  exportFormat?: 'md' | 'json' | 'pdf' | 'all';
  includePlots?: boolean;
  result: AuditResult;
  userId?: number;
}

export async function exportAudit(options: ExportAuditOptions): Promise<{
  success: boolean;
  files?: Record<string, string>;
  message?: string;
  error?: string;
}> {
  const { url, auditName, exportFormat = 'all', includePlots = false, result, userId } = options;

  try {
    if (!url) {
      console.error('[exportAudit] No URL provided');
      return { success: false, error: 'URL is required' };
    }

    if (!result) {
      console.error('[exportAudit] No result provided');
      return { success: false, error: 'No audit result provided' };
    }

    console.log('[exportAudit] Starting export with:', { url, auditName, exportFormat, userId });
    const base = getFilenameBase(url, auditName);
    console.log('[exportAudit] Filename base:', base);
    const files: Record<string, string> = {};

    // Export markdown
    if (exportFormat === 'md' || exportFormat === 'all') {
      try {
        console.log('[exportAudit] Exporting markdown...');
        const mdUrl = await exportMarkdown(result, base, userId);
        console.log('[exportAudit] Markdown URL:', mdUrl);
        if (mdUrl) files.markdown = mdUrl;
      } catch (mdError: any) {
        console.error('[exportAudit] Markdown export failed:', mdError);
      }
    }

    // Export PDF with trendline from performance_audit_log
    if (exportFormat === 'pdf' || exportFormat === 'all') {
      try {
        console.log('[exportAudit] Generating PDF...');
        const pdfUrl = await exportPdf(result, base, userId);
        console.log('[exportAudit] PDF URL:', pdfUrl);
        if (pdfUrl) {
          files.pdf = pdfUrl;
        } else if (exportFormat === 'pdf') {
          return { success: false, error: 'PDF generation failed' };
        }
      } catch (pdfError: any) {
        console.error('[exportAudit] PDF export failed:', pdfError);
        if (exportFormat === 'pdf') {
          return { success: false, error: pdfError?.message || 'PDF export failed' };
        }
      }
    }

    // Export JSON
    if (exportFormat === 'json' || exportFormat === 'all') {
      try {
        console.log('[exportAudit] Exporting JSON...');
        const jsonUrl = await exportJson(result, base, userId);
        console.log('[exportAudit] JSON URL:', jsonUrl);
        if (jsonUrl) files.json = jsonUrl;
      } catch (jsonError: any) {
        console.error('[exportAudit] JSON export failed:', jsonError);
      }
    }

    console.log('[exportAudit] Export completed. Files:', files);
    return {
      success: true,
      files,
      message: 'Export completed successfully',
    };
  } catch (e: any) {
    console.error('[exportAudit] Error:', e);
    console.error('[exportAudit] Error stack:', e.stack);
    return {
      success: false,
      error: e.message || 'Export failed',
    };
  }
}
