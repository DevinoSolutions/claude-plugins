# VoiceLabs plugin for Claude

Turn text into speech in your VoiceLabs voices and transcribe audio to text.

## Install

```
/plugin marketplace add DevinoSolutions/claude-plugins
/plugin install voicelabs@devino
```

Then ask Claude to read something aloud or transcribe a clip. On the first tool call Claude opens
the VoiceLabs consent screen; approve the scopes you want. A tool whose scope you did not grant
is never offered. Disconnect at any time from https://app.voicelabs.now/connections.

## What it connects

Remote MCP server `https://app.voicelabs.now/api/mcp` (OAuth 2.1 with PKCE and dynamic client
registration). Tools:

- `list_voice_profiles`, `list_captures`, `get_generation` (scope `voice:read`, read-only)
- `speak`, `transcribe`, `ensure_voice_profile` (scope `voice:generate`)
- `clone_voice_profile` (scope `voice:clone`, a separate consent question; only offered when you
  grant it)
- `search_tools` and `execute_typescript`: run several of the operations above in one round trip.
  Each call enforces the same scopes and argument rules as calling the tool directly.

`speak` is asynchronous: it returns a generation id, and `get_generation` returns the audio link
once the generation completes. Audio links are signed for your account and expire after about
15 minutes; polling again gives a fresh one. `ensure_voice_profile` adds only VoiceLabs' built-in
preset voices. Generation is metered by your plan.

## Skills

| Skill | Use it when |
|---|---|
| `read-aloud` | "Read this paragraph in my Narrator voice", "Narrate these five sections" |
| `transcribe-audio` | "Transcribe this clip", "What did I record yesterday?" |
| `voice-library` | "What voices do I have?", "Add a built-in narrator voice" |

## Links

- Docs: https://voicelabs.now/docs/connecting-ai-assistants
- Privacy: https://voicelabs.now/privacy
- Support: support@devino.ca
