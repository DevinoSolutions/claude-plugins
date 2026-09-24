---
name: unpaid-invoices
description: Review money owed to the business in SuperBooks. Use when the user asks which invoices are unpaid or overdue, who owes them the most, how much is outstanding, or wants the details of an open invoice before following up with a customer.
---

# Unpaid invoices in SuperBooks

Give the user a clear picture of receivables: what is open, what is overdue, and who owes what.

## Tools you will use

- `invoices_list`: invoices filtered by status (for example `unpaid`), with amounts and due dates.
- `invoices_get`: one invoice with line items, customer, totals and `sent_at`.
- `customers_get`: contact details for a customer the user wants to follow up with.
- `reports_top_customers`: customers ranked by revenue, for context on who matters most.
- `team_get`: the team currency.

## Workflow

1. Call `invoices_list` with `status: "unpaid"`. Call `team_get` for the currency.
2. Split the list into overdue (due date before today) and not yet due. Sort each by amount.
3. Present a table: invoice number, customer, amount, due date, days overdue. Give the totals for overdue and for all open invoices.
4. Group by customer and name the customer with the largest open balance.
5. If the user wants to follow up with a customer, call `invoices_get` and `customers_get` and draft a short, polite reminder e-mail for the user to send themselves. Give invoice number, amount, due date and the customer's billing e-mail.

## Rules

- This skill only reads. SuperBooks has no reminder tool, and `invoices_send` is for sending a draft, so do not use it to nudge a customer about an invoice already sent.
- Never mark an invoice paid or void it from here. Payments are recorded in the app.
- Use the dates and amounts the tools return. State today's date when you compute days overdue.
