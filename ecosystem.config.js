module.exports = {
  apps: [{
    name: 'dauteenvoice',
    script: 'server.js',
    instances: 'max', // 使用所有可用 CPU 核心
    exec_mode: 'cluster', // 集群模式
    watch: false, // 生产环境通常关闭 watch
    max_memory_restart: '1G', // 内存超过 1G 自动重启
    env: {
      NODE_ENV: 'development',
      PORT: 3000
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    log_date_format: 'YYYY-MM-DD HH:mm:ss',
    error_file: '/www/wwwlogs/dauteenvoice/error.log',
    out_file: '/www/wwwlogs/dauteenvoice/out.log',
    merge_logs: true,
    autorestart: true
  }]
};
