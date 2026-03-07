#!/usr/bin/env node
import path from 'node:path';
import fs from 'node:fs/promises';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { BUILTIN_TEMPLATES, type BuiltinTemplate } from './types.js';
import { loadInput, renderToPng } from './render.js';
import { getTemplate, templateList } from './templates/registry.js';
import { config, getOutputImageDir, makeBatchOutputDir, setOutputImageDir } from './config.js';

const DEFAULT_BATCH_TARGETS = ['xhs-note:cream', 'xhs-note:blue', 'xhs-note-green', 'xhs-quote-blue'] as const;

type RenderTarget = {
  template: BuiltinTemplate;
  theme?: string;
  suffix: string;
};

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
  return path.join(getOutputImageDir(), filename);
}

function parseTarget(raw: string): RenderTarget {
  const [templateRaw, themeRaw] = raw.split(':');
  if (!templateRaw || !BUILTIN_TEMPLATES.includes(templateRaw as BuiltinTemplate)) {
    throw new Error(`Invalid render target: ${raw}`);
  }

  const template = templateRaw as BuiltinTemplate;
  const theme = themeRaw?.trim() || undefined;
  const suffix = theme ? `${template}-${theme}` : template;

  return { template, theme, suffix };
}

async function resolveFontRegularPath(args: any) {
  const fontRegularPath =
    (args.font ? path.resolve(String(args.font)) : undefined) ??
    (await firstExisting(defaultFontGuess())) ??
    '';

  if (!fontRegularPath) {
    throw new Error('No font found. Please pass --font /path/to/font.ttf');
  }

  return fontRegularPath;
}

await yargs(hideBin(process.argv))
  .scriptName('postgen')
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
      const fontRegularPath = await resolveFontRegularPath(args);

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
    'render-many',
    '用同一份数据批量渲染多张 PNG',
    (cmd: any) =>
      cmd
        .option('data', {
          type: 'string',
          demandOption: true,
          describe: '输入 JSON 路径',
        })
        .option('targets', {
          type: 'string',
          describe: '逗号分隔的目标列表，如 xhs-note:cream,xhs-note:blue,xhs-note-green,xhs-quote-blue',
        })
        .option('dir', {
          type: 'string',
          describe: '输出目录；不传则在默认目录下创建新的批次子目录',
        })
        .option('label', {
          type: 'string',
          default: 'batch',
          describe: '批次目录名前缀',
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
      const dataPath = path.resolve(String(args.data));
      const fontRegularPath = await resolveFontRegularPath(args);
      const targets = String(args.targets || DEFAULT_BATCH_TARGETS.join(','))
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean)
        .map(parseTarget);

      const baseDir = args.dir ? path.resolve(String(args.dir)) : getOutputImageDir();
      const outDir = args.dir ? baseDir : makeBatchOutputDir(baseDir, String(args.label || 'batch'));
      await fs.mkdir(outDir, { recursive: true });

      const raw = await fs.readFile(dataPath, 'utf8');
      const baseJson = JSON.parse(raw);
      const results: Array<{ template: string; theme?: string; outPath: string }> = [];

      for (const target of targets) {
        const def = getTemplate(target.template);
        const input = def.schema.parse({
          ...baseJson,
          ...(target.theme ? { theme: target.theme } : {}),
        });
        const outPath = path.join(outDir, `${target.suffix}.png`);

        await renderToPng({
          template: target.template,
          input,
          width: def.defaultWidth,
          height: def.defaultHeight,
          outPath,
          fontRegularPath,
          fontBoldPath: args.fontBold ? path.resolve(String(args.fontBold)) : undefined,
        });

        results.push({ template: target.template, theme: target.theme, outPath });
      }

      process.stdout.write(
        JSON.stringify(
          {
            outDir,
            results,
          },
          null,
          2
        ) + '\n'
      );
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
  .command(
    'config <action> [key] [value]',
    '查看或设置本地配置',
    (cmd: any) =>
      cmd
        .positional('action', {
          type: 'string',
          choices: ['get', 'set', 'list', 'reset'],
          describe: '配置动作',
        })
        .positional('key', {
          type: 'string',
          describe: '配置键名',
        })
        .positional('value', {
          type: 'string',
          describe: '配置值',
        }),
    async (args: any) => {
      const action = String(args.action);
      const key = args.key ? String(args.key) : undefined;

      if (action === 'list') {
        process.stdout.write(
          JSON.stringify(
            {
              'output.imageDir': getOutputImageDir(),
            },
            null,
            2
          ) + '\n'
        );
        return;
      }

      if (!key) {
        throw new Error('config get/set/reset requires <key>');
      }

      if (action === 'get') {
        process.stdout.write(String(config.get(key as 'output.imageDir') ?? '') + '\n');
        return;
      }

      if (action === 'set') {
        if (!args.value) {
          throw new Error('config set requires <value>');
        }

        if (key === 'output.imageDir') {
          const resolved = setOutputImageDir(String(args.value));
          process.stdout.write(resolved + '\n');
          return;
        }

        throw new Error(`Unsupported config key: ${key}`);
      }

      if (action === 'reset') {
        if (key === 'output.imageDir') {
          const fallback = path.resolve(process.cwd(), 'out');
          config.set('output.imageDir', fallback);
          process.stdout.write(fallback + '\n');
          return;
        }

        throw new Error(`Unsupported config key: ${key}`);
      }
    }
  )
  .demandCommand(1)
  .strict()
  .help()
  .parse();
