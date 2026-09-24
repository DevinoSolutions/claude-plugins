---
name: financial-report
description: Report how the business is doing from SuperBooks data. Use when the user asks for profit and loss, revenue, spending by category, burn rate, runway, account balances, top customers, recurring expenses, or a monthly or quarterly summary of their finances.
---

# SuperBooks financial report

Read the team's reports and turn them into a short, honest summary in the team currency.

## Tools you will use

The `superbooks` MCP server has two tools: `search_tools` (call it first with the query `reports` to get every report's exact input shape) and `execute_typescript` (run a short program calling the declared `external_*` functions; the program must `return` its result).

If the connection lists the operations by name instead (the per-tool surface), call them directly without the `external_` prefix.

Operations this skill uses:

- `external_reports_profit_loss`: revenue, expenses and the difference per month, with totals.
- `external_reports_revenue`: revenue over a period.
- `external_reports_spending`: spending broken down by category.
- `external_reports_burn_rate`: monthly net spend.
- `external_reports_runway`: how long the current balance lasts at the current burn.
- `external_reports_balance`: balances over time.
- `external_reports_top_customers`: customers ranked by revenue.
- `external_reports_recurring_expenses`: subscriptions and other repeating costs.
- `external_bank_accounts_list`: connected accounts, to name where balances come from.
- `external_team_get`: the team profile, including its currency.

## Workflow

1. Agree the window (default: the last three full months).
2. Fetch every report the question needs in one program with `await Promise.all`, together with `external_team_get`:
   - Performance: `external_reports_profit_loss`.
   - Cash position: `external_reports_balance`, `external_reports_burn_rate`, `external_reports_runway`.
   - Where money goes: `external_reports_spending`, `external_reports_recurring_expenses`.
   - Where money comes from: `external_reports_revenue`, `external_reports_top_customers`.
3. Present a month-by-month table of revenue, expenses and net, then the totals, then the sections the user asked about.
4. Close with at most three observations drawn from the numbers, such as the largest expense category or a recurring cost that grew.

## Code Mode pattern

```ts
const range = { from: "2026-06-01", to: "2026-09-30" };
const [team, pl, runway, spending] = await Promise.all([
  external_team_get({}),
  external_reports_profit_loss(range),
  external_reports_runway({}),
  external_reports_spending(range),
]);
return { currency: team.currency, pl, runway, spending };
```

Match each report's arguments to its `search_tools` declaration. A failing call throws an `Error`; wrap calls in try/catch when the rest should still return.

## Rules

- Only report figures the operations returned, in the team currency. If a report comes back empty for the window, say so.
- This is bookkeeping data, not tax or legal advice. Say so if the user asks what they owe in tax.
- This skill only reads. Nothing is changed, sent, or paid.
