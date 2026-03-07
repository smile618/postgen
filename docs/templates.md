# Templates

## 当前模板

- `xhs-note`：主 Text Note 模板，支持 `cream` / `blue` 配色
- `xhs-note-green`：绿色 note 卡片
- `xhs-quote-blue`：浅蓝极简引用风卡片

## 设计原则

每个模板都应该具备：
- 明确的名字
- 简短描述
- 默认尺寸
- 示例 JSON
- 独立 schema
- 独立 render 函数

## 当前结构

```txt
src/templates/
  xhs-note.tsx
  xhs-note-green.tsx
  xhs-quote-blue.tsx
  registry.tsx
  schemas.ts
  shared.tsx
  types.ts
```

## 推荐扩展方式

新增模板时，至少要补这几处：

1. 新建模板文件
2. 注册到 `registry.tsx`
3. 提供 example JSON
4. 确认 schema 能校验输入

## 后续建议

如果模板继续增多，可以进一步升级成：
- 一个模板一个目录
- `index.tsx`
- `schema.ts`
- `meta.ts`
