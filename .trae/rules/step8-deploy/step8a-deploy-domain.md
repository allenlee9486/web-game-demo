# Step 8a: 代码推送 + Cloudflare Pages 部署 + 域名配置

> 输入：Step 7 验证通过的代码
> 输出：线上可访问的站点
> 下一步：step8b-gsc-verify.md

## 前置条件

- Step 7 全部通过
- 代码已 commit 到 main 分支
- 新爷已确认可以上线

## 推送前检查

```bash
cd ~/.openclaw/workspace/repo/<slug>
git branch          # 确认 main
git status --short  # 确认无未提交修改
npm run build       # 最后一次确认
```

## 推送到 GitHub

```bash
gh repo create <slug> --public --source=. --remote=origin  # 新仓库
git push -u origin main
```

> ⚠️ 大图 push 用 HTTPS 不用 SSH。

## Cloudflare Pages 配置

- 连接 GitHub 仓库
- Framework preset：Next.js
- Build command：`npm run build`
- Node.js version：18+

## 域名配置

DNS 指向 Cloudflare Pages。www vs no-www 统一：

```bash
curl -sIL https://www.<domain> | grep -i "location"
curl -sIL https://<domain> | grep -i "location"
```

确保只有一个主域返回 200，另一个 301 重定向。

## SSL 验证

```bash
curl -sI https://<domain> | grep -i "strict-transport-security"
```

## 汇报

```
🚀 Step8a 部署完成
- 站点地址：https://<domain>
- Cloudflare Pages build 通过
- 域名解析正常 / SSL 正常
- www/no-www 重定向正确
```

## 耗时预期
15-30 分钟（含 DNS 传播等待）。
