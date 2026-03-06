import fs from 'node:fs/promises';
import path from 'node:path';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { z } from 'zod';
import { renderTemplate } from './templates.js';
import type { BuiltinTemplate, RenderInput } from './types.js';

const inputSchema = z.object({
  title: z.string().min(1),
  subtitle: z.string().optional(),
  bullets: z.array(z.string()).optional(),
  footer: z.string().optional(),
  theme: z.enum(['black', 'white', 'yellow', 'mint']).optional(),
  icon: z.string().optional(),
  label: z.string().optional(),
});

export async function loadInput(dataPath: string): Promise<RenderInput> {
  const raw = await fs.readFile(dataPath, 'utf8');
  const json = JSON.parse(raw);
  return inputSchema.parse(json);
}

async function loadFont(fontPath: string) {
  const buf = await fs.readFile(fontPath);
  return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
}

export async function renderToPng(params: {
  template: BuiltinTemplate;
  input: RenderInput;
  width: number;
  height: number;
  outPath: string;
  fontRegularPath: string;
  fontBoldPath?: string;
}) {
  const regularData = await loadFont(params.fontRegularPath);
  const boldData = params.fontBoldPath ? await loadFont(params.fontBoldPath) : undefined;

  const element = renderTemplate(params.template, params.input);

  const svg = await satori(element as any, {
    width: params.width,
    height: params.height,
    fonts: [
      { name: 'XFont', data: regularData, weight: 400 as any, style: 'normal' as any },
      ...(boldData ? [{ name: 'XFont', data: boldData, weight: 800 as any, style: 'normal' as any }] : []),
    ],
  });

  const resvg = new Resvg(svg, {
    fitTo: {
      mode: 'original',
    },
    font: {
      loadSystemFonts: false,
    },
  });

  const pngData = resvg.render().asPng();

  await fs.mkdir(path.dirname(params.outPath), { recursive: true });
  await fs.writeFile(params.outPath, pngData);

  return { svg, outPath: params.outPath };
}
