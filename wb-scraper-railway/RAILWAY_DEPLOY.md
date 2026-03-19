# 修正后的 Railway 部署指南

## 问题原因
之前的部署失败是因为：
1. Railway 无法识别项目类型
2. Dockerfile 配置不正确

## 已修复的内容
1. ✅ 创建了专用的 `Dockerfile.railway` 文件
2. ✅ 创建了轻量级的 `package.backend.json`（只包含后端依赖）
3. ✅ 更新了 `railway.json` 指向新 Dockerfile
4. ✅ 使用更简单的 Node.js 基础镜像

## 重新部署步骤

### 第一步：更新 GitHub 仓库

1. 删除 GitHub 仓库中的旧文件
2. 下载新的代码包（我稍后提供）
3. 解压后上传以下文件到 GitHub 仓库根目录：
   - `server.js`
   - `Dockerfile.railway`
   - `package.backend.json`
   - `railway.json`

**重要：只需上传这4个文件！**

### 第二步：重新部署到 Railway

1. 打开 https://railway.app
2. 进入之前的项目（或创建新项目）
3. 点击项目右上角的 **"..."** 菜单
4. 选择 **"Redeploy"** 或 **"重新部署"**
5. 等待 2-3 分钟

### 第三步：检查部署状态

如果成功，会显示：
- ✅ 绿色 "Deployed"
- 服务状态显示为运行中

### 第四步：获取公开地址

1. 点击 **"Settings"** 或 **"Networking"**
2. 找到 **"Public Networking"**
3. 点击开启
4. 复制生成的 URL

## 如果还是失败

在 Railway 项目页面点击 **"View logs"** 查看详细错误信息，告诉我错误内容。

---

## 文件说明

### server.js
后端服务代码，处理 Wildberries 评论抓取请求

### Dockerfile.railway
告诉 Railway 如何构建和运行项目

### package.backend.json
后端所需的依赖包（轻量版）

### railway.json
Railway 部署配置

---

## 下一步

部署成功后，将获得的 URL 填入前端页面即可使用真实数据抓取功能。
