#!/usr/bin/env node
import path from 'node:path';
import fs from 'node:fs/promises';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { BUILTIN_TEMPLATES } from './types.js';
import { loadInput, renderToPng } from './render.js';

function defaultFontGuess() {
  // Best-effort on macOS; user can override via flags.
  const candidates = [
    '/System/Library/Fonts/PingFang.ttc',
    '/System/Library/Fonts/Supplemental/PingFang.ttc',
    '/System/Library/Fonts/Supplemental/Arial Unicode.ttf',
  ];
  return candidates;
}

async function firstExisting(paths: string[]) {
  for (const p of paths) {
    try {
      await fs.access(p);
      return p;
    } catch {}
  }
  return undefined;
}

await yargs(hideBin(process.argv))
  .scriptName('ximg')
  .command(
    'render',
    'Render a PNG from JSON data',
    (cmd: any) =>
      cmd
        .option('template', {
          type: 'string',
          choices: [...BUILTIN_TEMPLATES],
          default: 'cover-01',
          describe: 'Built-in template name',
        })
        .option('data', {
          type: 'string',
          demandOption: true,
          describe: 'Path to input JSON',
        })
        .option('out', {
          type: 'string',
          demandOption: true,
          describe: 'Output PNG path',
        })
        .option('width', {
          type: 'number',
          default: 1080,
        })
        .option('height', {
          type: 'number',
          default: 1440,
        })
        .option('font', {
          type: 'string',
          describe: 'Path to regular font file (ttf/otf/ttc)',
        })
        .option('fontBold', {
          type: 'string',
          describe: 'Path to bold font file',
        }),
    async (args: any) => {
      const dataPath = path.resolve(String(args.data));
      const outPath = path.resolve(String(args.out));
      const template = args.template as any;
      const width = Number(args.width);
      const height = Number(args.height);

      const fontRegularPath =
        (args.font ? path.resolve(String(args.font)) : undefined) ??
        (await firstExisting(defaultFontGuess())) ??
        '';

      if (!fontRegularPath) {
        throw new Error('No font found. Please pass --font /path/to/font.ttf');
      }

      const input = await loadInput(dataPath);
      await renderToPng({
        template,
        input,
        width,
        height,
        outPath,
        fontRegularPath,
        fontBoldPath: args.fontBold ? path.resolve(String(args.fontBold)) : undefined,
      });

      process.stdout.write(outPath + '\n');
    }
  )
  .demandCommand(1)
  .strict()
  .help()
  .parse();
