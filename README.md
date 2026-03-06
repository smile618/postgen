# ximg-cli

一个模板驱动的 **JSON -> PNG** CLI，使用 **Satori (JSX -> SVG)** + **Resvg (SVG -> PNG)**。

定位很简单：
- 输入一个 JSON 文件
- 选择一个模板
- 输出一张 PNG 图片

适合做：
- 小红书卡片
- 标题海报
- 问答卡
- 榜单图
- 摘要图

## 安装

```bash
npm i
npm run build
```

## CLI 风格

保持 fly 目录里其他 CLI 的子命令形式，核心命令为：

```bash
ximg template --action list
ximg template --action show --name xhs-note
ximg render --template xhs-note --data ./examples/xhs-note.json
```

## 使用方法

### 查看模板列表

```bash
ximg template --action list
ximg template --action list --json
```

### 查看某个模板详情

```bash
ximg template --action show --name xhs-note
ximg template --action show --name xhs-note-green
```

### 初始化模板示例 JSON

```bash
ximg template --action init --name xhs-note
ximg template --action init --name xhs-note --out ./note.json
```

### 渲染图片

```bash
ximg render --template xhs-note --data ./examples/xhs-note.json
ximg render --template xhs-note-green --data ./examples/xhs-note-green.json
```

默认会输出到：

```bash
./out/download/xiaohongshu/
```

默认文件名是带时间戳的：

```bash
xhs-note-YYYYMMDD-HHmmss.png
```

如果你想固定文件名，使用：

```bash
ximg render --template xhs-note --data ./examples/xhs-note.json --stable-name
```

### 指定输出路径

```bash
ximg render --template xhs-note --data ./examples/xhs-note.json --out ./out/test.png
```

### 指定字体

```bash
ximg render \
  --template xhs-note \
  --data ./examples/xhs-note.json \
  --font ./fonts/extracted/PingFang-SC-Regular.ttf \
  --fontBold ./fonts/extracted/PingFang-SC-Semibold.ttf
```

## 当前模板

- `cover-01` - 简单封面卡片
- `xhs-note` - 奶油黄 note 卡片
- `xhs-note-green` - 绿色 note 卡片

## 开发建议

后续新增模板时，优先遵循这个约定：
- 一个模板 = 一个注册项
- 模板有自己的 description / default size / example path / schema / render
- CLI 统一通过 `ximg render --template ... --data ...` 调用

## 输出契约

核心契约保持简单：

- 输入：`template + json`
- 输出：`png path`

也就是：

```bash
ximg render --template <template> --data <json-file>
```

stdout 输出最终图片路径，方便脚本调用。
