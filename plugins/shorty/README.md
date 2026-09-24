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
domain, not an `app.` subdomain. Tools:
`search_articles`, `list_recent_articles`, `get_article`, `list_transcriptions`,
`get_transcription`, `get_usage_quota`, `get_job_status`, `search_docs`,
`create_youtube_summary`, `create_content_summary`, `create_transcription`, `create_subtitles`.

The four `create_*` tools start queued jobs that take seconds to minutes, fetch the URL you
supply from the open internet, and count against your Shorty plan's quota. Each returns a job
id, and Claude polls `get_job_status` until the job reaches `SUCCESS`, `ERROR`, or `CANCELLED`.
Over this connector Shorty returns job handles and text, never a media file; subtitle files are
downloaded from the Shorty app. No tool deletes or overwrites existing work, and a retried
request does not create a duplicate job.

Consent is re-checked on every tool call, so revoking Shorty under Settings > Connected AI Apps
stops the next call.

## Skills

| Skill | Use it when |
|---|---|
| `summarize-source` | "Summarize this YouTube video", "Summarize this article for me", "Turn these notes into a summary" |
| `transcribe-media` | "Transcribe this podcast episode", "Add captions to this clip" |
| `library-research` | "What did I summarize this week?", "Find my notes about pricing", "How much quota is left?" |

## Links

- Docs: https://aishorty.com/docs/connecting-ai-assistants
- Privacy: https://aishorty.com/privacy
- Support: https://aishorty.com/support
