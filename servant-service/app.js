const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');

// 配置文件
const { connectDB } = require('./config/database');

// 路由
const queryRoutes = require('./api/query');
const adminRoutes = require('./api/admin');

// 加载环境变量
dotenv.config();

// 创建Express应用
const app = express();

// 连接数据库
connectDB();

// 中间件
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 日志
if (process.env.NODE_ENV !== 'production') {
    app.use(morgan('dev'));
}

// 速率限制
const limiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 60000, // 1分钟
    max: parseInt(process.env.RATE_LIMIT_MAX) || 100, // 限制每个IP每分钟100个请求
    message: {
        success: false,
        msg: '请求过于频繁，请稍后再试'
    }
});
app.use('/api/', limiter);

// 静态文件
app.use(express.static(path.join(__dirname, 'public')));

// API路由
app.use('/api', queryRoutes);
app.use('/api/admin', adminRoutes);

// 前端页面路由
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 404处理
app.use((req, res) => {
    res.status(404).json({
        success: false,
        msg: 'API接口不存在'
    });
});

// 错误处理
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        msg: '服务器内部错误: ' + err.message
    });
});

// 启动服务器
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 服务器运行在 http://localhost:${PORT}`);
    console.log(`📊 API文档: http://localhost:${PORT}/api-docs`);
});

module.exports = app;