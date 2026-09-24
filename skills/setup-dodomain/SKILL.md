---
name: setup-dodomain
description: "Connects the doDomain MCP server to Claude and verifies it with one read-only call: where to connect in claude.ai, Claude Desktop, Cowork, or Claude Code, what the doDomain sign-in and consent screen asks, and how to recover when a tool is missing. Use when the user asks to 'set up doDomain', 'connect doDomain to Claude', 'install the doDomain connector', 'sign in to doDomain', 'why can't Claude see my doDomain data', 'doDomain tools are missing', or reports 'Tool not found' for a doDomain tool."
---
<!-- Generated from plugins/dodomain/skills/setup-dodomain/SKILL.md by scripts/sync-skills.mjs. Edit the plugin copy, then run the script. -->

# Set up doDomain

Connect the doDomain MCP server, confirm it answers, and fix the usual reasons a doDomain tool is missing. Sign-in and consent always happen in doDomain's own browser page, never in the chat.

- MCP server key: `dodomain` (tools are written `dodomain:<tool>`)
- MCP server URL: `https://app.dodomain.io/api/mcp` (streamable HTTP, OAuth 2.1 with PKCE)
- Docs: https://dodomain.io/docs/connecting-ai-assistants

## Where to connect

### Claude Code with this plugin

1. The plugin already registers the `dodomain` server. Run `/mcp`, pick the doDomain server, and choose **Authenticate**, or just ask a doDomain question and follow the sign-in link Claude opens.
2. Without the plugin, add the server by hand: `claude mcp add --transport http dodomain https://app.dodomain.io/api/mcp`, then authenticate from `/mcp`.
3. A connector added on claude.ai is also available in Claude Code when you are signed in with the same claude.ai account, so there is no need to connect twice.

### claude.ai, Claude Desktop, and Cowork

1. Open the doDomain listing in the Connectors Directory: https://claude.ai/directory/connectors/dodomain and select **Connect**. In the app you can also search the directory for "doDomain".
2. Sign in to doDomain in the page that opens and approve the consent screen.
3. On a Team or Enterprise plan, an Owner may need to approve the connector first; members without that permission see a **Request** button.

## What the sign-in asks

doDomain asks you to sign in, then shows the scopes this connection may use: domain pre-flight, apps, connections, connect sessions, and the write scopes that start sessions and queue rechecks. Starting a connect session uses one unit of your monthly connection quota. Secret API keys and billing are never reachable over the connector.

## Verify the connection

Make one read-only call and report what came back in a sentence.

Call `dodomain:list_apps` if it is listed by name. If only `dodomain:search_tools` and `dodomain:execute_typescript` are listed (Code Mode), call `dodomain:search_tools`, then run `dodomain:execute_typescript` with `return await external_list_apps({});`. It lists the apps on your doDomain team. A normal answer means doDomain is connected; say so and continue with the user's task.

## When a tool is missing

Most accounts see Code Mode: `tools/list` shows only `dodomain:search_tools` and `dodomain:execute_typescript`, and every doDomain tool is called inside the sandbox as `external_<tool>`.

- **"Tool not found" on a named tool:** switch to `dodomain:search_tools` then `dodomain:execute_typescript` instead of retrying the direct call.
- **`dodomain:search_tools` does not return the tool:** its scope was not granted. Ask the user to disconnect and reconnect doDomain and approve that scope on the consent screen.
- **An error naming a setting or a plan:** a doDomain setting or plan gate refused the call. Relay the message and any settings link it carries; do not retry around it.
- **No `dodomain` tools at all, or an authentication error:** the connector is not connected or the sign-in expired. Repeat the steps under "Where to connect".

## Rules

- Never ask the user for a doDomain password, API key, or access token in the chat. OAuth happens in the browser.
- Do not change doDomain settings on the user's behalf. Settings that unlock writes are turned on by a signed-in person in doDomain.
- The verification call reads only. Do not create, send, or publish anything while setting up.
