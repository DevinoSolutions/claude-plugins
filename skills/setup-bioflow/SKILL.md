---
name: setup-bioflow
description: "Connects the BioFlow MCP server to Claude and verifies it with one read-only call: where to connect in claude.ai, Claude Desktop, Cowork, or Claude Code, what the BioFlow sign-in and consent screen asks, and how to recover when a tool is missing. Use when the user asks to 'set up BioFlow', 'connect BioFlow to Claude', 'install the BioFlow connector', 'sign in to BioFlow', 'why can't Claude see my BioFlow data', 'BioFlow tools are missing', or reports 'Tool not found' for a BioFlow tool."
---
<!-- Generated from plugins/bioflow/skills/setup-bioflow/SKILL.md by scripts/sync-skills.mjs. Edit the plugin copy, then run the script. -->

# Set up BioFlow

Connect the BioFlow MCP server, confirm it answers, and fix the usual reasons a BioFlow tool is missing. Sign-in and consent always happen in BioFlow's own browser page, never in the chat.

- MCP server key: `bioflow` (tools are written `bioflow:<tool>`)
- MCP server URL: `https://app.getbioflow.com/api/mcp` (streamable HTTP, OAuth 2.1 with PKCE)
- Docs: https://getbioflow.com/docs/connecting-ai-assistants

## Where to connect

### Claude Code with this plugin

1. The plugin already registers the `bioflow` server. Run `/mcp`, pick the BioFlow server, and choose **Authenticate**, or just ask a BioFlow question and follow the sign-in link Claude opens.
2. Without the plugin, add the server by hand: `claude mcp add --transport http bioflow https://app.getbioflow.com/api/mcp`, then authenticate from `/mcp`.
3. A connector added on claude.ai is also available in Claude Code when you are signed in with the same claude.ai account, so there is no need to connect twice.

### claude.ai, Claude Desktop, and Cowork

1. Open the BioFlow listing in the Connectors Directory: https://claude.ai/directory/connectors/bioflow and select **Connect**. In the app you can also search the directory for "BioFlow".
2. Sign in to BioFlow in the page that opens and approve the consent screen.
3. On a Team or Enterprise plan, an Owner may need to approve the connector first; members without that permission see a **Request** button.

## What the sign-in asks

BioFlow asks you to sign in, then shows the scopes this connection may use: pages, analytics, contacts, files, draft edits, and publishing. Draft edits never touch the live page. Publishing also needs the workspace "dangerous operations" setting (Settings, Connected AI apps), which is off by default, plus a two-step call that previews what goes live.

## Verify the connection

Make one read-only call and report what came back in a sentence.

Call `bioflow:page.list` if it is listed by name. If only `bioflow:search_tools` and `bioflow:execute_typescript` are listed (Code Mode), call `bioflow:search_tools`, then run `bioflow:execute_typescript` with `return await external_page_list({});` (dots become underscores in Code Mode). It lists your pages with their publish status. A normal answer means BioFlow is connected; say so and continue with the user's task.

## When a tool is missing

Most accounts see Code Mode: `tools/list` shows only `bioflow:search_tools` and `bioflow:execute_typescript`, and every BioFlow tool is called inside the sandbox as `external_<tool>` with dots swapped for underscores (`page.list` becomes `external_page_list`).

- **"Tool not found" on a named tool:** switch to `bioflow:search_tools` then `bioflow:execute_typescript` instead of retrying the direct call.
- **`bioflow:search_tools` does not return the tool:** its scope was not granted. Ask the user to disconnect and reconnect BioFlow and approve that scope on the consent screen.
- **An error naming a setting or a plan:** a BioFlow setting or plan gate refused the call. Relay the message and any settings link it carries; do not retry around it.
- **No `bioflow` tools at all, or an authentication error:** the connector is not connected or the sign-in expired. Repeat the steps under "Where to connect".

## Rules

- Never ask the user for a BioFlow password, API key, or access token in the chat. OAuth happens in the browser.
- Do not change BioFlow settings on the user's behalf. Settings that unlock writes are turned on by a signed-in person in BioFlow.
- The verification call reads only. Do not create, send, or publish anything while setting up.
