# ximg-cli

A tiny **JSON -> PNG** renderer (no browser) using **Satori (HTML/CSS/JSX -> SVG)** + **Resvg (SVG -> PNG)**.

## Install

```bash
npm i
```

## Render examples

```bash
npm run render:example
npm run render:list
```

Outputs:
- `out/cover.png`
- `out/list.png`

## CLI usage

Dev run:

```bash
npx tsx src/cli.ts render \
  --template cover-01 \
  --data examples/cover.json \
  --out out/cover.png
```

Options:
- `--template`: `cover-01` | `list-01`
- `--width` / `--height`: default `1080x1440`
- `--font`: regular font path (optional; best-effort auto-detect on macOS)
- `--fontBold`: optional

## Notes

- For consistent Chinese rendering, **prefer providing a font file** via `--font`.
- This is a template-driven renderer; add new templates in `src/templates.tsx`.
