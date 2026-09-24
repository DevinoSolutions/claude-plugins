---
name: setup-snapvisor
description: "Connects the SnapVisor MCP server to Claude and verifies it with one read-only call: where to connect in claude.ai, Claude Desktop, Cowork, or Claude Code, what the SnapVisor sign-in and consent screen asks, and how to recover when a tool is missing. Use when the user asks to 'set up SnapVisor', 'connect SnapVisor to Claude', 'install the SnapVisor connector', 'sign in to SnapVisor', 'why can't Claude see my SnapVisor data', 'SnapVisor tools are missing', or reports 'Tool not found' for a SnapVisor tool."
---

# Set up SnapVisor

Connect the SnapVisor MCP server, confirm it answers, and fix the usual reasons a SnapVisor tool is missing. Sign-in and consent always happen in SnapVisor's own browser page, never in the chat.

- MCP server key: `snapvisor` (tools are written `snapvisor:<tool>`)
- MCP server URL: `https://mcp.snapvisor.io` (streamable HTTP, OAuth 2.1 with PKCE)
- Docs: https://snapvisor.io/docs/agents/mcp-server

## Where to connect

### Claude Code with this plugin

1. The plugin already registers the `snapvisor` server. Run `/mcp`, pick the SnapVisor server, and choose **Authenticate**, or just ask a SnapVisor question and follow the sign-in link Claude opens.
2. Without the plugin, add the server by hand: `claude mcp add --transport http snapvisor https://mcp.snapvisor.io`, then authenticate from `/mcp`.
3. A connector added on claude.ai is also available in Claude Code when you are signed in with the same claude.ai account, so there is no need to connect twice.

### claude.ai, Claude Desktop, and Cowork

1. Open the SnapVisor listing in the Connectors Directory: https://claude.ai/directory/connectors/snapvisor and select **Connect**. In the app you can also search the directory for "SnapVisor".
2. Sign in to SnapVisor in the page that opens and approve the consent screen.
3. On a Team or Enterprise plan, an Owner may need to approve the connector first; members without that permission see a **Request** button.

## What the sign-in asks

SnapVisor asks you to sign in, then lets you choose which accounts and scopes this connection may use. MCP access needs the SnapVisor Pro plan. Builds and screenshots are uploaded by your CI, so Claude can read and review screenshots but cannot capture or upload one.

## Verify the connection

Make one read-only call and report what came back in a sentence.

Call `snapvisor:search_tools` with a query such as `me`, then run `snapvisor:execute_typescript` with `return await external_getMe({});`. On a per-tool server, call `snapvisor:getMe` directly. It returns the signed-in user and the accounts this connection can reach. A normal answer means SnapVisor is connected; say so and continue with the user's task.

## When a tool is missing

SnapVisor serves Code Mode by default: `tools/list` shows only `snapvisor:search_tools` and `snapvisor:execute_typescript`, and every operation is an `external_<operation>` function inside the sandbox.

- **"Tool not found" on a named tool:** switch to `snapvisor:search_tools` then `snapvisor:execute_typescript` instead of retrying the direct call.
- **`snapvisor:search_tools` does not return the tool:** its scope was not granted. Ask the user to disconnect and reconnect SnapVisor and approve that scope on the consent screen.
- **An error naming a setting or a plan:** a SnapVisor setting or plan gate refused the call. Relay the message and any settings link it carries; do not retry around it.
- **No `snapvisor` tools at all, or an authentication error:** the connector is not connected or the sign-in expired. Repeat the steps under "Where to connect".

## Rules

- Never ask the user for a SnapVisor password, API key, or access token in the chat. OAuth happens in the browser.
- Do not change SnapVisor settings on the user's behalf. Settings that unlock writes are turned on by a signed-in person in SnapVisor.
- The verification call reads only. Do not create, send, or publish anything while setting up.
