# OnePager — Product Requirements Document

> **Purpose**: A local web tool that lets non-technical founders create beautiful, branded one-pager PDFs through a simple form interface with live visual preview. Built for Claude Code to implement in one shot. Helps startups reduce doc creation and design overhead so they can provide personalized, professional documents to each client.

---

## 1. Problem Statement

Startups need to produce customized one-pager sales documents for different customers, verticals, and service lines. Currently this requires manual Canva editing or designer involvement. The founder needs a tool where they can:

- Drop in information conversationally
- See a live visual preview that updates in real-time
- Iterate visually (drag, tweak, rearrange) without touching code
- Export a polished PDF
- Personalize each document with customer logos
- Maintain consistent company branding across all outputs

---

## 2. Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    LOCAL WEB APP                         │
│                                                         │
│  ┌──────────────┐    ┌───────────────┐    ┌──────────┐ │
│  │  Input Panel  │───▸│  Live Preview  │───▸│  Export   │ │
│  │  (left side)  │    │  (center/right)│    │  (PDF)   │ │
│  └──────────────┘    └───────────────┘    └──────────┘ │
│         │                    │                    │      │
│         ▼                    ▼                    ▼      │
│  ┌──────────────┐    ┌───────────────┐    ┌──────────┐ │
│  │ Form fields   │    │ HTML/CSS      │    │ Puppeteer│ │
│  │ Logo upload   │    │ rendered in   │    │ html→pdf │ │
│  │ Template pick │    │ iframe        │    │          │ │
│  └──────────────┘    └───────────────┘    └──────────┘ │
│                                                         │
│  Tech: Next.js 14 + shadcn/ui + Tailwind               │
│  PDF: Puppeteer (headless Chrome) printing HTML to PDF  │
│  Storage: Local filesystem (./outputs/)                 │
└─────────────────────────────────────────────────────────┘
```

### Core Pipeline

```
User Input (form/conversation)
       │
       ▼
Template Selection + Data Merge
       │
       ▼
Live HTML Preview (iframe, hot-reloads on every keystroke)
       │
       ▼
User iterates visually (edit fields → see changes instantly)
       │
       ▼
"Export PDF" button
       │
       ▼
Puppeteer renders the HTML page at exact dimensions → PDF
       │
       ▼
Save: PDF + HTML snapshot to ./outputs/{timestamp}-{customer}/
```

---

## 3. Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| Framework | **Next.js 14 (App Router)** | File-based routing, API routes for PDF generation, React Server Components |
| UI Components | **shadcn/ui** | Copy-paste components, Tailwind-native, professional look |
| Styling | **Tailwind CSS** | Utility-first, consistent with shadcn, easy theming |
| PDF Generation | **Puppeteer** | Headless Chrome renders HTML → PDF with exact CSS fidelity |
| Live Preview | **iframe** with `srcdoc` or local URL | Instant visual feedback, true WYSIWYG |
| State Management | **React state (useState/useReducer)** | Simple, no external deps needed |
| File Storage | **Local filesystem** | `./outputs/` directory for all exports |
| Fonts | **Google Fonts CDN** | Consistent typography across exports |
| Icons | **Lucide React** (comes with shadcn) | Clean iconography |

### Package Installation

```bash
# Initialize project
npx create-next-app@latest onepager --typescript --tailwind --eslint --app --src-dir
cd onepager

# shadcn/ui setup
npx shadcn@latest init
# Select: New York style, Slate base color, CSS variables: yes

# Install shadcn components needed
npx shadcn@latest add button input textarea label card tabs select dialog sheet separator badge toggle-group tooltip dropdown-menu accordion alert collapsible scroll-area slider switch

# PDF generation
npm install puppeteer

# File handling
npm install multer sharp

# Color picker
npm install react-colorful

# Utility
npm install clsx tailwind-merge
```

---

## 4. Design System — Brand Defaults

These are the **default** brand values. Replace with your own company's branding. The tool loads these as defaults but allows override per-document.

### Color Palette

```css
:root {
  /* Primary */
  --farhand-black: #0A0A0A;
  --farhand-white: #FFFFFF;
  --farhand-dark: #1A1A2E;

  /* Accent — extract from existing Canva designs */
  --farhand-accent: #3B82F6;       /* Blue — adjust after extracting from actual assets */
  --farhand-accent-light: #60A5FA;
  --farhand-accent-dark: #1D4ED8;

  /* Neutrals */
  --farhand-gray-50: #F9FAFB;
  --farhand-gray-100: #F3F4F6;
  --farhand-gray-200: #E5E7EB;
  --farhand-gray-300: #D1D5DB;
  --farhand-gray-500: #6B7280;
  --farhand-gray-700: #374151;
  --farhand-gray-900: #111827;

  /* Status */
  --farhand-green: #10B981;
  --farhand-amber: #F59E0B;
  --farhand-red: #EF4444;
}
```

### Typography

```css
/* Display / Headlines */
font-family: 'Inter', 'SF Pro Display', system-ui, sans-serif;
/* OR if extracting from Canva designs, use whatever font is found there */

/* Body */
font-family: 'Inter', system-ui, sans-serif;

/* Monospace (for technical specs) */
font-family: 'JetBrains Mono', 'Fira Code', monospace;
```

### Design Tokens for One-Pager Output

```
Page size: US Letter (8.5" × 11") — 816px × 1056px at 96dpi
           OR A4 (210mm × 297mm) — selectable
