# AI use

This file states plainly what AI tools did in this project. Sections marked
**TODO (team)** need the team's own answer; they were not filled in on the
team's behalf.

## Tools

| Tool | Used for |
| --- | --- |
| Claude (Anthropic) | Repo hygiene, data schema and validator, map view, i18n, offline/accessibility work (Phases 1-5 below) |
| Cursor | A `.cursor/rules/project.mdc` file exists in the repo. **TODO (team):** confirm whether Cursor was used and for what |
| Other tools | **TODO (team):** list any other AI tools used for code, images, text, audio or 3D assets |

## What AI did

Work done with Claude in the Phase 1-5 session:

- Phase 1: `LICENSE` (Apache-2.0 text), README rewrite, this file, `.env.example`, `.cursor/rules/project.mdc`.
- Phase 2: `data/objects.geojson` skeleton, `src/types/objects.ts`, `scripts/validate-objects.mjs`. Every object is seeded `"verified": false` with TODOs and source hints. **AI did not supply coordinates, dates or mission facts.**
- Phase 3: map view (MapLibre + PMTiles), side panel, timeline, `docs/BASEMAPS.md`.
- Phase 4: i18n scaffolding (`src/i18n/`). Five UI words in Bangla were AI-drafted and are listed in `docs/I18N.md` for review; no science text was translated.
- Phase 5: service worker, offline mode, accessibility fixes, relabelling procedural terrain, asset-localizing script.

Exact files per phase are listed in the hand-off notes for each phase.

## What we did ourselves

**TODO (team):** describe what the team wrote, designed, researched and verified
by hand (story writing, illustrations, mission research, testing, fact-checking
against NASA sources, Bangla review, etc.).

## Rules we follow

- AI-written data is never marked `"verified": true`. Only a person who has
  checked the value against the cited source (NSSDCA, PDS, NTRS, etc.) flips it.
- Science text is not machine-translated into Bangla without review; untranslated
  strings fall back to English visibly and log `TODO_REVIEW`.
- Third-party media keeps its credit line.
