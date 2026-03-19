# Farhand — Boschert USA Implementation Proposal Wireframe (2 Pages)

> Implementation proposal for Boschert USA. Phased AI platform build with deliverables, pricing, and next steps. Claude renders to HTML.

---

## CONTEXT

**Company/Client**: Boschert USA — industrial machine manufacturer. Farhand is building a bespoke AI platform tailored to Boschert's machines, documentation, and service workflows.
- Farhand provides an AI-powered platform that turns Boschert's tribal knowledge into structured SOPs and diagnostic workflows
- The platform guides technicians through repairs with no changes to how customers operate and minimal changes to how technicians operate
- Implementation is phased: Discovery, Build, Tuning

**Document type**: Implementation proposal — phased plan with deliverables, payment milestones, and a next-steps page explaining what Farhand needs from the client to scope the engagement.

**Font**: Inter. Headings 600-700 weight, body 400.

**Pricing**: Implementation fee scoped per engagement. Platform subscription $189 / technician / month.

## COLOR PALETTE

| Alias | Hex | Usage |
|-------|-----|-------|
| farhand-green | #009F4A | Borders, phase card left accents, phase numbers, payment percentages |
| bright-green | #33ee69 | Accent highlights, key callouts |
| dark | #10100d | Body text, dark backgrounds, pricing bar, send-to box |
| gray-text | #666 | Secondary text, descriptions, italic explanation lines |
| light-gray | #e5e5e5 | Card borders |

---

## PAGE 1 — AI Platform Implementation

**Intent**: Show Boschert the phased implementation plan with clear deliverables and payment milestones. The reader should understand exactly what they get at each stage and what it costs.

### Header (dual logo, top-left)

- **Farhand logo**: `{{LOGO}}` — height 36px
- **×** separator (light gray, font-weight 300)
- **Boschert USA logo**: `{{ASSET:assets/boschert_logo.jpg}}` — height 36px, `object-fit: contain`
- Both logos must render at matching visual height. Verify with Playwright after render.

### Title Block

- **Title**: AI Implementation Plan (26px, bold, dark)
- **No subtitle on this page**

### Goal Bar (full-width, green left accent, light gray background)

> Goal: Bespoke AI platform for Boschert USA with no changes to how customers operate and minimal changes to how technicians operate.

### Phase Cards (3 large full-width cards, stacked vertically)

Each card: farhand-green full border (4px) rounded cards | phase number (large, bright-green, left side) | title (bold) + bullet deliverables (center) | payment % (smallest, grey, right-aligned)

**Card 1 — Discovery & Intake — 40% at kickoff**
- Prioritize machine types
- Documentation audit and intake
- In-HQ workflow shadowing
- Initial SOP library for top service issues
- Platform provisioning and training

**Card 2 — Build & Configure — 40% at delivery**
- Support and escalation workflows configured
- Integration with existing company tools
- On-client site workflow shadowing
- Customer facing workflows configured
- AI agent hardened

**Card 3 — Tuning — 20% at completion**
- Observe real service events and refine SOPs
- Adjust escalation paths based on actual usage
- Optimize platform to conform to how your team works

### Pricing Line (full-width bar, dark background, centered text, white text)

Implementation fee scoped per engagement · Platform subscription **$189 / technician / month**

### Footer (contact pills, bottom-anchored via margin-top:auto)

- `[icon: phone, farhand-green]` Phone: 857-498-9778
- `[icon: envelope-simple, farhand-green]` Email: aaryan@farhand.live
- `[icon: globe, farhand-green]` Website: www.farhand.live

No address.

---

## PAGE 2 — Next Steps

**Intent**: Tell Boschert exactly what to do next. Make it easy to share documentation and understand the timeline. The reader should feel this is low-effort on their end and that Farhand moves fast.

### Header (dual logo, top-left)

- **Farhand logo**: `{{LOGO}}` — height 36px
- **×** separator (light gray, font-weight 300)
- **Boschert USA logo**: `{{ASSET:assets/boschert_logo.jpg}}` — height 36px, `object-fit: contain`

### Title Block

- **Title**: Next Steps (26px, bold, dark)
- **Subtitle**: What we need to scope your implementation (gray-text, below title)

### Intro Bar (full-width, green left accent, light gray background)

> To build you an accurate proposal with fixed pricing, we need to understand your machines, your documentation, and how your team works today.

### Documentation to Share (checklist with italic explanation lines)

Lead-in line (italic): *Send what you have — nothing needs to be cleaned up.*

3 checkbox items, each with a bold title and an italic explanation line underneath in gray-text:

- [ ] **Technical Manuals & Service Documentation**
  *Helps us understand what your techs already reference in the field.*

- [ ] **Service Reports & Ticket History**
  *Shows us what breaks most often and how your team resolves it today.*

- [ ] **Existing SOPs or Procedures (if any)**
  *We'll build on what you have rather than starting from scratch.*

### On-Site Engagement (bullet list with green checkmarks)

Lead-in line (bold): **Farhand works from your office during parts of Implementation:**

4 bullet items with `[icon: check-circle, farhand-green]` checkmarks:

- Shadow field jobs and support calls
- Map actual troubleshooting patterns with techs
- Sit with engineering to understand escalation triggers
- Review documentation in context — what gets used, what gets ignored

Closing line (italic, gray-text): *This is how we build a platform your team actually uses — not a tool that collects dust.*

### Proposed Timeline (table with dark header row)

| Action | When |
|--------|------|
| Share documentation | This week |
| Farhand delivers scoped proposal | Within 48 hours of receiving docs |
| Review proposal and align on scope | Follow-up meeting (scheduled today) |
| Kick off implementation | Within one week of agreement |

### Send-To Box (full-width, dark background, centered text, white text)

Send documentation to: **aaryan@farhand.live** (email highlighted in bright-green)
*Any format works — PDFs, Word docs, spreadsheets, photos, screen recordings.*

### Footer (contact pills, bottom-anchored via margin-top:auto)

- `[icon: phone, farhand-green]` Phone: 857-498-9778
- `[icon: envelope-simple, farhand-green]` Email: aaryan@farhand.live
- `[icon: globe, farhand-green]` Website: www.farhand.live

No address.
