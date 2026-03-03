// Test one-pager generator — creates various layouts to test the system
// Usage: node _test-gen.js <prompt-number>
const fs = require('fs');
const path = require('path');

const num = parseInt(process.argv[2] || '11');
const logoBase64 = fs.readFileSync(path.join(__dirname, 'brand', 'logo-w-type-light-base64.txt'), 'utf8').trim();
const outPath = path.join(__dirname, 'app', 'current.html');

// ─── BASE STYLE ───────────────────────────────────────────────────────────────
// Matches Farhand reference design language exactly.
// Font sizes: body 13px min, labels 11px min, section titles 20px, CTA 20px.
// Icons: 18px inline. Logo: 40px. Spacing: generous per references.
const BASE_STYLE = `
:root { --accent: #33ee69; --primary: #10100d; --bg: #ffffff; --gray: #f5f5f5; --gray-border: #e0e0e0; --muted: #666; }
@page { size: 8.5in 11in; margin: 0; }
* { margin: 0; padding: 0; box-sizing: border-box; }
body { width: 8.5in; height: 11in; overflow: hidden; font-family: 'Inter', sans-serif; color: var(--primary); background: var(--bg); display: flex; flex-direction: column; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
.bar { width: 100%; height: 5px; background: var(--accent); flex-shrink: 0; }
.header { display: flex; justify-content: space-between; align-items: flex-start; padding: 24px 40px 16px; flex-shrink: 0; }
.header img { height: 40px; }
.sub { font-size: 13px; color: var(--muted); margin-top: 4px; }
.pill { display: inline-block; padding: 6px 16px; border: 1.5px solid var(--accent); border-radius: 20px; font-size: 12px; font-weight: 600; }
.section { padding: 0 40px 20px; flex-shrink: 0; }
.stitle { font-size: 20px; font-weight: 700; padding-left: 12px; border-left: 3px solid var(--accent); margin-bottom: 14px; }
.cta { margin-top: auto; padding: 20px 40px; background: var(--gray); flex-shrink: 0; }
.cpill { display: inline-flex; align-items: center; gap: 8px; padding: 8px 20px; border: 1.5px solid var(--accent); border-radius: 24px; font-size: 13px; font-weight: 500; }
`;

const LOGO_IMG = `<img src="data:image/png;base64,${logoBase64}" alt="Farhand" style="height:40px;">`;

// ─── ICONS (18px to match references) ─────────────────────────────────────────
const CHECK_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#33ee69" viewBox="0 0 256 256"><path d="M173.66,98.34a8,8,0,0,1,0,11.32l-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35A8,8,0,0,1,173.66,98.34Z"/></svg>`;
const X_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#ef4444" viewBox="0 0 256 256"><path d="M165.66,101.66,139.31,128l26.35,26.34a8,8,0,0,1-11.32,11.32L128,139.31l-26.34,26.35a8,8,0,0,1-11.32-11.32L116.69,128,90.34,101.66a8,8,0,0,1,11.32-11.32L128,116.69l26.34-26.35a8,8,0,0,1,11.32,11.32Z"/></svg>`;
const PHONE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#33ee69" viewBox="0 0 256 256"><path d="M222.37,158.46l-47.11-21.11-.13-.06a16,16,0,0,0-15.17,1.4,8.12,8.12,0,0,0-.75.56L134.87,160c-15.42-7.49-31.34-23.29-38.83-38.51l20.78-24.71c.2-.25.39-.5.57-.77a16,16,0,0,0,1.32-15.06l0-.12L97.54,33.64a16,16,0,0,0-16.62-9.52A56.26,56.26,0,0,0,32,80c0,79.4,64.6,144,144,144a56.26,56.26,0,0,0,55.88-48.92A16,16,0,0,0,222.37,158.46ZM176,208A128.14,128.14,0,0,1,48,80,40.2,40.2,0,0,1,82.87,40a.61.61,0,0,0,0,.12l21,47L83.2,111.86a6.13,6.13,0,0,0-.57.77,16,16,0,0,0-1,15.7c9.06,18.53,27.73,37.06,46.46,46.11a16,16,0,0,0,15.17-1.4,8.12,8.12,0,0,0,.75-.56L168.89,152l47,21.05h0s.08,0,.11,0A40.21,40.21,0,0,1,176,208Z"/></svg>`;
const MAIL_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#33ee69" viewBox="0 0 256 256"><path d="M224,48H32a8,8,0,0,0-8,8V192a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A8,8,0,0,0,224,48ZM203.43,64,128,133.15,52.57,64ZM216,192H40V74.19l82.59,75.71a8,8,0,0,0,10.82,0L216,74.19V192Z"/></svg>`;
const GLOBE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#33ee69" viewBox="0 0 256 256"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm88,104a87.62,87.62,0,0,1-6.4,32.94l-44.7-27.49a15.92,15.92,0,0,0-6.24-2.23l-22.82-3.08a16.11,16.11,0,0,0-16,7.86h-8.72l-3.8-7.86a16,16,0,0,0-11.09-8.48L74.34,115l-4.82-8.44A16,16,0,0,0,56,98.72V104Z"/></svg>`;

function wrap(title, bodyHtml, extraStyle = '') {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title}</title>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<style>${BASE_STYLE}${extraStyle}</style>
</head>
<body>
<div class="bar"></div>
${bodyHtml}
</body>
</html>`;
}

function ctaFooter() {
  return `<div class="cta">
  <h2 data-field="cta-text" style="font-size:20px;font-weight:700;font-style:italic;margin-bottom:12px;">Let's talk about a free pilot</h2>
  <div style="display:flex;gap:12px;flex-wrap:wrap;">
    <span class="cpill">${PHONE_SVG} <span data-field="phone">213-522-6220</span></span>
    <span class="cpill">${MAIL_SVG} <span data-field="email">akshansh@farhand.live</span></span>
    <span class="cpill">${GLOBE_SVG} <span data-field="website">www.farhand.live</span></span>
  </div>
