import type { TemplateDefinition } from './types.js';
import { commonSchema } from './schemas.js';
import { clamp, renderHugeTitle } from './shared.js';

export const xhsNoteTemplate: TemplateDefinition = {
  name: 'xhs-note',
  description: '奶油黄小红书 note 卡片',
  defaultWidth: 1080,
  defaultHeight: 1440,
  examplePath: 'examples/xhs-note.json',
  schema: commonSchema,
  render: (input) => {
    const titleLines = renderHugeTitle(input.title, 14);
    const bullets = (input.bullets ?? []).slice(0, 2);
    const footer = input.footer ? clamp(input.footer, 42) : '';
    const icon = input.icon ?? '💻';
    const noteLabel = input.label ?? 'Text Note';
    const isManualTitle = /\r?\n/.test((input.title ?? '').trim());

    return (
      <div style={{ width: '100%', height: '100%', display: 'flex', padding: 56, background: '#F4B138', color: '#111111' }}>
        <div style={{ width: '100%', height: '100%', display: 'flex', position: 'relative' as any }}>
          <div
            style={{
              position: 'absolute' as any,
              top: 12,
              left: 22,
              right: 16,
              bottom: 18,
              borderRadius: 46,
              background: '#EAD7AF',
              transform: 'rotate(3deg)',
              boxShadow: '0 24px 60px rgba(125, 86, 7, 0.12)',
            }}
          />
          <div
            style={{
              position: 'absolute' as any,
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              flexDirection: 'column',
              borderRadius: 46,
              background: '#F3F1EB',
              boxShadow: '0 28px 80px rgba(122, 82, 5, 0.18)',
              padding: '58px 54px 52px 54px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', gap: 12 }}>
                {[0, 1, 2].map((i) => (
                  <div key={i} style={{ width: 10, height: 10, borderRadius: 10, background: '#E0B54B' }} />
                ))}
              </div>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#E0B54B' }}>{noteLabel}</div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', marginTop: 90 }}>
              <div style={{ fontSize: 74, lineHeight: 1, marginBottom: 40 }}>{icon}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: isManualTitle ? 10 : 6, maxWidth: 860 }}>
                {titleLines.map((line, idx) => (
                  <div
                    key={idx}
                    style={{
                      fontSize: isManualTitle ? 74 : 68,
                      fontWeight: 900,
                      letterSpacing: isManualTitle ? -1.8 : -2.2,
                      lineHeight: isManualTitle ? 1.08 : 1.04,
                    }}
                  >
                    {line}
                  </div>
                ))}
              </div>

              {input.subtitle ? (
                <div
                  style={{
                    marginTop: 28,
                    fontSize: 24,
                    lineHeight: 1.42,
                    color: 'rgba(17,17,17,0.62)',
                    maxWidth: 820,
                    fontWeight: 500,
                  }}
                >
                  {clamp(input.subtitle, 84)}
                </div>
              ) : null}

              {bullets.length ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 28 }}>
                  {bullets.map((bullet, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                      <div
                        style={{
                          width: 9,
                          height: 9,
                          borderRadius: 10,
                          background: '#D6A62E',
                          marginTop: 11,
                          flexShrink: 0,
                        }}
                      />
                      <div
                        style={{
                          fontSize: 22,
                          lineHeight: 1.42,
                          color: 'rgba(17,17,17,0.68)',
                          fontWeight: 500,
                          maxWidth: 820,
                        }}
                      >
                        {clamp(bullet, 72)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>

            <div style={{ flex: 1 }} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              {footer ? <div style={{ fontSize: 20, fontWeight: 600, color: 'rgba(17,17,17,0.6)' }}>{footer}</div> : null}
              <div style={{ width: '100%', height: 2, background: '#D9C15A', borderRadius: 99 }} />
            </div>
          </div>
        </div>
      </div>
    );
  },
};
