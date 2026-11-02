---
name: making-demo-videos
description: "Makes a narrated product demo video in Demofy from a web address and a sentence of intent: sharpens the brief, picks optional voice, intro, outro, music and saved login, confirms with the user, starts the demo, follows it until the video is ready, and handles a pause for a site sign-in. Use when the user asks 'make a demo video of our pricing page', 'record a walkthrough of app.example.com showing how to invite a teammate', 'turn this URL into a product demo', 'film our signup flow with a voiceover', or 'is my demo ready yet'. Starts a recording that uses the plan's demo allowance, so it always confirms first."
---
<!-- Generated from plugins/demofy/skills/making-demo-videos/SKILL.md by scripts/sync-skills.mjs. Edit the plugin copy, then run the script. -->

# Demofy: making demo videos

Turn a page and an intent into a finished, narrated demo video, and bring back its link.

## Connecting and calling the tools

Every tool in this skill comes from the `demofy` MCP server, the Demofy connector, and is written here as `demofy:<tool>`.

- **Tools listed by name:** call them directly, for example `demofy:demofy_create_demo`.
- **Only `demofy:search_tools` and `demofy:execute_typescript` listed (Code Mode, the default):** call `demofy:search_tools` first, then call each tool inside `demofy:execute_typescript` as `external_<tool>` (for example `external_demofy_create_demo`); the program must `return` its result. Batch independent reads with `Promise.all`. Validation and confirmation are identical on both surfaces.
- **"Tool not found":** switch to the Code Mode route instead of retrying the direct call.
- **No `demofy` tools at all:** Demofy is not connected yet. Follow the `setup-demofy` skill.

A refused call throws an Error whose message starts with its code, for example `VALIDATION_ERROR:`, `QUOTA_EXCEEDED:` or `NOT_FOUND:`, and any trailing JSON names the tool to call next.

## Tools you will use

- `demofy:refine_prompt`: rewrites a rough intent into the clearer brief Demofy records best, optionally for a URL. Creates nothing.
- `demofy:demofy_list_voices`, `demofy:demofy_list_assets`, `demofy:demofy_brand_kit`: narration voices, intro, outro, music and logo clips, and the workspace's default look. Read only when the user asks for a voice, an intro or outro, or music.
- `demofy:demofy_list_connections`: saved logins, sites Demofy can record signed in to.
- `demofy:demofy_create_demo`: starts the demo. Needs `url` (the page to film) and `prompt` (what the demo should show). Optional fields include `voiceProfileId`, `introAssetId`, `outroAssetId`, `audioAssetId`, `connectionId`, `captions`, `format` and `quality`; read the exact shape from `demofy:search_tools`. Returns the new demo's `id`, `status` and its page `url` (relative to `https://app.demofy.io`).
- `demofy:demofy_demo_status`: where the demo is (queued, discovering, capturing, compositing, uploading, done, failed), why it failed, which sites it waits on (`needsSignIn`), and once done the `video` URLs and `shareUrl`.
- `demofy:demofy_answer_sign_in`: continues a demo paused for a sign-in, either without signing in to that site or behind a saved login.
- `demofy:get_connect_links`: a one-time link (15 minutes) the user opens in their own browser to sign in to a site and save the login.
- `demofy:share_demo`: turns the public share link of a finished demo on or off.

## Workflow

1. Get the page and the intent. The page must be a public `https://` address; if the user gave only a product name, ask for the URL. If the intent is vague ("show the product"), call `demofy:refine_prompt` with it and the URL, show the result, and let the user choose.
2. If the page is behind a sign-in, call `demofy:demofy_list_connections`. Use a saved login for that site as `connectionId`. If none exists, call `demofy:get_connect_links` with the site, give the user the link and say what it does (they sign in there themselves and press Save), and continue once `demofy:demofy_list_connections` shows the login.
3. Only if the user asked for a voice, intro, outro or music, read `demofy:demofy_list_voices` or `demofy:demofy_list_assets` and use ids from those lists. Otherwise leave them out; the workspace brand kit applies.
4. Show a summary and wait for an explicit yes: the URL, the brief, any voice, clips or saved login, and that it uses one demo from the plan's allowance and takes a few minutes.
5. After the yes, call `demofy:demofy_create_demo` once. Give the user the demo page, `https://app.demofy.io/jobs/<id>`.
6. Check `demofy:demofy_demo_status` when the user asks, or every minute or so if they want to wait; never loop inside one `execute_typescript` program. Report the stage in plain words.
7. If `needsSignIn` lists a site, tell the user which site and why. Then, with their choice: record without it (`demofy:demofy_answer_sign_in` with a skip for that site), use a saved login for it (`demofy:demofy_answer_sign_in` with that `connectionId`), or create one first with `demofy:get_connect_links` as in step 2.
8. When the status is `done`, give the video link and, if the user wants to share it, call `demofy:share_demo` with `shared: true` and give the `shareUrl`. If it is `failed`, report the error in plain words and offer to make it again with a clearer brief.

## Rules

- Never call `demofy:demofy_create_demo` without the user's explicit yes to the summary in step 4. Each call starts a new recording and uses the allowance.
- Never retry a failed `demofy:demofy_create_demo` blindly. On `QUOTA_EXCEEDED`, say the allowance is used up and offer the plan options (`demofy:list_plans`) instead of retrying. After a `TOOL_FAILED`, check `demofy:demofy_list_demos` before trying again, so the user does not get two demos.
- Never ask for a site password or one-time code in the chat. The user signs in to other sites only through the `demofy:get_connect_links` page.
- Film only pages the user asked for. Do not add URLs, steps or claims they did not ask for to the brief.
- To edit, re-record, cancel or delete a demo, use the `editing-demos` or `managing-demos` skill.