Margins: 0 (full bleed) — content handles its own padding
Safe area padding: 40px all sides
Max content width: 736px (816 - 80)
Column gap: 20px
Section gap: 24px
Border radius: 8px (cards/boxes), 4px (badges/tags)
```

---

## 5. Application Screens & UI Layout

### 5.1 Main Application Layout

```
┌─────────────────────────────────────────────────────────────────┐
│  HEADER: Farhand One-Pager Generator                    [Export]│
├──────────────────────┬──────────────────────────────────────────┤
│                      │                                          │
│   INPUT PANEL        │        LIVE PREVIEW                      │
│   (scrollable)       │        (iframe, scaled to fit)           │
│                      │                                          │
│   ┌──────────────┐   │   ┌──────────────────────────────────┐   │
│   │ Template      │   │   │                                  │   │
│   │ Selector      │   │   │   [Actual one-pager renders     │   │
│   └──────────────┘   │   │    here in real-time as user     │   │
│                      │   │    types in the input panel]      │   │
│   ┌──────────────┐   │   │                                  │   │
│   │ Brand &       │   │   │                                  │   │
│   │ Customer      │   │   │                                  │   │
│   └──────────────┘   │   │                                  │   │
│                      │   │                                  │   │
│   ┌──────────────┐   │   │                                  │   │
│   │ Content       │   │   │                                  │   │
│   │ Sections      │   │   │                                  │   │
│   │ (accordion)   │   │   │                                  │   │
│   └──────────────┘   │   │                                  │   │
│                      │   │                                  │   │
│   ┌──────────────┐   │   └──────────────────────────────────┘   │
│   │ Pricing       │   │                                          │
│   │ Section       │   │   [Zoom: 50% 75% 100%] [Fit]            │
│   └──────────────┘   │                                          │
│                      │                                          │
│   ┌──────────────┐   │   ┌──────────────────────────────────┐   │
│   │ CTA / Footer  │   │   │ VERSION HISTORY BAR              │   │
│   └──────────────┘   │   │ v1 → v2 → v3 (clickable saves)  │   │
│                      │   └──────────────────────────────────┘   │
├──────────────────────┴──────────────────────────────────────────┤
│  FOOTER: [Save Draft] [Save as HTML] [Export PDF] [New]         │
└─────────────────────────────────────────────────────────────────┘
```

**Panel ratio**: Left input panel = 380px fixed width. Preview takes remaining space.

### 5.2 Input Panel — Detailed Sections

The input panel uses shadcn `Accordion` components. Each section is collapsible. Sections auto-open as the user progresses.

#### Section 1: Template Selection

```
┌─────────────────────────────┐
│ 📐 Template                  │
│                              │
│ ┌─────┐ ┌─────┐ ┌─────┐    │
│ │     │ │     │ │     │    │
│ │ Tel │ │Data │ │Field│    │
│ │ eop │ │Coll │ │ Ops │    │
│ │     │ │     │ │     │    │
│ └─────┘ └─────┘ └─────┘    │
│   ○        ○        ○       │
│                              │
│ ┌─────┐ ┌─────┐ ┌─────┐    │
│ │Blank│ │Cust │ │Import│   │
│ │     │ │ om  │ │ PDF │    │
│ └─────┘ └─────┘ └─────┘    │
│                              │
│ [Upload existing PDF/HTML    │
│  to extract layout]          │
└─────────────────────────────┘
```

- **Pre-built templates**: Teleoperation, Data Collection, Field Ops, Technical Support, Custom
- **Import**: Upload an existing PDF or HTML one-pager; the tool extracts the layout structure, colors, and fonts to use as a starting point
- Each template thumbnail should be a small preview of the actual layout

#### Section 2: Brand & Customer

```
┌─────────────────────────────┐
│ 🎨 Brand & Customer          │
│                              │
│ Your Company                 │
│ ┌───────────────────────┐    │
│ │ Logo: [Upload] [Clear]│    │
│ └───────────────────────┘    │
│ Company Name: [Farhand    ]  │
│ Tagline:     [Your teleop ]  │
│ Email:       [aaryan@far  ]  │
│ Phone:       [(857) 498   ]  │
│ Website:     [farhand.live]  │
│                              │
│ ── Customer (optional) ────  │
│ ┌───────────────────────┐    │
│ │ Logo: [Upload] [Clear]│    │
│ └───────────────────────┘    │
│ Customer Name: [          ]  │
│ ☑ Show "Prepared for" header │
│                              │
│ ── Colors ─────────────────  │
│ Primary:   [■ #0A0A0A] pick  │
│ Accent:    [■ #3B82F6] pick  │
│ Background:[■ #FFFFFF] pick  │
│                              │
│ [Reset to brand defaults]  │
└─────────────────────────────┘
```

- Logo uploads accept PNG, SVG, JPG
- Color pickers use `react-colorful` inline
- "Reset to brand defaults" restores the brand tokens from Section 4

#### Section 3: Hero / Header

```
┌─────────────────────────────┐
│ 📝 Header                    │
│                              │
│ Headline:                    │
│ ┌───────────────────────┐    │
│ │ Your data collection   │    │
│ │ partner                │    │
│ └───────────────────────┘    │
│                              │
│ Subheadline:                 │
│ ┌───────────────────────┐    │
│ │ We collect training    │    │
│ │ data through teleop... │    │
│ └───────────────────────┘    │
│                              │
│ Robot Types (tags):          │
│ [AMRs & AVs] [x]            │
│ [Mobile Manipulators] [x]    │
│ [Humanoids] [x]             │
│ [+ Add tag]                  │
└─────────────────────────────┘
```

#### Section 4: Value Propositions (Columns)

```
┌─────────────────────────────┐
│ 💎 Value Propositions        │
│                              │
│ Number of columns: [3 ▾]    │
│                              │
│ ── Column 1 ───────────────  │
│ Icon: [📊 ▾] (emoji picker)  │
│ Title: [Annotated datasets]  │
│ Description:                 │
│ [Labeled trajectories,      ]│
│ [edge cases, failure modes  ]│
│ Badge: [Real-world edge     ]│
│        [cases at scale      ]│
│                              │
│ ── Column 2 ───────────────  │
│ Icon: [📁 ▾]                 │
│ Title: [Your formats, your  ]│
│        [pipeline            ]│
│ Description:                 │
│ [ROS bags, MP4, JSON,       ]│
│ [custom schema integration  ]│
│ Badge: [Every format        ]│
│        [supported           ]│
│                              │
│ ── Column 3 ───────────────  │
│ Icon: [📈 ▾]                 │
│ Title: [Continuous          ]│
│        [improvement         ]│
│ Description:                 │
│ [<0.2% intervention rate    ]│
│ [achievable                 ]│
│ Badge: [Labeled from day one]│
│                              │
│ [+ Add Column] [- Remove]    │
└─────────────────────────────┘
```

#### Section 5: Pricing

```
┌─────────────────────────────┐
│ 💰 Pricing                   │
│                              │
│ Section Title:               │
│ [Data Collection Pricing   ] │
│                              │
│ Pricing Model: [Per Hour ▾]  │
│   Options: Per Hour, Per     │
│   Robot, Monthly, Custom     │
│                              │
│ ── Tiers ────────────────── │
│                              │
│ Tier 1:                      │
│ Name:  [Starter           ]  │
│ Price: [$15               ]  │
│ Unit:  [/operator/hr      ]  │
│ Details: [1-2 operators   ]  │
│                              │
│ Tier 2:                      │
│ Name:  [Growth            ]  │
│ Price: [$13.90            ]  │
│ Unit:  [/operator/hr      ]  │
│ Details: [3-5 operators   ]  │
│                              │
│ Tier 3:                      │
│ Name:  [Scale             ]  │
│ Price: [$12.50            ]  │
│ Unit:  [/operator/hr      ]  │
│ Details: [6+ operators    ]  │
│                              │
│ Footer note:                 │
│ [All inclusive. Data         ]│
│ [delivery included.         ]│
│                              │
│ [+ Add Tier] [- Remove]     │
│                              │
│ ☐ Show pricing comparison    │
│   (vs in-house cost)         │
└─────────────────────────────┘
```

#### Section 6: Team / Operations

```
┌─────────────────────────────┐
│ 👥 Team                      │
│                              │
│ Section Title:               │
│ [Your Dedicated Team       ] │
│                              │
│ ── Roles ────────────────── │
│ Role 1: [Data QA Leads    ]  │
│ Role 2: [Annotation Specs ]  │
│ Role 3: [Pipeline Engineers]  │
│ [+ Add Role]                 │
│                              │
│ ── Highlights ─────────────  │
│ [Trained on your robot    ]  │
│ [LATAM + India centers    ]  │
│ [24/7 coverage available  ]  │
│ [+ Add highlight]            │
└─────────────────────────────┘
```

#### Section 7: Security / Trust

```
┌─────────────────────────────┐
│ 🔒 Security & Trust          │
│                              │
│ Section Title:               │
│ [Data Security             ] │
│                              │
│ Items (icon + text pairs):   │
│ 🔐 [End-to-end encryption ]  │
│ 💾 [Dedicated storage      ]  │
│ 📋 [NDA/DPA included      ]  │
│ [+ Add item]                 │
│                              │
│ ☑ Show security badge/seal   │
└─────────────────────────────┘
```

#### Section 8: CTA / Footer

```
┌─────────────────────────────┐
│ 🚀 Call to Action             │
│                              │
│ CTA Text:                    │
│ [Start collecting in 3 days.]│
│ [Let's talk.                ]│
│                              │
│ Contact Email:               │
│ [aaryan@farhand.live       ] │
│                              │
│ Contact Phone:               │
│ [(857) 498-9778            ] │
│                              │
│ Website:                     │
│ [farhand.live              ] │
│                              │
│ ☑ Include QR code to website │
└─────────────────────────────┘
```

---

## 6. Template System

### 6.1 Template Structure

Each template is a standalone HTML file with CSS that renders at exactly US Letter dimensions. Templates use CSS custom properties (variables) for all colors, fonts, and spacing so the app can override them dynamically.

```
/templates/
├── teleoperation.html       # Teleoperation services one-pager
├── data-collection.html     # Data collection one-pager
├── field-ops.html           # Field operations one-pager
├── technical-support.html   # Customer technical support one-pager
├── blank.html               # Minimal starter template
└── _base.css                # Shared base styles
```

### 6.2 Template HTML Structure

Every template follows this semantic structure. The app injects data via CSS variables and data attributes.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=816, initial-scale=1">
  <link rel="stylesheet" href="_base.css">
  <style>
    /* Template-specific overrides */
    :root {
      --primary: var(--user-primary, #0A0A0A);
      --accent: var(--user-accent, #3B82F6);
      --bg: var(--user-bg, #FFFFFF);
      --font-heading: var(--user-font-heading, 'Inter', sans-serif);
      --font-body: var(--user-font-body, 'Inter', sans-serif);
    }

    @page {
      size: 8.5in 11in;
      margin: 0;
    }

    body {
      width: 8.5in;
      height: 11in;
      margin: 0;
      padding: 0;
      overflow: hidden;
      font-family: var(--font-body);
      color: var(--primary);
      background: var(--bg);
    }

    .page {
      width: 100%;
      height: 100%;
      padding: 40px;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
  </style>
</head>
<body>
  <div class="page">

    <!-- HEADER SECTION -->
    <header class="header">
      <div class="header-logos">
        <img class="logo-company" src="{{companyLogo}}" alt="Company Logo">
        <img class="logo-customer" src="{{customerLogo}}" alt="Customer Logo">
      </div>
      <div class="header-text">
        <h1 class="headline">{{headline}}</h1>
        <p class="subheadline">{{subheadline}}</p>
      </div>
      <div class="header-tags">
        {{#each robotTypes}}
        <span class="tag">{{this}}</span>
        {{/each}}
      </div>
    </header>

    <!-- VALUE PROPOSITIONS -->
    <section class="value-props">
      {{#each valueProps}}
      <div class="value-card">
        <div class="value-icon">{{icon}}</div>
        <h3 class="value-title">{{title}}</h3>
        <p class="value-desc">{{description}}</p>
        <span class="value-badge">{{badge}}</span>
      </div>
      {{/each}}
    </section>

    <!-- PRICING -->
    <section class="pricing">
      <h2 class="section-title">{{pricingTitle}}</h2>
      <div class="pricing-tiers">
        {{#each tiers}}
        <div class="tier-card">
          <span class="tier-name">{{name}}</span>
          <span class="tier-price">{{price}}</span>
          <span class="tier-unit">{{unit}}</span>
          <span class="tier-details">{{details}}</span>
        </div>
        {{/each}}
      </div>
      <p class="pricing-note">{{pricingNote}}</p>
    </section>

    <!-- TEAM -->
    <section class="team">
      <h2 class="section-title">{{teamTitle}}</h2>
      <div class="team-roles">
        {{#each roles}}
        <span class="role-tag">{{this}}</span>
        {{/each}}
      </div>
      <div class="team-highlights">
        {{#each highlights}}
        <div class="highlight">✓ {{this}}</div>
        {{/each}}
      </div>
    </section>

    <!-- SECURITY -->
    <section class="security">
      <h2 class="section-title">{{securityTitle}}</h2>
      <div class="security-items">
        {{#each securityItems}}
        <div class="security-item">
          <span class="security-icon">{{icon}}</span>
          <span>{{text}}</span>
        </div>
        {{/each}}
      </div>
    </section>

    <!-- CTA / FOOTER -->
    <footer class="cta">
      <p class="cta-text">{{ctaText}}</p>
      <div class="cta-contact">
        <span>{{email}}</span>
        <span>{{phone}}</span>
        <span>{{website}}</span>
      </div>
    </footer>

  </div>
</body>
</html>
```

### 6.3 Template Rendering Approach

The app does NOT use a template engine at runtime. Instead, it:

1. Reads the template HTML as a string
2. Builds a React component that generates equivalent HTML with user data injected
3. Renders this into an iframe via `srcdoc`
4. For PDF export, writes the final HTML to a temp file and uses Puppeteer to print it

This means the "template" is really a **React component** that outputs the same HTML structure with dynamic data. The HTML template files serve as the reference design that gets translated into React.

**Alternative simpler approach**: Use string interpolation directly. Store template as HTML string, replace `{{placeholders}}` with user data, set as iframe `srcdoc`. This is simpler and recommended for v1.

---

## 7. Live Preview System

### 7.1 How It Works

```
User types in input panel
       │
       ▼
React state updates (onChange handler)
       │
       ▼
useEffect triggers HTML regeneration
       │
       ▼
Template HTML string rebuilt with new data
       │
       ▼
iframe srcdoc attribute updated
       │
       ▼
Browser re-renders iframe content instantly
```

### 7.2 Preview Component

```tsx
// PreviewPanel.tsx
export function PreviewPanel({ data, template }: Props) {
  const [zoom, setZoom] = useState(0.65); // Scale to fit panel
  const htmlContent = useMemo(() => renderTemplate(template, data), [template, data]);

  return (
    <div className="preview-container">
      {/* Zoom controls */}
      <div className="preview-toolbar">
        <Button variant="outline" size="sm" onClick={() => setZoom(0.5)}>50%</Button>
        <Button variant="outline" size="sm" onClick={() => setZoom(0.75)}>75%</Button>
        <Button variant="outline" size="sm" onClick={() => setZoom(1)}>100%</Button>
      </div>

      {/* Scaled iframe */}
      <div className="preview-frame" style={{
        transform: `scale(${zoom})`,
        transformOrigin: 'top center',
        width: '816px',   // US Letter width at 96dpi
        height: '1056px', // US Letter height at 96dpi
      }}>
        <iframe
          srcDoc={htmlContent}
          style={{ width: '100%', height: '100%', border: 'none' }}
          title="One-Pager Preview"
        />
      </div>
    </div>
  );
}
```

### 7.3 Debouncing

To prevent janky re-renders on every keystroke:

```tsx
import { useDebouncedValue } from './hooks/useDebouncedValue';

function App() {
  const [formData, setFormData] = useState(defaultData);
  const debouncedData = useDebouncedValue(formData, 150); // 150ms delay

  return (
    <div className="app-layout">
      <InputPanel data={formData} onChange={setFormData} />
      <PreviewPanel data={debouncedData} template={selectedTemplate} />
    </div>
  );
}
```

---

## 8. PDF Export System

### 8.1 Server-Side PDF Generation (API Route)

```
POST /api/export-pdf
Body: { html: string, filename: string }
Response: PDF file download
```

### 8.2 Implementation

```typescript
// app/api/export-pdf/route.ts
import puppeteer from 'puppeteer';
import { writeFileSync, mkdirSync } from 'fs';
import path from 'path';

export async function POST(request: Request) {
  const { html, filename, customerName } = await request.json();

  // Create output directory
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const slug = customerName ? customerName.toLowerCase().replace(/\s+/g, '-') : 'draft';
  const outputDir = path.join(process.cwd(), 'outputs', `${timestamp}-${slug}`);
  mkdirSync(outputDir, { recursive: true });

  // Save HTML snapshot
  writeFileSync(path.join(outputDir, `${filename}.html`), html);

  // Launch Puppeteer and generate PDF
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0' });

  const pdfBuffer = await page.pdf({
    format: 'Letter',
    printBackground: true,        // CRITICAL: preserves background colors
    preferCSSPageSize: true,       // Respect @page CSS
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
  });

  await browser.close();

  // Save PDF
  const pdfPath = path.join(outputDir, `${filename}.pdf`);
  writeFileSync(pdfPath, pdfBuffer);

  // Return PDF as download
  return new Response(pdfBuffer, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${filename}.pdf"`,
    },
  });
}
```

### 8.3 Critical Puppeteer Settings for Accurate PDF

```typescript
// These settings ensure the PDF matches the live preview exactly:
const pdfOptions = {
  format: 'Letter',              // 8.5" × 11"
  printBackground: true,         // WITHOUT THIS, all backgrounds disappear
  preferCSSPageSize: true,       // Uses @page { size: } from CSS
  margin: {                      // Zero margins (template handles padding)
    top: '0',
    right: '0',
    bottom: '0',
    left: '0'
  },
  displayHeaderFooter: false,    // No browser chrome
  scale: 1,                      // No scaling
};

