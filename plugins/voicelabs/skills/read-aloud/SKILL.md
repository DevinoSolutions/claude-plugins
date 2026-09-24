---
name: read-aloud
description: Turn text into spoken audio with VoiceLabs and hand back the audio link. Use when the user asks to read text aloud, narrate a script, make a voiceover, generate speech or an audio version of a paragraph, or says "say this in my voice" or names one of their VoiceLabs voices.
---

# Read text aloud with VoiceLabs

Generate speech from the user's text in one of their voice profiles, wait for it to finish, and give them the audio link.

## Tools you will use

- `list_voice_profiles`: the account's voices with id, name, language, `voice_type` (preset or cloned) and engine.
- `ensure_voice_profile`: make sure a named voice exists, creating it from a built-in preset if it does not. Safe to repeat.
- `speak`: start a generation from `text` with `profileId` or `profileName` and optional `language`. Returns `generationId` with status `generating`.
- `get_generation`: poll a generation; returns `status` (`generating`, `completed`, `failed`) and, once completed, `audioUrl`.
- `search_tools` and `execute_typescript`: start several generations in one round trip for multi-part scripts.

## Workflow

1. Pick the voice. If the user named one, pass it as `profileName`. Otherwise call `list_voice_profiles` and ask which voice, or suggest one that matches the text's language.
2. If the account has no voices, or `speak` returns `NOT_FOUND`, offer a built-in preset: call `ensure_voice_profile` with a name such as "Narrator" and use the id it returns.
3. Call `speak` with the text and the voice. Keep the `generationId`.
4. Call `get_generation` with that id. While the status is `generating`, call it again. When it is `completed`, give the user the `audioUrl`. If it is `failed`, report the `error` field.
5. For a long script, split it at paragraph or section breaks and generate each part (see below). Return the links in order, labelled by section.

## Several parts in one round trip

Call `search_tools` first to get the exact declarations, then start every part at once. Do not wait for audio inside the sandbox; return the ids and poll `get_generation` afterwards.

```ts
const parts = ["Section one text", "Section two text"];
const started = await Promise.all(
  parts.map((text) =>
    external_speak({ text, profileName: "Narrator" }).catch((e) => ({ error: String(e) })),
  ),
);
return started; // generationId per part, or "<CODE>: <details>"
```

## Rules

- Speak only the text the user gave or approved. Do not add intros, disclaimers, or extra lines.
- Audio links expire after about 15 minutes. If the user comes back later, call `get_generation` again for a fresh link.
- `QUOTA_EXCEEDED`: the account's allowance for the period is used. Relay the message as written and stop; do not push a plan or retry.
- `RATE_LIMITED`: wait the `retryAfterSeconds` it names, then continue.
- `SCOPE_MISSING`: the connection lacks `voice:generate`; the user can reconnect and grant it.
- Arguments are strict and camelCase (`profileId`, not `profile_id`).
