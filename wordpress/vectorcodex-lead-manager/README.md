# VectorCodex Lead Manager

WordPress plugin that stores and manages website form submissions from [vectorcodex.com](https://vectorcodex.com/).  
This plugin is **lead management only** — it does not include editorial formatting.

- **Backend:** WordPress at `https://blog.vectorcodex.com/`
- **Public endpoint:** `POST /wp-json/vectorcodex/v1/leads`
- **Admin:** WordPress menu **VectorCodex Leads** (administrators only)

## Installation

1. Copy the `vectorcodex-lead-manager` folder into `wp-content/plugins/` on the WordPress site  
   (or upload `vectorcodex-lead-manager.zip` via **Plugins → Add New → Upload Plugin**).
2. Activate **VectorCodex Lead Manager** in **Plugins**.
3. Confirm the menu **VectorCodex Leads** appears for administrator accounts.
4. Point the Astro site env var `PUBLIC_CONTACT_ENDPOINT` at:

```text
https://blog.vectorcodex.com/wp-json/vectorcodex/v1/leads
```

Do not commit secrets into the plugin. Turnstile keys and notify addresses belong in **VectorCodex Leads → Settings** (or equivalent managed configuration).

## Activation

On activation the plugin:

- Registers the private custom post type `vc_lead`
- Flushes rewrite rules
- Seeds default options in `vc_leads_settings` (admin notify on to `info@vectorcodex.com`, customer ack on, Turnstile **disabled**)

Deactivation flushes rewrites but **keeps stored leads**.

## REST endpoint

| Item | Value |
|------|--------|
| Method | `POST` |
| Path | `/wp-json/vectorcodex/v1/leads` |
| Full URL (prod) | `https://blog.vectorcodex.com/wp-json/vectorcodex/v1/leads` |
| Body | `multipart/form-data` (FormData) — JSON body also accepted |
| Auth | None for submit (explicit `permission_callback`) |
| Lead read | **Not available** on this public route |

### Success response

```json
{
  "ok": true,
  "message": "Thank you. Your submission has been received."
}
```

Stored lead IDs, meta, and payloads are **never** returned from the public endpoint.

### Error response

```json
{
  "ok": false,
  "code": "vc_leads_validation_failed",
  "message": "Please correct the highlighted fields and try again.",
  "errors": {
    "email": "Enter a valid email address."
  }
}
```

Other codes include `vc_leads_rate_limited` (429), `vc_leads_payload_too_large` (413), and Turnstile codes when enforcement is enabled (`vc_leads_turnstile_missing`, `vc_leads_turnstile_invalid`, `vc_leads_turnstile_expired`, `vc_leads_turnstile_reused`, `vc_leads_turnstile_misconfigured`, `vc_leads_turnstile_unreachable`).

Honeypot hits return the **same success JSON** (no storage) so bots cannot probe the trap.

## Accepted fields

### Normalized form types

`quote` · `booking` · `free_audit` · `team_requirements` · `project_inquiry` · `homepage_inquiry` · `pricing_calculator`

Aliases such as `formType=team-requirements`, `consultation` → `booking`, `pricing` → `pricing_calculator` are accepted.  
When `form_type` is omitted, the plugin infers type from distinctive fields / source URL (migration support).

### Shared contact fields (stored as meta)

| Meta key | Source fields |
|----------|----------------|
| `vc_form_type` | `form_type`, `formType`, … |
| `vc_name` | `name`, `fullName`, `full_name` |
| `vc_email` | `email` |
| `vc_phone` | `phone` |
| `vc_company` | `company`, `companyName` |
| `vc_service` | `service`, `primary_service` |
| `vc_budget` | `budget`, `estimate_label` |
| `vc_timeline` | `timeline` |
| `vc_message` | `message`, `notes` |
| `vc_summary` | `summary`, `summaryText` |
| `vc_source_url` | `source_url` / Referer |
| `vc_submitted_at` | server time (ISO) or client `submitted_at` |
| `vc_payload_json` | full structured payload |
| `vc_status` | workflow status (default `new`) |
| `vc_ip_hash` | salted HMAC of IP (not raw IP) |
| `vc_user_agent` | truncated UA |
| `vc_email_admin_status` / `_at` / `_code` | admin mail outcome |
| `vc_email_customer_status` / `_at` / `_code` | customer mail outcome |

### Form-specific notes

- **quote** — requires phone, company, service, timeline  
- **booking** — requires phone, service  
- **free_audit** — `website` is a **real** field; honeypot is `company_website`  
- **team_requirements** — department, resources, budget  
- **project_inquiry** — phone + message; honeypot `website_hp`  
- **homepage_inquiry** — phone, service, message  
- **pricing_calculator** — requires `payload_json` with `businessAnswers`, `serviceAnswers`, `contactAnswers`, and `estimate` preserved exactly; consent must be `yes`

`human_check` is accepted and may appear inside payloads but is **not** treated as CAPTCHA.

## Lead storage

- CPT: `vc_lead` (admin UI only)
- `public` / `publicly_queryable` / `show_in_rest` = false  
- Manual admin creation disabled (`create_posts` → `do_not_allow`); public creates only via the custom REST route  
- Capability gate for admin: `manage_options`

## Admin permissions

| Capability | Access |
|------------|--------|
| `manage_options` | List, filter, search, view detail, change status, delete, CSV export, settings |
| Everyone else | No lead UI; public can only **submit** via REST |

Statuses: **New**, **Contacted**, **Qualified**, **Proposal Sent**, **Won**, **Lost**.

Pricing calculator detail view renders nested business / service / contact answers in grouped tables plus raw JSON.

## Configuration

**VectorCodex Leads → Settings** shows status pills for email and Turnstile, plus:

| Setting | Default | Purpose |
|---------|---------|---------|
| Admin notification | On | `wp_mail()` to staff after each stored lead |
| Admin notification email | `info@vectorcodex.com` | Staff inbox |
| Customer acknowledgement | On | Confirmation to the submitter |
| Rate limit | 8 / 600s | Per IP hash |
| Max body bytes | 524288 | Request size cap |
| Retention days | 730 | Documented retention target |
| Turnstile enable | **Off** | Keep off until Astro embeds the widget |
| Turnstile Site Key | empty | Public key for the frontend widget |
| Turnstile Secret Key | empty | Private key for Siteverify (options table only) |

Secrets are never hardcoded in plugin files and are never returned from the public REST endpoint.

## Email setup

After a lead is stored, `VC_Lead_Email::send_for_lead()`:

1. Sends an **admin notification** (when enabled) with contact fields, message/summary, and for pricing calculator a readable summary plus a link to the full lead detail (complete nested payload stays in WordPress).
2. Sends a **customer acknowledgement** (when enabled) to the submitted email.

Delivery uses WordPress `wp_mail()`. Outcomes are stored on the lead (`sent` / `failed` / `skipped` + short code + timestamp) for admin troubleshooting. **Email failure never deletes or rolls back the lead.**

### SMTP recommendations

`wp_mail()` on many hosts uses PHP `mail()`, which is often unreliable or spam-folder prone. Recommended:

1. Install a trusted SMTP plugin (WP Mail SMTP, FluentSMTP, Post SMTP, etc.).
2. Authenticate with Google Workspace, Microsoft 365, SendGrid, Amazon SES, or similar.
3. Use a From address on a domain you control (ideally aligned with `info@vectorcodex.com`).
4. Send a test from the SMTP plugin, then submit a test lead and check **Lead detail → Email delivery**.

Do **not** store SMTP passwords inside this plugin.

## Cloudflare Turnstile

Server-side verification calls `https://challenges.cloudflare.com/turnstile/v0/siteverify`.

1. Create a Turnstile widget in the Cloudflare dashboard (hostname allowlist should include `vectorcodex.com` / your form origin).
2. Paste **Site Key** and **Secret Key** into **VectorCodex Leads → Settings**.
3. Leave **Enable Turnstile enforcement** unchecked until the Astro frontend is ready.
4. When enabled, submissions without a valid `cf-turnstile-response` are rejected. Missing configuration (enabled without secret) returns a safe 503 without exposing secrets.
5. Expired, invalid, and reused tokens are rejected (Cloudflare error-codes + local replay cache).

### Required frontend field (next integration)

When Turnstile is enabled, each FormData submit must include:

```text
cf-turnstile-response=<token from Turnstile widget>
```

The public Site Key may be embedded in the Astro app. The Secret Key must remain only in WordPress options.

`human_check` remains a UX bot checkbox and is **not** treated as CAPTCHA.

## Security summary

- Explicit REST `permission_callback` (size + rate limit); no public lead reads  
- Sanitization / validation for email, phone, URLs, text  
- Form-type-aware honeypot  
- Server-side rate limiting + request size limits  
- Turnstile Siteverify when enabled; secret never logged or returned  
- Email independent of storage (SMTP / API failure cannot drop a lead)

## Testing

Offline (no WordPress bootstrap; Turnstile/SMTP mocked):

```bash
php tests/run-tests.php
```

Covers all seven sample payloads, invalid data, honeypot, rate-limit helper, unauthorized admin capability, admin + customer emails, email failure while lead meta remains, Turnstile disabled / missing config / valid / invalid / expired / reused tokens.

With WordPress loaded (plugin active):

```bash
php tests/run-tests.php --wp=/path/to/wp-load.php
```

Live REST checks (when `--wp=` is provided) exercise storage paths. Offline runs do **not** claim live Cloudflare Siteverify or live SMTP delivery.

## Retention / privacy

Store only what sales needs. Prefer deleting stale leads from the admin UI. The retention setting documents policy; automated purge is intentionally deferred. IP addresses are hashed with a site salt rather than stored in clear text.

## Frontend

Do **not** change Astro/React forms, styling, blog integration, or the editorial theme as part of this plugin stage. Wire `PUBLIC_CONTACT_ENDPOINT` when ready, and add Turnstile + `cf-turnstile-response` in a later frontend pass before enabling enforcement.
