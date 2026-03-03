// Generate a content-rich test one-pager with infographic
// Run: node _gen-test-onepager.js

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
  <title>Farhand Robotics — Field Service Platform</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    :root {
      --accent: #33ee69;
      --accent-light: #33ee6915;
      --accent-mid: #33ee6940;
      --primary: #10100d;
      --bg: #ffffff;
      --gray-light: #f5f5f5;
      --gray-border: #e0e0e0;
      --text-secondary: #666666;
      --red: #ef4444;
      --red-light: #fef2f2;
      --green-light: #f0fdf4;
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

    /* Accent bar */
    .accent-bar { width: 100%; height: 5px; background: var(--accent); flex-shrink: 0; }

    /* Header */
    .header { display: flex; justify-content: space-between; align-items: flex-start; padding: 20px 40px 14px; flex-shrink: 0; }
    .header img { height: 36px; }
    .header-sub { font-size: 12px; color: var(--text-secondary); margin-top: 3px; }
    .header-right { text-align: right; }
    .header-label { font-size: 10px; font-weight: 600; color: #999; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px; }
    .pills { display: flex; flex-direction: column; gap: 5px; align-items: flex-end; }
    .pill { display: inline-block; padding: 4px 14px; border: 1.5px solid var(--accent); border-radius: 20px; font-size: 11px; font-weight: 600; color: var(--primary); }

    /* Hero */
    .hero { padding: 0 40px 12px; flex-shrink: 0; }
    .hero-headline { font-size: 22px; font-weight: 800; line-height: 1.2; margin-bottom: 6px; }
    .hero-headline em { font-style: normal; color: #33ee69; }
    .hero p { font-size: 12px; line-height: 1.5; color: var(--text-secondary); }

    /* Infographic */
    .infographic { padding: 0 40px 12px; flex-shrink: 0; }
    .infographic-title { font-size: 14px; font-weight: 700; margin-bottom: 10px; padding-left: 10px; border-left: 3px solid var(--accent); }
    .info-row { display: flex; gap: 12px; margin-bottom: 10px; }

    /* Before/After */
    .ba-container { display: flex; gap: 10px; align-items: stretch; }
    .ba-card { flex: 1; border-radius: 8px; padding: 14px; }
    .ba-before { background: var(--red-light); border: 1px solid #fecaca; }
    .ba-after { background: var(--green-light); border: 1px solid #bbf7d0; }
    .ba-label { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px; }
    .ba-before .ba-label { color: var(--red); }
    .ba-after .ba-label { color: #16a34a; }
    .ba-item { display: flex; align-items: flex-start; gap: 6px; margin-bottom: 5px; font-size: 11px; line-height: 1.4; }
    .ba-icon { flex-shrink: 0; margin-top: 1px; }
    .ba-arrow { display: flex; align-items: center; justify-content: center; flex-shrink: 0; width: 28px; }
    .ba-arrow svg { transform: rotate(0deg); }

    /* Stats row */
    .stats { display: flex; gap: 10px; }
    .stat-card { flex: 1; background: var(--gray-light); border-radius: 8px; padding: 12px; text-align: center; }
    .stat-number { font-size: 22px; font-weight: 800; color: var(--accent); line-height: 1; }
    .stat-label { font-size: 10px; color: var(--text-secondary); margin-top: 4px; font-weight: 500; }

    /* Process flow */
    .process { padding: 0 40px 12px; flex-shrink: 0; }
    .process-title { font-size: 14px; font-weight: 700; margin-bottom: 10px; padding-left: 10px; border-left: 3px solid var(--accent); }
    .process-steps { display: flex; gap: 0; align-items: flex-start; }
    .process-step { flex: 1; text-align: center; position: relative; }
    .step-circle { width: 36px; height: 36px; border-radius: 50%; background: var(--accent); display: flex; align-items: center; justify-content: center; margin: 0 auto 6px; }
    .step-circle svg { width: 18px; height: 18px; }
    .step-num { font-size: 11px; font-weight: 700; color: var(--primary); }
    .step-title { font-size: 11px; font-weight: 700; margin-bottom: 2px; }
    .step-desc { font-size: 10px; color: var(--text-secondary); line-height: 1.3; padding: 0 4px; }
    .step-arrow { position: absolute; right: -8px; top: 16px; }

    /* Two-column */
    .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; padding: 0 40px 12px; flex-shrink: 0; }
    .col-header { display: flex; align-items: center; gap: 8px; margin-bottom: 10px; }
    .col-title { font-size: 14px; font-weight: 700; }
    .check-item { display: flex; align-items: flex-start; gap: 8px; margin-bottom: 6px; }
    .check-item svg { flex-shrink: 0; margin-top: 2px; }
    .check-item span { font-size: 11px; line-height: 1.4; }

    /* CTA */
    .cta { margin-top: auto; padding: 14px 40px 18px; background: var(--gray-light); flex-shrink: 0; }
    .cta-headline { font-size: 16px; font-weight: 700; margin-bottom: 10px; }
    .contact-row { display: flex; gap: 10px; flex-wrap: wrap; }
    .contact-pill { display: inline-flex; align-items: center; gap: 6px; padding: 6px 16px; border: 1.5px solid var(--accent); border-radius: 20px; font-size: 11px; font-weight: 500; }
    .contact-pill svg { flex-shrink: 0; }
  </style>
</head>
<body>

  <div class="accent-bar"></div>

  <!-- Header -->
  <div class="header">
    <div>
      <img src="data:image/png;base64,${logoBase64}" alt="Farhand" style="height:36px;">
      <p class="header-sub" data-field="subtitle">AI-Powered Field Service for Robotics</p>
    </div>
    <div class="header-right">
      <p class="header-label">Prepared for:</p>
      <div class="pills">
        <span class="pill" data-field="segment-1">Apex Robotics (Series B)</span>
        <span class="pill" data-field="segment-2">Fleet: 340 AMRs across 12 sites</span>
      </div>
    </div>
  </div>

  <!-- Hero -->
  <div class="hero">
    <h1 class="hero-headline" data-field="headline">Stop Flying Engineers. <em>Deploy AI-Guided Techs.</em></h1>
    <p data-field="hero-text">Farhand replaces your expensive W-2 field engineering team with a nationwide network of 20,000+ technicians guided by AI trained on your specific robots. Our platform ingests your documentation, creates interactive SOPs, and provides real-time CLI troubleshooting — so any qualified tech performs like your best engineer. We handle hiring, training, liability, and 24/7 dispatch.</p>
  </div>

  <!-- INFOGRAPHIC: Before/After + Stats -->
  <div class="infographic">
    <h2 class="infographic-title">The Problem We Solve</h2>
    <div class="info-row">
      <div class="ba-container" style="flex:1;">
        <div class="ba-card ba-before">
          <div class="ba-label">Before Farhand</div>
          <div class="ba-item">
            <svg class="ba-icon" xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="#ef4444" viewBox="0 0 256 256"><path d="M165.66,101.66,139.31,128l26.35,26.34a8,8,0,0,1-11.32,11.32L128,139.31l-26.34,26.35a8,8,0,0,1-11.32-11.32L116.69,128,90.34,101.66a8,8,0,0,1,11.32-11.32L128,116.69l26.34-26.35a8,8,0,0,1,11.32,11.32Z"/></svg>
            <span data-field="before-1">$185K+ per field engineer (salary + travel + benefits)</span>
          </div>
          <div class="ba-item">
            <svg class="ba-icon" xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="#ef4444" viewBox="0 0 256 256"><path d="M165.66,101.66,139.31,128l26.35,26.34a8,8,0,0,1-11.32,11.32L128,139.31l-26.34,26.35a8,8,0,0,1-11.32-11.32L116.69,128,90.34,101.66a8,8,0,0,1,11.32-11.32L128,116.69l26.34-26.35a8,8,0,0,1,11.32,11.32Z"/></svg>
            <span data-field="before-2">48-hour avg response time for on-site visits</span>
          </div>
          <div class="ba-item">
            <svg class="ba-icon" xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="#ef4444" viewBox="0 0 256 256"><path d="M165.66,101.66,139.31,128l26.35,26.34a8,8,0,0,1-11.32,11.32L128,139.31l-26.34,26.35a8,8,0,0,1-11.32-11.32L116.69,128,90.34,101.66a8,8,0,0,1,11.32-11.32L128,116.69l26.34-26.35a8,8,0,0,1,11.32,11.32Z"/></svg>
            <span data-field="before-3">Knowledge locked in 2-3 senior engineers' heads</span>
          </div>
          <div class="ba-item">
            <svg class="ba-icon" xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="#ef4444" viewBox="0 0 256 256"><path d="M165.66,101.66,139.31,128l26.35,26.34a8,8,0,0,1-11.32,11.32L128,139.31l-26.34,26.35a8,8,0,0,1-11.32-11.32L116.69,128,90.34,101.66a8,8,0,0,1,11.32-11.32L128,116.69l26.34-26.35a8,8,0,0,1,11.32,11.32Z"/></svg>
            <span data-field="before-4">Can't scale past 50 deployed units without hiring</span>
          </div>
        </div>
        <div class="ba-arrow">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#33ee69" viewBox="0 0 256 256"><path d="M221.66,133.66l-72,72a8,8,0,0,1-11.32-11.32L196.69,136H40a8,8,0,0,1,0-16H196.69l-58.35-58.34a8,8,0,0,1,11.32-11.32l72,72A8,8,0,0,1,221.66,133.66Z"/></svg>
        </div>
        <div class="ba-card ba-after">
          <div class="ba-label">With Farhand</div>
          <div class="ba-item">
            <svg class="ba-icon" xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="#16a34a" viewBox="0 0 256 256"><path d="M173.66,98.34a8,8,0,0,1,0,11.32l-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35A8,8,0,0,1,173.66,98.34Z"/></svg>
            <span data-field="after-1">Pay-per-incident: avg $320/visit vs $2,400 internal cost</span>
          </div>
          <div class="ba-item">
            <svg class="ba-icon" xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="#16a34a" viewBox="0 0 256 256"><path d="M173.66,98.34a8,8,0,0,1,0,11.32l-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35A8,8,0,0,1,173.66,98.34Z"/></svg>
            <span data-field="after-2">&lt;1 hour response, 24/7 dispatch nationwide</span>
          </div>
          <div class="ba-item">
            <svg class="ba-icon" xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="#16a34a" viewBox="0 0 256 256"><path d="M173.66,98.34a8,8,0,0,1,0,11.32l-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35A8,8,0,0,1,173.66,98.34Z"/></svg>
            <span data-field="after-3">AI captures & distributes tribal knowledge instantly</span>
          </div>
          <div class="ba-item">
            <svg class="ba-icon" xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="#16a34a" viewBox="0 0 256 256"><path d="M173.66,98.34a8,8,0,0,1,0,11.32l-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35A8,8,0,0,1,173.66,98.34Z"/></svg>
            <span data-field="after-4">Scale to 10,000 bots without adding headcount</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Stats -->
    <div class="stats">
      <div class="stat-card">
        <div class="stat-number" data-field="stat-1-num">87%</div>
        <div class="stat-label" data-field="stat-1-label">Cost reduction vs in-house field team</div>
      </div>
      <div class="stat-card">
        <div class="stat-number" data-field="stat-2-num">&lt;45min</div>
        <div class="stat-label" data-field="stat-2-label">Avg time to resolution</div>
      </div>
      <div class="stat-card">
        <div class="stat-number" data-field="stat-3-num">99.2%</div>
        <div class="stat-label" data-field="stat-3-label">First-visit fix rate</div>
      </div>
      <div class="stat-card">
        <div class="stat-number" data-field="stat-4-num">20K+</div>
        <div class="stat-label" data-field="stat-4-label">Certified technicians nationwide</div>
      </div>
    </div>
  </div>

  <!-- Process Flow -->
  <div class="process">
    <h2 class="process-title">How It Works</h2>
    <div class="process-steps">
      <div class="process-step">
        <div class="step-circle">
          <!-- UploadSimple -->
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#10100d" viewBox="0 0 256 256"><path d="M224,152v56a16,16,0,0,1-16,16H48a16,16,0,0,1-16-16V152a8,8,0,0,1,16,0v56H208V152a8,8,0,0,1,16,0ZM93.66,85.66,120,59.31V152a8,8,0,0,0,16,0V59.31l26.34,26.35a8,8,0,0,0,11.32-11.32l-40-40a8,8,0,0,0-11.32,0l-40,40A8,8,0,0,0,93.66,85.66Z"/></svg>
        </div>
        <div class="step-title" data-field="step-1-title">Upload Docs</div>
        <div class="step-desc" data-field="step-1-desc">Service manuals, wiring diagrams, troubleshooting guides</div>
        <div class="step-arrow">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#33ee69" viewBox="0 0 256 256"><path d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z"/></svg>
        </div>
      </div>
      <div class="process-step">
        <div class="step-circle">
          <!-- Robot -->
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#10100d" viewBox="0 0 256 256"><path d="M200,48H136V16a8,8,0,0,0-16,0V48H56A32,32,0,0,0,24,80V192a32,32,0,0,0,32,32H200a32,32,0,0,0,32-32V80A32,32,0,0,0,200,48Zm16,144a16,16,0,0,1-16,16H56a16,16,0,0,1-16-16V80A16,16,0,0,1,56,64H200a16,16,0,0,1,16,16ZM108,136a12,12,0,1,1-12-12A12,12,0,0,1,108,136Zm72,0a12,12,0,1,1-12-12A12,12,0,0,1,180,136Zm-24,36a8,8,0,0,1-8,8H108a8,8,0,0,1,0-16h40A8,8,0,0,1,156,172Z"/></svg>
        </div>
        <div class="step-title" data-field="step-2-title">AI Learns Your Robot</div>
        <div class="step-desc" data-field="step-2-desc">Creates interactive SOPs, diagnostic trees, and CLI commands</div>
        <div class="step-arrow">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#33ee69" viewBox="0 0 256 256"><path d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z"/></svg>
        </div>
      </div>
      <div class="process-step">
        <div class="step-circle">
          <!-- Wrench -->
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#10100d" viewBox="0 0 256 256"><path d="M226.76,69a8,8,0,0,0-12.84-2.88l-40.3,37.19-17.23-3.7-3.7-17.23,37.19-40.3A8,8,0,0,0,187,29.24,72,72,0,0,0,88,96a72.34,72.34,0,0,0,3.2,21.09L36.69,160.6a24,24,0,0,0,33.94,33.94l43.51-54.51A72.08,72.08,0,0,0,226.76,69ZM160,152a56.14,56.14,0,0,1-27.07-7,8,8,0,0,0-9.92,1.77L75.43,205.75a8,8,0,0,1-11.32-11.32l58.95-47.58a8,8,0,0,0,1.77-9.92,56,56,0,0,1,58.94-79.53l-30.64,33.2a8,8,0,0,0-1.94,6.57l5.21,24.23a8,8,0,0,0,6.12,6.12l24.23,5.21a8,8,0,0,0,6.57-1.94l33.2-30.64A56.07,56.07,0,0,1,160,152Z"/></svg>
        </div>
        <div class="step-title" data-field="step-3-title">Tech Dispatched</div>
        <div class="step-desc" data-field="step-3-desc">Nearest qualified tech gets AI briefing + real-time guidance</div>
        <div class="step-arrow">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#33ee69" viewBox="0 0 256 256"><path d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z"/></svg>
        </div>
      </div>
      <div class="process-step">
        <div class="step-circle">
          <!-- CheckCircle -->
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#10100d" viewBox="0 0 256 256"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm45.66-109.66a8,8,0,0,1,0,11.32l-40,40a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L128,140.69l34.34-34.35A8,8,0,0,1,173.66,106.34Z"/></svg>
        </div>
        <div class="step-title" data-field="step-4-title">Resolved + Report</div>
        <div class="step-desc" data-field="step-4-desc">Auto-generated service report with photos, logs, and RCA</div>
      </div>
    </div>
  </div>

  <!-- Coverage + Platform -->
  <div class="two-col">
    <div>
      <div class="col-header">
        <span class="col-title">Coverage &amp; Workforce</span>
        <!-- MapPin icon -->
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#33ee69" viewBox="0 0 256 256"><path d="M128,16a88.1,88.1,0,0,0-88,88c0,75.3,80,132.17,83.41,134.55a8,8,0,0,0,9.18,0C136,236.17,216,179.3,216,104A88.1,88.1,0,0,0,128,16Zm0,56a32,32,0,1,1-32,32A32,32,0,0,1,128,72Z"/></svg>
      </div>
      <div class="check-item">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="#33ee69" viewBox="0 0 256 256"><path d="M173.66,98.34a8,8,0,0,1,0,11.32l-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35A8,8,0,0,1,173.66,98.34Z"/></svg>
        <span data-field="coverage-1">All 50 US states + Puerto Rico + Canada</span>
      </div>
      <div class="check-item">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="#33ee69" viewBox="0 0 256 256"><path d="M173.66,98.34a8,8,0,0,1,0,11.32l-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35A8,8,0,0,1,173.66,98.34Z"/></svg>
        <span data-field="coverage-2">Background-checked, drug-tested, insured techs</span>
      </div>
      <div class="check-item">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="#33ee69" viewBox="0 0 256 256"><path d="M173.66,98.34a8,8,0,0,1,0,11.32l-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35A8,8,0,0,1,173.66,98.34Z"/></svg>
        <span data-field="coverage-3">$5M general liability + $2M professional liability</span>
      </div>
      <div class="check-item">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="#33ee69" viewBox="0 0 256 256"><path d="M173.66,98.34a8,8,0,0,1,0,11.32l-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35A8,8,0,0,1,173.66,98.34Z"/></svg>
        <span data-field="coverage-4">Tier 1 (24/7) and Tier 3 (business hours) SLAs</span>
      </div>
      <div class="check-item">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="#33ee69" viewBox="0 0 256 256"><path d="M173.66,98.34a8,8,0,0,1,0,11.32l-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35A8,8,0,0,1,173.66,98.34Z"/></svg>
        <span data-field="coverage-5">Robot-specific certification training provided</span>
      </div>
    </div>
    <div>
      <div class="col-header">
        <span class="col-title">AI Platform Capabilities</span>
        <!-- Robot icon -->
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#33ee69" viewBox="0 0 256 256"><path d="M200,48H136V16a8,8,0,0,0-16,0V48H56A32,32,0,0,0,24,80V192a32,32,0,0,0,32,32H200a32,32,0,0,0,32-32V80A32,32,0,0,0,200,48Zm16,144a16,16,0,0,1-16,16H56a16,16,0,0,1-16-16V80A16,16,0,0,1,56,64H200a16,16,0,0,1,16,16ZM108,136a12,12,0,1,1-12-12A12,12,0,0,1,108,136Zm72,0a12,12,0,1,1-12-12A12,12,0,0,1,180,136Zm-24,36a8,8,0,0,1-8,8H108a8,8,0,0,1,0-16h40A8,8,0,0,1,156,172Z"/></svg>
      </div>
      <div class="check-item">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="#33ee69" viewBox="0 0 256 256"><path d="M173.66,98.34a8,8,0,0,1,0,11.32l-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35A8,8,0,0,1,173.66,98.34Z"/></svg>
        <span data-field="platform-1">Auto-generates SOPs from your manuals &amp; docs</span>
      </div>
      <div class="check-item">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="#33ee69" viewBox="0 0 256 256"><path d="M173.66,98.34a8,8,0,0,1,0,11.32l-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35A8,8,0,0,1,173.66,98.34Z"/></svg>
        <span data-field="platform-2">SSH into robots for live CLI troubleshooting</span>
      </div>
      <div class="check-item">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="#33ee69" viewBox="0 0 256 256"><path d="M173.66,98.34a8,8,0,0,1,0,11.32l-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35A8,8,0,0,1,173.66,98.34Z"/></svg>
        <span data-field="platform-3">Real-time escalation to your HQ with full logs</span>
      </div>
      <div class="check-item">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="#33ee69" viewBox="0 0 256 256"><path d="M173.66,98.34a8,8,0,0,1,0,11.32l-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35A8,8,0,0,1,173.66,98.34Z"/></svg>
        <span data-field="platform-4">Automated service reports with RCA analysis</span>
      </div>
      <div class="check-item">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="#33ee69" viewBox="0 0 256 256"><path d="M173.66,98.34a8,8,0,0,1,0,11.32l-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35A8,8,0,0,1,173.66,98.34Z"/></svg>
        <span data-field="platform-5">Integrates with Slack, Jira, Salesforce, ServiceNow</span>
      </div>
    </div>
  </div>

  <!-- CTA Footer -->
  <div class="cta">
    <h2 class="cta-headline" data-field="cta-text">Start a Free 30-Day Pilot — No Commitment Required</h2>
    <div class="contact-row">
      <span class="contact-pill">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#33ee69" viewBox="0 0 256 256"><path d="M222.37,158.46l-47.11-21.11-.13-.06a16,16,0,0,0-15.17,1.4,8.12,8.12,0,0,0-.75.56L134.87,160c-15.42-7.49-31.34-23.29-38.83-38.51l20.78-24.71c.2-.25.39-.5.57-.77a16,16,0,0,0,1.32-15.06l0-.12L97.54,33.64a16,16,0,0,0-16.62-9.52A56.26,56.26,0,0,0,32,80c0,79.4,64.6,144,144,144a56.26,56.26,0,0,0,55.88-48.92A16,16,0,0,0,222.37,158.46ZM176,208A128.14,128.14,0,0,1,48,80,40.2,40.2,0,0,1,82.87,40a.61.61,0,0,0,0,.12l21,47L83.2,111.86a6.13,6.13,0,0,0-.57.77,16,16,0,0,0-1,15.7c9.06,18.53,27.73,37.06,46.46,46.11a16,16,0,0,0,15.17-1.4,8.12,8.12,0,0,0,.75-.56L168.89,152l47,21.05h0s.08,0,.11,0A40.21,40.21,0,0,1,176,208Z"/></svg>
        <span data-field="phone">213-522-6220</span>
      </span>
      <span class="contact-pill">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#33ee69" viewBox="0 0 256 256"><path d="M224,48H32a8,8,0,0,0-8,8V192a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A8,8,0,0,0,224,48ZM203.43,64,128,133.15,52.57,64ZM216,192H40V74.19l82.59,75.71a8,8,0,0,0,10.82,0L216,74.19V192Z"/></svg>
        <span data-field="email">akshansh@farhand.live</span>
      </span>
      <span class="contact-pill">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#33ee69" viewBox="0 0 256 256"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm88,104a87.62,87.62,0,0,1-6.4,32.94l-44.7-27.49a15.92,15.92,0,0,0-6.24-2.23l-22.82-3.08a16.11,16.11,0,0,0-16,7.86h-8.72l-3.8-7.86a16,16,0,0,0-11.09-8.48L74.34,115l-4.82-8.44A16,16,0,0,0,56,98.72V104a87.83,87.83,0,0,1,72-87.63v0A16,16,0,0,0,143.82,40H160a16,16,0,0,0,16-16V24a88.08,88.08,0,0,1,40,104Z"/></svg>
        <span data-field="website">www.farhand.live</span>
      </span>
      <span class="contact-pill">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#33ee69" viewBox="0 0 256 256"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm40-88a8,8,0,0,1-8,8H136v24a8,8,0,0,1-16,0V136H96a8,8,0,0,1,0-16h24V96a8,8,0,0,1,16,0v24h24A8,8,0,0,1,168,136Z"/></svg>
        <span data-field="calendar">Book a demo &rarr; calendly.com/farhand</span>
      </span>
    </div>
  </div>

</body>
</html>`;

const outPath = path.join(__dirname, 'app', 'current.html');
fs.writeFileSync(outPath, html, 'utf8');
console.log('Wrote ' + outPath + ' (' + (html.length / 1024).toFixed(1) + ' KB)');