</div>`;
}

function headerHtml(subtitle, pills) {
  const pillsHtml = pills.map((p, i) => `<span class="pill" data-field="segment-${i+1}">${p}</span>`).join('\n');
  return `<div class="header">
  <div>${LOGO_IMG}<p class="sub" data-field="subtitle">${subtitle}</p></div>
  <div style="text-align:right;">
    <p style="font-size:11px;font-weight:500;color:#999;text-transform:uppercase;margin-bottom:8px;">Solution made for:</p>
    <div style="display:flex;flex-direction:column;gap:6px;align-items:flex-end;">${pillsHtml}</div>
  </div>
</div>`;
}

// ============== PROMPT 11: Pricing Table ==============
function prompt11() {
  return wrap('Farhand — Pricing', `
${headerHtml('AI-Powered Field Service', ['Apex Robotics'])}
<div class="section">
  <h1 data-field="headline" style="font-size:22px;font-weight:800;margin-bottom:8px;">Simple, Transparent Pricing</h1>
  <p data-field="hero-text" style="font-size:13px;color:var(--muted);line-height:1.5;">Choose the plan that fits your fleet size. All plans include AI-guided technicians, real-time reporting, and 24/7 dispatch.</p>
</div>
<div class="section">
  <h2 class="stitle">Plans</h2>
  <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px;">
    <div style="background:var(--gray);border-radius:10px;padding:22px;display:flex;flex-direction:column;gap:8px;">
      <div style="font-size:13px;font-weight:600;color:var(--muted);" data-field="tier-1-name">STARTER</div>
      <div style="font-size:28px;font-weight:800;color:var(--primary);" data-field="tier-1-price">$999<span style="font-size:13px;font-weight:400;color:var(--muted);">/mo</span></div>
      <div style="font-size:12px;color:var(--muted);" data-field="tier-1-desc">Up to 50 robots</div>
      <div style="border-top:1px solid var(--gray-border);margin:6px 0;"></div>
      <div style="font-size:13px;display:flex;align-items:center;gap:8px;">${CHECK_SVG} <span data-field="tier-1-f1">5 service visits/month</span></div>
      <div style="font-size:13px;display:flex;align-items:center;gap:8px;">${CHECK_SVG} <span data-field="tier-1-f2">AI-guided SOPs</span></div>
      <div style="font-size:13px;display:flex;align-items:center;gap:8px;">${CHECK_SVG} <span data-field="tier-1-f3">Email support</span></div>
      <div style="font-size:13px;display:flex;align-items:center;gap:8px;">${X_SVG} <span data-field="tier-1-f4" style="color:var(--muted);">CLI access</span></div>
      <div style="font-size:13px;display:flex;align-items:center;gap:8px;">${X_SVG} <span data-field="tier-1-f5" style="color:var(--muted);">Dedicated CSM</span></div>
    </div>
    <div style="background:var(--primary);border-radius:10px;padding:22px;display:flex;flex-direction:column;gap:8px;color:#fff;position:relative;">
      <div style="position:absolute;top:-10px;right:16px;background:var(--accent);color:var(--primary);font-size:11px;font-weight:700;padding:4px 12px;border-radius:12px;">POPULAR</div>
      <div style="font-size:13px;font-weight:600;color:var(--accent);" data-field="tier-2-name">GROWTH</div>
      <div style="font-size:28px;font-weight:800;" data-field="tier-2-price">$2,499<span style="font-size:13px;font-weight:400;opacity:0.6;">/mo</span></div>
      <div style="font-size:12px;opacity:0.6;" data-field="tier-2-desc">Up to 500 robots</div>
      <div style="border-top:1px solid rgba(255,255,255,0.2);margin:6px 0;"></div>
      <div style="font-size:13px;display:flex;align-items:center;gap:8px;">${CHECK_SVG} <span data-field="tier-2-f1">Unlimited visits</span></div>
      <div style="font-size:13px;display:flex;align-items:center;gap:8px;">${CHECK_SVG} <span data-field="tier-2-f2">AI SOPs + CLI access</span></div>
      <div style="font-size:13px;display:flex;align-items:center;gap:8px;">${CHECK_SVG} <span data-field="tier-2-f3">24/7 phone support</span></div>
      <div style="font-size:13px;display:flex;align-items:center;gap:8px;">${CHECK_SVG} <span data-field="tier-2-f4">Real-time dashboards</span></div>
      <div style="font-size:13px;display:flex;align-items:center;gap:8px;">${CHECK_SVG} <span data-field="tier-2-f5">Dedicated CSM</span></div>
    </div>
    <div style="background:var(--gray);border-radius:10px;padding:22px;display:flex;flex-direction:column;gap:8px;">
      <div style="font-size:13px;font-weight:600;color:var(--muted);" data-field="tier-3-name">ENTERPRISE</div>
      <div style="font-size:28px;font-weight:800;color:var(--primary);" data-field="tier-3-price">Custom</div>
      <div style="font-size:12px;color:var(--muted);" data-field="tier-3-desc">Unlimited robots</div>
      <div style="border-top:1px solid var(--gray-border);margin:6px 0;"></div>
      <div style="font-size:13px;display:flex;align-items:center;gap:8px;">${CHECK_SVG} <span data-field="tier-3-f1">Everything in Growth</span></div>
      <div style="font-size:13px;display:flex;align-items:center;gap:8px;">${CHECK_SVG} <span data-field="tier-3-f2">Custom SLA</span></div>
      <div style="font-size:13px;display:flex;align-items:center;gap:8px;">${CHECK_SVG} <span data-field="tier-3-f3">On-site training</span></div>
      <div style="font-size:13px;display:flex;align-items:center;gap:8px;">${CHECK_SVG} <span data-field="tier-3-f4">API integration</span></div>
      <div style="font-size:13px;display:flex;align-items:center;gap:8px;">${CHECK_SVG} <span data-field="tier-3-f5">White-label option</span></div>
    </div>
  </div>
