const express = require('express');
const router = express.Router();
const kuaishouApi = require('../utils/kuaishouApi');
const User = require('../models/User');
const QueryRecord = require('../models/QueryRecord');

// 查询接口
router.post('/query', async (req, res) => {
    const { cookie } = req.body;
    const ipAddress = req.ip;
    const userAgent = req.headers['user-agent'];
    
    try {
        // 验证cookie
        if (!cookie) {
            return res.status(400).json({
                success: false,
                msg: '请提供有效的cookie信息'
            });
        }

        // 记录查询开始
        console.log(`🔍 用户查询请求 - IP: ${ipAddress}, User-Agent: ${userAgent}`);

        // 尝试解析用户ID
        const parsedCookie = kuaishouApi.parseCookie(cookie);
        const userId = parsedCookie.userId || parsedCookie.ud || 'unknown_' + Date.now();

        // 查询用户信息
        let user = await User.findOne({ userId });
        
        // 处理新用户
        const isNewUser = !user;
        if (isNewUser) {
            user = new User({
                userId: userId,
                nickname: '新用户_' + Date.now(),
                cookie: cookie,
                isNewUser: true,
                queryCount: 1
            });
        } else {
            user.cookie = cookie; // 更新cookie
            user.queryCount += 1;
            user.lastQueryTime = Date.now();
            user.isNewUser = false;
        }

        // 保存用户信息
        await user.save();

        // 调用快手API获取数据
        let result;
        try {
            // 生产环境使用真实API
            // result = await kuaishouApi.getAccountOverview(cookie);
            
            // 开发测试使用模拟数据
            result = await kuaishouApi.getMockData(cookie);
            
            // 更新用户昵称
            if (result.nickname && user.nickname !== result.nickname) {
                user.nickname = result.nickname;
                await user.save();
            }
            
        } catch (apiError) {
            // 记录错误查询
            await QueryRecord.create({
                userId: userId,
                nickname: user.nickname,
                cookie: cookie,
                result: {
                    success: false,
                    error: apiError.message
                },
                ipAddress: ipAddress,
                userAgent: userAgent
            });

            return res.status(500).json({
                success: false,
                msg: 'API请求失败: ' + apiError.message
            });
        }

        // 记录成功查询
        await QueryRecord.create({
            userId: userId,
            nickname: user.nickname,
            cookie: cookie,
            result: {
                success: true,
                data: result
            },
            ipAddress: ipAddress,
            userAgent: userAgent
        });

        // 返回结果
        res.json(result);

    } catch (error) {
        console.error('❌ 查询处理失败:', error.message);
        res.status(500).json({
            success: false,
            msg: '服务器内部错误: ' + error.message
        });
    }
});

// 获取统计数据
router.get('/stats', async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalQueries = await QueryRecord.countDocuments();
        
        // 今日查询
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayQueries = await QueryRecord.countDocuments({
            queryTime: { $gte: today }
        });
        
        // 今日活跃用户
        const activeUsersToday = await User.countDocuments({
            lastQueryTime: { $gte: today }
        });

        res.json({
            success: true,
            data: {
                totalUsers,
                totalQueries,
                todayQueries,
                activeUsersToday
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: '获取统计数据失败: ' + error.message
        });
    }
});

// 获取用户列表
router.get('/users', async (req, res) => {
    try {
        const users = await User.find()
            .sort({ lastQueryTime: -1 })
            .limit(10);

        res.json({
            success: true,
            data: users
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: '获取用户列表失败: ' + error.message
        });
    }
});

module.exports = router;