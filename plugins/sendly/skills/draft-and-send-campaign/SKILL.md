---
name: draft-and-send-campaign
description: Pick an audience, draft a Sendly email campaign, test it, and send it only after explicit confirmation. Use when the user asks to write, draft, or prepare a newsletter, announcement, or campaign, asks who is in a segment or list, wants a test email, or asks to send a campaign.
---

# Draft and send a Sendly campaign

Go from an idea to a campaign in DRAFT, then to a test, then to a send. Sending reaches real inboxes, so it happens only after the user explicitly confirms the audience size.

## Tools you will use

The `sendly` server either lists these tools by name or, in Code Mode, lists only `search_tools` and `execute_typescript`. In Code Mode, call `search_tools` first, then call each tool below inside `execute_typescript` as `external_<name>` (for example `external_list_segments`); the program must `return` its result. A tool whose scope was not granted is absent either way: not listed, and not returned by `search_tools`.

- `list_segments`, `list_segment_contacts`, `list_lists`, `list_contacts`: find and size the audience.
- `list_templates`, `get_template`: reuse the copy and layout of an existing template.
- `create_campaign`: save a campaign in DRAFT. Needs `name`, `subject`, `body`, and `from`, even though the schema marks only the first two as required.
- `update_campaign`: change a draft campaign.
- `send_test_email`: send a test to the project owner's own verified address. Refuses any other recipient.
- `send_campaign`: two-step. Without `confirm: true` it returns the audience size and sends nothing. With `confirm: true` it sends to every contact in the audience.
- `check_domain`: confirm the `from` address is on a verified domain.

## Workflow

1. Settle the audience. Call `list_segments` or `list_lists`, then `list_segment_contacts` or `list_contacts` to show who is in it and how many.
2. If the user wants to start from a template, call `list_templates` and `get_template`.
3. Write the subject and body in the user's voice. Show them and ask for changes once.
4. Call `check_domain` and make sure the `from` address is on a verified domain. If not, stop and offer the `deliverability-check` skill.
5. Call `create_campaign` with name, subject, body, from, and audience. Report the campaign id and that it is a DRAFT. Nothing is sent.
6. Offer a test. Call `send_test_email` only after the user says yes; it goes to their own verified address.
7. When the user asks to send, call `send_campaign` without `confirm`. Report the audience size it returned, the subject, and the from address.
8. Ask: "Send this to N contacts now?" Only after an explicit yes in this turn, call `send_campaign` again with `confirm: true`. Report the result.

## Rules

- Never call `send_campaign` with `confirm: true`, `send_email`, or `send_mailbox_email` without an explicit yes to a stated recipient count. An earlier "send it" before the count was shown is not confirmation.
- Never send to addresses that are not already contacts in the project. There is no bulk import or arbitrary-recipient send here, and a purchased list is not consent.
- If `send_test_email` refuses a recipient, explain that tests go only to the owner's own verified address.
- If the sending tools are missing, the user did not grant the sending scope. Say so; do not look for another way to send.
- Do not fabricate links, prices, or claims in the copy. Ask for them.
