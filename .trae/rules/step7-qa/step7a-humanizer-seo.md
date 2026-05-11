# Step 7a: 去 AI 味 + On-Page SEO 审计

> 输入：Step 6 构建完成的站点代码
> 输出：审计报告 + 修复后的代码
> 下一步：step7b-pillar-screenshots.md

## 前置条件

- Step 6 已完成，`npm run build` 零错误

## 去 AI 味（调用 humanizer skill）

读取 `~/.openclaw/skills/humanizer/SKILL.md`，按其规则审计。

### P0 黑名单词扫描（两轮）

第一轮（完整模式匹配）：
```bash
grep -rni "not just.*but\|showcasing\|ensures\|vital\|Why .* matters\|delve\|tapestry\|landscape\|unleash\|elevate\|empower\|not one blob\|This is where you find\|Whether you're\|designed to\|everything you need" src/app/ --include="*.tsx"
```

第二轮（高频词）：
```bash
grep -rni "not just\|journey\|realm\|dive into\|comprehensive\|robust\|seamless\|leverage\|cutting-edge\|game-changer\|revolutionize\|streamline" src/app/ --include="*.tsx"
```

### 句式模式检查

- 否定平行结构：`not just X, but Y` → 直接说 Y
- em dash 过多：一段超 2 个 → 换逗号/句号
- Rule of Three：连续 3 次 `X, Y, and Z` → 打散
- 膨胀象征/虚假归因/过量抒情 → 说人话

修复标准：P0（必须修）→ P1（应该修）→ P2（建议修）。P0 必须清零。

## On-Page SEO 评分

逐页检查：

| 检查项 | 标准 | 权重 |
|--------|------|------|
| seoTitle 长度 | 50-60 字符 | 🔴 必须 |
| seoTitle 含关键词 | primaryKeyword 在 title 中 | 🔴 必须 |
| seoDescription 长度 | 150-160 字符 | 🔴 必须 |
| H1 唯一性 | 每页只有 1 个 H1 | 🔴 必须 |
| canonical URL | 存在且正确 | 🔴 必须 |
| 图片 alt 属性 | 每张图都有 | 🟡 重要 |
| 内链数量 | 每页 ≥3 个 | 🟡 重要 |
| 外链数量 | 每页 ≥2 个权威外链 | 🟡 重要 |
| FAQ + JSON-LD | 存在 | 🟡 重要 |
| YouTube 嵌入 | ≥1 个 | 🟡 重要 |

批量审计脚本：
```bash
# H1 唯一性
for f in $(find src/app -name "page.tsx"); do
  h1_count=$(grep -c "<h1\|<H1" "$f")
  [ "$h1_count" -gt 1 ] && echo "MULTIPLE H1: $f"
  [ "$h1_count" -eq 0 ] && echo "MISSING H1: $f"
done

# 图片 alt 缺失
grep -rn "<Image\|<img" src/app/ --include="*.tsx" | grep -v "alt="
```

评分：每页 ≥70 分，全站平均 ≥85 分。

## 修复

按 P0 → P1 → P2 修复，修完重新跑扫描确认 P0 清零。

## 汇报

```
🔍 Step7a 去AI味+SEO审计完成
- AI味 P0：X 处 → 已全部修复 ✅
- On-Page SEO 全站平均：X/100
- 最低分页面：<URL>（X分）→ 已修复到 X 分
```

## 耗时预期
15-25 分钟。
