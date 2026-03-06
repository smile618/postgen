import type { TemplateDefinition } from './types.js';
import { commonSchema } from './schemas.js';
import { clamp } from './shared.js';

export const xhsQuoteBlueTemplate: TemplateDefinition = {
  name: 'xhs-quote-blue',
  description: '浅蓝极简引用风小红书卡片',
  defaultWidth: 1080,
  defaultHeight: 1440,
  examplePath: 'examples/xhs-quote-blue.json',
  schema: commonSchema,
  render: (input) => {
    const lines = (input.title ?? '')
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean)
      .slice(0, 4);
    const titleLines = lines.length ? lines : [input.title ?? ''];
    const footer = input.footer ? clamp(input.footer, 44) : '';
    const label = input.label ?? 'weixiao';

    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          background: '#D7EAF4',
          color: '#2E3138',
          position: 'relative' as any,
        }}
      >
        <div
          style={{
            position: 'absolute' as any,
            left: 110,
            top: 100,
            display: 'flex',
            fontSize: 152,
            lineHeight: 0.9,
            fontWeight: 900,
            letterSpacing: -4,
            color: '#B6D5E6',
            opacity: 0.95,
          }}
        >
          “
        </div>

        <div
          style={{
            position: 'absolute' as any,
            left: 118,
            top: 408,
            width: 820,
            display: 'flex',
            flexDirection: 'column',
            gap: 52,
          }}
        >
          {titleLines.map((line, idx) => {
            const isLast = idx === titleLines.length - 1;
            return (
              <div key={idx} style={{ display: 'flex', position: 'relative' as any, alignItems: 'flex-end' }}>
                {isLast ? (
                  <div
                    style={{
                      position: 'absolute' as any,
                      left: 2,
                      bottom: 14,
                      width: 266,
                      height: 52,
                      background: '#EDB1E5',
                    }}
                  />
                ) : null}
                <div
                  style={{
                    display: 'flex',
                    position: 'relative' as any,
                    fontSize: 112,
                    lineHeight: 0.98,
                    letterSpacing: -6,
                    fontWeight: 900,
                    color: '#32353B',
                  }}
                >
                  {line}
                </div>
              </div>
            );
          })}
        </div>

        <div
          style={{
            position: 'absolute' as any,
            right: 78,
            bottom: 72,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            gap: 18,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            <div
              style={{
                display: 'flex',
                width: 74,
                height: 12,
                background: '#A7D2E7',
                borderRadius: 1,
              }}
            />
            <div
              style={{
                display: 'flex',
                padding: '6px 14px',
                borderRadius: 999,
                background: 'rgba(255,255,255,0.36)',
                color: 'rgba(255,255,255,0.75)',
                fontSize: 12,
                lineHeight: 1,
                fontWeight: 700,
                letterSpacing: 0.2,
              }}
            >
              小红书
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              fontSize: 18,
              lineHeight: 1.1,
              color: 'rgba(255,255,255,0.5)',
              textShadow: '0 1px 2px rgba(0,0,0,0.08)',
              fontWeight: 500,
            }}
          >
            {footer || `小红书号：${label}`}
          </div>
        </div>
      </div>
    );
  },
};
