---
name: setup-upapi
description: "Connects the upAPI MCP server to Claude and verifies it with one cheap call: where to connect in claude.ai, Claude Desktop, Cowork, or Claude Code, what the upAPI sign-in and consent screen asks, which tool table to expect, and how to recover when a tool is missing. Use when the user asks to 'set up upAPI', 'connect upAPI to Claude', 'install the upAPI connector', 'sign in to upAPI', 'upAPI tools are missing', or reports 'Tool not found' for an upAPI tool."
---
<!-- Generated from plugins/upapi/skills/setup-upapi/SKILL.md by scripts/sync-skills.mjs. Edit the plugin copy, then run the script. -->

# Set up upAPI

Connect the upAPI MCP server, confirm it answers, and fix the usual reasons an upAPI tool is missing. Sign-in and consent always happen in upAPI's own browser page, never in the chat.

- MCP server key: `upapi` (tools are written `upapi:<tool>`)
- MCP server URL: `https://app.upapi.io/api/mcp?tools=claude` (streamable HTTP, OAuth 2.1 with PKCE)
- Docs: https://upapi.io/docs/mcp-clients

## Where to connect

### Claude Code with this plugin

1. The plugin already registers the `upapi` server. Run `/mcp`, pick the upAPI server, and choose **Authenticate**, or just ask Claude to read a page and follow the sign-in link it opens.
2. Without the plugin, add the server by hand: `claude mcp add --transport http upapi 'https://app.upapi.io/api/mcp?tools=claude'` (keep the quotes so the shell leaves the `?` alone), then authenticate from `/mcp`.
3. A connector added on claude.ai is also available in Claude Code when you are signed in with the same claude.ai account, so there is no need to connect twice.

### claude.ai, Claude Desktop, and Cowork

1. upAPI is not in the Connectors Directory yet. Go to Settings > Connectors, select **Add custom connector**, name it upAPI, and paste `https://app.upapi.io/api/mcp?tools=claude`.
2. Sign in to upAPI in the page that opens and approve the consent screen.
3. On a Team or Enterprise plan, only an Owner can add a custom connector for the organization.

## What the sign-in asks

upAPI asks you to sign in, then shows which app is asking and which workspace's plan and monthly quota its calls count against; with several workspaces you pick one. A guest session cannot connect (`GUEST_FORBIDDEN`); the user signs up for a full account first. Review and revoke connected assistants under Settings > Connected apps in the upAPI dashboard.

## Verify the connection

Make one call and report what came back in a sentence.

Call `upapi:text_analyze_post` with `{ "text": "upAPI is connected." }`. It runs without network access and costs 1 unit. If only `upapi:search_ops` and `upapi:call_op` are listed, call `upapi:call_op` with `{ "slug": "text-analyze.post", "input": { "text": "upAPI is connected." } }` instead. A word count in the answer means upAPI is connected; say so and continue with the user's task.

## When a tool is missing

- **Only `upapi:search_ops` and `upapi:call_op` (plus a few other tools) are listed:** the connector was added with the plain URL `https://app.upapi.io/api/mcp`, which serves the compact table. Every skill works through `upapi:call_op` with the operation's slug. To get the named tools, re-add the connector with `?tools=claude`.
- **Only `upapi:search_ops` is listed:** the connection's grant does not include running operations. Disconnect and reconnect upAPI; if only `upapi:search_ops` is still listed, contact support@devino.ca.
- **`ORGANIZATION_ACCESS_ENDED`:** the user left the workspace this connection was approved for. Reconnect and choose another workspace.
- **`UNAUTHORIZED`, an authentication error, or no `upapi` tools at all:** the connector is not connected or the sign-in expired. Repeat the steps under "Where to connect".
- **`AUTH_UNAVAILABLE`:** upAPI's sign-in check is briefly down. Wait and retry; do not reconnect.

## Rules

- Never ask the user for an upAPI password, API key, or access token in the chat. OAuth happens in the browser.
- Do not change upAPI settings or plans on the user's behalf.
- Setup makes only the one verification call above. Do not start a transcription or a capture while setting up.
