---
name: managing-demos
description: "Reviews and organizes the user's Demofy demos: lists recent demos, checks one demo's status and gets its video and share link, renames it, files it into a project, creates projects, turns public share links on or off, and stops or deletes a demo through Demofy's two-step confirmation. Use when the user asks 'what demos do I have', 'is the pricing demo done', 'give me the link to my last demo', 'share the onboarding video', 'put these demos in the Q4 launch project', 'rename this demo', 'stop that recording', or 'delete the old demo'. Reads freely; stopping and deleting cannot be undone, so they are confirmed first."
---
<!-- Generated from plugins/demofy/skills/managing-demos/SKILL.md by scripts/sync-skills.mjs. Edit the plugin copy, then run the script. -->

# Demofy: managing demos

Find the right demo, then report on it, share it, file it, or remove it without surprises.

## Connecting and calling the tools

Every tool in this skill comes from the `demofy` MCP server, the Demofy connector, and is written here as `demofy:<tool>`.

- **Tools listed by name:** call them directly, for example `demofy:demofy_list_demos`.
- **Only `demofy:search_tools` and `demofy:execute_typescript` listed (Code Mode, the default):** call `demofy:search_tools` first, then call each tool inside `demofy:execute_typescript` as `external_<tool>` (for example `external_demofy_list_demos`); the program must `return` its result. Validation and confirmation are identical on both surfaces.
- **"Tool not found":** switch to the Code Mode route instead of retrying the direct call.
- **No `demofy` tools at all:** Demofy is not connected yet. Follow the `setup-demofy` skill.

A refused call throws an Error whose message starts with its code, for example `NOT_FOUND:` or `CONFIRMATION_REQUIRED:`.

## Tools you will use

- `demofy:demofy_list_demos`: the newest demos in the workspace, newest first, with id, title, status, kind and project. When `next` is not null there are older demos: call again with `after` set to that `next`, unchanged.
- `demofy:demofy_demo_status`: one demo in full: its status, why it failed, any site it waits on, and once done the `video` (with `downloadUrl`) and `shareUrl`.
- `demofy:share_demo`: turns a finished demo's public share link on (returns it) or off (the link stops working for everyone).
- `demofy:demofy_rename_demo`: renames a demo; an empty title restores the name Demofy derives.
- `demofy:demofy_list_projects`, `demofy:create_project`, `demofy:demofy_move_to_project`: projects (folders of demos) with their demo counts, a new project, and filing a demo under a project or none.
- `demofy:demofy_cancel_demo`: stops a demo that is still being made. It ends as stopped and cannot be resumed.
- `demofy:demofy_delete_demo`: deletes a demo and its video for good; its share link stops working and the allowance it used is not given back.

## Workflow

### Reviewing demos

1. Call `demofy:demofy_list_demos`. Follow `next` with `after` until you find what the user asked about, or tell them there are more.
2. List each demo with its title, status and project, and its page `https://app.demofy.io/jobs/<id>`. Call `demofy:demofy_demo_status` only for the demo the user cares about.
3. For a finished demo, give the video link. For a failed one, give the reason in plain words. For one waiting on a sign-in, use the `making-demo-videos` skill to continue it.

### Sharing, renaming and filing

1. Identify exactly one demo by id. If several match, list them and ask which one.
2. Sharing: call `demofy:share_demo` with `shared: true` and give the `shareUrl`; anyone with it can watch. Turning it off (`shared: false`) breaks the link for everyone who has it, so say that first.
3. Renaming: call `demofy:demofy_rename_demo` with the new title.
4. Filing: call `demofy:demofy_list_projects`, then `demofy:demofy_move_to_project` with the project's id (or `null` for no project). If the project does not exist and the user wants it, call `demofy:create_project` first.

### Stopping or deleting

1. Identify exactly one demo and read it with `demofy:demofy_demo_status`.
2. Call `demofy:demofy_cancel_demo` or `demofy:demofy_delete_demo` with its `jobId`. The first call does not act: it returns `CONFIRMATION_REQUIRED` with a `confirmToken` (in Code Mode, a thrown Error whose message ends with that JSON). End that program there.
3. Show the user which demo (title, status, link) and what will happen: stopping throws away the run for good; deleting removes the video and its share link for good and does not refund the allowance. Wait for an explicit yes.
4. Call the same tool again with the SAME arguments plus the `confirmToken`, in a new call. The token works once and lasts 10 minutes; if it expired, start again at step 2. Report the result.

## Rules

- Never stop or delete without the user's explicit yes to a summary that names the demo.
- Never include a `confirmToken` before the user has seen the demo it acts on, and never reuse one for a different demo or different arguments.
- Do not turn on a share link the user did not ask for; a share link is public.
- For several demos, confirm each destructive call separately, one demo per confirmation.
