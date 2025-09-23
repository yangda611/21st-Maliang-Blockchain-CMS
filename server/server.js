const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// 初始化 Supabase 客户端
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Supabase 环境变量未配置');
  console.error('请设置 SUPABASE_URL 和 SUPABASE_ANON_KEY 环境变量');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
console.log('✅ Supabase 客户端初始化成功');

// 中间件
app.use(cors());
app.use(express.json());

// 数据库查询函数
async function getUserByEmail(email) {
  try {
    const { data, error } = await supabase
      .from('admin_users')
      .select('*')
      .eq('email', email)
      .eq('is_active', true)
      .single();

    if (error) {
      console.error('数据库查询错误:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('查询用户失败:', error);
    return null;
  }
}

async function updateLastLogin(userId) {
  try {
    const { error } = await supabase
      .from('admin_users')
      .update({ last_login: new Date().toISOString() })
      .eq('id', userId);

    if (error) {
      console.error('更新登录时间失败:', error);
    }
  } catch (error) {
    console.error('更新登录时间失败:', error);
  }
}

// 数据库查询函数
async function getDashboardStats() {
  try {
    // 获取总用户数
    const { count: totalUsers, error: totalError } = await supabase
      .from('admin_users')
      .select('*', { count: 'exact', head: true });

    if (totalError) {
      console.error('获取总用户数失败:', totalError);
      return null;
    }

    // 获取活跃用户数（最近7天有登录记录）
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const { count: activeUsers, error: activeError } = await supabase
      .from('admin_users')
      .select('*', { count: 'exact', head: true })
      .gte('last_login', sevenDaysAgo.toISOString())
      .eq('is_active', true);

    if (activeError) {
      console.error('获取活跃用户数失败:', activeError);
      return null;
    }

    // 获取新增用户数（最近30天注册）
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const { count: newUsers, error: newError } = await supabase
      .from('admin_users')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', thirtyDaysAgo.toISOString());

    if (newError) {
      console.error('获取新增用户数失败:', newError);
      return null;
    }

    // 计算增长率（简化计算）
    const growthRate = totalUsers > 0 ? ((newUsers / totalUsers) * 100) : 0;

    return {
      totalUsers: totalUsers || 0,
      activeUsers: activeUsers || 0,
      newUsers: newUsers || 0,
      growthRate: Math.round(growthRate * 10) / 10
    };
  } catch (error) {
    console.error('获取统计数据失败:', error);
    return null;
  }
}

async function getTopUsers() {
  try {
    const { data: users, error } = await supabase
      .from('admin_users')
      .select('id, email, last_login, is_active, created_at')
      .order('last_login', { ascending: false })
      .limit(10);

    if (error) {
      console.error('获取用户列表失败:', error);
      return [];
    }

    return users.map(user => ({
      id: user.id,
      username: user.email.split('@')[0], // 使用邮箱前缀作为用户名
      email: user.email,
      lastLogin: user.last_login ? new Date(user.last_login).toLocaleString('zh-CN') : '从未登录',
      status: user.is_active ? 'active' : 'inactive'
    }));
  } catch (error) {
    console.error('获取用户列表失败:', error);
    return [];
  }
}

// 生成模拟图表数据
const generateChartData = () => {
  const now = new Date();
  const userGrowthData = [];
  const userActivityData = [];
  
  // 生成过去30天的用户增长数据
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    userGrowthData.push({
      name: date.toISOString().split('T')[0],
      value: Math.floor(Math.random() * 50) + 20
    });
  }
  
  // 生成过去7天的用户活跃度数据
  for (let i = 6; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    userActivityData.push({
      name: date.toISOString().split('T')[0],
      value: Math.floor(Math.random() * 200) + 100
    });
  }
  
  return { userGrowthData, userActivityData };
};

// 初始化图表数据
const { userGrowthData, userActivityData } = generateChartData();
dashboardData.userGrowthData = userGrowthData;
dashboardData.userActivityData = userActivityData;

// JWT 验证中间件
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: '访问令牌缺失' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: '访问令牌无效' });
    }
    req.user = user;
    next();
  });
};

// 路由

