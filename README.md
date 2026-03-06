# postgen

一个模板驱动的 **JSON -> PNG** CLI。

它的目标不是做一个“万能设计工具”，而是把这件事收敛成一个稳定契约：

- 输入：一个 JSON 文件
- 选择：一个模板
- 输出：一张 PNG 图片路径

适合做：
- 小红书卡片
- 标题海报
- 问答卡
- 榜单图
- 摘要图

## 快速开始

```bash
npm i
npm run build
npm link
```

查看模板：

```bash
postgen template --action list
```

导出模板示例：

```bash
postgen template --action init --name xhs-note --out ./note.json
# 或：
postgen template --action init --name xhs-quote-blue --out ./quote.json
```

渲染图片：

```bash
postgen render --template xhs-note --data ./note.json
# 或：
postgen render --template xhs-quote-blue --data ./quote.json
```

## 默认输出目录

如果不传 `--out`，默认输出到：

```bash
./out/download/xiaohongshu/
```

## 文档

渐进式文档放在 `docs/`：

- `docs/README.md`
- `docs/getting-started.md`
- `docs/cli.md`
- `docs/templates.md`
- `docs/development.md`

## 当前模板

- `cover-01`
- `xhs-note`
- `xhs-note-green`
- `xhs-quote-blue`
