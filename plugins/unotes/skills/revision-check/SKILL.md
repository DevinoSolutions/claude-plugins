---
name: revision-check
description: Give the user a picture of their uNotes study state and what to revise next, from their flashcard decks, quizzes, study streak, and monthly quota. Use when the user asks what they should revise, which flashcards or quizzes they have, how long their study streak is, or how much uNotes quota is left. Read-only.
---

# uNotes revision check

Read the user's own study data and turn it into a short, actionable revision plan.

## Tools you will use

- `list_my_flashcards`: the user's flashcard decks with title, subject, status, card count, course, and URL.
- `list_my_quizzes`: quizzes on the user's courses with question count and duration.
- `get_study_streak`: current streak days, longest streak, whether they studied today, and earned badges.
- `get_quota_status`: plan tier and per-feature quota rows (`used`, `limit`, `remaining`, `resetsAt`). A `null` limit means unlimited.

## Workflow

1. Call `get_study_streak`, `list_my_flashcards`, and `list_my_quizzes`.
2. Group the decks and quizzes by course. Show one line per course: decks (with card counts) and quizzes (with question counts).
3. Report the streak in one sentence. If `studiedToday` is false, say so and point at the smallest deck or shortest quiz as a quick session.
4. If the user mentions an upcoming exam, put that course first and list its decks and quizzes as the plan for the days left.
5. If the user asks about quota, call `get_quota_status` and list each feature as used out of limit, with the reset date. Reading quota never uses any.

## Rules

- All four tools read only the signed-in account. No tool takes a user id; never try to read another person's data.
- This connector has no write tools, so this skill never changes anything. It cannot create decks or quizzes, record study sessions, or change the streak. Those happen in the uNotes app.
- Report only what the tools return. Do not invent scores or progress percentages; the tools do not return them.
- Do not make plan or price recommendations from the quota data.
