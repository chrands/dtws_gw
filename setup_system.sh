#!/bin/bash

# 稻田蛙声 - 系统初始化与安全加固脚本
# 适用于 Ubuntu Server (包括安装了宝塔面板的环境)

# 检查是否以 root 运行
if [ "$EUID" -ne 0 ]; then 
  echo "请使用 root 权限运行此脚本"
  exit 1
fi

echo "开始系统初始化与优化..."

# 1. 系统更新与依赖安装
echo "[1/5] 更新系统并安装依赖..."
apt-get update
apt-get install -y curl git ufw fail2ban htop logrotate

# 2. 创建专用运行用户
echo "[2/5] 配置用户权限..."
USERNAME="dauteen"
if id "$USERNAME" &>/dev/null; then
    echo "用户 $USERNAME 已存在"
else
    useradd -m -s /bin/bash $USERNAME
    echo "用户 $USERNAME 已创建"
fi

# 确保日志目录存在并设置权限
mkdir -p /www/wwwlogs/dauteenvoice
chown -R $USERNAME:$USERNAME /www/wwwlogs/dauteenvoice

# 3. 内核参数优化
echo "[3/5] 优化内核参数..."
cat > /etc/sysctl.d/99-dauteen-tuning.conf <<EOF
# 网络调优
net.core.somaxconn = 65535
net.core.netdev_max_backlog = 65535
net.ipv4.tcp_max_syn_backlog = 65535
net.ipv4.tcp_fin_timeout = 30
net.ipv4.tcp_tw_reuse = 1
net.ipv4.ip_local_port_range = 10000 65000
net.ipv4.tcp_keepalive_time = 1200

# 内存调优
vm.swappiness = 10
vm.overcommit_memory = 1
EOF
sysctl -p /etc/sysctl.d/99-dauteen-tuning.conf

# 4. 安全加固 (Fail2Ban)
echo "[4/5] 配置 Fail2Ban..."
cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local
# 启用 SSH 保护
sed -i 's/\[sshd\]/[sshd]\nenabled = true/' /etc/fail2ban/jail.local
systemctl restart fail2ban
systemctl enable fail2ban

# 5. 防火墙设置 (UFW)
# 注意：如果使用宝塔面板，建议优先使用宝塔的安全组功能。
# 这里仅作为底层保障，默认开放 SSH(22/8888等), HTTP(80), HTTPS(443)
echo "[5/5] 配置 UFW 防火墙..."
ufw allow ssh
ufw allow 80/tcp
ufw allow 443/tcp
# 宝塔默认端口，根据实际情况调整
ufw allow 8888/tcp 
# ufw enable # 默认不自动开启，以免断开连接，建议用户手动确认

echo "系统初始化完成！"
echo "建议执行 'ufw enable' 开启防火墙（请确保已放行 SSH 和面板端口）。"
