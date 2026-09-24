# BioFlow plugin for Claude

Edit, publish, and measure your BioFlow link-in-bio pages.

## Install

```
/plugin marketplace add DevinoSolutions/claude-plugins
/plugin install bioflow@devino
```

Then ask Claude about your page. On the first tool call Claude opens the BioFlow sign-in page;
pick the scopes you want on the consent screen. A tool whose scope you did not grant is never
registered for the session.

## What it connects

Remote MCP server `https://app.getbioflow.com/api/mcp` (OAuth 2.1 with PKCE). It reaches 12
tools, each registered only when you granted its scope:

- Pages (`pages:read`): `page.list`, `page.get`
- Analytics (`analytics:read`): `analytics.summary`
- Contacts (`contacts:read`): `contacts.list`
- Files (`files:read`): `file.list`
- Draft edits (`pages:write`): `page.create`, `page.update_draft`, `page.add_block`,
  `page.remove_block`, `page.reorder_blocks`
- Publishing (`publish` plus the gates below): `page.publish`, `page.schedule_publish`

Draft edits never touch your live page. Every write carries an `expectedUpdatedAt` snapshot
from `page.get` and is refused with `STALE_SNAPSHOT` if the draft changed in between.
`page.publish` and `page.schedule_publish` are gated twice: a workspace "dangerous operations"
setting that is off by default and only a signed-in person can turn on (Settings, Connected AI
apps), and a two-step call. The first call returns a preview of what would go live and a
short-lived `confirmToken`; only a second call carrying that token commits.

By default the server runs in Code Mode: `tools/list` shows two tools, `search_tools` and
`execute_typescript`, and the tools above are called inside `execute_typescript` as
`external_*` functions whose names swap dots for underscores (`page.list` becomes
`external_page_list`), with the same scopes and gates. A server set to the per-tool surface
lists them by name instead. The skills handle both.

## Skills

| Skill | Use it when |
|---|---|
| `editing-page-drafts` | "Add a link to my YouTube channel", "Rename my page title", "Move the newsletter block to the top" |
| `publishing-pages` | "Publish my page", "Schedule my page to go live Monday at 9am" |
| `analyzing-page-performance` | "How did my page do last month?", "Who signed up through my page?" |
| `setup-bioflow` | "Connect BioFlow to Claude", "BioFlow tools are missing", "Tool not found" |

## Links

- Docs: https://getbioflow.com/docs/connecting-ai-assistants
- Privacy: https://app.getbioflow.com/privacy
- Support: support@devino.ca
