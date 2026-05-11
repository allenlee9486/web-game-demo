# Step 8b: GSC 提交 + 线上验收

> 输入：Step 8a 部署完成的线上站点
> 输出：GSC 已提交 + GA4 已验证 + 线上截图
> 完成：建站 SOP 全流程结束

## 前置条件

- Step 8a 已完成，站点线上可访问

## GSC 提交

1. Google Search Console 添加资源（DNS TXT 验证）
2. 提交 sitemap：`sitemap.xml`
3. 核心页面手动请求索引（首页 → 工具页 → Hub 页 → Cluster 页）

```bash
curl -sL https://<domain>/sitemap.xml | head -30  # 验证可访问
curl -sL https://<domain>/robots.txt              # 验证正确
```

## 线上验收

### 页面可访问性

```bash
for path in "/" "/codes" "/calculator" "/npcs"; do
  status=$(curl -sL -o /dev/null -w "%{http_code}" "https://<domain>$path")
  echo "$path → $status"
done
```

所有页面必须 200。

### 关键内容验证

```bash
curl -sL https://<domain>/<path> | grep -o "<title>[^<]*</title>"
curl -sL https://<domain>/<path> | grep -o 'rel="canonical"[^>]*'
```

### GA4 验证

用 browser 访问站点，确认 GA4 实时报告能看到访问。

### 移动端友好性

```
browser 打开 https://search.google.com/test/mobile-friendly?url=https://<domain>
```

### PageSpeed

```
browser 打开 https://pagespeed.web.dev/analysis?url=https://<domain>
```

目标：Performance ≥80 / Accessibility ≥90 / SEO ≥90

### 线上截图

用 browser 对每个核心页面截图，保存到 `sop/roblox/runs/<slug>/screenshots/`

## 汇报

```
🚀 <游戏名> 建站完成！

站点地址：https://<domain>
页面总数：X 页

GSC：✅ Sitemap 已提交（X 个 URL）/ ✅ 核心页面已请求索引
GA4：✅ 实时数据正常
线上验收：✅ 所有页面 200 / ✅ 移动端友好 / ✅ PageSpeed ≥80

截图已保存：sop/roblox/runs/<slug>/screenshots/

🎉 站点已上线！接下来进入养站阶段。
```

## 上线后跟踪

- 3-7 天：每天检查 GSC 索引进度
- 7-14 天：GA4 流量趋势
- 14-30 天：核心词排名监控

## 耗时预期
15-30 分钟。