</div>
<div class="section">
  <h2 class="stitle">What's Included in Every Plan</h2>
  <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;">
    <div style="text-align:center;padding:16px;background:var(--gray);border-radius:10px;">
      <div style="font-size:22px;font-weight:800;color:var(--accent);">20K+</div>
      <div style="font-size:11px;color:var(--muted);" data-field="inc-1">Certified technicians</div>
    </div>
    <div style="text-align:center;padding:16px;background:var(--gray);border-radius:10px;">
      <div style="font-size:22px;font-weight:800;color:var(--accent);">&lt;1hr</div>
      <div style="font-size:11px;color:var(--muted);" data-field="inc-2">Response time</div>
    </div>
    <div style="text-align:center;padding:16px;background:var(--gray);border-radius:10px;">
      <div style="font-size:22px;font-weight:800;color:var(--accent);">99.2%</div>
      <div style="font-size:11px;color:var(--muted);" data-field="inc-3">First-visit fix rate</div>
    </div>
    <div style="text-align:center;padding:16px;background:var(--gray);border-radius:10px;">
      <div style="font-size:22px;font-weight:800;color:var(--accent);">50</div>
      <div style="font-size:11px;color:var(--muted);" data-field="inc-4">States covered</div>
    </div>
  </div>
</div>
${ctaFooter()}
  `);
}

// ============== PROMPT 14: Signature Block ==============
function prompt14() {
  return wrap('Farhand — Agreement', `
${headerHtml('Field Service Agreement', ['Apex Robotics'])}
<div class="section">
  <h1 data-field="headline" style="font-size:22px;font-weight:800;margin-bottom:8px;">Pilot Service Agreement</h1>
  <p data-field="hero-text" style="font-size:13px;color:var(--muted);line-height:1.6;">This document confirms the terms of the 30-day pilot engagement between Farhand Robotics and the Client, as described below. Both parties agree to the scope, timeline, and terms outlined herein.</p>
</div>
<div class="section">
  <h2 class="stitle">Pilot Scope</h2>
  <table style="width:100%;border-collapse:collapse;font-size:13px;">
    <tr style="border-bottom:1px solid var(--gray-border);">
      <td style="padding:10px 0;font-weight:600;width:35%;">Fleet Size</td>
      <td style="padding:10px 0;" data-field="scope-fleet">Up to 50 robots</td>
    </tr>
    <tr style="border-bottom:1px solid var(--gray-border);">
      <td style="padding:10px 0;font-weight:600;">Coverage</td>
      <td style="padding:10px 0;" data-field="scope-coverage">3 sites (San Francisco, Austin, Boston)</td>
    </tr>
    <tr style="border-bottom:1px solid var(--gray-border);">
      <td style="padding:10px 0;font-weight:600;">Duration</td>
      <td style="padding:10px 0;" data-field="scope-duration">30 days from start date</td>
    </tr>
    <tr style="border-bottom:1px solid var(--gray-border);">
      <td style="padding:10px 0;font-weight:600;">SLA</td>
      <td style="padding:10px 0;" data-field="scope-sla">Tier 1 (24/7, &lt;1hr response)</td>
    </tr>
    <tr>
      <td style="padding:10px 0;font-weight:600;">Investment</td>
      <td style="padding:10px 0;" data-field="scope-cost">$0 — Free pilot, no commitment</td>
    </tr>
  </table>
</div>
<div class="section">
  <h2 class="stitle">Deliverables</h2>
  <div style="display:flex;flex-direction:column;gap:8px;">
    <div style="display:flex;align-items:center;gap:10px;font-size:13px;">${CHECK_SVG} <span data-field="del-1">AI training on your robot documentation</span></div>
    <div style="display:flex;align-items:center;gap:10px;font-size:13px;">${CHECK_SVG} <span data-field="del-2">Interactive SOP generation</span></div>
    <div style="display:flex;align-items:center;gap:10px;font-size:13px;">${CHECK_SVG} <span data-field="del-3">Up to 10 on-site service visits</span></div>
    <div style="display:flex;align-items:center;gap:10px;font-size:13px;">${CHECK_SVG} <span data-field="del-4">Weekly performance reports</span></div>
    <div style="display:flex;align-items:center;gap:10px;font-size:13px;">${CHECK_SVG} <span data-field="del-5">End-of-pilot ROI analysis</span></div>
  </div>
</div>
<div class="section" style="margin-top:auto;">
  <h2 class="stitle">Signatures</h2>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:40px;margin-top:16px;">
    <div>
      <div style="border-bottom:1.5px solid var(--primary);height:40px;margin-bottom:8px;"></div>
      <div style="font-size:13px;font-weight:700;" data-field="sig-1-name">Akshansh Chaudhary</div>
      <div style="font-size:12px;color:var(--muted);" data-field="sig-1-title">CEO, Farhand Robotics</div>
      <div style="font-size:12px;color:var(--muted);margin-top:10px;">Date: _______________</div>
    </div>
    <div>
      <div style="border-bottom:1.5px solid var(--primary);height:40px;margin-bottom:8px;"></div>
      <div style="font-size:13px;font-weight:700;" data-field="sig-2-name">_____________________</div>
      <div style="font-size:12px;color:var(--muted);" data-field="sig-2-title">Title, Client Company</div>
      <div style="font-size:12px;color:var(--muted);margin-top:10px;">Date: _______________</div>
    </div>
  </div>
</div>
  `, `
table td { vertical-align: top; }
  `);
}

// ============== PROMPT 16: Comparison Table ==============
function prompt16() {
  const rows = [
    ['Annual Cost', '$50K-80K/robot', '$185K+/engineer', '$120-200/hr'],
    ['Response Time', '<1 hour', '24-48 hours', '2-5 days'],
    ['Consistency', 'AI-standardized', 'Varies by person', 'Highly variable'],
    ['Scalability', '10 to 10,000+', 'Linear hiring', 'Limited'],
    ['Liability', '$5M covered', 'Your liability', 'Unclear'],
    ['AI Support', 'Full platform', 'None', 'None'],
    ['24/7 Coverage', true, false, false],
    ['Auto Reports', true, false, false],
  ];

  const rowsHtml = rows.map((r, i) => {
    const cells = r.slice(1).map((v, ci) => {
      if (v === true) return `<td style="padding:10px 14px;text-align:center;">${CHECK_SVG}</td>`;
      if (v === false) return `<td style="padding:10px 14px;text-align:center;">${X_SVG}</td>`;
      const fieldName = `comp-${i}-${ci}`;
      const style = ci === 0 ? 'font-weight:600;color:var(--accent);' : '';
      return `<td style="padding:10px 14px;font-size:13px;${style}" data-field="${fieldName}">${v}</td>`;
    }).join('');
    return `<tr style="border-bottom:1px solid var(--gray-border);">
      <td style="padding:10px 14px;font-size:13px;font-weight:600;" data-field="comp-${i}-label">${r[0]}</td>${cells}
    </tr>`;
  }).join('\n');

  return wrap('Farhand — Comparison', `
