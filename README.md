# postgen

`postgen` 是一个模板驱动的 **JSON -> PNG** CLI，目标不是做通用设计工具，而是稳定产出适合小红书风格的文字图片。

它把流程收敛成一个简单契约：

- 输入：一个 JSON 文件
- 选择：一个模板
- 输出：一张 PNG 图片

适合做：

- 小红书风格文字卡片
- 结论卡 / 引用卡 / Note 卡
- 标题海报
- 问答卡
- 榜单图
- 摘要图

## Showcase

当前模板输出效果示例：

### xhs-note

![xhs-note showcase](./website/shots/xhs-note.png)

### xhs-note-green

![xhs-note-green showcase](./website/shots/xhs-note-green.png)

### xhs-quote-blue

![xhs-quote-blue showcase](./website/shots/xhs-quote-blue.png)

### xhs-note / blue

![xhs-note blue showcase](./website/shots/xhs-note-blue.png)

### apple-notes-handwrite

![apple-notes-handwrite showcase](./website/shots/apple-notes-handwrite.png)

更多用于 README / 展示页的素材与示例数据放在：

- `website/shots/`
- `website/data/`
- `website/index.html`

## Features

- 模板驱动渲染：同一份 JSON 可以稳定生成同风格 PNG
- 内置标题排版引擎：自动控制字号、行数、行宽与节奏
- 支持多模板批量渲染
- 支持 fixture 批量渲染，方便做视觉回归测试
- 支持 `rule` / `llm` 两种标题拆分模式
- `llm` 模式不是直接信模型，而是：
  - 让 LLM 返回多个候选断行
  - 本地做宽度 / 高度利用率 / 模板偏好评分
  - 不合格结果自动回退到 rule layout
- LLM 配置走本地 config store，不依赖把 key 写进代码里

## Install

```bash
pnpm install
pnpm build
npm link
```

开发态也可以直接跑：

```bash
pnpm tsx src/cli.ts template --action list
```

如果你只想本地测试，不需要 `npm link`，直接用 `pnpm tsx src/cli.ts ...` 或 `node dist/cli.js ...` 即可。

## Quick Start

查看模板：

```bash
postgen template --action list
```

导出模板示例：

```bash
postgen template --action init --name xhs-note --out ./note.json
postgen template --action init --name xhs-quote-blue --out ./quote.json
```

渲染图片：

```bash
postgen render --template xhs-note --data ./note.json
postgen render --template xhs-quote-blue --data ./quote.json
```

指定输出路径：

```bash
postgen render --template xhs-note --data ./note.json --out ./result.png
```

## Fonts

如果不传字体，`postgen` 会优先尝试这些系统字体：

- `/System/Library/Fonts/PingFang.ttc`
- `/System/Library/Fonts/Supplemental/PingFang.ttc`
- `/System/Library/Fonts/Supplemental/Arial Unicode.ttf`

也可以显式指定：

```bash
postgen render \
  --template xhs-note \
  --data ./note.json \
  --font ./fonts/PingFang-SC-Regular.ttf \
  --fontBold ./fonts/PingFang-SC-Semibold.ttf
```

## Default Output Directory

如果不传 `--out`，默认输出到 config store 中记录的 `output.imageDir`。

首次默认值通常是当前工作目录下的：

```bash
./out/
```

查看当前输出目录：

```bash
postgen config get output.imageDir
```

修改输出目录：

```bash
postgen config set output.imageDir /path/to/output
```

查看全部配置：

```bash
postgen config list
```

## Title Layout Modes

当前标题排版支持两种模式：

### 1) `rule`（默认）

完全使用本地规则引擎做标题拆分与字号选择。

特点：

- 稳定
- 可预测
- 不依赖外部 LLM
- 适合批量生成与回归测试

### 2) `llm`

先调用 LLM 给出多个语义断行候选，再由本地做渲染约束筛选。

特点：

- 对长标题、语义边界复杂标题更灵活
- 不直接信模型，而是本地二次评分
- 不合格候选会自动回退到 `rule`

当前 `llm` 模式会关注：

- 行数是否过少
- 行宽是否过满
- 标题区域高度是否被浪费
- 模板特定偏好（例如 `xhs-note-green` 长标题更偏 3-4 行）

使用方式：

```bash
postgen render --template xhs-note --data ./note.json --title-layout-mode llm
```

批量：

```bash
postgen render-many --data ./note.json --title-layout-mode llm
postgen render-fixtures --title-layout-mode llm
```

## LLM Configuration

`llm` 模式的配置走本地 config store，不要求把 key 写进仓库文件里。

设置：

```bash
postgen config set llm.apiKey <your-key>
postgen config set llm.baseUrl <https://your-openai-compatible-base-url>
postgen config set llm.model <model-name>
postgen config set llm.timeoutMs 12000
```

