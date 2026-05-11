# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Source Of Truth

- `docs/README.md`
- `docs/architecture.md`
- `docs/rules.md`
- `docs/debugging-playbook.md`
- `docs/feature-workflow.md`
- `docs/ui-guidelines.md`
- `docs/data-contracts.md`

## Operating Rules

- Read the repo docs before changing code.
- Inspect the exact file(s) you will touch, not just the summary.
- Preserve unrelated user changes.
- Keep changes small and verifiable.
- If behavior changes, update the matching docs.

## Project Overview

Electron desktop app for church worship presentation. Two-window architecture: Operator (control) window and Live (projection) window. Main renderer logic is concentrated in `index.html`.

## Build & Run

```bash
npm install
npm start
npm run build
```

No tests or linter are configured. Manual verification is required for every change.

## Typical Change Paths

- Data or schema change: `main.js` + `src/schema.js` + docs
- Renderer / schedule / library change: `index.html` + docs
- Live display change: `live.html` + docs
- Song editor UI change: `edit-song.html` + docs
- IPC contract change: `main.js` + `preload.js`

## Useful Workflows

- Before editing data, check `src/schema.js` for validation and migration behavior.
- Before adding UI behavior, identify whether it affects operator, live, or both.
- Before shipping a change, run the app and inspect the logs for the touched flow.

## Constraints To Keep In Mind

- `index.html` is a monolith and contains most renderer logic.
- `live.html` depends on the `app-media://` protocol and the virtual canvas layout.
- Settings and library data are stored in the Electron `userData` directory, not in the project root.
- Bible XML sources may be cached per source file name.
