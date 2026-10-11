---
name: presentation-church-workflow
description: Workflow for debugging, extending, and maintaining the Presentation_For_Church Electron app. Use when editing main.js, preload.js, index.html, live.html, or data models.
---

# Presentation Church Workflow
The single source of truth for all rules and operating workflows is `AGENTS.md`.

## Core Guidelines
1. Read `AGENTS.md` before making any code modifications.
2. Active files: `index.html` (Operator Monolith), `main.js` (IPC & Main), `preload.js` (Bridge), `live.html` (Live Projection).
3. Dead code (DO NOT TOUCH): `src/schema.js`, `edit-song.html`, `src/js/core.js`, `src/js/utils.js`.
4. Isolated workspace: `web/` (Next.js landing page).
5. Workflow pipeline: Plan (`/pfc-plan`) -> Action (`/pfc-action`) -> Release (`/pfc-release`).
