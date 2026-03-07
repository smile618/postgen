import type { TemplateDefinition } from './types.js';
import { commonSchema } from './schemas.js';

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

      </div>
    );
  },
};
