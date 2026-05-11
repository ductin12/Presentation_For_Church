# Rule 1
Read the repo docs before changing code.
Use `docs/architecture.md` and `docs/rules.md` as the source of truth.

# Rule 2
Plan first, code later.
If the task changes or you hit a mistake, stop and re-plan instead of forcing the same path.

# Rule 3
Protect user work.
Do not revert unrelated changes or overwrite files you did not intend to touch.

# Rule 4
Keep changes small and aligned with the actual architecture.
If you touch `main.js`, `preload.js`, `index.html`, `live.html`, or `src/schema.js`, update the matching docs and contracts.

# Rule 5
Prove it works.
Run the app, verify the affected window, and inspect logs before finishing.

# Rule 6
Keep answers concise, but do not skip a risk, a broken contract, or a missing verification step.
