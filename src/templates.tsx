import type { BuiltinTemplate, RenderInput } from './types.js';

const themes = {
  black: { bg: '#0B0F14', fg: '#F3F6FA', accent: '#7DD3FC', muted: 'rgba(243,246,250,0.72)' },
  white: { bg: '#FFFFFF', fg: '#0B0F14', accent: '#2563EB', muted: 'rgba(11,15,20,0.60)' },
  yellow: { bg: '#FFEB3B', fg: '#111827', accent: '#111827', muted: 'rgba(17,24,39,0.70)' },
  mint: { bg: '#D1FAE5', fg: '#064E3B', accent: '#065F46', muted: 'rgba(6,78,59,0.70)' },
} as const;

function clamp(text: string, max = 60) {
  const t = (text ?? '').trim();
  return t.length > max ? t.slice(0, max - 1) + '…' : t;
}

function pickTheme(input: RenderInput) {
  return themes[input.theme ?? 'black'];
}

function renderHugeTitle(text: string, charsPerLine = 9) {
  const clean = (text ?? '').trim();
  if (!clean) return [''];

  const manualLines = clean
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (manualLines.length > 1) {
    return manualLines.slice(0, 6);
  }

  const tokens = clean.split(/\s+/).filter(Boolean);
  if (tokens.length > 1) {
    const lines: string[] = [];
    let current = '';

    for (const token of tokens) {
      const next = current ? `${current} ${token}` : token;
      if (next.length <= charsPerLine || !current) {
        current = next;
      } else {
        lines.push(current);
        current = token;
      }
    }

    if (current) lines.push(current);
    return lines.slice(0, 6);
  }

  const lines: string[] = [];
  for (let i = 0; i < clean.length; i += charsPerLine) {
    lines.push(clean.slice(i, i + charsPerLine));
  }
  return lines.slice(0, 6);
}

