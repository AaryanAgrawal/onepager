# Farhand × Robotic Crew — Sales Document Wireframe (4 Pages)

> Wireframe for copy and layout. Claude renders to HTML.

---

## CONTEXT

**Partnership**: Farhand × Robotic Crew. Both logos on every page.

- **Robotic Crew** — remote: fleet monitoring, teleoperation, L1–L3 troubleshooting. Nearshore operators from Latin America. Platform-agnostic.
- **Farhand** — field: on-site installation, maintenance, break/fix repair. AI-guided techs through Field Nation's nationwide network.

Together: full-stack robot operations support, remote + field.

**Font**: DM Sans. Headings 600 weight, body 400. Green-to-white gradient background on every page (bottom to top). Green left/right/bottom borders on every page.

**Pricing**: On-demand. You pay for hours our remote team spends supervising and troubleshooting your robots, and hours our field techs spend on-site servicing them. No retainers, no idle headcount.

## COLOR PALETTE

| Alias | Hex | Usage |
|-------|-----|-------|
| farhand-green | #009F4A | Borders, section accents, CTA pills, field coverage icons |
| bright-green | #33ee69 | Relay hub, diagram connectors, accent highlights |
| orange | #FF6821 | End User elements, badge pills (Coverage, AI Platform, The Model) |
| orange-accent | #FF9A1F | Capability card icons (page 3) |
| dark | #10100d | Body text, dark backgrounds |
| gray-text | #666 | Secondary text, descriptions |
| light-gray | #e5e5e5 | Card borders |
| client-yellow | #EAB308 | Client-owned elements (Your Robot, Your Engineers in diagram) |

---

## PAGE 1 — The Pitch

**Intent**: You have a robot fleet. You need operations support. Here's what we do together, in one glance.

### Header
- **Logos**: Farhand × Robotic Crew (both logos, × separator, centered)
- **Subtitle**: Your robot support partners (centered below logos)
- **Solution made for** (pills, right): AMRs / Manipulators / Humanoids

### Client Logo


### Intro
Your robots need people behind them — remote operators watching the fleet, and field techs on-site when something breaks. We give you both. We tailor our AI platform to your robots — guiding every repair, logging every action, and autonomously troubleshooting your robot software.

### What You Get (2 columns + full-width bar below)

**Remote Support** `[icon: headset, farhand-green]`:
- 24/7 fleet monitoring & teleoperation
- L1–L3 remote troubleshooting via AWS, robot dashboards, and live feeds
- Escalation to field when remote can't resolve

**Field Service** `[icon: wrench, farhand-green]`:
- Deployment, commissioning & end-user training
- Break/fix repair, preventative maintenance
- Vetted and certified on your robot

**AI Platform** (full-width bar spanning both columns) `[icon: sparkle, farhand-green]`:
- Trains on your docs to create SOPs and answer questions
- Automated SSH diagnostics and log analysis on your robots
- Logs every interaction so your R&D team can learn from the field

### Our Value (3-column cards, title + text)

**Lower support overhead**
`[icon: money-wavy, farhand-green]`
A single W-2 field technician costs up to $160K/yr in salary, benefits, travel, tools, and management overhead. On-demand support cuts costs by 30–65%.

**Consistent service quality**
`[icon: seal-check, farhand-green]`
Our AI agent is tailored to be your best engineer, present alongside any technician, on call or anywhere in the country.

**Faster fleet expansion**
`[icon: chart-line-up, farhand-green]`
Support capacity shouldn't bottleneck your robot sales. Expand into new regions without months of recruiting and training. More robots deployed, revenue captured faster.

### CTA
*Let's talk*
- Phone: 857-498-9778
- Email: aaryan@farhand.live
- Website: www.farhand.live
 
---

## PAGE 2 — Coverage

**Intent**: We can actually do this. Here's the reach — remote and field. Scannable at a glance — icons and stats, not paragraphs.

### Header
- Logos + "Coverage" badge pill

### Field Coverage (map left, stat cards right)

Two columns side by side:

**Left (55%)**: US map, smaller than before
[IMAGE: references/assets/us-map-farhand.png]
**Tagline: Virtually every zip code**

**Right (45%)**: 3 icon+stat cards stacked vertically, distilled from the paragraph:

| Icon | Color | Title | Stat/Line |
|------|-------|-------|-----------|
| UsersThree | `farhand-green` | Experienced Workforce | 20,000+ techs from robotics, EV, data centers & industrial machinery |
| Clipboard | `farhand-green` | Proven Success | 4,000+ completed work orders by workforce across robot types |
| ShieldCheck | `farhand-green` | Certified & Vetted | Trained technically and in customer communications. |

### Remote Coverage (3 titled icon cards + highlight)

3 cards in a row, each with a Phosphor icon + bold title + one short line:

