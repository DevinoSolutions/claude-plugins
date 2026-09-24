# SuperBooks plugin for Claude

Work your SuperBooks books from Claude: draft invoices, chase unpaid ones, categorize transactions
and match receipts, and read profit and loss, burn rate and runway.

## Install

```
/plugin marketplace add DevinoSolutions/claude-plugins
/plugin install superbooks@devino
```

Then ask Claude about your books. On the first tool call Claude opens the SuperBooks sign-in
page; approve the scopes you want on the consent screen. An operation whose scope you did not
grant is never reachable. Works on every SuperBooks plan.

## What it connects

Remote MCP server `https://api.superbooks.io/mcp` (OAuth 2.1 with PKCE and dynamic client
registration). The server exposes two tools:

- `search_tools`: lists the SuperBooks operations this connection can reach, as TypeScript
  declarations such as `external_invoices_list`, each tagged read-only, write or destructive.
- `execute_typescript`: runs a short TypeScript program that calls those `external_*` functions,
  so several calls cost one round trip. Every call enforces the same scope checks as a direct call.

Behind them sit 45 operations:

- Transactions: `transactions_list`, `transactions_get`, `transactions_update_status`,
  `transactions_update_category`, `transactions_delete`
- Invoices: `invoices_list`, `invoices_get`, `invoices_create_draft`, `invoices_send`,
  `invoices_void`
- Customers: `customers_list`, `customers_get`, `customers_create`, `customers_update`,
  `customers_delete`
- Categories and tags: `categories_list`, `categories_create`, `categories_update`,
  `categories_delete`, `tags_list`, `tags_create`, `tags_delete`
- Documents and receipt inbox: `documents_list`, `documents_get`, `documents_search`,
  `documents_delete`, `inbox_list`, `inbox_match`, `inbox_delete`
- Time tracker: `tracker_list_projects`, `tracker_list_entries`, `tracker_start_timer`,
  `tracker_stop_timer`, `tracker_delete_entry`
- Account and search: `bank_accounts_list`, `team_get`, `search_global`
- Reports: `reports_profit_loss`, `reports_burn_rate`, `reports_runway`, `reports_revenue`,
  `reports_spending`, `reports_balance`, `reports_top_customers`, `reports_recurring_expenses`

The eight destructive operations (the seven `*_delete` operations and `invoices_void`) are
reachable only when the credential holds full access and a team admin turns on Settings, AI,
"Destructive AI tools", which is off by default. Without them, 37 operations are reachable.
`invoices_send` e-mails the invoice to the customer. No operation moves money: bank connections,
payments and billing exist only in the app. Each credential is limited to 120 calls a minute.

Code Mode is the server's default. A server set to the per-tool surface lists the operations
above by name, without the `external_` prefix; the skills handle both.

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
- Support: support@devino.ca
