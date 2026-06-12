# brmbh Agentic WP Suite

**An agentic WordPress starter theme: Bootstrap 5 + Gutenberg + a self-registering ACF block
factory, built to be driven by a coding agent.**

Clone it, point Claude / Cursor / Windsurf at it, and build production page sections straight
from a Figma design — ACF blocks, design tokens, page scaffolding, and deploys, without
hand-writing the boilerplate. Everything is a folder convention or a one-line command, so an
agent (or a human) can extend it without reverse-engineering the theme first.

It's a classic PHP theme — no build-step lock-in, no Blade, no Composer. Just Bootstrap, ACF
Pro, vanilla WordPress, and a set of conventions that automate the repetitive parts.

---

## The three pillars

### 1. 🧱 An ACF block factory that registers itself

A block is a folder of four files. Drop it into `my-acf-blocks/` and it's live — no
`register_block_type()` calls, no central registry, no manual ACF group wiring.

```
my-acf-blocks/{block-name}/
  block.json     # WordPress block registration (ACF reads acf.renderTemplate)
  fields.php     # ACF field group (returned as an array)
  template.php   # render output (PHP + Bootstrap + get_field())
  _style.scss    # block styles (auto-imported)
```

`my-acf-blocks/loader.php` scans the folder and registers each block + field group on
`init` / `acf/init`. The **`/create-block`** agent skill writes all four files from a Figma
node or a screenshot, mapping the design to your tokens — never raw hex. Working reference:
`my-acf-blocks/example-hero/`.

### 2. 🔁 A sync toolchain: design tokens in, code + database out

One command in each direction, every one agent-callable:

| Tool | Direction | What it does |
|---|---|---|
| `wp brmbh tokens` · `/sync-tokens` | Figma → repo | Pull Figma Variables into `_tokens.scss` as CSS custom properties |
| `tools/deploy.sh` | local → server | rsync the built theme over SSH — works with IP-restricted hosts where CI can't reach |
| `tools/db-pull.sh` | server → local | Export remote DB, import locally, URL search-replace, reconcile plugins + schema |
| `tools/db-push.sh` | local → server | The reverse — guarded by `CANONICAL_ENV` so you can't clobber production |
| `tools/sync-plugins.sh` | local → server | Install wp.org plugins remotely; rsync premium ones |
| `tools/version-check.sh` | both | Report PHP / WordPress / theme / plugin version drift between environments |

Environments are tiny gitignored `tools/env/*.env` files (copy from the `.example`
templates). See [`tools/env/README.md`](tools/env/README.md).

### 3. 🎨 A real Bootstrap 5 ↔ Gutenberg integration

Bootstrap and the block editor share **one source of truth** for color, spacing, and
typography. Editors never type a Bootstrap class; agents never invent a hex value.

```
_tokens.scss            CSS custom properties (Figma-synced)
  → _variables.scss     $theme-colors + Bootstrap overrides
  → _wp-css-variables   the SCSS-to-WordPress bridge
  → inc/gutenberg.php   editor color palette + spacing scale
```

Change a value once and it propagates to SCSS, the live frontend, and the editor canvas. The
editor loads the compiled theme CSS so block previews match production. Full-width sections
with container-constrained content work for both native Gutenberg patterns
(`inc/block-patterns.php`) and ACF blocks.

> ⚠️ **Requires Advanced Custom Fields PRO 6.0+.** The block layer is load-bearing — there is
> no fallback path. `inc/dependencies.php` enforces it with admin notices and CLI guards.

---

## Quick start

```bash
# 1. Clone into your WordPress themes directory
git clone https://github.com/Schmandarine/brmbh-agentic-wp-suite.git \
  wp-content/themes/brmbh-agentic-wp-suite
cd wp-content/themes/brmbh-agentic-wp-suite

# 2. Install + build assets
npm install
npm run build            # or: npm run watch  (live rebuild)

# 3. Activate the theme in wp-admin (ACF Pro must be active).
#    It scaffolds starter pages + menus once on activation.

# 4. Re-run the scaffold any time — it's idempotent
wp brmbh scaffold        # add --dry-run to preview
```

Then ask your agent to **`/create-block`** and build your first section from a design.

---

## Agent skills

`AGENTS/` is the canonical source. Each agent has a thin wrapper that reads and executes the
matching `AGENTS/{skill}.md` (wrappers in `.claude/commands/`, `.cursor/rules/`,
`.windsurf/rules/`). Works with any agent that can read files and run shell commands.

| Skill | Purpose |
|---|---|
| `/create-block` | Build a new ACF block from a Figma node, screenshot, or field schema |
| `/list-blocks` | Audit registered blocks, ACF groups, and missing SCSS imports |
| `/edit-block` | Modify an existing block's json/fields/template/scss |
| `/delete-block` | Confirm + remove a block folder and its SCSS import |
| `/sync-tokens` | Regenerate `_tokens.scss` from Figma Variables via MCP |

The operating contract every agent follows is [AGENTS.md](AGENTS.md); Claude-specific workflow
is in [CLAUDE.md](CLAUDE.md). Both are written to be read by an LLM as a system prompt for the
codebase.

---

## How it compares

| | This suite | Underscores (`_s`) | Understrap | Sage (Roots) |
|---|---|---|---|---|
| CSS framework | **Bootstrap 5** | none | Bootstrap | Tailwind |
| Bootstrap ↔ Gutenberg token bridge | ✅ | — | partial | — |
| Self-registering ACF block factory | ✅ | — | — | — |
| Agent skills (Claude/Cursor/Windsurf) | ✅ | — | — | — |
| Figma → SCSS token sync | ✅ | — | — | — |
| Deploy + DB-sync tooling included | ✅ | — | — | — |
| Templating | vanilla PHP | vanilla PHP | vanilla PHP | Blade |
| Build toolchain | npm + Webpack + Sass | none | Gulp/npm | Bud + Composer |
| Requires ACF Pro | **yes** | no | no | no |

**Use it when** you build content-driven WordPress sites with ACF blocks and want a coding
agent to do the repetitive block/scaffold/deploy work against a Bootstrap design system.
**Skip it when** you want a block-theme/FSE (`theme.json`-only) setup, a Tailwind/Blade stack,
or a theme with no ACF Pro dependency.

---

## Tech stack

WordPress 6.4+ · PHP 8.0+ · ACF Pro 6.0+ · Bootstrap 5.3 · GSAP · Webpack · Dart Sass ·
Node 18+ · WP-CLI (`wp brmbh` namespace) · Inter / InterDisplay variable fonts ·
GPL-2.0-or-later.

## Project layout

```
my-acf-blocks/        ACF block factory (loader + one example block)
inc/                  scaffold, block patterns, editor config, ACF dependency guard, CLI
assets/src/scss/      tokens → variables → Bootstrap bridge → globals → components
assets/src/js/        Bootstrap + GSAP entry, scroll entrances, sticky nav
tools/                deploy + DB-sync + Figma token-sync scripts; env templates
AGENTS/               canonical agent skills (+ thin wrappers in .claude / .cursor / .windsurf)
template-parts/       reusable partials (site logo)
```

## License

GPL-2.0-or-later. See [LICENSE](LICENSE). Built and maintained by
[Jan Brombach](https://brombach.de).
