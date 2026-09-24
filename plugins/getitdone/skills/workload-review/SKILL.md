---
name: workload-review
description: Summarize what is on the user's plate in GetItDone. Use when the user asks what they should work on, what is due this week, what is in progress or in review, what is blocked and what it blocks, or wants a status overview of a workspace or project.
---

# GetItDone workload review

Turn the workspace's task list into a short, prioritized view of what needs attention. Read only.

## Tools you will use

If the tool list shows only `search_tools` and `execute_typescript`, the server is in Code Mode: call each operation below inside `execute_typescript` as `external_<name>`, and use one program to run several independent reads together.

- `list_workspaces`: the workspaces the account belongs to, with their ids. Pass an id as `workspaceId` to target one.
- `list_projects`: the projects in the workspace with their ids.
- `list_tasks`: the latest version of each task with name, short id, status (`TODO`, `IN_PROGRESS`, `IN_REVIEW`, `COMPLETED`, `BLOCKED`), priority, due date, projects, whether it is blocked, and how many tasks it blocks. Filters by status, priority, and project.
- `get_task_details`: notes, attachments, and the dependency chain for one task, when a summary line is not enough.

## Workflow

1. Call `list_workspaces`. If the user belongs to more than one and did not name one, ask which, or use the one they usually work in and say which you used.
2. If the user named a project, call `list_projects` and use its id as the `list_tasks` filter.
3. Call `list_tasks`. Leave out `COMPLETED` tasks unless the user asks for them.
4. Present, in this order:
   - Blocked tasks, with how many tasks each one blocks.
   - Overdue tasks and tasks due in the window the user asked about (default: the next 7 days), sorted by due date then priority.
   - In progress and in review.
   - A count of the remaining `TODO` tasks.
5. For the top blocked task, call `get_task_details` and name what blocks it.
6. Close with at most three suggested next actions drawn from the list, such as the blocker that unblocks the most tasks.

## Rules

- Do not change anything from this skill: never call `create_task`, `update_task`, `complete_task_occurrence`, `link_task_dependency`, or `archive_task`. Hand off to `capture-tasks` for changes.
- Refer to tasks by short id and name so the user can find them in the app.
- If a project the user named is not in `list_projects`, say it does not exist. Do not guess another one.
- If a workspace id the user gave is not one of theirs, say so and offer `list_workspaces`.
