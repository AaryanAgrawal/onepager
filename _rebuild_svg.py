#!/usr/bin/env python3
"""Rebuild wiring diagram v9: Wider spacing for text labels.
- Field Tech and Remote Support pushed LEFT for longer horizontal runs
- End User pushed RIGHT for longer horizontal run
- Text labels on horizontal segments: dispatches, guides, reports
- CloudWatch + Grafana in tool icons
"""

with open('app/current.html', 'r', encoding='utf-8') as f:
    content = f.read()

relay_idx = content.find('Farhand Relay')
svg_start = content.find('<svg', relay_idx)
depth = 0
pos = svg_start
svg_end = -1
while pos < len(content):
    no = content.find('<svg', pos + 1)
    nc = content.find('</svg>', pos + 1)
    if nc == -1: break
    if no != -1 and no < nc:
        depth += 1; pos = no
    else:
        if depth == 0: svg_end = nc + 6; break
        depth -= 1; pos = nc

if svg_end == -1:
    print("ERROR"); exit(1)

print(f"Found SVG: {svg_end - svg_start} chars")

# Phosphor fill paths (viewBox 0 0 256 256)
TERMINAL = "M216,40H40A16,16,0,0,0,24,56V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40ZM77.66,173.66a8,8,0,0,1-11.32-11.32L100.69,128,66.34,93.66A8,8,0,0,1,77.66,82.34l40,40a8,8,0,0,1,0,11.32ZM192,176H128a8,8,0,0,1,0-16h64a8,8,0,0,1,0,16Z"
SPARKLE = "M208,144a15.78,15.78,0,0,1-10.42,14.94l-51.65,19-19,51.61a15.92,15.92,0,0,1-29.88,0L78.07,178l-51.65-19a15.92,15.92,0,0,1,0-29.88l51.65-19,19-51.65a15.92,15.92,0,0,1,29.88,0l19,51.65,51.61,19A15.78,15.78,0,0,1,208,144ZM152,48h16V64a8,8,0,0,0,16,0V48h16a8,8,0,0,0,0-16H184V16a8,8,0,0,0-16,0V32H152a8,8,0,0,0,0,16Zm88,32h-8V72a8,8,0,0,0-16,0v8h-8a8,8,0,0,0,0,16h8v8a8,8,0,0,0,16,0V96h8a8,8,0,0,0,0-16Z"
BUILDINGS = "M239.73,208H224V96a16,16,0,0,0-16-16H164a4,4,0,0,0-4,4V208H144V32.41a16.43,16.43,0,0,0-6.16-13,16,16,0,0,0-18.72-.69L39.12,72A16,16,0,0,0,32,85.34V208H16.27A8.18,8.18,0,0,0,8,215.47,8,8,0,0,0,16,224H240a8,8,0,0,0,8-8.53A8.18,8.18,0,0,0,239.73,208ZM76,184a8,8,0,0,1-8.53,8A8.18,8.18,0,0,1,60,183.72V168.27A8.19,8.19,0,0,1,67.47,160,8,8,0,0,1,76,168Zm0-56a8,8,0,0,1-8.53,8A8.19,8.19,0,0,1,60,127.72V112.27A8.19,8.19,0,0,1,67.47,104,8,8,0,0,1,76,112Zm40,56a8,8,0,0,1-8.53,8,8.18,8.18,0,0,1-7.47-8.26V168.27a8.19,8.19,0,0,1,7.47-8.26,8,8,0,0,1,8.53,8Zm0-56a8,8,0,0,1-8.53,8,8.19,8.19,0,0,1-7.47-8.26V112.27a8.19,8.19,0,0,1,7.47-8.26,8,8,0,0,1,8.53,8Z"

