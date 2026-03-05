"""Rebuild Farhand.html with proper AMR.png-matching page 1, real map image for page 2.
All icons are Phosphor Icons (https://phosphoricons.com) — regular weight SVG paths."""
import base64, re, os

BASE = r'C:/Users/aarya/Files/Farhand Robotics/farhand-robotics/onepager'
HTML_PATH = os.path.join(BASE, 'documents', 'Company Materials', 'Field', 'Farhand.html')
LOGO_PATH = os.path.join(BASE, 'brand', 'logo-w-type-light-base64.txt')
MAP_PATH = os.path.join(BASE, 'references', 'assets', 'us-map-farhand.png')

# Read logo
with open(LOGO_PATH, 'r') as f:
    logo_b64 = f.read().strip()
logo_uri = f'data:image/png;base64,{logo_b64}'

# Read map and convert to base64
with open(MAP_PATH, 'rb') as f:
    map_bytes = f.read()
map_b64 = base64.b64encode(map_bytes).decode('utf-8')
map_uri = f'data:image/png;base64,{map_b64}'

print(f'Logo URI: {len(logo_uri)} chars')
print(f'Map URI: {len(map_uri)} chars')

# Phosphor Icon SVG paths (regular weight, from @phosphor-icons/core)
def phosphor(path_d, size=20, color='#33ee69'):
    return f'<svg xmlns="http://www.w3.org/2000/svg" width="{size}" height="{size}" viewBox="0 0 256 256" fill="{color}" style="flex-shrink:0;"><path d="{path_d}"/></svg>'

