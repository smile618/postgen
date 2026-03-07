import path from 'node:path';
import Conf from 'conf';

export interface PostgenConfig {
  'output.imageDir': string;
}

const fallbackOutputDir = path.resolve(process.cwd(), 'out');

export const config = new Conf<PostgenConfig>({
  projectName: 'postgen',
  projectSuffix: '',
  defaults: {
    'output.imageDir': fallbackOutputDir,
  },
});

export function getOutputImageDir() {
  return config.get('output.imageDir') || fallbackOutputDir;
}

export function setOutputImageDir(dir: string) {
  const resolved = path.resolve(dir);
  config.set('output.imageDir', resolved);
  return resolved;
}

export function makeBatchOutputDir(baseDir: string, label = 'batch') {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  const stamp = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}-${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
  return path.join(baseDir, `${label}-${stamp}`);
}
