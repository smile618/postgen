import type { TemplateDefinition } from './types.js';
import { commonSchema } from './schemas.js';

export const xhsNoteBlueTemplate: TemplateDefinition = {
  name: 'xhs-note-blue',
  description: '蓝底叠层 Text Note 小红书卡片',
  defaultWidth: 1080,
  defaultHeight: 1440,
  examplePath: 'examples/xhs-note-blue.json',
  schema: commonSchema,
  render: (input) => {
    const lines = (input.title ?? '')
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean)
      .slice(0, 5);
    const titleLines = lines.length ? lines : [input.title ?? ''];
    const noteLabel = input.label ?? 'Text Note';
    const icon = input.icon ?? '📣';

    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          background: '#169AED',
          position: 'relative' as any,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute' as any,
            left: 98,
            top: 62,
            width: 884,
            height: 1246,
            display: 'flex',
          }}
        >
          <div
            style={{
              position: 'absolute' as any,
              left: 0,
              top: 0,
              width: 884,
              height: 1246,
              borderRadius: 52,
              background: 'rgba(230, 242, 250, 0.72)',
              transform: 'rotate(3.3deg)',
              transformOrigin: '50% 50%',
              boxShadow: '0 30px 80px rgba(0,0,0,0.14)',
            }}
          />
        </div>

        <div
          style={{
            position: 'absolute' as any,
            left: 98,
            top: 62,
            width: 884,
            height: 1246,
            display: 'flex',
            flexDirection: 'column',
            borderRadius: 52,
            background: '#EEF1F3',
            boxShadow: '0 24px 72px rgba(0,0,0,0.16)',
            padding: '70px 54px 46px 54px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', gap: 12, marginLeft: 24 }}>
              {[0, 1, 2].map((i) => (
                <div key={i} style={{ width: 10, height: 10, borderRadius: 99, background: '#2A9FE8' }} />
              ))}
            </div>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#2A9FE8', letterSpacing: -0.5, marginRight: 20 }}>{noteLabel}</div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', marginTop: 118 }}>
            <div style={{ fontSize: 92, lineHeight: 1, marginLeft: 18, marginBottom: 34 }}>{icon}</div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 24, marginLeft: 14, maxWidth: 760 }}>
              {titleLines.map((line, idx) => {
                const highlight = idx === 0 ? Math.min(2, Math.max(1, Math.floor(line.length / 2))) : 0;
                const before = highlight ? line.slice(0, highlight) : line;
                const after = highlight ? line.slice(highlight) : '';

                return (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-end',
                      flexWrap: 'wrap' as any,
                      fontSize: 84,
                      lineHeight: 1.02,
                      letterSpacing: -3.5,
                      fontWeight: 900,
                      color: '#000000',
                    }}
                  >
                    {idx === 0 && highlight ? (
                      <>
                        <span
                          style={{
                            background: '#F0DE54',
                            borderRadius: 12,
                            padding: '0 8px 2px 8px',
                            marginRight: 4,
                          }}
                        >
                          {before}
                        </span>
                        <span>{after}</span>
                      </>
                    ) : (
                      <span>{line}</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{ flex: 1, display: 'flex' }} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 22, padding: '0 18px 0 18px' }}>
            <div style={{ width: '100%', height: 2, background: '#5DB8BB', borderRadius: 99 }} />
          </div>
        </div>

        <div />
      </div>
    );
  },
};
