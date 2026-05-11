---
name: presentation-church-workflow
description: Workflow for debugging, extending, and maintaining the Presentation_For_Church Electron app. Use when editing main.js, preload.js, index.html, live.html, edit-song.html, src/schema.js, or the app's data contracts and UI behavior.
---

# Presentation Church Workflow

Use this skill for repo-specific work on the church presentation app.

## Read first

- `docs/README.md`
- `docs/architecture.md`
- `docs/rules.md`
- `docs/debugging-playbook.md`
- `docs/feature-workflow.md`
- `docs/ui-guidelines.md`
- `docs/data-contracts.md`

## Working order

1. Inspect the exact files involved and `git status`.
2. Confirm whether the change touches data, IPC, renderer UI, or live output.
3. Make the smallest safe change that solves the task.
4. Keep renderer code aligned with `preload.js` and `main.js`.
5. Update docs when the behavior or contract changes.
6. Verify the affected window and check logs.

## Hard guardrails

- Do not revert unrelated user edits.
- Do not assume contracts that are not in `src/schema.js` or the docs.
- Do not add direct Node access to renderers.
- Do not change UI language/style between `index.html`, `edit-song.html`, and `live.html` unless the task explicitly asks for it.
- Do not skip validation for data migrations or file writes.

## Common change patterns

- New data field: update `src/schema.js`, data write path, and docs.
- New renderer feature: update `index.html` and any IPC hooks in `preload.js`.
- Live display feature: update `live.html` and the sender in `main.js` / renderer.
- Media feature: verify `app-media://` and `userData/media` flow.
