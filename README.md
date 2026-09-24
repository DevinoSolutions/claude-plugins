# Devino Claude plugins

Claude Code and Cowork plugins for Devino Solutions products. Each plugin wraps the product's
remote MCP connector (OAuth 2.1, streamable HTTP) with a few workflow skills, so Claude knows
not only which tools exist but when and how to use them.

## Install

```
/plugin marketplace add DevinoSolutions/claude-plugins
/plugin install postify@devino
```

On first use Claude opens the product's sign-in page; approve the consent screen and the
connector's tools become available. Each plugin's README lists its tools and skills.

## Plugins

| Plugin | Product | MCP endpoint |
|---|---|---|
| `postify` | [Postify](https://usepostify.com) social media scheduling | `https://app.usepostify.com/api/mcp` |
| `dodomain` | [doDomain](https://dodomain.io) domain connect for your customers' own domains | `https://app.dodomain.io/api/mcp` |
| `getitdone` | [GetItDone](https://nowgetitdone.com) team task and workspace manager | `https://app.nowgetitdone.com/api/mcp` |
| `bioflow` | [BioFlow](https://getbioflow.com) link-in-bio pages | `https://app.getbioflow.com/api/mcp` |
| `sendly` | [Sendly](https://sendly.now) email platform for product teams | `https://app.sendly.now/api/mcp` |
| `shorty` | [Shorty](https://aishorty.com) summaries and transcripts of media and documents | `https://aishorty.com/api/mcp` |
| `unotes` | [uNotes](https://unotes.net) study notes library | `https://unotes.net/api/mcp` |
| `uptimely` | [Uptimely](https://getuptimely.com) uptime monitoring and incidents | `https://app.getuptimely.com/api/mcp` |
| `notifly` | [Notifly](https://notifly.io) notification workflows | `https://api.notifly.io/mcp` |

## Layout

```
.claude-plugin/marketplace.json   the marketplace index
plugins/<name>/.claude-plugin/plugin.json
plugins/<name>/skills/<skill>/SKILL.md
plugins/<name>/README.md
```

## Contributing

Run `claude plugin validate --strict .` and `claude plugin validate --strict plugins/<name>`
before opening a pull request. Skills must describe real product workflows; they never bypass
the connector's own scopes, confirmations, or gates.

## License

MIT. The products themselves are separate services with their own terms and privacy policies,
linked from each plugin's homepage.
