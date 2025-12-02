const { connectDB } = require('../config/database');
const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');

async function initDatabase() {
    try {
        // 连接数据库
        await connectDB();
        console.log('🔧 开始初始化数据库...');

        // 检查是否已有管理员账户
        const adminCount = await Admin.countDocuments();
        
        if (adminCount === 0) {
            // 创建默认管理员账户
            const defaultAdmin = new Admin({
                username: 'admin',
                password: 'admin123456', // 默认密码，建议修改
                email: 'admin@example.com',
                role: 'super_admin'
            });
            
            await defaultAdmin.save();
            console.log('✅ 默认管理员账户已创建:');
            console.log('   用户名: admin');
            console.log('   密码: admin123456');
            console.log('   邮箱: admin@example.com');
            console.log('⚠️  重要：请登录后立即修改默认密码！');
        } else {
            console.log('ℹ️  管理员账户已存在，跳过创建');
        }

        console.log('✅ 数据库初始化完成！');
        process.exit(0);
    } catch (error) {
        console.error('❌ 数据库初始化失败:', error.message);
        process.exit(1);
    }
}

initDatabase();