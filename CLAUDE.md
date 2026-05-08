# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Electron desktop app for church worship presentation — manages songs, Vietnamese Bible, and media. Two-window architecture: Operator (control) window + Live (projection) window. Inspired by EasyWorship/ProPresenter.

## Build & Run

```bash
npm install          # Install dependencies (first time — requires Node.js v18+)
npm start            # Run dev with Electron
npm run build        # Build Windows installer (electron-builder, outputs to dist/)
```

No tests or linter configured.

## Utility Scripts

```bash
node import_txt_to_json.js   # Bulk-import songs from songs_txt/ into userData/songs.json
node scan_bible.js            # Find long Bible verses that may overflow the canvas; outputs long_verses_report.json
```

**Bulk song import workflow**: Place `.txt` files in `songs_txt/` (filename becomes the song title, file content becomes lyrics with `\n\n` slide breaks). Run `import_txt_to_json.js` — it deduplicates by title and writes directly to `%APPDATA%\easyworship-app\songs.json`.

## Menu Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `Ctrl+S` | Save Schedule |
| `Ctrl+O` | Open Schedule |
| `F5` | Open Screen Live window |

## Architecture

### Process Model (Electron)

```
main.js (Main Process)
  ├── Creates mainWindow → index.html (Operator UI)
  ├── Creates liveWindow → live.html (Live display, fullscreen on 2nd monitor)
  ├── preload.js (contextBridge — exposes electronAPI to renderers)
  └── IPC handlers for all data operations

preload.js
  └── Exposes window.electronAPI with typed methods (invoke + on listeners)

src/schema.js
  └── validateItem(), migrateItem() — ensures data integrity on load/save
```

**Security model**: `contextIsolation: true`, `nodeIntegration: false`, communication via `preload.js` contextBridge. No direct `require()` in renderers. Both windows set `webSecurity: false` to allow the custom `app-media://` protocol to load media files.

### File Roles

| File | Role | Size |
|---|---|---|
| `main.js` | Main process: IPC handlers, window management, file I/O, `app-media://` protocol | ~360 lines |
| `index.html` | Operator UI: all app logic in `<script>` tags (library, schedule, editor, preview, live control) | ~2560 lines |
| `edit-song.html` | Song editor modal (separate HTML, Win98-style UI) | ~240 lines |
| `live.html` | Live display: receives IPC, renders slides with virtual canvas, double-buffer crossfade | ~290 lines |
| `preload.js` | contextBridge: exposes `electronAPI` methods to renderer | ~42 lines |
| `src/schema.js` | Data validation & migration (SongSchema, validateItem, migrateItem) | ~30 lines |

### Data Storage

User data stored in `app.getPath('userData')` (not project directory):
- `songs.json` — song library (auto-backed up with `.backup.1/.2/.3` rotation)
- `bible.json` — user-saved Bible passages (backed up similarly)
- `bible-cache.json` — parsed Bible XML cache (auto-generated)
- `media/` — imported media files (copied from original location)
- `settings.json` — app settings

Static data in project:
- `data/Bible_Vietnamese.xml` — full Vietnamese Bible (~31k verses), parsed once and cached

### IPC Communication Pattern

Renderer calls `window.electronAPI.*` methods (defined in `preload.js`) which map to `ipcMain.handle()` in `main.js`.

**Data operations** (invoke/handle pattern):
- `load-songs`, `save-song`, `delete-song` — songs.json CRUD
- `load-bible`, `load-bible-parsed`, `load-bible-xml` — Bible data access
- `save-song` handles both songs and bible items (routes by `item.type`)
- `load-media`, `import-media` — media file management
- `show-open-dialog`, `show-save-dialog` — schedule files (.bcsch format)

**Live window auto-display detection**: `createLiveWindow()` calls `screen.getAllDisplays()` — if a secondary display exists, `liveWindow` opens fullscreen and frameless on it; otherwise it opens as a windowed 800×450 frame on the primary display. `alwaysOnTop: true` in both cases.

**Live window control** (invoke → webContents.send to liveWindow):
- `live-send-content` → `live-update-content` — push slide text + style + background
- `live-send-background` → `live-update-background` — change background only
- `live-send-clear` → `live-clear` — clear screen

### Virtual Canvas Rendering

All slide displays use a 1920×1080 virtual canvas that CSS-scales to fit the container. This applies to:
- Editor preview (`editor-virtual-canvas`)
- Preview panel (`preview-virtual-canvas`)
- Live monitor in operator (`live-virtual-canvas`)
- Live window (`virtual-canvas` in live.html)

Key functions in `index.html`:
- `scaleVirtualCanvas(canvasId, containerId)` — calculates and applies CSS scale
- `applyStyleToElement(el, styleOverride)` — applies font/color/alignment to a canvas element
- `positionTextBox(textBox, style)` — positions text box within virtual canvas (supports top/middle/bottom alignment + custom position)

### State Management

All state is global JS variables in `index.html` renderer:
- `songLibrary[]`, `savedBibleList[]`, `bibleLibrary[]` — loaded data
- `schedule[]` — current worship schedule items
- `previewSlides[]`, `currentPreviewIndex` — preview panel state
- `liveSlides[]`, `currentLiveIndex`, `currentLiveScheduleIndex` — live output state
- `editorStyle` — style being edited in song editor

After any CRUD → re-render by calling `renderLibrary()`, `renderSchedule()`, etc.

### Media Protocol

Custom `app-media://` protocol registered in main process to serve media files from userData folder. Used in `<img>` and `<video>` src attributes throughout the app.

## Development Patterns

### Adding a new feature:
1. Data I/O needed → add `ipcMain.handle()` in `main.js` + expose in `preload.js`
2. UI → add HTML/JS in `index.html` (Tailwind CSS + Inter font)
3. Affects live display → add `ipcRenderer.on()` handler in `live.html`

### Styling conventions:
- `index.html`: modern dark theme using Tailwind with Inter font, custom color tokens (`primary`, `background-light`, `background-dark`)
- `edit-song.html`: Windows classic style with Tahoma font, `.win-button`, `.win-input` classes
- `live.html`: minimal, no framework — raw CSS
- CMG Sans font family loaded via local `./fonts/cmg-sans/` in both `index.html` and `live.html`

### Data format:
```json
{
  "id": "number|timestamp",
  "title": "string",
  "lyrics": "line1\nline2\n\nslide-break",
  "type": "song|bible",
  "style": { "fontSize": "120pt", "fontFamily": "...", "color": "#fff", "textBox": { "left": 96, "width": 1728, "top": null } },
  "background": { "mediaName": "file.jpg", "mediaType": "image|video" }
}
```

Lyrics split into slides on double-newline (`\n\n`).

`src/schema.js` defaults use `fontColor` (legacy field name) and `fontSize: 36` (number). `migrateItem()` merges schema defaults onto saved items, so both old and new field names can coexist during migration.

### Safe write pattern:
`main.js` uses `safeWriteSync()` (write to `.tmp` then rename) and `backupBeforeWriteSync()` (rotating `.backup.1/2/3`) for all data persistence.

## Known Constraints

- **Tailwind via CDN** — no tree-shaking, requires internet on first load
- **Monolithic HTML** — `index.html` contains all operator UI + logic (~2560 lines); no module system
- **Bible XML** — large file parsed on first run, then cached to `bible-cache.json`
- **Panel sizes** — resizable panels don't persist dimensions across restarts
- **Schedule format** — `.bcsch` files are JSON, opened/saved via native dialog
