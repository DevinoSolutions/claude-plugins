---
name: transcribing-recordings
description: "Transcribes speech from an audio or video URL with upAPI's GPU Whisper: time-coded segments, automatic language detection, files up to two hours, and polling for long jobs. Use when the user asks 'transcribe this podcast episode', 'what was said in this video', 'get me a transcript of this interview', 'make subtitles text from this recording', or pastes a link to an mp3, mp4 or similar. Starting a transcription is a write that spends quota, so the skill confirms long files first."
---

# upAPI: transcribing recordings

Turn a recording at a public URL into a transcript, waiting for long files without starting them twice.

## Connecting and calling the tools

Every tool in this skill comes from the `upapi` MCP server, the upAPI connector, and is written here as `upapi:<tool>`.

- **Tools listed by name (the plugin's `?tools=claude` surface):** call them directly, for example `upapi:audio_transcribe_post`.
- **Only `upapi:search_ops` and `upapi:call_op` listed (the plain URL's compact table):** call `upapi:call_op` with the slug and input, for example `{ "slug": "audio-transcribe.post", "input": { "url": "https://example.com/interview.mp3" } }`.
- **No `upapi` tools at all:** upAPI is not connected yet. Follow the `setup-upapi` skill.

A failed operation comes back as an error result whose text starts with its code, for example `INVALID_INPUT:`.

## Tools you will use

- `upapi:audio_transcribe_post` (slug `audio-transcribe.post`, 10 units, write): starts a transcription. Input: `url` (required, a public audio or video URL, up to two hours long), `language` (optional ISO code such as `en`; omit to auto-detect). Short clips return the finished transcript (`text`, time-coded `segments`, `language`) in the same call; longer ones return a `jobId` with `status: "processing"`.
- `upapi:audio_transcribe_result_get` (slug `audio-transcribe-result.get`, 1 unit, read): the result for a `jobId`: the transcript once `status` is `completed`, or the progress while it is still running. Job ids are kept for 24 hours.

## Workflow

1. Take the recording's URL from the user. It must be a direct, public link to the file; ask for one if they gave a page that only embeds a player.
2. Starting a transcription spends 10 units and GPU time. Call `upapi:audio_transcribe_post` once.
3. If the result has the transcript, go to step 5.
4. If it returned a `jobId`, tell the user the job is running and keep the id. Poll `upapi:audio_transcribe_result_get` with that `jobId`, leaving at least 15 to 30 seconds between polls, until `status` is `completed`. If the user leaves and comes back within 24 hours, poll the same `jobId` instead of starting a new transcription.
5. Present what the user asked for: the full text, a summary, or the passages on a topic with their timestamps from `segments` (as `mm:ss`). Name the detected `language`.

## Rules

- Never call `upapi:audio_transcribe_post` twice for the same URL in one task; a second call starts and bills a second job. Poll the `jobId` you have.
- Transcribe only recordings the user has the right to process. Do not use it for recordings of private conversations the user was not part of.
- On `RATE_LIMITED`, wait the seconds the message gives before one retry. On `QUOTA_EXCEEDED`, stop and tell the user.
