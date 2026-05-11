# Step 7b: 支柱模型验证 + 截图验收

> 输入：Step 7a 修复后的代码
> 输出：验收报告 + 最终 commit
> 下一步：Step 8（`~/.openclaw/skills/sitebuilder-step8-deploy/SKILL.md`）

## 前置条件

- Step 7a 已完成，AI 味 P0 清零，SEO 评分达标

## 支柱模型验证

### 关键词分配审计

从 step2-keywords.json 和 step4-planning.json 建立映射：`页面 URL → Primary Keyword → Parent Pillar`

检查：
- 首页只锁 1 个核心词
- 没有两个页面打同一个 Primary Keyword
- 所有 cluster 页 Related Links 第一位是父 hub
- 没有孤儿页（没有任何页面链接到它）
- 权重流向：cluster → hub → 首页

```bash
# 孤儿页检查
for route in $(find src/app -name "page.tsx" -exec dirname {} \; | sed 's|src/app||'); do
  ref_count=$(grep -rn "href=\"$route\"" src/app/ --include="*.tsx" | wc -l)
  [ "$ref_count" -eq 0 ] && echo "ORPHAN: $route"
done
```

### 内链密度

- 首页：链接到所有 hub 页
- Hub 页：链接到所有子 cluster + 首页
- Cluster 页：≥3 个（父 hub + 同级 pillar + 首页）

## 截图验页

新爷手动跑 `npm run dev`，然后用 browser 逐页截图。

每页检查：
- Hero section：标题清晰、图片加载、无布局错位
- 主要内容：工具能交互、文字可读
- 图片：全部加载，无 broken image
- YouTube：iframe 显示正常
- FAQ：折叠/展开正常
- Related Links：链接存在可点击
- 移动端：375px 宽度再截一次

### 交互功能验证（工具页）

- 计算器：输入数字 → 结果实时更新 + 边界值测试
- 数据库：搜索 → 过滤 + 分类筛选正确
- 交互地图：底图加载 + 标注点可点击

## 复验清单

全部通过才能进 Step 8：
- [ ] humanizer P0 清零
- [ ] On-Page SEO 每页 ≥70，平均 ≥85
- [ ] 无关键词蚕食、无孤儿页
- [ ] 权重流向正确
- [ ] 截图验页通过（桌面+移动端+交互）
- [ ] `npm run build` 零错误

## 汇报

```
🔍 <游戏名> Step7 质量验证完成

支柱模型：✅ 无蚕食 / ✅ 无孤儿页 / ✅ 权重流向正确
截图验页：✅ 桌面 X/X 页 / ✅ 移动端 X/X 页 / ✅ 交互 X/X 工具页

修复提交：<commit hash>
请确认是否进入 Step 8 部署？
```

## 耗时预期
15-25 分钟。

> ⚠️ 铁律：Step 7 没过（支柱模型 / humanizer / On-Page SEO / 截图验收），不准进 Step 8。
