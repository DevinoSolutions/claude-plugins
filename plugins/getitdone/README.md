# GetItDone plugin for Claude

Review, create, and update tasks in your GetItDone workspaces.

## Install

```
/plugin marketplace add DevinoSolutions/claude-plugins
/plugin install getitdone@devino
```

Then ask Claude about your tasks. On the first tool call Claude opens the GetItDone sign-in
page; pick the scopes you want on the consent screen (`workspaces:read`, `projects:read`,
`tasks:read`, `tasks:write`). An operation whose scope you did not grant is never reachable
in the session.

## What it connects

Remote MCP server `https://app.nowgetitdone.com/api/mcp` (OAuth 2.1 with PKCE). It reaches 11
tools, each registered only when you granted its scope:

- Workspaces and docs (`workspaces:read`): `list_workspaces`, `search_docs`
- Projects (`projects:read`): `list_projects`
- Tasks (`tasks:read`): `list_tasks`, `get_task_details`, `get_task_video_context`
- Task changes (`tasks:write`): `create_task`, `update_task`, `complete_task_occurrence`,
  `link_task_dependency`, `archive_task`

Six tools only read. The five writes create and update tasks, mark one day of a repeating task
done, add or remove a "blocked by" link, and archive tasks. Archive is the only removal and is
reversible in the web app; nothing permanently deletes a task. Attachment and video-frame URLs
are short-lived presigned links to your own files.

By default the server runs in Code Mode: `tools/list` shows two tools, `search_tools` and
`execute_typescript`, and the tools above are called inside `execute_typescript` as
`external_<name>` functions (for example `external_list_tasks`) with the same scopes and gates. A
server set to the per-tool surface lists them by name instead. The skills handle both. In Code Mode,
`get_task_video_context` returns its text summary but not the frame images.

## Skills

| Skill | Use it when |
|---|---|
| `workload-review` | "What's on my plate this week?", "What's blocked right now?" |
| `task-deep-dive` | "Open T-123, why can't it start?", "What does the screen recording on this task show?" |
| `capture-tasks` | "Turn these meeting notes into tasks", "T-123 is waiting on T-120", "I did my workout yesterday" |
| `developer-docs` | "What does the 429 problem code mean in the GetItDone API?" |

## Links

- Docs: https://nowgetitdone.com/docs/connecting-ai-assistants
- Privacy: https://nowgetitdone.com/privacy
- Support: support@devino.ca
