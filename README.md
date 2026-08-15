# Minimal Typer

A local-first English typing practice app with a minimalist design system.

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
