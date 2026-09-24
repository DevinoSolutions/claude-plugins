---
name: onboarding-workflow
description: Build, review, and troubleshoot Sendly workflow automations such as welcome or onboarding series. Use when the user asks to build a drip, welcome, or onboarding sequence from a brief, to see what a workflow does or whether it is running, why it is not sending, or to change its steps. New workflows are created disabled.
---

# Sendly onboarding workflow

Turn a plain-language brief into a multi-step workflow, and explain or fix existing ones. A live workflow sends real email to every contact who triggers it, so turning one on needs the user's explicit yes.

## Tools you will use

- `list_workflows`, `get_workflow`: existing workflows and their full definition (trigger and steps).
- `get_workflow_status`: whether a workflow is enabled, its step count, and its execution count.
- `list_workflow_executions`: individual runs, to see where contacts stopped.
- `list_events`: recent events, to check the trigger event actually arrives.
- `list_templates`: templates the email steps can use.
- `create_workflow`: create a workflow from a structured spec. Created with `enabled: false` by default.
- `clone_workflow`: copy an existing workflow as a starting point.
- `edit_workflow`: change a workflow's step graph.
- `update_workflow`: change a workflow's settings. Step changes go through `edit_workflow`.
- `manage_workflow`: change a workflow's state. Read its description for the actions it accepts.

## Workflow

1. For a new workflow, restate the brief as a trigger and a numbered list of steps (for example: on `member.signup` send Welcome, wait 3 days, send Nudge). Confirm it with the user.
2. Call `list_templates` and map each email step to a template. Point out steps that have no template yet.
3. Call `create_workflow` (or `clone_workflow` from a similar one). Leave it disabled. Report its id and steps.
4. For an existing workflow, call `get_workflow_status` and `get_workflow`, and describe the trigger and each step in plain words.
5. If it is not sending: check it is enabled, call `list_events` to see whether the trigger event is arriving, and call `list_workflow_executions` to see where runs stop. Report the first cause you find.
6. To change steps, show the before and after, then call `edit_workflow`.
7. To turn a workflow on, say that it will start sending real email to every contact who triggers it from now on, get an explicit yes, then make the change.

## Rules

- Never enable a workflow, or change one that is already enabled, without an explicit yes in this turn.
- Workflows refuse a `from` address that is not on a verified domain. If that happens, offer the `deliverability-check` skill.
- Confirm the workflow by name before `delete_workflow`. It is annotated destructive.
