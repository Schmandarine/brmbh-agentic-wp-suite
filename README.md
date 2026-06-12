# brmbh Agentic WP Suite

An **agentic WordPress starter theme**: Bootstrap 5 ↔ Gutenberg layout bridge, an
auto-registering **ACF block factory**, and **agent-agnostic skills** (Claude, Cursor,
Windsurf) for building page sections straight from a Figma design or screenshot.

The premise: clone the theme, point a coding agent at it, and have it scaffold pages, build
ACF blocks, and wire design tokens — without hand-writing boilerplate. Every moving part is
agent-callable, scriptable, and reviewable.

> ⚠️ **Requires Advanced Custom Fields PRO 6.0+.** The block layer is load-bearing — there is
> no fallback path. See `inc/dependencies.php`.

---

## Quick start

```bash
git clone https://github.com/Schmandarine/brmbh-agentic-wp-suite.git wp-content/themes/brmbh-agentic-wp-suite
cd wp-content/themes/brmbh-agentic-wp-suite
npm install
npm run build          # or: npm run watch  (live rebuild)
```

Activate the theme in WordPress (ACF Pro must be active). On activation the theme scaffolds
its starter pages + menus once. Re-run any time:

```bash
wp brmbh scaffold            # idempotent — creates missing pages/menus
wp brmbh scaffold --dry-run  # preview without writing
```

---

## What's in the box

| Layer | Where | What |
|---|---|---|
| **Build** | `package.json`, `webpack.config.js`, `tools/sass-with-theme-flags.sh` | Bootstrap 5.3 + GSAP, Webpack (JS), Dart Sass (CSS) |
| **Design tokens** | `assets/src/scss/_tokens.scss` | CSS custom properties (Figma-syncable). Re-value for your brand |
| **Bootstrap bridge** | `assets/src/scss/_variables.scss`, `_wp-css-variables.scss`, `components/gutenberg-blocks.scss` | One source of truth for colors/spacing across SCSS and the block editor |
| **Block factory** | `my-acf-blocks/loader.php` | Drop a four-file folder, it auto-registers. No manual wiring |
| **Scaffold** | `inc/scaffold.php` | Declarative pages + menus, idempotent |
| **CLI** | `inc/cli.php` (`wp brmbh ...`) | Thin wrappers around scaffold + token sync |
| **Agent skills** | `AGENTS/` + thin wrappers in `.claude/`, `.cursor/`, `.windsurf/` | `/create-block`, `/list-blocks`, `/edit-block`, `/delete-block`, `/sync-tokens` |

---

## The ACF block factory

Each block is a folder of four files. The loader scans `my-acf-blocks/` and registers
everything automatically — no `register_block_type()` calls to maintain.

```
my-acf-blocks/{block-name}/
  block.json     # WordPress block registration (ACF reads acf.renderTemplate)
  fields.php     # ACF field group (returned as an array)
  template.php   # render output (PHP + Bootstrap + get_field())
  _style.scss    # block styles (auto-imported via _loader.scss)
```

See `my-acf-blocks/example-hero/` for a working reference, and
`my-acf-blocks/ACF-BLOCK-EDIT-MODE.md` for why every block ships `apiVersion: 2`.

The fastest way to make one is to ask your agent to run **`/create-block`** — it asks for the
ACF group, an optional Figma node or screenshot, then writes all four files and appends the
SCSS import.

---

## Agent skills

`AGENTS/` is the canonical source. Each agent has a thin wrapper that just reads and executes
the matching `AGENTS/{skill}.md`:

| Skill | Purpose |
|---|---|
| `/create-block` | Interactive: build a new ACF block from a design, mapping to design tokens (never raw hex) |
| `/list-blocks` | Report registered blocks, ACF groups, and missing SCSS imports |
| `/edit-block` | Modify an existing block's json/fields/template/scss |
| `/delete-block` | Confirm + remove a block folder and its SCSS import |
| `/sync-tokens` | Regenerate `_tokens.scss` from Figma Variables via MCP |

Wrappers live in `.claude/commands/`, `.cursor/rules/`, `.windsurf/rules/`.

---

## Customizing the brand

1. Edit `assets/src/scss/_tokens.scss` (CSS custom properties) — or run `/sync-tokens` to pull
   from Figma.
2. Mirror any new palette values in `assets/src/scss/_variables.scss` (`$theme-colors`) and
   `inc/gutenberg.php` (editor palette). **Keep the slug names** — they're the contract.
3. Drop your logo at `assets/img/logo.svg` (optionally `logo-on-light.svg`), or set it via
   Customizer → Site Identity.
4. `npm run build`.

---

## License

GPL-2.0-or-later. See [LICENSE](LICENSE).
