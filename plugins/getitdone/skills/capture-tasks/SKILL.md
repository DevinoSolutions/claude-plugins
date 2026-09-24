---
name: capture-tasks
description: Create, update, link, complete, and archive GetItDone tasks. Use when the user asks to add a task or a repeating habit, turn notes, an email, or a meeting summary into tasks, change a task's status, priority, dates, or project, say one task is waiting on another, mark a day of a routine done, or archive finished or obsolete tasks.
---

# Capture and update GetItDone tasks

Make changes to the user's tasks after showing them what will change. Needs the `tasks:write` scope, plus `projects:read` to file tasks under a project.

## Tools you will use

If the tool list shows only `search_tools` and `execute_typescript`, the server is in Code Mode: call each operation below inside `execute_typescript` as `external_<name>`. Call `search_tools` first for the exact argument shapes.

- `list_workspaces`: confirm which workspace to write to.
- `list_projects`: project ids, to file a task under a project that exists.
- `list_tasks`: find existing tasks, so you update instead of creating duplicates.
- `create_task`: create a task. Supports a start date (defer until), a due date, a project id, and a recurrence ("every weekday", "the 1st of each month"). Returns the new task with its short id.
- `update_task`: change a task by short id: name, status, priority, start date, due date, notes, story points, project, or repeat schedule. Returns the task's current state.
- `complete_task_occurrence`: mark one day of a repeating task done, by short id and a `YYYY-MM-DD` day (today if omitted). Past days and early future days are allowed.
- `link_task_dependency`: record that one task is blocked by another, or remove that link with action `remove`. Links that would create a loop are refused.
- `archive_task`: archive or unarchive a task by short id. Archived tasks are hidden from the main list.

## Workflow

1. Call `list_workspaces` and confirm the target workspace if the user has more than one.
2. For notes or a longer text, extract one task per action item: a short imperative title, and priority, dates, project, or recurrence only when the text states them. Show the list and ask for changes once.
3. If a project is named, call `list_projects`. If it is not there, say so instead of inventing it or writing its name into the task.
4. Call `list_tasks` and check for tasks with the same or a very close title. Offer to update those instead of creating new ones.
5. Call `create_task` for each approved task. Report each new short id.
6. For changes to existing tasks, restate the change ("T-123: TODO to IN_PROGRESS"), then call `update_task` and echo the returned state.
7. When the user says one task is waiting on another, restate it ("T-124 is blocked by T-120"), then call `link_task_dependency`.
8. For a repeating task, use `complete_task_occurrence` for the day the user named instead of changing the task's status.
9. For archiving, list the tasks by short id and name and get a yes before calling `archive_task` on each.

## Rules

- There is no permanent delete. If the user asks to delete a task, offer to archive it and say archive is reversible.
- Resolve relative dates ("Friday", "yesterday", "next week") to a calendar date and state it before writing.
- If a dependency link is refused because it would create a loop, report which tasks form the loop.
- If the write operations are missing, the user did not grant `tasks:write`. Say so and tell them to reconnect with that scope.
- A `SCOPE_MISSING` result names the scope needed. Pass that on instead of retrying.
