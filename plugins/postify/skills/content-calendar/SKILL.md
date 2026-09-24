---
name: content-calendar
description: Review and reorganize the Postify content calendar. Use when the user asks what is scheduled, wants to see upcoming or past posts, wants to move a post to another time, or asks where the gaps are in their posting schedule.
---

# Postify content calendar

Work the user's Postify calendar through the `postify` MCP server. All tools operate on the organization behind the connected account.

## Tools you will use

The `postify` server either lists these tools by name or, in Code Mode, lists only `search_tools` and `execute_typescript`. In Code Mode, call `search_tools` first, then call each tool below inside `execute_typescript` as `external_<name>` (for example `external_list_posts`); the program must `return` its result. A tool whose scope was not granted is absent either way: not listed, and not returned by `search_tools`.

- `list_posts`: posts with id, status (`draft`, `scheduled`, `published`, `failed`), scheduled datetime, and target channels. Filter by status or date range when the tool offers it.
- `get_schedule`: scheduled posts in a date window (`from`, `to`, `limit` up to 50).
- `get_post`: the full content of one post when the list summary is not enough.
- `list_channels`: connected social accounts (platform, handle, connection status). Use it to name channels correctly instead of guessing.
- `reschedule_post`: move a scheduled post to a new datetime. Content is unchanged.

## Workflow

1. Call `list_channels` once so you know which platforms exist.
2. Call `get_schedule` for the window the user cares about (default: today through the next 7 days). Use `list_posts` when the user also wants drafts, published, or failed posts.
3. Present the calendar grouped by day, then by channel. Show status and local time. Mark failed posts first.
4. For gaps, compare against the user's stated cadence (ask once if unknown) and list the empty days per channel.
5. To move a post, confirm the post id and the new time with the user, then call `reschedule_post`. Echo the new datetime back.

## Rules

- Never call `publish_now` or `delete_post` from this skill. Moving and reviewing only.
- Times: the server returns ISO 8601 datetimes. Convert to the user's timezone when you present them and say which timezone you used.
- If `list_posts` returns nothing, say so plainly and offer the `draft-post` skill.