export function renderTemplate(template: BuiltinTemplate, input: RenderInput) {
  const theme = pickTheme(input);

  const base: any = {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: 84,
    color: theme.fg,
    fontSize: 48,
    lineHeight: 1.15,
  };

  if (template === 'cover-01') {
    return (
      <div style={{ ...base, background: theme.bg }}>
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
  }

  if (template === 'cover-a') {
    const bg = `
      radial-gradient(1200px 900px at 20% 18%, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.00) 58%),
      radial-gradient(900px 700px at 82% 30%, rgba(125,211,252,0.14) 0%, rgba(125,211,252,0.00) 60%),
      linear-gradient(180deg, rgba(0,0,0,0.00) 58%, rgba(0,0,0,0.16) 100%),
      repeating-linear-gradient(90deg, rgba(255,255,255,0.05) 0px, rgba(255,255,255,0.05) 1px, rgba(255,255,255,0.00) 1px, rgba(255,255,255,0.00) 22px),
      linear-gradient(135deg, ${theme.bg} 0%, ${theme.bg} 65%, rgba(125,211,252,0.10) 100%)
    `;
    return (
      <div style={{ ...base, padding: 92, background: bg }}>
        <div style={{ display: 'flex', flexDirection: 'row', gap: 18, opacity: 1 }}>
          <div style={{ width: 180, height: 180, borderRadius: 180, background: 'rgba(255,255,255,0.10)' }} />
          <div style={{ flex: 1 }} />
          <div style={{ width: 240, height: 64, borderRadius: 999, background: 'rgba(255,255,255,0.08)' }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 12, height: 46, borderRadius: 20, background: theme.accent }} />
            <div style={{ fontSize: 26, fontWeight: 900, letterSpacing: 3, color: theme.muted }}>COVER</div>
          </div>

          <div style={{ fontSize: 96, fontWeight: 950, letterSpacing: -2, lineHeight: 1.02 }}>
            {clamp(input.title, 16)}
          </div>

          {input.subtitle ? (
            <div style={{ fontSize: 36, fontWeight: 650, color: theme.muted, lineHeight: 1.25, maxWidth: 820 }}>
              {clamp(input.subtitle, 56)}
            </div>
          ) : null}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 18 }}>
            {(input.bullets ?? []).slice(0, 2).map((b, i) => (
              <div key={i} style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                <div style={{ width: 10, height: 10, borderRadius: 10, background: theme.accent }} />
                <div style={{ fontSize: 34, fontWeight: 750 }}>{clamp(b, 40)}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 30, fontWeight: 800, color: theme.muted }}>{input.footer ?? ''}</div>
          <div />
        </div>
      </div>
    );
  }

  if (template === 'card-b') {
    const bg = `
      radial-gradient(1000px 700px at 18% 10%, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.00) 60%),
      repeating-linear-gradient(0deg, rgba(255,255,255,0.035) 0px, rgba(255,255,255,0.035) 1px, rgba(255,255,255,0.00) 1px, rgba(255,255,255,0.00) 18px),
      linear-gradient(180deg, ${theme.bg} 0%, rgba(255,255,255,0.34) 100%),
      linear-gradient(180deg, rgba(0,0,0,0) 70%, rgba(0,0,0,0.10) 100%)
    `;
    const bullets = (input.bullets ?? []).slice(0, 4);
    return (
      <div style={{ ...base, padding: 96, background: bg }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div style={{ fontSize: 28, fontWeight: 950, letterSpacing: 2, color: theme.muted }}>KNOWLEDGE CARD</div>
          <div style={{ fontSize: 74, fontWeight: 950, letterSpacing: -1 }}>{clamp(input.title, 22)}</div>
          {input.subtitle ? (
            <div style={{ fontSize: 34, fontWeight: 650, color: theme.muted, lineHeight: 1.28 }}>{clamp(input.subtitle, 60)}</div>
          ) : null}
        </div>

        <div
          style={{
            marginTop: 44,
            padding: 44,
            borderRadius: 36,
            background: 'rgba(255,255,255,0.66)',
            border: '1px solid rgba(255,255,255,0.22)',
            boxShadow: '0 28px 90px rgba(0,0,0,0.14)',
            display: 'flex',
            flexDirection: 'column',
            gap: 22,
          }}
        >
          {bullets.map((b, idx) => (
            <div key={idx} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
              <div style={{ width: 14, height: 14, borderRadius: 14, background: theme.accent, marginTop: 12 }} />
              <div style={{ fontSize: 38, fontWeight: 700, lineHeight: 1.3, color: theme.fg }}>{clamp(b, 52)}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 30, fontWeight: 800, color: theme.muted }}>{input.footer ?? ''}</div>
          <div />
        </div>
      </div>
    );
  }

  if (template === 'poster-c') {
    const bg = `linear-gradient(135deg, #111827 0%, #0B0F14 55%, rgba(255,235,59,0.22) 100%)`;
    const bullets = (input.bullets ?? []).slice(0, 5);
    return (
      <div style={{ ...base, padding: 80, background: bg }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
          <div style={{ fontSize: 28, fontWeight: 900, letterSpacing: 3, color: 'rgba(243,246,250,0.70)' }}>POSTER</div>

          <div style={{ display: 'flex', gap: 22, alignItems: 'flex-end' }}>
            <div style={{ fontSize: 140, fontWeight: 950, letterSpacing: -4, color: '#FFEB3B', lineHeight: 0.9 }}>01</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ fontSize: 72, fontWeight: 950, letterSpacing: -1, color: '#F3F6FA' }}>{clamp(input.title, 18)}</div>
              {input.subtitle ? (
                <div style={{ fontSize: 32, fontWeight: 650, color: 'rgba(243,246,250,0.72)' }}>{clamp(input.subtitle, 58)}</div>
              ) : null}
            </div>
          </div>

          <div
            style={{
              marginTop: 30,
              padding: 38,
              borderRadius: 34,
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.14)',
              display: 'flex',
              flexDirection: 'column',
              gap: 18,
            }}
          >
            {bullets.map((b, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', gap: 16 }}>
                <div style={{ fontSize: 34, fontWeight: 750, color: '#F3F6FA', lineHeight: 1.22 }}>{clamp(b, 44)}</div>
                <div style={{ fontSize: 28, fontWeight: 950, color: 'rgba(255,235,59,0.92)' }}>{String(idx + 1).padStart(2, '0')}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 28, fontWeight: 850, color: 'rgba(243,246,250,0.68)' }}>{input.footer ?? ''}</div>
          <div />
        </div>
      </div>
    );
  }

  if (template === 'xhs-note') {
    const titleLines = renderHugeTitle(input.title, 14);
    const bullets = (input.bullets ?? []).slice(0, 2);
    const footer = input.footer ? clamp(input.footer, 42) : '';
    const icon = input.icon ?? '💻';
    const noteLabel = input.label ?? 'Text Note';
    const isManualTitle = /\r?\n/.test((input.title ?? '').trim());

    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          padding: 56,
          background: '#F4B138',
          color: '#111111',
        }}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            position: 'relative' as any,
          }}
        >
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
              {footer ? (
                <div style={{ fontSize: 20, fontWeight: 600, color: 'rgba(17,17,17,0.6)' }}>{footer}</div>
              ) : null}
              <div style={{ width: '100%', height: 2, background: '#D9C15A', borderRadius: 99 }} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (template === 'xhs-note-green') {
    const titleLines = renderHugeTitle(input.title, 10);
    const noteLabel = input.label ?? 'Text Note';
    const weekday = input.day ?? 'Wednesday';
    const serial = input.serial ?? '';

    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          padding: 54,
          background: '#2EBA77',
          color: '#000000',
        }}
      >
        <div style={{ display: 'flex', width: '100%', height: '100%' }}>
          <div style={{ flex: 1, display: 'flex' }}>
            <div
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'stretch',
              }}
            >
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
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 760 }}>
                    {titleLines.map((line, idx) => {
                      const trimmed = line.trim();
                      const isHighlight = idx === titleLines.length - 1;
                      return (
                        <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                          <div
                            style={{
                              display: 'flex',
                              fontSize: 76,
                              fontWeight: 900,
                              letterSpacing: -2.2,
                              lineHeight: 1.06,
                            }}
                          >
                            {trimmed}
                          </div>
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

        {serial ? (
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                color: 'rgba(255,255,255,0.82)',
                fontSize: 15,
                fontWeight: 500,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 999,
                  background: 'rgba(255,255,255,0.82)',
                  color: '#1F9E67',
                  padding: '4px 10px',
                  fontSize: 14,
                  fontWeight: 800,
                }}
              >
                小红书
              </div>
              <div style={{ display: 'flex' }}>小红书号：{serial}</div>
            </div>
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div style={{ ...base, background: theme.bg }}>
      <div style={{ fontSize: 64, fontWeight: 900 }}>Unknown template: {template}</div>
    </div>
  );
}
