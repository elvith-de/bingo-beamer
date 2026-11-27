# AGENTS.md – Konventionen für dieses Repository

## Projekt

„Bingo Beamer" – statische Web-App (Vite + React + TypeScript), die Bingo-Zahlen (Bereich 1–75, Format „B-12") für eine Beamer-Anzeige generiert und protokolliert. Die App ist kein Mehrspieler-Spiel mit Karten, sondern das Ziehungs-/Anzeige-System für den Moderator. Dokumentation und UI-Texte sind auf Deutsch. Lizenz: MIT (siehe `LICENSE`).

## Arbeitsweise

- Änderungen erfolgen über Branches `vibe/<slug>-8935ab` und Pull Requests. Nie direkt auf `main` pushen oder force-pushen.
- Kleine, fokussierte Commits mit Conventional-Commit-Typ (`feat:`, `fix:`, `docs:`, `refactor:`, `chore:`).
- Vor jedem Push müssen `npm run lint` und `npm run build` lokal erfolgreich durchlaufen.
- Keine Secrets, Tokens, `.env`-Dateien oder Credentials committen.
- `README.md` ist die maßgebliche Projektdokumentation – Änderungen an Architektur, Tech-Stack oder Roadmap werden dort festgehalten.

## Code-Konventionen

- TypeScript (strict), funktionale React-Komponenten mit Hooks.
- App-State zentral im Store (`src/store/`) halten; `localStorage`-Zugriffe nur über den Storage-Adapter (`src/storage/`), damit später ein Server-Adapter austauschbar ist.
- UI-Texte auf Deutsch.
- Code selbsterklärend strukturieren.

## Build & Deployment

- `dist/` und `node_modules/` werden nicht eingecheckt (`.gitignore`).
- Deployment läuft ausschließlich über die GitHub Action bei Push auf `main` (statischer Build → GitHub Pages).

## Tests & Qualität

- Mindeststandard: `npm run lint` und `npm run build` grün. Tests (Vitest) werden eingeführt, sobald die Test-Infrastruktur steht.
