# OnePager

Create beautiful, branded one-pager PDFs by describing what you want. Claude Code writes the HTML, you see it live, export when happy.

## How It Works

1. **Start the app** — see a live preview in your browser
2. **Tell Claude Code what you want** — "make a one-pager for Acme Corp about our robotics platform"
3. **Claude writes the HTML** — preview updates automatically
4. **Tweak text in the sidebar** — quick edits without re-prompting
5. **Export PDF** — one click, pixel-perfect output

---

## Getting Started (Non-Technical Guide)

### Install these first

1. **Node.js** — Go to [nodejs.org](https://nodejs.org), download the LTS version, run the installer.

2. **Git** — Go to [git-scm.com](https://git-scm.com/downloads), download for your OS, install with defaults.

3. **Google Chrome** — You probably have this. If not, install from [google.com/chrome](https://www.google.com/chrome/). Needed for PDF export.

4. **Claude Code** — Open your terminal and run:
   ```
   npm install -g @anthropic-ai/claude-code
   ```
   You need an Anthropic API key from [console.anthropic.com](https://console.anthropic.com/).

### Setup (one time)

Open your terminal (search "Terminal" on Mac, or "Git Bash" on Windows):

```bash
git clone https://github.com/AaryanPalve5/onepager.git
cd onepager/app
npm install
```

### Daily workflow

**Step 1: Start the app**
```bash
cd onepager/app
npm run dev
```
Open Chrome and go to **http://localhost:3000**. You'll see a preview of the current one-pager.

**Step 2: Start Claude Code**

Open a SECOND terminal window (keep the first one running). Navigate to the project:
```bash
cd onepager
claude
```

**Step 3: Tell Claude what to make**

Type naturally:
- "Create a one-pager for Acme Corp about our teleoperation service"
- "Change the headline to 'Transform Your Fleet Operations'"
- "Remove the pricing section and add a testimonial quote"
- "Make this for a different client — Blue Ocean Robotics"

Claude reads the `CLAUDE.md` file which tells it exactly how the system works. It writes HTML directly and the preview updates in your browser within half a second.

**Step 4: Quick edits**

The left sidebar in the browser shows text fields extracted from the document. You can type directly there for fast tweaks (headline, descriptions, etc.) without going back to Claude.

**Step 5: Export**

When you're happy with the preview, click **Export PDF** in the top-right corner. Done!

Click **Save** to keep a copy in the files list (left sidebar).

### Style references

Drop example designs into the `references/` folder:
- HTML files you like the look of
- Screenshots of designs for inspiration
- Add URLs to `references/urls.txt`

When Claude creates a new document, it reads these references and matches the style.

### Stopping and restarting

- Stop the app: press `Ctrl+C` in the first terminal
- Stop Claude: type `/exit` or press `Ctrl+C`
- Restart: run the same commands again

---

## For Developers

### Tech Stack
- Next.js 14 (App Router)
- shadcn/ui + Tailwind CSS
- Puppeteer (HTML -> PDF)
- Local filesystem storage

### Architecture
- `app/current.html` — the working document, edited by Claude Code
- Web app polls `/api/current-html` every 500ms
- `data-field` attributes enable sidebar text editing
- Export reads `current.html` and runs through Puppeteer
- Saved files go to `app/outputs/{timestamp}/`

### API Routes
| Route | Method | Purpose |
|-------|--------|---------|
| `/api/current-html` | GET | Returns working file HTML + lastModified |
| `/api/list-files` | GET | Lists saved one-pagers from outputs/ |
| `/api/serve-file/[...path]` | GET | Serves static files from outputs/ |
| `/api/update-text` | POST | Patches text in current.html via data-field |
| `/api/export-pdf` | POST | Reads current.html, generates PDF |
| `/api/save-draft` | POST | Copies current.html to outputs/ |

## License

MIT
