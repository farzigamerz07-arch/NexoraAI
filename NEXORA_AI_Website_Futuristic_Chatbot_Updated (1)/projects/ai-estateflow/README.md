# NEXORA.AI – EstateFlow AI

Builder-focused real-estate sales and operations SaaS. This package is **Milestone 1: interactive browser MVP/prototype**, not a production-ready multi-tenant service.

## Run it
1. Extract the ZIP.
2. Open `index.html` in Chrome, Edge or Firefox.
3. Use the left navigation. Add leads, move leads between pipeline stages, use the demo AI assistant, and export leads to CSV.
4. Lead changes are stored in the browser's `localStorage`.

No build tools or API keys are required for this prototype.

## Included in this milestone
- Builder workspace shell and responsive dashboard
- Lead CRM: add, search, filter, local persistence and CSV export
- Sales pipeline with stage changes
- Project portfolio and illustrative unit inventory
- Site visit demo schedule
- Booking and payment overview
- Simulated AI sales assistant
- Automation centre UI
- Analytics, team and settings screens

## Important prototype limitations
- Dashboard, portfolio, visit, booking and analytics figures are illustrative demo data.
- AI responses are deterministic demo responses; no LLM is connected.
- WhatsApp, email, calendar, payments, portals and external CRM integrations are not connected.
- Data lives in the current browser only. It is not shared across users or devices.
- Authentication, tenant isolation, server-side authorization, audit logging and backups are not implemented.

## Target production architecture
- Web: Next.js + React + TypeScript + Tailwind
- API: Python FastAPI, REST endpoints and webhooks
- Data: PostgreSQL with tenant_id on every tenant-owned record; PostgreSQL row-level security
- Cache/queues: Redis + Celery or equivalent workers
- AI: OpenAI API behind a provider abstraction; retrieval over approved project documents
- Automation: event-driven workflows and scheduled jobs; n8n can orchestrate external workflows
- Messaging: Meta WhatsApp Cloud API, email provider and consent/opt-out handling
- Files: S3-compatible object storage with signed URLs and malware scanning
- Identity: managed OIDC or secure auth service; RBAC and tenant-scoped authorization
- Observability: structured logs, metrics, traces, error monitoring and audit events
- Deployment: Docker, managed PostgreSQL, secrets manager, CI/CD, backups and restore tests

## Suggested repository layout for production
```text
estateflow/
  apps/
    web/                 # Next.js builder, sales and partner portals
    api/                 # FastAPI application
    worker/              # async jobs and scheduled automations
  packages/
    ui/                  # shared design system
    contracts/           # OpenAPI-generated TS types
  infra/
    docker/
    migrations/
    deployment/
  docs/
    architecture.md
    security.md
    api-spec.md
```

## Core domain model
- tenants, users, roles, permissions
- projects, towers, units, unit_status_history, price_lists
- leads, lead_sources, lead_activities, lead_assignments, lead_consents
- site_visits, visit_feedback, tasks, reminders
- bookings, booking_documents, payment_plans, invoices, payment_transactions
- channel_partners, partner_leads, commission_rules, commission_ledger
- automation_rules, automation_runs, message_templates, outbound_messages
- audit_logs, integrations, webhook_events

## API outline
- `POST /v1/leads`, `GET /v1/leads`, `PATCH /v1/leads/{id}`
- `POST /v1/projects`, `GET /v1/projects`
- `GET /v1/projects/{id}/units`, `PATCH /v1/units/{id}/status`
- `POST /v1/site-visits`, `PATCH /v1/site-visits/{id}`
- `POST /v1/bookings`, `GET /v1/bookings/{id}`
- `POST /v1/automations`, `GET /v1/automation-runs`
- `POST /v1/ai/lead-qualification`, `POST /v1/ai/copilot`
- `POST /v1/webhooks/whatsapp`

## Production rules that must not be skipped
1. Enforce tenant scope on every read and write at the API and database layers.
2. Use server-side authorization; never trust tenant IDs or roles supplied by the browser.
3. Keep API keys and webhook secrets on the server, never in frontend code.
4. Record consent and opt-out status before customer messaging.
5. Maintain append-only audit history for sensitive changes (unit status, bookings, payments, permissions).
6. Treat payment status as a reconciled financial record, not a manually editable label.
7. Validate RERA/project disclosures and local legal requirements with the builder before launch.
8. Use synthetic data in demos; do not upload real buyer personal data to this prototype.

## Next development milestone
Convert the browser prototype into a Next.js app, then implement FastAPI authentication, tenant model, PostgreSQL migrations, lead CRUD and project/unit inventory. Only after those foundations should WhatsApp, AI and payment workflows be connected.
