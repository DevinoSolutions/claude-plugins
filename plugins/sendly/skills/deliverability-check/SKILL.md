---
name: deliverability-check
description: Diagnose why Sendly mail is not landing and fix the sending setup. Use when the user asks why emails bounce or go to spam, whether a sending domain is healthy, what DNS records DKIM, SPF, or DMARC need, how to add or verify a sending domain, who is suppressed, or wants to validate or clean a list of addresses.
---

# Sendly deliverability check

Find out why mail from a domain is not landing, walk the user through the fix, and check address quality. Changes to domains and suppressions happen only after the user confirms.

## Tools you will use

- `check_domain`: the project's sending domains with DKIM, SPF, and DMARC status.
- `diagnose_delivery`: an explanation of a domain's delivery health from its DNS state plus recent bounces and suppressions.
- `add_domain`, `start_domain_setup`, `verify_domain`: add a sending domain, get the DNS records to publish, and check them.
- `list_suppressions`, `add_suppression`, `remove_suppression`: the addresses mail will not go to, and changes to that list.
- `validate_emails`, `get_validation_run`, `list_validation_results`, `clean_list`: check addresses before sending. Metered per address on the Sendly plan.

## Workflow

1. Call `check_domain` and report each domain's DKIM, SPF, and DMARC state.
2. For the domain the user cares about, call `diagnose_delivery` and summarize the cause it found.
3. If DNS records are missing, call `start_domain_setup` (or `add_domain` first for a new domain) and list the records to publish, one per line with type, name, and value.
4. After the user says the records are published, call `verify_domain` and report the result. DNS can take time to propagate; if it fails, name the records still missing.
5. If bounces are the issue, call `list_suppressions` and show how many addresses are suppressed and why.
6. For a list the user wants to check before sending, state the number of addresses and that validation is metered, get a yes, then call `validate_emails` or `clean_list`. Read results with `get_validation_run` and `list_validation_results`.

## Rules

- Suppressions are the consent record. Call `remove_suppression` only when the user says the address owner asked to receive mail again, and confirm the exact address first.
- Confirm the address count before any validation or list cleaning, because it is billed per address.
- Do not tell the user a domain is fixed until `verify_domain` or `check_domain` says so.
- Do not send email from this skill.
