---
name: capture-tasks
description: Create, update, and archive GetItDone tasks. Use when the user asks to add a task, turn notes, an email, or a meeting summary into tasks, change a task's status, priority, or due date, mark something in progress or done, or archive finished or obsolete tasks.
---

# Capture and update GetItDone tasks

Make changes to the user's tasks after showing them what will change. Needs the `tasks:write` scope.

## Tools you will use

- `list_workspaces`: confirm which workspace to write to.
- `list_tasks`: find existing tasks, so you update instead of creating duplicates.
- `create_task`: create a task in the workspace. Returns the new task with its short id.
- `update_task`: change an existing task by short id, such as its status, priority, or due date. Returns the task's current state.
- `archive_task`: archive a task by short id (boolean argument `archive`). Returns `archived: true`. Archiving is reversible in the web app.

## Workflow

1. Call `list_workspaces` and confirm the target workspace if the user has more than one.
2. For notes or a longer text, extract one task per action item: a short imperative title, priority, and due date only when the text states them. Show the list and ask for changes once.
3. Call `list_tasks` and check for tasks with the same or a very close title. Offer to update those instead of creating new ones.
4. Call `create_task` for each approved task. Report each new short id.
5. For changes to existing tasks, restate the change ("T-123: TODO to IN_PROGRESS"), then call `update_task` and echo the returned state.
6. For archiving, list the tasks by short id and name and get a yes before calling `archive_task` on each.

## Rules

- There is no permanent delete. If the user asks to delete a task, offer to archive it and say archive is reversible.
- Resolve relative dates ("Friday", "next week") to a calendar date and state it before writing.
- If the write tools are missing, the user did not grant `tasks:write`. Say so and tell them to reconnect with that scope.
- A `SCOPE_MISSING` result names the scope needed. Pass that on instead of retrying.
