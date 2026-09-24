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

Remote MCP server `https://app.getuptimely.com/api/mcp` (OAuth 2.1 with PKCE). Tools:

- Read: `uptimely_project_overview`, `uptimely_monitor_list`, `uptimely_monitor_get`,
  `uptimely_monitor_status_history`, `uptimely_monitor_target_list`, `uptimely_incident_list`,
  `uptimely_incident_get`, `uptimely_alert_list`, `uptimely_maintenance_list`,
  `uptimely_on_call_current`, `uptimely_status_page_list`, `uptimely_telemetry_service_list`.
- Write: `uptimely_monitor_create`, `uptimely_run_monitor_probe`, `uptimely_incident_declare`,
  `uptimely_incident_state_change`, `uptimely_incident_postmortem_save`,
  `uptimely_alert_create`, `uptimely_alert_state_change`.

Every call names the project it acts on (`projectId`); there is no current project. Access is
re-checked against your Uptimely membership on every call.

The write tools stay inert until a project owner turns on Allow AI write operations under
Settings > API Keys. It is off by default. Six write tools reach outside Uptimely: a probe hits
a real URL, and declaring an incident or changing incident or alert state can notify real people
and change what a public status page shows. The skills in this plugin ask before every write.

Review and revoke connected assistants under Connected AI apps in your Uptimely user settings.

## Skills

| Skill | Use it when |
|---|---|
| `status-check` | "Is anything down?", "Who is on call?", "How did the checkout monitor do this week?" |
| `incident-response` | "Declare an incident for the checkout API", "Acknowledge that alert", "Check the landing page now" |
| `postmortem` | "Write up the postmortem for yesterday's outage" |
| `add-monitor` | "Start monitoring https://api.example.com/health" |

## Links

- Docs: https://getuptimely.com/docs/api
- Privacy: https://getuptimely.com/privacy
- Support: https://app.getuptimely.com/support
