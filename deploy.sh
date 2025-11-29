#!/bin/bash

# 稻田蛙声 - 自动化部署脚本

PROJECT_DIR="/www/wwwroot/dauteenvoice"
USER="dauteen"

# 检查是否以 root 运行
if [ "$EUID" -ne 0 ]; then 
  echo "请使用 root 权限运行此脚本"
  exit 1
fi

echo "开始部署..."

# 1. 检查目录权限
echo "配置目录权限..."
chown -R $USER:$USER $PROJECT_DIR

# 2. 切换到项目目录并安装依赖
echo "安装/更新依赖..."
# 使用 su 切换用户执行 npm install，确保 node_modules 权限正确
su - $USER -c "cd $PROJECT_DIR && npm install --production"

# 3. 使用 PM2 启动/重载服务
echo "重载应用服务..."
# 检查 PM2 是否正在运行该项目
if su - $USER -c "cd $PROJECT_DIR && pm2 list | grep -q 'dauteenvoice'"; then
    su - $USER -c "cd $PROJECT_DIR && pm2 reload ecosystem.config.js --env production"
    echo "应用已重载"
else
    su - $USER -c "cd $PROJECT_DIR && pm2 start ecosystem.config.js --env production"
    echo "应用已启动"
fi

# 4. 保存 PM2 列表以便开机自启
su - $USER -c "pm2 save"

echo "部署完成！"
