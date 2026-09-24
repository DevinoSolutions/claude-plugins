---
name: usage-report
description: Report SnapVisor account activity and who has access. Use when the user asks how many builds or screenshots they ran in a period, which projects are busiest, how usage trends by day, week, or month, or who the members and pending invites on the account are.
---

# SnapVisor usage report

Turn the account's analytics and membership into a short, factual report.

## Tools you will use

The `snapvisor` MCP server has two tools: `search_tools` (call it first, for example with `analytics`, `member`, `project`) and `execute_typescript` (run a short program calling the declared `external_*` functions; the program must `return` its result).

If the connection lists the operations by name instead (the per-tool surface), call them directly without the `external_` prefix.

Operations this skill uses (confirm with `search_tools`):

- `external_getMe`: the accounts this connection can reach, with their `slug` and whether MCP access is included.
- `external_getAccountAnalytics`: build and screenshot counts for an account, `from` a date (optional `to`), grouped by `day`, `week` or `month`, optionally for named projects.
- `external_listProjects`: the account's projects.
- `external_listAccountMembers` and `external_listAccountInvites`: members with their level, and pending invites. These need the `account:admin` scope.

## Workflow

1. Call `external_getMe` to get the account slug. If the connection reaches several accounts, ask which one.
2. Agree the window (default: the current calendar month, grouped by `week`).
3. In one program, fetch `external_getAccountAnalytics` and `external_listProjects` with `await Promise.all`. Add the member and invite lists if the user asked about the team.
4. Report totals for the window, the trend per period in a small table, and the per-project split when available. For the team, list members by level and pending invites with their dates.

## Code Mode pattern

```ts
const me = await external_getMe({});
const accountSlug = me.accounts[0].slug;
const [analytics, projects] = await Promise.all([
  external_getAccountAnalytics({ accountSlug, from: "2026-09-01", groupBy: "week" }),
  external_listProjects({ accountSlug }),
]);
return { analytics, projects };
```

If a call throws `SCOPE_MISSING` or a 403, the connection lacks that scope (member lists need `account:admin`). Say which scope is missing and that the user can reconnect with it.

## Rules

- Report only numbers the operations returned. Do not estimate costs or compare against other teams.
- This skill only reads. Never call `external_updateAccount`, `external_setAccountMemberLevel`, `external_removeAccountMember`, `external_createAccountInvites`, or `external_cancelAccountInvite` from it. Do not invite, remove, or change members from here; those changes belong in the SnapVisor app or in an explicit request the user confirms.
