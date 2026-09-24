# Postify plugin for Claude

Draft, schedule, and publish social posts from your Postify calendar.

## Install

```
/plugin marketplace add DevinoSolutions/claude-plugins
/plugin install postify@devino
```

Then ask Claude anything about your calendar. On the first tool call Claude opens the Postify
sign-in page; pick the scopes you want on the consent screen. A tool whose scope you did not
grant is never registered for the session.

## What it connects

Remote MCP server `https://app.usepostify.com/api/mcp` (OAuth 2.1 with PKCE). Tools:
`list_posts`, `get_post`, `list_channels`, `get_analytics`, `search_media_library`,
`search_docs`, `create_draft`, `reschedule_post`, `suggest_optimal_time`, `publish_now`,
`delete_post`.

`publish_now` and `delete_post` are gated twice: an organization setting that only a signed-in
person can enable, and a confirmation on every call.

## Skills

| Skill | Use it when |
|---|---|
| `content-calendar` | "What's scheduled next week?", "Move Friday's post to Monday 9am", "Where are the gaps?" |
| `draft-post` | "Draft a LinkedIn post about our 2.0 release" |
| `performance-review` | "How did last month go?", "When should I post on Instagram?" |

## Links

- Docs: https://usepostify.com/docs/connecting-ai-assistants
- Privacy: https://usepostify.com/privacy
- Support: support@usepostify.com
