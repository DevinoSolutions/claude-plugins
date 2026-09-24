---
name: voice-library
description: See and manage the voice profiles on a VoiceLabs account. Use when the user asks what voices they have, wants a built-in or preset voice added for narration, asks which voice fits a language, or asks to clone a voice from a recording.
---

# VoiceLabs voice library

Show the user their voices and add the ones they need. Built-in preset voices can be added freely; a cloned voice copies a real person and is handled with care.

## Tools you will use

- `list_voice_profiles`: every voice on the account with id, name, description, language, `voice_type` (`preset` or `cloned`), default engine, and generation and sample counts. An empty account returns an `emptyState` message; relay it rather than reporting a failure.
- `ensure_voice_profile`: make sure a voice with a given `name` exists, creating it from a built-in preset (optional `engine`, `builtinVoiceId`, `language`, `description`). Idempotent: the same name returns the same profile with `created: false`.
- `clone_voice_profile`: create a cloned voice from a 2 to 30 second recording (`name`, `referenceText` with the exact words spoken, the audio as `audioBase64` or `audioUrl`, optional `language`). Only present when the user granted the `voice:clone` scope.
- `search_tools`: lists the exact declarations, including the accepted engines and languages, when you need them.

## Workflow

1. Call `list_voice_profiles`. Present the voices in a table: name, type, language, engine, generations.
2. To add a narrator or a voice in another language, call `ensure_voice_profile` with a clear name and the `language`. Report whether it was created or already existed, and its id for `speak`.
3. To clone a voice, first confirm the recording is of the user's own voice, or that the person speaking has agreed to have their voice cloned. Then check `list_voice_profiles` for a name clash, and call `clone_voice_profile` with the recording and the exact words spoken in it.
4. Offer the `read-aloud` skill to try the voice.

## Rules

- Never clone a voice without that confirmation of consent, and never clone a public figure or someone the user has not said agreed. If `clone_voice_profile` is not available, cloning happens in the VoiceLabs studio; say so.
- `ensure_voice_profile` only adds built-in presets; do not describe it as cloning.
- A duplicate name is refused on cloning; pick another name with the user.
- `QUOTA_EXCEEDED` on cloning means a plan limit on saved cloned voices; relay the message as written and stop.
- Deleting voices is not available through this connector; point the user to the studio.
