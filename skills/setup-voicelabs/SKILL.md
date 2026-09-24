---
name: setup-voicelabs
description: "Connects the VoiceLabs MCP server to Claude and verifies it with one read-only call: where to connect in claude.ai, Claude Desktop, Cowork, or Claude Code, what the VoiceLabs sign-in and consent screen asks, and how to recover when a tool is missing. Use when the user asks to 'set up VoiceLabs', 'connect VoiceLabs to Claude', 'install the VoiceLabs connector', 'sign in to VoiceLabs', 'why can't Claude see my VoiceLabs data', 'VoiceLabs tools are missing', or reports 'Tool not found' for a VoiceLabs tool."
---
<!-- Generated from plugins/voicelabs/skills/setup-voicelabs/SKILL.md by scripts/sync-skills.mjs. Edit the plugin copy, then run the script. -->

# Set up VoiceLabs

Connect the VoiceLabs MCP server, confirm it answers, and fix the usual reasons a VoiceLabs tool is missing. Sign-in and consent always happen in VoiceLabs's own browser page, never in the chat.

- MCP server key: `voicelabs` (tools are written `voicelabs:<tool>`)
- MCP server URL: `https://app.voicelabs.now/api/mcp` (streamable HTTP, OAuth 2.1 with PKCE)
- Docs: https://voicelabs.now/docs/connecting-ai-assistants

## Where to connect

### Claude Code with this plugin

1. The plugin already registers the `voicelabs` server. Run `/mcp`, pick the VoiceLabs server, and choose **Authenticate**, or just ask a VoiceLabs question and follow the sign-in link Claude opens.
2. Without the plugin, add the server by hand: `claude mcp add --transport http voicelabs https://app.voicelabs.now/api/mcp`, then authenticate from `/mcp`.
3. A connector added on claude.ai is also available in Claude Code when you are signed in with the same claude.ai account, so there is no need to connect twice.

### claude.ai, Claude Desktop, and Cowork

1. VoiceLabs is not listed in the Connectors Directory yet, so add it as a custom connector: Settings > Connectors > **Add custom connector**, name it VoiceLabs, and paste `https://app.voicelabs.now/api/mcp`. The Free plan allows one custom connector.
2. Sign in to VoiceLabs in the page that opens and approve the consent screen.
3. On a Team or Enterprise plan, an Owner may need to approve the connector first; members without that permission see a **Request** button.

## What the sign-in asks

VoiceLabs asks you to sign in, then shows the scopes: `voice:read` (voices, captures, generations), `voice:generate` (speech and transcription, metered by your plan), and `voice:clone`, which is a separate consent question. Grant `voice:clone` only if you plan to clone voices, and only of speakers who agreed.

## Verify the connection

Make one read-only call and report what came back in a sentence.

Call `voicelabs:list_voice_profiles` if it is listed by name. If only `voicelabs:search_tools` and `voicelabs:execute_typescript` are listed (Code Mode), call `voicelabs:search_tools`, then run `voicelabs:execute_typescript` with `return await external_list_voice_profiles({});`. It lists the voices on your account. A normal answer means VoiceLabs is connected; say so and continue with the user's task.

## When a tool is missing

VoiceLabs lists its named tools and the Code Mode pair side by side. A client that cached an older tool list can still report "Tool not found"; the Code Mode route always works.

- **"Tool not found" on a named tool:** switch to `voicelabs:search_tools` then `voicelabs:execute_typescript` instead of retrying the direct call.
- **`voicelabs:search_tools` does not return the tool:** its scope was not granted. Ask the user to disconnect and reconnect VoiceLabs and approve that scope on the consent screen.
- **An error naming a setting or a plan:** a VoiceLabs setting or plan gate refused the call. Relay the message and any settings link it carries; do not retry around it.
- **No `voicelabs` tools at all, or an authentication error:** the connector is not connected or the sign-in expired. Repeat the steps under "Where to connect".

## Rules

- Never ask the user for a VoiceLabs password, API key, or access token in the chat. OAuth happens in the browser.
- Do not change VoiceLabs settings on the user's behalf. Settings that unlock writes are turned on by a signed-in person in VoiceLabs.
- The verification call reads only. Do not create, send, or publish anything while setting up.
