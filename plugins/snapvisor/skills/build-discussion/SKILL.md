---
name: build-discussion
description: Read and take part in the comment threads on a SnapVisor build, test, or media item. Use when the user asks to summarize the review discussion, see open threads, reply to or post a comment, react, resolve or reopen a thread, or follow a build.
---

# SnapVisor build discussion

Summarize who said what on a build and act on the threads for the user. Comments exist on builds, on tests and on media items; each has its own set of operations.

## Tools you will use

The `snapvisor` MCP server has two tools: `search_tools` (call it first, for example with `comment`, to get the exact operation names and inputs) and `execute_typescript` (run a short program calling the declared `external_*` functions; the program must `return` its result).

Operations this skill uses for builds (tests and media have matching `Test` and `Media` variants, such as `external_listTestComments`):

- `external_listBuildComments`: all comments and threads on a build.
- `external_createBuildComment`: post a comment; pass `threadId` to reply, or `screenshotDiffId` to attach it to one screenshot.
- `external_updateBuildComment` and `external_deleteBuildComment`: edit or delete the user's own comment.
- `external_addBuildCommentReaction` and `external_removeBuildCommentReaction`: reactions.
- `external_resolveBuildCommentThread` and `external_unresolveBuildCommentThread`: close or reopen a thread.
- `external_subscribeBuild` and `external_unsubscribeBuild`: follow or unfollow a build.
- `external_getBuild`: the build's status, to open the summary.

## Workflow

1. Identify the build (the `build-review` skill shows how to find it). Fetch `external_getBuild` and `external_listBuildComments` together in one program with `await Promise.all`.
2. Summarize: build status first, then open threads (author, the point made, the screenshot it is anchored to), then resolved threads in one line each.
3. To post or reply, draft the text, show it, and post it with `external_createBuildComment` after the user agrees. Use `threadId` for replies.
4. To resolve or reopen, name the thread by its first line, confirm, then call the resolve or unresolve operation.
5. Report what changed and the comment or thread id.

## Code Mode pattern

```ts
try {
  const [build, comments] = await Promise.all([
    external_getBuild({ owner, project, buildNumber }),
    external_listBuildComments({ owner, project, buildNumber }),
  ]);
  return { status: build.status, comments };
} catch (e) {
  return { error: String(e) }; // "<CODE>: <details>"
}
```

## Rules

- Post comments in the user's words or in a draft they approved. Never post on their behalf without showing the text first.
- Edit or delete only comments the user wrote, and only after a confirmation.
- Do not approve or reject the build from this skill; that is `build-review`.
