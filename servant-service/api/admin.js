const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

// 管理员登录
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    
    try {
        // 查找管理员
        const admin = await Admin.findOne({ username });
        if (!admin) {
            return res.status(401).json({
                success: false,
                msg: '用户名或密码错误'
            });
        }

        // 验证密码
        const isMatch = await admin.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                msg: '用户名或密码错误'
            });
        }

        // 更新最后登录时间
        admin.lastLogin = Date.now();
        await admin.save();

        // 生成JWT令牌
        const token = jwt.sign(
            { id: admin._id, username: admin.username, role: admin.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        res.json({
            success: true,
            token,
            user: {
                id: admin._id,
                username: admin.username,
                email: admin.email,
                role: admin.role
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: '登录失败: ' + error.message
        });
    }
});

// 获取管理员信息
router.get('/me', authenticateAdmin, async (req, res) => {
    try {
        const admin = await Admin.findById(req.admin.id).select('-password');
        res.json({
            success: true,
            user: admin
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: '获取管理员信息失败: ' + error.message
        });
    }
});

// 修改密码
router.post('/change-password', authenticateAdmin, async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    
    try {
        const admin = await Admin.findById(req.admin.id);
        
        // 验证旧密码
        const isMatch = await admin.comparePassword(oldPassword);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                msg: '旧密码不正确'
            });
        }

        // 更新密码
        admin.password = newPassword;
        await admin.save();

        res.json({
            success: true,
            msg: '密码修改成功'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: '密码修改失败: ' + error.message
        });
    }
});

// 管理员认证中间件
function authenticateAdmin(req, res, next) {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
        return res.status(401).json({
            success: false,
            msg: '未提供认证令牌'
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.admin = decoded;
        next();
    } catch (error) {
        res.status(401).json({
            success: false,
            msg: '无效的认证令牌'
        });
    }
}

module.exports = router;