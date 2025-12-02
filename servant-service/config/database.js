const mongoose = require('mongoose');
const dotenv = require('dotenv');

// 加载环境变量
dotenv.config();

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            // 对于Mongoose 6.x，这些选项不再需要
        });
        
        console.log(`✅ MongoDB 连接成功: ${conn.connection.host}`);
        return conn;
    } catch (error) {
        console.error(`❌ MongoDB 连接失败: ${error.message}`);
        process.exit(1);
    }
};

module.exports = { connectDB };