# Security Notes

## Current Data Boundary

The browser must not know the Google Sheets CSV URLs. Frontend code calls same-origin endpoints such as:

```txt
/api/sheets/saldos
/api/sheets/contas_pagar
```

The serverless function resolves the real Google URL from environment variables and returns CSV text to the app.

## Authentication Model

The API routes (`/api/sheets/*`, `/api/granatum/*`, `/api/integrations/*`) are gated by a
**Supabase JWT**, not Basic Auth. The browser sends `Authorization: Bearer <token>` and the
serverless function validates it with `isAuthorized()` in `src/server/supabaseAuth.js`
(which calls the Supabase `/auth/v1/user` endpoint). Required deployment variables:

```txt
SUPABASE_URL            (or VITE_SUPABASE_URL)
SUPABASE_ANON_KEY       (or VITE_SUPABASE_ANON_KEY)
```

> Legacy: `PANEL_BASIC_AUTH_USER`/`PANEL_BASIC_AUTH_PASSWORD` and the Basic-Auth
> `isAuthorized()` in `src/server/sheetsProxy.js` are **deprecated dead code** kept only for
> reference — no route imports them. Remove once confirmed unused everywhere.

## Required Deployment Variables (Google Sheets)

For the migration period, the server can still read public CSV URLs. Set the URLs either as one JSON object:

```txt
SHEETS_URLS_JSON
```

or as per-sheet variables:

```txt
SHEET_URL_SALDOS
SHEET_URL_CONTAS_PAGAR
SHEET_URL_CONTAS_VENCIDAS
...
```

Per-sheet variables override `SHEETS_URLS_JSON`.

## Private Google Sheets Mode

For production, remove public Google Sheets publishing and use Google Sheets API from the server:

1. Create a Google Cloud service account.
2. Enable the Google Sheets API in the same Google Cloud project.
3. Share each spreadsheet with the service account email as `Viewer`.
4. Set these deployment secrets:

```txt
GOOGLE_SERVICE_ACCOUNT_EMAIL
GOOGLE_PRIVATE_KEY
```

5. Map each panel key to a private sheet source:

```txt
SHEETS_PRIVATE_SOURCES_JSON
```

Example:

```json
{
  "saldos": {
    "spreadsheetId": "1abc...",
    "gid": "306496671"
  },
  "contas_pagar": {
    "spreadsheetId": "1abc...",
    "gid": "230336063"
  }
}
```

You can also use per-sheet variables:

```txt
SHEET_ID_SALDOS
SHEET_GID_SALDOS
SHEET_RANGE_SALDOS
```

If `SHEET_RANGE_*` is omitted, the server resolves the tab name from the `gid` and reads the whole tab.

## Publishing Checklist

- Do not keep Google CSV URLs in frontend code.
- Do not commit `.env` files.
- Protect the deployment with Vercel/hosting authentication or SSO when available.
- Keep the Supabase env vars (`SUPABASE_URL`/`SUPABASE_ANON_KEY`) set in production so JWT validation works.
- After private mode is working for every key, turn off public Google Sheets publishing.
- Use `Cache-Control: private`/server cache only for financial data.
- Keep Granatum and Google credentials server-side only.

## Known Limitations / Hardening Backlog

1. **Authentication ≠ authorization (multi-tenant).** `isAuthorized()` only checks that the
   JWT is valid. The `empresa` query param flows from the client straight into
   `fetchSheetCsv(key, empresa)` (env-scoped sheet resolution). Any authenticated user could
   request `?empresa=<other>` and read that company's sheet **if** its env vars exist in the
   same deployment. Single-tenant deploys are unaffected; for multi-tenant, validate that the
   user is entitled to the requested `empresa` (e.g. against `profiles`/`user_panels` via RLS)
   before serving data.
2. **Dev/preview auth bypass.** `isAuthorized()` returns `true` when `SUPABASE_URL`/
   `VITE_SUPABASE_URL` are unset and `VERCEL_ENV !== 'production'`. Ensure Supabase env vars
   are set on every preview/staging deployment, or gate the bypass behind an explicit opt-in
   flag, so a misconfigured preview never serves financial data unauthenticated.
3. **Executive-access model.** JWT is the gate today; for production executive use, prefer
   corporate SSO/Google Workspace login plus per-user authorization and audit logs.
