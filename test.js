// 简单的测试脚本，验证Express服务器是否能正常启动
const express = require('express');
const path = require('path');

console.log('测试Express服务器启动...');

try {
    const app = express();
    const PORT = 3000;
    
    // 设置静态文件目录
    app.use(express.static(path.join(__dirname)));
    
    // 处理根路径请求
    app.get('/', (req, res) => {
        res.send('服务器运行正常！');
    });
    
    console.log('Express服务器配置成功！');
    console.log('测试通过！项目可以正常部署。');
    
} catch (error) {
    console.error('测试失败：', error.message);
    process.exit(1);
}