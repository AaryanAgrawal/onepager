// Generate app/current.html with embedded base64 logo
// Run: node _gen-starter.js

const fs = require('fs');
const path = require('path');

const logoBase64 = fs.readFileSync(
  path.join(__dirname, 'brand', 'logo-w-type-light-base64.txt'),
  'utf8'
).trim();

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Farhand Robotics — One Pager</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    :root {
      --accent: #33ee69;
      --accent-light: #33ee6920;
      --primary: #10100d;
      --bg: #ffffff;
      --gray-light: #f5f5f5;
      --gray-border: #e0e0e0;
      --text-secondary: #666666;
    }
    @page { size: 8.5in 11in; margin: 0; }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      width: 8.5in;
      height: 11in;
      overflow: hidden;
      font-family: 'Inter', sans-serif;
      color: var(--primary);
      background: var(--bg);
      display: flex;
      flex-direction: column;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    .accent-bar { width: 100%; height: 5px; background: var(--accent); }
    .header { display: flex; justify-content: space-between; align-items: flex-start; padding: 24px 40px 16px; }
    .header-logo img { height: 40px; }
    .header-subtitle { font-size: 13px; color: var(--text-secondary); margin-top: 4px; }
    .header-right { text-align: right; }
    .header-label { font-size: 11px; font-weight: 500; color: #999; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px; }
    .pills { display: flex; flex-direction: column; gap: 6px; align-items: flex-end; }
    .pill { display: inline-block; padding: 6px 16px; border: 1.5px solid var(--accent); border-radius: 20px; font-size: 12px; font-weight: 600; color: var(--primary); }
    .hero { padding: 0 40px 16px; }
    .hero p { font-size: 13px; line-height: 1.6; color: var(--text-secondary); }
    .section-title { font-size: 20px; font-weight: 700; color: var(--primary); padding-left: 12px; border-left: 3px solid var(--accent); margin-bottom: 16px; }
    .value-section { padding: 0 40px 20px; }
    .card-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
    .card { background: var(--gray-light); border-radius: 10px; padding: 20px; display: flex; flex-direction: column; gap: 10px; }
    .card h3 { font-size: 15px; font-weight: 700; }
    .card p { font-size: 13px; color: var(--text-secondary); line-height: 1.5; }
    .card .pill { align-self: flex-start; font-size: 12px; padding: 6px 16px; }
    .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; padding: 0 40px 20px; }
    .col-header { display: flex; align-items: center; gap: 10px; margin-bottom: 14px; }
    .col-title { font-size: 16px; font-weight: 700; }
    .numbered-item { display: flex; align-items: flex-start; gap: 12px; margin-bottom: 10px; }
    .num-circle { display: flex; align-items: center; justify-content: center; width: 24px; height: 24px; border-radius: 50%; background: var(--accent); color: var(--primary); font-size: 12px; font-weight: 700; flex-shrink: 0; }
    .numbered-item span:last-child { font-size: 13px; line-height: 1.5; }
    .check-item { display: flex; align-items: flex-start; gap: 10px; margin-bottom: 8px; }
    .check-item svg { flex-shrink: 0; margin-top: 2px; }
    .check-item span { font-size: 13px; line-height: 1.5; }
    .cta { margin-top: auto; padding: 20px 40px 24px; }
    .cta h2 { font-size: 20px; font-weight: 700; font-style: italic; margin-bottom: 14px; }
    .contact-pills { display: flex; gap: 12px; flex-wrap: wrap; }
    .contact-pill { display: inline-flex; align-items: center; gap: 8px; padding: 8px 20px; border: 1.5px solid var(--accent); border-radius: 24px; font-size: 13px; font-weight: 500; color: var(--primary); }
    .contact-pill svg { flex-shrink: 0; }
  </style>
