# Agent guide

Canonical instructions for this repo live in [`LLM.md`](./LLM.md) (and its
`CLAUDE.md` symlink). Read it before changing anything.

TL;DR: Press — an issue-based digital magazine. Vite + React 19 + `@hanzo/gui` +
`@hanzo/iam` + `@hanzo/base`. Three views (newsstand → issue → article) built
from `@hanzo/gui` primitives with Tamagui LONGHAND props (tsc enforces this); the
design language is in `src/press.tsx`. `schema.sql` is the Base data contract
(`issues`, `articles`). Prove changes with `npm run build` (tsc + vite). Never
build a container image locally — Hanzo Cloud owns deploys.