| Icon | Color | Title | Line |
|------|-------|-------|------|
| Globe | `farhand-green` | Nearshore Teams | Pills: Argentina, Mexico, India (dotted). Bilingual, timezone-aligned. |
| Clock | `farhand-green` | 24/7 Operations | Monitoring, teleoperation, L1 & L2 troubleshooting by engineers. |
| MapPin | `farhand-green` | Global Reach | Pills: North America, South America, EU, Asia, Australia |

**Highlight bar** (below cards): As our techs and platform learn, remote has shown to resolve **80%+** of issues before a field tech is needed.

### How a Ticket Flows

**Detected** by our remote team or your end-user → **Triaged** by technical remote support team → **Resolved** and documented
Different branch Diagnosed -> **Dispatched** field technician rapidly -> Resolved

### Proven Success (bottom-anchored)

**1,200+ robots from 15 clients supported in 40+ countries**
Deployed in warehouses, manufacturing, hospitality, sidewalk delivery, and logistics

[Client logo placeholders — user will add]


---

## PAGE 3 — The Platform (Farhand Relay™)

**Intent**: This isn't just people. There's a platform connecting remote and field, and it's built for your robot specifically. Your data is isolated.

### Header
- "AI Platform" badge pill (top right)
- Farhand Relay™ branding (large Farhand logo + "Relay" in DM Sans, TM superscript)

### Headline
An AI agent trained to be your senior engineer

### Key Message
Our technicians are experts in mechanical and electrical repairs — but robotics software is a fast-evolving field. So we built Relay. It ingests your docs to guide every technician through diagnostics step by step.

### Wiring Diagram (flexbox hub-and-spoke)

Top row (left to right): **Your Robot** --dashed (CLI/SSH)-- **RELAY** --solid (platform)-- **Remote Support** <--solid (calls in)-- **Customer**

Vertical from RELAY down (escalates) to bottom row:

Bottom row: **Field Tech** --solid (reports to)--> **Your Engineers**

- RELAY is the `bright-green` hub circle with glow
- Your Robot, Your Engineers: `client-yellow` fill
- Remote Support, Field Tech: `bright-green` stroke, light green fill
- End User: `orange` stroke/text
- Dashed line to Robot = CLI/SSH connection
- All other connections solid `bright-green`
- Labels above each connector segment in `gray-text`

### Capabilities (2×3 grid, icon + title + one line each) `[icons: orange-accent]`
1. `[icon: file-text]` **SOPs & Training Materials** — Upload your docs → we create visual SOPs, training guides, and customer-facing materials
2. `[icon: desktop]` **Autonomous diagnostics** — Our agent SSHs into your robot, finds issues, reads logs, and troubleshoots
3. `[icon: headset]` **Contextual escalation** — Remote to field to your engineering team, each handoff carries full context and logs
4. `[icon: scroll]` **Service report generation** — Every interaction documented for every job
5. `[icon: plugs-connected]` **Integrates with your tools** — Slack, WhatsApp, Jira, Formant, InOrbit, Salesforce, and others
6. `[icon: eye]` **Closed-loop learning** — Every field interaction feeds structured data back — failure patterns, fix rates, and field insights that make your robot better over time

### Data & Security (dark card, bottom-anchored) `[icon: shield-check, farhand-green]`
Green "Data & Security" tag + shield icon. One AI agent per customer. Hosted on our servers. No data leaked to LLM providers. No cross-org data or models.

---

## PAGE 4 — Why This, Not That

**Intent**: The business case. Why on-demand ops beats building in-house. Close the deal.

### Header
- Logos + "The Model" badge pill

### Headline
Pay for flexible support hours. Not fixed headcount.

### The Model
You pay for the hours our remote team spends monitoring and troubleshooting your robots, and the hours our field techs spend on-site. No fixed burn. No long-term commitment. Scale up during rollouts, scale down when things are steady.

### How We Compare

| | In-House | Prepaid Field Support | Farhand × Robotic Crew |
|---|---|---|---|
| Upfront cost | >$120K/yr per tech | Prepaid monthly cost | $0 |
| Coverage | Regional, business hours | Surcharges for overages and out-of-area | Nationwide, 24/7 |
| Scaling Speed | Months to hire for every new location | 90 days before first tech is ready | Within 2 weeks |
| Training | Create docs & retrain staff | Create docs to give to provider | Our AI creates docs with you |
| Risk | On your payroll | Locked into contract | No commitment |
| Idle cost | Paying when nothing breaks | Paying for unused hours | Pay only when we work |

### Bottom Line (centered callout)
You don't need a field service team. You need field service done.

### CTA
*Let's talk*
- Phone: 857-498-9778
- Email: aaryan@farhand.live
- Website: www.farhand.live
