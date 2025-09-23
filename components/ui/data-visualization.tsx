'use client';

import React, { useState, useEffect } from 'react';
import { BarChart, LineChart } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface UserData {
  date: string;
  count: number;
}

interface ContentData {
  date: string;
  count: number;
}

export function DataVisualization() {
  const [userData, setUserData] = useState<UserData[]>([]);
  const [contentData, setContentData] = useState<ContentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');

  useEffect(() => {
    fetchData();
  }, [timeRange]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // 为了演示目的，我们使用模拟数据
      // 在实际应用中，这里会从Supabase获取真实数据
      generateMockData();
    } catch (error) {
      console.error('获取数据失败:', error);
      generateMockData();
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchData();
  };

  // 模拟数据（如果没有真实数据）
  const generateMockData = () => {
    const mockUserData: UserData[] = [];
    const mockContentData: ContentData[] = [];
    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;

    for (let i = days; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split('T')[0];

      mockUserData.push({
        date: dateString,
        count: Math.floor(Math.random() * 100) + 50
      });

      mockContentData.push({
        date: dateString,
        count: Math.floor(Math.random() * 50) + 20
      });
    }

    setUserData(mockUserData);
    setContentData(mockContentData);
  };

  // 如果没有真实数据，使用模拟数据
  useEffect(() => {
    if (userData.length === 0 && contentData.length === 0 && !loading) {
      generateMockData();
    }
  }, [loading, userData.length, contentData.length]);

  return (
    <div className="space-y-6">
      {/* 控制面板 */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 animate-fade-in-up">
        <h2 className="text-2xl font-bold">数据概览</h2>
        <div className="flex flex-wrap gap-3">
          <div className="flex gap-1 bg-secondary rounded-lg p-1 animate-fade-in-up animate-delay-100">
            <button
              onClick={() => setTimeRange('7d')}
              className={`px-3 py-1 rounded-md text-sm transition-colors ${
                timeRange === '7d'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-foreground hover:bg-muted'
              }`}
            >
              最近7天
            </button>
            <button
              onClick={() => setTimeRange('30d')}
              className={`px-3 py-1 rounded-md text-sm transition-colors ${
                timeRange === '30d'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-foreground hover:bg-muted'
              }`}
            >
              最近30天
            </button>
            <button
              onClick={() => setTimeRange('90d')}
              className={`px-3 py-1 rounded-md text-sm transition-colors ${
                timeRange === '90d'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-foreground hover:bg-muted'
              }`}
            >
              最近90天
            </button>
          </div>
          <button
            onClick={handleRefresh}
            className="px-4 py-2 bg-secondary text-foreground rounded-lg hover:bg-muted transition-colors flex items-center gap-2 animate-fade-in-up animate-delay-200"
          >
            <span>刷新</span>
          </button>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card border border-border rounded-xl p-6 card-gradient-border animate-fade-in-up animate-delay-300">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">总用户数</h3>
            <div className="p-3 bg-blue-500/20 rounded-lg">
              <div className="w-6 h-6 text-blue-500">👥</div>
            </div>
          </div>
          <p className="text-3xl font-bold mt-4">1,248</p>
          <p className="text-sm text-muted-foreground mt-2">较上月增长 12.4%</p>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 card-gradient-border animate-fade-in-up animate-delay-400">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">内容总数</h3>
            <div className="p-3 bg-green-500/20 rounded-lg">
              <div className="w-6 h-6 text-green-500">📝</div>
            </div>
          </div>
          <p className="text-3xl font-bold mt-4">3,842</p>
          <p className="text-sm text-muted-foreground mt-2">较上月增长 8.2%</p>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 card-gradient-border animate-fade-in-up animate-delay-500">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">活跃用户</h3>
            <div className="p-3 bg-purple-500/20 rounded-lg">
              <div className="w-6 h-6 text-purple-500">⚡</div>
            </div>
          </div>
          <p className="text-3xl font-bold mt-4">856</p>
          <p className="text-sm text-muted-foreground mt-2">24小时内活跃</p>
        </div>
      </div>

      {/* 图表区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 用户数据图表 */}
        <div className="bg-card border border-border rounded-xl p-6 card-gradient-border animate-fade-in-up animate-delay-600">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <BarChart className="w-5 h-5 text-blue-500" />
              用户增长趋势
            </h3>
          </div>
          <div className="h-80 flex items-center justify-center">
            {loading ? (
              <div className="flex flex-col items-center gap-2">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                <p className="text-muted-foreground">加载数据中...</p>
              </div>
            ) : userData.length > 0 ? (
              <div className="w-full h-full flex items-end gap-2">
                {userData.map((item, index) => (
                  <div key={index} className="flex flex-col items-center flex-1 animate-fade-in-up" style={{ animationDelay: `${index * 50}ms` }}>
                    <div
                      className="w-full bg-blue-500 rounded-t hover:bg-blue-600 transition-colors"
                      style={{
                        height: `${(item.count / Math.max(...userData.map(d => d.count))) * 100}%`
                      }}
                    ></div>
                    <span className="text-xs text-muted-foreground mt-2">
                      {new Date(item.date).getDate()}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center">
                <p className="text-muted-foreground">暂无用户数据</p>
                <button
                  onClick={generateMockData}
                  className="mt-2 px-4 py-2 bg-secondary text-foreground rounded-lg hover:bg-muted transition-colors"
                >
                  生成示例数据
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 内容数据图表 */}
        <div className="bg-card border border-border rounded-xl p-6 card-gradient-border animate-fade-in-up animate-delay-700">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <LineChart className="w-5 h-5 text-green-500" />
              内容发布趋势
            </h3>
          </div>
          <div className="h-80 flex items-center justify-center">
            {loading ? (
              <div className="flex flex-col items-center gap-2">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
                <p className="text-muted-foreground">加载数据中...</p>
              </div>
            ) : contentData.length > 0 ? (
              <div className="w-full h-full relative">
                <div className="absolute inset-0 flex items-end">
                  {contentData.map((item, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center animate-fade-in-up" style={{ animationDelay: `${index * 50}ms` }}>
                      <div
                        className="w-2 bg-green-500 rounded-t hover:bg-green-600 transition-colors"
                        style={{
                          height: `${(item.count / Math.max(...contentData.map(d => d.count))) * 100}%`
                        }}
                      ></div>
                    </div>
                  ))}
                </div>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    <path
                      d={`M ${contentData
                        .map(
                          (item, index) =>
                            `${(index / (contentData.length - 1)) * 100} ${
                              100 - (item.count / Math.max(...contentData.map(d => d.count))) * 100
                            }`
                        )
                        .join(' L ')}`}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="0.5"
                      className="text-green-500"
                    />
                  </svg>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-muted-foreground">暂无内容数据</p>
                <button
                  onClick={generateMockData}
                  className="mt-2 px-4 py-2 bg-secondary text-foreground rounded-lg hover:bg-muted transition-colors"
                >
                  生成示例数据
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 数据表格 */}
      <div className="bg-card border border-border rounded-xl p-6 card-gradient-border animate-fade-in-up animate-delay-800">
        <h3 className="text-lg font-semibold mb-6">详细数据</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4">日期</th>
                <th className="text-left py-3 px-4">新增用户</th>
                <th className="text-left py-3 px-4">内容发布</th>
                <th className="text-left py-3 px-4">活跃度</th>
              </tr>
            </thead>
            <tbody>
              {userData.length > 0 ? (
                userData.slice(-5).map((item, index) => (
                  <tr key={index} className="border-b border-border last:border-0 animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                    <td className="py-3 px-4">{item.date}</td>
                    <td className="py-3 px-4">{item.count}</td>
                    <td className="py-3 px-4">
                      {contentData[index]?.count || 0}
                    </td>
                    <td className="py-3 px-4">
                      <div className="w-24 bg-secondary rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{
                            width: `${(item.count / Math.max(...userData.map(d => d.count))) * 100}%`
                          }}
                        ></div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="text-center py-8 text-muted-foreground">
                    暂无数据
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}