new_svg = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 195" style="width:100%%; font-family:'DM Sans',sans-serif;">
      <defs>
        <filter id="rw-glow" x="-50%%" y="-50%%" width="200%%" height="200%%">
          <feDropShadow dx="0" dy="0" stdDeviation="8" flood-color="#33ee69" flood-opacity="0.55"/>
        </filter>
        <filter id="rw-glow-sm" x="-40%%" y="-40%%" width="180%%" height="180%%">
          <feDropShadow dx="0" dy="0" stdDeviation="5" flood-color="#33ee69" flood-opacity="0.4"/>
        </filter>
        <filter id="rw-shadow" x="-10%%" y="-10%%" width="130%%" height="140%%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#000000" flood-opacity="0.06"/>
        </filter>
        <marker id="rw-arr-o" markerWidth="6" markerHeight="5" refX="6" refY="2.5" orient="auto">
          <path d="M0,0 L6,2.5 L0,5" fill="#FF6821"/>
        </marker>
      </defs>

      <!-- ===== CONNECTORS (behind nodes) ===== -->

      <!-- Chain bars between circles -->
      <line x1="244" y1="90" x2="306" y2="90" stroke="#33ee69" stroke-width="4" stroke-linecap="round"/>
      <line x1="374" y1="90" x2="436" y2="90" stroke="#33ee69" stroke-width="4" stroke-linecap="round"/>

      <!-- Your Robot -> CLI (dashed SSH) -->
      <line x1="115" y1="90" x2="196" y2="90" stroke="#33ee69" stroke-width="2.5" stroke-dasharray="5,3"/>
      <text x="155" y="82" font-size="11" fill="#999" text-anchor="middle">SSH</text>

      <!-- HQ -> Your Engineers -->
      <line x1="484" y1="90" x2="560" y2="90" stroke="#33ee69" stroke-width="2.5"/>
      <text x="522" y="82" font-size="11" fill="#999" text-anchor="middle">escalates</text>

      <!-- TOP-LEFT: Field Tech -> Relay top (horizontal right, bend down) -->
      <path d="M235,19 L324,19 Q332,19 332,27 L332,58" stroke="#33ee69" stroke-width="2.5" fill="none"/>
      <text x="280" y="14" font-size="10" fill="#999" text-anchor="middle">dispatches</text>

      <!-- TOP-RIGHT: End User -> Relay top (orange, horizontal left, bend down) -->
      <path d="M470,17 L356,17 Q348,17 348,25 L348,58" stroke="#FF6821" stroke-width="2" fill="none" marker-end="url(#rw-arr-o)"/>
      <text x="413" y="12" font-size="10" fill="#999" text-anchor="middle">reports</text>

      <!-- BOTTOM-LEFT: Remote Support -> Relay bottom (horizontal right, bend up) -->
      <path d="M265,177 L332,177 Q340,177 340,169 L340,124" stroke="#33ee69" stroke-width="2.5" fill="none"/>
      <text x="299" y="172" font-size="10" fill="#999" text-anchor="middle">guides</text>

      <!-- BOTTOM-RIGHT: HQ -> Tools (dashed, vertical down, bend right) -->
      <path d="M460,114 L460,160 Q460,168 468,168 L488,168" stroke="#33ee69" stroke-width="1.5" stroke-dasharray="3,2" fill="none"/>
      <text x="470" y="148" font-size="10" fill="#999" text-anchor="start">integrates</text>

      <!-- ===== NODES ===== -->

      <!-- Your Robot -->
      <g filter="url(#rw-shadow)">
        <rect x="15" y="72" width="100" height="36" rx="10" fill="#FFFBEB" stroke="#EAB308" stroke-width="1.5"/>
      </g>
      <text x="65" y="95" font-size="12" fill="#10100d" text-anchor="middle">Your Robot</text>

      <!-- Relay CLI (Phosphor Terminal) -->
      <g filter="url(#rw-glow-sm)">
        <circle cx="220" cy="90" r="24" fill="#33ee69"/>
      </g>
      <g transform="translate(209, 79)">
        <svg width="22" height="22" viewBox="0 0 256 256" fill="#10100d">
          <path d="%s"/>
        </svg>
      </g>
      <text x="220" y="120" font-size="8" fill="#10100d" text-anchor="middle" font-weight="600">Relay CLI</text>

      <!-- RELAY center (Phosphor Sparkle) -->
      <g filter="url(#rw-glow)">
        <circle cx="340" cy="90" r="34" fill="#33ee69"/>
      </g>
      <g transform="translate(329, 71)">
        <svg width="22" height="22" viewBox="0 0 256 256" fill="#10100d">
          <path d="%s"/>
        </svg>
      </g>
      <text x="340" y="105" font-size="11" fill="#10100d" text-anchor="middle" font-weight="600">Relay</text>

      <!-- Relay HQ (Phosphor Buildings) -->
      <g filter="url(#rw-glow-sm)">
        <circle cx="460" cy="90" r="24" fill="#33ee69"/>
      </g>
      <g transform="translate(449, 79)">
        <svg width="22" height="22" viewBox="0 0 256 256" fill="#10100d">
          <path d="%s"/>
        </svg>
      </g>
      <text x="460" y="120" font-size="8" fill="#10100d" text-anchor="middle" font-weight="600">Relay HQ</text>

      <!-- End User (orange, top-right — pushed right for label space) -->
      <g filter="url(#rw-shadow)">
        <rect x="470" y="4" width="90" height="26" rx="10" fill="#FFF4ED" stroke="#FF6821" stroke-width="1.5"/>
      </g>
      <text x="515" y="22" font-size="11" fill="#FF6821" text-anchor="middle">End User</text>

      <!-- Your Engineers -->
      <g filter="url(#rw-shadow)">
        <rect x="560" y="72" width="130" height="36" rx="10" fill="#FFFBEB" stroke="#EAB308" stroke-width="1.5"/>
      </g>
      <text x="625" y="95" font-size="12" fill="#10100d" text-anchor="middle">Your Engineers</text>

      <!-- Field Tech (top-left — pushed further left for label space) -->
      <g filter="url(#rw-shadow)">
        <rect x="125" y="4" width="110" height="30" rx="10" fill="#ECFDF5" stroke="#33ee69" stroke-width="1.5"/>
      </g>
      <text x="180" y="24" font-size="12" fill="#10100d" text-anchor="middle">Field Tech</text>

      <!-- Remote Support (bottom-left — pushed left for label space) -->
      <g filter="url(#rw-shadow)">
        <rect x="135" y="162" width="130" height="30" rx="10" fill="#ECFDF5" stroke="#33ee69" stroke-width="1.5"/>
      </g>
      <text x="200" y="182" font-size="12" fill="#10100d" text-anchor="middle">Remote Support</text>

      <!-- Tool icons (bottom-right: CloudWatch, Grafana, Slack, Formant + ellipsis) -->
      <g opacity="0.35" transform="translate(495, 160)">
        <!-- CloudWatch -->
        <g transform="translate(0,-2)">
          <text x="7" y="5" font-size="5" fill="#FF9900" text-anchor="middle" font-weight="800" font-family="Arial,sans-serif">aws</text>
          <path d="M2,7 Q7,11 12,7" stroke="#FF9900" stroke-width="1.6" fill="none" stroke-linecap="round"/>
          <path d="M9.5,8 L12,7 L11.2,9.8" stroke="#FF9900" stroke-width="1.1" fill="none" stroke-linecap="round"/>
        </g>
        <!-- Grafana -->
        <g transform="translate(24,-2)">
          <circle cx="7" cy="6" r="5" fill="none" stroke="#F46800" stroke-width="1.3"/>
          <circle cx="7" cy="6" r="2" fill="#F46800"/>
          <line x1="7" y1="0" x2="7" y2="1.5" stroke="#F46800" stroke-width="1"/>
          <line x1="7" y1="10.5" x2="7" y2="12" stroke="#F46800" stroke-width="1"/>
          <line x1="1" y1="6" x2="2.5" y2="6" stroke="#F46800" stroke-width="1"/>
          <line x1="11.5" y1="6" x2="13" y2="6" stroke="#F46800" stroke-width="1"/>
        </g>
        <!-- Slack -->
        <g transform="translate(48,-2)">
          <rect x="3.5" y="0.5" width="2.2" height="11" rx="1.1" fill="#E01E5A"/>
          <rect x="8.3" y="0.5" width="2.2" height="11" rx="1.1" fill="#2EB67D"/>
          <rect x="0.5" y="3.5" width="11" height="2.2" rx="1.1" fill="#ECB22E" opacity="0.9"/>
          <rect x="0.5" y="8.3" width="11" height="2.2" rx="1.1" fill="#36C5F0" opacity="0.9"/>
        </g>
        <!-- Formant -->
        <g transform="translate(72,-2)">
          <rect x="1" y="0" width="12" height="12" rx="2.5" fill="#2563EB"/>
          <text x="7" y="10" font-size="9" fill="white" text-anchor="middle" font-weight="700" font-family="Arial,sans-serif">F</text>
        </g>
        <!-- Ellipsis -->
        <g transform="translate(96, 2)">
          <circle cx="0" cy="4" r="1.3" fill="#999"/>
          <circle cx="5" cy="4" r="1.3" fill="#999"/>
          <circle cx="10" cy="4" r="1.3" fill="#999"/>
        </g>
      </g>
    </svg>''' % (TERMINAL, SPARKLE, BUILDINGS)

content = content[:svg_start] + new_svg + content[svg_end:]

with open('app/current.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("SVG rebuilt — wider spacing with text labels on horizontal segments")
print(f"New SVG length: {len(new_svg)} chars")
