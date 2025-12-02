#!/bin/bash
# 一键部署脚本 - 小奴为您服务系统

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # 无颜色

# 检查是否以root用户运行
if [ "$(id -u)" != "0" ]; then
    echo -e "${RED}错误：请以root用户运行此脚本${NC}"
    echo -e "${YELLOW}使用：sudo ./deploy.sh${NC}"
    exit 1
fi

# 检查Docker和Docker Compose是否安装
check_dependencies() {
    echo -e "${YELLOW}检查依赖项...${NC}"
    
    if ! command -v docker &> /dev/null; then
        echo -e "${RED}错误：未找到Docker，请先安装Docker${NC}"
        echo -e "${YELLOW}安装命令：sudo apt install -y docker.io${NC}"
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        echo -e "${RED}错误：未找到Docker Compose，请先安装Docker Compose${NC}"
        echo -e "${YELLOW}安装命令：sudo apt install -y docker-compose${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✓ Docker和Docker Compose已安装${NC}"
}

# 部署主函数
deploy() {
    echo -e "${YELLOW}开始部署小奴为您服务系统...${NC}"
    
    # 克隆代码仓库
    echo -e "\n${YELLOW}1. 克隆代码仓库...${NC}"
    if [ -d "ks" ]; then
        echo -e "${YELLOW}注意：目录ks已存在，将删除后重新克隆${NC}"
        rm -rf ks
    fi
    
    git clone https://github.com/maogesuibi/ks.git
    if [ $? -ne 0 ]; then
        echo -e "${RED}错误：克隆仓库失败${NC}"
        exit 1
    fi
    
    cd ks
    
    # 进入项目目录
    echo -e "\n${YELLOW}2. 进入项目目录...${NC}"
    if [ ! -d "servant-service" ]; then
        echo -e "${RED}错误：未找到servant-service目录${NC}"
        exit 1
    fi
    
    cd servant-service
    
    # 复制环境变量模板
    echo -e "\n${YELLOW}3. 配置环境变量...${NC}"
    if [ ! -f ".env" ]; then
        cp .env.example .env
        echo -e "${GREEN}✓ 环境变量模板已复制${NC}"
    else
        echo -e "${YELLOW}注意：.env文件已存在，将保留现有配置${NC}"
    fi
    
    # 启动Docker服务
    echo -e "\n${YELLOW}4. 启动Docker服务...${NC}"
    sudo systemctl start docker
    sudo systemctl enable docker
    
    # 启动服务
    echo -e "\n${YELLOW}5. 使用Docker Compose启动服务...${NC}"
    docker-compose up -d
    if [ $? -ne 0 ]; then
        echo -e "${RED}错误：启动服务失败${NC}"
        exit 1
    fi
    
    # 等待服务启动
    echo -e "\n${YELLOW}6. 等待服务启动...${NC}"
    echo -e "${YELLOW}（约30秒，请耐心等待）${NC}"
    sleep 30
    
    # 初始化数据库
    echo -e "\n${YELLOW}7. 初始化数据库...${NC}"
    docker-compose exec app npm run init-db
    if [ $? -ne 0 ]; then
        echo -e "${RED}错误：数据库初始化失败${NC}"
        exit 1
    fi
    
    # 检查服务状态
    echo -e "\n${YELLOW}8. 检查服务状态...${NC}"
    docker-compose ps
    
    # 获取服务器IP
    SERVER_IP=$(hostname -I | awk '{print $1}')
    
    # 显示部署结果
    echo -e "\n${GREEN}=======================================${NC}"
    echo -e "${GREEN}🎉 部署完成！🎉${NC}"
    echo -e "${GREEN}=======================================${NC}"
    echo -e ""
    echo -e "${YELLOW}访问地址：${NC}"
    echo -e "${GREEN}• 用户查询页面：http://${SERVER_IP}:3000${NC}"
    echo -e "${GREEN}• 管理后台：http://${SERVER_IP}:3000/admin${NC}"
    echo -e ""
    echo -e "${YELLOW}默认管理员账户：${NC}"
    echo -e "${GREEN}• 用户名：admin${NC}"
    echo -e "${GREEN}• 密码：admin123456${NC}"
    echo -e ""
    echo -e "${YELLOW}重要提示：${NC}"
    echo -e "${RED}⚠️  请登录管理后台后立即修改默认密码！${NC}"
    echo -e "${YELLOW}服务管理命令：${NC}"
    echo -e "${GREEN}• 查看日志：docker-compose logs -f app${NC}"
    echo -e "${GREEN}• 重启服务：docker-compose restart${NC}"
    echo -e "${GREEN}• 停止服务：docker-compose down${NC}"
    echo -e "${GREEN}=======================================${NC}"
}

# 主程序
main() {
    echo -e "${GREEN}=======================================${NC}"
    echo -e "${GREEN}        小奴为您服务系统一键部署        ${NC}"
    echo -e "${GREEN}=======================================${NC}"
    echo -e ""
    
    check_dependencies
    deploy
}

# 运行主程序
main