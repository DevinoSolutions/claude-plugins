---
name: add-monitor
description: Add a new uptime monitor to an Uptimely project and optionally run a first check. Use when the user asks to start monitoring a URL, website, API endpoint, or service in Uptimely, or to add a monitor. Creates the monitor only after explicit confirmation.
---

# Add an Uptimely monitor

Create a monitor without duplicating an existing one, then check it once if the user wants.

## Tools you will use

- `uptimely_monitor_list`: existing monitors, to avoid a duplicate.
- `uptimely_monitor_target_list`: the targets existing monitors check.
- `uptimely_monitor_create`: create the monitor record. It writes to the project but does not itself contact the URL.
- `uptimely_monitor_get`: read the new monitor back.
- `uptimely_run_monitor_probe`: run an on-demand check of the new monitor. It makes a real request to the URL.

## Workflow

1. Get the `projectId` (ask if you do not have it) and the URL or host to monitor. Suggest a clear name, such as "API: health".
2. Call `uptimely_monitor_list` and `uptimely_monitor_target_list`. If the same URL is already monitored, tell the user and stop unless they want a second monitor.
3. Show the monitor you will create: project, name, type, and URL, plus any settings the user asked for. Ask for a yes.
4. On a yes, call `uptimely_monitor_create`. Then call `uptimely_monitor_get` on the new id and report its configuration.
5. Offer a first check. Only on a separate yes, call `uptimely_run_monitor_probe` and report `ok`, the response status, and the response time.

## Rules

- Never call `uptimely_monitor_create` or `uptimely_run_monitor_probe` without the user's yes for that exact call.
- If a tool returns `AI_WRITE_OPS_DISABLED`, nothing was created. Give the user the `settingsUrl` from the result and say a project owner or admin must turn on Allow AI write operations.
- If `uptimely_monitor_create` is missing from your tool list, the user did not grant `monitors:write`.
- Only monitor URLs the user owns or is responsible for. Ask if that is unclear.
