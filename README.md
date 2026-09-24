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
| `snapvisor` | [SnapVisor](https://snapvisor.io) visual regression testing | `https://mcp.snapvisor.io` |
| `superbooks` | [SuperBooks](https://superbooks.io) bookkeeping and invoices | `https://api.superbooks.io/mcp` |
| `voicelabs` | [VoiceLabs](https://voicelabs.now) text to speech and transcription | `https://app.voicelabs.now/api/mcp` |

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
