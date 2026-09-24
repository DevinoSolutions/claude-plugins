# Sendly plugin for Claude

Run your Sendly email workspace: contacts, campaigns, workflows, deliverability, and analytics.

This plugin can send real email. Every skill that sends asks you first.

## Install

```
/plugin marketplace add DevinoSolutions/claude-plugins
/plugin install sendly@devino
```

Other ways in: the Claude plugin directory and the `anthropics/claude-plugins-community` marketplace once approved, skills only with `npx skills add DevinoSolutions/claude-plugins --skill setup-sendly`, or the connector alone through the [Connectors Directory listing](https://claude.ai/directory/connectors/sendly). See the [repository README](../../README.md#install) for each path.

Then ask Claude about your contacts, campaigns, or deliverability. On the first tool call Claude
opens the Sendly sign-in page. On the consent screen read scopes are pre-selected, and sending
and destructive scopes are unchecked behind a warning. A tool whose scope you did not grant is
never registered for the session.

## What it connects

Remote MCP server `https://app.sendly.now/api/mcp` (OAuth 2.1 with PKCE). It reaches 80 tools,
each registered only when you granted its scope. By area:

- Projects and usage: `list_projects`, `get_project`, `create_project`, `get_usage`
- Contacts: `list_contacts`, `get_contact`, `create_contact`, `update_contact`, `delete_contact`
- Lists: `list_lists`, `get_list`, `create_list`, `update_list`, `delete_list`
- Segments: `list_segments`, `get_segment`, `list_segment_contacts`, `create_segment`,
  `update_segment`, `delete_segment`
- Topics: `list_topics`, `create_topic`, `update_topic`, `get_contact_topic_preferences`,
  `set_topic_subscription`
- Templates: `list_templates`, `get_template`, `create_template`, `update_template`
- Campaigns: `list_campaigns`, `get_campaign`, `get_campaign_stats`, `create_campaign`,
  `update_campaign`, `manage_campaign`, `delete_campaign`, `send_campaign`
- Workflows: `list_workflows`, `get_workflow`, `get_workflow_status`,
  `list_workflow_executions`, `create_workflow`, `edit_workflow`, `update_workflow`,
  `clone_workflow`, `manage_workflow`, `delete_workflow`
- Sending and emails: `send_email`, `send_test_email`, `list_emails`, `get_email`,
  `view_analytics`
- Events: `list_events`, `record_event`
- Domains and deliverability: `check_domain`, `add_domain`, `start_domain_setup`,
  `verify_domain`, `diagnose_delivery`
- Suppressions: `list_suppressions`, `add_suppression`, `remove_suppression`
- Address validation: `validate_emails`, `get_validation_run`, `list_validation_results`,
  `clean_list`
- Webhooks: `list_webhooks`, `create_webhook`, `update_webhook`, `delete_webhook`
- Mailboxes: `list_mailboxes`, `get_mailbox`, `create_mailbox`, `delete_mailbox`,
  `compose_mailbox_email`, `send_mailbox_email`
- API keys: `list_api_keys`, `create_api_key`, `rotate_api_key`, `revoke_api_key`

`send_campaign` is two-step: a call without `confirm: true` returns the audience size and sends
nothing; only a second call with `confirm: true` sends. Test sends reach only your own verified
address. Mail leaves only from domains you verified, within your project's daily and monthly
caps. Address validation and list cleaning are metered on your Sendly plan.

Gates: each area has its own read and write scope (for example `contacts:read` and
`contacts:write`), and sending needs `emails:send`, `campaigns:send`, or `mailboxes:send`.
`list_projects` needs no scope. Workflow, suppression, sending, mailbox, project-creation and
API-key scopes are sensitive: they start unticked on the consent screen. Seven account tools
(`create_project`, `create_mailbox`, `delete_mailbox`, `list_api_keys`, `create_api_key`,
`rotate_api_key`, `revoke_api_key`) are offered only to a person's OAuth connection, never to
a Sendly API key, which sees 73.

By default the server runs in Code Mode: `tools/list` shows two tools, `search_tools` and
`execute_typescript`, and the tools above are called inside `execute_typescript` as
`external_<name>` functions (for example `external_list_contacts`) with the same scopes and
gates. A server set to the per-tool surface lists them by name instead. The skills handle both.

## Skills

| Skill | Use it when |
|---|---|
| `sending-email-campaigns` | "Draft a September newsletter for premium members", "Send a test", "Send it" |
| `reviewing-email-performance` | "How did my emails do this week?", "Did anything bounce?" |
| `checking-email-deliverability` | "Why is mail from my domain not landing?", "Clean this list before I send" |
| `building-onboarding-workflows` | "Build a welcome series for new signups", "Why isn't my onboarding workflow running?" |
| `setup-sendly` | "Connect Sendly to Claude", "Sendly tools are missing", "Tool not found" |

## Links

- Docs: https://docs.sendly.now/guides/mcp
- Privacy: https://sendly.now/privacy
- Support: support@devino.ca
