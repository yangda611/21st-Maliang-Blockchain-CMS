'use client';

import { useState } from 'react';

export default function DebugIP() {
  const [testIP, setTestIP] = useState('210.140.92.183'); // 日本IP
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testIPDetection = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/test-ip?ip=${testIP}`);
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ error: error instanceof Error ? error.message : 'Unknown error' });
    } finally {
      setLoading(false);
    }
  };

  const testWithIPHeader = async (ip: string) => {
    setLoading(true);
    try {
      // 创建一个测试端点来模拟不同的IP头
      const response = await fetch('/api/test-redirect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Forwarded-For': ip,
        },
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ error: error instanceof Error ? error.message : 'Unknown error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">IP检测调试工具</h1>
        
        <div className="bg-gray-900 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">手动IP测试</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">测试IP地址:</label>
              <input
                type="text"
                value={testIP}
                onChange={(e) => setTestIP(e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white"
                placeholder="输入IP地址"
              />
            </div>
            <button
              onClick={testIPDetection}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 rounded"
            >
              {loading ? '测试中...' : '测试IP检测'}
            </button>
          </div>
        </div>

        <div className="bg-gray-900 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">预设IP测试</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => testWithIPHeader('210.140.92.183')}
              disabled={loading}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 rounded"
            >
              测试日本IP (210.140.92.183)
            </button>
            <button
              onClick={() => testWithIPHeader('8.8.8.8')}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 rounded"
            >
              测试美国IP (8.8.8.8)
            </button>
            <button
              onClick={() => testWithIPHeader('114.114.114.114')}
              disabled={loading}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 rounded"
            >
              测试中国IP (114.114.114.114)
            </button>
            <button
              onClick={() => testWithIPHeader('168.126.63.1')}
              disabled={loading}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 rounded"
            >
              测试韩国IP (168.126.63.1)
            </button>
          </div>
        </div>

        {result && (
          <div className="bg-gray-900 rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">测试结果</h2>
            <pre className="bg-gray-800 p-4 rounded overflow-x-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}

        <div className="bg-gray-900 rounded-lg p-6 mt-8">
          <h2 className="text-2xl font-semibold mb-4">说明</h2>
          <div className="space-y-2 text-gray-300">
            <p>• 这个工具用于调试IP检测功能</p>
            <p>• 可以手动输入IP地址进行测试</p>
            <p>• 也可以使用预设的国家IP进行测试</p>
            <p>• 查看控制台日志获取详细的调试信息</p>
          </div>
        </div>
      </div>
    </div>
  );
}
