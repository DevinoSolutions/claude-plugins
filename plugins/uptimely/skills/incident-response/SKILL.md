---
name: incident-response
description: Run incident response in Uptimely with a confirmation before every action. Use when the user asks to declare an incident, move an incident to acknowledged or resolved, raise or acknowledge or resolve an alert, or run an on-demand check of a monitor. Every write can notify real people or hit a real URL, so each one is shown to the user and confirmed first.
---

# Uptimely incident response

Take incident actions on the user's behalf, one confirmed step at a time.

## Tools you will use

- `uptimely_monitor_list`: find the monitor an incident, alert, or probe is about.
- `uptimely_incident_list`, `uptimely_incident_get`: find an existing incident and read its current state before changing it.
- `uptimely_alert_list`: find an existing alert.
- `uptimely_on_call_current`: name who will be paged.
- `uptimely_run_monitor_probe`: run an on-demand check of one monitor now. It makes a real request to the monitored URL.
- `uptimely_incident_declare`: declare a new incident. It can notify subscribers and on-call and change the public status page.
- `uptimely_incident_state_change`: move an incident to a new state (for example Acknowledged or Resolved). It can notify people and change the status page.
- `uptimely_alert_create`: raise an alert. It can notify people.
- `uptimely_alert_state_change`: change an alert's state. It can notify people.

## Workflow

1. Get the `projectId` (ask if you do not have it) and resolve the monitor, incident, or alert with the read tools. Never act on an id you guessed.
2. Before an incident or alert change, read the current record with `uptimely_incident_get` or `uptimely_alert_list` so you do not repeat a state it is already in.
3. Before a declare or a state change, call `uptimely_on_call_current` so you can say who may be notified.
4. Show the user the exact action: the tool, the project, the monitor or incident, the title, severity, and target state, and who may be notified or what status page may change. Ask for a yes.
5. On a yes, make that one call. Report the returned id, state, and timeline entry.
6. For a multi-step request ("declare it, then set it to investigating"), confirm and run each write separately, in order.
7. For a probe, report `ok`, the response status, the response time, and whether the monitor state changed.

## Rules

- Never call a write tool without the user's explicit yes for that specific action. A yes covers one call, not the rest of the conversation.
- If a tool returns `AI_WRITE_OPS_DISABLED`, nothing was written and nobody was paged. Tell the user that a project owner or admin must turn on Allow AI write operations, give them the `settingsUrl` from the result, and stop. Never retry around it.
- If a write tool is missing from your tool list, the user did not grant its write scope (`monitors:write`, `incidents:write`, or `alerts:write`). Say which one.
- `PROJECT_ACCESS_DENIED` means a wrong project id or no membership. Ask; do not try other ids.
- Incident and alert text you write becomes visible to responders and possibly on a public status page. Keep it factual and free of secrets.
- Nothing on this surface deletes anything. Closing an incident means moving it to Resolved.
