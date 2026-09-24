# uNotes plugin for Claude

Search the uNotes study library, read documents, and check your flashcards, quizzes, streak, and
quota. Read-only.

## Install

```
/plugin marketplace add DevinoSolutions/claude-plugins
/plugin install unotes@devino
```

Other ways in: the Claude plugin directory and the `anthropics/claude-plugins-community` marketplace once approved, skills only with `npx skills add DevinoSolutions/claude-plugins --skill setup-unotes`, or the connector alone through the [Connectors Directory listing](https://claude.ai/directory/connectors/unotes). See the [repository README](../../README.md#install) for each path.

Then ask Claude about a course or your study data. On the first tool call Claude opens the
uNotes sign-in page; pick the scopes you want on the consent screen. A tool whose scope you did
not grant is never registered for the session.

## What it connects

Remote MCP server `https://unotes.net/api/mcp` (OAuth 2.1 with PKCE). It lists 8 tools by name,
each registered only when you granted its scope:

- Library (`search:read`): `search_library`
- Schools and courses (`library:read`): `list_schools_courses`
- Documents (`documents:read`): `get_document`, `get_document_content`
- Flashcards (`flashcards:read`): `list_my_flashcards`
- Quizzes (`quizzes:read`): `list_my_quizzes`
- Study streak (`study:read`): `get_study_streak`
- Quota (`profile:read`): `get_quota_status`

Every tool is read-only. Nothing creates, edits, uploads, or deletes anything in a uNotes
account; generating flashcards or quizzes and uploading files stay in the uNotes app.

`search_library` searches the shared uNotes library of completed public documents, not only
your own uploads. `list_schools_courses` searches or lists the public school and course catalog
by name or course code; it is not limited to your own school. Flashcards, quizzes, streak, and
quota are always scoped to your account. `get_document_content` returns at most 12,000
characters of a document. Requests are rate-limited per user.

Disconnecting the uNotes connector in Claude ends the calls. To clear the stored grant as well,
see the connector docs page below or email support@devino.ca.

## Skills

| Skill | Use it when |
|---|---|
| `researching-course-material` | "Find uNotes documents about virtual memory in CSI 3131", "What do past exams cover for this course?" |
| `building-study-guides` | "Make me a study guide from this document", "Quiz me on my Operating Systems notes" |
| `planning-revision` | "What should I revise?", "How long is my streak?", "How much quota is left?" |
| `setup-unotes` | "Connect uNotes to Claude", "uNotes tools are missing", "Tool not found" |

## Links

- Docs: https://unotes.net/docs/connecting-ai-assistants
- Privacy: https://unotes.net/privacy
- Support: support@devino.ca
