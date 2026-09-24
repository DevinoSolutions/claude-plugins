---
name: domain-preflight
description: Pre-flight a domain in doDomain before anyone touches DNS. Use when the user asks who manages DNS for a domain, which DNS provider or registrable zone it has, whether it qualifies for one-click connect, or how hard it will be to connect a customer's domain.
---

# doDomain domain pre-flight

Tell the user what connecting a domain will involve before a connect session is created. This skill only reads public DNS and team state; it creates nothing and uses no quota.

## Tools you will use

- `check_domain`: the DNS provider managing the domain, the registrable zone, the connect tier it qualifies for (1 one-click OAuth, 2 Domain Connect, 3 guided manual), detection confidence, nameservers, and a provider-specific setup guide.
- `list_connections`: existing connections on the team, filterable by domain. Use it to see whether the domain is already connected.

## Workflow

1. Take the exact hostname the user gave (for example `shop.acme.com`). If they gave a URL, strip the scheme and path.
2. Call `check_domain` for that hostname.
3. Call `list_connections` filtered to the domain to see whether the team already has a connection for it.
4. Report in this order: DNS provider, registrable zone, connect tier in plain words, what the customer will have to do for that tier, and whether a connection already exists.
5. If the tier is 3 (guided manual), summarize the provider-specific setup guide the tool returned so the user can pass it on.
6. Offer the `connect-customer-domain` skill as the next step. Do not start a session from here.

## Rules

- Never call `create_connect_session` from this skill. Pre-flight is read only.
- Results come from the live DNS system and can change between calls. Say so if the user compares two runs.
- Only report fields the tool returned. If detection confidence is low, say so instead of presenting the provider as certain.
