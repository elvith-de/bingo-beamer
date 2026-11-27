# Bingo Beamer

Web-App zur Unterstützung von Bingo-Veranstaltungen: Der Moderator zieht die Zahlen über die App, und die Anzeige auf Beamer/Monitor zeigt die zuletzt gezogene Zahl (z. B. „B-12") sowie die Historie aller bisher gezogenen Zahlen der aktuellen Runde.

Die App ist bewusst **kein** komplettes Mehrspieler-Bingo mit Spielerkarten – sie ist das Ziehungs- und Anzeige-System für den Moderator.

## Funktionsumfang (Version 1)

- Zahlen ziehen aus dem Bereich **1–75**, Anzeige mit Bingo-Buchstaben (B, I, N, G, O), z. B. „B-12", „I-23", „N-38", „G-52", „O-68"
- Große, beamer-optimierte Anzeige der zuletzt gezogenen Zahl
- Historie aller gezogenen Zahlen der aktuellen Runde (neben/unter der aktuellen Zahl)
- Ziehen per Klick oder Tastatur (Leertaste)
- Vollbildmodus
- Persistenz in `localStorage` (gezogene Zahlen überleben einen Reload)
- Runde zurücksetzen (neue Runde starten)
- Themes (verschiedene Farbschemata) und Animationen beim Ziehen
- Bingo-Button mit Animation; mehrere Bingos pro Runde sind zählbar
- Reiner statischer Build, gehostet auf GitHub Pages

## Roadmap / zukünftige Features

### Phase 2 – Räume, Fernsteuerung & Backend

- **Raum-Codes** (Jackbox-artig): Ein Raum-Code wird generiert, über den die App von einem zweiten Gerät ferngesteuert werden kann (Moderator-Steuerung)
- **Mehrere Beamer-Instanzen**: weitere Geräte joinen dem Raum und zeigen dieselbe Anzeige (Duplizierung für mehrere Leinwände)
- **Serverseitige Persistenz**: Backend auf dem vorhandenen VPS (Podman + Caddy als zentraler Ingress), Synchronisation der Instanzen z. B. über WebSocket
- **Runden-Historie**: Übersicht und Neustart vergangener Runden, optionaler Export (JSON/CSV)

### Phase 3 – Bingo-Regeln & Polish

- **Stackbare Bingo-Regeln pro Runde**, z. B. in dieser Reihenfolge: erst Zeile 1, dann Zeilen 1 und 5, zuletzt das gesamte Blatt. Jede Regel wird einmal pro Runde „freigeschaltet", mehrere Bingos pro Runde möglich. Visualisierung über Icons.
- Erweiterte Themes, Animationen und optionale Soundeffekte

## Tech-Stack

- **Vite + React + TypeScript** – komponentenbasiert und leicht iterativ erweiterbar (Themes, Animationen, später Raum-/Beamer-Ansichten)
- **Statischer Build** (`npm run build`), Deployment über **GitHub Actions** auf **GitHub Pages** (schnelles Iterieren ohne eigenen Server)
- **Zentraler App-State** in einem Store (`src/store/`), damit später eine Fernsteuerung/WebSocket-Synchronisation denselben State spiegeln kann
- **Persistenz über austauschbares Storage-Interface** (`src/storage/`): v1 `localStorage`, später ein API-Adapter gegen das Backend (VPS mit Podman + Caddy)
- Keine serverseitigen Laufzeit-Abhängigkeiten in v1

## Projektstruktur (geplant)

```
src/
  components/    # Anzeige (aktuelle Zahl), Historie, Controls, Bingo-Overlay
  store/         # zentraler App-State (Ziehungen, aktuelle Runde, Bingo-Zähler)
  storage/       # Persistenz-Adapter (v1: localStorage)
  themes/        # Farbschemata
  utils/         # Bingo-Logik (Zufallszahl, Buchstabe, Formatierung "B-12")
.github/
  workflows/     # Build + Deployment nach GitHub Pages
```

## Entwicklung

Voraussetzungen: Node.js 20+, npm.

```bash
npm install
npm run dev      # lokaler Dev-Server
npm run build    # statischer Build nach dist/
npm run preview  # Build lokal testen
npm run lint
```

## Deployment

Bei jedem Push auf `main` baut eine GitHub Action das Projekt und deployt den statischen Build nach GitHub Pages (Repository Settings → Pages → Quelle: GitHub Actions). Für höhere Last kann optional ein privater Runner verwendet werden.

## Lizenz

MIT – siehe [LICENSE](LICENSE)
