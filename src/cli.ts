#!/usr/bin/env node
import path from 'node:path';
import fs from 'node:fs/promises';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { BUILTIN_TEMPLATES, type BuiltinTemplate } from './types.js';
import { loadInput, renderToPng } from './render.js';
import { getTemplate, templateList } from './templates/registry.js';

const DEFAULT_OUTPUT_DIR = './out/download/xiaohongshu';

function defaultFontGuess() {
  return [
    '/System/Library/Fonts/PingFang.ttc',
    '/System/Library/Fonts/Supplemental/PingFang.ttc',
    '/System/Library/Fonts/Supplemental/Arial Unicode.ttf',
  ];
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

function tsCompact() {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}-${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
}

function resolveOutPath(template: BuiltinTemplate, out?: string, stableName?: boolean) {
  if (out) return path.resolve(String(out));
  const filename = stableName ? `${template}.png` : `${template}-${tsCompact()}.png`;
  return path.join(DEFAULT_OUTPUT_DIR, filename);
}

await yargs(hideBin(process.argv))
  .scriptName('ximg')
  .command(
    'render',
    '根据 JSON 数据渲染 PNG',
    (cmd: any) =>
      cmd
        .option('template', {
          type: 'string',
          choices: [...BUILTIN_TEMPLATES],
          demandOption: true,
          describe: '模板名称',
        })
        .option('data', {
          type: 'string',
          demandOption: true,
          describe: '输入 JSON 路径',
        })
        .option('out', {
          type: 'string',
          describe: '输出 PNG 路径；不传则输出到默认目录',
        })
        .option('stable-name', {
          type: 'boolean',
          default: false,
          describe: '使用稳定文件名 <template>.png，而不是带时间戳',
        })
        .option('width', {
          type: 'number',
          describe: '输出宽度；默认使用模板默认值',
        })
        .option('height', {
          type: 'number',
          describe: '输出高度；默认使用模板默认值',
        })
        .option('font', {
          type: 'string',
          describe: '常规字体路径 (ttf/otf/ttc)',
        })
        .option('fontBold', {
          type: 'string',
          describe: '粗体字体路径',
        }),
    async (args: any) => {
      const template = args.template as BuiltinTemplate;
      const def = getTemplate(template);
      const dataPath = path.resolve(String(args.data));
      const outPath = resolveOutPath(template, args.out, args.stableName);
      const width = Number(args.width ?? def.defaultWidth);
      const height = Number(args.height ?? def.defaultHeight);

      const fontRegularPath =
        (args.font ? path.resolve(String(args.font)) : undefined) ??
        (await firstExisting(defaultFontGuess())) ??
        '';

      if (!fontRegularPath) {
        throw new Error('No font found. Please pass --font /path/to/font.ttf');
      }

      const input = await loadInput(dataPath, template);
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
  .command(
    'template',
    '模板相关命令',
    (cmd: any) =>
      cmd
        .option('action', {
          type: 'string',
          choices: ['list', 'show', 'init'],
          demandOption: true,
          describe: '模板动作',
        })
        .option('name', {
          type: 'string',
          choices: [...BUILTIN_TEMPLATES],
          describe: '模板名称（show/init 必填）',
        })
        .option('json', {
          type: 'boolean',
          default: false,
          describe: 'list 时以 JSON 输出',
        })
        .option('out', {
          type: 'string',
          describe: 'init 时输出 JSON 路径；不传则打印到 stdout',
        }),
    async (args: any) => {
      const action = String(args.action);

      if (action === 'list') {
        if (args.json) {
          process.stdout.write(
            JSON.stringify(
              templateList.map((item) => ({
                name: item.name,
                description: item.description,
                defaultWidth: item.defaultWidth,
                defaultHeight: item.defaultHeight,
                examplePath: item.examplePath,
              })),
              null,
              2
            ) + '\n'
          );
          return;
        }

        for (const item of templateList) {
          process.stdout.write(`${item.name}\t${item.description}\n`);
        }
        return;
      }

      if (!args.name) {
        throw new Error('template show/init requires --name <template>');
      }

      const def = getTemplate(args.name as BuiltinTemplate);

      if (action === 'show') {
        process.stdout.write(
          [
            `name: ${def.name}`,
            `description: ${def.description}`,
            `size: ${def.defaultWidth}x${def.defaultHeight}`,
            `example: ${def.examplePath}`,
            `schema: template-specific`,
          ].join('\n') + '\n'
        );
        return;
      }

      if (action === 'init') {
        const examplePath = path.resolve(def.examplePath);
        const content = await fs.readFile(examplePath, 'utf8');

        if (args.out) {
          const outPath = path.resolve(String(args.out));
          await fs.mkdir(path.dirname(outPath), { recursive: true });
          await fs.writeFile(outPath, content, 'utf8');
          process.stdout.write(outPath + '\n');
          return;
        }

        process.stdout.write(content + '\n');
        return;
      }
    }
  )
  .demandCommand(1)
  .strict()
  .help()
  .parse();
