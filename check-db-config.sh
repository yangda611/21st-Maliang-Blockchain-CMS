#!/bin/bash

echo "🔍 检查数据库配置..."

# 检查环境变量文件是否存在
if [ ! -f "server/.env" ]; then
    echo "❌ 环境变量文件不存在: server/.env"
    echo "请运行: cp server/.env.example server/.env"
    exit 1
fi

# 检查 Supabase URL 配置
if ! grep -q "SUPABASE_URL=https://" server/.env; then
    echo "❌ SUPABASE_URL 未正确配置"
    echo "请在 server/.env 中设置: SUPABASE_URL=https://your-project-id.supabase.co"
    exit 1
fi

# 检查 Supabase Key 配置
if ! grep -q "SUPABASE_ANON_KEY=" server/.env; then
    echo "❌ SUPABASE_ANON_KEY 未配置"
    echo "请在 server/.env 中设置: SUPABASE_ANON_KEY=your-anon-key-here"
    exit 1
fi

# 提取配置信息
SUPABASE_URL=$(grep "SUPABASE_URL=" server/.env | cut -d'=' -f2)
SUPABASE_KEY=$(grep "SUPABASE_ANON_KEY=" server/.env | cut -d'=' -f2)

echo "✅ 环境变量配置检查通过"
echo "📊 Supabase URL: $SUPABASE_URL"
echo "🔑 Supabase Key: ${SUPABASE_KEY:0:20}..."

# 检查服务器是否运行
if ! curl -s http://localhost:3001/api/health > /dev/null; then
    echo "⚠️  后端服务器未运行，请先启动服务器"
    echo "运行: cd server && npm run dev"
    exit 1
fi

# 测试数据库连接
echo "🔍 测试数据库连接..."
RESPONSE=$(curl -s http://localhost:3001/api/test-db)

if echo "$RESPONSE" | grep -q "success.*true"; then
    echo "✅ 数据库连接正常"
    echo "🎉 配置检查完成，系统可以正常使用！"
else
    echo "❌ 数据库连接失败"
    echo "响应: $RESPONSE"
    echo ""
    echo "请检查:"
    echo "1. Supabase 项目是否正常运行"
    echo "2. 网络连接是否正常"
    echo "3. 环境变量配置是否正确"
fi