// Before generating PDF, inject print-specific CSS:
await page.addStyleTag({
  content: `
    @media print {
      body { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
      * { break-inside: avoid; }
    }
  `
});

// Wait for fonts and images to load:
await page.evaluateHandle('document.fonts.ready');
await page.waitForSelector('img', { timeout: 5000 }).catch(() => {}); // Don't fail if no images
```

---

## 9. Version History & Saving

### 9.1 Auto-Save

Every time the user clicks "Save Draft" or "Export PDF", the app saves:

```
./outputs/
├── 2026-03-01T14-30-00-acme-robotics/
│   ├── one-pager.html          # Full standalone HTML (can open in any browser)
│   ├── one-pager.pdf           # Exported PDF
│   └── metadata.json           # Form data + settings
├── 2026-03-01T15-45-00-acme-robotics/
│   ├── one-pager.html
│   ├── one-pager.pdf
│   └── metadata.json
└── 2026-03-02T09-00-00-boston-dynamics/
    ├── one-pager.html
    └── metadata.json           # Draft only, no PDF yet
```

### 9.2 metadata.json Structure

```json
{
  "version": "1.0",
  "createdAt": "2026-03-01T14:30:00Z",
  "template": "data-collection",
  "customerName": "Acme Robotics",
  "formData": {
    "headline": "Your data collection partner",
    "subheadline": "We collect training data...",
    "robotTypes": ["AMRs & AVs", "Mobile Manipulators", "Humanoids"],
    "valueProps": [...],
    "pricing": {...},
    "team": {...},
    "security": {...},
    "cta": {...}
  },
  "brandSettings": {
    "primaryColor": "#0A0A0A",
    "accentColor": "#3B82F6",
    "bgColor": "#FFFFFF",
    "companyLogo": "farhand-logo.png",
    "customerLogo": "acme-logo.png"
  }
}
```

### 9.3 Loading Previous Versions

The app shows a "Recent" dropdown in the header that lists all saved versions from `./outputs/`. Clicking one loads the `metadata.json` back into the form, restoring the exact state.

---

## 10. Design Extraction from Existing Assets

### 10.1 PDF Import

When the user uploads an existing PDF one-pager:

1. Convert PDF to image using Puppeteer or `pdf2image`
2. Display the image as a reference beside the editor
3. The user manually enters the content (v1 — no OCR needed)
4. **Color extraction**: Use `sharp` to sample dominant colors from the PDF image

```typescript
// Extract dominant colors from uploaded PDF/image
import sharp from 'sharp';

