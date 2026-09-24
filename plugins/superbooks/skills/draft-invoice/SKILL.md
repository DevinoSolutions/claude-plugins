---
name: draft-invoice
description: Draft a SuperBooks invoice for a customer, optionally from tracked time, and send it only when the user says so. Use when the user asks to invoice or bill a customer, turn tracked hours into an invoice, create a customer for an invoice, or send a draft invoice.
---

# Draft an invoice in SuperBooks

Build a correct draft invoice from what the user says or from their tracked time. The draft stays in SuperBooks until the user explicitly asks to send it; sending e-mails the customer.

## Tools you will use

- `customers_list`: find the customer by name. `customers_get` for the billing details of one.
- `customers_create`: add a customer that does not exist yet.
- `tracker_list_projects`: time-tracking projects, with their estimates.
- `tracker_list_entries`: time entries (start, stop, description) for a project and period.
- `team_get`: the team's profile, including its currency.
- `invoices_create_draft`: save an invoice with line items and a due date as a draft. Returns the invoice number.
- `invoices_get`: read the draft back to confirm totals.
- `invoices_send`: e-mail the invoice to the customer and mark it unpaid. Confirm first, every time.

## Workflow

1. Find the customer with `customers_list`. If there is no match, offer to create one; ask for the name and billing e-mail, then call `customers_create`.
2. Build the line items:
   - From the user's words: description, quantity, unit price.
   - From tracked time: `tracker_list_projects` to find the project, `tracker_list_entries` for the period, then total the hours and show the entries you are billing.
3. Call `team_get` for the currency. Show the draft: customer, line items, subtotal, due date (default 30 days unless the user says otherwise).
4. On approval, call `invoices_create_draft`. Report the invoice number and that it is a draft the customer has not received.
5. Only if the user asks to send it: restate "Send INV-0007 for $750.00 to billing@cedarvalley.example?" and wait for a yes. Then call `invoices_send` and confirm with `invoices_get` that it is unpaid with a `sent_at` time.

## Rules

- Never call `invoices_send` without an explicit confirmation naming the invoice and the recipient in this conversation. Drafting never implies sending.
- Do not invent rates, hours, or tax. Ask when a price or quantity is missing.
- Money is never moved from this skill; there is no payment tool.
- Deleting or voiding invoices is not offered here. If the user asks, point them to the SuperBooks app.
