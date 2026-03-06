# OnePager

Create branded sales documents by talking to Claude Code. Describe what you want, see it live in your browser, export as PDF.

---

## Setup (One Time)

**Step 1.** Install [Node.js LTS](https://nodejs.org) and [Git](https://git-scm.com/downloads) — use default settings for both.

**Step 2.** Install [Google Chrome](https://www.google.com/chrome/) (needed for PDF export).

**Step 3.** Get an Anthropic API key from [console.anthropic.com](https://console.anthropic.com/).

**Step 4.** Open a terminal (Mac: Terminal, Windows: Git Bash) and run:

```bash
npm install -g @anthropic-ai/claude-code
git clone https://github.com/AaryanAgrawal/onepager.git
```

Done.

---

## Start Working

Open a terminal and run:

```bash
cd onepager
claude
```

Claude starts the preview server, opens everything, and asks what you'd like to create. Open Chrome to **http://localhost:3001** to see the live preview.

Just talk to Claude:

> "Create a one-pager for Acme Corp about our field service"

> "Make a 3-page sales deck — overview, coverage, and pricing"

> "Change the headline to 'Transform Your Fleet Operations'"

The browser updates live as Claude works.

---

## Images

Drag any image (PNG, JPG, SVG, WebP) onto the browser page, then tell Claude:

> "Use the image I just uploaded as the hero image"

---

## Save & Export

- **Save** — click Save in the top-right corner
- **Export PDF** — click Export PDF, enter a filename, and it downloads

---

## Quick Reference

| To do this | Do this |
|------------|---------|
| Create a document | Tell Claude what you want |
| Edit text quickly | Use the Quick Edit fields in the left sidebar |
| Load a saved document | Click it in the folder sidebar |
| Add an image | Drag it onto the browser page |
| Stop Claude | Type `/exit` or press `Ctrl+C` |

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| `command not found: npm` | Install [Node.js](https://nodejs.org) first |
| `command not found: claude` | Run `npm install -g @anthropic-ai/claude-code` |
| Preview says "No document yet" | Ask Claude to create a document or click one in the sidebar |
| PDF export fails | Make sure Google Chrome is installed |
