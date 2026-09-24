---
name: setup-shorty
description: "Connects the Shorty MCP server to Claude and verifies it with one read-only call: where to connect in claude.ai, Claude Desktop, Cowork, or Claude Code, what the Shorty sign-in and consent screen asks, and how to recover when a tool is missing. Use when the user asks to 'set up Shorty', 'connect Shorty to Claude', 'install the Shorty connector', 'sign in to Shorty', 'why can't Claude see my Shorty data', 'Shorty tools are missing', or reports 'Tool not found' for a Shorty tool."
---

# Set up Shorty

Connect the Shorty MCP server, confirm it answers, and fix the usual reasons a Shorty tool is missing. Sign-in and consent always happen in Shorty's own browser page, never in the chat.

- MCP server key: `shorty` (tools are written `shorty:<tool>`)
- MCP server URL: `https://aishorty.com/api/mcp` (streamable HTTP, OAuth 2.1 with PKCE)
- Docs: https://aishorty.com/docs/connecting-ai-assistants

## Where to connect

### Claude Code with this plugin

1. The plugin already registers the `shorty` server. Run `/mcp`, pick the Shorty server, and choose **Authenticate**, or just ask a Shorty question and follow the sign-in link Claude opens.
2. Without the plugin, add the server by hand: `claude mcp add --transport http shorty https://aishorty.com/api/mcp`, then authenticate from `/mcp`.
3. A connector added on claude.ai is also available in Claude Code when you are signed in with the same claude.ai account, so there is no need to connect twice.

### claude.ai, Claude Desktop, and Cowork

1. Open the Shorty listing in the Connectors Directory: https://claude.ai/directory/connectors/shorty and select **Connect**. In the app you can also search the directory for "Shorty".
2. Sign in to Shorty in the page that opens and approve the consent screen.
3. On a Team or Enterprise plan, an Owner may need to approve the connector first; members without that permission see a **Request** button.

## What the sign-in asks

Shorty asks you to sign in (the sign-in page is `/login`), then shows the scopes this connection may use: library, transcriptions, usage, jobs, docs, and the write scopes that start summary, transcript, and subtitle jobs. The write scopes use your plan quota. Consent is re-checked on every call, and you can revoke it under Settings > Connected AI Apps in Shorty.

## Verify the connection

Make one read-only call and report what came back in a sentence.

Call `shorty:get_usage_quota` if it is listed by name. If only `shorty:search_tools` and `shorty:execute_typescript` are listed (Code Mode), call `shorty:search_tools`, then run `shorty:execute_typescript` with `return await external_get_usage_quota({});`. It returns the plan tier and remaining allowance. A normal answer means Shorty is connected; say so and continue with the user's task.

## When a tool is missing

Most accounts see Code Mode: `tools/list` shows only `shorty:search_tools` and `shorty:execute_typescript`, and every Shorty tool is called inside the sandbox as `external_<tool>`.

- **"Tool not found" on a named tool:** switch to `shorty:search_tools` then `shorty:execute_typescript` instead of retrying the direct call.
- **`shorty:search_tools` does not return the tool:** its scope was not granted. Ask the user to disconnect and reconnect Shorty and approve that scope on the consent screen.
- **An error naming a setting or a plan:** a Shorty setting or plan gate refused the call. Relay the message and any settings link it carries; do not retry around it.
- **No `shorty` tools at all, or an authentication error:** the connector is not connected or the sign-in expired. Repeat the steps under "Where to connect".

## Rules

- Never ask the user for a Shorty password, API key, or access token in the chat. OAuth happens in the browser.
- Do not change Shorty settings on the user's behalf. Settings that unlock writes are turned on by a signed-in person in Shorty.
- The verification call reads only. Do not create, send, or publish anything while setting up.
