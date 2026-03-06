# OnePager

Create branded sales documents by talking to Claude Code. Describe what you want, see it live in your browser, export as PDF.

---

## First-Time Setup

**Step 1.** Install [Node.js LTS](https://nodejs.org) and [Git](https://git-scm.com/downloads) (use default settings for both).

**Step 2.** Install [Google Chrome](https://www.google.com/chrome/) (needed for PDF export).

**Step 3.** Get an Anthropic API key from [console.anthropic.com](https://console.anthropic.com/).

**Step 4.** Open a terminal (Mac: Terminal, Windows: Git Bash) and run:

```bash
npm install -g @anthropic-ai/claude-code
git clone https://github.com/AaryanAgrawal/onepager.git
cd onepager/app && npm install
```

Done. You only do this once.

---

## Every Time You Work

Open **two terminal windows**.

**Terminal 1** — start the preview:
```bash
cd onepager/app && npm run dev
```
Open Chrome to **http://localhost:3001**

**Terminal 2** — start Claude:
```bash
cd onepager && claude
```

Now talk to Claude. Type what you want:

> "Create a one-pager for Acme Corp about our field service"

> "Make a 3-page sales deck — overview, coverage, and pricing"

> "Change the headline to 'Transform Your Fleet Operations'"

> "Remove the pricing section and add a testimonial"

The browser updates live as Claude works.

---

## Images

Drag any image (PNG, JPG, SVG, WebP) onto the browser page. Then tell Claude:

> "Use the image I just uploaded as the hero image"

Or give Claude a file path:

> "Add the image at C:\Users\me\Downloads\photo.png to page 2"

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
| Stop the app | Press `Ctrl+C` in Terminal 1 |
| Stop Claude | Type `/exit` or press `Ctrl+C` in Terminal 2 |

Your documents are saved in the `documents/` folder and persist between sessions.

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| `command not found: npm` | Install [Node.js](https://nodejs.org) first |
| `command not found: claude` | Run `npm install -g @anthropic-ai/claude-code` |
| Preview says "No document yet" | Click a document in the sidebar, or ask Claude to create one |
| PDF export fails | Make sure Google Chrome is installed |
| Images not showing | Make sure image files are in `assets/` or `brand/` |