// 登录
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    console.log('登录请求:', { username });

    // 从数据库查找用户
    const user = await getUserByEmail(username);
    if (!user) {
      console.log('用户不存在:', username);
      return res.status(401).json({ error: '用户名或密码错误' });
    }

    console.log('找到用户:', { id: user.id, email: user.email, role: user.role });

    // 验证密码（简单字符串比较，因为您的数据库存储的是明文密码）
    if (user.password !== password) {
      console.log('密码验证失败');
      return res.status(401).json({ error: '用户名或密码错误' });
    }

    // 更新最后登录时间
    await updateLastLogin(user.id);

    // 生成 JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log('登录成功:', { id: user.id, email: user.email });

    res.json({
      user: {
        id: user.id,
        username: user.email, // 使用 email 作为 username
        email: user.email,
        role: user.role
      },
      token
    });
  } catch (error) {
    console.error('登录过程出错:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
});

// 获取用户信息
app.get('/api/auth/profile', authenticateToken, async (req, res) => {
  try {
    const { data: user, error } = await supabase
      .from('admin_users')
      .select('id, email, role, created_at, last_login')
      .eq('id', req.user.id)
      .single();

    if (error || !user) {
      return res.status(404).json({ error: '用户不存在' });
    }

    res.json({
      id: user.id,
      username: user.email,
      email: user.email,
      role: user.role,
      created_at: user.created_at,
      last_login: user.last_login
    });
  } catch (error) {
    console.error('获取用户信息失败:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
});

// 退出登录
app.post('/api/auth/logout', authenticateToken, (req, res) => {
  res.json({ message: '退出成功' });
});

// 获取仪表板数据
app.get('/api/dashboard', authenticateToken, async (req, res) => {
  try {
    console.log('获取仪表板数据请求');

    // 获取统计数据
    const userStats = await getDashboardStats();
    if (!userStats) {
      return res.status(500).json({ error: '获取统计数据失败' });
    }

    // 获取用户列表
    const topUsers = await getTopUsers();

    // 生成图表数据（基于真实数据）
    const { userGrowthData, userActivityData } = generateChartData();

    const dashboardData = {
      userStats,
      userGrowthData,
      userActivityData,
      topUsers
    };

    console.log('仪表板数据获取成功:', {
      totalUsers: userStats.totalUsers,
      activeUsers: userStats.activeUsers,
      newUsers: userStats.newUsers,
      topUsersCount: topUsers.length
    });

    res.json(dashboardData);
  } catch (error) {
    console.error('获取仪表板数据失败:', error);
    res.status(500).json({ error: '获取仪表板数据失败' });
  }
});

// 刷新仪表板数据
app.get('/api/dashboard/refresh', authenticateToken, async (req, res) => {
  try {
    console.log('刷新仪表板数据请求');

    // 获取最新统计数据
    const userStats = await getDashboardStats();
    if (!userStats) {
      return res.status(500).json({ error: '获取统计数据失败' });
    }

    // 获取最新用户列表
    const topUsers = await getTopUsers();

    // 生成新的图表数据
    const { userGrowthData, userActivityData } = generateChartData();

    const dashboardData = {
      userStats,
      userGrowthData,
      userActivityData,
      topUsers
    };

    console.log('仪表板数据刷新成功:', {
      totalUsers: userStats.totalUsers,
      activeUsers: userStats.activeUsers,
      newUsers: userStats.newUsers,
      topUsersCount: topUsers.length
    });

    res.json(dashboardData);
  } catch (error) {
    console.error('刷新仪表板数据失败:', error);
    res.status(500).json({ error: '刷新仪表板数据失败' });
  }
});

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// 数据库连接测试
app.get('/api/test-db', async (req, res) => {
  try {
    console.log('测试数据库连接...');
    
    // 测试 Supabase 连接
    const { data, error } = await supabase
      .from('admin_users')
      .select('count')
      .limit(1);

    if (error) {
      console.error('数据库连接测试失败:', error);
      return res.status(500).json({ 
        success: false, 
        message: `数据库连接失败: ${error.message}`,
        error: error
      });
    }

    console.log('数据库连接测试成功');
    res.json({ 
      success: true, 
      message: '数据库连接正常',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('数据库连接测试异常:', error);
    res.status(500).json({ 
      success: false, 
      message: '数据库连接测试异常',
      error: error.message
    });
  }
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`🚀 API 服务器运行在 http://localhost:${PORT}`);
  console.log(`📊 仪表板 API: http://localhost:${PORT}/api/dashboard`);
  console.log(`🔐 认证 API: http://localhost:${PORT}/api/auth/login`);
  console.log(`🔍 数据库测试: http://localhost:${PORT}/api/test-db`);
  console.log(`💚 健康检查: http://localhost:${PORT}/api/health`);
  console.log('');
  console.log('📝 请确保已配置 Supabase 环境变量:');
  console.log('   - SUPABASE_URL');
  console.log('   - SUPABASE_ANON_KEY');
});

module.exports = app;