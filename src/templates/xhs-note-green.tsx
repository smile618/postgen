import type { TemplateDefinition } from './types.js';
import { commonSchema } from './schemas.js';
import { layoutTitle } from './text-layout.js';

export const xhsNoteGreenTemplate: TemplateDefinition = {
  name: 'xhs-note-green',
  description: '绿色小红书 note 卡片',
  defaultWidth: 1080,
  defaultHeight: 1440,
  examplePath: 'examples/xhs-note-green.json',
  schema: commonSchema,
  render: (input) => {
    const rawTitle = (input.title ?? '').trim();
    const titleLayout = layoutTitle(rawTitle, {
      maxCharsPerLine: 11,
      maxLines: 4,
      targetLines: 2,
      keepWords: true,
    });
    const titleLines = titleLayout.lines;

    const noteLabel = input.label ?? 'Text Note';
    const weekday = input.day ?? 'Wednesday';

    return (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', padding: 54, background: '#2EBA77', color: '#000000' }}>
        <div style={{ display: 'flex', width: '100%', height: '100%' }}>
          <div style={{ flex: 1, display: 'flex' }}>
            <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'row', alignItems: 'stretch' }}>
              <div
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 48,
                  background: '#F1F1F1',
                  border: '4px solid #2D6E54',
                  boxShadow: '12px 14px 0 #008B48',
                  padding: '76px 76px 56px 76px',
                }}
              >
                <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 22, maxWidth: 760 }}>
                    {titleLines.map((line, idx) => {
                      const trimmed = line.trim();
                      const isHighlight = idx === titleLines.length - 1;
                      return (
                        <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                          <div style={{ display: 'flex', fontSize: 76, fontWeight: 900, letterSpacing: -2.2, lineHeight: 1.14, whiteSpace: 'nowrap', flexWrap: 'nowrap', maxWidth: '100%' }}>{trimmed}</div>
                          {isHighlight ? (
                            <div
                              style={{
                                display: 'flex',
                                width: 330,
                                height: 14,
                                marginTop: -8,
                                marginLeft: 2,
                                background: '#F4A0D2',
                                borderRadius: 2,
                              }}
                            />
                          ) : null}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  <div style={{ width: '100%', height: 2, background: '#4A8D71' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', fontSize: 24, fontWeight: 800, color: '#118455' }}>{weekday}</div>
                    <div style={{ display: 'flex', fontSize: 24, fontWeight: 800, color: '#118455' }}>{noteLabel}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    );
  },
};
