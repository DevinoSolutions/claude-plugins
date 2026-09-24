---
name: add-monitor
description: Add a new uptime monitor to an Uptimely project and optionally run a first check. Use when the user asks to start monitoring a URL, website, API endpoint, or service in Uptimely, or to add a monitor. Creates the monitor only after explicit confirmation.
---

# Add an Uptimely monitor

Create a monitor without duplicating an existing one, then check it once if the user wants.

## Calling the tools

The Uptimely server's default surface lists two tools, `search_tools` and `execute_typescript`. Call `search_tools` for the declarations, then call each operation below as `external_<name>(...)` inside an `execute_typescript` program. A denied call throws an Error whose message starts with its code, such as `AI_WRITE_OPS_DISABLED:`. If the operations are listed as individual tools instead, call them directly. The rules below apply on both surfaces.

## Tools you will use

- `uptimely_project_list`: the projects this connection can reach, to get the `projectId`.
- `uptimely_monitor_list`: existing monitors, to avoid a duplicate.
- `uptimely_monitor_target_list`: the targets existing monitors check.
- `uptimely_monitor_create`: create the monitor record. It writes to the project but does not itself contact the URL.
- `uptimely_monitor_get`: read the new monitor back.
- `uptimely_run_monitor_probe`: run an on-demand check of the new monitor. It makes a real request to the URL.

## Workflow

1. Get the `projectId` from `uptimely_project_list` (ask which one if there are several) and the URL or host to monitor. Suggest a clear name, such as "API: health".
2. Call `uptimely_monitor_list` and `uptimely_monitor_target_list`. If the same URL is already monitored, tell the user and stop unless they want a second monitor.
3. Show the monitor you will create: project, name, type, and URL, plus any settings the user asked for. Ask for a yes.
4. On a yes, call `uptimely_monitor_create` on its own. Then call `uptimely_monitor_get` on the new id and report its configuration.
5. Offer a first check. Only on a separate yes, call `uptimely_run_monitor_probe` and report `ok`, the response status, and the response time.

## Rules

- Never call `uptimely_monitor_create` or `uptimely_run_monitor_probe` without the user's yes for that exact call, and never put both in one `execute_typescript` program.
- On `AI_WRITE_OPS_DISABLED`, nothing was created. Say a project owner or admin must turn on Allow AI write operations under Settings > API Keys, and pass on the `settingsUrl` if the result includes one.
- If `uptimely_monitor_create` is not reachable, the user did not grant `monitors:write`.
- Only monitor URLs the user owns or is responsible for. Ask if that is unclear.
