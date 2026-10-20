---
name: extracting-document-text
description: "Pulls text out of documents and images with upAPI: extracts a PDF's text (by URL or upload, page ranges, tables as Markdown), reads the text in an image with OCR (lines with confidence and position), and counts characters, words, lines and sentences with a SHA-256 digest. Use when the user asks 'get the text out of this PDF', 'what does page 3 of this report say', 'extract the tables from this PDF', 'read this receipt', 'OCR this screenshot', or 'how many words is this'. Read-only; spends upAPI quota."
---
<!-- Generated from plugins/upapi/skills/extracting-document-text/SKILL.md by scripts/sync-skills.mjs. Edit the plugin copy, then run the script. -->

# upAPI: extracting document text

Turn a PDF or an image into text, then answer from that text.

## Connecting and calling the tools

Every tool in this skill comes from the `upapi` MCP server, the upAPI connector, and is written here as `upapi:<tool>`.

- **Tools listed by name (the plugin's `?tools=claude` surface):** call them directly, for example `upapi:pdf_extract_text_post`.
- **Only `upapi:search_ops` and `upapi:call_op` listed (the plain URL's compact table):** call `upapi:call_op` with the slug and input, for example `{ "slug": "pdf-extract-text.post", "input": { "url": "https://example.com/report.pdf" } }`.
- **No `upapi` tools at all:** upAPI is not connected yet. Follow the `setup-upapi` skill.

A failed operation comes back as an error result whose text starts with its code, for example `INVALID_INPUT:`.

## Tools you will use

- `upapi:pdf_extract_text_post` (slug `pdf-extract-text.post`, 2 units): extracts a PDF's text. Input: `url` of a public PDF or `file` as base64 (no `data:` prefix, at most 3.7 MB decoded), not both; `pages` (1-based, for example `1-5,8`); `tables` (default false; slower, returns each detected table as Markdown).
- `upapi:image_ocr_post` (slug `image-ocr.post`, 4 units): reads the text in an image. Input: `url` or `file` as base64 (at most 3.7 MB decoded), not both; `languages` (`en` and `ch` are supported, one model covers Latin and Chinese). Returns the full text plus every line with its confidence and bounding box.
- `upapi:text_analyze_post` (slug `text-analyze.post`, 1 unit): counts characters, words, lines, sentences and bytes of a `text`, and returns its SHA-256 digest. Runs without network access.

## Workflow

1. Find the source. A public URL is best. A local file works in Claude Code: read it, base64-encode it, and send it as `file` if it is under 3.7 MB; for anything larger ask for a URL.
2. For a PDF, set `pages` when the user asks about part of it, and set `tables: true` only when they want tables.
3. For an image (a receipt, a scanned page, a screenshot of text), call `upapi:image_ocr_post`. Mention low-confidence lines when they matter to the answer.
4. Answer from the extracted text: quote, summarize, or pull out the fields the user asked for. Say which pages or lines you used.
5. For "how long is this" questions, call `upapi:text_analyze_post` on the text and report its counts rather than estimating.

## Rules

- These tools are for the user's own documents and media. Do not run them on ID documents, medical records, or payment-card details. upAPI does not keep the file after the call; the extracted text may sit in its response cache for up to 24 hours.
- A scanned PDF with no text layer returns little or no text; say so and offer OCR on page images instead of guessing the content.
- On `RATE_LIMITED`, wait the seconds the message gives before one retry. On `QUOTA_EXCEEDED`, stop and tell the user.
