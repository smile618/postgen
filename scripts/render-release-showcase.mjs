import fs from 'node:fs/promises';
import path from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);
const rootDir = process.cwd();
const outDir = path.resolve(process.env.RELEASE_SHOWCASE_OUT_DIR || 'release-showcase');

const fontCandidates = [
  {
    regular: 'fonts/extracted/PingFang-SC-Regular.ttf',
    bold: 'fonts/extracted/PingFang-SC-Semibold.ttf',
  },
  {
    regular: 'fonts/PingFang.ttc',
    bold: 'fonts/PingFang.ttc',
  },
  {
    regular: '/System/Library/Fonts/PingFang.ttc',
    bold: '/System/Library/Fonts/PingFang.ttc',
  },
  {
    regular: '/System/Library/Fonts/Supplemental/PingFang.ttc',
    bold: '/System/Library/Fonts/Supplemental/PingFang.ttc',
  },
];

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
    fontRegular: 'fonts/custom/PatrickHand-Regular.ttf',
  },
];

async function fileExists(targetPath) {
  try {
    await fs.access(path.resolve(rootDir, targetPath));
    return true;
  } catch {
    try {
      await fs.access(targetPath);
      return true;
    } catch {
      return false;
    }
  }
}

async function resolveDefaultFonts() {
  for (const candidate of fontCandidates) {
    const regularPath = path.isAbsolute(candidate.regular) ? candidate.regular : path.resolve(rootDir, candidate.regular);
    const boldPath = path.isAbsolute(candidate.bold) ? candidate.bold : path.resolve(rootDir, candidate.bold);

    if ((await fileExists(regularPath)) && (await fileExists(boldPath))) {
      return { regular: regularPath, bold: boldPath };
    }
  }

  throw new Error('No default font pair found for release showcase rendering.');
}

async function main() {
  await fs.mkdir(outDir, { recursive: true });
  const defaultFonts = await resolveDefaultFonts();

  for (const item of templates) {
    const outPath = path.join(outDir, item.fileName);
    const fontRegular = item.fontRegular ? path.resolve(rootDir, item.fontRegular) : defaultFonts.regular;
    const fontBold = item.fontBold ? path.resolve(rootDir, item.fontBold) : defaultFonts.bold;
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
    ];

    if (fontBold) {
      args.push('--fontBold', fontBold);
    }

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
