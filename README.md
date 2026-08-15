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

- The main area is a single live typing input
- Stats sit in transparent black overlays
- Progress, Lessons, and Tools live in a left-side menu rail
- Click the typing text to hear it, then keep typing in the same surface
- The UI stays black, transparent, and border-light
