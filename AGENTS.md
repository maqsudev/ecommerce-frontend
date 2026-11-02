<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Autonomous Agent Permissions & Guidelines

## 1. Full Command Execution Authorization
- The agent is fully authorized to execute all terminal commands (`run_command`) autonomously, including:
  - Package installations and dependency management (`npm`, `npx`, `pnpm`, `yarn`)
  - Build and lint processes (`npm run build`, `npm run lint`, `tsc`)
  - Development and testing server management (`npm run dev`, `curl`, `lsof`)
  - File system operations, git tracking, inspection, and verification scripts
- No confirmation pauses or manual approvals are required for executing safe project tasks and commands.

## 2. API & Architecture Guidelines
- Strict alignment with `postman_collection.json` (Ecommerce API - Master Collection).
- Base URL configured from `process.env.NEXT_PUBLIC_API_URL` (default `http://127.0.0.1:8000`).
- Resilient API client with mock/offline fallback data from Postman collection so the frontend remains 100% interactive and testable even when the backend server is offline.
- Support all 8 core domains: Auth & User, Catalog & Faceted Search, Cart & Guest Session, Checkout & Orders, Reviews & Ratings, Notifications, Payments & Saved Cards (Payme, Click, Uzum), and Admin Backoffice KPIs & Management.
