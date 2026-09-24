---
name: edit-page-draft
description: Edit the draft of a BioFlow link-in-bio page. Use when the user asks to add, change, remove, or reorder links, images, products, newsletter signups, booking embeds, or other blocks, to rename or retitle a page, or to create a new page. Changes the draft only; never publishes.
---

# Edit a BioFlow page draft

Make the user's page changes on the draft. The live page does not change until the user publishes through the `publish-page` skill.

## Tools you will use

- `page.list`: the account's pages with slug, public URL, and publish status.
- `page.get`: one page's draft and published summaries, the ordered block list, and the `expectedUpdatedAt` snapshot token every write needs.
- `page.create`: create a new page.
- `page.update_draft`: change page-level fields on the draft, such as the title.
- `page.add_block`: append a block to the draft. Returns the new block id.
- `page.remove_block`: remove named blocks from the draft. It refuses full-page clears.
- `page.reorder_blocks`: change the order of the draft's blocks.

## Workflow

1. Call `page.list`. If the account has more than one page and the user did not name one, ask which.
2. Call `page.get` and show the current block order in one short list so the user can refer to blocks by position or name.
3. Restate the change in one line ("Add a link block 'YouTube' to https://youtube.com/@name at the end").
4. Call `page.get` again right before each write and pass its fresh `expectedUpdatedAt`. Then call the write tool.
5. After each write, report what changed in the draft and the new block id where one was returned.
6. When the user is done, say the changes are in the draft only and offer the `publish-page` skill.

## Rules

- Never call `page.publish` or `page.schedule_publish` from this skill.
- On `STALE_SNAPSHOT`, nothing was written. Call `page.get`, show the user what changed, and repeat the write only if it still makes sense.
- Do not invent URLs, product details, or handles. Ask for the link when a block needs one.
- To empty a page, remove blocks by name one at a time after the user confirms the list. There is no clear-all operation.
- If the write tools are missing, the user did not grant the page write scope. Say so and tell them to reconnect with it.