async function extractColors(imagePath: string): Promise<string[]> {
  const { dominant } = await sharp(imagePath)
    .resize(100, 100, { fit: 'cover' })
    .stats();

  return [
    rgbToHex(dominant.r, dominant.g, dominant.b),
    // Sample additional regions for accent colors
  ];
}
```

### 10.2 Design Element Extraction (Future Enhancement)

For v2, could add:
- OCR to auto-fill text fields from uploaded PDFs
- Font detection from PDF metadata
- Layout grid detection for automatic template matching

---

## 11. File Structure

```
onepager/
├── src/
│   ├── app/
│   │   ├── layout.tsx                 # Root layout with sidebar
│   │   ├── page.tsx                   # Main editor page
│   │   ├── api/
│   │   │   ├── export-pdf/
│   │   │   │   └── route.ts           # PDF generation endpoint
│   │   │   ├── save-draft/
│   │   │   │   └── route.ts           # Save HTML + metadata
│   │   │   ├── upload-logo/
│   │   │   │   └── route.ts           # Logo upload handler
│   │   │   └── list-versions/
│   │   │       └── route.ts           # List saved outputs
│   │   └── globals.css                # Tailwind + shadcn globals
│   ├── components/
│   │   ├── ui/                        # shadcn components (auto-generated)
│   │   ├── editor/
│   │   │   ├── InputPanel.tsx         # Left panel with all form sections
│   │   │   ├── PreviewPanel.tsx       # Right panel with iframe preview
│   │   │   ├── TemplateSelector.tsx   # Template grid selector
│   │   │   ├── BrandSection.tsx       # Brand & customer inputs
│   │   │   ├── HeroSection.tsx        # Header/headline inputs
│   │   │   ├── ValuePropsSection.tsx  # Value propositions editor
│   │   │   ├── PricingSection.tsx     # Pricing tier editor
│   │   │   ├── TeamSection.tsx        # Team/roles editor
│   │   │   ├── SecuritySection.tsx    # Security items editor
│   │   │   ├── CTASection.tsx         # CTA/footer editor
│   │   │   └── ExportBar.tsx          # Bottom action bar
│   │   └── shared/
│   │       ├── ColorPicker.tsx        # react-colorful wrapper
│   │       ├── LogoUpload.tsx         # Drag-and-drop logo uploader
│   │       ├── TagInput.tsx           # Tag input for robot types etc.
│   │       └── IconPicker.tsx         # Emoji/icon selector
│   ├── lib/
│   │   ├── templates/
│   │   │   ├── base.css              # Shared template styles
│   │   │   ├── teleoperation.ts      # Template: teleoperation
│   │   │   ├── data-collection.ts    # Template: data collection
│   │   │   ├── field-ops.ts          # Template: field ops
│   │   │   ├── tech-support.ts       # Template: technical support
│   │   │   └── blank.ts             # Template: minimal blank
│   │   ├── renderTemplate.ts         # Template data → HTML string
│   │   ├── defaultData.ts            # Default form values
│   │   ├── types.ts                  # TypeScript interfaces
│   │   └── utils.ts                  # Helpers (debounce, color utils)
│   └── hooks/
│       ├── useDebouncedValue.ts       # Debounce hook for preview
│       └── useAutoSave.ts            # Auto-save hook
├── public/
│   ├── logos/                         # Uploaded logos stored here
│   └── fonts/                         # Self-hosted fonts if needed
├── outputs/                           # All saved versions (gitignored)
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── next.config.mjs
```

---

## 12. TypeScript Interfaces

```typescript
// app/src/lib/types.ts

