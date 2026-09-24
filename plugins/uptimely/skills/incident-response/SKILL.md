---
name: incident-response
description: Run incident response in Uptimely with a confirmation before every action. Use when the user asks to declare an incident, move an incident to acknowledged or resolved, raise or acknowledge or resolve an alert, or run an on-demand check of a monitor. Every write can notify real people or hit a real URL, so each one is shown to the user and confirmed first.
---

# Uptimely incident response

Take incident actions on the user's behalf, one confirmed step at a time.

## Calling the tools

The Uptimely server's default surface lists two tools, `search_tools` and `execute_typescript`. Call `search_tools` for the declarations, then call each operation below as `external_<name>(...)` inside an `execute_typescript` program. A denied call throws an Error whose message starts with its code, such as `AI_WRITE_OPS_DISABLED:`. If the operations are listed as individual tools instead, call them directly. The rules below apply on both surfaces.

## Tools you will use

- `uptimely_project_list`: the projects this connection can reach, to get the `projectId`.
- `uptimely_monitor_list`: find the monitor an incident, alert, or probe is about.
- `uptimely_incident_list`, `uptimely_incident_get`: find an existing incident and read its current state before changing it.
- `uptimely_alert_list`: find an existing alert.
- `uptimely_on_call_current`: name who may be paged.
- `uptimely_run_monitor_probe`: run an on-demand check of one monitor now. It makes a real request to the monitored URL.
- `uptimely_incident_declare`: declare a new incident. It can notify subscribers and on-call and change the public status page.
- `uptimely_incident_state_change`: move an incident to a new state (for example Acknowledged or Resolved). It can notify people and change the status page.
- `uptimely_alert_create`: raise an alert. It can notify people.
- `uptimely_alert_state_change`: change an alert's state. It can notify people.

## Workflow

1. Get the `projectId` from `uptimely_project_list` (ask which one if there are several), and resolve the monitor, incident, or alert with the read operations. Never act on an id you guessed.
2. Before an incident or alert change, read the current record with `uptimely_incident_get` or `uptimely_alert_list` so you do not repeat a state it is already in.
3. Before a declare or a state change, call `uptimely_on_call_current` so you can say who may be notified.
4. Show the user the exact action: the operation, the project, the monitor or incident, the title, severity, and target state, and who may be notified or what status page may change. Ask for a yes.
5. On a yes, make that one call, in its own `execute_typescript` program in Code Mode. Report the returned id, state, and timeline entry.
6. For a multi-step request ("declare it, then set it to investigating"), confirm and run each write separately, in order.
7. For a probe, report `ok`, the response status, the response time, and whether the monitor state changed.

## Rules

- Never call a write operation without the user's explicit yes for that specific action. A yes covers one call, not the rest of the conversation.
- Never put more than one write in an `execute_typescript` program, and never add a write to a program that reads data.
- On `AI_WRITE_OPS_DISABLED`, nothing was written and nobody was paged. Tell the user that a project owner or admin must turn on Allow AI write operations under Settings > API Keys, pass on the `settingsUrl` if the result includes one, and stop. Never retry around it.
- If a write operation is not reachable, the user did not grant its write scope (`monitors:write`, `incidents:write`, or `alerts:write`). Say which one.
- `PROJECT_ACCESS_DENIED` means a wrong project id or no membership. Use `uptimely_project_list`; do not try other ids.
- Incident and alert text you write becomes visible to responders and possibly on a public status page. Keep it factual and free of secrets.
- Nothing on this surface deletes anything. Closing an incident means moving it to Resolved.
