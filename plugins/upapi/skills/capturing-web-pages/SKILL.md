---
name: capturing-web-pages
description: "Captures a web page with upAPI's headless browser: a PNG or JPEG screenshot of the viewport or the full page, or a print-quality PDF of a URL or of raw HTML with paper size, margins and page ranges. Use when the user asks 'take a screenshot of this site', 'capture our pricing page on mobile width', 'save this page as a PDF', 'render this HTML invoice to PDF', or 'how does this page look'. Read-only; each capture costs 20 units of upAPI quota."
---

# upAPI: capturing web pages

Render a page in a real browser and hand the user the image or PDF they asked for.

## Connecting and calling the tools

Every tool in this skill comes from the `upapi` MCP server, the upAPI connector, and is written here as `upapi:<tool>`.

- **Tools listed by name (the plugin's `?tools=claude` surface):** call them directly, for example `upapi:screenshot_post`.
- **Only `upapi:search_ops` and `upapi:call_op` listed (the plain URL's compact table):** call `upapi:call_op` with the slug and input, for example `{ "slug": "screenshot.post", "input": { "url": "https://example.com" } }`.
- **No `upapi` tools at all:** upAPI is not connected yet. Follow the `setup-upapi` skill.

A failed operation comes back as an error result whose text starts with its code, for example `INVALID_INPUT:`.

## Tools you will use

- `upapi:screenshot_post` (slug `screenshot.post`, 20 units): renders a public page in headless Chromium. Input: `url` (required), `fullPage` (default false), `format` (`png` default, or `jpeg` with `quality` 1 to 100), `width` (320 to 3840, default 1280), `height` (320 to 2160, default 800), `waitUntil` (`load` default, `domcontentloaded`, or `networkidle` for lazy-rendered apps), `delayMs` (0 to 5000), `blockAds`. Returns `image` as base64, plus `format`, `width`, `height`, `bytes` and `finalUrl`.
- `upapi:html_to_pdf_post` (slug `html-to-pdf.post`, 20 units): renders a page or a raw HTML document to PDF. Input: exactly one of `url` or `html` (up to 2 MB, with absolute or inline assets), plus `format` (`A4` default, `Letter`, `Legal`), `landscape`, `margin` (`top`, `right`, `bottom`, `left` as CSS lengths), `printBackground` (default true), `scale` (0.1 to 2), `pageRanges` (for example `1-5, 8`), `media` (`screen` default, or `print` for the site's print stylesheet). Returns `pdf` as base64, plus `pages` and `bytes`.

## Workflow

1. Confirm what to capture: the URL (or the HTML), and for a screenshot the width (for example 390 for a phone, 1280 for a laptop) and whether the whole page or just the first screen. For a PDF, the paper size and orientation if the user cares.
2. Call the tool once. Each call costs 20 units, so do not take several variations unless the user asked for them.
3. Deliver the result:
   - **Claude Code:** decode the base64 field and write it to a file the user names, or a clear default such as `screenshot.png` or `page.pdf` in the working directory, then give the path. Never print the base64 into the chat.
   - **claude.ai, Claude Desktop, Cowork:** describe the capture (size in pixels or page count, `bytes`, `finalUrl`). Offer to save it as a file if the app can create one; do not paste the base64 string.
4. If the screenshot looks unfinished (blank areas, spinners), offer one retry with `waitUntil: "networkidle"` or a `delayMs` of 500 to 2000.

## Rules

- Capture only public pages the user asked for. URLs resolving to private, loopback, link-local or cloud-metadata addresses are refused with `INVALID_INPUT`; do not try to work around it.
- `quality` is only for `jpeg`; sending it with `png` is refused.
- On `RATE_LIMITED`, wait the seconds the message gives before one retry. On `QUOTA_EXCEEDED`, stop and tell the user.