${headerHtml('Why Farhand?', ['Decision Makers'])}
<div class="section">
  <h1 data-field="headline" style="font-size:22px;font-weight:800;margin-bottom:8px;">Farhand vs The Alternatives</h1>
  <p data-field="hero-text" style="font-size:13px;color:var(--muted);line-height:1.5;">See how Farhand compares to building an in-house field service team or relying on freelance contractors.</p>
</div>
<div class="section">
  <table style="width:100%;border-collapse:collapse;border-radius:10px;overflow:hidden;">
    <thead>
      <tr style="background:var(--primary);color:#fff;">
        <th style="padding:12px 14px;text-align:left;font-size:13px;font-weight:600;"></th>
        <th style="padding:12px 14px;text-align:left;font-size:13px;font-weight:600;color:var(--accent);">Farhand</th>
        <th style="padding:12px 14px;text-align:left;font-size:13px;font-weight:600;">In-House Team</th>
        <th style="padding:12px 14px;text-align:left;font-size:13px;font-weight:600;">Freelancers</th>
      </tr>
    </thead>
    <tbody style="background:var(--bg);">
      ${rowsHtml}
    </tbody>
  </table>
</div>
${ctaFooter()}
  `);
}

// ============== PROMPT 17: Different Company (Yondu, purple) ==============
function prompt17() {
  return wrap('Yondu Robotics — Warehouse Automation', `
<div class="header">
  <div>
    <div style="font-size:24px;font-weight:800;color:#7C3AED;">Yondu<span style="font-weight:400;color:var(--muted);font-size:14px;margin-left:6px;">Robotics</span></div>
    <p class="sub" data-field="subtitle">Warehouse Automation Solutions</p>
  </div>
  <div style="text-align:right;">
    <p style="font-size:11px;font-weight:500;color:#999;text-transform:uppercase;margin-bottom:8px;">Solution made for:</p>
    <div style="display:flex;flex-direction:column;gap:6px;align-items:flex-end;">
      <span style="display:inline-block;padding:6px 16px;border:1.5px solid #7C3AED;border-radius:20px;font-size:12px;font-weight:600;" data-field="segment-1">3PL Warehouses</span>
      <span style="display:inline-block;padding:6px 16px;border:1.5px solid #7C3AED;border-radius:20px;font-size:12px;font-weight:600;" data-field="segment-2">E-Commerce Fulfillment</span>
    </div>
  </div>
</div>
<div class="section">
  <h1 data-field="headline" style="font-size:22px;font-weight:800;">Automate Your Warehouse. <span style="color:#7C3AED;">Ship Faster.</span></h1>
  <p data-field="hero-text" style="font-size:13px;color:var(--muted);line-height:1.6;margin-top:8px;">Yondu deploys autonomous mobile robots that pick, pack, and sort 3x faster than manual processes. Our AI orchestration layer optimizes routes in real-time, adapts to inventory changes, and integrates with your existing WMS.</p>
</div>
<div class="section">
  <h2 style="font-size:20px;font-weight:700;padding-left:12px;border-left:3px solid #7C3AED;margin-bottom:14px;">Key Metrics</h2>
  <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;">
    <div style="text-align:center;padding:16px;background:#f5f3ff;border-radius:10px;">
      <div style="font-size:24px;font-weight:800;color:#7C3AED;" data-field="stat-1">3x</div>
      <div style="font-size:11px;color:var(--muted);">Faster picking</div>
    </div>
    <div style="text-align:center;padding:16px;background:#f5f3ff;border-radius:10px;">
      <div style="font-size:24px;font-weight:800;color:#7C3AED;" data-field="stat-2">99.7%</div>
      <div style="font-size:11px;color:var(--muted);">Accuracy rate</div>
    </div>
    <div style="text-align:center;padding:16px;background:#f5f3ff;border-radius:10px;">
      <div style="font-size:24px;font-weight:800;color:#7C3AED;" data-field="stat-3">60%</div>
      <div style="font-size:11px;color:var(--muted);">Labor cost reduction</div>
    </div>
    <div style="text-align:center;padding:16px;background:#f5f3ff;border-radius:10px;">
      <div style="font-size:24px;font-weight:800;color:#7C3AED;" data-field="stat-4">2 wks</div>
      <div style="font-size:11px;color:var(--muted);">Deployment time</div>
    </div>
  </div>
</div>
<div class="section">
  <h2 style="font-size:20px;font-weight:700;padding-left:12px;border-left:3px solid #7C3AED;margin-bottom:14px;">How It Works</h2>
  <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px;">
    <div style="background:#f5f3ff;border-radius:10px;padding:20px;">
      <div style="font-size:14px;font-weight:700;margin-bottom:6px;" data-field="hw-1-title">Map Your Warehouse</div>
      <div style="font-size:13px;color:var(--muted);line-height:1.5;" data-field="hw-1-desc">LiDAR scanning creates a digital twin in 24 hours. No infrastructure changes needed.</div>
    </div>
    <div style="background:#f5f3ff;border-radius:10px;padding:20px;">
      <div style="font-size:14px;font-weight:700;margin-bottom:6px;" data-field="hw-2-title">Deploy Robots</div>
      <div style="font-size:13px;color:var(--muted);line-height:1.5;" data-field="hw-2-desc">Yondu bots integrate with your WMS and start picking on day one of deployment.</div>
    </div>
    <div style="background:#f5f3ff;border-radius:10px;padding:20px;">
      <div style="font-size:14px;font-weight:700;margin-bottom:6px;" data-field="hw-3-title">Scale On Demand</div>
      <div style="font-size:13px;color:var(--muted);line-height:1.5;" data-field="hw-3-desc">Add or remove bots seasonally. Pay per robot per month, no long-term contracts.</div>
    </div>
  </div>
