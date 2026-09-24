---
name: bookkeeping-cleanup
description: Tidy up SuperBooks transactions and receipts. Use when the user asks to categorize or recategorize transactions, fix a transaction's category or status, find uncategorized spending, match receipts or bills in the inbox to transactions, or find a receipt or document.
---

# Bookkeeping cleanup in SuperBooks

Work through transactions that need a category or status, and connect receipts to the transactions they belong to. Every change is shown to the user before it is made.

## Tools you will use

- `transactions_list`: transactions for a period (for example `from: "2026-09-01"`), with amount, merchant and `category_slug`.
- `transactions_get`: one transaction in full.
- `categories_list`: the team's categories and their slugs. `categories_create` adds one the user asks for.
- `transactions_update_category`: set a transaction's category by slug.
- `transactions_update_status`: set a transaction's workflow status.
- `tags_list` and `tags_create`: labels the user may want applied or added.
- `inbox_list`: incoming receipts and bills waiting to be matched.
- `inbox_match`: attach an inbox item to a transaction.
- `documents_search`, `documents_list`, `documents_get`: find receipts and documents already stored.

## Workflow

1. Agree the period (default: last calendar month). Call `transactions_list` for it and `categories_list` once.
2. List the transactions that are uncategorized or that the user flagged. For each, propose a category slug from `categories_list`, based on the merchant and amount.
3. Show the proposals as a table (date, merchant, amount, current category, proposed category) and let the user approve all, some, or edit them.
4. Apply the approved ones with `transactions_update_category`, one call per transaction. Report what changed.
5. For receipts: call `inbox_list`, pair each item with the transaction of the same amount and a close date, show the pairs, and call `inbox_match` for the ones the user approves.
6. If a category the user wants does not exist, offer to create it with `categories_create` first.

## Rules

- No change without the user's approval of that specific change. Batches are fine once the user approves the batch.
- Never guess a category slug; use one returned by `categories_list`.
- Deleting transactions, receipts, or categories is not offered here. Destructive tools are off by default for the team; do not ask the user to turn them on.
- Keep to the rate limit of 120 calls a minute: for large batches, work in chunks and report progress.
