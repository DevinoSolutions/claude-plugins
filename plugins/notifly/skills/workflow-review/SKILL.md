---
name: workflow-review
description: Review a Notifly environment's notification setup: workflows with their steps and channels, topics, and recent delivery activity. Use when the user asks which workflows exist, what a workflow does or which channels it uses, what topics they have, or wants an overview or audit of their notification setup. Read-only; never sends anything.
---

# Notifly workflow review

Give the user a clear map of what their Notifly environment sends, on which channels, and how it has been doing.

## Calling the tools

The Notifly server's default surface lists two tools, `search_tools` and `execute_typescript`. Call `search_tools` for the declarations, then call each operation below as `external_<name>(...)` inside an `execute_typescript` program. Fetch several workflows in one program with `Promise.all` over `external_get_workflow`. A denied call throws an Error whose message starts with its code. If the operations are listed as individual tools instead, call them directly.

## Tools you will use

- `list_workflows`: the workflows in the connected environment with identifiers, names, tags, and status.
- `get_workflow`: one workflow's steps, channels, and status.
- `list_topics`: named subscriber groups used for fan-out.
- `list_notifications`: recent send events with channels and delivery status.

## Workflow

1. Call `list_workflows`. Show a table: name, identifier, status, tags.
2. For each workflow the user cares about (all of them if there are only a few), call `get_workflow` and add its steps in order and its channels to the table.
3. Call `list_topics` and list the topics by name.
4. Call `list_notifications` for a recent sample. Count events per workflow and note any channel with failed or skipped deliveries.
5. Point out what the data shows plainly, for example: inactive workflows, workflows with no recent sends, a channel that keeps failing, or a workflow that uses a channel with no recent successful delivery.
6. For one workflow in depth ("what does password-reset do?"), describe its steps in order, the channel of each step, and the payload fields it uses.

## Rules

- Never call `trigger_workflow` from this skill. If the user wants to send, offer the `send-notification` skill.
- The review covers only the environment picked on the consent screen. Say which one when it matters.
- Do not show internal fields such as `_id`, `_environmentId`, `_organizationId`, or `_creatorId` unless the user asks.
- Report only what the tools return. The activity feed is a list of events, not analytics; do not present rates the data does not support.
