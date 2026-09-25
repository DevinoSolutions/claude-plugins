# claude-plugins

Public marketplace repo for the Devino Claude plugins. It holds only plugin manifests, icons, READMEs and skill text; every MCP server lives in its own app repo and this repo just points at the live MCP URL.

## Every merge to main is a release

The Claude plugin directory tracks `main` for each listed plugin and auto-publishes versions that pass its automated scan. There is no manual publish step in between. So:

- A change to anything under `plugins/<name>/` (manifest, skills, README, icon) is proven on the real client before it merges: install the plugin from this branch in Claude Code (or Cowork) as a user would, connect to the app's production MCP, run the listing's example prompts, and confirm the tool calls and the funnel events land in production. Write the proof with timestamps in the pull request.
- After the directory publishes the version, install it fresh from the directory and repeat the example prompts. Log that too.
- A change to the app's served MCP surface (tools, annotations, OAuth, consent, host env) is a plugin change for this rule, even when this repo does not move.
- If the live proof cannot be done for a change, turn auto-publish off for that plugin on claude.ai/directory/manage before merging, and turn it back on once proven.

Owner ruling 2026-09-25. Never keep auto-publish on and skip the testing.

## Checks

- `node scripts/sync-skills.mjs --check` — the top-level `skills/` mirror must match `plugins/*/skills/`; regenerate with the same script without `--check`.
- `claude plugin validate --strict .` and per plugin folder. The strict validator rejects manifest keys it does not know (`icon`, `privacyPolicyUrl`); the directory picks up `.claude-plugin/icon.png` and the README privacy link by itself.
- Single-line commit subjects. No attribution trailers.
