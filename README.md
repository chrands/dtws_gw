# 稻田蛙声 DAUTEEN 官网

新质诊疗技术传播服务商官网，基于Node.js和Express开发。

## 项目结构

```
├── index.html          # 主页面
├── logo.png            # 网站Logo
├── package.json        # 项目配置和依赖
├── server.js           # Node.js服务器文件
└── README.md           # 项目说明
```

## 环境要求

- Node.js v24.11.1
- npm
- Nginx 1.26.3 (服务器)
- MySQL 8.0.36 (可选，用于扩展功能)

## 本地开发

1. 安装依赖

```bash
npm install
```

2. 启动开发服务器

```bash
npm run dev
```

3. 访问 http://localhost:3000

## 部署到腾讯云Ubuntu宝塔服务器

### 1. 服务器环境配置

1. 登录腾讯云控制台，使用IP地址118.195.246.218
2. 安装宝塔面板
3. 在宝塔面板中安装以下软件：
   - Nginx 1.26.3
   - MySQL 8.0.36 (可选)
   - Node.js v24.11.1

### 2. 域名配置

1. 在域名提供商处配置DNS解析：
   - 添加A记录：`www.dauteenvoice.com` 指向 `118.195.246.218`
   - 添加A记录：`dauteenvoice.com` 指向 `118.195.246.218`

### 3. 项目部署

1. 通过宝塔面板的文件管理器上传项目文件到服务器
2. 进入项目目录，运行：

```bash
npm install
```

3. 使用PM2管理Node.js进程：

```bash
# 安装PM2
npm install -g pm2

# 启动应用
pm start

# 或使用PM2直接启动
pm start
```

### 4. Nginx配置

在宝塔面板中配置Nginx虚拟主机：

1. 添加网站，域名填写 `www.dauteenvoice.com`
2. 设置网站目录为项目根目录
3. 配置反向代理：
   - 目标URL：`http://localhost:3000`
   - 发送域名：`$host`
4. 启用SSL证书，配置HTTPS

### 5. 安全配置

1. 在宝塔面板中配置防火墙，开放80、443端口
2. 启用Nginx的安全防护功能
3. 定期更新系统和软件包

## 性能优化

1. 配置Nginx缓存策略
2. 对静态资源进行压缩
3. 优化图片大小和格式

## 维护

1. 定期备份网站文件和数据库
2. 监控服务器性能和网站访问情况
3. 及时更新依赖包以修复安全漏洞

## 联系方式

如有问题，请联系技术支持。