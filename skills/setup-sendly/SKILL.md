---
name: setup-sendly
description: "Connects the Sendly MCP server to Claude and verifies it with one read-only call: where to connect in claude.ai, Claude Desktop, Cowork, or Claude Code, what the Sendly sign-in and consent screen asks, and how to recover when a tool is missing. Use when the user asks to 'set up Sendly', 'connect Sendly to Claude', 'install the Sendly connector', 'sign in to Sendly', 'why can't Claude see my Sendly data', 'Sendly tools are missing', or reports 'Tool not found' for a Sendly tool."
---
<!-- Generated from plugins/sendly/skills/setup-sendly/SKILL.md by scripts/sync-skills.mjs. Edit the plugin copy, then run the script. -->

# Set up Sendly

Connect the Sendly MCP server, confirm it answers, and fix the usual reasons a Sendly tool is missing. Sign-in and consent always happen in Sendly's own browser page, never in the chat.

- MCP server key: `sendly` (tools are written `sendly:<tool>`)
- MCP server URL: `https://app.sendly.now/api/mcp` (streamable HTTP, OAuth 2.1 with PKCE)
- Docs: https://docs.sendly.now/guides/mcp

## Where to connect

### Claude Code with this plugin

1. The plugin already registers the `sendly` server. Run `/mcp`, pick the Sendly server, and choose **Authenticate**, or just ask a Sendly question and follow the sign-in link Claude opens.
2. Without the plugin, add the server by hand: `claude mcp add --transport http sendly https://app.sendly.now/api/mcp`, then authenticate from `/mcp`.
3. A connector added on claude.ai is also available in Claude Code when you are signed in with the same claude.ai account, so there is no need to connect twice.

### claude.ai, Claude Desktop, and Cowork

1. Open the Sendly listing in the Connectors Directory: https://claude.ai/directory/connectors/sendly and select **Connect**. In the app you can also search the directory for "Sendly".
2. Sign in to Sendly in the page that opens and approve the consent screen.
3. On a Team or Enterprise plan, an Owner may need to approve the connector first; members without that permission see a **Request** button.

## What the sign-in asks

Sendly asks you to sign in, then shows a read and a write scope for each area (contacts, campaigns, workflows, domains, and so on) plus send scopes. Workflow, suppression, sending, mailbox, project-creation, and API-key scopes are sensitive and start unticked; tick only what you need. A campaign goes out only after you confirm the recipient count.

## Verify the connection

Make one read-only call and report what came back in a sentence.

Call `sendly:list_projects` if it is listed by name. If only `sendly:search_tools` and `sendly:execute_typescript` are listed (Code Mode), call `sendly:search_tools`, then run `sendly:execute_typescript` with `return await external_list_projects({});`. It lists your Sendly projects and needs no scope. A normal answer means Sendly is connected; say so and continue with the user's task.

## When a tool is missing

Most accounts see Code Mode: `tools/list` shows only `sendly:search_tools` and `sendly:execute_typescript`, and every Sendly tool is called inside the sandbox as `external_<tool>`.

- **"Tool not found" on a named tool:** switch to `sendly:search_tools` then `sendly:execute_typescript` instead of retrying the direct call.
- **`sendly:search_tools` does not return the tool:** its scope was not granted. Ask the user to disconnect and reconnect Sendly and approve that scope on the consent screen.
- **An error naming a setting or a plan:** a Sendly setting or plan gate refused the call. Relay the message and any settings link it carries; do not retry around it.
- **No `sendly` tools at all, or an authentication error:** the connector is not connected or the sign-in expired. Repeat the steps under "Where to connect".

## Rules

- Never ask the user for a Sendly password, API key, or access token in the chat. OAuth happens in the browser.
- Do not change Sendly settings on the user's behalf. Settings that unlock writes are turned on by a signed-in person in Sendly.
- The verification call reads only. Do not create, send, or publish anything while setting up.
