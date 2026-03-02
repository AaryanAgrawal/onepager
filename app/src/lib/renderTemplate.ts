import { OnePagerData } from "./types";
import { escHtml } from "./utils";

export function renderTemplate(data: OnePagerData): string {
  const d = data;
  const b = d.brand;
  const accent = b.accentColor;
  const primary = b.primaryColor;
  const bg = b.backgroundColor;

  const companyLogoHtml = b.companyLogoUrl
    ? `<img src="${escHtml(b.companyLogoUrl)}" alt="${escHtml(b.companyName)}" style="max-height:40px;max-width:160px;object-fit:contain;" />`
    : `<span style="font-size:18px;font-weight:700;color:${accent};">${escHtml(b.companyName)}</span>`;

  const customerLogoHtml =
    b.showPreparedFor && b.customerName
      ? `<div style="display:flex;align-items:center;gap:8px;">
           ${b.customerLogoUrl ? `<img src="${escHtml(b.customerLogoUrl)}" alt="${escHtml(b.customerName)}" style="max-height:32px;max-width:120px;object-fit:contain;" />` : ""}
           <span style="font-size:11px;color:#6B7280;">Prepared for <strong>${escHtml(b.customerName)}</strong></span>
         </div>`
      : "";

  const tagsHtml = d.hero.tags
    .map(
      (t) =>
        `<span style="display:inline-block;padding:4px 12px;border-radius:24px;font-size:11px;font-weight:500;background:${accent}15;color:${accent};border:1px solid ${accent}30;">${escHtml(t)}</span>`
    )
    .join(" ");

  const valuePropsHtml = d.valueProps.columns
    .map(
      (vp) => `
      <div style="flex:1;background:#F9FAFB;border-radius:8px;padding:20px;border-left:3px solid ${accent};">
        <div style="font-size:24px;margin-bottom:8px;">${escHtml(vp.icon)}</div>
        <h3 style="font-size:14px;font-weight:700;margin:0 0 6px 0;color:${primary};">${escHtml(vp.title)}</h3>
        <p style="font-size:11px;line-height:1.5;margin:0 0 10px 0;color:#374151;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden;">${escHtml(vp.description)}</p>
        <span style="display:inline-block;padding:3px 10px;border-radius:4px;font-size:10px;font-weight:600;background:${accent}15;color:${accent};">${escHtml(vp.badge)}</span>
      </div>`
    )
    .join("");

  const tiersHtml = d.pricing.tiers
    .map(
      (tier) => `
      <div style="flex:1;text-align:center;padding:16px;border-radius:8px;${tier.highlighted ? `background:${accent};color:white;` : `background:#F9FAFB;color:${primary};`}">
        <div style="font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:6px;${tier.highlighted ? "opacity:0.9;" : "color:#6B7280;"}">${escHtml(tier.name)}</div>
        <div style="font-size:24px;font-weight:800;margin-bottom:2px;">${escHtml(tier.price)}<span style="font-size:12px;font-weight:400;">${escHtml(tier.unit)}</span></div>
        <div style="font-size:11px;${tier.highlighted ? "opacity:0.9;" : "color:#6B7280;"}">${escHtml(tier.details)}</div>
      </div>`
    )
    .join("");

  const rolesHtml = d.team.roles
    .map(
      (r) =>
        `<span style="display:inline-block;padding:4px 12px;border-radius:4px;font-size:11px;font-weight:500;background:#E5E7EB;color:${primary};">${escHtml(r)}</span>`
    )
    .join(" ");

  const highlightsHtml = d.team.highlights
    .map(
      (h) =>
        `<div style="font-size:11px;color:#374151;"><span style="color:${accent};margin-right:6px;">✓</span>${escHtml(h)}</div>`
    )
    .join("");

  const securityHtml = d.security.items
    .map(
      (s) =>
        `<div style="display:flex;align-items:center;gap:8px;font-size:11px;color:#374151;"><span style="font-size:16px;">${escHtml(s.icon)}</span>${escHtml(s.text)}</div>`
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=816, initial-scale=1">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    @page { size: 8.5in 11in; margin: 0; }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      width: 8.5in;
      height: 11in;
      margin: 0;
      padding: 0;
      overflow: hidden;
      font-family: 'Inter', system-ui, sans-serif;
      color: ${primary};
      background: ${bg};
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    .page {
      width: 100%;
      height: 100%;
      padding: 36px 40px;
      display: flex;
      flex-direction: column;
      gap: 18px;
      overflow: hidden;
    }
  </style>
</head>
<body>
  <div class="page">

    <!-- HEADER -->
    <header style="display:flex;justify-content:space-between;align-items:center;padding-bottom:14px;border-bottom:2px solid ${accent};">
      <div style="display:flex;align-items:center;gap:12px;">
        ${companyLogoHtml}
        ${b.tagline ? `<span style="font-size:11px;color:#6B7280;border-left:1px solid #D1D5DB;padding-left:12px;">${escHtml(b.tagline)}</span>` : ""}
      </div>
      ${customerLogoHtml}
    </header>

    <!-- HERO -->
    <section style="padding:8px 0;">
      <h1 style="font-size:clamp(24px,4vw,32px);font-weight:800;line-height:1.15;margin-bottom:8px;color:${primary};">${escHtml(d.hero.headline)}</h1>
      <p style="font-size:13px;line-height:1.5;color:#374151;margin-bottom:12px;max-width:600px;">${escHtml(d.hero.subheadline)}</p>
      <div style="display:flex;flex-wrap:wrap;gap:6px;">${tagsHtml}</div>
    </section>

    <!-- VALUE PROPOSITIONS -->
    <section>
      <div style="display:flex;gap:14px;">
        ${valuePropsHtml}
      </div>
    </section>

    <!-- PRICING -->
    <section>
      <h2 style="font-size:16px;font-weight:700;margin-bottom:10px;color:${primary};">${escHtml(d.pricing.sectionTitle)}</h2>
      <div style="display:flex;gap:10px;margin-bottom:6px;">
        ${tiersHtml}
      </div>
      ${d.pricing.footerNote ? `<p style="font-size:10px;color:#6B7280;text-align:center;">${escHtml(d.pricing.footerNote)}</p>` : ""}
    </section>

    <!-- TEAM -->
    <section>
      <h2 style="font-size:16px;font-weight:700;margin-bottom:8px;color:${primary};">${escHtml(d.team.sectionTitle)}</h2>
      <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:8px;">
        ${rolesHtml}
      </div>
      <div style="display:flex;flex-direction:column;gap:4px;">
        ${highlightsHtml}
      </div>
    </section>

    <!-- SECURITY -->
    <section>
      <h2 style="font-size:16px;font-weight:700;margin-bottom:8px;color:${primary};">${escHtml(d.security.sectionTitle)}</h2>
      <div style="display:flex;gap:20px;flex-wrap:wrap;">
        ${securityHtml}
      </div>
    </section>

    <!-- CTA FOOTER -->
    <footer style="margin-top:auto;background:${primary};color:white;padding:18px 24px;border-radius:8px;display:flex;justify-content:space-between;align-items:center;">
      <p style="font-size:14px;font-weight:600;max-width:300px;">${escHtml(d.cta.text)}</p>
      <div style="display:flex;gap:20px;font-size:11px;opacity:0.9;">
        <span>${escHtml(d.cta.email)}</span>
        <span>${escHtml(d.cta.phone)}</span>
        <span>${escHtml(d.cta.website)}</span>
      </div>
    </footer>

  </div>
</body>
</html>`;
}
