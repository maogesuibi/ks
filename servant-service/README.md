# 小奴为您服务 - 快手金币查询系统

![小奴为您服务](https://example.com/screenshot.png)

一个基于Node.js和MongoDB的快手金币查询管理系统，提供用户查询界面和数据管理后台。

## 功能特性

### 用户端功能
- ✅ 快手ck查询功能
- ✅ 金币余额实时显示
- ✅ 现金余额查询
- ✅ 金币流水记录
- ✅ 现金流水记录
- ✅ 账户状态监控
- ✅ 响应式设计，支持移动端

### 管理端功能
- 📊 数据统计仪表盘
- 👥 用户管理
- 📈 查询记录分析
- 🔒 管理员权限控制
- 📱 实时数据监控

## 技术栈

- **前端**: HTML5 + CSS3 + JavaScript
- **后端**: Node.js + Express
- **数据库**: MongoDB
- **UI框架**: Tailwind CSS
- **图表库**: Chart.js
- **认证**: JWT

## 快速开始

## 使用Docker部署（推荐）

如果您的服务器已经安装了Docker和Docker Compose，这是最简单的部署方式。

### 环境要求
- Docker 20.10 或更高版本
- Docker Compose 1.29 或更高版本

### 部署步骤

```bash
# 克隆项目
git clone https://github.com/yourusername/servant-service.git
cd servant-service

# 复制环境变量模板
cp .env.example .env

# 编辑环境变量（可选）
# nano .env

# 使用Docker Compose启动服务
docker-compose up -d

# 初始化数据库
docker-compose exec app npm run init-db

# 查看服务状态
docker-compose ps
```

## 传统部署方式

### 环境要求

- Node.js 14.x 或更高版本
- MongoDB 4.4 或更高版本
- npm 6.x 或更高版本

### 安装步骤

```bash
# 克隆项目
git clone https://github.com/yourusername/servant-service.git
cd servant-service

# 安装依赖
npm install

# 配置环境变量
cp .env.example .env
# 编辑.env文件配置数据库和API信息

# 初始化数据库
npm run init-db

# 启动服务
npm start
```

### 访问地址

- **用户查询页面**: http://localhost:3000
- **管理后台**: http://localhost:3000/admin

### 默认管理员账户

```
用户名: admin
密码: admin123456
```

**⚠️ 重要：登录后请立即修改默认密码！**

## API接口

### 用户接口

#### 查询金币信息
```
POST /api/query
Content-Type: application/json

{
  "cookie": "您的快手ck信息"
}
```

#### 获取统计数据
```
GET /api/stats
```

#### 获取用户列表
```
GET /api/users
```

### 管理员接口

#### 管理员登录
```
POST /api/admin/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123456"
}
```

#### 获取管理员信息
```
GET /api/admin/me
Authorization: Bearer {token}
```

## 项目结构

```
servant-service/
├── api/               # API路由
├── config/            # 配置文件
├── models/            # 数据库模型
├── utils/             # 工具函数
├── admin/             # 管理后台页面
├── public/            # 前端静态文件
├── .env.example       # 环境变量模板
├── app.js             # 主应用程序
├── package.json       # 项目依赖
└── README.md          # 项目说明
```

## 配置说明

### 环境变量

```env
# 服务器配置
PORT=3000
NODE_ENV=development

# 数据库配置
MONGODB_URI=mongodb://localhost:27017/servant-service

# JWT配置
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d

# 快手API配置
KUAISHOU_API_URL=https://api.kuaishou.com
KUAISHOU_ACCOUNT_OVERVIEW_PATH=/rest/n/nebula/account/overview
```

## 部署建议

### 生产环境配置

1. **使用PM2进行进程管理**
```bash
npm install -g pm2
pm2 start app.js --name "servant-service"
pm2 startup
pm2 save
```

2. **配置Nginx反向代理**
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

3. **启用HTTPS**
建议使用Let's Encrypt配置SSL证书。

## 常见问题

### Q: 为什么查询失败？
A: 可能的原因包括：
- ck信息无效或已过期
- 网络连接问题
- API接口变更

### Q: 如何更新快手API接口？
A: 修改`utils/kuaishouApi.js`中的API地址和请求参数。

### Q: 如何备份数据库？
A: 使用MongoDB的`mongodump`命令进行备份，或使用项目提供的备份脚本。

## 贡献指南

1. Fork 本项目
2. 创建特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建Pull Request

## 许可证

本项目采用MIT许可证 - 详见LICENSE文件

## 联系方式

- 项目作者: 小豆老师
- 技术支持: support@example.com
- 反馈建议: issues@example.com

---

*本项目仅供学习和研究使用，请勿用于商业用途。使用本项目产生的一切后果由使用者自行承担。*