export interface OnePagerData {
  template: 'general' | 'saas' | 'agency' | 'consulting' | 'blank';

  brand: {
    companyName: string;
    tagline: string;
    email: string;
    phone: string;
    website: string;
    companyLogoUrl: string | null;  // base64 data URL
    customerName: string;
    customerLogoUrl: string | null;
    showPreparedFor: boolean;
    primaryColor: string;       // hex
    accentColor: string;        // hex
    backgroundColor: string;    // hex
    // fontHeading: string;     // Future
    // fontBody: string;        // Future
  };

  hero: {
    headline: string;
    subheadline: string;
    tags: string[];
  };

  valueProps: {
    columns: ValueProp[];
  };

  partners: {
    sectionTitle: string;
    showSection: boolean;
    logos: PartnerLogo[];
  };

  processFlow: {
    sectionTitle: string;
    showSection: boolean;
    pattern: 'linear' | 'hub-spoke' | 'before-after';
    steps: FlowStep[];
  };

  pricing: {
    sectionTitle: string;
    // model: string;           // Future
    tiers: PricingTier[];
    footerNote: string;
    // showComparison: boolean; // Future
  };

  team: {
    sectionTitle: string;
    roles: string[];
    highlights: string[];
  };

  security: {
    sectionTitle: string;
    items: SecurityItem[];
    // showBadge: boolean;      // Future
  };

