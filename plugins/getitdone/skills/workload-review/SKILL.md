---
name: workload-review
description: Summarize what is on the user's plate in GetItDone. Use when the user asks what they should work on, what is due this week, what is in progress or in review, what is blocked and what it blocks, or wants a status overview of a workspace.
---

# GetItDone workload review

Turn the workspace's task list into a short, prioritized view of what needs attention. Read only.

## Tools you will use

- `list_workspaces`: the workspaces the account belongs to, with the active one flagged. Tools default to the active workspace.
- `list_tasks`: tasks with name, short id, status (`TODO`, `IN_PROGRESS`, `IN_REVIEW`, `COMPLETED`, `BLOCKED`), priority, due date, whether each is blocked, and how many tasks it blocks. Filter by status when the user asks for one.
- `get_task_details`: notes, attachments, and the dependency chain for one task, when a summary line is not enough.

## Workflow

1. Call `list_workspaces`. If the user belongs to more than one and did not name one, use the active workspace and say which one you used.
2. Call `list_tasks` for that workspace. Leave out `COMPLETED` tasks unless the user asks for them.
3. Present, in this order:
   - Blocked tasks, with how many tasks each one blocks.
   - Overdue tasks and tasks due in the window the user asked about (default: the next 7 days), sorted by due date then priority.
   - In progress and in review.
   - A count of the remaining `TODO` tasks.
4. For the top blocked task, call `get_task_details` and name what blocks it.
5. Close with at most three suggested next actions drawn from the list, such as the blocker that unblocks the most tasks.

## Rules

- Do not create, update, or archive anything from this skill. Hand off to `capture-tasks` for changes.
- Refer to tasks by short id and name so the user can find them in the app.
- If a workspace id the user gave is not one of theirs, say so and offer `list_workspaces`. Do not guess another workspace.
