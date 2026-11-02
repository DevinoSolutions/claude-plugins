# Demofy plugin for Claude

Turn a web address and a sentence of intent into a narrated product demo video, follow it until
the video is ready, share it, edit it, and keep your demos in projects, with confirmation before
anything is spent or removed.

## Install

```
/plugin marketplace add DevinoSolutions/claude-plugins
/plugin install demofy@devino
```

Other ways in: the Claude plugin directory and the `anthropics/claude-plugins-community` marketplace once approved, skills only with `npx skills add DevinoSolutions/claude-plugins --skill setup-demofy`, or the connector alone as a custom connector with the MCP server URL below. See the [repository README](../../README.md#install) for each path.

Then ask Claude about your demos. On the first tool call Claude opens Demofy's sign-in. You sign
in to Demofy, then Demofy shows the app asking and the permissions it wants, grouped (read your
data; create and edit; delete, publish or send; billing; account; members; connected services;
support tickets; API keys). Untick any group you do not want; a tool whose permission you did not
grant is never registered.

## What it connects

Remote MCP server `https://app.demofy.io/api/mcp` (OAuth 2.1 with PKCE and dynamic client
registration). With every permission granted it reaches 80 tools. The ones the skills use:

- Demos (read): `demofy_list_demos`, `demofy_demo_status`, `demofy_get_script`, `demofy_propose_edit`
- Making a demo: `refine_prompt`, `demofy_create_demo`, `demofy_answer_sign_in`, `share_demo`
- Choices for a demo (read): `demofy_list_voices`, `demofy_list_assets`, `demofy_list_connections`, `demofy_brand_kit`
- Library: `demofy_list_projects` (read), `create_project`, `demofy_rename_demo`, `demofy_move_to_project`
- Saved logins: `get_connect_links` (a one-time link where you sign in to a site yourself)
- Brand and voices: `save_brand_kit`, `preview_voice`
- Spends the allowance (dangerous, two-step): `demofy_ship_edit`, `demofy_rerender`, `demofy_refresh`
- Cannot be undone (dangerous, two-step): `demofy_cancel_demo`, `demofy_delete_demo`

The rest cover projects, the media library and video imports, saved logins, the capture
allowlist, the plan and billing, the account, the team, support tickets, API keys, and the
connection's own permissions (`list_granted_scopes`, `request_scopes`). Call `search_tools` to see
every tool your connection reaches.

`demofy_create_demo` and the three re-render tools each start a recording that takes a few
minutes and counts against the plan's demo allowance; they return at once, and
`demofy_demo_status` follows the demo until its video and share link are ready. Every dangerous
tool takes two calls: the first returns `CONFIRMATION_REQUIRED` with a `confirmToken` that is
valid for 10 minutes and bound to the exact arguments, and only a second call carrying that token
acts. The skills in this plugin show you what will happen and wait for your yes before every
recording and every dangerous call.

By default the server runs in Code Mode: `tools/list` shows two tools, `search_tools` and
`execute_typescript`, and the tools above are called inside `execute_typescript` as
`external_<name>` functions (for example `external_demofy_create_demo`) with the same permissions
and confirmation. A failed call throws an Error whose message starts with its code:
`VALIDATION_ERROR`, `SCOPE_MISSING`, `CONFIRMATION_REQUIRED`, `NOT_FOUND`, `CONFLICT`,
`QUOTA_EXCEEDED`, `RATE_LIMITED`, `WORKSPACE_REQUIRED`, `WORKSPACE_NOT_FOUND`, or `TOOL_FAILED`.
The skills handle both surfaces.

A connection that covers several workspaces names one with `workspaceId` on each call
(`list_workspaces` lists them). Review and disconnect connected apps under Settings > Connected
apps in Demofy.

## Skills

| Skill | Use it when |
|---|---|
| `making-demo-videos` | "Make a demo video of our pricing page", "Record a walkthrough of app.example.com showing how to invite a teammate", "Is my demo ready yet?" |
| `managing-demos` | "What demos do I have?", "Give me the share link to my last demo", "Put these demos in the launch project", "Delete the old demo" |
| `editing-demos` | "Change the narration in step 3", "Turn off the voiceover", "Re-record this demo, the page changed", "Use our brand colour on new demos" |
| `setup-demofy` | "Connect Demofy to Claude", "Demofy tools are missing", "Tool not found" |

## Links

- Docs: https://demofy.io/docs/mcp
- Privacy: https://demofy.io/privacy
- Terms: https://demofy.io/terms
- Support: support@devino.ca
