# 使用Node.js官方镜像作为基础
FROM node:16-alpine

# 设置工作目录
WORKDIR /app

# 复制package.json和package-lock.json
COPY package*.json ./

# 安装依赖
RUN npm install --production

# 复制项目文件
COPY . .

# 创建环境变量文件（如果不存在）
RUN if [ ! -f .env ]; then cp .env.example .env; fi

# 暴露端口
EXPOSE 3000

# 健康检查
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/ || exit 1

# 启动命令
CMD ["npm", "start"]