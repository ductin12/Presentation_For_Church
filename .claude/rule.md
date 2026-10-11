# Operating Rules
The single source of truth for all rules and operating workflows is `AGENTS.md`.

1. Always follow `AGENTS.md`.
2. Plan first (`/pfc-plan`), Action later (`/pfc-action`). Never edit code during Plan phase.
3. Always create safety backups before editing code (`Workflow/backup-*`).
4. Keep changes surgical; never touch dead code (`src/schema.js`, `edit-song.html`).
5. Write and execute automated test suites (`Workflow/test-*.js`) with 100% pass before completion.
6. Observe the Release Confirmation Gate before building or publishing.
