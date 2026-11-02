---
name: setup-demofy
description: "Connects the Demofy MCP server to Claude and verifies it with one read-only call: where to connect in claude.ai, Claude Desktop, Cowork, or Claude Code, what the Demofy sign-in and permission screens ask, and how to recover when a tool is missing or a permission was not granted. Use when the user asks to 'set up Demofy', 'connect Demofy to Claude', 'install the Demofy connector', 'sign in to Demofy', 'why can't Claude see my Demofy demos', 'Demofy tools are missing', or reports 'Tool not found' or SCOPE_MISSING for a Demofy tool."
---
<!-- Generated from plugins/demofy/skills/setup-demofy/SKILL.md by scripts/sync-skills.mjs. Edit the plugin copy, then run the script. -->

# Set up Demofy

Connect the Demofy MCP server, confirm it answers, and fix the usual reasons a Demofy tool is missing. Sign-in and consent always happen in Demofy's own browser pages, never in the chat.

- MCP server key: `demofy` (tools are written `demofy:<tool>`)
- MCP server URL: `https://app.demofy.io/api/mcp` (streamable HTTP, OAuth 2.1 with PKCE and dynamic client registration)
- Docs: https://demofy.io/docs/mcp

## Where to connect

### Claude Code with this plugin

1. The plugin already registers the `demofy` server. Run `/mcp`, pick the Demofy server, and choose **Authenticate**, or just ask a Demofy question and follow the sign-in link Claude opens.
2. Without the plugin, add the server by hand: `claude mcp add --transport http demofy https://app.demofy.io/api/mcp`, then authenticate from `/mcp`.
3. A connector added on claude.ai is also available in Claude Code when you are signed in with the same claude.ai account, so there is no need to connect twice.

### claude.ai, Claude Desktop, and Cowork

Demofy is not in the Connectors Directory yet. Add it as a custom connector:

1. Open Settings > Connectors and select **Add custom connector**.
2. Name it Demofy and enter `https://app.demofy.io/api/mcp` as the URL. Use this plain address; the `?tools=all` form is for API-key clients, not for apps that sign you in.
3. Select **Connect**, sign in to Demofy, and approve the permissions page.
4. On a Team or Enterprise plan, an Owner may need to allow custom connectors first.

## What the sign-in asks

Demofy asks you to sign in the way you usually do (Google, Apple, or email). It then shows the app asking and the permissions it wants, grouped: Read your data; Create and edit; Delete, publish or send; Billing and subscription; Profile, preferences, account deletion; Members and invites; Connected services; Support tickets; API keys. Every group the app asked for starts ticked. Untick anything you do not want; a tool whose permission you did not grant is never registered. Settings > Connected apps in Demofy lists every app you approved, with the workspaces it acts in, and disconnects it.

Making a demo needs "Read your data" and "Create and edit". Cancelling or deleting a demo needs "Delete, publish or send", and every destructive call still asks for a second, confirmed call.

## Verify the connection

Make one read-only call and report what came back in a sentence.

Call `demofy:demofy_list_demos` if it is listed by name. If only `demofy:search_tools` and `demofy:execute_typescript` are listed (Code Mode, the default), call `demofy:search_tools`, then run `demofy:execute_typescript` with `return await external_demofy_list_demos({});`. It returns the newest demos in the workspace, or an empty list for a new account. Either answer means Demofy is connected; say so and continue with the user's task.

## When a tool is missing

Most connections see Code Mode: `tools/list` shows only `demofy:search_tools` and `demofy:execute_typescript`, and every Demofy tool is called inside the sandbox as `external_<tool>`.

- **"Tool not found" on a named tool:** switch to `demofy:search_tools` then `demofy:execute_typescript` instead of retrying the direct call.
- **`ReferenceError: external_<tool> is not defined` or `SCOPE_MISSING`:** the permission behind that tool was not granted. Call `external_request_scopes` (when it is listed) and give the user the link it returns, or have them disconnect and reconnect Demofy and keep that group ticked.
- **`WORKSPACE_REQUIRED` or `WORKSPACE_NOT_FOUND`:** the connection covers several workspaces. Call `external_list_workspaces`, ask which one, and include its `workspaceId` on every call.
- **An authentication error, or no `demofy` tools at all:** the connector is not connected or was disconnected in Demofy (Settings > Connected apps). Repeat the steps under "Where to connect".
- **`RATE_LIMITED` or `TOOL_FAILED`:** wait a moment and retry a read once; never retry a write without checking whether it landed.

## Rules

- Never ask the user for a Demofy password, API key, or access token in the chat. OAuth happens in the browser.
- Do not change Demofy settings, plans, or team members on the user's behalf while setting up.
- The verification call reads only. Do not create, edit, share, or delete a demo while setting up.
