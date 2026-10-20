---
name: setup-caly
description: "Connects the Caly MCP server to Claude and verifies it with one read-only call: where to connect in claude.ai, Claude Desktop, Cowork, or Claude Code, what the Caly sign-in and consent screens ask, and how to recover when a tool is missing. Use when the user asks to 'set up Caly', 'connect Caly to Claude', 'install the Caly connector', 'sign in to Caly', 'why can't Claude see my Caly calendar', 'Caly tools are missing', or reports 'Tool not found' for a Caly tool."
---
<!-- Generated from plugins/caly/skills/setup-caly/SKILL.md by scripts/sync-skills.mjs. Edit the plugin copy, then run the script. -->

# Set up Caly

Connect the Caly MCP server, confirm it answers, and fix the usual reasons a Caly tool is missing. Sign-in and consent always happen in Caly's own browser pages, never in the chat.

- MCP server key: `caly` (tools are written `caly:<tool>`)
- MCP server URL: `https://mcp.trycaly.com/mcp` (streamable HTTP, OAuth 2.1 with PKCE)
- Docs: https://trycaly.com/agent-setup/

## Where to connect

### Claude Code with this plugin

1. The plugin already registers the `caly` server. Run `/mcp`, pick the Caly server, and choose **Authenticate**, or just ask a Caly question and follow the sign-in link Claude opens.
2. Without the plugin, add the server by hand: `claude mcp add --transport http caly https://mcp.trycaly.com/mcp`, then authenticate from `/mcp`.
3. A connector added on claude.ai is also available in Claude Code when you are signed in with the same claude.ai account, so there is no need to connect twice.

### claude.ai, Claude Desktop, and Cowork

1. Open the Caly listing in the Connectors Directory: https://claude.ai/directory/3d0909e9-bcc0-425e-84ad-78306332dd7b and select **Connect**. In the app you can also search the directory for "Caly".
2. Approve Caly's consent page in the page that opens, then sign in to Caly.
3. On a Team or Enterprise plan, an Owner may need to approve the connector first; members without that permission see a **Request** button.

## What the sign-in asks

Caly's MCP server shows its own consent page first. It names the app asking (every app is labelled unverified, because anyone can register a name), says the grant covers the Caly tools only for at most 30 days, and shows where the authorization will be sent. Continue, then sign in to Caly and approve if Caly asks. There are no per-tool scopes; one grant covers reading event types, schedules, availability and bookings, and booking, rescheduling and cancelling. Cancelling always needs a second confirmed call. After 30 days Claude asks you to sign in again.

## Verify the connection

Make one read-only call and report what came back in a sentence.

Call `caly:whoami` if it is listed by name. If only `caly:search_tools` and `caly:execute_typescript` are listed (Code Mode), call `caly:search_tools`, then run `caly:execute_typescript` with `return await external_whoami({});`. It returns the account this connection acts as and its time zone. A normal answer means Caly is connected; say so and continue with the user's task.

## When a tool is missing

Most accounts see Code Mode: `tools/list` shows only `caly:search_tools` and `caly:execute_typescript`, and every Caly tool is called inside the sandbox as `external_<tool>`.

- **"Tool not found" on a named tool:** switch to `caly:search_tools` then `caly:execute_typescript` instead of retrying the direct call.
- **`UNAUTHORIZED`, an authentication error, or no `caly` tools at all:** the connector is not connected or the 30-day grant ended. Repeat the steps under "Where to connect".
- **`UPSTREAM_ERROR` or `TIMEOUT`:** Caly itself did not answer in time. Wait a moment and retry a read once; never retry a write without checking whether it landed.

## Rules

- Never ask the user for a Caly password, API key, or access token in the chat. OAuth happens in the browser.
- Do not change Caly settings on the user's behalf.
- The verification call reads only. Do not book, reschedule, or cancel anything while setting up.
