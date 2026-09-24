# doDomain plugin for Claude

Pre-flight, connect, and verify your customers' own domains from your doDomain team.

## Install

```
/plugin marketplace add DevinoSolutions/claude-plugins
/plugin install dodomain@devino
```

Other ways in: the Claude plugin directory and the `anthropics/claude-plugins-community` marketplace once approved, skills only with `npx skills add DevinoSolutions/claude-plugins --skill setup-dodomain`, or the connector alone through the [Connectors Directory listing](https://claude.ai/directory/connectors/dodomain). See the [repository README](../../README.md#install) for each path.

Then ask Claude about a domain or your connections. On the first tool call Claude opens the
doDomain sign-in page; pick the scopes you want on the consent screen. A tool whose scope you
did not grant is never registered for the session.

## What it connects

Remote MCP server `https://app.dodomain.io/api/mcp` (OAuth 2.1 with PKCE). It reaches 7 tools,
each registered only when you granted its scope:

- Domain pre-flight (`domains:read`, reads public DNS): `check_domain`
- Apps (`apps:read`): `list_apps`
- Connections (`connections:read`): `list_connections`
- Connect sessions (`sessions:read`): `get_connect_session`
- Start and verify sessions (`sessions:write`): `create_connect_session`,
  `verify_connect_session`
- Recheck connections (`connections:write`): `reverify_connection`

The first four only read. `create_connect_session` counts against your plan's monthly
connection quota. Verification checks are rate limited; a repeated recheck is told how many
seconds to wait. Secret API keys are never returned, and billing is not reachable over the
connector.

By default the server runs in Code Mode: `tools/list` shows two tools, `search_tools` and
`execute_typescript`, and the tools above are called inside `execute_typescript` as
`external_<name>` functions (for example `external_check_domain`) with the same scopes and gates. A
server set to the per-tool surface lists them by name instead. The skills handle both.

## Skills

| Skill | Use it when |
|---|---|
| `preflighting-domains` | "Who runs DNS for shop.acme.com?", "Can this domain do one-click connect?" |
| `connecting-customer-domains` | "Start a connect session for shop.acme.com on my app", "Have the records landed yet?" |
| `checking-domain-connections` | "Which of my connected domains are broken?", "Recheck the DNS on this connection" |
| `setup-dodomain` | "Connect doDomain to Claude", "doDomain tools are missing", "Tool not found" |

## Links

- Docs: https://dodomain.io/docs/connecting-ai-assistants
- Privacy: https://dodomain.io/privacy
- Support: support@devino.ca
