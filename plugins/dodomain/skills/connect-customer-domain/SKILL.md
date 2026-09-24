---
name: connect-customer-domain
description: Start and follow a doDomain connect session for a customer's domain. Use when the user wants to connect, onboard, or point a customer's domain at one of their apps, needs the DNS records the customer must add, or asks whether a session's records have landed or are verified yet.
---

# Connect a customer domain with doDomain

Walk one domain from a new connect session to verified DNS. Creating a session uses one unit of the plan's monthly connection quota, so confirm before you create one.

## Tools you will use

The `dodomain` server either lists these tools by name or, in Code Mode, lists only `search_tools` and `execute_typescript`. In Code Mode, call `search_tools` first, then call each tool below inside `execute_typescript` as `external_<name>` (for example `external_list_apps`); the program must `return` its result. A tool whose scope was not granted is absent either way: not listed, and not returned by `search_tools`.

- `list_apps`: the apps on the team with id, name, public widget key, and sandbox flag. Never returns secret keys.
- `check_domain`: provider, zone, and connect tier for the domain, as a pre-flight.
- `create_connect_session`: start a session for a domain on an app. Takes the `appId`, the customer's `domain`, and the DNS records the app needs; returns a `sessionToken` and the records to apply. Counts against the monthly connection quota.
- `get_connect_session`: the current state of a session by token: domain, expected records, and status (`pending`, `detected`, `authorizing`, `writing`, `verifying`, `verified`).
- `verify_connect_session`: a live check of the session's expected records against authoritative nameservers, with a per-record breakdown of present, propagating, or absent.

## Workflow

1. Call `list_apps`. If the team has more than one app, ask which one the domain belongs to. Point out sandbox apps.
2. Call `check_domain` for the domain and tell the user which connect tier the customer will get.
3. Ask for the DNS records the app needs if the user has not given them. Do not invent record targets.
4. Confirm the app, the domain, and the records, and say that this uses one unit of the monthly connection quota. Then call `create_connect_session`.
5. Report the `sessionToken` and list the records the customer must apply, one per line with type, name, and value.
6. When the user asks for progress, call `get_connect_session` for the status, then `verify_connect_session` for the per-record breakdown.
7. Present the breakdown record by record. `verified` is true only when every record matches.

## Rules

- `verified: false` on a fresh session is a normal answer, not an error. It means the records are not published yet. Name each missing record.
- `propagating` means the record is on its way. Suggest checking again in a few minutes rather than calling in a loop.
- If a call returns `RATE_LIMITED`, tell the user the wait in seconds from `retryAfterSeconds` and stop. Do not retry automatically.
- Create at most one session per domain per request. If the user already has a session token for that domain, use `get_connect_session` instead.
