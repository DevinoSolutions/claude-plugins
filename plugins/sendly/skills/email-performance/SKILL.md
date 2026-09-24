---
name: email-performance
description: Report how the user's Sendly email performed. Use when the user asks how last week's or last month's emails did, open or bounce counts, how a specific campaign performed, what happened to a single email, or how close the project is to its sending limits.
---

# Sendly email performance

Read Sendly's analytics and delivery history and turn them into a short, honest report. Read only.

## Tools you will use

- `view_analytics`: sent, delivered, opened, and bounced counts for a time window.
- `list_emails`: individual emails with status. Use it to name the emails behind a number.
- `get_email`: one email's delivery history (for example queued, then sent).
- `list_campaigns`, `get_campaign_stats`: the list of campaigns and the stats for one campaign.
- `get_usage`: the project's sending counters against its daily and monthly caps.

## Workflow

1. Agree the window (default: the last 7 days). Call `view_analytics` for it.
2. Report sent, delivered, opened, and bounced, with the bounce rate.
3. If anything bounced, call `list_emails` for the window and list the bounced emails with recipient and time. For one the user picks, call `get_email` and show its delivery history.
4. If the user asks about a campaign, call `list_campaigns` to find it, then `get_campaign_stats`.
5. Call `get_usage` and state how much of today's and this month's sending cap is used.
6. Close with at most three concrete next steps drawn from the numbers. For bounces or low delivery, offer the `deliverability-check` skill.

## Rules

- Only report numbers the tools returned. If a metric is not in the response, say it is not available.
- Do not compare against industry benchmarks; there are none in the data.
- Do not send, edit, or delete anything from this skill.
