#!/bin/bash

echo "🚀 启动 CMS 管理后台系统..."

# 检查 Node.js 是否安装
if ! command -v node &> /dev/null; then
    echo "❌ Node.js 未安装，请先安装 Node.js"
    exit 1
fi

# 检查 npm 是否安装
if ! command -v npm &> /dev/null; then
    echo "❌ npm 未安装，请先安装 npm"
    exit 1
fi

# 检查数据库配置
if [ ! -f "server/.env" ]; then
    echo "⚠️  数据库配置文件不存在，正在创建..."
    if [ -f "server/.env.example" ]; then
        cp server/.env.example server/.env
        echo "📝 已创建 server/.env 文件，请编辑并填入您的 Supabase 配置"
        echo "   需要配置: SUPABASE_URL 和 SUPABASE_ANON_KEY"
        exit 1
    else
        echo "❌ 找不到 .env.example 文件"
        exit 1
    fi
fi

# 检查环境变量是否配置
if ! grep -q "SUPABASE_URL=https://" server/.env || ! grep -q "SUPABASE_ANON_KEY=" server/.env; then
    echo "⚠️  请先配置 Supabase 数据库连接信息"
    echo "   编辑 server/.env 文件，填入:"
    echo "   - SUPABASE_URL=https://your-project-id.supabase.co"
    echo "   - SUPABASE_ANON_KEY=your-anon-key-here"
    exit 1
fi

# 安装依赖（如果需要）
if [ ! -d "node_modules" ]; then
    echo "📦 安装前端依赖..."
    npm install
fi

if [ ! -d "server/node_modules" ]; then
    echo "📦 安装后端依赖..."
    cd server && npm install && cd ..
fi

# 启动后端服务器
echo "🔧 启动后端服务器..."
cd server
node server.js &
SERVER_PID=$!
cd ..

# 等待后端服务器启动
sleep 3

# 检查后端服务器是否启动成功
if curl -s http://localhost:3001/api/health > /dev/null; then
    echo "✅ 后端服务器启动成功 (http://localhost:3001)"
    
    # 测试数据库连接
    echo "🔍 测试数据库连接..."
    if curl -s http://localhost:3001/api/test-db | grep -q "success.*true"; then
        echo "✅ 数据库连接正常"
    else
        echo "⚠️  数据库连接测试失败，请检查 Supabase 配置"
        echo "   测试地址: http://localhost:3001/api/test-db"
    fi
else
    echo "❌ 后端服务器启动失败"
    kill $SERVER_PID 2>/dev/null
    exit 1
fi

# 启动前端开发服务器
echo "🎨 启动前端开发服务器..."
npm run dev &
FRONTEND_PID=$!

# 等待前端服务器启动
sleep 5

# 检查前端服务器是否启动成功
if curl -s -I http://localhost:3000 > /dev/null; then
    echo "✅ 前端服务器启动成功 (http://localhost:3000)"
    echo ""
    echo "🎉 系统启动完成！"
    echo "📱 前端地址: http://localhost:3000"
    echo "🔧 后端地址: http://localhost:3001"
    echo "🔑 默认账号: yangda611@gmail.com / chenyang123"
    echo "🔍 数据库测试: http://localhost:3001/api/test-db"
    echo ""
    echo "按 Ctrl+C 停止服务器"
    
    # 等待用户中断
    trap "echo ''; echo '🛑 正在停止服务器...'; kill $SERVER_PID $FRONTEND_PID 2>/dev/null; exit 0" INT
    wait
else
    echo "❌ 前端服务器启动失败"
    kill $SERVER_PID $FRONTEND_PID 2>/dev/null
    exit 1
fi