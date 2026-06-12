# Agent operating contract — brmbh Agentic WP Suite

This file is the canonical instruction set for any coding agent working in this theme. Other
agents (Claude, Cursor, Windsurf) point here. Read it before making changes.

## What this theme is

An agentic WordPress starter: Bootstrap 5 + Gutenberg + an auto-registering ACF block factory.
Content is driven by ACF blocks and native Gutenberg patterns — not page templates.

**Hard dependency:** ACF Pro 6.0+. No fallback. `inc/dependencies.php` is the single source of
truth (`brmbh_has_acf_pro()`); it surfaces admin notices and aborts `wp brmbh` commands when
ACF Pro is missing.

## Design system — the rules

1. **Never hardcode hex, px font-sizes, or arbitrary spacing.** Map to tokens.
   - Colors: `$theme-colors` slugs (`primary`, `secondary`, `secondary-light`, `ochre`, …) →
     Bootstrap utilities (`bg-primary`, `text-primary`, `btn-primary`).
   - Spacing: `var(--space-*)` or Bootstrap utilities (`py-5`, `gap-3`); section rhythm via
     the `.section` class.
   - Type: `"Inter"` (body) / `"InterDisplay"` (headings) — automatic. Use heading + `display-*`
     classes, never `font-size` in px.
2. **One source of truth for the palette:** `_tokens.scss` (CSS vars) → mirrored in
   `_variables.scss` (`$theme-colors`) and `inc/gutenberg.php` (editor palette). Change values,
   keep slug names.
3. **Layout:** full-width sections (`align: full` / `.alignfull`) with content constrained by
   the Bootstrap container. ACF blocks render a `<section>` with a `.container` inside.

## The block factory

- A block = a folder in `my-acf-blocks/{name}/` with `block.json`, `fields.php`, `template.php`,
  `_style.scss`. `loader.php` auto-registers it. Zero manual registration.
- **Every `block.json` ships `apiVersion: 2` + `supports.mode: true`.** Never `apiVersion: 3` —
  it iframes the editor canvas and ACF force-disables in-canvas editing. See
  `my-acf-blocks/ACF-BLOCK-EDIT-MODE.md`.
- To create/edit/remove a block, use the `/create-block`, `/edit-block`, `/delete-block` skills
  in `AGENTS/`. They keep `_loader.scss` imports in sync.

## Separation of concerns

| Concern | Owner |
|---|---|
| Pages + menus (theme bootstrap data) | `inc/scaffold.php` → `wp brmbh scaffold` (idempotent) |
| ACF field groups + block templates | per-block, via `/create-block` |
| Design tokens | `_tokens.scss`, via `/sync-tokens` or `wp brmbh tokens` |

**Hard rule:** scaffold never touches ACF; each block owns its own `fields.php`.

## What NOT to do

- Don't add `register_block_type()` calls by hand — the loader does it.
- Don't introduce raw hex/px values in templates or block SCSS.
- Don't bump a block to `apiVersion: 3`.
- Don't rename token slugs — re-value them instead.
- Don't commit `assets/dist/` build output or `node_modules/` (gitignored).

## Build

`npm run build` (once) or `npm run watch` (live). CSS → `assets/dist/css/`, JS →
`assets/dist/js/main.bundle.js`.