</div>
<div style="margin-top:auto;padding:20px 40px;background:#f5f3ff;">
  <h2 data-field="cta-text" style="font-size:20px;font-weight:700;font-style:italic;margin-bottom:12px;color:#7C3AED;">Book a Warehouse Assessment</h2>
  <div style="display:flex;gap:12px;">
    <span style="display:inline-flex;align-items:center;gap:8px;padding:8px 20px;border:1.5px solid #7C3AED;border-radius:24px;font-size:13px;font-weight:500;">${PHONE_SVG.replace('#33ee69','#7C3AED')} <span data-field="phone">415-555-0199</span></span>
    <span style="display:inline-flex;align-items:center;gap:8px;padding:8px 20px;border:1.5px solid #7C3AED;border-radius:24px;font-size:13px;font-weight:500;">${MAIL_SVG.replace('#33ee69','#7C3AED')} <span data-field="email">sales@yondu.ai</span></span>
    <span style="display:inline-flex;align-items:center;gap:8px;padding:8px 20px;border:1.5px solid #7C3AED;border-radius:24px;font-size:13px;font-weight:500;">${GLOBE_SVG.replace('#33ee69','#7C3AED')} <span data-field="website">www.yondu.ai</span></span>
  </div>
</div>
  `, `
:root { --accent: #7C3AED; }
.bar { background: #7C3AED; }
  `);
}

// ============== PROMPT 19: Minimal One-Pager ==============
function prompt19() {
  return wrap('Farhand — Minimal', `
${headerHtml('Your field support partner', [])}
<div style="flex:1;display:flex;align-items:center;justify-content:center;padding:0 80px;">
  <div style="text-align:center;">
    <h1 data-field="headline" style="font-size:32px;font-weight:800;line-height:1.2;margin-bottom:16px;">AI-Powered Field Service<br>for Robotics Companies</h1>
    <p data-field="hero-text" style="font-size:14px;color:var(--muted);line-height:1.6;max-width:500px;margin:0 auto;">We deploy AI-guided technicians to install, diagnose, and repair your robots anywhere in the country. 20,000+ techs. 50 states. Under 1 hour response.</p>
  </div>
</div>
${ctaFooter()}
  `);
}

// ============== PROMPT 21: Process Flow ==============
function prompt21() {
  const ARROW_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="var(--muted)" viewBox="0 0 256 256"><path d="M221.66,133.66l-72,72a8,8,0,0,1-11.32-11.32L196.69,136H40a8,8,0,0,1,0-16H196.69l-58.35-58.34a8,8,0,0,1,11.32-11.32l72,72A8,8,0,0,1,221.66,133.66Z"/></svg>`;
  const steps = [
    { num: '1', title: 'Onboard', desc: 'Sign up and share your robot fleet documentation with our team.' },
    { num: '2', title: 'Train AI', desc: 'We build custom SOPs and train our AI on your specific robots.' },
    { num: '3', title: 'Deploy', desc: 'Certified techs arrive on-site within 1 hour of dispatch.' },
    { num: '4', title: 'Monitor', desc: 'Real-time dashboards track every service visit and outcome.' },
    { num: '5', title: 'Optimize', desc: 'AI learns from every job to improve speed and accuracy.' },
  ];
  const stepsHtml = steps.map((s, i) => {
    const arrow = i < steps.length - 1 ? `<div style="display:flex;align-items:center;flex-shrink:0;">${ARROW_SVG}</div>` : '';
    return `<div style="display:flex;align-items:center;gap:10px;flex:1;">
      <div style="text-align:center;flex:1;">
        <div style="width:40px;height:40px;border-radius:50%;background:var(--accent);color:var(--primary);font-size:16px;font-weight:700;display:flex;align-items:center;justify-content:center;margin:0 auto 8px;">${s.num}</div>
        <div style="font-size:14px;font-weight:700;margin-bottom:4px;" data-field="step-${s.num}-title">${s.title}</div>
        <div style="font-size:12px;color:var(--muted);line-height:1.4;" data-field="step-${s.num}-desc">${s.desc}</div>
      </div>
      ${arrow}
    </div>`;
  }).join('');

  return wrap('Farhand — Process Flow', `
${headerHtml('Your field support partner', ['Robotics Companies', 'Fleet Operators'])}
<div class="section">
  <p data-field="hero-text" style="font-size:13px;color:var(--muted);line-height:1.5;margin-bottom:20px;">Farhand install and services robots for growing robotics companies. Our technicians are guided by AI trained on your robot — so any tech can install, diagnose, and repair like your best field engineer, anywhere in the country.</p>
</div>
<div class="section">
  <h2 class="stitle">How It Works</h2>
  <div style="display:flex;align-items:flex-start;gap:8px;padding:20px;background:var(--gray);border-radius:10px;">
    ${stepsHtml}
  </div>
</div>
<div class="section">
  <h2 class="stitle">Our Value</h2>
  <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px;">
    <div style="background:var(--gray);border-radius:10px;padding:20px;display:flex;flex-direction:column;gap:10px;">
      <h3 data-field="vp1-title" style="font-size:15px;font-weight:700;margin:0;">Lower support overhead</h3>
      <p data-field="vp1-desc" style="font-size:13px;color:var(--muted);margin:0;line-height:1.5;">Replace W-2 field engineers + travel + hotel costs with our on-demand solution.</p>
      <span style="display:inline-block;padding:6px 16px;border:1.5px solid var(--accent);border-radius:20px;font-size:12px;font-weight:600;align-self:flex-start;" data-field="vp1-badge">Reduces field service cost by 30%</span>
    </div>
    <div style="background:var(--gray);border-radius:10px;padding:20px;display:flex;flex-direction:column;gap:10px;">
      <h3 data-field="vp2-title" style="font-size:15px;font-weight:700;margin:0;">Consistent service quality</h3>
      <p data-field="vp2-desc" style="font-size:13px;color:var(--muted);margin:0;line-height:1.5;">Our AI guides tech through repairs, answers questions, and documents all actions.</p>
      <span style="display:inline-block;padding:6px 16px;border:1.5px solid var(--accent);border-radius:20px;font-size:12px;font-weight:600;align-self:flex-start;" data-field="vp2-badge">Fewer errors. Happier customers.</span>
    </div>
    <div style="background:var(--gray);border-radius:10px;padding:20px;display:flex;flex-direction:column;gap:10px;">
      <h3 data-field="vp3-title" style="font-size:15px;font-weight:700;margin:0;">Scales with your fleet</h3>
      <p data-field="vp3-desc" style="font-size:13px;color:var(--muted);margin:0;line-height:1.5;">Deploy without hiring regionally. All techs are screened and work under our liability coverage.</p>
      <span style="display:inline-block;padding:6px 16px;border:1.5px solid var(--accent);border-radius:20px;font-size:12px;font-weight:600;align-self:flex-start;" data-field="vp3-badge">Built to support 10 — 10,000 bots</span>
    </div>
  </div>
</div>
${ctaFooter()}
  `);
}

// ============== PROMPT 23: CSS Bar Chart ==============
function prompt23() {
  const data = [
    { year: 'Year 1', val: 50, pct: 5 },
    { year: 'Year 2', val: 200, pct: 20 },
    { year: 'Year 3', val: 800, pct: 40 },
    { year: 'Year 4', val: '2,500', pct: 70 },
    { year: 'Year 5', val: '10,000', pct: 100 },
  ];
  const barsHtml = data.map((d, i) => `
    <div style="display:flex;align-items:center;gap:14px;margin-bottom:12px;">
      <div style="width:60px;font-size:13px;font-weight:600;flex-shrink:0;" data-field="bar-${i+1}-label">${d.year}</div>
      <div style="flex:1;height:32px;background:#f0f0f0;border-radius:6px;overflow:hidden;position:relative;">
        <div style="width:${d.pct}%;height:100%;background:linear-gradient(90deg, var(--accent), #2bc857);border-radius:6px;display:flex;align-items:center;justify-content:flex-end;padding-right:10px;min-width:50px;">
          <span style="font-size:13px;font-weight:700;color:var(--primary);" data-field="bar-${i+1}-val">${typeof d.val === 'number' ? d.val : d.val}</span>
        </div>
      </div>
      <div style="width:80px;font-size:12px;color:var(--muted);text-align:right;">robots</div>
    </div>
  `).join('');

  return wrap('Farhand — Growth Chart', `
${headerHtml('Your field support partner', ['Investors', 'Partners'])}
<div class="section">
  <h1 data-field="headline" style="font-size:22px;font-weight:800;margin-bottom:8px;">Scaling to 10,000 Robots</h1>
  <p data-field="hero-text" style="font-size:13px;color:var(--muted);line-height:1.5;">Our growth trajectory shows how Farhand's AI-powered field service platform scales from pilot to full national coverage in 5 years.</p>
</div>
<div class="section">
  <h2 class="stitle">Robots Serviced Per Year</h2>
  <div style="padding:24px;background:var(--gray);border-radius:10px;">
    ${barsHtml}
  </div>
</div>
<div class="section">
  <h2 class="stitle">What Powers This Growth</h2>
  <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px;">
    <div style="background:var(--gray);border-radius:10px;padding:20px;">
      <div style="font-size:22px;font-weight:800;color:var(--accent);margin-bottom:6px;">20K+</div>
      <div style="font-size:14px;font-weight:700;margin-bottom:4px;" data-field="growth-1-title">Certified Technicians</div>
      <div style="font-size:13px;color:var(--muted);line-height:1.5;" data-field="growth-1-desc">Pre-screened, background-checked, and trained on your specific robots via AI-generated SOPs.</div>
    </div>
    <div style="background:var(--gray);border-radius:10px;padding:20px;">
      <div style="font-size:22px;font-weight:800;color:var(--accent);margin-bottom:6px;">50</div>
      <div style="font-size:14px;font-weight:700;margin-bottom:4px;" data-field="growth-2-title">States Covered</div>
      <div style="font-size:13px;color:var(--muted);line-height:1.5;" data-field="growth-2-desc">National coverage from day one. Urban and rural locations. Under 1-hour dispatch.</div>
    </div>
    <div style="background:var(--gray);border-radius:10px;padding:20px;">
      <div style="font-size:22px;font-weight:800;color:var(--accent);margin-bottom:6px;">99.2%</div>
      <div style="font-size:14px;font-weight:700;margin-bottom:4px;" data-field="growth-3-title">First-Visit Fix Rate</div>
      <div style="font-size:13px;color:var(--muted);line-height:1.5;" data-field="growth-3-desc">AI pre-diagnoses issues and equips techs with the right tools and parts before arrival.</div>
    </div>
  </div>
</div>
${ctaFooter()}
  `);
}

// ============== PROMPT 24: Timeline / Roadmap ==============
function prompt24() {
  const milestones = [
    { label: 'Q1 2025', title: 'Pilot Launch', desc: 'Free 30-day pilot with up to 50 robots across 3 sites. AI training on your documentation.' },
    { label: 'Q2 2025', title: 'Scale to 100', desc: 'Expand to 100 robots. Dedicated CSM assigned. Full CLI and dashboard access.' },
    { label: 'Q3 2025', title: 'Full Coverage', desc: 'National rollout across all sites. 24/7 remote support tier activated.' },
    { label: 'Q4 2025', title: 'AI v2 Launch', desc: 'Next-gen AI model trained on your fleet data. Predictive maintenance alerts.' },
    { label: '2026', title: 'International', desc: 'Expansion to Canada, Mexico, and EU markets with localized tech networks.' },
  ];
  const timelineHtml = milestones.map((m, i) => `
    <div style="display:flex;gap:16px;align-items:flex-start;">
      <div style="display:flex;flex-direction:column;align-items:center;flex-shrink:0;width:20px;">
        <div style="width:16px;height:16px;border-radius:50%;background:var(--accent);flex-shrink:0;"></div>
        ${i < milestones.length - 1 ? '<div style="width:2px;flex:1;background:var(--accent);opacity:0.3;min-height:40px;"></div>' : ''}
      </div>
      <div style="padding-bottom:${i < milestones.length - 1 ? '16' : '0'}px;flex:1;">
        <div style="font-size:11px;font-weight:600;color:var(--accent);text-transform:uppercase;margin-bottom:2px;" data-field="ms-${i+1}-label">${m.label}</div>
        <div style="font-size:15px;font-weight:700;margin-bottom:4px;" data-field="ms-${i+1}-title">${m.title}</div>
        <div style="font-size:13px;color:var(--muted);line-height:1.5;" data-field="ms-${i+1}-desc">${m.desc}</div>
      </div>
    </div>
  `).join('');

  return wrap('Farhand — Roadmap', `
${headerHtml('Your field support partner', ['Growth Partners', 'Enterprise Clients'])}
<div class="section">
  <h1 data-field="headline" style="font-size:22px;font-weight:800;margin-bottom:8px;">Implementation Roadmap</h1>
  <p data-field="hero-text" style="font-size:13px;color:var(--muted);line-height:1.5;">From pilot to full international coverage — here's how we scale together over the next 18 months.</p>
</div>
<div class="section">
  <h2 class="stitle">Milestones</h2>
  <div style="padding:20px 24px;background:var(--gray);border-radius:10px;">
    ${timelineHtml}
  </div>
</div>
<div class="section">
  <h2 class="stitle">Why Farhand</h2>
  <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;">
    <div style="text-align:center;padding:16px;background:var(--gray);border-radius:10px;">
      <div style="font-size:22px;font-weight:800;color:var(--accent);">20K+</div>
      <div style="font-size:11px;color:var(--muted);" data-field="stat-1">Certified techs</div>
    </div>
    <div style="text-align:center;padding:16px;background:var(--gray);border-radius:10px;">
      <div style="font-size:22px;font-weight:800;color:var(--accent);">&lt;1hr</div>
      <div style="font-size:11px;color:var(--muted);" data-field="stat-2">Response time</div>
    </div>
    <div style="text-align:center;padding:16px;background:var(--gray);border-radius:10px;">
      <div style="font-size:22px;font-weight:800;color:var(--accent);">99.2%</div>
      <div style="font-size:11px;color:var(--muted);" data-field="stat-3">Fix rate</div>
    </div>
    <div style="text-align:center;padding:16px;background:var(--gray);border-radius:10px;">
      <div style="font-size:22px;font-weight:800;color:var(--accent);">50</div>
      <div style="font-size:11px;color:var(--muted);" data-field="stat-4">States covered</div>
    </div>
  </div>
</div>
${ctaFooter()}
  `);
}

// ============== PROMPT 27: Dual Scorecards ==============
function prompt27() {
  const metrics = [
    ['First-Visit Fix Rate', '62%', '99.2%'],
    ['Avg Response Time', '24-48 hrs', '<1 hour'],
    ['Cost Per Service Visit', '$2,400', '$850'],
    ['Tech Consistency', 'Variable', 'AI-standardized'],
    ['Documentation Quality', 'Inconsistent', 'Auto-generated'],
    ['Coverage Area', '3 states', '50 states'],
    ['Reporting', 'Manual', 'Automated'],
  ];
  function scorecard(title, colIndex, isGood) {
    const color = isGood ? '#33ee69' : '#ef4444';
    const bg = isGood ? '#f0fdf4' : '#fef2f2';
    const rows = metrics.map((m, i) => `
      <div style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;${i < metrics.length - 1 ? 'border-bottom:1px solid var(--gray-border);' : ''}">
        <span style="font-size:13px;font-weight:500;" data-field="sc-${colIndex}-${i}-label">${m[0]}</span>
        <span style="font-size:13px;font-weight:700;color:${color};" data-field="sc-${colIndex}-${i}-val">${m[colIndex]}</span>
      </div>
    `).join('');
    return `<div style="flex:1;background:${bg};border-radius:10px;padding:20px;border:1.5px solid ${color}20;">
      <h3 style="font-size:16px;font-weight:700;margin-bottom:8px;color:${isGood ? 'var(--primary)' : '#991b1b'};">${title}</h3>
      ${rows}
    </div>`;
  }

  return wrap('Farhand — Scorecard Comparison', `
${headerHtml('Before & After Farhand', ['Decision Makers', 'Operations Leaders'])}
<div class="section">
  <h1 data-field="headline" style="font-size:22px;font-weight:800;margin-bottom:8px;">Your Field Service: Before & After</h1>
  <p data-field="hero-text" style="font-size:13px;color:var(--muted);line-height:1.5;">See exactly how Farhand transforms your robot maintenance operations across 7 critical metrics.</p>
</div>
<div class="section">
  <h2 class="stitle">Performance Comparison</h2>
  <div style="display:flex;gap:20px;">
    ${scorecard('Your Current State', 1, false)}
    ${scorecard('With Farhand', 2, true)}
  </div>
</div>
<div class="section">
  <h2 class="stitle">Bottom Line Impact</h2>
  <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px;">
    <div style="text-align:center;padding:20px;background:var(--gray);border-radius:10px;">
      <div style="font-size:24px;font-weight:800;color:var(--accent);" data-field="impact-1-num">73%</div>
      <div style="font-size:13px;color:var(--muted);" data-field="impact-1-label">Cost reduction in Year 1</div>
    </div>
    <div style="text-align:center;padding:20px;background:var(--gray);border-radius:10px;">
      <div style="font-size:24px;font-weight:800;color:var(--accent);" data-field="impact-2-num">4.2x</div>
      <div style="font-size:13px;color:var(--muted);" data-field="impact-2-label">ROI within 6 months</div>
    </div>
    <div style="text-align:center;padding:20px;background:var(--gray);border-radius:10px;">
      <div style="font-size:24px;font-weight:800;color:var(--accent);" data-field="impact-3-num">96%</div>
      <div style="font-size:13px;color:var(--muted);" data-field="impact-3-label">Client retention rate</div>
    </div>
  </div>
</div>
${ctaFooter()}
  `);
}

// ============== PROMPT 30: Maximum Density Stress Test ==============
function prompt30() {
  return wrap('Farhand — Full Page', `
${headerHtml('Your field support partner', ['Robotics Companies', 'Research Labs', 'Integrators'])}
<div class="section" style="padding-bottom:12px;">
  <p data-field="hero-text" style="font-size:13px;color:var(--muted);line-height:1.5;">Farhand deploys AI-guided technicians to install, diagnose, and repair your robots anywhere in the US. 20,000+ techs, 50 states, under 1 hour response time.</p>
</div>
<div class="section" style="padding-bottom:12px;">
  <h2 class="stitle" style="margin-bottom:10px;">Before & After Farhand</h2>
  <div style="display:grid;grid-template-columns:1fr auto 1fr;gap:10px;align-items:center;">
    <div style="background:#fef2f2;border-radius:10px;padding:14px;">
      <div style="font-size:14px;font-weight:700;color:#991b1b;margin-bottom:6px;">Before</div>
      <div style="font-size:12px;color:#666;line-height:1.5;" data-field="before-items">${X_SVG} 24-48hr response<br>${X_SVG} Inconsistent quality<br>${X_SVG} $2,400/visit avg</div>
    </div>
    <div style="font-size:20px;color:var(--accent);">&#10132;</div>
    <div style="background:#f0fdf4;border-radius:10px;padding:14px;">
      <div style="font-size:14px;font-weight:700;color:#166534;margin-bottom:6px;">After</div>
      <div style="font-size:12px;color:#666;line-height:1.5;" data-field="after-items">${CHECK_SVG} <1hr response<br>${CHECK_SVG} AI-standardized<br>${CHECK_SVG} $850/visit avg</div>
    </div>
  </div>
</div>
<div class="section" style="padding-bottom:12px;">
  <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px;">
    <div style="text-align:center;padding:12px;background:var(--gray);border-radius:8px;">
      <div style="font-size:20px;font-weight:800;color:var(--accent);">87%</div>
      <div style="font-size:11px;color:var(--muted);">Cost savings</div>
    </div>
    <div style="text-align:center;padding:12px;background:var(--gray);border-radius:8px;">
      <div style="font-size:20px;font-weight:800;color:var(--accent);">&lt;45m</div>
      <div style="font-size:11px;color:var(--muted);">Avg dispatch</div>
    </div>
    <div style="text-align:center;padding:12px;background:var(--gray);border-radius:8px;">
      <div style="font-size:20px;font-weight:800;color:var(--accent);">99.2%</div>
      <div style="font-size:11px;color:var(--muted);">Fix rate</div>
    </div>
    <div style="text-align:center;padding:12px;background:var(--gray);border-radius:8px;">
      <div style="font-size:20px;font-weight:800;color:var(--accent);">20K+</div>
      <div style="font-size:11px;color:var(--muted);">Technicians</div>
    </div>
  </div>
</div>
<div class="section" style="padding-bottom:12px;">
  <h2 class="stitle" style="margin-bottom:10px;">Our Value</h2>
  <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;">
    <div style="background:var(--gray);border-radius:10px;padding:14px;display:flex;flex-direction:column;gap:6px;">
      <h3 data-field="vp1-title" style="font-size:14px;font-weight:700;margin:0;">Lower overhead</h3>
      <p data-field="vp1-desc" style="font-size:12px;color:var(--muted);margin:0;line-height:1.4;">Replace W-2 engineers + travel costs with on-demand service.</p>
      <span style="display:inline-block;padding:4px 12px;border:1.5px solid var(--accent);border-radius:20px;font-size:11px;font-weight:600;align-self:flex-start;" data-field="vp1-badge">Saves 30%</span>
    </div>
    <div style="background:var(--gray);border-radius:10px;padding:14px;display:flex;flex-direction:column;gap:6px;">
      <h3 data-field="vp2-title" style="font-size:14px;font-weight:700;margin:0;">Consistent quality</h3>
      <p data-field="vp2-desc" style="font-size:12px;color:var(--muted);margin:0;line-height:1.4;">AI guides every repair, documents every action.</p>
      <span style="display:inline-block;padding:4px 12px;border:1.5px solid var(--accent);border-radius:20px;font-size:11px;font-weight:600;align-self:flex-start;" data-field="vp2-badge">Fewer errors</span>
    </div>
    <div style="background:var(--gray);border-radius:10px;padding:14px;display:flex;flex-direction:column;gap:6px;">
      <h3 data-field="vp3-title" style="font-size:14px;font-weight:700;margin:0;">Scales instantly</h3>
      <p data-field="vp3-desc" style="font-size:12px;color:var(--muted);margin:0;line-height:1.4;">10 to 10,000 bots. No hiring needed.</p>
      <span style="display:inline-block;padding:4px 12px;border:1.5px solid var(--accent);border-radius:20px;font-size:11px;font-weight:600;align-self:flex-start;" data-field="vp3-badge">National coverage</span>
    </div>
  </div>
</div>
<div class="section" style="padding-bottom:12px;">
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;">
    <div>
      <h3 style="font-size:15px;font-weight:700;margin-bottom:8px;">Workforce</h3>
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:6px;"><span style="width:22px;height:22px;border-radius:50%;background:var(--accent);color:var(--primary);font-size:11px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0;">1</span><span style="font-size:13px;" data-field="workforce-1">20K+ trained field techs</span></div>
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:6px;"><span style="width:22px;height:22px;border-radius:50%;background:var(--accent);color:var(--primary);font-size:11px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0;">2</span><span style="font-size:13px;" data-field="workforce-2">1K+ 24/7 remote support</span></div>
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:6px;"><span style="width:22px;height:22px;border-radius:50%;background:var(--accent);color:var(--primary);font-size:11px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0;">3</span><span style="font-size:13px;" data-field="workforce-3">Every zip code across US</span></div>
    </div>
    <div>
      <h3 style="font-size:15px;font-weight:700;margin-bottom:8px;">AI Platform</h3>
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:6px;">${CHECK_SVG}<span style="font-size:13px;" data-field="platform-1">Interactive SOPs from docs</span></div>
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:6px;">${CHECK_SVG}<span style="font-size:13px;" data-field="platform-2">CLI troubleshooting</span></div>
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:6px;">${CHECK_SVG}<span style="font-size:13px;" data-field="platform-3">Auto service reports</span></div>
    </div>
  </div>
</div>
${ctaFooter()}
  `);
}

// Route
const generators = { 11: prompt11, 14: prompt14, 16: prompt16, 17: prompt17, 19: prompt19, 21: prompt21, 23: prompt23, 24: prompt24, 27: prompt27, 30: prompt30 };

if (!generators[num]) {
  console.log('Available prompts: ' + Object.keys(generators).join(', '));
  process.exit(1);
}

const html = generators[num]();
fs.writeFileSync(outPath, html, 'utf8');
console.log(`Prompt ${num}: Wrote ${outPath} (${(html.length / 1024).toFixed(1)} KB)`);
