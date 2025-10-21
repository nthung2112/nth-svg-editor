# nth-svg-editor

A lightweight, browser‑only SVG editor with live preview, Monaco code editing, upload/download, and persistent layout/state. Built with Next.js App Router.

Key files:

- [src/components/editor.tsx](src/components/editor.tsx)
- [src/lib/svg.ts](src/lib/svg.ts)
- [src/app/page.tsx](src/app/page.tsx)

## Features

- Live, side‑by‑side code and preview via [Editor()](src/components/editor.tsx:18)
- Upload an .svg and edit in the Monaco pane
- Download current SVG via [handleDownload()](src/components/editor.tsx:36)
- Save to browser storage via [saveSvg()](src/lib/svg.ts:43) and restore via [getDefaultSvg()](src/lib/svg.ts:36)
- Resizable panels with layout persisted in a cookie via [onLayout()](src/components/editor.tsx:72) and read in [Home()](src/app/page.tsx:4)
- Light/dark theme support (system-aware) using next-themes

## Tech stack

- Next.js 15, React 19, Turbopack
- Monaco Editor (@monaco-editor/react)
- react-resizable-panels
- Tailwind CSS v4
- Radix UI + lucide-react
- sonner (toasts)

## Quick start

Prerequisites: Node 18+

Install dependencies:

```bash
npm i
# or
pnpm i
# or
bun i
```

Run dev server:

```bash
npm run dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000)

## Available scripts

```bash
npm run build  # Production build
npm start      # Start production server
npm run lint   # Biome checks
npm run format # Biome format (write)
```

## Usage

- Upload: click Upload in the header to select an .svg
- Download: click Download to save current code via [handleDownload()](src/components/editor.tsx:36)
- Save: click Save to persist to localStorage via [handleSave()](src/components/editor.tsx:67)
- Layout: drag the divider; sizes are stored in cookie `react-resizable-panels:layout` by [onLayout()](src/components/editor.tsx:72) and read in [Home()](src/app/page.tsx:4)

## How it works

- Initial code: [getDefaultSvg()](src/lib/svg.ts:36) loads from localStorage (`svg`) or falls back to `DEFAULT_SVG`
- Persisting code: [saveSvg()](src/lib/svg.ts:43) writes to localStorage
- Core UI: [Editor()](src/components/editor.tsx:18) wires Monaco and preview panes
- Page entry: [Home()](src/app/page.tsx:4) reads the layout cookie and passes `defaultLayout`

## Project structure

```text
src/
  app/
    page.tsx
    layout.tsx
  components/
    editor.tsx
    editor/
      header-bar.tsx
      monaco-pane.tsx
      preview-pane.tsx
  lib/
    svg.ts
  tools/
    index.ts
```

## Privacy

- All files stay in the browser. No uploads to a server.
- SVG content is stored locally in localStorage; layout is stored in a cookie.

## License

MIT © Hung Nguyen
