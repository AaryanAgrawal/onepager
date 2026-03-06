# OnePager

Create professional, branded sales documents by talking to Claude Code. You describe what you want — it builds the document, you see it live in your browser, tweak anything, and export as PDF.

No design skills needed. No coding needed.

---

## What You Can Do

- **Create sales one-pagers** — "make a one-pager for Acme Corp about our field service"
- **Build multi-page documents** — 3-page sales decks, pricing sheets, coverage maps
- **Edit text in the browser** — quick sidebar fields for headlines, descriptions, contact info
- **Drop in images** — drag photos, maps, or logos onto the page
- **Organize documents** — folder sidebar for all your company materials
- **Export PDFs** — one click, print-ready output

---

## Setup (One Time)

### 1. Install Node.js

Go to [nodejs.org](https://nodejs.org), download the **LTS** version, run the installer. Click through the defaults.

### 2. Install Git

Go to [git-scm.com](https://git-scm.com/downloads), download for your OS, install with defaults.

### 3. Install Google Chrome

You probably have this. If not, get it from [google.com/chrome](https://www.google.com/chrome/). Chrome is used for PDF export.

### 4. Install Claude Code

Open your terminal:
- **Mac**: search "Terminal" in Spotlight
- **Windows**: search "Git Bash" in the Start menu

Run this command:
```
npm install -g @anthropic-ai/claude-code
```

You need an Anthropic API key. Get one at [console.anthropic.com](https://console.anthropic.com/). When you first run `claude`, it will ask for this key.

### 5. Clone the project

In your terminal:
```bash
git clone https://github.com/AaryanAgrawal/onepager.git
cd onepager/app
npm install
```

That's it. You're set up.

---

## Daily Workflow

You'll need **two terminal windows** open. Keep both running while you work.

### Terminal 1 — Start the app

```bash
cd onepager/app
npm run dev
```

Open Chrome and go to **http://localhost:3001**

You'll see the OnePager workspace with a folder sidebar on the left and a document preview on the right.

### Terminal 2 — Start Claude Code

Open a second terminal window. Navigate to the project and start Claude:

```bash
cd onepager
claude
```

Claude reads the `CLAUDE.md` file automatically — it knows exactly how the system works, what your brand looks like, and how to build documents.

---

## Using Claude Code

### Creating a new document

Type what you want in plain English:

```
Create a one-pager for Acme Corp about our teleoperation service
```

```
Make a 3-page sales deck: page 1 is the overview, page 2 is coverage, page 3 is pricing
```

```
Create a one-pager from references/acme-brief.txt
```

Claude writes the HTML and your browser preview updates within half a second.

### Editing an existing document

Click a document in the left sidebar to load it, then tell Claude what to change:

```
Change the headline to "Transform Your Fleet Operations"
```

```
Remove the pricing section and add a testimonial quote
```

```
Make the stats numbers bigger
```

```
Swap the two columns in the workforce section
```

### Adding images

**Option A — Drag and drop** (easiest)

Drag any image file (PNG, JPG, SVG, WebP) from your computer onto the browser page. A green overlay appears — drop it. The image is saved to `assets/` and you'll see the template tag in the sidebar. Tell Claude:

```
Use the map image I just uploaded on page 2
```

**Option B — Tell Claude the file path**

If the image is already on your computer:

```
Add the image at C:\Users\me\Downloads\product-photo.png as the hero image
```

Claude will copy it to `assets/` and embed it.

### Quick Edit sidebar

The left sidebar shows text fields extracted from the current document:
- Headlines, descriptions, badge text
- Contact info (phone, email, website)
- Value proposition titles and descriptions

Type directly in these fields for instant changes — no need to ask Claude for small text tweaks.

### Saving documents

Click **Save** in the top-right corner. If you loaded a document from the folder sidebar, it saves back to that location. Otherwise it saves as a draft.

### Exporting PDFs

Click **Export PDF** in the top-right corner. Enter a filename. A print-ready PDF downloads to your computer.

---

## Managing Documents

### Folder sidebar

The left sidebar shows your document library organized in folders:

```
Client Communication/
Company Materials/
  Field/
    Farhand          (3 pages)
  Data/
  Teleop/
```

Click any document to load it into the editor. Click folders to expand/collapse.

### Adding new folders or documents

Tell Claude:

```
Create a new document called "Acme Proposal" in Client Communication/
```

Claude will create the HTML file and update the folder tree.

### Where files live

| What | Where |
|------|-------|
| Your documents | `onepager/documents/` |
| Brand logos | `onepager/brand/` |
| Uploaded images | `onepager/assets/` |
| Reference designs | `onepager/references/` |
| Working file | `onepager/app/current.html` |
| Exported PDFs | Downloaded to your computer |

---

## Tips

### Give Claude reference material

Drop example designs, screenshots, or text files into `references/`:
- **Images** — Claude will match the visual style
- **Text files** — Claude will extract content and build a document from it
- **URLs** — Add to `references/urls.txt` and Claude can fetch them

### Be specific about what you want

Good:
```
Create a one-pager for Boston Dynamics about our AMR field service.
Include: overview, 3 value props, workforce stats, AI platform features, and CTA.
Use the Farhand green style.
```

Less good:
```
Make something nice
```

### Use approved copy

The file `documents/Company Materials/Field/Approved Copy.html` contains all verified marketing text. Tell Claude:

```
Use the approved copy for the value propositions
```

### Common Claude Code commands

| What to type | What happens |
|-------------|-------------|
| `claude` | Start Claude Code |
| `/exit` or `Ctrl+C` | Stop Claude Code |
| `Ctrl+C` in Terminal 1 | Stop the web app |

---

## Stopping and Restarting

- **Stop the app**: Press `Ctrl+C` in Terminal 1
- **Stop Claude**: Type `/exit` or press `Ctrl+C` in Terminal 2
- **Restart**: Run the same commands again (`npm run dev` and `claude`)

Your documents are saved in the `documents/` folder and persist between sessions.

---

## Troubleshooting

### "command not found: claude"

You need to install Claude Code first:
```
npm install -g @anthropic-ai/claude-code
```

### "command not found: npm"

You need to install Node.js first. Go to [nodejs.org](https://nodejs.org).

### Preview shows "No document yet"

Either:
1. Click a document in the folder sidebar to load one, or
2. Ask Claude to create a new document

### PDF export fails

Make sure Google Chrome is installed. The PDF exporter uses Chrome (via Puppeteer) to render the pages.

### Images not showing

Make sure image files are in `assets/`, `brand/`, or `references/assets/`. If using the template syntax `{{ASSET:path}}`, the path must be relative to the `onepager/` directory.

---

## For Developers

### Tech Stack

- Next.js 14 (App Router)
- shadcn/ui + Tailwind CSS
- Puppeteer (HTML to PDF)
- Local filesystem storage

### Key Architecture

- `app/current.html` — single working document, edited by Claude Code
- Web app polls `/api/current-html` every 500ms for live preview
- `data-field` attributes on HTML elements enable sidebar text editing
- `{{ASSET:path}}` templates in documents/ are resolved to base64 at load time
- Multi-page documents use `.page` divs (8.5in x 11in each)

### API Routes

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/current-html` | GET | Returns working file HTML + lastModified |
| `/api/documents/tree` | GET | Returns folder tree from _tree.json |
| `/api/documents/load` | POST | Loads doc from documents/ into current.html (resolves assets) |
| `/api/documents/save` | POST | Saves current.html to documents/ (unresolves assets) |
| `/api/assets/upload` | POST | Saves uploaded image to assets/ |
| `/api/update-text` | POST | Patches text in current.html via data-field |
| `/api/export-pdf` | POST | Generates PDF from current.html |
| `/api/save-draft` | POST | Copies current.html to outputs/ |
| `/api/list-files` | GET | Lists saved exports from outputs/ |
