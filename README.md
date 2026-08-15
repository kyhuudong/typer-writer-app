# Minimal Typer

A local-first English typing practice app with a minimalist, input-first design.

## Run

```bash
npm install
npm run dev
```

## Test

```bash
npm run test
```

## Build

```bash
npm run build
```

## Local file workflow

- Lessons live in `data/lessons.json`
- Progress is stored in a local JSON file
- Use the load/save buttons to import or export `user_progress.json`
- File System Access is used when the browser supports it, with download fallback otherwise

## Layout

- Stats sit above the typing surface
- The main area is a bigger live typing input
- The active character uses a colorful underline cursor
- Progress and Lessons live in a compact icon-only left-side menu rail
- Expanded sidebar sections use simple text lists
- The lesson text is clickable to speak
- The UI stays black, transparent, and border-light
- The lesson set includes one long philosophy passage for extended practice

## Typing stats

- WPM uses standard typing-test math: correct characters / 5 over elapsed minutes
- Finish shows how much of the current lesson is complete
- Accuracy still measures exact character matches
