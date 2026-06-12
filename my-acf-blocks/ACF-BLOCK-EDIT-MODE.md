# ACF Blocks: in-canvas Edit form vs. iframed editor (`apiVersion` gotcha)

**Status:** Understood / by-design WordPress + ACF constraint, not a bug in this theme.
**Applies to:** every block in `my-acf-blocks/*`.
**Convention:** ship all block `block.json` with `apiVersion: 2` + `supports.mode: true`.

---

## Symptom

You want an ACF block to show the **field form inside the block canvas** (the classic
"Switch to Edit / Switch to Preview" toggle in the block toolbar), so editors fill long
repeater fields in the full content width instead of the narrow ~280px settings sidebar.

Despite setting `"acf": { "mode": "edit" }` and/or `"supports": { "mode": true }`, the
toggle **never appears** on a real page — the block always renders a live preview and ACF
fields only show in the narrow right-hand inspector. Yet the **same** setting **does** show
the toggle on some scratch pages. Same block code, opposite behaviour.

---

## Root cause

It is **not** `acf.mode` and **not** `supports.mode`. It is the **editor iframe**.

### 1. ACF hard-disables in-canvas editing inside the iframed canvas

From `advanced-custom-fields-pro/assets/build/js/pro/acf-pro-blocks.min.js` (de-minified):

```js
// "is the block canvas an iframe?"
function I() {
  return document.querySelectorAll('iframe[name="editor-canvas"]').length > 0;
}

// block render():
let locked = isInQueryLoop(clientId) || I();   // <-- iframe => locked
let { mode } = attributes;
if (locked) mode = "preview";                   // force preview, ignore attribute
let showToggle = blockType.supports.mode;
if (mode === "auto" || locked) showToggle = false;  // iframe => hide toggle entirely
```

So **whenever the canvas is an iframe**, ACF forces `mode = "preview"` and hides the
Edit/Preview toolbar button regardless of `supports.mode`. The "ACF form takes over the
canvas" path is effectively dead code inside the iframed editor.

### 2. What makes the canvas an iframe

WordPress iframes the post-editor canvas **only when every block in the post is
`apiVersion: 3`**. A single `apiVersion < 3` block un-iframes the whole canvas. (Confirmed
empirically: dropping one in-post block to `apiVersion: 2` set
`document.querySelectorAll('iframe[name="editor-canvas"]').length` to `0`.)

So a post made entirely of `apiVersion: 3` blocks → canvas iframes → ACF disables the
in-canvas form. A block registered the legacy way (`acf_register_block_type()`, default
`apiVersion: 2`) leaves that page un-iframed → the toggle works. That single difference
explains the contradictory behaviour. This is a classic (non-block) theme, so the iframe
decision rests entirely on `apiVersion`.

---

## Convention

Ship **all** block `block.json` with `apiVersion: 2` + `supports.mode: true`:

- **Frontend: zero change.** ACF blocks are server-rendered; `apiVersion` is editor-only.
- **Gain:** full-width in-canvas ACF form via the "Switch to Edit" toggle.
- **Cost:** the page canvas is no longer iframed → no style isolation. Theme CSS loads into
  the main document, so editor-preview fidelity can drift slightly from the frontend (e.g. a
  full-bleed block may lose padding in the editor only). `apiVersion: 2` is the older standard
  and still fully supported.

`acf.mode` is a separate choice: `"preview"` (default — new instances start in preview, editor
toggles per block) or `"edit"` (opens straight into the field form).

### Rejected alternative — widen the settings sidebar via CSS

WordPress hardcodes the inspector sidebar width (~280px) across nested wrappers with no CSS
variable, `theme.json` key, or filter. Overriding it needs brittle `!important` chains. A
native drag-resize API (`setComplementaryAreaWidth()`, Gutenberg PR #70616) is in flight but
unmerged. Not worth the fragility — the `apiVersion: 2` route is clean.

The `/create-block` skill encodes this: it always writes `apiVersion: 2` + `supports.mode: true`.
