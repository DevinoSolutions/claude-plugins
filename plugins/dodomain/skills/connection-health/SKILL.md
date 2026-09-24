---
name: connection-health
description: Review the DNS health of existing doDomain connections and queue rechecks. Use when the user asks which connected domains are healthy or broken, whether a customer's domain is still connected, when a connection was last checked, or wants to recheck a connection that may have drifted.
---

# doDomain connection health

Report which of the team's domain connections are healthy, which are broken, and queue a DNS recheck where the user asks for one.

## Tools you will use

- `list_apps`: app ids and names, so connections can be grouped by app.
- `list_connections`: connections with `status`, `fqdn`, and the `verifiedAt`, `lastCheckedAt`, and `brokenAt` timestamps. Filter by app or domain. Paginated.
- `reverify_connection`: queue an on-demand DNS recheck of one connection. Returns `{ accepted: true }`; the check runs asynchronously and does not return a verdict.
- `check_domain`: provider and zone for a broken domain, so the user knows which DNS provider the customer uses.

## Workflow

1. Call `list_apps`, then `list_connections` for the app the user named, or for every app when they asked about the whole team. Follow pagination until you have the full set.
2. Group the results by status. List broken connections first with `fqdn`, `brokenAt`, and `lastCheckedAt`, then healthy ones with `verifiedAt`.
3. For each broken connection the user cares about, call `check_domain` to name the DNS provider behind it.
4. If the user asks for a recheck, confirm which connection, then call `reverify_connection` once.
5. Tell the user the recheck is queued and runs in the background. Offer to read the result back later with `list_connections`.

## Rules

- `reverify_connection` answers `{ accepted: true }` and nothing else. Never report that as the domain being verified.
- Rechecks are rate limited. On `RATE_LIMITED`, report `retryAfterSeconds` and stop. Never loop on rechecks.
- An unknown connection id returns `NOT_FOUND`. Say the connection is not on this team and offer `list_connections`.
- Report timestamps in the user's timezone and say which timezone you used.
