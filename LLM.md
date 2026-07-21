# issue-press — agent notes

Press: an issue-based digital magazine, and a Hanzo app template forked on
hanzo.app. Vite + React 19 + `@hanzo/gui` (UI) + `@hanzo/iam` (auth) +
`@hanzo/base` (data). Keep it minimal and REAL — every surface must build and
run, no fabricated UI.

## The app

- **Concept** — editors curate numbered `issues`; each has a cover story and
  department `articles`. Readers open an issue and move between its pieces.
- **Three views** (`src/views/`): `newsstand` (issue covers grid + compose) →
  `issue` (cover story + department sections + file a piece) → `article` (feature
  read: two-column body + hanging pull-quote). The signed-out `signed-out.tsx` is
  the cover.
- **Navigation** is one `Route` value in `shell.tsx` (`src/nav.ts`), no router.
- **Design** lives in `src/press.tsx`: the black/white/one-hot-red palette and
  the editorial primitives (`Masthead`, `Kicker`, `Rule`, `Action`, `Chip`,
  `Field`, `Line`, `Body`). Explicit hex colors, so the look is independent of
  the gui theme token.

## One way, decomplected

- **Providers** (`src/providers.tsx`) mount in the canonical Hanzo order:
  `GuiProvider` → `IamProvider` → `BaseProvider`. `BaseProvider` gets a
  `BaseClient` carrying the IAM access token; it is rebuilt when the token
  changes (`src/lib/base.ts` `baseAs`). That single seam makes every
  `useQuery`/`useMutation` org-scoped to the signed-in user.
- **Env is one place** (`src/env.ts`), read from `import.meta.env.VITE_*`. The
  IAM client id is `import.meta.env.VITE_IAM_CLIENT_ID` (fallback `hanzo-app`).
- **UI is one system** — `@hanzo/gui` primitives only (no second kit, no
  Tailwind). Every editorial component in `press.tsx` is built from
  `XStack`/`YStack`/`Text`/`Input`.

## Gotchas (do not regress)

- **`@hanzo/gui` under Vite** needs three things in `vite.config.ts` (it is the
  Tamagui line): (1) alias `react-native` → `react-native-web`, (2) `define`
  `process.env.TAMAGUI_TARGET` / `NODE_ENV` / `__DEV__`, (3) `dedupe`
  react/react-dom/react-native-web. No Tamagui compiler, no `one`, no Expo.
- **`@hanzo/gui` props are Tamagui LONGHAND** with this v5 config:
  `alignItems`/`justifyContent`/`backgroundColor`/`padding`/`borderRadius`/
  `textAlign` — NOT the `items`/`justify`/`bg`/`p`/`rounded`/`text` shorthands.
  Shorthands pass at runtime but FAIL `tsc`.
- **No `tag` prop on stacks**, and **`Button` rejects `color`** under this config
  (wrap a `<Text color>` child, or use the pressable `Action` in `press.tsx`).
  `fontSize` accepts raw numbers on text components — that is what carries the
  oversized display type. Stacks/`Text` accept `onPress` + `hoverStyle`.
- **PKCE storage is `localStorage`** (not sessionStorage) so the verifier/state
  survive the round-trip to hanzo.id.
- **`schema.sql` is the data contract.** It is the `databaseSchema` DDL the
  deploy translates into Base collections. Keep it in lockstep with the views
  (`issues` ↔ newsstand, `articles` ↔ issue/article). `"order"` is quoted
  because it is a reserved word.

## Deploy contract (Hanzo Cloud)

- Static SPA: `npm run build` → `dist/`, served at `<slug>.hanzo.app`. No server.
- On publish, `schema.sql` → `provisionBaseFromDDL` creates the collections
  (org-scoped by `@request.auth.org_id = org`, IAM-native). Runtime read/write is
  browser → `VITE_HANZO_BASE_URL` with the IAM token.
- **IAM redirect registration** is the one external requirement: the IAM client
  (`VITE_IAM_CLIENT_ID`, default `hanzo-app`) must allow this origin's
  `/auth/callback` (a `https://*.hanzo.app/auth/callback` wildcard on the shared
  client, or a per-app `hanzo-<app>` client).

## Proven

`tsc --noEmit` clean · `vite build` → `dist/`. CI (`.github/workflows/ci.yml`)
runs `npm ci && npm run typecheck && npm run build` — build-verification only,
NEVER a container image (Hanzo Cloud owns deploys; do not build images locally).
