---
name: finding-meeting-times
description: "Finds open times to meet in Caly: lists the user's event types, reads their working-hours schedules, and returns the free slots for an event type over a date range, in the right time zone. Use when the user asks 'when am I free', 'find a time for a 30 minute call next week', 'what slots do I have on Thursday', 'which meeting types do I have', 'what are my working hours', 'send me times I can offer a client', or wants options before booking. Read-only."
---

# Caly: finding meeting times

Answer "when can this meeting happen" from the user's live Caly event types, schedules and availability.

## Connecting and calling the tools

Every tool in this skill comes from the `caly` MCP server, the Caly connector, and is written here as `caly:<tool>`.

- **Tools listed by name:** call them directly, for example `caly:find_available_slots`.
- **Only `caly:search_tools` and `caly:execute_typescript` listed (Code Mode, the default):** call `caly:search_tools` first, then call each tool inside `caly:execute_typescript` as `external_<tool>` (for example `external_find_available_slots`); the program must `return` its result. Batch independent reads with `Promise.all`. Validation and confirmation are identical on both surfaces.
- **"Tool not found":** switch to the Code Mode route instead of retrying the direct call.
- **No `caly` tools at all:** Caly is not connected yet. Follow the `setup-caly` skill.

A refused call throws an Error whose message starts with its code, for example `VALIDATION_FAILED:` or `NOT_FOUND:`.

## Tools you will use

- `caly:whoami`: the account this connection acts as, with its time zone, week start and default schedule. Takes no input.
- `caly:list_event_types`: the user's event types (the bookable meeting kinds) with id, slug, title, length, allowed lengths (`lengthInMinutesOptions`) and booking URL, hidden ones included.
- `caly:get_event_type`: one event type in full: lengths, locations, booking questions, buffers, minimum notice and schedule.
- `caly:list_schedules`: the user's availability schedules: working hours per weekday, date overrides, time zone, and which one is the default.
- `caly:find_available_slots`: the free start times for an event type between two dates (`eventTypeId`, `start`, `end`, optional `timeZone` and `duration`), grouped by date. Each slot carries `start` in UTC plus `startLocal` and `endLocal` in the user's Caly time zone.

## Workflow

1. Call `caly:whoami` and `caly:list_event_types` together. Use the account's `timeZone` unless the user names another one, and say which time zone you are using.
2. Pick the event type. Match the user's words to a title or length ("30 minute call" → the 30-minute type). If two could fit, or none does, list the event types and ask which one.
3. Turn the user's range ("next week", "Thursday afternoon") into concrete `start` and `end` values. A bare date (`2026-10-01`) means the start or end of that day; otherwise pass a UTC ISO 8601 datetime. If no range is given, use the next 7 days.
4. Call `caly:find_available_slots` with the event type id, the range and `timeZone` set to the zone you are reporting in, so the date keys line up with the user's days. If the user wants a length the event type allows (`lengthInMinutesOptions`), set it as `duration`.
5. Present a short list of options grouped by day, using `startLocal` (or the requested zone), not every slot. If the user asked for a part of the day, filter to it.
6. If there are no slots, call `caly:list_schedules` and `caly:get_event_type` and explain why (outside working hours, a date override, minimum notice, buffers), then offer the nearest day that has free slots.
7. Offer next steps: book one of the slots with the `booking-meetings` skill, or share the event type's `bookingUrl` so the other person picks a time.

## Rules

- This skill only reads. Never call `caly:create_booking`, `caly:reschedule_booking` or `caly:cancel_booking` from it.
- Report only slots that `caly:find_available_slots` returned. Never infer free time from the schedule alone; existing bookings and buffers can block it.
- Never present a UTC `start` as local time. Always state the time zone next to every time you show.
