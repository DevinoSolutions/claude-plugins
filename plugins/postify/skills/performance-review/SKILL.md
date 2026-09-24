---
name: performance-review
description: Report how the user's social posts performed and when to post next. Use when the user asks how last week or last month went, which channel performs best, delivery or failure rates, or the best time to post on a platform.
---

# Postify performance review

Read the workspace's delivery analytics and turn them into a short, honest report.

## Tools you will use

- `get_analytics` — workspace analytics for delivered posts: post counts, delivery rate, per-channel stats, for a date range.
- `suggest_optimal_time` — suggested posting times per platform from the workspace's own publish history. No model call, no external data.
- `list_posts` — to name the specific posts behind a number when the user asks "which ones".

## Workflow

1. Agree the window (default: the last 30 days). Call `get_analytics` for it.
2. Report in this order: total posts delivered, delivery rate, failed posts, then a per-channel table sorted by volume.
3. If there were failures, call `list_posts` filtered to `failed` for the window and list them with their channel and datetime so the user can act.
4. Call `suggest_optimal_time` for each platform the user publishes on and give the top suggestion per platform.
5. Close with at most three concrete next steps drawn from the numbers.

## Rules

- Only report numbers the tools returned. If a metric is missing, say it is not available in Postify analytics.
- Do not compare the user to industry benchmarks; there are none in the data.
- Do not schedule, publish, or delete anything from this skill.
