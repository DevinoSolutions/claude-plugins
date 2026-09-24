---
name: setup-uptimely
description: "Connects the Uptimely MCP server to Claude and verifies it with one read-only call: where to connect in claude.ai, Claude Desktop, Cowork, or Claude Code, what the Uptimely sign-in and consent screen asks, and how to recover when a tool is missing. Use when the user asks to 'set up Uptimely', 'connect Uptimely to Claude', 'install the Uptimely connector', 'sign in to Uptimely', 'why can't Claude see my Uptimely data', 'Uptimely tools are missing', or reports 'Tool not found' for a Uptimely tool."
---
<!-- Generated from plugins/uptimely/skills/setup-uptimely/SKILL.md by scripts/sync-skills.mjs. Edit the plugin copy, then run the script. -->

# Set up Uptimely

Connect the Uptimely MCP server, confirm it answers, and fix the usual reasons a Uptimely tool is missing. Sign-in and consent always happen in Uptimely's own browser page, never in the chat.

- MCP server key: `uptimely` (tools are written `uptimely:<tool>`)
- MCP server URL: `https://app.getuptimely.com/api/mcp` (streamable HTTP, OAuth 2.1 with PKCE)
- Docs: https://getuptimely.com

## Where to connect

### Claude Code with this plugin

1. The plugin already registers the `uptimely` server. Run `/mcp`, pick the Uptimely server, and choose **Authenticate**, or just ask a Uptimely question and follow the sign-in link Claude opens.
2. Without the plugin, add the server by hand: `claude mcp add --transport http uptimely https://app.getuptimely.com/api/mcp`, then authenticate from `/mcp`.
3. A connector added on claude.ai is also available in Claude Code when you are signed in with the same claude.ai account, so there is no need to connect twice.

### claude.ai, Claude Desktop, and Cowork

1. Open the Uptimely listing in the Connectors Directory: https://claude.ai/directory/connectors/uptimely and select **Connect**. In the app you can also search the directory for "Uptimely".
2. Sign in to Uptimely in the page that opens and approve the consent screen.
3. On a Team or Enterprise plan, an Owner may need to approve the connector first; members without that permission see a **Request** button.

## What the sign-in asks

Uptimely asks you to sign in, then shows read scopes (projects, monitors, incidents, alerts, maintenance, on-call, status pages, telemetry) and write scopes (monitors, incidents, alerts). Write tools stay inert until a project owner turns on Allow AI write operations under Settings > API Keys; it is off by default. Review and revoke connected assistants under Connected AI apps in your Uptimely user settings.

## Verify the connection

Make one read-only call and report what came back in a sentence.

Call `uptimely:uptimely_project_list` if it is listed by name. If only `uptimely:search_tools` and `uptimely:execute_typescript` are listed (Code Mode), call `uptimely:search_tools`, then run `uptimely:execute_typescript` with `return await external_uptimely_project_list({});`. It returns the projects this connection can reach. A normal answer means Uptimely is connected; say so and continue with the user's task.

## When a tool is missing

Most accounts see Code Mode: `tools/list` shows only `uptimely:search_tools` and `uptimely:execute_typescript`, and every Uptimely tool is called inside the sandbox as `external_<tool>`.

- **"Tool not found" on a named tool:** switch to `uptimely:search_tools` then `uptimely:execute_typescript` instead of retrying the direct call.
- **`uptimely:search_tools` does not return the tool:** its scope was not granted. Ask the user to disconnect and reconnect Uptimely and approve that scope on the consent screen.
- **An error naming a setting or a plan:** a Uptimely setting or plan gate refused the call. Relay the message and any settings link it carries; do not retry around it.
- **No `uptimely` tools at all, or an authentication error:** the connector is not connected or the sign-in expired. Repeat the steps under "Where to connect".

## Rules

- Never ask the user for a Uptimely password, API key, or access token in the chat. OAuth happens in the browser.
- Do not change Uptimely settings on the user's behalf. Settings that unlock writes are turned on by a signed-in person in Uptimely.
- The verification call reads only. Do not create, send, or publish anything while setting up.
