import fs from 'node:fs/promises';
import path from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);
const rootDir = process.cwd();
const outDir = path.resolve(process.env.RELEASE_SHOWCASE_OUT_DIR || 'release-showcase');

const fontRegular = path.resolve('fonts/extracted/PingFang-SC-Regular.ttf');
const fontBold = path.resolve('fonts/extracted/PingFang-SC-Semibold.ttf');

const templates = [
  {
    key: 'xhs-note',
    title: 'xhs-note',
    template: 'xhs-note',
    data: 'website/data/xhs-note.json',
    fileName: 'xhs-note.png',
  },
  {
    key: 'xhs-note-green',
    title: 'xhs-note-green',
    template: 'xhs-note-green',
    data: 'website/data/xhs-note-green.json',
    fileName: 'xhs-note-green.png',
  },
  {
    key: 'xhs-quote-blue',
    title: 'xhs-quote-blue',
    template: 'xhs-quote-blue',
    data: 'website/data/xhs-quote-blue.json',
    fileName: 'xhs-quote-blue.png',
  },
  {
    key: 'apple-notes-handwrite',
    title: 'apple-notes-handwrite',
    template: 'apple-notes-handwrite',
    data: 'examples/apple-notes-handwrite.json',
    fileName: 'apple-notes-handwrite.png',
  },
];

async function main() {
  await fs.mkdir(outDir, { recursive: true });

  for (const item of templates) {
    const outPath = path.join(outDir, item.fileName);
    const args = [
      'dist/cli.js',
      'render',
      '--template',
      item.template,
      '--data',
      item.data,
      '--out',
      outPath,
      '--font',
      fontRegular,
      '--fontBold',
      fontBold,
    ];

    await execFileAsync('node', args, { cwd: rootDir });
  }

  const manifest = {
    generatedAt: new Date().toISOString(),
    gitRef: process.env.GITHUB_REF ?? null,
    gitSha: process.env.GITHUB_SHA ?? null,
    repository: process.env.GITHUB_REPOSITORY ?? null,
    templates: templates.map((item) => ({
      key: item.key,
      title: item.title,
      template: item.template,
      fileName: item.fileName,
      data: item.data,
    })),
  };

  await fs.writeFile(path.join(outDir, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n', 'utf8');

  process.stdout.write(JSON.stringify({ outDir, templates: manifest.templates }, null, 2) + '\n');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
