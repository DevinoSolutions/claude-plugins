---
name: status-check
description: Report the current health of an Uptimely project and its recent history. Use when the user asks if anything is down, what incidents or alerts are open, how a monitor has performed over a period, who is on call, whether maintenance is scheduled, or which status pages and telemetry services exist. Read-only; never declares, changes, or probes anything.
---

# Uptimely status check

Answer "is anything wrong, and who is handling it" for one Uptimely project from live data.

## Calling the tools

The Uptimely server's default surface lists two tools, `search_tools` and `execute_typescript`. Call `search_tools` for the declarations, then call each operation below as `external_<name>(...)` inside an `execute_typescript` program. Batch independent reads with `Promise.all`, for example the overview, monitor list, and open incidents in one program. A denied call throws an Error whose message starts with its code, such as `PROJECT_ACCESS_DENIED:`. If the operations are listed as individual tools instead, call them directly.

## Tools you will use

- `uptimely_project_list`: the projects this connection can reach, with their ids. Takes no input.
- `uptimely_project_overview`: monitor, incident, alert, and status page counts plus the project's overall health.
- `uptimely_monitor_list`: every monitor with its current status.
- `uptimely_monitor_get`: one monitor's configuration.
- `uptimely_monitor_status_history`: a monitor's recorded status transitions with durations over a window.
- `uptimely_monitor_target_list`: the targets a monitor checks.
- `uptimely_incident_list`: incidents, optionally only active ones (`activeOnly`).
- `uptimely_incident_get`: one incident with state, severity, root cause, notes, and state timeline.
- `uptimely_alert_list`: alerts and their states.
- `uptimely_on_call_current`: who is on call now and who is next, per schedule.
- `uptimely_maintenance_list`: scheduled and past maintenance windows.
- `uptimely_status_page_list`: the project's status pages.
- `uptimely_telemetry_service_list`: the project's telemetry services.

## Workflow

1. Get the `projectId`. Every operation except `uptimely_project_list` needs it. Call `uptimely_project_list`; if it returns one project, use it, and if several, ask the user which one. Reuse the id for every later call.
2. Call `uptimely_project_overview`. Lead with the overall health in one line.
3. If anything is not healthy, call `uptimely_monitor_list` and name the monitors that are down or degraded, then `uptimely_incident_list` with `activeOnly: true` and `uptimely_alert_list`, and name the open incidents and active alerts with their state and severity.
4. Call `uptimely_on_call_current` and say who is on call now and who is next.
5. Call `uptimely_maintenance_list` and mention any window that is in progress or coming up soon, since it can explain a down monitor.
6. For a history question ("how did X do this week"), find the monitor in `uptimely_monitor_list`, then call `uptimely_monitor_status_history` for the window. Report total downtime, the number of outages, and the longest one.
7. Offer next steps that match what you found: the `incident-response` skill for an unhandled outage, or the `postmortem` skill for a resolved one.

## Rules

- Never call a write operation from this skill: `uptimely_monitor_create`, `uptimely_run_monitor_probe`, `uptimely_incident_declare`, `uptimely_incident_state_change`, `uptimely_incident_postmortem_save`, `uptimely_alert_create`, or `uptimely_alert_state_change`.
- `PROJECT_ACCESS_DENIED` means the id is wrong or the account is not a member. Use `uptimely_project_list` to pick a valid id; never guess one.
- Report times in the user's timezone and say which one you used.
- Report only what the tools return. Do not estimate uptime percentages the data does not contain.
