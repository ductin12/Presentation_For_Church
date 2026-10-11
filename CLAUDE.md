# CLAUDE.md
This repository follows the unified AI Agent Operating System defined in `AGENTS.md`.

## Single Source of Truth
Please read and follow `AGENTS.md` for all architecture boundaries, autonomous workflows, dead-code rules, and Just-In-Time documentation pointers.

## Quick Reference
- Platform: Electron 41, Node.js, Tailwind CSS (offline).
- Run dev: `npm start`
- Build packages: `npm run build:all` (or `build:mac`, `build:win`)
- Dead code (DO NOT TOUCH): `src/schema.js`, `edit-song.html`, `src/js/core.js`, `src/js/utils.js`.
- Isolated folder: `web/` (Next.js landing page).
- Core workflow: Plan (`/pfc-plan`) -> Action (`/pfc-action`) -> Release (`/pfc-release`).
