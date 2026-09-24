---
name: unpaid-invoices
description: Review money owed to the business in SuperBooks. Use when the user asks which invoices are unpaid or overdue, who owes them the most, how much is outstanding, or wants the details of an open invoice before following up with a customer.
---

# Unpaid invoices in SuperBooks

Give the user a clear picture of receivables: what is open, what is overdue, and who owes what.

## Tools you will use

The `superbooks` MCP server has two tools: `search_tools` (call it first, for example with `invoice`, to get the exact input shapes) and `execute_typescript` (run a short program calling the declared `external_*` functions; the program must `return` its result).

Operations this skill uses:

- `external_invoices_list`: invoices filtered by status (for example `unpaid`), with amounts and due dates.
- `external_invoices_get`: one invoice with line items, customer, totals and `sent_at`.
- `external_customers_get`: contact details for a customer the user wants to follow up with.
- `external_reports_top_customers`: customers ranked by revenue, for context.
- `external_team_get`: the team currency.

## Workflow

1. In one program, fetch `external_invoices_list` with `status: "unpaid"` and `external_team_get` with `await Promise.all`.
2. Split the list into overdue (due date before today) and not yet due. Sort each by amount.
3. Present a table: invoice number, customer, amount, due date, days overdue. Give the totals for overdue and for all open invoices.
4. Group by customer and name the customer with the largest open balance.
5. If the user wants to follow up with a customer, fetch `external_invoices_get` and `external_customers_get` together and draft a short, polite reminder e-mail for the user to send themselves, with invoice number, amount, due date and the customer's billing e-mail.

## Code Mode pattern

```ts
const [open, team] = await Promise.all([
  external_invoices_list({ status: "unpaid" }),
  external_team_get({}),
]);
return { open, currency: team.currency };
```

## Rules

- This skill only reads. SuperBooks has no reminder operation, and `external_invoices_send` is for sending a draft, so never use it to nudge a customer about an invoice already sent.
- Never mark an invoice paid or void it from here. Payments are recorded in the app.
- Use the dates and amounts the operations return. State today's date when you compute days overdue.
