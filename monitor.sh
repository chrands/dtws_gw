#!/bin/bash

# 稻田蛙声 - 服务健康监控脚本
# 建议添加到 crontab 每 5 分钟执行一次: */5 * * * * /path/to/monitor.sh

URL="http://localhost:3000"
LOG_FILE="/var/log/dauteen_monitor.log"
PROJECT_DIR="/www/wwwroot/dauteenvoice"
USER="dauteen"

timestamp=$(date "+%Y-%m-%d %H:%M:%S")

# 检查 HTTP 状态码
status_code=$(curl -o /dev/null -s -w "%{http_code}\n" $URL)

if [ "$status_code" -eq 200 ]; then
    # echo "$timestamp - 服务正常 (Status: $status_code)" >> $LOG_FILE
    exit 0
else
    echo "$timestamp - [警告] 服务异常 (Status: $status_code)，尝试重启..." >> $LOG_FILE
    
    # 尝试重启服务
    su - $USER -c "cd $PROJECT_DIR && pm2 reload ecosystem.config.js --env production"
    
    # 等待几秒再次检查
    sleep 10
    new_status=$(curl -o /dev/null -s -w "%{http_code}\n" $URL)
    
    if [ "$new_status" -eq 200 ]; then
        echo "$timestamp - [恢复] 服务重启成功" >> $LOG_FILE
    else
        echo "$timestamp - [错误] 服务重启失败，请人工介入！" >> $LOG_FILE
        # 这里可以添加发送邮件或 webhook 的逻辑
    fi
fi
