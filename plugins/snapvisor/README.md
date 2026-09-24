# SnapVisor plugin for Claude

Review visual regression builds from SnapVisor: see what changed, approve or reject, silence
flaky changes, and run the review discussion.

## Install

```
/plugin marketplace add DevinoSolutions/claude-plugins
/plugin install snapvisor@devino
```

Then ask Claude about your builds. On the first tool call Claude opens the SnapVisor consent
screen; choose the accounts the connection covers and narrow the scopes if you do not want write
or admin access. MCP access is part of the SnapVisor Pro plan. On the Free plan only `getMe`
answers, so you can confirm the connection works.

## What it connects

Remote MCP server `https://mcp.snapvisor.io` (OAuth 2.1 with PKCE and dynamic client
registration). The server exposes two tools:

- `search_tools`: read-only search over the SnapVisor operations this connection can reach,
  returned as TypeScript declarations such as `external_listBuilds`.
- `execute_typescript`: runs a short TypeScript program that calls those `external_*` functions,
  so several calls cost one round trip. Every call enforces the same authentication, scopes and
  plan rules as the REST API.

Behind them sit 90 operations from SnapVisor's public API: builds and screenshot diffs, reviews
and reviewers, tests and their changes (ignore and un-ignore), comments on builds, tests and
media, projects and contributors, automation rules, deployments and domains, members, invites and
team domains, the media library, and account analytics. Builds and screenshots are uploaded by
your CI with project tokens; those endpoints are not on this surface, so Claude can read and
review screenshots but cannot capture, upload or change one.

Code Mode is the server's default. A server set to the per-tool surface lists the 90 operations
by name (the `operationId`, such as `listBuilds`) instead; the skills handle both.

## Skills

| Skill | Use it when |
|---|---|
| `reviewing-visual-builds` | "What changed in the latest build?", "Approve build 42, the nav restyle is intentional" |
| `handling-flaky-changes` | "Ignore the date-widget change, it's the flaky clock again", "Which tests are flaky?" |
| `discussing-builds` | "Summarize the comments on build 42", "Reply to the open thread and resolve it" |
| `reporting-snapvisor-usage` | "How many builds did we run this month?", "Who is on the team?" |
| `setup-snapvisor` | "Connect SnapVisor to Claude", "SnapVisor tools are missing", "Tool not found" |

## Links

- Docs: https://snapvisor.io/docs/agents/mcp-server
- Privacy: https://snapvisor.io/privacy
- Support: support@devino.ca
