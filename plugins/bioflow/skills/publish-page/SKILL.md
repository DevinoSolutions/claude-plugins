---
name: publish-page
description: Publish or schedule a BioFlow page's draft so it goes live, with an explicit preview and confirmation. Use when the user asks to publish, go live, push their changes live, or schedule the page to publish at a later time.
---

# Publish a BioFlow page

Take the draft live, now or at a set time, through BioFlow's two-step publish. The first call only previews; the user's confirmation is what commits.

## Tools you will use

- `page.list`: find the page and its public URL.
- `page.get`: the draft and published summaries, so you can describe what differs.
- `page.publish`: publish the draft now. Two-step: a call without `confirmToken` returns a preview of exactly what would go live plus a short-lived `confirmToken` and publishes nothing; a second call carrying that token commits.
- `page.schedule_publish`: schedule the draft to publish at a later time. Same two-step contract: preview and `confirmToken` first, commit on the second call.

## Workflow

1. Call `page.list` and confirm which page the user means.
2. Call `page.get` and summarize what is in the draft but not yet live.
3. For a scheduled publish, resolve the time to a full date and time with the user's timezone and state it.
4. Call `page.publish` or `page.schedule_publish` without a `confirmToken`. Nothing goes live on this call.
5. Show the user the preview the tool returned, in plain words: which blocks are added, changed, or removed, and the page title. For a schedule, repeat the time.
6. Ask for an explicit yes. Do not treat silence, "ok, looks fine", or an earlier request as confirmation.
7. After a clear yes, call the same tool again with the `confirmToken`. Report the result and the page's public URL.

## Rules

- The preview is the expected first response, not a failure. Never say "publish did nothing" after step 4.
- Never pass a `confirmToken` the user has not approved in this conversation, and never reuse a token.
- The token expires after about 10 minutes and any draft change invalidates it. If the commit is refused for either reason, start again at step 4 and show the new preview.
- On `DANGEROUS_OPS_DISABLED`, publishing is turned off for the workspace. Give the user the settings link from the response (Settings, Connected AI apps) and stop. Only the user can turn it on.
- If the publish tools are missing, the user did not grant the `publish` scope. Say so and tell them to reconnect with it.
