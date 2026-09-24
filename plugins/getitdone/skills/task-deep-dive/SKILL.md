---
name: task-deep-dive
description: Explain a single GetItDone task in full. Use when the user asks to open a task by short id or name, what a task actually contains, why it cannot start or what it is waiting on, what its attachments are, or what a video or screen recording attached to the task shows.
---

# GetItDone task deep dive

Read one task end to end, including its notes, attachments, dependencies, and any attached video, and explain it in plain words. Read only.

## Tools you will use

If the tool list shows only `search_tools` and `execute_typescript`, the server is in Code Mode: call each operation below inside `execute_typescript` as `external_<name>`.

- `list_tasks`: find the task's short id when the user gave only a name.
- `get_task_details`: the task's rich-text notes, every attachment with a short-lived URL, and its dependency chain (what blocks it and what it blocks). Takes the short id (123 for T-123) or task version id.
- `get_task_video_context`: evenly spaced still frames from a video uploaded to the task's notes or attachments, with a text summary, plus any YouTube or Vimeo links found in the notes.

## Workflow

1. If the user gave a name instead of a short id, call `list_tasks` and match it. Ask if more than one task matches.
2. Call `get_task_details`.
3. Summarize: status, priority, due date, a short summary of the notes, the attachments by file name, and the dependency chain.
4. If the task is blocked, name each blocking task with its status. Offer to open the blocker the same way.
5. If the task has a video, or the user asks what a recording shows, call `get_task_video_context` and describe what the frames show, in order.

## Rules

- `get_task_video_context` extracts still frames. It does not transcribe audio and does not watch linked YouTube or Vimeo videos. Say that when you describe a video, and list any linked videos as links only.
- In Code Mode only the tool's JSON summary comes back, not the frame images. Describe what the summary says and tell the user the frames themselves need a connection on the full tool surface.
- "No videos found on this task." is a normal result. Report it plainly.
- Attachment URLs expire. Do not store them or present them as permanent links; fetch the task again when the user needs a fresh one.
- Do not change the task from this skill: never call `create_task`, `update_task`, `complete_task_occurrence`, `link_task_dependency`, or `archive_task`. Hand off to `capture-tasks` for changes.
