const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

class KuaishouApi {
    constructor() {
        this.apiUrl = process.env.KUAISHOU_API_URL || 'https://api.kuaishou.com';
        this.accountOverviewPath = process.env.KUAISHOU_ACCOUNT_OVERVIEW_PATH || '/rest/n/nebula/account/overview';
    }

    async getAccountOverview(cookie) {
        try {
            // 解析cookie获取必要的参数
            const parsedCookie = this.parseCookie(cookie);
            const userId = parsedCookie.userId || parsedCookie.ud;
            
            if (!userId) {
                throw new Error('无法从cookie中解析出userId');
            }

            // 构建请求
            const response = await axios.post(
                `${this.apiUrl}${this.accountOverviewPath}`,
                {
                    userId: userId,
                    // 可以根据需要添加更多参数
                },
                {
                    headers: {
                        'Cookie': cookie,
                        'Content-Type': 'application/json',
                        'User-Agent': 'Mozilla/5.0 (Linux; Android 12; Pixel 6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Mobile Safari/537.36',
                        'Referer': 'https://www.kuaishou.com/',
                        'Origin': 'https://www.kuaishou.com'
                    }
                }
            );

            // 处理响应
            if (response.data && response.data.result) {
                return this.processResult(response.data.result);
            } else {
                throw new Error('API响应格式不正确');
            }
        } catch (error) {
            console.error('快手API请求失败:', error.message);
            throw error;
        }
    }

    parseCookie(cookie) {
        const cookieObj = {};
        cookie.split(';').forEach(pair => {
            const [key, value] = pair.trim().split('=');
            if (key && value) {
                cookieObj[key.trim()] = value.trim();
            }
        });
        return cookieObj;
    }

    processResult(rawData) {
        // 这里需要根据实际的API响应格式来处理
        // 以下是示例处理逻辑
        return {
            success: true,
            nickname: rawData.nickname || '未知用户',
            userId: rawData.userId,
            query_time: new Date().toLocaleString(),
            is_new_user: true, // 需要根据实际情况判断
            account_status: {
                status: 'normal',
                message: '✅ 状态正常',
                color: '#FF5000',
                icon: '😊'
            },
            coin: rawData.coin || 0,
            cash: rawData.cash || 0,
            coin_log: rawData.coin_log || [],
            cash_log: rawData.cash_log || []
        };
    }

    // 模拟数据，用于开发测试
    async getMockData(cookie) {
        try {
            // 解析cookie获取用户ID
            const parsedCookie = this.parseCookie(cookie);
            const userId = parsedCookie.userId || parsedCookie.ud || 'unknown';
            
            // 模拟API响应
            return {
                success: true,
                nickname: '小豆老师',
                userId: userId,
                query_time: new Date().toLocaleString(),
                is_new_user: false,
                account_status: {
                    status: 'normal',
                    message: '✅ 状态正常',
                    color: '#FF5000',
                    icon: '😊'
                },
                coin: 12345,
                cash: 678.90,
                coin_log: [
                    { time: '12:00', desc: '签到奖励', amount: 100 },
                    { time: '11:30', desc: '任务完成', amount: 200 },
                    { time: '11:00', desc: '消费支出', amount: -50 }
                ],
                cash_log: [
                    { 
                        time: '12:10', 
                        desc: '提现申请', 
                        amount: '-100.00', 
                        color: '#ff3b30',
                        icon: '💸',
                        status: 'pending',
                        status_text: '处理中',
                        hint: '预计24小时内到账'
                    },
                    { 
                        time: '11:45', 
                        desc: '充值到账', 
                        amount: '+200.00', 
                        color: '#34c759',
                        icon: '💰',
                        status: 'completed',
                        status_text: '已完成'
                    }
                ]
            };
        } catch (error) {
            console.error('模拟数据生成失败:', error.message);
            throw error;
        }
    }
}

module.exports = new KuaishouApi();