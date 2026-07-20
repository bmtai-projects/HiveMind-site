# HiveMind Site

The public web surface for HiveMind: product/pricing pages, the
Cashfree-required compliance pages (refund policy, terms, privacy,
contact), and `/activate` -- the device-flow login + top-up page the CLI
sends users to.

Deployed on Vercel. Talks to `HiveMind-server` over HTTPS; holds no
secrets of its own (every `NEXT_PUBLIC_*` env var is safe to expose to the
browser by design -- see `.env.example`).

## Local development

```sh
npm install
cp .env.example .env.local   # defaults to a local HiveMind-server on :8080
npm run dev
```

Firebase sign-in on `/activate` is a no-op (shows a "not configured yet"
notice) until `NEXT_PUBLIC_FIREBASE_*` vars are set -- lets this app build
and deploy before a real Firebase project exists.

## Build / lint / typecheck

```sh
npm run build       # next build (Turbopack) -- also runs the TS check
npx eslint .         # next lint was removed in Next 16; run eslint directly
npx tsc --noEmit
```

## How `/activate` works

Two independent flows share the same page:

1. **CLI login** -- `hivemind auth login` opens
   `/activate?user_code=XXXX-XXXX`. Signing in with Google calls
   `POST /v1/auth/device/approve` with the Firebase ID token, which
   approves the code so the CLI's next poll gets back its long-lived
   token.
2. **Top-up only** -- visiting `/activate` directly (no `user_code`)
   skips device approval and goes straight to sign-in + add-funds. The
   backend's `requireAuth` middleware accepts a Firebase ID token
   directly for this reason (not just the CLI's opaque token) -- see
   `HiveMind-server`'s `src/middleware/auth.ts`.

Top-up calls `POST /v1/billing/checkout`, then hands the returned
`payment_session_id` to `@cashfreepayments/cashfree-js` to redirect to
Cashfree's hosted checkout.

## Deploying

Import this repo into Vercel and set the env vars from `.env.example` as
real values (Project -> Settings -> Environment Variables):

- `NEXT_PUBLIC_API_BASE` -- the deployed `HiveMind-server` URL + `/v1`.
- `NEXT_PUBLIC_FIREBASE_*` -- from the Firebase project console once it
  exists (see `HiveMind-server`'s README for that setup).
- `NEXT_PUBLIC_CASHFREE_MODE` -- `sandbox` until Cashfree approves
  production KYC, then `production`.

Also set `HiveMind-server`'s `WEB_BASE_URL` to this site's real domain
once deployed (needed for CORS and for the `/activate` link shown to CLI
users).

## Content review

The compliance pages (refund policy, terms, privacy) are a reasonable
starting template covering what a payment aggregator's KYC review
typically checks for -- not legal advice. Worth a real read-through (or a
lawyer's) before relying on them, especially the governing-law and
liability language in Terms.
