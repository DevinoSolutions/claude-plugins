---
name: editing-demos
description: "Edits finished Demofy demos and their look: reads a demo's script beat by beat, proposes changes to narration, cuts, camera, look and voiceover without spending anything, renders the approved edit as a new demo, records a demo again when the page changed, and reads or updates the workspace brand kit (default look, brand colour, voice, closing call to action). Use when the user asks 'change the narration in step 3', 'cut the pricing part', 'make the captions bigger', 'turn off the voiceover', 're-record this demo, the page changed', 'use our brand colour on new demos', or 'which voice do my demos use'. Rendering uses the plan's allowance, so it always confirms first."
---

# Demofy: editing demos

Change what a finished demo says and shows, or the look new demos start from, with the user approving every render.

## Connecting and calling the tools

Every tool in this skill comes from the `demofy` MCP server, the Demofy connector, and is written here as `demofy:<tool>`.

- **Tools listed by name:** call them directly, for example `demofy:demofy_get_script`.
- **Only `demofy:search_tools` and `demofy:execute_typescript` listed (Code Mode, the default):** call `demofy:search_tools` first, then call each tool inside `demofy:execute_typescript` as `external_<tool>` (for example `external_demofy_get_script`); the program must `return` its result. Validation and confirmation are identical on both surfaces.
- **"Tool not found":** switch to the Code Mode route instead of retrying the direct call.
- **No `demofy` tools at all:** Demofy is not connected yet. Follow the `setup-demofy` skill.

A refused call throws an Error whose message starts with its code, for example `CONFLICT:`, `QUOTA_EXCEEDED:` or `CONFIRMATION_REQUIRED:`.

## Tools you will use

- `demofy:demofy_get_script`: a demo as the editor sees it: every beat numbered from 1 with its title, narration, whether it is cut, and its camera choices; the look and the names each look field accepts; the voiceover switch; and whether it is `editable`.
- `demofy:demofy_propose_edit`: turns a list of changes into an edit WITHOUT rendering: what would change, what was skipped and why, the `edit` itself, and its `path` (`restyle` re-styles the kept recording, `refilm` films the page again). Nothing is spent or saved. Change kinds: `look {field, value}`, `say {beat, text}` (empty text makes a beat silent), `trim {beat, cut}`, `camera {beat, choice}`, `voiceover {value}`.
- `demofy:demofy_ship_edit`: renders the proposed `edit`, unchanged, as a NEW demo; the original stays. Uses the allowance. Two-step confirmation.
- `demofy:demofy_rerender`: records a finished demo again from its stored plan, as a new demo, for when the page changed or the recording went wrong. Two-step confirmation.
- `demofy:demofy_refresh`: makes a demo again from its original page and brief, planned afresh, for when the product changed too much for the old steps. Two-step confirmation.
- `demofy:demofy_brand_kit` and `demofy:save_brand_kit`: read and save the workspace's default look, brand colour (Pro), narration voice and closing call to action. Saving replaces the whole kit; owners and admins only.
- `demofy:demofy_list_voices` and `demofy:preview_voice`: narration voices, and a short audio sample of one.

## Workflow

### Editing one demo

1. Identify exactly one demo (use the `managing-demos` skill to find it) and call `demofy:demofy_get_script`. If `editable` is false, say why (not finished, or uploaded) and stop.
2. Map the user's request to changes using the beat numbers and look names from the script. Call `demofy:demofy_propose_edit` with them.
3. Show the user the `changes`, anything `skipped` and why, and the `path` in plain words: a restyle keeps the recording, a refilm records the page again. Adjust and propose again until the user is happy with it.
4. When the user wants it rendered, call `demofy:demofy_ship_edit` with the `jobId` and the `edit` exactly as proposed. The first call does not render: it returns `CONFIRMATION_REQUIRED` with a `confirmToken`. End that program there.
5. Tell the user it renders a new demo in a few minutes, uses one demo from the allowance, and leaves the original as it is. Wait for an explicit yes, then call `demofy:demofy_ship_edit` again with the SAME arguments plus the `confirmToken`, in a new call.
6. Give the new demo's page, `https://app.demofy.io/jobs/<id>`, and follow it with `demofy:demofy_demo_status` as in the `making-demo-videos` skill.

### Recording again

1. Ask which the user means: the same steps on a changed page (`demofy:demofy_rerender`) or a fresh plan from the original brief (`demofy:demofy_refresh`).
2. Call the tool with the `jobId`. It returns `CONFIRMATION_REQUIRED` with a `confirmToken`. End that program.
3. Tell the user it records a new demo, keeps the original, and uses one demo from the allowance. Wait for an explicit yes, then call the same tool again with the SAME arguments plus the `confirmToken`.

### Changing the brand kit

1. Call `demofy:demofy_brand_kit`. If `editable` is false, say only an owner or admin can change it.
2. Change only the fields the user asked about and keep every other field as read; use voice ids from `demofy:demofy_list_voices` (offer `demofy:preview_voice` if they want to hear one). A brand colour needs the Pro plan; `colorState` says whether it applies.
3. Show the before and after of the changed fields, wait for a yes, then call `demofy:save_brand_kit` with the whole kit. It applies to new demos, not to finished ones.

## Rules

- Never render, re-record or refresh without the user's explicit yes to a summary that names the demo and says it uses the allowance.
- Ship only the `edit` that `demofy:demofy_propose_edit` returned, unchanged. Never write an edit by hand.
- Never include a `confirmToken` the user has not approved, and never reuse one for different arguments; it works once and lasts 10 minutes.
- On `QUOTA_EXCEEDED`, say the allowance is used up and offer the plan options (`demofy:list_plans`) instead of retrying.
