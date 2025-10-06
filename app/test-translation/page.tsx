/**
 * Translation Test Page
 * 用于测试和验证批量翻译功能的页面
 */

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import ContentEditor from '@/components/admin/content-editor';
import type { MultiLanguageText, SupportedLanguage } from '@/types/content';
import { fadeInUp } from '@/utils/animations';
import { initializeTranslation, getDefaultTranslationConfig } from '@/lib/services/translation-service';

export default function TranslationTestPage() {
  const [content, setContent] = useState<MultiLanguageText>({
    zh: '欢迎使用21世纪马良区块链CMS系统！这是一个功能强大的内容管理系统，支持多语言翻译和实时编辑。',
    en: '',
    ja: '',
    ko: '',
    ar: '',
    es: ''
  });

  const [testResults, setTestResults] = useState<string[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  const addTestResult = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setTestResults(prev => [`[${timestamp}] ${message}`, ...prev.slice(0, 9)]);
  };

  const initializeTranslationService = () => {
    try {
      const config = getDefaultTranslationConfig();
      initializeTranslation(config);
      setIsInitialized(true);
      addTestResult('✅ 翻译服务初始化成功');
    } catch (error) {
      addTestResult(`❌ 翻译服务初始化失败: ${error instanceof Error ? error.message : '未知错误'}`);
    }
  };

  const runBasicTest = () => {
    addTestResult('🧪 开始基础翻译测试...');
    
    if (!content.zh?.trim()) {
      addTestResult('⚠️ 请先输入中文内容');
      return;
    }

    addTestResult(`📝 测试内容: ${content.zh.substring(0, 50)}...`);
    addTestResult('🎯 目标语言: EN, JA, KO, AR, ES');
  };

  const runPartialSuccessTest = () => {
    addTestResult('🧪 开始部分成功测试...');
    
    // 设置一个可能导致部分翻译失败的场景
    const testContent = '这是一个包含特殊字符的测试：🚀✨💎，以及一些复杂的技术术语：Blockchain, CMS, API';
    setContent({
      zh: testContent,
      en: '',
      ja: '',
      ko: '',
      ar: '',
      es: ''
    });
    
    addTestResult('📝 已设置包含特殊字符的测试内容');
  };

  const runErrorHandlingTest = () => {
    addTestResult('🧪 开始错误处理测试...');
    
    // 设置空内容来测试错误处理
    setContent({
      zh: '',
      en: '',
      ja: '',
      ko: '',
      ar: '',
      es: ''
    });
    
    addTestResult('📝 已设置空内容用于测试错误处理');
  };

  const clearResults = () => {
    setTestResults([]);
    addTestResult('🧹 测试结果已清空');
  };

  const resetContent = () => {
    setContent({
      zh: '欢迎使用21世纪马良区块链CMS系统！这是一个功能强大的内容管理系统，支持多语言翻译和实时编辑。',
      en: '',
      ja: '',
      ko: '',
      ar: '',
      es: ''
    });
    addTestResult('🔄 内容已重置为默认值');
  };

  const exportResults = () => {
    const testData = {
      timestamp: new Date().toISOString(),
      content,
      testResults,
      environment: {
        userAgent: navigator.userAgent,
        language: navigator.language,
        nodeEnv: process.env.NODE_ENV
      }
    };

    const blob = new Blob([JSON.stringify(testData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `translation-test-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    addTestResult('📤 测试结果已导出');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 p-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {/* 页面标题 */}
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold text-white mb-2">
              🧪 批量翻译功能测试
            </h1>
            <p className="text-white/60">
              测试和验证批量翻译功能的完整性和健壮性
            </p>
          </div>

          {/* 初始化状态 */}
          {!isInitialized && (
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 text-center">
              <p className="text-yellow-400 mb-4">翻译服务尚未初始化</p>
              <button
                onClick={initializeTranslationService}
                className="px-6 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-colors"
              >
                初始化翻译服务
              </button>
            </div>
          )}

          {/* 测试控制面板 */}
          {isInitialized && (
            <div className="bg-black/40 backdrop-blur-lg border border-white/10 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">🎮 测试控制</h2>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                <button
                  onClick={runBasicTest}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors text-sm"
                >
                  基础翻译测试
                </button>
                <button
                  onClick={runPartialSuccessTest}
                  className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors text-sm"
                >
                  部分成功测试
                </button>
                <button
                  onClick={runErrorHandlingTest}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors text-sm"
                >
                  错误处理测试
                </button>
                <button
                  onClick={clearResults}
                  className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors text-sm"
                >
                  清空结果
                </button>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={resetContent}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors text-sm"
                >
                  重置内容
                </button>
                <button
                  onClick={exportResults}
                  className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors text-sm"
                >
                  导出结果
                </button>
              </div>
            </div>
          )}

          {/* 内容编辑器 */}
          {isInitialized && (
            <div className="bg-black/40 backdrop-blur-lg border border-white/10 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">📝 内容编辑器</h2>
              <ContentEditor
                value={content}
                onChange={setContent}
                label="测试内容"
                placeholder="请输入要翻译测试的内容..."
                multiline={true}
                rows={4}
                showLanguageTabs={true}
              />
            </div>
          )}

          {/* 测试结果 */}
          {testResults.length > 0 && (
            <div className="bg-black/40 backdrop-blur-lg border border-white/10 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">📊 测试结果</h2>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {testResults.map((result, index) => (
                  <div
                    key={index}
                    className={`text-sm p-2 rounded font-mono ${
                      result.includes('✅') ? 'bg-green-500/10 text-green-400' :
                      result.includes('❌') ? 'bg-red-500/10 text-red-400' :
                      result.includes('⚠️') ? 'bg-yellow-500/10 text-yellow-400' :
                      result.includes('🧪') ? 'bg-blue-500/10 text-blue-400' :
                      'bg-white/5 text-white/60'
                    }`}
                  >
                    {result}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 当前内容状态 */}
          {isInitialized && (
            <div className="bg-black/40 backdrop-blur-lg border border-white/10 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">📈 内容状态</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {Object.entries(content).map(([lang, text]) => (
                  <div key={lang} className="text-center">
                    <div className="text-lg font-bold text-white mb-1">{lang.toUpperCase()}</div>
                    <div className={`text-xs px-2 py-1 rounded ${
                      text?.trim() 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-gray-500/20 text-gray-400'
                    }`}>
                      {text?.trim() ? `${text.length} 字符` : '空'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 使用说明 */}
          <div className="bg-black/40 backdrop-blur-lg border border-white/10 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">📖 使用说明</h2>
            <div className="space-y-2 text-white/60 text-sm">
              <p>1. 点击"初始化翻译服务"按钮初始化翻译功能</p>
              <p>2. 在内容编辑器中输入或编辑测试内容</p>
              <p>3. 点击"翻译所有未完成语言"按钮进行批量翻译</p>
              <p>4. 观察翻译过程和结果，查看调试面板获取详细信息</p>
              <p>5. 运行不同的测试场景验证功能健壮性</p>
              <p>6. 开发环境下可点击"🐛 调试"按钮查看详细调试信息</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
