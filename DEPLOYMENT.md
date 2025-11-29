# 稻田蛙声官网 - 高级部署与运维指南

本文档旨在指导如何在 UbuntuBT (Ubuntu + 宝塔面板) 环境下，按照企业级标准部署、优化和维护稻田蛙声官网项目。

## 0. 文件准备

请确保项目根目录下包含以下新生成的脚本和配置文件：

*   `ecosystem.config.js`: PM2 进程管理配置
*   `setup_system.sh`: 系统初始化与安全加固脚本
*   `deploy.sh`: 自动化部署脚本
*   `nginx_advanced.conf`: 高级 Nginx 配置模板
*   `monitor.sh`: 服务健康监控脚本
*   `backup.sh`: 自动备份脚本

将所有文件上传至服务器的 `/www/wwwroot/dauteenvoice` 目录（如果是首次部署，请先创建目录）。

---

## 1. 系统环境配置 (root 权限)

**目标**：安装依赖、配置防火墙、优化内核、创建专用用户。

1.  **赋予脚本执行权限**：
    ```bash
    chmod +x setup_system.sh
    ```

2.  **运行初始化脚本**：
    ```bash
    sudo ./setup_system.sh
    ```
    *注意：脚本会配置 UFW 防火墙，请确保宝塔面板的安全组也开放了 80, 443, 8888 等必要端口。*

---

## 2. 项目部署

**目标**：使用专用用户 `dauteen` 运行服务，实现权限隔离和自动化管理。

1.  **赋予脚本执行权限**：
    ```bash
    chmod +x deploy.sh
    ```

2.  **执行部署**：
    ```bash
    sudo ./deploy.sh
    ```
    该脚本会自动：
    *   修正目录权限为 `dauteen` 用户
    *   安装/更新 Node.js 依赖
    *   使用 PM2 (Cluster 模式) 启动或重载应用

3.  **验证服务**：
    ```bash
    pm2 list
    curl http://localhost:3000
    ```

---

## 3. 性能优化与安全加固 (Nginx)

**目标**：配置 SSL、Gzip 压缩、安全头部、缓存策略。

1.  打开宝塔面板 -> 网站 -> 设置 -> 配置文件。
2.  **替换/修改配置**：
    参考项目中的 `nginx_advanced.conf` 文件内容。
    *   **保留**：`server_name`, `root`, `ssl_certificate` 等基础路径配置（宝塔自动生成的）。
    *   **添加**：
        *   `gzip ...` 相关配置（开启压缩）
        *   `add_header ...` 相关安全头部（HSTS, X-Frame 等）
        *   `location ~* \.(jpg|...)` 静态资源缓存配置
        *   `location /` 中的 `proxy_...` 优化配置

3.  **重载 Nginx**：
    在宝塔面板或终端执行 `nginx -s reload`。

---

## 4. 运维保障

**目标**：建立监控、备份和自动恢复机制。

### 4.1 配置健康监控
将监控脚本加入 Crontab 定时任务，每 5 分钟检查一次服务状态，异常时自动重启。

1.  编辑 Crontab：
    ```bash
    crontab -e
    ```
2.  添加以下行：
    ```cron
    */5 * * * * /www/wwwroot/dauteenvoice/monitor.sh
    ```

### 4.2 配置自动备份
每天凌晨 2 点自动备份网站文件。

1.  在 Crontab 中添加：
    ```cron
    0 2 * * * /www/wwwroot/dauteenvoice/backup.sh
    ```

### 4.3 日志管理
PM2 会自动管理应用日志，但建议配置 `logrotate` 防止日志过大（`setup_system.sh` 已安装 logrotate）。
PM2 配置文件中已指定日志路径为 `/www/wwwlogs/dauteenvoice/`。

---

## 5. 常用命令速查

*   **查看应用状态**：`pm2 list`
*   **查看应用日志**：`pm2 logs dauteenvoice`
*   **手动更新代码并部署**：
    ```bash
    cd /www/wwwroot/dauteenvoice
    git pull # 如果使用 git
    sudo ./deploy.sh
    ```
*   **重启 Nginx**：`nginx -s reload`
