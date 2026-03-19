# Zeabur 部署指南 - 最简单的方法

## 为什么选择 Zeabur？

- ✅ 对中国用户友好（服务器在国内，访问快）
- ✅ 支持 GitHub 直接部署
- ✅ 操作简单，界面中文
- ✅ 有免费额度

---

## 部署步骤（只需5分钟）

### 第一步：注册 Zeabur

1. 打开 https://zeabur.com
2. 点击 **"登录"** → 使用 **GitHub 账号登录**
3. 授权 GitHub 访问

### 第二步：上传代码到 GitHub

**如果您还没有上传代码：**

1. 下载代码包：`wb-scraper-zeabur.zip`（我稍后提供）
2. 打开 https://github.com
3. 点击右上角 **"+"** → **"New repository"**
4. 仓库名称填写：`wb-scraper`
5. 选择 **Public**
6. **不要**勾选 "Add a README file"
7. 点击 **"Create repository"**
8. 在新页面，找到 **"uploading an existing file"**
9. 解压 ZIP 包，将所有文件拖拽上传
10. 点击 **"Commit changes"**

### 第三步：在 Zeabur 部署

1. 打开 https://zeabur.com
2. 点击 **"新建项目"**
3. 选择 **"从 GitHub 部署"**
4. 在列表中找到 **`wb-scraper`** 仓库
5. 点击仓库名称
6. Zeabur 会自动检测到 Dockerfile 并开始构建
7. **等待 2-3 分钟**（显示绿色 ✅ 表示成功）

### 第四步：获取服务地址

1. 部署成功后，点击进入项目
2. 找到 **"服务"** 或 **"Services"**
3. 点击您的服务
4. 在 **"域名"** 或 **"Domain"** 部分
5. 点击 **"生成域名"** 或 **"Generate Domain"**
6. 复制生成的 URL（如：`https://wb-scraper.xxxxx.zeabur.app`）

### 第五步：在网页中配置

1. 打开 https://pkzsf7b5hdsn.space.minimaxi.com
2. 在顶部 **"API 地址"** 输入 Zeabur 给的 URL
3. 点击 **"测试连接"**
4. 如果显示 **"已连接"** → 选择 **"API后端服务"**
5. 输入 Wildberries 链接，点击分析！

---

## 需要下载的文件

**文件列表（只需这4个）：**
- `server.js`
- `Dockerfile.zeabur`
- `package.backend.json`

---

## 常见问题

### Q: 部署失败怎么办？
A: 点击服务旁边的 **"日志"** 查看错误信息，告诉我具体内容。

### Q: 需要付费吗？
A: Zeabur 有免费额度，个人使用足够。

### Q: 连接测试显示失败？
A: 确保 Zeabur 服务状态是 "运行中"，不是 "已停止"。

---

## 完成后

将 Zeabur 生成的 URL 填入分析网页的 API 地址框中，即可使用真实数据抓取功能！
