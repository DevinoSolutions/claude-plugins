---
name: developer-docs
description: Answer questions about the GetItDone developer API from its own documentation. Use when the user asks how a GetItDone REST operation works, what an API error or problem code means, how to authenticate against the API, or how to connect an assistant or integration to GetItDone.
---

# GetItDone developer docs lookup

Answer developer questions from GetItDone's published documentation, with links, instead of from memory.

## Tools you will use

- `search_docs`: ranked results from GetItDone's developer documentation (REST operations, error and problem codes, guide pages), each with its public URL and, for guide and error pages, a Markdown-twin URL.

## Workflow

1. Turn the question into a short query: the operation name, the status or problem code, or two or three keywords.
2. Call `search_docs`.
3. If the top result is a guide or error page and the snippet is not enough, fetch its Markdown-twin URL to read the full page.
4. Answer in a few sentences. Quote the exact field names, codes, and paths from the docs.
5. End with the public URL of each page you used.

## Rules

- `search_docs` searches GetItDone's developer documentation, not the user's tasks or workspace notes. For task content, use `task-deep-dive`.
- If nothing relevant comes back, say the docs do not cover it. Do not fill the gap with guessed endpoints or fields.
- Keep API keys and tokens out of examples. Use placeholders.
