const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// 中间件
app.use(cors());
app.use(express.json());

// 模拟用户数据
const users = [
  {
    id: '1',
    username: 'admin',
    email: 'admin@cms.com',
    password: '$2a$10$4SaPvJBJ3tiLQjYxHaXg3.37CVgdFBVurxXW4B538RRIEaXPt3guO', // admin123
    role: 'admin'
  }
];

// 模拟数据库数据
let dashboardData = {
  userStats: {
    totalUsers: 1248,
    activeUsers: 892,
    newUsers: 45,
    growthRate: 12.5
  },
  userGrowthData: [],
  userActivityData: [],
  topUsers: [
    {
      id: '1',
      username: '张三',
      email: 'zhangsan@example.com',
      lastLogin: '2024-01-15 14:30:00',
      status: 'active'
    },
    {
      id: '2',
      username: '李四',
      email: 'lisi@example.com',
      lastLogin: '2024-01-15 13:45:00',
      status: 'active'
    },
    {
      id: '3',
      username: '王五',
      email: 'wangwu@example.com',
      lastLogin: '2024-01-15 12:20:00',
      status: 'inactive'
    },
    {
      id: '4',
      username: '赵六',
      email: 'zhaoliu@example.com',
      lastLogin: '2024-01-15 11:15:00',
      status: 'active'
    },
    {
      id: '5',
      username: '钱七',
      email: 'qianqi@example.com',
      lastLogin: '2024-01-15 10:30:00',
      status: 'active'
    }
  ]
};

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

    // 查找用户
    const user = users.find(u => u.username === username);
    if (!user) {
      return res.status(401).json({ error: '用户名或密码错误' });
    }

    // 验证密码
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: '用户名或密码错误' });
    }

    // 生成 JWT token
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      },
      token
    });
  } catch (error) {
    res.status(500).json({ error: '服务器内部错误' });
  }
});

// 获取用户信息
app.get('/api/auth/profile', authenticateToken, (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  if (!user) {
    return res.status(404).json({ error: '用户不存在' });
  }

  res.json({
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role
  });
});

// 退出登录
app.post('/api/auth/logout', authenticateToken, (req, res) => {
  res.json({ message: '退出成功' });
});

// 获取仪表板数据
app.get('/api/dashboard', authenticateToken, (req, res) => {
  // 模拟数据更新
  const { userGrowthData, userActivityData } = generateChartData();
  dashboardData.userGrowthData = userGrowthData;
  dashboardData.userActivityData = userActivityData;
  
  // 随机更新统计数据
  dashboardData.userStats = {
    totalUsers: 1248 + Math.floor(Math.random() * 20),
    activeUsers: 892 + Math.floor(Math.random() * 15),
    newUsers: 45 + Math.floor(Math.random() * 10),
    growthRate: 12.5 + (Math.random() - 0.5) * 2
  };

  res.json(dashboardData);
});

// 刷新仪表板数据
app.get('/api/dashboard/refresh', authenticateToken, (req, res) => {
  // 生成新的图表数据
  const { userGrowthData, userActivityData } = generateChartData();
  dashboardData.userGrowthData = userGrowthData;
  dashboardData.userActivityData = userActivityData;
  
  // 随机更新统计数据
  dashboardData.userStats = {
    totalUsers: 1248 + Math.floor(Math.random() * 20),
    activeUsers: 892 + Math.floor(Math.random() * 15),
    newUsers: 45 + Math.floor(Math.random() * 10),
    growthRate: 12.5 + (Math.random() - 0.5) * 2
  };

  res.json(dashboardData);
});

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`🚀 API 服务器运行在 http://localhost:${PORT}`);
  console.log(`📊 仪表板 API: http://localhost:${PORT}/api/dashboard`);
  console.log(`🔐 认证 API: http://localhost:${PORT}/api/auth/login`);
});

module.exports = app;