  cta: {
    text: string;
    email: string;
    phone: string;
    website: string;
    // showQR: boolean;         // Future
  };
}

export interface ValueProp {
  id: string;
  icon: string;
  title: string;
  description: string;
  badge: string;
}

export interface PricingTier {
  id: string;
  name: string;
  price: string;
  unit: string;
  details: string;
  highlighted?: boolean;
}

export interface SecurityItem {
  id: string;
  icon: string;
  text: string;
}

export interface PartnerLogo {
  id: string;
  name: string;
  logoUrl: string;
}

export interface FlowStep {
  id: string;
  label: string;
  description: string;
}

export interface SavedVersion {
  id: string;
  createdAt: string;
  customerName: string;
  template: string;
  hasPDF: boolean;
  hasHTML: boolean;
}
```

---

## 13. Template CSS Design Principles

### 13.1 Layout Strategy

Each template should use CSS Grid or Flexbox to create a **fixed-height layout** that fits exactly on one page. Content sections flex to fill available space.

```css
/* Base layout — all templates */
.page {
  width: 8.5in;
  height: 11in;
  padding: 36px 40px;
  box-sizing: border-box;
  display: grid;
  grid-template-rows: auto 1fr auto auto auto auto;
  gap: 16px;
  overflow: hidden;
  font-family: var(--font-body);
  background: var(--bg);
  color: var(--primary);
}
```

### 13.2 Creative Design Direction

Templates should NOT look like generic corporate documents. They should feel designed and modern:

- **Use colored sidebars or accent strips** along the left edge
- **Rounded cards** with subtle shadows for value props
- **Badge/pill shapes** for tags and labels
- **Icon circles** with accent-colored backgrounds
- **Gradient headers** (subtle, from accent to accent-dark)
- **Typography hierarchy**: Big bold headline, medium subtitles, small body text, tiny labels
- **Whitespace is key** — don't cram; let sections breathe
- **Consistent border-radius**: 8px for cards, 4px for tags, 24px for pills
- **Subtle dividers** between sections (1px lines or spacing)

### 13.3 Example Template Variations

**Teleoperation Template**: Dark header bar with white text, three-column value cards with blue accent borders, clean pricing table, dark footer CTA bar.

**Data Collection Template**: Light background, green accent for "data" theme, grid-style layout for value props, horizontal pricing pills, tag-heavy design for formats/types.

**Field Ops Template**: Industrial feel, darker grays, monospace font accents for technical specs, badge/shield icons for security, bold CTA.

**Blank Template**: Minimal — just the structural grid with placeholder text. User fills everything from scratch.

---

## 14. Test Cases

### 14.1 Input Panel Tests

| # | Test Case | Steps | Expected Result |
|---|-----------|-------|-----------------|
| 1 | Default state loads | Open app | All brand defaults pre-filled, preview shows template |
| 2 | Text input updates preview | Type in headline field | Preview headline updates within 200ms |
| 3 | Color picker changes accent | Pick new accent color | All accent elements in preview update |
| 4 | Logo upload | Drop PNG onto upload zone | Logo appears in preview header |
| 5 | Add value prop column | Click "+ Add Column" | New column appears in both form and preview |
| 6 | Remove value prop column | Click "- Remove" on column 3 | Column removed from form and preview |
| 7 | Add pricing tier | Click "+ Add Tier" | New tier card appears in preview |
| 8 | Change template | Click different template thumbnail | Preview layout changes, form data preserved |
| 9 | Reset brand colors | Click "Reset to brand defaults" | Colors revert to brand defaults |
| 10 | Customer logo + "Prepared for" | Upload customer logo, check "Show Prepared for" | "Prepared for [Customer]" appears in preview |

### 14.2 Preview Tests

| # | Test Case | Steps | Expected Result |
|---|-----------|-------|-----------------|
| 11 | Zoom controls | Click 50%, 75%, 100% | Preview scales correctly |
| 12 | Content overflow | Enter very long text in all fields | Content truncates or shrinks, never bleeds past page |
| 13 | Empty fields | Clear all fields | Preview shows graceful empty state (no broken layout) |
| 14 | Special characters | Enter &, <, >, ", ' in text | Characters render correctly, no HTML injection |
| 15 | Multiple robot type tags | Add 6+ robot types | Tags wrap to second line within header |
| 16 | Long customer name | Enter "Massachusetts Institute of Technology Robotics Lab" | Name fits or truncates gracefully |

### 14.3 Export Tests

| # | Test Case | Steps | Expected Result |
|---|-----------|-------|-----------------|
| 17 | PDF export basic | Click "Export PDF" | PDF downloads, matches preview exactly |
| 18 | PDF backgrounds render | Export PDF with colored sections | All background colors present in PDF |
| 19 | PDF logos render | Export with company + customer logo | Both logos appear in PDF |
| 20 | HTML snapshot saved | Export PDF | HTML file also saved in outputs/ alongside PDF |
| 21 | Metadata saved | Export PDF | metadata.json contains all form data |
| 22 | PDF dimensions | Open exported PDF | Exactly 8.5" × 11" (US Letter) |
| 23 | PDF is single page | Export with full content | PDF is exactly 1 page, no overflow |
| 24 | Standalone HTML works | Open saved HTML in browser | Renders identically to preview (no external deps) |

### 14.4 Version History Tests

| # | Test Case | Steps | Expected Result |
|---|-----------|-------|-----------------|
| 25 | Save draft | Click "Save Draft" | Version appears in Recent dropdown |
| 26 | Load previous version | Click a version in Recent | All form fields populated with saved data |
| 27 | Multiple customers | Save versions for 3 different customers | All three appear in Recent, correctly labeled |
| 28 | New document | Click "New" | Form resets to defaults, blank slate |

### 14.5 Edge Cases

| # | Test Case | Steps | Expected Result |
|---|-----------|-------|-----------------|
| 29 | No internet | Disconnect network, use tool | Everything works (all local) |
| 30 | Large logo file | Upload 10MB PNG | Image compressed/resized, no crash |
| 31 | SVG logo | Upload SVG file | Renders correctly in preview and PDF |
| 32 | Rapid typing | Type quickly in multiple fields | No lag, no dropped characters |
| 33 | Browser resize | Resize window to various sizes | Layout adapts, preview remains centered |
| 34 | Simultaneous fields | Tab through all fields quickly | No race conditions, state consistent |

---

## 15. Running & Development

### 15.1 Local Development

```bash
# Start dev server
npm run dev
# Opens at http://localhost:3000

