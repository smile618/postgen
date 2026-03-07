import type { TemplateDefinition } from './types.js';
import { commonSchema } from './schemas.js';

const xhsNoteThemes = {
  cream: {
    canvasBg: '#F4B138',
    backCardBg: '#EAD7AF',
    frontCardBg: '#F3F1EB',
    accent: '#E0B54B',
    titleColor: '#111111',
    subtitleColor: 'rgba(17,17,17,0.62)',
    bulletColor: '#D6A62E',
    dividerColor: '#D9C15A',
    topDotsMarginLeft: 24,
    iconMarginLeft: 18,
    titleMarginLeft: 14,
  },
  blue: {
    canvasBg: '#169AED',
    backCardBg: 'rgba(230, 242, 250, 0.72)',
    frontCardBg: '#EEF1F3',
    accent: '#2A9FE8',
    titleColor: '#000000',
    subtitleColor: 'rgba(17,17,17,0.60)',
    bulletColor: '#2A9FE8',
    dividerColor: '#5DB8BB',
    topDotsMarginLeft: 24,
    iconMarginLeft: 18,
    titleMarginLeft: 14,
  },
} as const;

export const xhsNoteTemplate: TemplateDefinition = {
  name: 'xhs-note',
  description: '小红书 Text Note 卡片（支持不同配色）',
  defaultWidth: 1080,
  defaultHeight: 1440,
  examplePath: 'examples/xhs-note.json',
  schema: commonSchema,
  render: (input) => {
    const lines = (input.title ?? '')
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean)
      .slice(0, 5);
    const titleLines = lines.length ? lines : [input.title ?? ''];
    const noteLabel = input.label ?? 'Text Note';
    const icon = input.icon ?? '💻';
    const subtitle = input.subtitle?.trim();
    const bullets = (input.bullets ?? []).slice(0, 2);
    const variant = input.theme === 'blue' ? 'blue' : 'cream';
    const theme = xhsNoteThemes[variant];

    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          background: theme.canvasBg,
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
              background: theme.backCardBg,
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
            background: theme.frontCardBg,
            boxShadow: '0 24px 72px rgba(0,0,0,0.16)',
            padding: '70px 54px 46px 54px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', gap: 12, marginLeft: theme.topDotsMarginLeft }}>
              {[0, 1, 2].map((i) => (
                <div key={i} style={{ width: 10, height: 10, borderRadius: 99, background: theme.accent }} />
              ))}
            </div>
            <div style={{ fontSize: 24, fontWeight: 800, color: theme.accent, letterSpacing: -0.5, marginRight: 20 }}>{noteLabel}</div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', marginTop: 118 }}>
            <div style={{ fontSize: 92, lineHeight: 1, marginLeft: theme.iconMarginLeft, marginBottom: 34 }}>{icon}</div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 24, marginLeft: theme.titleMarginLeft, maxWidth: 760 }}>
              {titleLines.map((line, idx) => {
                const highlight = idx === 0 ? Math.min(2, Math.max(1, Math.floor(line.length / 2))) : 0;
                const before = highlight ? line.slice(0, highlight) : line;
                const after = highlight ? line.slice(highlight) : '';
                const highlightBg = variant === 'blue' ? '#F0DE54' : '#E9D44B';

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
                      color: theme.titleColor,
                    }}
                  >
                    {idx === 0 && highlight ? (
                      <>
                        <span
                          style={{
                            background: highlightBg,
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

            {subtitle ? (
              <div
                style={{
                  display: 'flex',
                  marginTop: 28,
                  marginLeft: theme.titleMarginLeft,
                  maxWidth: 760,
                  fontSize: 24,
                  lineHeight: 1.48,
                  color: theme.subtitleColor,
                  fontWeight: 500,
                }}
              >
                {subtitle}
              </div>
            ) : null}

            {bullets.length ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 18, marginTop: 28, marginLeft: theme.titleMarginLeft, maxWidth: 760 }}>
                {bullets.map((bullet, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                    <div
                      style={{
                        display: 'flex',
                        width: 9,
                        height: 9,
                        borderRadius: 99,
                        background: theme.bulletColor,
                        marginTop: 11,
                        flexShrink: 0,
                      }}
                    />
                    <div
                      style={{
                        display: 'flex',
                        fontSize: 22,
                        lineHeight: 1.45,
                        color: theme.subtitleColor,
                        fontWeight: 500,
                      }}
                    >
                      {bullet}
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
          </div>

          <div style={{ flex: 1, display: 'flex' }} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 22, padding: '0 18px 0 18px' }}>
            <div style={{ width: '100%', height: 2, background: theme.dividerColor, borderRadius: 99 }} />
          </div>
        </div>
      </div>
    );
  },
};
