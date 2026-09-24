---
name: setup-unotes
description: "Connects the uNotes MCP server to Claude and verifies it with one read-only call: where to connect in claude.ai, Claude Desktop, Cowork, or Claude Code, what the uNotes sign-in and consent screen asks, and how to recover when a tool is missing. Use when the user asks to 'set up uNotes', 'connect uNotes to Claude', 'install the uNotes connector', 'sign in to uNotes', 'why can't Claude see my uNotes data', 'uNotes tools are missing', or reports 'Tool not found' for a uNotes tool."
---

# Set up uNotes

Connect the uNotes MCP server, confirm it answers, and fix the usual reasons a uNotes tool is missing. Sign-in and consent always happen in uNotes's own browser page, never in the chat.

- MCP server key: `unotes` (tools are written `unotes:<tool>`)
- MCP server URL: `https://unotes.net/api/mcp` (streamable HTTP, OAuth 2.1 with PKCE)
- Docs: https://unotes.net/docs/connecting-ai-assistants

## Where to connect

### Claude Code with this plugin

1. The plugin already registers the `unotes` server. Run `/mcp`, pick the uNotes server, and choose **Authenticate**, or just ask a uNotes question and follow the sign-in link Claude opens.
2. Without the plugin, add the server by hand: `claude mcp add --transport http unotes https://unotes.net/api/mcp`, then authenticate from `/mcp`.
3. A connector added on claude.ai is also available in Claude Code when you are signed in with the same claude.ai account, so there is no need to connect twice.

### claude.ai, Claude Desktop, and Cowork

1. Open the uNotes listing in the Connectors Directory: https://claude.ai/directory/connectors/unotes and select **Connect**. In the app you can also search the directory for "uNotes".
2. Sign in to uNotes in the page that opens and approve the consent screen.
3. On a Team or Enterprise plan, an Owner may need to approve the connector first; members without that permission see a **Request** button.

## What the sign-in asks

uNotes asks you to sign in, then shows read scopes only: library search, schools and courses, documents, flashcards, quizzes, study streak, and quota. There are no write scopes, so nothing in your account can be created, changed, or deleted over this connector.

## Verify the connection

Make one read-only call and report what came back in a sentence.

Call `unotes:get_quota_status`. If only `unotes:search_tools` and `unotes:execute_typescript` are listed, call `unotes:search_tools`, then run `unotes:execute_typescript` with `return await external_get_quota_status({});`. It returns the plan tier and per-feature quota; reading quota uses none. A normal answer means uNotes is connected; say so and continue with the user's task.

## When a tool is missing

uNotes lists its tools by name today. If a later server lists only `unotes:search_tools` and `unotes:execute_typescript`, every tool is called inside the sandbox as `external_<tool>`.

- **"Tool not found" on a named tool:** switch to `unotes:search_tools` then `unotes:execute_typescript` instead of retrying the direct call.
- **`unotes:search_tools` does not return the tool:** its scope was not granted. Ask the user to disconnect and reconnect uNotes and approve that scope on the consent screen.
- **An error naming a setting or a plan:** a uNotes setting or plan gate refused the call. Relay the message and any settings link it carries; do not retry around it.
- **No `unotes` tools at all, or an authentication error:** the connector is not connected or the sign-in expired. Repeat the steps under "Where to connect".

## Rules

- Never ask the user for a uNotes password, API key, or access token in the chat. OAuth happens in the browser.
- Do not change uNotes settings on the user's behalf. Settings that unlock writes are turned on by a signed-in person in uNotes.
- The verification call reads only. Do not create, send, or publish anything while setting up.
