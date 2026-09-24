# doDomain plugin for Claude

Pre-flight, connect, and verify your customers' own domains from your doDomain team.

## Install

```
/plugin marketplace add DevinoSolutions/claude-plugins
/plugin install dodomain@devino
```

Then ask Claude about a domain or your connections. On the first tool call Claude opens the
doDomain sign-in page; pick the scopes you want on the consent screen. A tool whose scope you
did not grant is never registered for the session.

## What it connects

Remote MCP server `https://app.dodomain.io/api/mcp` (OAuth 2.1 with PKCE). Tools:
`check_domain`, `list_apps`, `list_connections`, `get_connect_session`,
`create_connect_session`, `verify_connect_session`, `reverify_connection`.

The first four only read. `create_connect_session` counts against your plan's monthly
connection quota. Verification checks are rate limited; a repeated recheck is told how many
seconds to wait. Secret API keys are never returned, and billing is not reachable over the
connector.

## Skills

| Skill | Use it when |
|---|---|
| `domain-preflight` | "Who runs DNS for shop.acme.com?", "Can this domain do one-click connect?" |
| `connect-customer-domain` | "Start a connect session for shop.acme.com on my app", "Have the records landed yet?" |
| `connection-health` | "Which of my connected domains are broken?", "Recheck the DNS on this connection" |

## Links

- Docs: https://dodomain.io/docs/connecting-ai-assistants
- Privacy: https://dodomain.io/privacy
- Support: https://app.dodomain.io/support
