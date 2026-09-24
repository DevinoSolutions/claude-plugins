---
name: setup-postify
description: "Connects the Postify MCP server to Claude and verifies it with one read-only call: where to connect in claude.ai, Claude Desktop, Cowork, or Claude Code, what the Postify sign-in and consent screen asks, and how to recover when a tool is missing. Use when the user asks to 'set up Postify', 'connect Postify to Claude', 'install the Postify connector', 'sign in to Postify', 'why can't Claude see my Postify data', 'Postify tools are missing', or reports 'Tool not found' for a Postify tool."
---

# Set up Postify

Connect the Postify MCP server, confirm it answers, and fix the usual reasons a Postify tool is missing. Sign-in and consent always happen in Postify's own browser page, never in the chat.

- MCP server key: `postify` (tools are written `postify:<tool>`)
- MCP server URL: `https://app.usepostify.com/api/mcp` (streamable HTTP, OAuth 2.1 with PKCE)
- Docs: https://usepostify.com/docs/connecting-ai-assistants

## Where to connect

### Claude Code with this plugin

1. The plugin already registers the `postify` server. Run `/mcp`, pick the Postify server, and choose **Authenticate**, or just ask a Postify question and follow the sign-in link Claude opens.
2. Without the plugin, add the server by hand: `claude mcp add --transport http postify https://app.usepostify.com/api/mcp`, then authenticate from `/mcp`.
3. A connector added on claude.ai is also available in Claude Code when you are signed in with the same claude.ai account, so there is no need to connect twice.

### claude.ai, Claude Desktop, and Cowork

1. Open the Postify listing in the Connectors Directory: https://claude.ai/directory/connectors/postify and select **Connect**. In the app you can also search the directory for "Postify".
2. Sign in to Postify in the page that opens and approve the consent screen.
3. On a Team or Enterprise plan, an Owner may need to approve the connector first; members without that permission see a **Request** button.

## What the sign-in asks

Postify asks you to sign in, then shows the scopes this connection may use (posts, inbox, channels, analytics, posting-time suggestions, and draft or schedule changes). Untick anything you do not want; a tool whose scope you did not grant is never registered. Publishing now and deleting posts also need an organization setting that only a signed-in person can turn on, plus a confirmation on every call.

## Verify the connection

Make one read-only call and report what came back in a sentence.

Call `postify:list_channels` if it is listed by name. If only `postify:search_tools` and `postify:execute_typescript` are listed (Code Mode), call `postify:search_tools`, then run `postify:execute_typescript` with `return await external_list_channels({});`. It lists the connected social accounts. A normal answer means Postify is connected; say so and continue with the user's task.

## When a tool is missing

Most accounts see Code Mode: `tools/list` shows only `postify:search_tools` and `postify:execute_typescript`, and every Postify tool is called inside the sandbox as `external_<tool>`.

- **"Tool not found" on a named tool:** switch to `postify:search_tools` then `postify:execute_typescript` instead of retrying the direct call.
- **`postify:search_tools` does not return the tool:** its scope was not granted. Ask the user to disconnect and reconnect Postify and approve that scope on the consent screen.
- **An error naming a setting or a plan:** a Postify setting or plan gate refused the call. Relay the message and any settings link it carries; do not retry around it.
- **No `postify` tools at all, or an authentication error:** the connector is not connected or the sign-in expired. Repeat the steps under "Where to connect".

## Rules

- Never ask the user for a Postify password, API key, or access token in the chat. OAuth happens in the browser.
- Do not change Postify settings on the user's behalf. Settings that unlock writes are turned on by a signed-in person in Postify.
- The verification call reads only. Do not create, send, or publish anything while setting up.
