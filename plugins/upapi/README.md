# upAPI plugin for Claude

Turn web pages, PDFs, images, and recordings into text Claude can work with: page-to-Markdown,
screenshots, HTML-to-PDF, PDF text, OCR, and transcription, all computed by upAPI itself.

## Install

```
/plugin marketplace add DevinoSolutions/claude-plugins
/plugin install upapi@devino
```

Other ways in: the Claude plugin directory and the `anthropics/claude-plugins-community` marketplace once approved, skills only with `npx skills add DevinoSolutions/claude-plugins --skill setup-upapi`, or the connector alone through a custom connector (Connectors Directory listing pending). See the [repository README](../../README.md#install) for each path.

Then ask Claude to read a page or a document. On the first tool call Claude opens the upAPI
sign-in page. The consent screen names the app asking and the upAPI workspace whose plan and
monthly quota the connection's calls count against; with several workspaces you pick one. A
guest session cannot connect; sign up for a full upAPI account first.

## What it connects

Remote MCP server `https://app.upapi.io/api/mcp?tools=claude` (OAuth 2.1 with PKCE). The
`?tools=claude` table is upAPI's Claude listing: 8 named tools, all computed on upAPI's own
browser, PDF, OCR, and transcription infrastructure, read tools listed apart from the one write
tool:

- Web pages (read): `fetch_markdown_post` (3 units), `screenshot_post` (20 units),
  `html_to_pdf_post` (20 units)
- Documents and images (read): `pdf_extract_text_post` (2 units), `image_ocr_post` (4 units)
- Text (read, no network): `text_analyze_post` (1 unit)
- Transcription: `audio_transcribe_post` (write: starts a GPU job, 10 units) and
  `audio_transcribe_result_get` (read, 1 unit)

Every call spends units of the workspace's monthly quota; each tool's description states its
cost. Screenshots and PDFs come back as base64 bytes, not as files. Transcription takes a public
audio or video URL of up to two hours: short clips return the transcript in the same call,
longer ones return a `jobId` to poll, and a job is kept for 24 hours. PDF, OCR, and transcription
are meant for your own documents and media, not ID documents, medical records, or payment-card
details; upAPI does not keep the file after the call.

A failed operation returns a normal tool result marked as an error, with text that starts with
upAPI's error code, for example `INVALID_INPUT`, `QUOTA_EXCEEDED`, `RATE_LIMITED` (with the wait
in seconds), or `UPSTREAM_UNREACHABLE`.

These tools are listed by name; there is no Code Mode on this surface. The plain URL
`https://app.upapi.io/api/mcp` (the MCP Registry entry `io.github.DevinoSolutions/upapi-mcp`)
serves a compact table instead, `search_ops` and `call_op` plus a few always-on tools, over the
same account and quota. The skills handle both.

Review and revoke connected assistants under Settings > Connected apps in the upAPI dashboard.

## Skills

| Skill | Use it when |
|---|---|
| `reading-web-pages` | "Read this article and summarize it", "Turn https://example.com/blog/launch-post into Markdown" |
| `capturing-web-pages` | "Take a screenshot of our pricing page", "Save this page as a PDF", "Render this HTML invoice to PDF" |
| `extracting-document-text` | "Pull the text out of this PDF", "What does this receipt say?", "Count the words in this draft" |
| `transcribing-recordings` | "Transcribe this podcast episode", "What was said in this video?" |
| `setup-upapi` | "Connect upAPI to Claude", "upAPI tools are missing", "Tool not found" |

## Links

- Docs: https://upapi.io/docs/mcp-clients
- Privacy: https://upapi.io/privacy
- Terms: https://upapi.io/terms
- Support: support@devino.ca
