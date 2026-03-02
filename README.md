# OnePager

Create beautiful, branded one-pager PDFs in minutes. No designer needed.

Built for startups that need to produce personalized sales documents for each client without the overhead of Canva, Figma, or hiring a designer.

## What It Does

- **Split-panel editor**: Form inputs on the left, live preview on the right
- **Real-time preview**: Every keystroke updates the document instantly
- **One-click PDF export**: Pixel-perfect PDFs via headless Chrome
- **Brand customization**: Upload logos, pick colors, set fonts — per document
- **Client personalization**: Add customer logos and "Prepared for" headers
- **Template library**: Pre-built templates for common startup verticals
- **Version history**: Auto-saves every export with full form state for easy re-use

## Quick Start

```bash
git clone https://github.com/AaryanPalve5/onepager.git
cd onepager
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and start creating.

## Requirements

- Node.js 18+
- Chrome or Chromium (for PDF export — Puppeteer auto-detects it)

## Usage

1. **Pick a template** — choose a pre-built layout or start blank
2. **Add your branding** — upload your logo, set your colors
3. **Fill in content** — headline, value props, pricing, team, CTA
4. **Preview live** — see every change reflected instantly
5. **Export PDF** — one click, pixel-perfect output
6. **Re-use** — load previous versions, swap customer details, export again

## Customizing Your Brand

Replace the example assets in `brand/` with your own:

| File | What to replace |
|------|----------------|
| `brand/logo-500x500.png` | Your square logo |
| `brand/logo-w-type-light.png` | Your full logo (light bg) |
| `brand/colors.css` | Your brand colors |

Then set your defaults in `.env.local`:

```env
NEXT_PUBLIC_COMPANY_NAME=Your Company
NEXT_PUBLIC_DEFAULT_EMAIL=hello@yourcompany.com
NEXT_PUBLIC_DEFAULT_PHONE=(555) 123-4567
NEXT_PUBLIC_DEFAULT_WEBSITE=yourcompany.com
```

## Building with Claude Code

This repo is designed to be built by [Claude Code](https://claude.com/claude-code) in a single session. Open it in Claude Code and say:

> "Read PRD.md and build the full application. Start with Phase 1 MVP."

The `CLAUDE.md` file gives Claude all the context it needs: tech stack, file structure, implementation rules, and anti-patterns. The `PRD.md` contains the complete specification with UI layouts, TypeScript interfaces, template designs, and test cases.

## Tech Stack

- **Next.js 14** (App Router)
- **shadcn/ui** + **Tailwind CSS**
- **Puppeteer** (HTML → PDF)
- **React state** (no external state management)
- **Local filesystem** (no database)

## License

MIT
