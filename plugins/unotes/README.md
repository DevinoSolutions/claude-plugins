# uNotes plugin for Claude

Search the uNotes study library, read documents, and check your flashcards, quizzes, streak, and
quota. Read-only.

## Install

```
/plugin marketplace add DevinoSolutions/claude-plugins
/plugin install unotes@devino
```

Then ask Claude about a course or your study data. On the first tool call Claude opens the
uNotes sign-in page; pick the scopes you want on the consent screen. A tool whose scope you did
not grant is never registered for the session.

## What it connects

Remote MCP server `https://unotes.net/api/mcp` (OAuth 2.1 with PKCE). Tools:
`search_library`, `get_document`, `get_document_content`, `list_my_flashcards`,
`list_my_quizzes`, `get_study_streak`, `get_quota_status`, `list_schools_courses`.

Every tool is read-only. Nothing creates, edits, uploads, or deletes anything in a uNotes
account; generating flashcards or quizzes and uploading files stay in the uNotes app.

`search_library` searches the shared uNotes library of completed public documents, not only
your own uploads. Flashcards, quizzes, streak, and quota are always scoped to your account.
`get_document_content` returns at most 12,000 characters of a document. Requests are
rate-limited per user.

Disconnecting the uNotes connector in Claude ends the calls. To clear the stored grant as well,
see the connector docs page below or email support@devino.ca.

## Skills

| Skill | Use it when |
|---|---|
| `course-research` | "Find uNotes documents about virtual memory in CSI 3131", "What do past exams cover for this course?" |
| `study-guide` | "Make me a study guide from this document", "Quiz me on my Operating Systems notes" |
| `revision-check` | "What should I revise?", "How long is my streak?", "How much quota is left?" |

## Links

- Docs: https://unotes.net/docs/connecting-ai-assistants
- Privacy: https://unotes.net/privacy
- Support: support@devino.ca
