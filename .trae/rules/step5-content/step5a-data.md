# Step 5a: 结构化数据采集

> 输入：`sop/roblox/runs/<slug>/step4-planning.json`
> 输出：`sop/roblox/runs/<slug>/step5-content/data/`
> 下一步：step5b-media-videos.md

## 前置条件

- Step 4 已完成且新爷已确认
- 读取 `step4-planning.json` 的每个页面的 `assets.data`

## 数据来源优先级

1. Trello 看板（官方一手）→ browser 打开逐卡片提取
2. 官方 Wiki / Fandom（社区维护）→ agent-reach read 或 browser
3. YouTube 教程（实测数据）→ 看视频提取数值
4. Reddit 讨论（需交叉验证）→ agent-reach read 或 browser

## 按页面类型采集

**计算器页**：数值公式 + 参数范围 + 默认值 → `data/<slug>-calculator.json`
**数据库页**：完整属性表 + 分类标签 → `data/<slug>-database.json`
**交互地图页**：地图底图路径 + 标注点坐标 → `data/<slug>-map.json`

每份 JSON 必须有 `source` 和 `lastVerified` 字段。

## 数据验证规则

- 完整性：schema 定义的字段不能缺
- 来源标注：每份 JSON 必须有 source
- 交叉验证：关键数值至少 2 个来源确认
- JSON 合法性：`JSON.parse()` 不报错
- 找不到的字段标 `"unknown"`，不要编造

## 输出

```bash
mkdir -p sop/roblox/runs/<slug>/step5-content/data
```

落盘到 `step5-content/data/` 目录。

## 汇报

```
📦 Step5a 结构化数据采集完成
- 计算器数据：X 份
- 数据库数据：X 份（共 X 条记录）
- 地图数据：X 份
- 缺失字段：X 个（已标 unknown）
```

## 耗时预期
10-20 分钟。数据量大（>100条）可能更久。
