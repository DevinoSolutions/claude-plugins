# Devino Claude plugins

Claude plugins and Agent Skills for Devino Solutions products. Each plugin wraps the product's
remote MCP connector (OAuth 2.1, streamable HTTP) with workflow skills and a setup skill, so
Claude knows not only which tools exist but when and how to use them.

## Install

Pick the path that matches where you use Claude. Every path signs you in to the product with
OAuth on first use; you choose the scopes on the product's consent screen.

### 1. claude.ai and Cowork: Plugins directory

On paid plans (Pro, Max, Team, Enterprise), open **Customize > Plugins > Discover**, search for
the product name, and install it. Ten plugins were submitted to the Claude plugin directory on
2026-09-24 and appear there once Anthropic approves them; SuperBooks and VoiceLabs are not
submitted yet.

### 2. Claude Code: community marketplace

Approved plugins are mirrored into Anthropic's community marketplace, which you add once:

```
/plugin marketplace add anthropics/claude-plugins-community
/plugin install postify@claude-community
```

### 3. Claude Code: straight from this repository

Works today for all twelve plugins:

```
/plugin marketplace add DevinoSolutions/claude-plugins
/plugin install postify@devino
```

From a shell, the same steps are `claude plugin marketplace add DevinoSolutions/claude-plugins`
and `claude plugin install postify@devino`. Replace `postify` with any plugin name from the
table below.

### 4. Skills only, for Claude Code and other agents

