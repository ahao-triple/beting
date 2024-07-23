FROM node:latest

# 设置工作目录
WORKDIR /usr/src/app

# 安装依赖
COPY package*.json ./
RUN npm install

# 复制项目文件
COPY . .

# 启动应用
CMD ["npx", "nodemon", "--watch", ".", "src/index.js"]  # 将 "src/index.js" 替换为你的入口文件

