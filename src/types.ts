export const BUILTIN_TEMPLATES = ['cover-01', 'cover-a', 'card-b', 'poster-c', 'xhs-note'] as const;
export type BuiltinTemplate = (typeof BUILTIN_TEMPLATES)[number];

export type ThemeName = 'black' | 'white' | 'yellow' | 'mint';

export interface RenderInput {
  title: string;
  subtitle?: string;
  bullets?: string[];
  footer?: string;
  theme?: ThemeName;
  icon?: string;
  label?: string;
}

export interface RenderOptions {
  width: number;
  height: number;
  template: BuiltinTemplate;
  outPath: string;
  dataPath?: string;
  fontRegularPath: string;
  fontBoldPath?: string;
}
