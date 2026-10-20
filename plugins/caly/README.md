# Caly plugin for Claude

Find open times, book meetings, and review, reschedule, or cancel bookings in Caly, with
confirmation before anything reaches an attendee.

## Install

```
/plugin marketplace add DevinoSolutions/claude-plugins
/plugin install caly@devino
```

Other ways in: the Claude plugin directory and the `anthropics/claude-plugins-community` marketplace once approved, skills only with `npx skills add DevinoSolutions/claude-plugins --skill setup-caly`, or the connector alone through the [Connectors Directory listing](https://claude.ai/directory/3d0909e9-bcc0-425e-84ad-78306332dd7b). See the [repository README](../../README.md#install) for each path.

Then ask Claude about your schedule. On the first tool call Claude opens Caly's sign-in. Caly
first shows its own consent page, which names the app asking, says the grant covers the Caly
tools only for at most 30 days, and shows where the authorization is sent; then you sign in to
Caly and approve if Caly asks. There are no per-tool scopes: one grant covers every tool below.

## What it connects

Remote MCP server `https://mcp.trycaly.com/mcp` (OAuth 2.1 with PKCE and dynamic client
registration). It reaches 10 tools:

- Account and setup (read): `whoami`, `list_event_types`, `get_event_type`, `list_schedules`
- Availability (read): `find_available_slots`
- Bookings (read): `list_bookings`, `get_booking`
- Booking writes: `create_booking`, `reschedule_booking`
- Cancelling (dangerous, two-step): `cancel_booking`

Times go in and come back in UTC ISO 8601. Booking and slot results also carry `startLocal` and
`endLocal` in your Caly time zone, so a meeting at 10:00 your time is never read as 10:00 UTC.

`create_booking` and `reschedule_booking` email the attendees and send calendar invites;
rescheduling creates a new booking with a new `uid`. `cancel_booking` cannot be undone and takes
two calls: the first returns `CONFIRMATION_REQUIRED` with a `confirmToken` that is valid for 10
minutes and bound to the exact arguments, and only a second call carrying that token cancels.
The skills in this plugin show you what will happen and wait for your yes before every write.

By default the server runs in Code Mode: `tools/list` shows two tools, `search_tools` and
`execute_typescript`, and the tools above are called inside `execute_typescript` as
`external_<name>` functions (for example `external_find_available_slots`) with the same
validation and confirmation. A failed call throws an Error whose message starts with its code:
`UNAUTHORIZED`, `NOT_FOUND`, `VALIDATION_FAILED`, `UPSTREAM_ERROR`, `CONFIRMATION_REQUIRED`, or
`TIMEOUT`. The skills handle both surfaces.

The MCP server stores no tokens. A connection ends 30 days after you approved it, and Claude
then asks you to sign in again; remove the connector in Claude to stop it sooner.

## Skills

| Skill | Use it when |
|---|---|
| `finding-meeting-times` | "When am I free next week?", "Find a slot for a 30 minute call on Thursday" |
| `booking-meetings` | "Book a call with sam@example.com on Tuesday at 3", "Schedule a 30 minute intro" |
| `managing-bookings` | "What meetings do I have tomorrow?", "Move my call with Alex to Friday", "Cancel the 3pm" |
| `setup-caly` | "Connect Caly to Claude", "Caly tools are missing", "Tool not found" |

## Links

- Docs: https://trycaly.com/agent-setup/
- Privacy: https://trycaly.com/privacy/
- Terms: https://trycaly.com/terms/
- Support: support@devino.ca
