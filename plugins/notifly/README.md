# Notifly plugin for Claude

Read your Notifly workflows, subscribers, topics, and delivery history, and send a workflow with
two-step confirmation.

## Install

```
/plugin marketplace add DevinoSolutions/claude-plugins
/plugin install notifly@devino
```

Then ask Claude about your notification setup. On the first tool call Claude opens the Notifly
sign-in page. The consent screen lists the requested scopes and an environment picker
(Development or Production); the connection acts on the environment you pick. A tool whose scope
you did not grant is never registered for the session.

## What it connects

Remote MCP server `https://api.notifly.io/mcp` (OAuth 2.1 with PKCE). The host is the API host,
not the `app.notifly.io` dashboard. It reaches 7 tools, filtered by the permissions you granted:

- Workflows (read): `list_workflows`, `get_workflow`
- Subscribers (read): `list_subscribers`, `get_subscriber`
- Topics (read): `list_topics`
- Activity feed (read): `list_notifications`
- Send (`org:event:write` plus the gates below): `trigger_workflow`

The six read tools work as soon as you connect. `trigger_workflow` sends a real notification
through your organization's configured email, SMS, push, chat, or in-app providers, and it is
gated four ways: the `org:event:write` scope, a live consent check on every call, an
organization dangerous-operations setting that is off by default and can only be turned on by a
person signed in to Notifly, and a two-step confirmation. The first call returns
`CONFIRMATION_REQUIRED` with a short-lived token bound to the exact arguments and sends nothing;
only a second call carrying that token sends. In Code Mode that first result arrives as a thrown
error whose message carries the token.

By default the server runs in Code Mode: `tools/list` shows two tools, `search_tools` and
`execute_typescript`, and the tools above are called inside `execute_typescript` as
`external_<name>` functions (for example `external_list_workflows`) with the same scopes and gates. A
server set to the per-tool surface lists them by name instead. The skills handle both.

Review and revoke connected assistants under Connected AI apps in your Notifly settings.

## Skills

| Skill | Use it when |
|---|---|
| `delivery-check` | "Did the welcome email go out to dana@example.com?", "Why didn't this subscriber get the reset email?" |
| `send-notification` | "Send the order-confirmation workflow to subscriber wc-1020" |
| `workflow-review` | "Which workflows do we have and on which channels?", "What topics exist?" |

## Links

- Docs: https://notifly.io/docs/connecting-ai-assistants
- Privacy: https://notifly.io/privacy
- Support: support@devino.ca
