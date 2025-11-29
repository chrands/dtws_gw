#!/bin/bash

# 稻田蛙声 - 自动备份脚本
# 建议添加到 crontab 每天凌晨执行: 0 2 * * * /path/to/backup.sh

BACKUP_DIR="/www/backup/dauteenvoice"
SOURCE_DIR="/www/wwwroot/dauteenvoice"
DATE=$(date +%Y%m%d)
FILENAME="dauteen_backup_$DATE.tar.gz"

# 确保备份目录存在
mkdir -p $BACKUP_DIR

# 1. 备份文件
echo "正在备份文件..."
tar -czf $BACKUP_DIR/$FILENAME $SOURCE_DIR --exclude=node_modules

# 2. 清理旧备份 (保留最近 7 天)
echo "清理旧备份..."
find $BACKUP_DIR -name "dauteen_backup_*.tar.gz" -mtime +7 -delete

echo "备份完成: $BACKUP_DIR/$FILENAME"
