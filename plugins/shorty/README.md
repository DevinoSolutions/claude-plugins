# Shorty plugin for Claude

Summarize and transcribe videos, audio, documents, and web pages, and read your Shorty library.

## Install

```
/plugin marketplace add DevinoSolutions/claude-plugins
/plugin install shorty@devino
```

Then ask Claude about your summaries or give it a link. On the first tool call Claude opens the
Shorty sign-in page; pick the scopes you want on the consent screen. A tool whose scope you did
not grant is never registered for the session.

## What it connects

Remote MCP server `https://aishorty.com/api/mcp` (OAuth 2.1 with PKCE). The host is the apex
domain, not an `app.` subdomain. It reaches 12 tools, each registered only when you granted its
scope:

- Library (`articles:read`): `search_articles`, `list_recent_articles`, `get_article`
- Transcriptions (`transcriptions:read`): `list_transcriptions`, `get_transcription`
- Usage (`usage:read`): `get_usage_quota`
- Jobs (`jobs:read`): `get_job_status`
- Docs (`docs:read`): `search_docs`
- Summaries (`articles:write`, plan quota): `create_youtube_summary`, `create_content_summary`
- Transcripts and subtitles (`transcriptions:write`, plan quota; some subtitle styles need a
  higher plan): `create_transcription`, `create_subtitles`

The four `create_*` tools start queued jobs that take seconds to minutes, fetch the URL you
supply from the open internet, and count against your Shorty plan's quota. Each returns a job
id, and Claude polls `get_job_status` until the job reaches `SUCCESS`, `ERROR`, or `CANCELLED`.
Over this connector Shorty returns job handles and text, never a media file; subtitle files are
downloaded from the Shorty app. No tool deletes or overwrites existing work, and a retried
request does not create a duplicate job.

By default the server runs in Code Mode: `tools/list` shows two tools, `search_tools` and
`execute_typescript`, and the tools above are called inside `execute_typescript` as
`external_<name>` functions (for example `external_search_articles`) with the same scopes and gates. A
server set to the per-tool surface lists them by name instead. The skills handle both.

Consent is re-checked on every tool call, so revoking Shorty under Settings > Connected AI Apps
stops the next call.

## Skills

| Skill | Use it when |
|---|---|
| `summarizing-sources` | "Summarize this YouTube video", "Summarize this article for me", "Turn these notes into a summary" |
| `transcribing-media` | "Transcribe this podcast episode", "Add captions to this clip" |
| `researching-summary-library` | "What did I summarize this week?", "Find my notes about pricing", "How much quota is left?" |
| `setup-shorty` | "Connect Shorty to Claude", "Shorty tools are missing", "Tool not found" |

## Links

- Docs: https://aishorty.com/docs/connecting-ai-assistants
- Privacy: https://aishorty.com/privacy
- Support: support@devino.ca