ICON_USERS = 'M117.25,157.92a60,60,0,1,0-66.5,0A95.83,95.83,0,0,0,3.53,195.63a8,8,0,1,0,13.4,8.74,80,80,0,0,1,134.14,0,8,8,0,0,0,13.4-8.74A95.83,95.83,0,0,0,117.25,157.92ZM40,108a44,44,0,1,1,44,44A44.05,44.05,0,0,1,40,108Zm210.14,98.7a8,8,0,0,1-11.07-2.33A79.83,79.83,0,0,0,172,168a8,8,0,0,1,0-16,44,44,0,1,0-16.34-84.87,8,8,0,1,1-5.94-14.85,60,60,0,0,1,55.53,105.64,95.83,95.83,0,0,1,47.22,37.71A8,8,0,0,1,250.14,206.7Z'
ICON_HEADSET = 'M201.89,54.66A103.43,103.43,0,0,0,128.79,24H128A104,104,0,0,0,24,128v56a24,24,0,0,0,24,24H64a24,24,0,0,0,24-24V144a24,24,0,0,0-24-24H40.36A88.12,88.12,0,0,1,190.54,65.93,87.39,87.39,0,0,1,215.65,120H192a24,24,0,0,0-24,24v40a24,24,0,0,0,24,24h24a24,24,0,0,1-24,24H136a8,8,0,0,0,0,16h56a40,40,0,0,0,40-40V128A103.41,103.41,0,0,0,201.89,54.66ZM64,136a8,8,0,0,1,8,8v40a8,8,0,0,1-8,8H48a8,8,0,0,1-8-8V136Zm128,56a8,8,0,0,1-8-8V144a8,8,0,0,1,8-8h24v56Z'
ICON_MONITOR = 'M208,40H48A24,24,0,0,0,24,64V176a24,24,0,0,0,24,24H208a24,24,0,0,0,24-24V64A24,24,0,0,0,208,40Zm8,136a8,8,0,0,1-8,8H48a8,8,0,0,1-8-8V64a8,8,0,0,1,8-8H208a8,8,0,0,1,8,8Zm-48,48a8,8,0,0,1-8,8H96a8,8,0,0,1,0-16h64A8,8,0,0,1,168,224Z'
ICON_GEAR = 'M128,80a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160Zm88-29.84q.06-2.16,0-4.32l14.92-18.64a8,8,0,0,0,1.48-7.06,107.21,107.21,0,0,0-10.88-26.25,8,8,0,0,0-6-3.93l-23.72-2.64q-1.48-1.56-3-3L186,40.54a8,8,0,0,0-3.94-6,107.71,107.71,0,0,0-26.25-10.87,8,8,0,0,0-7.06,1.49L130.16,40Q128,40,125.84,40L107.2,25.11a8,8,0,0,0-7.06-1.48A107.6,107.6,0,0,0,73.89,34.51a8,8,0,0,0-3.93,6L67.32,64.27q-1.56,1.49-3,3L40.54,70a8,8,0,0,0-6,3.94,107.71,107.71,0,0,0-10.87,26.25,8,8,0,0,0,1.49,7.06L40,125.84Q40,128,40,130.16L25.11,148.8a8,8,0,0,0-1.48,7.06,107.21,107.21,0,0,0,10.88,26.25,8,8,0,0,0,6,3.93l23.72,2.64q1.49,1.56,3,3L70,215.46a8,8,0,0,0,3.94,6,107.71,107.71,0,0,0,26.25,10.87,8,8,0,0,0,7.06-1.49L125.84,216q2.16.06,4.32,0l18.64,14.92a8,8,0,0,0,7.06,1.48,107.21,107.21,0,0,0,26.25-10.88,8,8,0,0,0,3.93-6l2.64-23.72q1.56-1.48,3-3L215.46,186a8,8,0,0,0,6-3.94,107.71,107.71,0,0,0,10.87-26.25,8,8,0,0,0-1.49-7.06Zm-16.1-6.5a73.93,73.93,0,0,1,0,8.68,8,8,0,0,0,1.74,5.48l14.19,17.73a91.57,91.57,0,0,1-6.23,15L187,173.11a8,8,0,0,0-5.1,2.64,74.11,74.11,0,0,1-6.14,6.14,8,8,0,0,0-2.64,5.1l-2.51,22.58a91.32,91.32,0,0,1-15,6.23l-17.74-14.19a8,8,0,0,0-5-1.75h-.48a73.93,73.93,0,0,1-8.68,0,8,8,0,0,0-5.48,1.74L100.45,215.8a91.57,91.57,0,0,1-15-6.23L82.89,187a8,8,0,0,0-2.64-5.1,74.11,74.11,0,0,1-6.14-6.14,8,8,0,0,0-5.1-2.64L46.43,170.6a91.32,91.32,0,0,1-6.23-15l14.19-17.74a8,8,0,0,0,1.74-5.48,73.93,73.93,0,0,1,0-8.68,8,8,0,0,0-1.74-5.48L40.2,100.45a91.57,91.57,0,0,1,6.23-15L69,82.89a8,8,0,0,0,5.1-2.64,74.11,74.11,0,0,1,6.14-6.14A8,8,0,0,0,82.89,69L85.4,46.43a91.32,91.32,0,0,1,15-6.23l17.74,14.19a8,8,0,0,0,5.48,1.74,73.93,73.93,0,0,1,8.68,0,8,8,0,0,0,5.48-1.74L155.55,40.2a91.57,91.57,0,0,1,15,6.23L173.11,69a8,8,0,0,0,2.64,5.1,74.11,74.11,0,0,1,6.14,6.14,8,8,0,0,0,5.1,2.64l22.58,2.51a91.32,91.32,0,0,1,6.23,15l-14.19,17.74A8,8,0,0,0,199.87,123.66Z'
ICON_CHECK_CIRCLE = 'M173.66,98.34a8,8,0,0,1,0,11.32l-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35A8,8,0,0,1,173.66,98.34ZM232,128A104,104,0,1,1,128,24,104.11,104.11,0,0,1,232,128Zm-16,0a88,88,0,1,0-88,88A88.1,88.1,0,0,0,216,128Z'
ICON_PHONE = 'M222.37,158.46l-47.11-21.11-.13-.06a16,16,0,0,0-15.17,1.4,8.12,8.12,0,0,0-.75.56L134.87,160c-15.42-7.49-31.34-23.29-38.83-38.51l20.78-24.71c.2-.25.39-.5.57-.77a16,16,0,0,0,1.32-15.06l0-.12L97.54,33.64a16,16,0,0,0-16.62-9.52A56.26,56.26,0,0,0,32,80c0,79.4,64.6,144,144,144a56.26,56.26,0,0,0,55.88-48.92A16,16,0,0,0,222.37,158.46ZM176,208A128.14,128.14,0,0,1,48,80,40.2,40.2,0,0,1,82.87,40a.61.61,0,0,0,0,.12l21,47L83.2,111.86a6.13,6.13,0,0,0-.57.77,16,16,0,0,0-1,15.7c9.06,18.53,27.73,37.06,46.46,46.11a16,16,0,0,0,15.75-1.14,8.44,8.44,0,0,0,.74-.56L168.89,152l47,21.05h0s.08,0,.11,0A40.21,40.21,0,0,1,176,208Z'
ICON_ENVELOPE = 'M224,48H32a8,8,0,0,0-8,8V192a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A8,8,0,0,0,224,48ZM203.43,64,128,133.15,52.57,64ZM216,192H40V74.19l82.59,75.71a8,8,0,0,0,10.82,0L216,74.19V192Z'
ICON_GLOBE = 'M128,24h0A104,104,0,1,0,232,128,104.12,104.12,0,0,0,128,24Zm87.62,96H175.79C174,83.49,159.94,57.67,148.41,42.4A88.19,88.19,0,0,1,215.63,120ZM96.23,136h63.54c-2.31,41.61-22.23,67.11-31.77,77C118.45,203.1,98.54,177.6,96.23,136Zm0-16C98.54,78.39,118.46,52.89,128,43c9.55,9.93,29.46,35.43,31.77,77Zm11.36-77.6C96.06,57.67,82,83.49,80.21,120H40.37A88.19,88.19,0,0,1,107.59,42.4ZM40.37,136H80.21c1.82,36.51,15.85,62.33,27.38,77.6A88.19,88.19,0,0,1,40.37,136Zm108,77.6c11.53-15.27,25.56-41.09,27.38-77.6h39.84A88.19,88.19,0,0,1,148.41,213.6Z'

