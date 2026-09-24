# SuperBooks plugin for Claude

Work your SuperBooks books from Claude: draft invoices, chase unpaid ones, categorize transactions
and match receipts, and read profit and loss, burn rate and runway.

## Install

```
/plugin marketplace add DevinoSolutions/claude-plugins
/plugin install superbooks@devino
```

Then ask Claude about your books. On the first tool call Claude opens the SuperBooks sign-in
page; approve the scopes you want on the consent screen. A tool whose scope you did not grant is
never offered. Works on every SuperBooks plan.

## What it connects

Remote MCP server `https://api.superbooks.io/mcp` (OAuth 2.1 with PKCE and dynamic client
registration). Tools:

- Transactions: `transactions_list`, `transactions_get`, `transactions_update_status`,
  `transactions_update_category`
- Invoices: `invoices_list`, `invoices_get`, `invoices_create_draft`, `invoices_send`
- Customers: `customers_list`, `customers_get`, `customers_create`, `customers_update`
- Categories and tags: `categories_list`, `categories_create`, `categories_update`, `tags_list`,
  `tags_create`
- Documents and receipt inbox: `documents_list`, `documents_get`, `documents_search`,
  `inbox_list`, `inbox_match`
- Time tracker: `tracker_list_projects`, `tracker_list_entries`, `tracker_start_timer`,
  `tracker_stop_timer`
- Account and search: `bank_accounts_list`, `team_get`, `search_global`
- Reports: `reports_profit_loss`, `reports_burn_rate`, `reports_runway`, `reports_revenue`,
  `reports_spending`, `reports_balance`, `reports_top_customers`, `reports_recurring_expenses`

Eight destructive tools (the seven `*_delete` tools and `invoices_void`) are hidden unless the
credential holds full access and a team admin turns on Settings, AI, "Destructive AI tools",
which is off by default. `invoices_send` e-mails the invoice to the customer. No tool moves money:
bank connections, payments and billing exist only in the app. Each credential is limited to
120 calls a minute.

## Skills

| Skill | Use it when |
|---|---|
| `draft-invoice` | "Invoice Cedar Valley Books for 6 hours of design at $125", "Bill my September hours on Harbor & Pine" |
| `unpaid-invoices` | "Which invoices are unpaid?", "Who owes me the most?" |
| `bookkeeping-cleanup` | "Categorize last month's transactions", "Match the receipts in my inbox" |
| `financial-report` | "How did June to September go?", "What's my runway?" |

## Links

- Docs: https://docs.superbooks.io/mcp
- Privacy: https://superbooks.io/privacy/
- Support: support@superbooks.io
