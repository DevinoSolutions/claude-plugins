---
name: page-insights
description: Report how a BioFlow page is performing and who it captured. Use when the user asks about page views, link clicks, CTR, top links, referrers, tip revenue, newsletter or lead signups, captured contacts, or which files they have uploaded.
---

# BioFlow page insights

Read the workspace's analytics, captured leads, and uploaded files, and turn them into a short, honest report. Read only.

## Tools you will use

- `analytics.summary`: aggregated views, clicks, CTR, top links, referrers, and tip revenue for the workspace.
- `contacts.list`: the leads the page has captured, with how each was captured (for example a newsletter signup or a file gate).
- `file.list`: the files uploaded to the account.
- `page.list`: page names and public URLs, so numbers can be tied to a page.

## Workflow

1. Agree the window (default: the last 30 days). Call `analytics.summary` for it.
2. Report in this order: views, clicks, CTR, the top links with their click counts, the top referrers, then tip revenue if there is any.
3. If the user asks about signups or leads, call `contacts.list` and give the count, the split by capture method, and the most recent entries.
4. If the user asks about files or gated downloads, call `file.list` and list the files by name.
5. Close with at most three concrete suggestions drawn from the numbers, such as moving the most clicked link higher. Offer the `edit-page-draft` skill to make the change.

## Rules

- Only report numbers the tools returned. If a metric is not in the response, say it is not available.
- Do not compare against industry benchmarks; there are none in the data.
- Contacts are personal data. Show only what the user asked for, and do not copy the full list into the chat unless they ask.
- Do not edit or publish anything from this skill.