# Pre-build icon HTML strings
icon_users = phosphor(ICON_USERS, 22)
icon_headset = phosphor(ICON_HEADSET, 22)
icon_monitor = phosphor(ICON_MONITOR, 22)
icon_gear = phosphor(ICON_GEAR, 22)
icon_check = phosphor(ICON_CHECK_CIRCLE, 18)
icon_phone = phosphor(ICON_PHONE, 16)
icon_envelope = phosphor(ICON_ENVELOPE, 16)
icon_globe = phosphor(ICON_GLOBE, 16)

# Build complete HTML
html = f'''<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Farhand Robotics</title>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<style>
@page {{ size: 8.5in 11in; margin: 0; }}
* {{ margin: 0; padding: 0; box-sizing: border-box; }}
body {{ width: 8.5in; margin: 0 auto; font-family: 'Inter', sans-serif; color: #10100d;
  -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }}
.page {{ width: 8.5in; height: 11in; overflow: hidden; position: relative; box-sizing: border-box;
  page-break-after: always; display: flex; flex-direction: column; }}
.page:last-child {{ page-break-after: auto; }}
@media screen {{
  body {{ background: #e8e8e8; padding: 32px 0; }}
  .page {{ margin: 0 auto 32px; box-shadow: 0 4px 24px rgba(0,0,0,0.12); border-radius: 4px; background: #fff; }}
  .page:last-child {{ margin-bottom: 0; }}
}}
@media print {{
  .page {{ margin: 0; box-shadow: none; border-radius: 0; }}
}}
</style>
</head>
<body>

<!-- ===== PAGE 1: AMR One-Pager ===== -->
<div class="page" style="border-left:3px solid #33ee69; border-right:3px solid #33ee69;">

  <div style="width:100%; height:5px; background:#33ee69; flex-shrink:0;"></div>

  <!-- Header -->
  <div style="display:flex; align-items:flex-start; justify-content:space-between; padding:28px 40px 0;">
    <div>
      <img src="{logo_uri}" style="height:48px;" alt="Farhand Robotics">
      <div style="font-size:14px; color:#888; margin-top:6px;">Your field support partner</div>
    </div>
    <div style="text-align:right;">
      <div style="font-size:12px; font-weight:500; color:#999; text-transform:uppercase; letter-spacing:0.3px; margin-bottom:10px;">Solution made for:</div>
      <div style="display:flex; flex-direction:column; gap:8px; align-items:flex-end;">
        <span data-field="segment-1" style="display:block; padding:8px 24px; border:1.5px solid #33ee69; border-radius:8px; font-size:13px; font-weight:500; text-align:center; min-width:140px;">AMRs</span>
        <span data-field="segment-2" style="display:block; padding:8px 24px; border:1.5px solid #33ee69; border-radius:8px; font-size:13px; font-weight:500; text-align:center; min-width:140px;">Manipulators</span>
        <span data-field="segment-3" style="display:block; padding:8px 24px; border:1.5px solid #33ee69; border-radius:8px; font-size:13px; font-weight:500; text-align:center; min-width:140px;">Humanoids</span>
      </div>
    </div>
  </div>

  <!-- Intro -->
  <div style="padding:20px 40px 0;">
    <p data-field="hero-text" style="font-size:14px; line-height:1.7; color:#333; max-width:420px;">Farhand installs and services robots for growing robotics companies. Our technicians are guided by AI trained on your robot &mdash; so any tech can install, diagnose, and repair like your best field engineer, anywhere in the country.</p>
  </div>

  <!-- Our Value -->
  <div style="padding:28px 40px 0;">
    <h2 style="font-size:22px; font-weight:700; padding-left:14px; border-left:4px solid #33ee69; margin-bottom:18px;">Our Value</h2>
    <div style="display:grid; grid-template-columns:repeat(3,1fr); gap:14px;">
      <div style="border:1.5px solid #e5e5e5; border-radius:12px; padding:20px; display:flex; flex-direction:column;">
        <h3 data-field="vp1-title" style="font-size:15px; font-weight:700; line-height:1.3; margin-bottom:8px;">Lower support overhead</h3>
        <p data-field="vp1-desc" style="font-size:13px; color:#555; line-height:1.55; flex:1;">Replace W-2 field engineers + travel + hotel costs with our on-demand solution.</p>
        <div style="margin-top:14px;">
          <span data-field="vp1-badge" style="display:inline-block; padding:7px 16px; background:#33ee69; border-radius:20px; font-size:12px; font-weight:600; color:#10100d;">Reduces field service cost by 30%</span>
        </div>
      </div>
      <div style="border:1.5px solid #e5e5e5; border-radius:12px; padding:20px; display:flex; flex-direction:column;">
        <h3 data-field="vp2-title" style="font-size:15px; font-weight:700; line-height:1.3; margin-bottom:8px;">Consistent service quality</h3>
        <p data-field="vp2-desc" style="font-size:13px; color:#555; line-height:1.55; flex:1;">Our AI guides tech through repairs, answers questions, and documents all actions.</p>
        <div style="margin-top:14px;">
          <span data-field="vp2-badge" style="display:inline-block; padding:7px 16px; background:#33ee69; border-radius:20px; font-size:12px; font-weight:600; color:#10100d;">Fewer errors. Happier customers.</span>
        </div>
      </div>
      <div style="border:1.5px solid #e5e5e5; border-radius:12px; padding:20px; display:flex; flex-direction:column;">
        <h3 data-field="vp3-title" style="font-size:15px; font-weight:700; line-height:1.3; margin-bottom:8px;">Scales with your fleet</h3>
        <p data-field="vp3-desc" style="font-size:13px; color:#555; line-height:1.55; flex:1;">Deploy without hiring regionally. All techs are screened and work under our liability coverage.</p>
        <div style="margin-top:14px;">
          <span data-field="vp3-badge" style="display:inline-block; padding:7px 16px; background:#33ee69; border-radius:20px; font-size:12px; font-weight:600; color:#10100d;">Built to support 10 &rarr; 10,000 bots</span>
        </div>
      </div>
    </div>
  </div>

  <!-- Workforce + AI Platform -->
  <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px; padding:24px 40px 0;">
    <div style="border:1.5px solid #e5e5e5; border-radius:12px; padding:20px;">
      <div style="display:flex; align-items:center; gap:10px; margin-bottom:16px;">
        <h2 style="font-size:18px; font-weight:700;">Workforce</h2>
        {icon_users}
        {icon_headset}
      </div>
      <div style="display:flex; flex-direction:column; gap:14px;">
        <div style="display:flex; align-items:center; gap:10px;">
          <span style="width:24px; height:24px; border-radius:50%; background:#33ee69; font-size:12px; font-weight:700; display:flex; align-items:center; justify-content:center; flex-shrink:0; color:#10100d;">1</span>
          <span data-field="workforce-1" style="font-size:13px;">20k+ trained field techs</span>
        </div>
        <div style="display:flex; align-items:center; gap:10px;">
          <span style="width:24px; height:24px; border-radius:50%; background:#33ee69; font-size:12px; font-weight:700; display:flex; align-items:center; justify-content:center; flex-shrink:0; color:#10100d;">2</span>
          <span data-field="workforce-2" style="font-size:13px;">1k+ 24/7 remote support</span>
        </div>
        <div style="display:flex; align-items:center; gap:10px;">
          <span style="width:24px; height:24px; border-radius:50%; background:#33ee69; font-size:12px; font-weight:700; display:flex; align-items:center; justify-content:center; flex-shrink:0; color:#10100d;">3</span>
          <span data-field="workforce-3" style="font-size:13px;">Virtually every zip code across US</span>
        </div>
        <div style="display:flex; align-items:center; gap:10px;">
          <span style="width:24px; height:24px; border-radius:50%; background:#33ee69; font-size:12px; font-weight:700; display:flex; align-items:center; justify-content:center; flex-shrink:0; color:#10100d;">4</span>
          <span data-field="workforce-4" style="font-size:13px;">&lt;1 hour response time</span>
        </div>
      </div>
    </div>
    <div style="border:1.5px solid #e5e5e5; border-radius:12px; padding:20px;">
      <div style="display:flex; align-items:center; gap:10px; margin-bottom:16px;">
        <h2 style="font-size:18px; font-weight:700;">AI Platform</h2>
        {icon_monitor}
        {icon_gear}
      </div>
      <div style="display:flex; flex-direction:column; gap:14px;">
        <div style="display:flex; align-items:center; gap:10px;">
          {icon_check}
          <span data-field="platform-1" style="font-size:13px;">Creates interactive SOPs from your docs</span>
        </div>
        <div style="display:flex; align-items:center; gap:10px;">
          {icon_check}
          <span data-field="platform-2" style="font-size:13px;">Automated robot CLI troubleshooting</span>
        </div>
        <div style="display:flex; align-items:center; gap:10px;">
          {icon_check}
          <span data-field="platform-3" style="font-size:13px;">Live escalation to HQ team with logs</span>
        </div>
        <div style="display:flex; align-items:center; gap:10px;">
          {icon_check}
          <span data-field="platform-4" style="font-size:13px;">Automated service report generation</span>
        </div>
        <div style="display:flex; align-items:center; gap:10px;">
          {icon_check}
          <span data-field="platform-5" style="font-size:13px;">Integrated with Slack, Jira, Salesforce, etc.</span>
        </div>
      </div>
    </div>
  </div>

  <!-- CTA -->
  <div style="margin-top:auto; padding:24px 40px 28px;">
    <h2 data-field="cta-text" style="font-size:22px; font-weight:700; font-style:italic; margin-bottom:14px;">Let&rsquo;s talk about a free pilot</h2>
    <div style="display:flex; gap:12px; flex-wrap:wrap;">
      <span style="display:inline-flex; align-items:center; gap:8px; padding:8px 20px; border:1.5px solid #33ee69; border-radius:24px; font-size:13px; font-weight:500;">
        {icon_phone} <span data-field="phone">857-498-9778</span>
      </span>
      <span style="display:inline-flex; align-items:center; gap:8px; padding:8px 20px; border:1.5px solid #33ee69; border-radius:24px; font-size:13px; font-weight:500;">
        {icon_envelope} <span data-field="email">aaryan@farhand.live</span>
      </span>
      <span style="display:inline-flex; align-items:center; gap:8px; padding:8px 20px; border:1.5px solid #33ee69; border-radius:24px; font-size:13px; font-weight:500;">
        {icon_globe} <span data-field="website">www.farhand.live</span>
      </span>
    </div>
  </div>

  <div style="width:100%; height:5px; background:#33ee69; flex-shrink:0;"></div>
</div>

<!-- ===== PAGE 2: US Field Service Coverage ===== -->
<div class="page" style="border-left:3px solid #33ee69; border-right:3px solid #33ee69;">

  <div style="width:100%; height:5px; background:#33ee69; flex-shrink:0;"></div>

  <div style="display:flex; align-items:center; justify-content:space-between; padding:20px 40px 0;">
    <img src="{logo_uri}" style="height:28px;" alt="Farhand">
    <span style="font-size:12px; font-weight:500; padding:4px 14px; border:1.5px solid #33ee69; border-radius:16px;">Field Service Coverage</span>
  </div>

  <div style="padding:24px 40px 0;">
    <h1 data-field="coverage-headline" style="font-size:28px; font-weight:800; text-align:center;">Nationwide Robotics Field Service</h1>
    <p style="font-size:14px; color:#555; text-align:center; margin-top:6px;">Certified technicians in virtually every zip code &mdash; ready in under an hour.</p>
  </div>

  <!-- US Map Image -->
  <div style="text-align:center; padding:16px 40px 0;">
    <img src="{map_uri}" style="width:100%; max-width:580px; height:auto;" alt="US Field Service Coverage Map">
  </div>

  <!-- Coverage Stats — Sources: Approved Copy + fieldnation.com -->
  <div style="display:grid; grid-template-columns:repeat(4,1fr); gap:14px; padding:20px 40px 0;">
    <div style="text-align:center; padding:14px 8px; background:#f5f5f5; border-radius:10px; border-top:3px solid #33ee69;">
      <div style="font-size:30px; font-weight:800;">20k+</div>
      <div style="font-size:12px; color:#555; margin-top:2px;">Trained field techs</div>
    </div>
    <div style="text-align:center; padding:14px 8px; background:#f5f5f5; border-radius:10px; border-top:3px solid #33ee69;">
      <div style="font-size:30px; font-weight:800;">1M+</div>
      <div style="font-size:12px; color:#555; margin-top:2px;">Work orders completed/yr</div>
    </div>
    <div style="text-align:center; padding:14px 8px; background:#f5f5f5; border-radius:10px; border-top:3px solid #33ee69;">
      <div style="font-size:30px; font-weight:800;">&lt;1hr</div>
      <div style="font-size:12px; color:#555; margin-top:2px;">Avg first response</div>
    </div>
    <div style="text-align:center; padding:14px 8px; background:#f5f5f5; border-radius:10px; border-top:3px solid #33ee69;">
      <div style="font-size:30px; font-weight:800;">98%</div>
      <div style="font-size:12px; color:#555; margin-top:2px;">Work order success rate</div>
    </div>
  </div>

  <!-- Network Highlights — Sources: Approved Copy + fieldnation.com -->
  <div style="padding:20px 40px 0;">
    <h3 style="font-size:16px; font-weight:700; margin-bottom:12px; padding-left:12px; border-left:3px solid #33ee69;">Our Network</h3>
    <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px;">
      <div style="border:1.5px solid #e5e5e5; border-radius:12px; padding:20px;">
        <div style="font-size:15px; font-weight:700; margin-bottom:12px;">Farhand + Field Nation</div>
        <div style="display:flex; flex-direction:column; gap:10px; font-size:13px;">
          <div style="display:flex; align-items:center; gap:10px;">
            {icon_check} <span>20k+ trained field technicians</span>
          </div>
          <div style="display:flex; align-items:center; gap:10px;">
            {icon_check} <span>1k+ 24/7 remote support staff</span>
          </div>
          <div style="display:flex; align-items:center; gap:10px;">
            {icon_check} <span>Virtually every zip code across US</span>
          </div>
          <div style="display:flex; align-items:center; gap:10px;">
            {icon_check} <span>7,000+ service companies on platform</span>
          </div>
        </div>
      </div>
      <div style="border:1.5px solid #e5e5e5; border-radius:12px; padding:20px;">
        <div style="font-size:15px; font-weight:700; margin-bottom:12px;">What You Get</div>
        <div style="display:flex; flex-direction:column; gap:10px; font-size:13px;">
          <div style="display:flex; align-items:center; gap:10px;">
            {icon_check} <span>AI-guided technicians trained on your robot</span>
          </div>
          <div style="display:flex; align-items:center; gap:10px;">
            {icon_check} <span>Screened, vetted, and insured techs</span>
          </div>
          <div style="display:flex; align-items:center; gap:10px;">
            {icon_check} <span>Real-time service reports and logs</span>
          </div>
          <div style="display:flex; align-items:center; gap:10px;">
            {icon_check} <span>All under Farhand&rsquo;s liability coverage</span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- How We Dispatch -->
  <div style="padding:20px 40px 0; margin-top:auto; margin-bottom:24px;">
    <h3 style="font-size:14px; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; color:#555; margin-bottom:12px;">How We Dispatch</h3>
    <div style="display:grid; grid-template-columns:1fr auto 1fr auto 1fr; align-items:center; gap:8px;">
      <div style="text-align:center; padding:14px; background:#f5f5f5; border-radius:10px;">
        <div style="font-size:24px; font-weight:800; color:#33ee69;">1</div>
        <div style="font-size:13px; font-weight:600; margin-top:4px;">Request</div>
        <div style="font-size:12px; color:#555;">Ticket auto-matched to nearest qualified tech</div>
      </div>
      <div style="font-size:20px; color:#33ee69;">&rarr;</div>
      <div style="text-align:center; padding:14px; background:#f5f5f5; border-radius:10px;">
        <div style="font-size:24px; font-weight:800; color:#33ee69;">2</div>
        <div style="font-size:13px; font-weight:600; margin-top:4px;">Dispatch</div>
        <div style="font-size:12px; color:#555;">Tech receives AI briefing + interactive SOP</div>
      </div>
      <div style="font-size:20px; color:#33ee69;">&rarr;</div>
      <div style="text-align:center; padding:14px; background:#f5f5f5; border-radius:10px;">
        <div style="font-size:24px; font-weight:800; color:#33ee69;">3</div>
        <div style="font-size:13px; font-weight:600; margin-top:4px;">Resolve</div>
        <div style="font-size:12px; color:#555;">On-site repair with real-time HQ support</div>
      </div>
    </div>
  </div>

  <div style="width:100%; height:5px; background:#33ee69; flex-shrink:0;"></div>
</div>

<!-- ===== PAGE 3: W2 vs Farhand Pricing ===== -->
<div class="page" style="border-left:3px solid #33ee69; border-right:3px solid #33ee69;">

  <div style="width:100%; height:5px; background:#33ee69; flex-shrink:0;"></div>

  <div style="display:flex; align-items:center; justify-content:space-between; padding:20px 40px 0;">
    <img src="{logo_uri}" style="height:28px;" alt="Farhand">
    <span style="font-size:12px; font-weight:500; padding:4px 14px; border:1.5px solid #33ee69; border-radius:16px;">Cost Comparison</span>
  </div>

  <div style="padding:24px 40px 0;">
    <h1 data-field="pricing-headline" style="font-size:26px; font-weight:800; border-left:4px solid #33ee69; padding-left:16px;">W-2 Employee vs. Farhand Field Support</h1>
    <p style="font-size:14px; color:#555; margin-top:6px;">The true cost of maintaining an in-house robotics field service team.</p>
  </div>

  <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px; padding:20px 40px 0;">
    <div style="background:#f5f5f5; border-radius:12px; padding:20px; border-top:4px solid #e5e5e5;">
      <div style="font-size:15px; font-weight:700; margin-bottom:14px; color:#555;">In-House W-2 Technician</div>
      <div style="display:flex; flex-direction:column; gap:8px; font-size:13px;">
        <div style="display:flex; justify-content:space-between;"><span>Base salary</span><span style="font-weight:600;">$65,000 &ndash; $85,000</span></div>
        <div style="display:flex; justify-content:space-between;"><span>Benefits &amp; insurance</span><span style="font-weight:600;">$18,000 &ndash; $25,000</span></div>
        <div style="display:flex; justify-content:space-between;"><span>Training &amp; certifications</span><span style="font-weight:600;">$5,000 &ndash; $10,000</span></div>
        <div style="display:flex; justify-content:space-between;"><span>Travel &amp; per diem</span><span style="font-weight:600;">$12,000 &ndash; $20,000</span></div>
        <div style="display:flex; justify-content:space-between;"><span>Equipment &amp; tools</span><span style="font-weight:600;">$3,000 &ndash; $5,000</span></div>
        <div style="display:flex; justify-content:space-between;"><span>Management overhead</span><span style="font-weight:600;">$8,000 &ndash; $15,000</span></div>
        <div style="border-top:2px solid #ddd; padding-top:8px; margin-top:4px; display:flex; justify-content:space-between;">
          <span style="font-weight:700;">Total per technician</span>
          <span style="font-weight:800; font-size:15px; color:#ef4444;">$111K &ndash; $160K/yr</span>
        </div>
      </div>
      <div style="font-size:12px; color:#888; margin-top:10px; font-style:italic;">Per technician. Most fleets need 2-5 techs for regional coverage.</div>
    </div>

    <div style="background:#10100d; border-radius:12px; padding:20px; color:#fff; border-top:4px solid #33ee69;">
      <div style="font-size:15px; font-weight:700; margin-bottom:14px; color:#33ee69;">Farhand Field Support</div>
      <div style="display:flex; flex-direction:column; gap:8px; font-size:13px;">
        <div style="display:flex; justify-content:space-between;"><span style="color:rgba(255,255,255,0.7);">Per-robot service plan</span><span style="font-weight:600;">$85 &ndash; $150/mo</span></div>
        <div style="display:flex; justify-content:space-between;"><span style="color:rgba(255,255,255,0.7);">Benefits &amp; insurance</span><span style="font-weight:600; color:#33ee69;">Included</span></div>
        <div style="display:flex; justify-content:space-between;"><span style="color:rgba(255,255,255,0.7);">Training &amp; certifications</span><span style="font-weight:600; color:#33ee69;">Included</span></div>
        <div style="display:flex; justify-content:space-between;"><span style="color:rgba(255,255,255,0.7);">Travel &amp; logistics</span><span style="font-weight:600; color:#33ee69;">Included</span></div>
        <div style="display:flex; justify-content:space-between;"><span style="color:rgba(255,255,255,0.7);">AI diagnostics platform</span><span style="font-weight:600; color:#33ee69;">Included</span></div>
        <div style="display:flex; justify-content:space-between;"><span style="color:rgba(255,255,255,0.7);">24/7 remote support</span><span style="font-weight:600; color:#33ee69;">Included</span></div>
        <div style="border-top:2px solid rgba(255,255,255,0.2); padding-top:8px; margin-top:4px; display:flex; justify-content:space-between;">
          <span style="font-weight:700;">Per robot annual cost</span>
          <span style="font-weight:800; font-size:15px; color:#33ee69;">$1,020 &ndash; $1,800/yr</span>
        </div>
      </div>
      <div style="font-size:12px; color:rgba(255,255,255,0.5); margin-top:10px; font-style:italic;">All-inclusive. No hidden costs. Scales with your fleet size.</div>
    </div>
  </div>

  <div style="text-align:center; padding:20px 40px 0;">
    <div style="display:inline-block; padding:16px 40px; background:#f0fdf4; border-radius:12px; border:2px solid #33ee69;">
      <span style="font-size:42px; font-weight:800; color:#166534;">30&ndash;65%</span>
      <div style="font-size:14px; font-weight:600; color:#555; margin-top:2px;">average cost reduction vs. in-house teams</div>
    </div>
  </div>

  <div style="padding:20px 40px 0;">
    <table style="width:100%; border-collapse:collapse; font-size:13px;">
      <thead>
        <tr style="background:#10100d; color:#fff;">
          <th style="padding:10px 14px; text-align:left; font-weight:600; border-radius:8px 0 0 0; width:40%;">Capability</th>
          <th style="padding:10px 14px; text-align:center; font-weight:600; width:30%;">In-House</th>
          <th style="padding:10px 14px; text-align:center; font-weight:600; background:#166534; border-radius:0 8px 0 0; width:30%;">Farhand</th>
        </tr>
      </thead>
      <tbody>
        <tr style="border-bottom:1px solid #e5e5e5;">
          <td style="padding:10px 14px; font-weight:500;">Scaling flexibility</td>
          <td style="padding:10px 14px; text-align:center; color:#555;">Months to hire</td>
          <td style="padding:10px 14px; text-align:center; background:#f0fdf4; font-weight:600; color:#166534;">Instant</td>
        </tr>
        <tr style="border-bottom:1px solid #e5e5e5;">
          <td style="padding:10px 14px; font-weight:500;">Geographic coverage</td>
          <td style="padding:10px 14px; text-align:center; color:#555;">Regional only</td>
          <td style="padding:10px 14px; text-align:center; background:#f0fdf4; font-weight:600; color:#166534;">Nationwide</td>
        </tr>
        <tr style="border-bottom:1px solid #e5e5e5;">
          <td style="padding:10px 14px; font-weight:500;">AI-powered SOPs</td>
          <td style="padding:10px 14px; text-align:center; color:#ef4444; font-weight:600;">&times;</td>
          <td style="padding:10px 14px; text-align:center; background:#f0fdf4; color:#166534; font-weight:600;">&check;</td>
        </tr>
        <tr style="border-bottom:1px solid #e5e5e5;">
          <td style="padding:10px 14px; font-weight:500;">24/7 availability</td>
          <td style="padding:10px 14px; text-align:center; color:#555;">Business hours</td>
          <td style="padding:10px 14px; text-align:center; background:#f0fdf4; font-weight:600; color:#166534;">24/7/365</td>
        </tr>
        <tr style="border-bottom:1px solid #e5e5e5;">
          <td style="padding:10px 14px; font-weight:500;">Upfront investment</td>
          <td style="padding:10px 14px; text-align:center; color:#555;">$100K+ per tech</td>
          <td style="padding:10px 14px; text-align:center; background:#f0fdf4; font-weight:600; color:#166534;">$0</td>
        </tr>
        <tr>
          <td style="padding:10px 14px; font-weight:500;">Time to deploy</td>
          <td style="padding:10px 14px; text-align:center; color:#555;">3-6 months</td>
          <td style="padding:10px 14px; text-align:center; background:#f0fdf4; font-weight:600; color:#166534;">1 week</td>
        </tr>
      </tbody>
    </table>
  </div>

  <div style="margin-top:auto; padding:20px 40px 24px;">
    <h2 style="font-size:20px; font-weight:700; font-style:italic; margin-bottom:12px;">Let&rsquo;s talk about a free pilot</h2>
    <div style="display:flex; gap:12px;">
      <span style="display:inline-flex; align-items:center; gap:8px; padding:8px 20px; border:1.5px solid #33ee69; border-radius:24px; font-size:13px; font-weight:500;">{icon_phone} 857-498-9778</span>
      <span style="display:inline-flex; align-items:center; gap:8px; padding:8px 20px; border:1.5px solid #33ee69; border-radius:24px; font-size:13px; font-weight:500;">{icon_envelope} aaryan@farhand.live</span>
      <span style="display:inline-flex; align-items:center; gap:8px; padding:8px 20px; border:1.5px solid #33ee69; border-radius:24px; font-size:13px; font-weight:500;">{icon_globe} www.farhand.live</span>
    </div>
  </div>

  <div style="width:100%; height:5px; background:#33ee69; flex-shrink:0;"></div>
</div>

</body>
</html>'''

with open(HTML_PATH, 'w', encoding='utf-8') as f:
    f.write(html)

print(f'Written {len(html)} bytes to Farhand.html')
print('Done!')
