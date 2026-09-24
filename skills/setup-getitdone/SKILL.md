---
name: setup-getitdone
description: "Connects the GetItDone MCP server to Claude and verifies it with one read-only call: where to connect in claude.ai, Claude Desktop, Cowork, or Claude Code, what the GetItDone sign-in and consent screen asks, and how to recover when a tool is missing. Use when the user asks to 'set up GetItDone', 'connect GetItDone to Claude', 'install the GetItDone connector', 'sign in to GetItDone', 'why can't Claude see my GetItDone data', 'GetItDone tools are missing', or reports 'Tool not found' for a GetItDone tool."
---
<!-- Generated from plugins/getitdone/skills/setup-getitdone/SKILL.md by scripts/sync-skills.mjs. Edit the plugin copy, then run the script. -->

# Set up GetItDone

Connect the GetItDone MCP server, confirm it answers, and fix the usual reasons a GetItDone tool is missing. Sign-in and consent always happen in GetItDone's own browser page, never in the chat.

- MCP server key: `getitdone` (tools are written `getitdone:<tool>`)
- MCP server URL: `https://app.nowgetitdone.com/api/mcp` (streamable HTTP, OAuth 2.1 with PKCE)
- Docs: https://nowgetitdone.com/docs/connecting-ai-assistants

## Where to connect

### Claude Code with this plugin

1. The plugin already registers the `getitdone` server. Run `/mcp`, pick the GetItDone server, and choose **Authenticate**, or just ask a GetItDone question and follow the sign-in link Claude opens.
2. Without the plugin, add the server by hand: `claude mcp add --transport http getitdone https://app.nowgetitdone.com/api/mcp`, then authenticate from `/mcp`.
3. A connector added on claude.ai is also available in Claude Code when you are signed in with the same claude.ai account, so there is no need to connect twice.

### claude.ai, Claude Desktop, and Cowork

1. Open the GetItDone listing in the Connectors Directory: https://claude.ai/directory/connectors/getitdone and select **Connect**. In the app you can also search the directory for "GetItDone".
2. Sign in to GetItDone in the page that opens and approve the consent screen.
3. On a Team or Enterprise plan, an Owner may need to approve the connector first; members without that permission see a **Request** button.

## What the sign-in asks

GetItDone asks you to sign in, then shows the scopes this connection may use: workspaces and docs, projects, tasks, and task changes. Archiving is the only removal and is reversible in the web app; nothing permanently deletes a task.

## Verify the connection

Make one read-only call and report what came back in a sentence.

Call `getitdone:list_workspaces` if it is listed by name. If only `getitdone:search_tools` and `getitdone:execute_typescript` are listed (Code Mode), call `getitdone:search_tools`, then run `getitdone:execute_typescript` with `return await external_list_workspaces({});`. It lists the workspaces you belong to. A normal answer means GetItDone is connected; say so and continue with the user's task.

## When a tool is missing

Most accounts see Code Mode: `tools/list` shows only `getitdone:search_tools` and `getitdone:execute_typescript`, and every GetItDone tool is called inside the sandbox as `external_<tool>`.

- **"Tool not found" on a named tool:** switch to `getitdone:search_tools` then `getitdone:execute_typescript` instead of retrying the direct call.
- **`getitdone:search_tools` does not return the tool:** its scope was not granted. Ask the user to disconnect and reconnect GetItDone and approve that scope on the consent screen.
- **An error naming a setting or a plan:** a GetItDone setting or plan gate refused the call. Relay the message and any settings link it carries; do not retry around it.
- **No `getitdone` tools at all, or an authentication error:** the connector is not connected or the sign-in expired. Repeat the steps under "Where to connect".

## Rules

- Never ask the user for a GetItDone password, API key, or access token in the chat. OAuth happens in the browser.
- Do not change GetItDone settings on the user's behalf. Settings that unlock writes are turned on by a signed-in person in GetItDone.
- The verification call reads only. Do not create, send, or publish anything while setting up.
