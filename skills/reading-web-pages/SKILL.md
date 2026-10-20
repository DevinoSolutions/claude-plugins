---
name: reading-web-pages
description: "Reads a public web page through upAPI and turns it into clean Markdown Claude can quote, summarize, or compare: article or full-page mode, links and images on or off, length capped. Use when the user asks 'read this article', 'summarize this page', 'turn this URL into Markdown', 'what does this docs page say', 'pull the content from these three links', or pastes a URL and wants its text. Read-only; spends upAPI quota."
---
<!-- Generated from plugins/upapi/skills/reading-web-pages/SKILL.md by scripts/sync-skills.mjs. Edit the plugin copy, then run the script. -->

# upAPI: reading web pages

Fetch a page the user names and work from its real content, not from memory.

## Connecting and calling the tools

Every tool in this skill comes from the `upapi` MCP server, the upAPI connector, and is written here as `upapi:<tool>`.

- **Tools listed by name (the plugin's `?tools=claude` surface):** call them directly, for example `upapi:fetch_markdown_post`.
- **Only `upapi:search_ops` and `upapi:call_op` listed (the plain URL's compact table):** call `upapi:call_op` with the operation's slug and its input, for example `{ "slug": "fetch-markdown.post", "input": { "url": "https://example.com" } }`. Same account, quota and errors.
- **No `upapi` tools at all:** upAPI is not connected yet. Follow the `setup-upapi` skill.

A failed operation comes back as an error result whose text starts with its code, for example `INVALID_INPUT:` or `QUOTA_EXCEEDED:`.

## Tools you will use

- `upapi:fetch_markdown_post` (slug `fetch-markdown.post`, 3 units per call): fetches the page over plain HTTP and converts it to Markdown. Input: `url` (required, absolute http or https), `mode` (`article`, the default, extracts the main content and falls back to the whole page if too much was stripped; `full` keeps the whole body without navigation, footer and forms), `includeLinks` (default true), `includeImages` (default false), `maxChars` (500 to 400000, default 100000), `timeoutMs`. Returns `markdown`, `title`, `byline`, `lang`, `excerpt`, `links`, `finalUrl` and `httpStatus`, and sets `truncated` when it cut the text.

## Workflow

1. Take the URL from the user. If they gave none, ask; never guess an address.
2. Pick the mode: `article` for a blog post, news story or docs page; `full` when the user wants everything on the page (a pricing table, a list page) or `article` came back too short.
3. Call `upapi:fetch_markdown_post`. For several URLs, call it once per URL; each call costs 3 units, so say how many pages you are about to read when the user gives a long list.
4. Check the result: if `finalUrl` differs from the request, say where the page redirected. If `truncated` is set, say so and offer a larger `maxChars`.
5. Answer from the Markdown: summarize, quote, or compare as asked, and cite the page by its title and `finalUrl`.

## When it fails

- **A client-rendered page:** the tool uses no browser, so a page that builds its content in JavaScript comes back as an error, not as empty content. Offer the `capturing-web-pages` skill for a screenshot instead.
- **`INVALID_INPUT`:** private, loopback and link-local addresses are refused, and the URL must be absolute. Fix the input; do not retry the same call.
- **`RATE_LIMITED`:** wait the number of seconds the message gives before one retry.
- **`QUOTA_EXCEEDED`:** the workspace's monthly quota is spent. Tell the user; do not retry.

## Rules

- Report only what the page returned. If the content does not answer the question, say so rather than filling the gap.
- Do not fetch pages behind the user's own login, or pages they did not ask for.