# The preview updates live as you edit
# PDF export requires Puppeteer (auto-downloads Chromium on first run)
```

### 15.2 First-Time Setup

```bash
# Clone and install
git clone <repo>
cd onepager
npm install

# Create outputs directory
mkdir -p outputs

# Start
npm run dev
```

### 15.3 Environment Variables

```env
# .env.local
NEXT_PUBLIC_COMPANY_NAME=Your Company Name
NEXT_PUBLIC_DEFAULT_EMAIL=hello@yourcompany.com
NEXT_PUBLIC_DEFAULT_PHONE=(555) 123-4567
NEXT_PUBLIC_DEFAULT_WEBSITE=yourcompany.com
```

---

## 16. User Flow (Step by Step)

This is the exact workflow the non-technical cofounder follows:

### Flow 1: Create a New One-Pager

```
1. Open http://localhost:3000
2. See the editor with brand defaults pre-loaded
3. Pick a template (e.g., "Data Collection")
   → Preview immediately shows the template with default content
4. Upload customer logo (optional)
   → Logo appears in preview header
5. Fill in headline, subheadline
   → Preview updates in real-time
6. Edit value propositions (change titles, descriptions, badges)
   → Preview cards update instantly
7. Set pricing tiers
   → Pricing section updates
8. Review the preview — looks good?
   → If not, keep editing. Changes reflect immediately.
