import type { TemplateDefinition } from './types.js';
import { commonSchema } from './schemas.js';
import { clamp, themes, baseContainer } from './shared.js';

export const cover01Template: TemplateDefinition = {
  name: 'cover-01',
  description: '简单封面卡片',
  defaultWidth: 1080,
  defaultHeight: 1440,
  examplePath: 'examples/cover.json',
  schema: commonSchema,
  render: (input) => {
    const theme = themes[input.theme ?? 'black'];
    return (
      <div style={baseContainer(theme.bg, theme.fg)}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div style={{ fontSize: 88, fontWeight: 900, letterSpacing: -1 }}>{clamp(input.title, 18)}</div>
          {input.subtitle ? (
            <div style={{ fontSize: 40, fontWeight: 500, color: theme.muted }}>{clamp(input.subtitle, 36)}</div>
          ) : null}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 34, fontWeight: 700, color: theme.muted }}>{input.footer ?? ''}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 28, fontWeight: 900 }}>
            <div style={{ width: 14, height: 14, borderRadius: 14, background: theme.accent }} />
            <div>Generated</div>
          </div>
        </div>
      </div>
    );
  },
};
