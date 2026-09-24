---
name: setup-superbooks
description: "Connects the SuperBooks MCP server to Claude and verifies it with one read-only call: where to connect in claude.ai, Claude Desktop, Cowork, or Claude Code, what the SuperBooks sign-in and consent screen asks, and how to recover when a tool is missing. Use when the user asks to 'set up SuperBooks', 'connect SuperBooks to Claude', 'install the SuperBooks connector', 'sign in to SuperBooks', 'why can't Claude see my SuperBooks data', 'SuperBooks tools are missing', or reports 'Tool not found' for a SuperBooks tool."
---

# Set up SuperBooks

Connect the SuperBooks MCP server, confirm it answers, and fix the usual reasons a SuperBooks tool is missing. Sign-in and consent always happen in SuperBooks's own browser page, never in the chat.

- MCP server key: `superbooks` (tools are written `superbooks:<tool>`)
- MCP server URL: `https://api.superbooks.io/mcp` (streamable HTTP, OAuth 2.1 with PKCE)
- Docs: https://docs.superbooks.io/mcp

## Where to connect

### Claude Code with this plugin

1. The plugin already registers the `superbooks` server. Run `/mcp`, pick the SuperBooks server, and choose **Authenticate**, or just ask a SuperBooks question and follow the sign-in link Claude opens.
2. Without the plugin, add the server by hand: `claude mcp add --transport http superbooks https://api.superbooks.io/mcp`, then authenticate from `/mcp`.
3. A connector added on claude.ai is also available in Claude Code when you are signed in with the same claude.ai account, so there is no need to connect twice.

### claude.ai, Claude Desktop, and Cowork

1. SuperBooks is not listed in the Connectors Directory yet, so add it as a custom connector: Settings > Connectors > **Add custom connector**, name it SuperBooks, and paste `https://api.superbooks.io/mcp`. The Free plan allows one custom connector.
2. Sign in to SuperBooks in the page that opens and approve the consent screen.
3. On a Team or Enterprise plan, an Owner may need to approve the connector first; members without that permission see a **Request** button.

## What the sign-in asks

SuperBooks asks you to sign in, then shows the scopes this connection may use. Operations are tiered read, write, and destructive. The eight destructive ones (deletes and voiding an invoice) need full access plus the team setting Settings > AI > "Destructive AI tools", which is off by default. No operation moves money.

## Verify the connection

Make one read-only call and report what came back in a sentence.

Call `superbooks:search_tools` with a query such as `team`, then run `superbooks:execute_typescript` with `return await external_team_get({});`. On a per-tool server, call `superbooks:team_get` directly. It returns the team profile, including its currency. A normal answer means SuperBooks is connected; say so and continue with the user's task.

## When a tool is missing

SuperBooks serves Code Mode by default: `tools/list` shows only `superbooks:search_tools` and `superbooks:execute_typescript`, and every operation is an `external_<operation>` function inside the sandbox.

- **"Tool not found" on a named tool:** switch to `superbooks:search_tools` then `superbooks:execute_typescript` instead of retrying the direct call.
- **`superbooks:search_tools` does not return the tool:** its scope was not granted. Ask the user to disconnect and reconnect SuperBooks and approve that scope on the consent screen.
- **An error naming a setting or a plan:** a SuperBooks setting or plan gate refused the call. Relay the message and any settings link it carries; do not retry around it.
- **No `superbooks` tools at all, or an authentication error:** the connector is not connected or the sign-in expired. Repeat the steps under "Where to connect".

## Rules

- Never ask the user for a SuperBooks password, API key, or access token in the chat. OAuth happens in the browser.
- Do not change SuperBooks settings on the user's behalf. Settings that unlock writes are turned on by a signed-in person in SuperBooks.
- The verification call reads only. Do not create, send, or publish anything while setting up.