</head>
<body>

  <!-- Green accent bar -->
  <div class="accent-bar"></div>

  <!-- Header -->
  <div class="header">
    <div class="header-logo">
      <img src="data:image/png;base64,${logoBase64}" alt="Farhand" style="height:40px;">
      <p class="header-subtitle" data-field="subtitle">Your field support partner</p>
    </div>
    <div class="header-right">
      <p class="header-label">Solution made for:</p>
      <div class="pills">
        <span class="pill" data-field="segment-1">Robotics Companies (RaaS)</span>
        <span class="pill" data-field="segment-2">Companies from your Labs</span>
        <span class="pill" data-field="segment-3">Startups in your Network</span>
      </div>
    </div>
  </div>

  <!-- Hero / Intro -->
  <div class="hero">
    <p data-field="hero-text">Farhand install and services robots for growing robotics companies. Our technicians are guided by AI trained on your robot — so any tech can install, diagnose, and repair like your best field engineer, anywhere in the country.</p>
  </div>

  <!-- Our Value -->
  <div class="value-section">
    <h2 class="section-title">Our Value</h2>
    <div class="card-grid">
      <div class="card">
        <h3 data-field="vp1-title">Lower support overhead</h3>
        <p data-field="vp1-desc">Replace W-2 field engineers + travel + hotel costs with our on-demand solution.</p>
        <span class="pill" data-field="vp1-badge">Reduces field service cost by 30%</span>
      </div>
      <div class="card">
        <h3 data-field="vp2-title">Consistent service quality</h3>
        <p data-field="vp2-desc">Our AI guides tech through repairs, answers questions, and documents all actions.</p>
        <span class="pill" data-field="vp2-badge">Fewer errors. Happier customers.</span>
      </div>
      <div class="card">
        <h3 data-field="vp3-title">Scales with your fleet</h3>
        <p data-field="vp3-desc">Deploy without hiring regionally. All techs are screened and work under our liability coverage.</p>
        <span class="pill" data-field="vp3-badge">Built to support 10 — 10,000 bots</span>
      </div>
    </div>
  </div>

  <!-- Workforce + AI Platform -->
  <div class="two-col">
    <div>
      <div class="col-header">
        <span style="font-size:20px; font-weight:700;">Workforce</span>
        <!-- Wrench icon -->
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="#33ee69" viewBox="0 0 256 256"><path d="M226.76,69a8,8,0,0,0-12.84-2.88l-40.3,37.19-17.23-3.7-3.7-17.23,37.19-40.3A8,8,0,0,0,187,29.24,72,72,0,0,0,88,96a72.34,72.34,0,0,0,3.2,21.09L36.69,160.6a24,24,0,0,0,33.94,33.94l43.51-54.51A72.08,72.08,0,0,0,226.76,69ZM160,152a56.14,56.14,0,0,1-27.07-7,8,8,0,0,0-9.92,1.77L75.43,205.75a8,8,0,0,1-11.32-11.32l58.95-47.58a8,8,0,0,0,1.77-9.92,56,56,0,0,1,58.94-79.53l-30.64,33.2a8,8,0,0,0-1.94,6.57l5.21,24.23a8,8,0,0,0,6.12,6.12l24.23,5.21a8,8,0,0,0,6.57-1.94l33.2-30.64A56.07,56.07,0,0,1,160,152Z"/></svg>
        <!-- Users icon -->
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="#33ee69" viewBox="0 0 256 256"><path d="M117.25,157.92a60,60,0,1,0-66.5,0A95.83,95.83,0,0,0,3.53,195.63a8,8,0,1,0,13.4,8.74,80,80,0,0,1,134.14,0,8,8,0,0,0,13.4-8.74A95.83,95.83,0,0,0,117.25,157.92ZM40,108a44,44,0,1,1,44,44A44.05,44.05,0,0,1,40,108Zm210.14,98.7a8,8,0,0,1-11.07-2.33A79.83,79.83,0,0,0,172,168a8,8,0,0,1,0-16,44,44,0,1,0-16.34-84.87,8,8,0,1,1-5.94-14.85,60,60,0,0,1,49.53,98.64A95.83,95.83,0,0,1,252.37,195.63,8,8,0,0,1,250.14,206.7Z"/></svg>
      </div>
      <div class="numbered-item">
        <span class="num-circle">1</span>
        <span data-field="workforce-1">20k+ trained field techs</span>
      </div>
      <div class="numbered-item">
        <span class="num-circle">2</span>
        <span data-field="workforce-2">1k+ 24/7 remote support</span>
      </div>
      <div class="numbered-item">
        <span class="num-circle">3</span>
        <span data-field="workforce-3">Virtually every zip code across US</span>
      </div>
      <div class="numbered-item">
        <span class="num-circle">4</span>
        <span data-field="workforce-4">&lt;1 hour response time</span>
      </div>
    </div>
    <div>
      <div class="col-header">
        <span style="font-size:20px; font-weight:700;">AI Platform</span>
        <!-- Robot icon -->
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="#33ee69" viewBox="0 0 256 256"><path d="M200,48H136V16a8,8,0,0,0-16,0V48H56A32,32,0,0,0,24,80V192a32,32,0,0,0,32,32H200a32,32,0,0,0,32-32V80A32,32,0,0,0,200,48Zm16,144a16,16,0,0,1-16,16H56a16,16,0,0,1-16-16V80A16,16,0,0,1,56,64H200a16,16,0,0,1,16,16Zm-36-56a12,12,0,1,1-12-12A12,12,0,0,1,180,136Zm-72,0a12,12,0,1,1-12-12A12,12,0,0,1,108,136Zm-2.26,40.84a8,8,0,0,1-11.58,2.42A48.18,48.18,0,0,0,68,168a8,8,0,0,1,0-16,64.24,64.24,0,0,1,35.31,10.58A8,8,0,0,1,105.74,176.84Zm87.52-14.26A48.18,48.18,0,0,0,188,168a8,8,0,0,1,0-16,64.24,64.24,0,0,1,35.31,10.58,8,8,0,0,1-11.16,11.58A48.18,48.18,0,0,0,188,168Z"/></svg>
        <!-- Graph icon -->
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="#33ee69" viewBox="0 0 256 256"><path d="M200,152a31.84,31.84,0,0,0-19.53,6.68l-23.11-18A31.65,31.65,0,0,0,160,128a31.65,31.65,0,0,0-2.64-12.68l23.11-18A31.84,31.84,0,0,0,200,104a32,32,0,1,0-32-32,31.65,31.65,0,0,0,2.64,12.68l-23.11,18A31.84,31.84,0,0,0,128,96a31.84,31.84,0,0,0-19.53,6.68l-23.11-18A31.65,31.65,0,0,0,88,72a32,32,0,1,0-32,32,31.84,31.84,0,0,0,19.53-6.68l23.11,18A31.65,31.65,0,0,0,96,128a31.65,31.65,0,0,0,2.64,12.68l-23.11,18A31.84,31.84,0,0,0,56,152a32,32,0,1,0,32,32,31.65,31.65,0,0,0-2.64-12.68l23.11-18A31.84,31.84,0,0,0,128,160a31.84,31.84,0,0,0,19.53-6.68l23.11,18A31.65,31.65,0,0,0,168,184a32,32,0,1,0,32-32ZM200,56a16,16,0,1,1-16,16A16,16,0,0,1,200,56ZM56,88A16,16,0,1,1,72,72,16,16,0,0,1,56,88Zm0,112a16,16,0,1,1,16-16A16,16,0,0,1,56,200Zm72-56a16,16,0,1,1,16-16A16,16,0,0,1,128,144Zm72,56a16,16,0,1,1,16-16A16,16,0,0,1,200,200Z"/></svg>
      </div>
      <div class="check-item">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#33ee69" viewBox="0 0 256 256"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm45.66-109.66a8,8,0,0,1,0,11.32l-40,40a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L128,140.69l34.34-34.35A8,8,0,0,1,173.66,106.34Z"/></svg>
        <span data-field="platform-1">Creates interactive SOPs from your docs</span>
      </div>
      <div class="check-item">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#33ee69" viewBox="0 0 256 256"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm45.66-109.66a8,8,0,0,1,0,11.32l-40,40a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L128,140.69l34.34-34.35A8,8,0,0,1,173.66,106.34Z"/></svg>
        <span data-field="platform-2">Automated robot CLI troubleshooting</span>
      </div>
      <div class="check-item">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#33ee69" viewBox="0 0 256 256"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm45.66-109.66a8,8,0,0,1,0,11.32l-40,40a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L128,140.69l34.34-34.35A8,8,0,0,1,173.66,106.34Z"/></svg>
        <span data-field="platform-3">Live escalation to HQ team with logs</span>
      </div>
      <div class="check-item">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#33ee69" viewBox="0 0 256 256"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm45.66-109.66a8,8,0,0,1,0,11.32l-40,40a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L128,140.69l34.34-34.35A8,8,0,0,1,173.66,106.34Z"/></svg>
        <span data-field="platform-4">Automated service report generation</span>
      </div>
      <div class="check-item">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#33ee69" viewBox="0 0 256 256"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm45.66-109.66a8,8,0,0,1,0,11.32l-40,40a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L128,140.69l34.34-34.35A8,8,0,0,1,173.66,106.34Z"/></svg>
        <span data-field="platform-5">Integrated with Slack, Jira, Salesforce, etc.</span>
      </div>
    </div>
  </div>

  <!-- CTA Footer -->
  <div class="cta">
    <h2 data-field="cta-text">Let's talk about a free pilot</h2>
    <div class="contact-pills">
      <span class="contact-pill">
        <!-- Phone icon -->
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#33ee69" viewBox="0 0 256 256"><path d="M222.37,158.46l-47.11-21.11-.13-.06a16,16,0,0,0-15.17,1.4,8.12,8.12,0,0,0-.75.56L134.87,160c-15.42-7.49-31.34-23.29-38.83-38.51l20.78-24.71c.2-.25.39-.5.57-.77a16,16,0,0,0,1.32-15.06l0-.12L97.54,33.64a16,16,0,0,0-16.62-9.52A56.26,56.26,0,0,0,32,80c0,79.4,64.6,144,144,144a56.26,56.26,0,0,0,55.88-48.92A16,16,0,0,0,222.37,158.46ZM176,208A128.14,128.14,0,0,1,48,80,40.2,40.2,0,0,1,82.87,40a.61.61,0,0,0,0,.12l21,47L83.2,111.86a6.13,6.13,0,0,0-.57.77,16,16,0,0,0-1,15.7c9.06,18.53,27.73,37.06,46.46,46.11a16,16,0,0,0,15.17-1.4,8.12,8.12,0,0,0,.75-.56L168.89,152l47,21.05h0s.08,0,.11,0A40.21,40.21,0,0,1,176,208Z"/></svg>
        <span data-field="phone">213-522-6220</span>
      </span>
      <span class="contact-pill">
        <!-- Envelope icon -->
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#33ee69" viewBox="0 0 256 256"><path d="M224,48H32a8,8,0,0,0-8,8V192a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A8,8,0,0,0,224,48ZM203.43,64,128,133.15,52.57,64ZM216,192H40V74.19l82.59,75.71a8,8,0,0,0,10.82,0L216,74.19V192Z"/></svg>
        <span data-field="email">akshansh@farhand.live</span>
      </span>
      <span class="contact-pill">
        <!-- Globe icon -->
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#33ee69" viewBox="0 0 256 256"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm88,104a87.62,87.62,0,0,1-6.4,32.94l-44.7-27.49a15.92,15.92,0,0,0-6.24-2.23l-22.82-3.08a16.11,16.11,0,0,0-16,7.86h-8.72l-3.8-7.86a16,16,0,0,0-11.09-8.48L74.34,115l-4.82-8.44A16,16,0,0,0,56,98.72V104a87.83,87.83,0,0,1,72-87.63v0A16,16,0,0,0,143.82,40H160a16,16,0,0,0,16-16V24a88.08,88.08,0,0,1,40,104ZM40,128A87.77,87.77,0,0,1,71.22,56.63,16,16,0,0,0,80,71.49l4.83,8.44A16,16,0,0,0,98.42,88.4l21.88,4.67a16,16,0,0,0,3.06-1.5l3.8,7.86a16,16,0,0,0,14.35,8.87h1.51l22.82,3.08a15.92,15.92,0,0,0,6.24,2.23l44.7,27.49A87.76,87.76,0,0,1,40,128Z"/></svg>
        <span data-field="website">www.farhand.live</span>
      </span>
    </div>
  </div>

</body>
</html>`;

const outPath = path.join(__dirname, 'app', 'current.html');
fs.writeFileSync(outPath, html, 'utf8');
console.log(`Wrote ${outPath} (${(html.length / 1024).toFixed(1)} KB)`);
