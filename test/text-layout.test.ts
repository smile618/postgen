import { describe, expect, it } from 'vitest';
import { layoutTitle, splitTitleSmart, tokenizeMixedText } from '../src/templates/text-layout.js';

describe('tokenizeMixedText', () => {
  it('keeps english word and emoji as whole tokens', () => {
    expect(tokenizeMixedText('当我给openclaw🦞接入了特斯拉数据后')).toEqual([
      '当',
      '我',
      '给',
      'openclaw',
      '🦞',
      '接',
      '入',
      '了',
      '特',
      '斯',
      '拉',
      '数',
      '据',
      '后',
    ]);
  });
});

describe('layoutTitle', () => {
  it('returns deterministic line layout for current mixed-language case', () => {
    expect(
      layoutTitle('当我给openclaw 🦞接入了特斯拉数据后', {
        maxCharsPerLine: 9,
        maxLines: 5,
        targetLines: 3,
        keepWords: true,
      }).lines
    ).toEqual(['当我给openclaw', '🦞接入了特斯拉', '数据后']);
  });

  it('prefers fuller lines and avoids tiny tail lines for quote-like layout', () => {
    expect(
      layoutTitle('当我给openclaw 🦞接入了特斯拉数据后', {
        maxCharsPerLine: 12,
        minCharsPerLine: 7,
        maxLines: 4,
        targetLines: 2,
        keepWords: true,
      }).lines
    ).toEqual(['当我给openclaw', '🦞接入了特斯拉数据后']);
  });

  it('keeps manual line breaks stable', () => {
    expect(
      layoutTitle('停止追求\n信息密度\n开始追求\n记忆点', {
        maxCharsPerLine: 10,
        maxLines: 5,
        keepWords: true,
      }).lines
    ).toEqual(['停止追求', '信息密度', '开始追求', '记忆点']);
  });

  it('keeps punctuation attached to previous phrase when wrapping', () => {
    expect(
      layoutTitle('做内容最省力的方法，就是先写结论再补证据。', {
        maxCharsPerLine: 10,
        maxLines: 6,
        keepWords: true,
      }).lines
    ).toEqual(['做内容最省力的方法，', '就是先写结论再补证据。']);
  });

  it('matches splitTitleSmart convenience wrapper', () => {
    expect(splitTitleSmart('当我给openclaw 🦞接入了特斯拉数据后', 9, 5)).toEqual(
      layoutTitle('当我给openclaw 🦞接入了特斯拉数据后', {
        maxCharsPerLine: 9,
        maxLines: 5,
        keepWords: true,
      }).lines
    );
  });
});