9. Click "Export PDF"
   → PDF downloads + HTML saved to outputs/
10. Done. Share the PDF with the customer.
```

### Flow 2: Customize for a New Customer

```
1. Open the tool
2. Click "Recent" → select a previous version
   → All fields populated with previous data
3. Change customer name and upload new customer logo
4. Adjust any customer-specific content
5. Export new PDF
```

### Flow 3: Import from Existing PDF

```
1. Click "Import PDF" in template selector
2. Upload an existing PDF one-pager
3. Reference image appears alongside editor
4. Manually fill in fields to match (v1)
5. Optionally: tool extracts colors from PDF as suggestions
6. Edit, preview, export as usual
```

---

## 17. Implementation Priority

### Phase 1 — MVP (Build This First)

- [ ] Next.js project with shadcn setup
- [ ] Split-panel layout (input left, preview right)
- [ ] One template (data collection) as HTML string
- [ ] All input sections (Brand, Hero, Value Props, Pricing, Team, Security, CTA)
- [ ] Live preview via iframe srcdoc
- [ ] PDF export via Puppeteer
- [ ] HTML snapshot saving
- [ ] Logo upload (company + customer)
- [ ] Color picker for primary/accent/bg

### Phase 2 — Polish

- [ ] Additional templates (teleoperation, field-ops, tech-support, blank)
- [ ] Template thumbnails in selector
- [ ] Version history (list, load previous)
- [ ] Zoom controls on preview
- [ ] QR code generation for CTA
- [ ] "Prepared for [Customer]" header toggle
- [ ] Pricing comparison toggle (vs in-house)

### Phase 3 — Enhancements

- [ ] PDF import → color extraction
- [ ] PDF import → reference image display
- [ ] Auto-save on timer (every 30 seconds)
- [ ] Font selector (Google Fonts dropdown)
- [ ] Dark mode for the editor (not the output)
- [ ] Keyboard shortcuts (Cmd+S to save, Cmd+P to export)
- [ ] Drag-and-drop section reordering

---

## 18. Important Implementation Notes

### 18.1 Fonts in PDF

Google Fonts must be loaded via `<link>` in the template HTML head. Puppeteer will download and render them. Always include fallback fonts.

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
```

### 18.2 Images as Data URLs

When the user uploads a logo, convert it to a base64 data URL and embed it directly in the HTML. This ensures the PDF and standalone HTML both work without external file dependencies.

```typescript
// Convert uploaded file to data URL
const reader = new FileReader();
reader.onload = (e) => {
  const dataUrl = e.target.result as string; // "data:image/png;base64,..."
  setFormData(prev => ({ ...prev, brand: { ...prev.brand, companyLogoUrl: dataUrl } }));
};
reader.readAsDataURL(file);
```

### 18.3 Page Overflow Prevention

The template CSS must prevent any content from overflowing the single page. Use:

```css
.page {
  overflow: hidden;  /* Hard clip at page boundary */
}

/* Text truncation for long content */
.value-desc {
  display: -webkit-box;
  -webkit-line-clamp: 3;  /* Max 3 lines */
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Font size scaling for headlines */
.headline {
  font-size: clamp(24px, 4vw, 36px);
}
```

### 18.4 The HTML Must Be Fully Standalone

The saved HTML file must open correctly in any browser with zero dependencies:

- All CSS is inline (in `<style>` tags)
- All images are base64 data URLs
- All fonts loaded via Google Fonts CDN `<link>`
- No JavaScript required for display
- No external stylesheets

### 18.5 Accessibility

- All images have alt text
- Sufficient color contrast (check accent on white)
- Semantic HTML in templates
- Form labels in the editor

---

## 19. Summary for Claude Code

**What to build**: A Next.js 14 local web app with a split-panel editor (form inputs on left, live HTML preview on right) that generates branded one-pager PDFs for any startup or company.

**Key technical decisions**:
- shadcn/ui for all editor UI components
- iframe `srcdoc` for live preview (simple string interpolation, no template engine)
- Puppeteer for HTML → PDF (server-side API route)
- Base64 data URLs for all embedded images
- Local filesystem for saving outputs
- CSS custom properties for dynamic theming

**Design philosophy**:
- The editor UI should be clean and professional (shadcn default)
- The one-pager output should be creative, polished, and modern
- Every template should look distinctly designed, not generic
- Use bold typography, colored accents, card-based layouts, and proper whitespace

**User experience**:
- Type → see changes instantly
- One click to export PDF
- Dead simple for a non-technical person
- All state managed in React (no databases, no auth, no complexity)
