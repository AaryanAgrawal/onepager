# Feature Radar

Track recurring requests. Build proactively when count >= 2.

## Tracked Requests

| Request | Count | Status | Notes |
|---------|-------|--------|-------|
| Easier image embedding | 2 | BUILT | `{{ASSET:path}}` template system — server resolves at load, un-resolves at save |
| Carded layout for sections | 2 | BUILT | Workforce/AI Platform sections now use bordered cards matching AMR.png reference |
| Multi-page document support | 1 | BUILT | `.page` div convention with auto-detection in preview panel |
| Folder sidebar | 1 | BUILT | DocumentTree.tsx with _tree.json |
| Approved copy reference doc | 1 | BUILT | Hidden from sidebar, tracked in git |

## Completed Features

- **Multi-page documents** (2025-03): `.page` divs with CSS page breaks, auto-detected by PreviewPanel
- **Folder sidebar** (2025-03): DocumentTree component, _tree.json, load/save API routes
- **Asset template system** (2025-03): `{{ASSET:path}}` resolved by server at load time
- **Phosphor Icons integration** (2025-03): Inline SVGs from @phosphor-icons/core, documented in CLAUDE.md
