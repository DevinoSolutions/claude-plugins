---
name: setup-notifly
description: "Connects the Notifly MCP server to Claude and verifies it with one read-only call: where to connect in claude.ai, Claude Desktop, Cowork, or Claude Code, what the Notifly sign-in and consent screen asks, and how to recover when a tool is missing. Use when the user asks to 'set up Notifly', 'connect Notifly to Claude', 'install the Notifly connector', 'sign in to Notifly', 'why can't Claude see my Notifly data', 'Notifly tools are missing', or reports 'Tool not found' for a Notifly tool."
---
<!-- Generated from plugins/notifly/skills/setup-notifly/SKILL.md by scripts/sync-skills.mjs. Edit the plugin copy, then run the script. -->

# Set up Notifly

Connect the Notifly MCP server, confirm it answers, and fix the usual reasons a Notifly tool is missing. Sign-in and consent always happen in Notifly's own browser page, never in the chat.

- MCP server key: `notifly` (tools are written `notifly:<tool>`)
- MCP server URL: `https://api.notifly.io/mcp` (streamable HTTP, OAuth 2.1 with PKCE)
- Docs: https://notifly.io/docs/connecting-ai-assistants

## Where to connect

### Claude Code with this plugin

1. The plugin already registers the `notifly` server. Run `/mcp`, pick the Notifly server, and choose **Authenticate**, or just ask a Notifly question and follow the sign-in link Claude opens.
2. Without the plugin, add the server by hand: `claude mcp add --transport http notifly https://api.notifly.io/mcp`, then authenticate from `/mcp`.
3. A connector added on claude.ai is also available in Claude Code when you are signed in with the same claude.ai account, so there is no need to connect twice.

### claude.ai, Claude Desktop, and Cowork

1. Open the Notifly listing in the Connectors Directory: https://claude.ai/directory/connectors/notifly and select **Connect**. In the app you can also search the directory for "Notifly".
2. Sign in to Notifly in the page that opens and approve the consent screen.
3. On a Team or Enterprise plan, an Owner may need to approve the connector first; members without that permission see a **Request** button.

## What the sign-in asks

Notifly asks you to sign in, then shows the permissions and asks you to pick the Development or Production environment. The six read tools work as soon as you connect. Sending needs the `org:event:write` scope, an organization dangerous-operations setting that is off by default, and a two-step confirmation. Review and revoke connected assistants under Connected AI apps in your Notifly settings.

## Verify the connection

Make one read-only call and report what came back in a sentence.

Call `notifly:list_workflows` if it is listed by name. If only `notifly:search_tools` and `notifly:execute_typescript` are listed (Code Mode), call `notifly:search_tools`, then run `notifly:execute_typescript` with `return await external_list_workflows({});`. It lists the workflows in the environment you picked. A normal answer means Notifly is connected; say so and continue with the user's task.

## When a tool is missing

Most accounts see Code Mode: `tools/list` shows only `notifly:search_tools` and `notifly:execute_typescript`, and every Notifly tool is called inside the sandbox as `external_<tool>`.

- **"Tool not found" on a named tool:** switch to `notifly:search_tools` then `notifly:execute_typescript` instead of retrying the direct call.
- **`notifly:search_tools` does not return the tool:** its scope was not granted. Ask the user to disconnect and reconnect Notifly and approve that scope on the consent screen.
- **An error naming a setting or a plan:** a Notifly setting or plan gate refused the call. Relay the message and any settings link it carries; do not retry around it.
- **No `notifly` tools at all, or an authentication error:** the connector is not connected or the sign-in expired. Repeat the steps under "Where to connect".

## Rules

- Never ask the user for a Notifly password, API key, or access token in the chat. OAuth happens in the browser.
- Do not change Notifly settings on the user's behalf. Settings that unlock writes are turned on by a signed-in person in Notifly.
- The verification call reads only. Do not create, send, or publish anything while setting up.
