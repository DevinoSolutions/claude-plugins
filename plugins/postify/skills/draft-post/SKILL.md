---
name: draft-post
description: Write a social post as a Postify draft for a specific channel. Use when the user asks to draft, write, or prepare a post, thread, or announcement for LinkedIn, X, Instagram, Facebook, TikTok, or another connected channel. Saves a draft only; never publishes.
---

# Draft a post in Postify

Turn the user's idea into a platform-ready draft saved in Postify. The user reviews it in the Postify composer before anything is scheduled or published.

## Tools you will use

The `postify` server either lists these tools by name or, in Code Mode, lists only `search_tools` and `execute_typescript`. In Code Mode, call `search_tools` first, then call each tool below inside `execute_typescript` as `external_<name>` (for example `external_list_channels`); the program must `return` its result. A tool whose scope was not granted is absent either way: not listed, and not returned by `search_tools`.

- `list_channels` — find the channel to target and its platform.
- `search_media_library` — find an image or video the user already uploaded, when the post needs media.
- `suggest_optimal_time` — up to three suggested posting times per platform, computed from this workspace's own publish history.
- `create_draft` — save the post with status `draft`. Returns the new post id.

## Workflow

1. Call `list_channels`. If the user named a platform with more than one connected account, ask which one.
2. Write the copy for that platform:
   - X: under 280 characters, one idea, no hashtag pile.
   - LinkedIn: hook in the first line, short paragraphs, up to three hashtags at the end.
   - Instagram, TikTok: caption first, hashtags on their own line, mention that media is required.
   - Facebook: conversational, a question or call to action at the end.
3. If media is wanted, call `search_media_library` with two or three keywords and offer the matches by name. Do not invent media ids.
4. Show the draft to the user and ask for changes once.
5. Call `create_draft` with the final text, the channel id, and the media id if chosen. Report the post id and that it is saved as a draft.
6. Offer a time: call `suggest_optimal_time` for the platform and present the suggestions. Scheduling itself happens in the Postify composer or through the `content-calendar` skill's reschedule step.

## Rules

- Never call `publish_now`. Drafting is the whole job of this skill.
- Do not fabricate links, statistics, or product claims. Ask for the URL when the post needs one.
- Keep the user's voice. If they pasted earlier posts, match their tone and length.