Every skill is mirrored under [`skills/`](skills), so the
[skills CLI](https://github.com/vercel-labs/skills) can install them one by one:

```
npx skills add DevinoSolutions/claude-plugins --list
npx skills add DevinoSolutions/claude-plugins --skill setup-postify --skill drafting-social-posts
```

A skill does not register the MCP server. Connect the product with path 5, or in Claude Code run
`claude mcp add --transport http <plugin> <MCP server URL>`. The product's `setup-<plugin>`
skill walks through it.

### 5. Connectors directory: the connector alone

To use a product's tools without the skills, connect it from the Connectors Directory link in
the table. If the link says pending, add a custom connector instead: Settings > Connectors >
**Add custom connector**, then paste the MCP server URL. Connectors added on claude.ai are also
available in Claude Code when you sign in with the same account.

## Products

| Product | Connectors Directory | MCP server URL | Plugin | Skills |
|---|---|---|---|---|
| [Postify](https://usepostify.com/docs/connecting-ai-assistants) | [claude.ai/directory/connectors/postify](https://claude.ai/directory/connectors/postify) | `https://app.usepostify.com/api/mcp` | `postify` | `drafting-social-posts`, `managing-content-calendar`, `reviewing-social-performance`, `setup-postify` |
| [doDomain](https://dodomain.io/docs/connecting-ai-assistants) | [claude.ai/directory/connectors/dodomain](https://claude.ai/directory/connectors/dodomain) | `https://app.dodomain.io/api/mcp` | `dodomain` | `checking-domain-connections`, `connecting-customer-domains`, `preflighting-domains`, `setup-dodomain` |
| [GetItDone](https://nowgetitdone.com/docs/connecting-ai-assistants) | [claude.ai/directory/connectors/getitdone](https://claude.ai/directory/connectors/getitdone) | `https://app.nowgetitdone.com/api/mcp` | `getitdone` | `capturing-tasks`, `investigating-tasks`, `reviewing-workload`, `searching-getitdone-api-docs`, `setup-getitdone` |
| [BioFlow](https://getbioflow.com/docs/connecting-ai-assistants) | [claude.ai/directory/connectors/bioflow](https://claude.ai/directory/connectors/bioflow) | `https://app.getbioflow.com/api/mcp` | `bioflow` | `analyzing-page-performance`, `editing-page-drafts`, `publishing-pages`, `setup-bioflow` |
| [Sendly](https://docs.sendly.now/guides/mcp) | [claude.ai/directory/connectors/sendly](https://claude.ai/directory/connectors/sendly) | `https://app.sendly.now/api/mcp` | `sendly` | `building-onboarding-workflows`, `checking-email-deliverability`, `reviewing-email-performance`, `sending-email-campaigns`, `setup-sendly` |
| [Shorty](https://aishorty.com/docs/connecting-ai-assistants) | [claude.ai/directory/connectors/shorty](https://claude.ai/directory/connectors/shorty) | `https://aishorty.com/api/mcp` | `shorty` | `researching-summary-library`, `summarizing-sources`, `transcribing-media`, `setup-shorty` |
| [uNotes](https://unotes.net/docs/connecting-ai-assistants) | [claude.ai/directory/connectors/unotes](https://claude.ai/directory/connectors/unotes) | `https://unotes.net/api/mcp` | `unotes` | `building-study-guides`, `planning-revision`, `researching-course-material`, `setup-unotes` |
| [Uptimely](https://getuptimely.com) | [claude.ai/directory/connectors/uptimely](https://claude.ai/directory/connectors/uptimely) | `https://app.getuptimely.com/api/mcp` | `uptimely` | `adding-uptime-monitors`, `checking-uptime-status`, `responding-to-incidents`, `writing-postmortems`, `setup-uptimely` |
| [Notifly](https://notifly.io/docs/connecting-ai-assistants) | [claude.ai/directory/connectors/notifly](https://claude.ai/directory/connectors/notifly) | `https://api.notifly.io/mcp` | `notifly` | `checking-notification-delivery`, `reviewing-notification-workflows`, `sending-notifications`, `setup-notifly` |
| [SnapVisor](https://snapvisor.io/docs/agents/mcp-server) | pending | `https://mcp.snapvisor.io` | `snapvisor` | `discussing-builds`, `handling-flaky-changes`, `reporting-snapvisor-usage`, `reviewing-visual-builds`, `setup-snapvisor` |
| [SuperBooks](https://docs.superbooks.io/mcp) | pending | `https://api.superbooks.io/mcp` | `superbooks` | `chasing-unpaid-invoices`, `cleaning-up-bookkeeping`, `drafting-invoices`, `reading-financial-reports`, `setup-superbooks` |
| [VoiceLabs](https://voicelabs.now/docs/connecting-ai-assistants) | pending | `https://app.voicelabs.now/api/mcp` | `voicelabs` | `managing-voice-library`, `reading-text-aloud`, `transcribing-audio`, `setup-voicelabs` |

The directory links follow Anthropic's permanent listing format and the published slugs. SnapVisor
and SuperBooks are in review and VoiceLabs is not listed, so those three use a custom connector
for now.

## Tool surfaces

Most servers default to Code Mode: `tools/list` shows only `search_tools` and
`execute_typescript`, and each product tool is called inside the sandbox as `external_<tool>`
with the same scopes and gates. uNotes lists its tools by name, and VoiceLabs lists both. Every
skill names tools as `<server>:<tool>` and covers both surfaces, including what to do on
"Tool not found".

## Layout

```
.claude-plugin/marketplace.json            the marketplace index (discovery fields per plugin)
plugins/<name>/.claude-plugin/plugin.json  the plugin manifest and its MCP server
plugins/<name>/skills/<skill>/SKILL.md     workflow skills and the setup-<name> skill
plugins/<name>/README.md                   tools, gates and skills for one product
skills/<skill>/SKILL.md                    generated mirror for the skills CLI; do not edit
scripts/sync-skills.mjs                    regenerates and checks the mirror
```

## Contributing

Edit skills under `plugins/<name>/skills/`, then regenerate the mirror and validate:

```
node scripts/sync-skills.mjs
node scripts/sync-skills.mjs --check
claude plugin validate --strict .
claude plugin validate --strict plugins/<name>
claude plugin validate --strict skills
```

CI runs the same checks. Skill names are lowercase and hyphenated, gerund style where it reads
naturally, unique across plugins, and equal to their folder name. Descriptions are written in
the third person with the phrases users type. Skills must describe real product workflows; they
never bypass the connector's own scopes, confirmations, or gates.

## License

MIT. The products themselves are separate services with their own terms and privacy policies,
linked from each plugin's homepage.
