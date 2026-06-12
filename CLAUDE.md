# CLAUDE.md

Claude Code-specific notes for this theme. **The operating contract is in [AGENTS.md](AGENTS.md)
— read it first.** This file only adds Claude/MCP-specific workflow.

## Skills

Slash commands live in `.claude/commands/` as thin wrappers that read and execute the matching
canonical skill in `AGENTS/`:

- `/create-block` — build a new ACF block (from a Figma node, screenshot, or field schema)
- `/list-blocks` — audit registered blocks + missing SCSS imports
- `/edit-block`, `/delete-block` — modify/remove a block
- `/sync-tokens` — regenerate `_tokens.scss` from Figma Variables

## Figma MCP build loop

When the Figma MCP server is connected, the design→block loop is:

1. `mcp__claude_ai_Figma__get_design_context(nodeId)` → reference code + screenshot.
2. `mcp__claude_ai_Figma__get_variable_defs(nodeId)` → design tokens (feed `/sync-tokens`).
3. `/create-block` → write the four files, mapping the design to **tokens, never raw hex**.
4. `npm run build` (keep `npm run watch` running during a session).
5. Insert the block on `/dev-sandbox` and compare against the Figma screenshot; iterate.

## Conventions

- Be concise. Follow the design-system rules in AGENTS.md to the letter.
- Verify a block builds (`npm run build`) before claiming it's done.
- Don't hand-edit `assets/dist/` — it's generated.