查看：

```bash
postgen config list
```

单项读取：

```bash
postgen config get llm.baseUrl
postgen config get llm.model
```

重置：

```bash
postgen config reset llm.apiKey
postgen config reset llm.baseUrl
postgen config reset llm.model
postgen config reset llm.timeoutMs
```

说明：

- `llm.apiKey` / `llm.baseUrl` / `llm.model` 缺任何一个，`llm` 模式就会自动退回 `rule`
- `llm.timeoutMs` 默认是 `12000`
- 当前使用的是 OpenAI-compatible `/chat/completions` 接口

## CLI Overview

### 模板相关

查看模板：

```bash
postgen template --action list
```

查看模板详情：

```bash
postgen template --action show --name xhs-note
```

导出模板示例数据：

```bash
postgen template --action init --name xhs-note --out ./note.json
```

### 单张渲染

```bash
postgen render \
  --template xhs-note \
  --data ./note.json \
  --font ./fonts/PingFang-SC-Regular.ttf \
  --fontBold ./fonts/PingFang-SC-Semibold.ttf
```

常用参数：

- `--template`
- `--data`
- `--out`
- `--stable-name`
- `--width`
- `--height`
- `--font`
- `--fontBold`
- `--title-layout-mode rule|llm`

### 批量渲染多模板

使用同一份 JSON，一次产出多张图：

```bash
postgen render-many \
  --data ./note.json \
  --targets xhs-note:cream,xhs-note:blue,xhs-note-green,xhs-quote-blue
```

常用参数：

- `--data`
- `--targets`
- `--dir`
- `--label`
- `--font`
- `--fontBold`
- `--title-layout-mode rule|llm`

### 批量渲染 fixtures

把内置标题样本全部渲染出来，适合：

- 调整标题排版后做回归检查
- 对比 `rule` vs `llm`
- 生成用于挑图 / 对照 / README 的素材

```bash
postgen render-fixtures \
  --templates xhs-note,xhs-note-green,xhs-quote-blue \
  --dir ./fixture-output \
  --title-layout-mode llm \
  --font ./fonts/PingFang-SC-Regular.ttf \
  --fontBold ./fonts/PingFang-SC-Semibold.ttf
```

输出目录结构类似：

```bash
fixture-output/
  xhs-note/
  xhs-note-green/
  xhs-quote-blue/
```

### 调试标题布局

查看当前 rule solver 的候选结果：

```bash
postgen debug-title --template xhs-note --title "好的标题排版不是让每一行都一样长而是形成自然节奏"
```

或读取 JSON 输入：

```bash
postgen debug-title --template xhs-note --data ./note.json
```

## Current Templates

- `xhs-note`
  - 主 Text Note 模板
  - 当前支持 `cream` / `blue` 配色
- `xhs-note-green`
  - 绿色小红书 note 卡片
  - 标题区更适合中长标题与多行布局
- `xhs-quote-blue`
  - 浅蓝极简引用风卡片
  - 适合结论句、观点句、短引用

## Example JSON

一个典型输入大概长这样：

```json
{
  "title": "好的标题排版不是让每一行都一样长，而是形成自然节奏",
  "subtitle": "让信息更容易被记住，而不是只是塞满",
  "bullets": [
    "先让标题可读，再追求信息密度",
    "视觉节奏和语义边界要一起考虑"
  ],
  "theme": "cream",
  "icon": "💡",
  "label": "Text Note"
}
```

不同模板会消费不同字段，但 `title` 是核心字段。

## Development Notes

当前标题链路大致是：

1. 读取 JSON 输入
2. 根据模板生成标题布局 profile
3. `rule` 模式：直接本地排版
4. `llm` 模式：
   - 请求 LLM 返回多个断行候选
   - 本地按宽度 / 高度利用率 / 模板偏好评分
   - 选最优候选
   - 不合格则回退到 rule
5. 生成 React element
6. 用 `satori` 转 SVG
7. 用 `resvg` 转 PNG

### Why not trust LLM directly?

因为语义断行和视觉排版不是一回事。

LLM 很擅长：

- 找自然语义边界
- 识别短语不要拆开
- 处理中英混排时做更“像人”的分段

但它不天然知道：

- 当前模板的标题区域到底有多宽多高
- 哪种行数在这个模板里更好看
- 哪种结果会导致横向过满、纵向浪费或视觉失衡

所以当前实现刻意用了“LLM 给候选，本地做约束和回退”的模式。

## Docs

渐进式文档放在 `docs/`：

- `docs/README.md`
- `docs/getting-started.md`
- `docs/cli.md`
- `docs/templates.md`
- `docs/development.md`
