# Postify plugin for Claude

Draft, schedule, and publish social posts from your Postify calendar.

## Install

```
/plugin marketplace add DevinoSolutions/claude-plugins
/plugin install postify@devino
```

Other ways in: the Claude plugin directory and the `anthropics/claude-plugins-community` marketplace once approved, skills only with `npx skills add DevinoSolutions/claude-plugins --skill setup-postify`, or the connector alone through the [Connectors Directory listing](https://claude.ai/directory/connectors/postify). See the [repository README](../../README.md#install) for each path.

Then ask Claude anything about your calendar. On the first tool call Claude opens the Postify
sign-in page; pick the scopes you want on the consent screen. A tool whose scope you did not
grant is never registered for the session.

## What it connects

Remote MCP server `https://app.usepostify.com/api/mcp` (OAuth 2.1 with PKCE). It reaches 13 tools,
each registered only when you granted its scope:

- Posts and media (`posts:read`): `list_posts`, `get_post`, `get_schedule`, `search_media_library`
- Inbox (`inbox:read`): `list_inbox_items`
- Channels (`channels:read`): `list_channels`
- Analytics (`analytics:read`): `get_analytics`
- Posting times (`ai:generate`, computed from your own history, no AI credits): `suggest_optimal_time`
- API docs (no scope): `search_docs`
- Drafts and scheduling (`posts:write`): `create_draft`, `reschedule_post`
- Publish and delete (`posts:write` plus the gates below): `publish_now`, `delete_post`

`publish_now` and `delete_post` are gated twice: an organization setting that only a signed-in
person can enable, and a confirmation on every call.

By default the server runs in Code Mode: `tools/list` shows two tools, `search_tools` and
`execute_typescript`, and the tools above are called inside `execute_typescript` as
`external_<name>` functions (for example `external_list_posts`) with the same scopes and gates. A
server set to the per-tool surface lists them by name instead. The skills handle both.

## Skills

| Skill | Use it when |
|---|---|
| `managing-content-calendar` | "What's scheduled next week?", "Move Friday's post to Monday 9am", "Where are the gaps?" |
| `drafting-social-posts` | "Draft a LinkedIn post about our 2.0 release" |
| `reviewing-social-performance` | "How did last month go?", "When should I post on Instagram?" |
| `setup-postify` | "Connect Postify to Claude", "Postify tools are missing", "Tool not found" |

## Links

- Docs: https://usepostify.com/docs/connecting-ai-assistants
- Privacy: https://usepostify.com/privacy
- Support: support@devino.ca
