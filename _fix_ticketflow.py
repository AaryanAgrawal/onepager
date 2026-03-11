#!/usr/bin/env python3
"""Narrow ticket flow boxes back to 120px — text is two lines now so it fits."""

with open('app/current.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Find the ticket flow SVG
old_start = content.find('viewBox="0 0 750 110"')
if old_start == -1:
    print("ERROR: Could not find ticket flow SVG")
    exit(1)

svg_start = content.rfind('<svg', 0, old_start)
svg_end = content.find('</svg>', old_start) + 6
print(f"Found ticket flow SVG: {svg_end - svg_start} chars")

# 5 boxes x 120px = 600. ViewBox 720. Remaining 120. Left margin 10.
# Gaps: (720 - 10 - 600) / 4 = 27.5px gaps — much more room for arrows
# Positions: 10, 157.5, 305, 452.5, 600 — round to nice numbers
# Let's use: 10, 158, 306, 454, 602 (gaps of 28px)
# Centers: 70, 228, 366, 514, 662

new_svg = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 110" style="width:100%; font-family:'DM Sans',sans-serif;">
        <defs>
          <marker id="tf-arr" markerWidth="6" markerHeight="5" refX="5" refY="2.5" orient="auto" markerUnits="strokeWidth">
            <polygon points="0 0, 6 2.5, 0 5" fill="#bbb"/>
          </marker>
          <filter id="tf-shadow" x="-10%" y="-10%" width="130%" height="140%">
            <feDropShadow dx="0" dy="1" stdDeviation="1.5" flood-color="#000" flood-opacity="0.08"/>
          </filter>
        </defs>

        <!-- === BOXES (120px wide, 28px gaps) === -->

        <!-- Detected -->
        <rect x="10" y="8" width="120" height="48" rx="10" fill="#FEF2F2" stroke="#EF4444" stroke-width="1.5" filter="url(#tf-shadow)"/>
        <text x="70" y="28" text-anchor="middle" font-size="12" font-weight="700" fill="#10100d">Detected</text>
        <text x="70" y="42" text-anchor="middle" font-size="10" font-weight="400" fill="#666">by remote team or</text>
        <text x="70" y="52" text-anchor="middle" font-size="10" font-weight="400" fill="#666">user alert</text>

        <!-- Triaged -->
        <rect x="158" y="8" width="120" height="48" rx="10" fill="#FFF4ED" stroke="#FF6821" stroke-width="1.5" filter="url(#tf-shadow)"/>
        <text x="218" y="28" text-anchor="middle" font-size="12" font-weight="700" fill="#10100d">Triaged</text>
        <text x="218" y="42" text-anchor="middle" font-size="10" font-weight="400" fill="#666">by technical</text>
        <text x="218" y="52" text-anchor="middle" font-size="10" font-weight="400" fill="#666">remote team</text>

        <!-- Escalated -->
        <rect x="306" y="8" width="120" height="48" rx="10" fill="#FFFBEB" stroke="#EAB308" stroke-width="1.5" filter="url(#tf-shadow)"/>
        <text x="366" y="28" text-anchor="middle" font-size="12" font-weight="700" fill="#10100d">Escalated</text>
        <text x="366" y="42" text-anchor="middle" font-size="10" font-weight="400" fill="#666">to your</text>
        <text x="366" y="52" text-anchor="middle" font-size="10" font-weight="400" fill="#666">engineering team</text>

        <!-- Dispatched -->
        <rect x="454" y="8" width="120" height="48" rx="10" fill="#e8f5ee" stroke="#009F4A" stroke-width="1.5" filter="url(#tf-shadow)"/>
        <text x="514" y="28" text-anchor="middle" font-size="12" font-weight="700" fill="#10100d">Dispatched</text>
        <text x="514" y="42" text-anchor="middle" font-size="10" font-weight="400" fill="#666">field technician</text>
        <text x="514" y="52" text-anchor="middle" font-size="10" font-weight="400" fill="#666">rapidly</text>

        <!-- Resolved -->
        <rect x="602" y="8" width="120" height="48" rx="10" fill="#e6ffe8" stroke="#33ee69" stroke-width="1.5" filter="url(#tf-shadow)"/>
        <text x="662" y="28" text-anchor="middle" font-size="12" font-weight="700" fill="#10100d">Resolved</text>
        <text x="662" y="42" text-anchor="middle" font-size="10" font-weight="400" fill="#666">and documented</text>

        <!-- === MAIN FLOW ARROWS (28px gaps) === -->
        <line x1="130" y1="32" x2="158" y2="32" stroke="#bbb" stroke-width="1.8" marker-end="url(#tf-arr)"/>
        <line x1="278" y1="32" x2="306" y2="32" stroke="#bbb" stroke-width="1.8" marker-end="url(#tf-arr)"/>
        <line x1="426" y1="32" x2="454" y2="32" stroke="#bbb" stroke-width="1.8" marker-end="url(#tf-arr)"/>
        <line x1="574" y1="32" x2="602" y2="32" stroke="#bbb" stroke-width="1.8" marker-end="url(#tf-arr)"/>

        <!-- === SHORTCUT ARROWS (90-degree bends) === -->

        <!-- Shortcut: Triaged -> Resolved (deeper track) -->
        <path d="M 218 56 L 218 94 L 662 94 L 662 56" fill="none" stroke="#bbb" stroke-width="1.5" stroke-dasharray="4 2" marker-end="url(#tf-arr)"/>

        <!-- Shortcut: Escalated -> Resolved (shallower track) -->
        <path d="M 366 56 L 366 78 L 662 78 L 662 56" fill="none" stroke="#bbb" stroke-width="1.5" stroke-dasharray="4 2" marker-end="url(#tf-arr)"/>
      </svg>'''

content = content[:svg_start] + new_svg + content[svg_end:]

with open('app/current.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Done — boxes back to 120px with 28px arrow gaps")
