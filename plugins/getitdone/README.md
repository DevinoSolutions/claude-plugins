# GetItDone plugin for Claude

Review, create, and update tasks in your GetItDone workspaces.

## Install

```
/plugin marketplace add DevinoSolutions/claude-plugins
/plugin install getitdone@devino
```

Then ask Claude about your tasks. On the first tool call Claude opens the GetItDone sign-in
page; pick the scopes you want on the consent screen (`workspaces:read`, `tasks:read`,
`tasks:write`). A tool whose scope you did not grant is never registered for the session.

## What it connects

Remote MCP server `https://app.nowgetitdone.com/api/mcp` (OAuth 2.1 with PKCE). Tools:
`list_workspaces`, `list_tasks`, `get_task_details`, `get_task_video_context`,
`create_task`, `update_task`, `archive_task`, `search_docs`.

Five tools only read. The three writes create, update, and archive tasks. Archive is the only
removal and is reversible in the web app; nothing permanently deletes a task. Attachment and
video-frame URLs are short-lived presigned links to your own files.

## Skills

| Skill | Use it when |
|---|---|
| `workload-review` | "What's on my plate this week?", "What's blocked right now?" |
| `task-deep-dive` | "Open T-123, why can't it start?", "What does the screen recording on this task show?" |
| `capture-tasks` | "Turn these meeting notes into tasks", "Set T-123 to in progress", "Archive the done ones" |
| `developer-docs` | "What does the 429 problem code mean in the GetItDone API?" |

## Links

- Docs: https://nowgetitdone.com/docs/connecting-ai-assistants
- Privacy: https://nowgetitdone.com/privacy
- Support: https://app.nowgetitdone.com/support
