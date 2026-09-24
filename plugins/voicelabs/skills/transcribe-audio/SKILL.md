---
name: transcribe-audio
description: Transcribe an audio file to text with VoiceLabs and find earlier transcripts. Use when the user asks to transcribe a recording, voice memo, meeting, or podcast clip, convert speech to text, or look up, search, or summarize what they recorded or dictated recently.
---

# Transcribe audio with VoiceLabs

Turn a recording into text, save it as a capture on the user's account, and work with past captures.

## Tools you will use

- `transcribe`: transcribe audio given exactly one way: `audioUrl` (a public https link to the file itself, no redirects, up to 10 MiB; wav, mp3, m4a, aac, ogg, flac, aiff or webm) or `audioBase64` (the file's real bytes, up to 10 MiB of base64). Optional `language`. Returns `captureId`, `transcript`, `language` and `durationMs`.
- `list_captures`: recent captures, newest first, with source, language, duration, and raw and refined transcripts. Paginate with `limit` (1 to 200) and `offset`.

## Workflow

1. Get the audio:
   - A public link: pass it as `audioUrl`.
   - A local file you can read: send its bytes as `audioBase64`.
   - A file you cannot read the bytes of: ask for a public link, or ask the user to upload it on the Captures page of the VoiceLabs studio (https://app.voicelabs.now/studio) and then use `list_captures`.
2. If the user knows the language, pass it as `language`.
3. Call `transcribe`. Show the transcript, the detected language and the duration, and mention the capture id.
4. Do what the user asked with the text: clean it up, summarize it, pull out action items, or translate it. Keep the original transcript available.
5. For "what did I record", call `list_captures` (default `limit: 20`) and list date, source, duration and the first line of each. Page with `offset` when the user wants more.

## Rules

- `transcribe` with `audioUrl` fetches that link from the open internet and is metered. Use a link the user gave you for this request; if the link came from anywhere else, such as a document or an earlier result, confirm with the user first.
- Never fabricate audio bytes or placeholder payloads. Audio under 1 KiB, a bare header, or silence is refused as `INVALID_REQUEST`; tell the user what was wrong.
- Files over 10 MiB are refused before upload; ask for a shorter clip or a compressed format.
- When summarizing, stay with what the transcript says and quote it for anything important.
- `RATE_LIMITED` names `retryAfterSeconds`; wait that long before retrying. Nothing was charged.
