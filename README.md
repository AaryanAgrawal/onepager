# OnePager

Create branded sales documents by talking to Claude Code. Describe what you want, see it live in your browser, export as PDF.

---

## Setup

**Step 1.** Install [Node.js LTS](https://nodejs.org), [Git](https://git-scm.com/downloads), and [Google Chrome](https://www.google.com/chrome/) — use default settings.

**Step 2.** Open a terminal (Mac: Terminal, Windows: Git Bash) and run:

```
npm install -g @anthropic-ai/claude-code
```

**Step 3.** Get an Anthropic API key from [console.anthropic.com](https://console.anthropic.com/). Claude will ask for it the first time you run it.

**Step 4.** Start Claude:

```
claude
```

Claude clones the project, installs everything, starts the preview server, and asks what you'd like to create. Open Chrome to **http://localhost:3001** to see the live preview.

---

## Usage

Just talk to Claude:

> "Create a one-pager for Acme Corp about our field service"

> "Make a 3-page sales deck — overview, coverage, and pricing"

> "Change the headline to 'Transform Your Fleet Operations'"

The browser updates live as Claude works.

**Images** — drag any image onto the browser page, then tell Claude to use it.

**Save** — click Save in the top-right corner.

**Export PDF** — click Export PDF, enter a filename, and it downloads.

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
