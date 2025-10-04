/**
 * Content Editor Component
 * Rich text editor for multi-language content with dark sci-fi aesthetic
 */

'use client';

import { useState, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/hooks/use-language';
import type { SupportedLanguage, MultiLanguageText } from '@/types/content';
import { fadeInUp } from '@/utils/animations';
import { Globe, Check } from 'lucide-react';

interface ContentEditorProps {
  value: MultiLanguageText;
  onChange: (value: MultiLanguageText) => void;
  label?: string;
  placeholder?: string;
  multiline?: boolean;
  rows?: number;
  required?: boolean;
  showLanguageTabs?: boolean;
}

export default function ContentEditor({
  value,
  onChange,
  label,
  placeholder = '请输入内容...',
  multiline = false,
  rows = 4,
  required = false,
  showLanguageTabs = true,
}: ContentEditorProps) {
  const { supportedLanguages } = useLanguage();
  const [activeLanguage, setActiveLanguage] = useState<SupportedLanguage>('zh');
  // 编辑模式：plain=纯文本、markdown=Markdown编辑+预览、html=HTML文件导入
  const [mode, setMode] = useState<'plain' | 'markdown' | 'html'>('plain');

  const handleChange = useCallback(
    (lang: SupportedLanguage, text: string) => {
      onChange({
        ...value,
        [lang]: text,
      });
    },
    [value, onChange]
  );

  const getCompletionStatus = (lang: SupportedLanguage) => {
    return value && value[lang] && value[lang].trim().length > 0;
  };

  // 一个非常轻量的 Markdown 渲染（避免新增依赖）。仅处理常见语法，足够预览用。
  const renderMarkdown = useCallback((md: string) => {
    if (!md) return '';
    let html = md;
    const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    // 代码块 ```
    html = html.replace(/```([\s\S]*?)```/g, (_m, p1) => `<pre class="bg-black border border-white/10 rounded p-3 overflow-auto"><code>${esc(p1)}</code></pre>`);
    // 标题 #, ##, ###
    html = html.replace(/^###\s+(.*)$/gm, '<h3 class="text-xl font-semibold mt-3 mb-2">$1</h3>');
    html = html.replace(/^##\s+(.*)$/gm, '<h2 class="text-2xl font-bold mt-4 mb-2">$1</h2>');
    html = html.replace(/^#\s+(.*)$/gm, '<h1 class="text-3xl font-bold mt-4 mb-2">$1</h1>');
    // 粗体/斜体
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    // 行内代码
    html = html.replace(/`([^`]+)`/g, '<code class="px-1 bg-white/10 rounded">$1</code>');
    // 无序列表
    html = html.replace(/^(?:\s*[-\*]\s+.*(?:\n|$))+?/gm, (block) => {
      const items = block
        .trim()
        .split(/\n/)
        .map((line) => line.replace(/^\s*[-\*]\s+/, '').trim())
        .map((t) => `<li class="list-disc ml-6">${t}</li>`)
        .join('');
      return `<ul class="my-2">${items}</ul>`;
    });
    // 段落（简单处理换行）
    html = html.replace(/\n{2,}/g, '</p><p>');
    html = `<p>${html}</p>`;
    return html;
  }, []);

  const markdownPreview = useMemo(() => {
    if (mode !== 'markdown') return '';
    return renderMarkdown(value?.[activeLanguage] || '');
  }, [mode, value, activeLanguage, renderMarkdown]);

  return (
    <motion.div variants={fadeInUp} className="space-y-3">
      {label && (
        <label className="block text-sm font-medium text-white/90">
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}

      {showLanguageTabs && (
        <div className="flex flex-wrap gap-2">
          {supportedLanguages.map((lang) => {
            const isActive = activeLanguage === lang;
            const isCompleted = getCompletionStatus(lang);

            return (
              <button
                key={lang}
                onClick={() => setActiveLanguage(lang)}
                className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-white/10 text-white border border-white/20'
                    : 'bg-white/5 text-white/60 border border-white/10 hover:bg-white/10 hover:text-white'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  {lang.toUpperCase()}
                  {isCompleted && (
                    <Check className="h-3 w-3 text-green-400" />
                  )}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* 编辑模式切换 */}
      <div className="flex items-center gap-2 text-sm">
        <span className="text-white/60">编辑模式:</span>
        <button
          onClick={() => setMode('plain')}
          className={`px-3 py-1.5 rounded border ${mode==='plain'?'bg-white/10 border-white/30':'bg-white/5 border-white/10 hover:bg-white/10'} transition-all`}
        >纯文本</button>
        <button
          onClick={() => setMode('markdown')}
          className={`px-3 py-1.5 rounded border ${mode==='markdown'?'bg-white/10 border-white/30':'bg-white/5 border-white/10 hover:bg-white/10'} transition-all`}
        >Markdown</button>
        <button
          onClick={() => setMode('html')}
          className={`px-3 py-1.5 rounded border ${mode==='html'?'bg-white/10 border-white/30':'bg-white/5 border-white/10 hover:bg-white/10'} transition-all`}
        >HTML导入</button>
      </div>

      {/* 编辑区域 */}
      <div className="relative">
        {mode === 'plain' && (
          multiline ? (
            <textarea
              value={value?.[activeLanguage] || ''}
              onChange={(e) => handleChange(activeLanguage, e.target.value)}
              placeholder={placeholder}
              rows={rows}
              required={required}
              className="w-full px-4 py-3 bg-black border border-white/10 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/20 transition-all resize-none"
            />
          ) : (
            <input
              type="text"
              value={value?.[activeLanguage] || ''}
              onChange={(e) => handleChange(activeLanguage, e.target.value)}
              placeholder={placeholder}
              required={required}
              className="w-full px-4 py-3 bg-black border border-white/10 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/20 transition-all"
            />
          )
        )}

        {mode === 'markdown' && (
          <div className="grid md:grid-cols-2 gap-4">
            <textarea
              value={value?.[activeLanguage] || ''}
              onChange={(e) => handleChange(activeLanguage, e.target.value)}
              placeholder={placeholder + '（Markdown 支持）'}
              rows={Math.max(8, rows)}
              required={required}
              className="w-full px-4 py-3 bg-black border border-white/10 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/20 transition-all resize-none"
            />
            <div className="p-3 bg-white/5 border border-white/10 rounded-lg prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: markdownPreview }} />
          </div>
        )}

        {mode === 'html' && (
          <div className="space-y-3">
            <input
              type="file"
              accept=".html,.htm,.md,.markdown,.txt"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = () => {
                  const text = String(reader.result || '');
                  if (/\.md|\.markdown$/i.test(file.name)) {
                    handleChange(activeLanguage, text);
                  } else if (/\.htm|\.html$/i.test(file.name)) {
                    const match = text.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
                    const bodyInner = match ? match[1] : text;
                    const tmp = bodyInner.replace(/<\/(p|div)>/gi, '\n').replace(/<[^>]+>/g, '');
                    handleChange(activeLanguage, tmp.trim());
                  } else {
                    handleChange(activeLanguage, text);
                  }
                };
                reader.readAsText(file);
              }}
              className="block w-full text-sm text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-white/10 file:text-white/90 hover:file:bg-white/20"
            />
            <textarea
              value={value?.[activeLanguage] || ''}
              onChange={(e) => handleChange(activeLanguage, e.target.value)}
              placeholder={'已导入的内容可在此继续编辑'}
              rows={Math.max(8, rows)}
              className="w-full px-4 py-3 bg-black border border-white/10 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/20 transition-all resize-none"
            />
          </div>
        )}

        {/* Character count */}
        {value?.[activeLanguage] && (
          <div className="absolute bottom-2 right-2 text-xs text-white/40">
            {value[activeLanguage].length} 字符
          </div>
        )}
      </div>

      {/* Translation status indicator */}
      <div className="flex items-center gap-2 text-xs text-white/60">
        <span>翻译进度:</span>
        {supportedLanguages.map((lang) => (
          <span
            key={lang}
            className={`px-2 py-1 rounded ${
              getCompletionStatus(lang)
                ? 'bg-green-500/20 text-green-400'
                : 'bg-white/5 text-white/40'
            }`}
          >
            {lang.toUpperCase()}
          </span>
        ))}
      </div>
    </motion.div>
  );
}
