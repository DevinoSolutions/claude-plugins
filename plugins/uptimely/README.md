# Uptimely plugin for Claude

Check monitors, incidents, alerts, maintenance, and on-call in Uptimely, and run incident
response with confirmation.

## Install

```
/plugin marketplace add DevinoSolutions/claude-plugins
/plugin install uptimely@devino
```

Then ask Claude about a project. On the first tool call Claude opens the Uptimely sign-in page;
pick the scopes you want on the consent screen. A tool whose scope you did not grant is never
registered for the session.

## What it connects

Remote MCP server `https://app.getuptimely.com/api/mcp` (OAuth 2.1 with PKCE). It reaches 20
tools, each registered only when you granted its scope:

- Projects (`project:read`): `uptimely_project_list`, `uptimely_project_overview`
- Monitors (`monitors:read`): `uptimely_monitor_list`, `uptimely_monitor_get`,
  `uptimely_monitor_status_history`, `uptimely_monitor_target_list`
- Incidents (`incidents:read`): `uptimely_incident_list`, `uptimely_incident_get`
- Alerts (`alerts:read`): `uptimely_alert_list`
- Maintenance, on-call, status pages, telemetry (`maintenance:read`, `on-call:read`,
  `status-pages:read`, `telemetry:read`): `uptimely_maintenance_list`,
  `uptimely_on_call_current`, `uptimely_status_page_list`, `uptimely_telemetry_service_list`
- Monitor writes (`monitors:write`): `uptimely_monitor_create`, `uptimely_run_monitor_probe`
- Incident writes (`incidents:write`): `uptimely_incident_declare`,
  `uptimely_incident_state_change`, `uptimely_incident_postmortem_save`
- Alert writes (`alerts:write`): `uptimely_alert_create`, `uptimely_alert_state_change`

`uptimely_project_list` returns the projects this connection can reach. Every other call names
the project it acts on (`projectId`); there is no current project. Access is re-checked against
your Uptimely membership on every call.

The write tools stay inert until a project owner turns on Allow AI write operations under
Settings > API Keys. It is off by default. Six write tools reach outside Uptimely: a probe hits
a real URL, and declaring an incident, saving a postmortem, or changing incident or alert state
can notify real people and change what a public status page shows. The skills in this plugin ask
before every write.

By default the server runs in Code Mode: `tools/list` shows two tools, `search_tools` and
`execute_typescript`, and the tools above are called inside `execute_typescript` as
`external_<name>` functions (for example `external_uptimely_monitor_list`) with the same scopes and gates. A
server set to the per-tool surface lists them by name instead. The skills handle both.

Review and revoke connected assistants under Connected AI apps in your Uptimely user settings.

## Skills

| Skill | Use it when |
|---|---|
| `checking-uptime-status` | "Is anything down?", "Who is on call?", "How did the checkout monitor do this week?" |
| `responding-to-incidents` | "Declare an incident for the checkout API", "Acknowledge that alert", "Check the landing page now" |
| `writing-postmortems` | "Write up the postmortem for yesterday's outage" |
| `adding-uptime-monitors` | "Start monitoring https://api.example.com/health" |

## Links

- Docs: https://getuptimely.com/docs/api
- Privacy: https://getuptimely.com/privacy
- Support: support@devino.ca
