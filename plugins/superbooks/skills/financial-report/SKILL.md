---
name: financial-report
description: Report how the business is doing from SuperBooks data. Use when the user asks for profit and loss, revenue, spending by category, burn rate, runway, account balances, top customers, recurring expenses, or a monthly or quarterly summary of their finances.
---

# SuperBooks financial report

Read the team's reports and turn them into a short, honest summary in the team currency.

## Tools you will use

- `reports_profit_loss`: revenue, expenses and the difference per month, with totals.
- `reports_revenue`: revenue over a period.
- `reports_spending`: spending broken down by category.
- `reports_burn_rate`: monthly net spend.
- `reports_runway`: how long the current balance lasts at the current burn.
- `reports_balance`: balances over time.
- `reports_top_customers`: customers ranked by revenue.
- `reports_recurring_expenses`: subscriptions and other repeating costs.
- `bank_accounts_list`: connected accounts, to name where balances come from.
- `team_get`: the team profile, including its currency.

## Workflow

1. Agree the window (default: the last three full months). Call `team_get` for the currency.
2. Call `reports_profit_loss` for the window. Present a month-by-month table of revenue, expenses and net, then the totals.
3. Add what the user asked about:
   - Cash position: `reports_balance`, `reports_burn_rate`, `reports_runway`.
   - Where money goes: `reports_spending` and `reports_recurring_expenses`.
   - Where money comes from: `reports_revenue` and `reports_top_customers`.
4. Close with at most three observations drawn from the numbers, such as the largest expense category or a recurring cost that grew.

## Rules

- Only report figures the tools returned, in the team currency. If a report comes back empty for the window, say so.
- This is bookkeeping data, not tax or legal advice. Say so if the user asks what they owe in tax.
- This skill only reads. Nothing is changed, sent, or paid.
