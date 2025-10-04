/**
 * Static Page Manager Component
 * CRUD interface for static pages (About Us, Contact, etc.)
 */

'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStaticPages } from '@/hooks/use-content';
import { staticPageService } from '@/lib/services/static-page-service';
import ContentEditor from './content-editor';
import type { StaticPage, MultiLanguageText } from '@/types/content';
import { fadeInUp, staggerContainer } from '@/utils/animations';
import { Plus, Edit, Trash2, FileText, Globe } from 'lucide-react';
import { generateSlug } from '@/utils/seo';

interface PageFormData {
  title: MultiLanguageText;
  content: MultiLanguageText;
  slug: string;
  metaTitle?: MultiLanguageText;
  metaDescription?: MultiLanguageText;
  translationStatus: 'draft' | 'pending_review' | 'published';
  isPublished: boolean;
}

export default function StaticPageManager() {
  const [pages, setPages] = useState<StaticPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<PageFormData>({
    title: {},
    content: {},
    slug: '',
    metaTitle: {},
    metaDescription: {},
    translationStatus: 'draft',
    isPublished: false,
  });

  const { getList } = useStaticPages();

  useEffect(() => {
    loadPages();
  }, []);

  const loadPages = async () => {
    setLoading(true);
    const result = await getList(1, 100);
    if (result.success && result.data) {
      setPages(result.data.data);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingId) {
        await staticPageService.update(editingId, formData);
      } else {
        await staticPageService.create(formData);
      }

      setShowForm(false);
      setEditingId(null);
      resetForm();
      loadPages();
    } catch (error) {
      console.error('Failed to save page:', error);
    }
  };

  const handleEdit = (page: StaticPage) => {
    setFormData({
      title: page.title,
      content: page.content,
      slug: page.slug,
      metaTitle: page.metaTitle,
      metaDescription: page.metaDescription,
      translationStatus: page.translationStatus,
      isPublished: page.isPublished,
    });
    setEditingId(page.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除此页面吗？')) return;

    try {
      await staticPageService.delete(id);
      loadPages();
    } catch (error) {
      console.error('Failed to delete page:', error);
    }
  };

  const handleTogglePublish = async (id: string, isPublished: boolean) => {
    try {
      if (isPublished) {
        await staticPageService.unpublish(id);
      } else {
        await staticPageService.publish(id);
      }
      loadPages();
    } catch (error) {
      console.error('Failed to toggle publish status:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: {},
      content: {},
      slug: '',
      metaTitle: {},
      metaDescription: {},
      translationStatus: 'draft',
      isPublished: false,
    });
  };

  const handleTitleChange = (title: MultiLanguageText) => {
    setFormData((prev) => ({
      ...prev,
      title,
      slug: prev.slug || generateSlug(title.zh || title.en || ''),
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">静态页面管理</h1>
          <p className="text-white/60 mt-1">管理关于我们、联系方式等静态页面</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setEditingId(null);
            setShowForm(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg transition-all"
        >
          <Plus className="h-5 w-5" />
          <span>新建页面</span>
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={() => setShowForm(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-4xl bg-black border border-white/20 rounded-xl p-6 max-h-[90vh] overflow-y-auto"
            >
              <h2 className="text-2xl font-bold mb-6">
                {editingId ? '编辑页面' : '新建页面'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <ContentEditor
                  value={formData.title}
                  onChange={handleTitleChange}
                  label="页面标题"
                  required
                />

                <ContentEditor
                  value={formData.content}
                  onChange={(content) => setFormData({ ...formData, content })}
                  label="页面内容"
                  multiline
                  rows={12}
                  required
                />

                <div>
                  <label className="block text-sm font-medium text-white/90 mb-2">
                    URL Slug
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full px-4 py-3 bg-black border border-white/10 rounded-lg text-white focus:outline-none focus:border-white/30"
                    required
                  />
                </div>

                <div className="border-t border-white/10 pt-6">
                  <h3 className="text-lg font-medium mb-4">SEO 设置</h3>
                  
                  <div className="space-y-4">
                    <ContentEditor
                      value={formData.metaTitle || {}}
                      onChange={(metaTitle) => setFormData({ ...formData, metaTitle })}
                      label="SEO 标题"
                      placeholder="页面的 SEO 标题 (建议 50-60 字符)"
                    />

                    <ContentEditor
                      value={formData.metaDescription || {}}
                      onChange={(metaDescription) => setFormData({ ...formData, metaDescription })}
                      label="SEO 描述"
                      multiline
                      rows={3}
                      placeholder="页面的 SEO 描述 (建议 150-160 字符)"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isPublished"
                    checked={formData.isPublished}
                    onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                    className="h-4 w-4 rounded border-white/20 bg-black"
                  />
                  <label htmlFor="isPublished" className="text-sm text-white/90">
                    立即发布
                  </label>
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg transition-all font-medium"
                  >
                    {editingId ? '更新' : '创建'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setEditingId(null);
                      resetForm();
                    }}
                    className="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-all"
                  >
                    取消
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin h-8 w-8 border-2 border-white/20 border-t-white rounded-full" />
        </div>
      ) : (
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid gap-4"
        >
          {pages.map((page) => (
            <motion.div
              key={page.id}
              variants={fadeInUp}
              className="p-6 bg-black border border-white/10 rounded-lg hover:border-white/20 transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Globe className="h-5 w-5 text-white/60" />
                    <h3 className="text-xl font-medium">
                      {page.title.zh || page.title.en}
                    </h3>
                  </div>
                  
                  <p className="text-sm text-white/60 line-clamp-2 mb-3">
                    {page.content.zh?.substring(0, 150) || page.content.en?.substring(0, 150)}
                  </p>

                  <div className="flex items-center gap-3 text-xs text-white/40">
                    <span>Slug: /{page.slug}</span>
                    <span>•</span>
                    <span>更新: {new Date(page.updatedAt).toLocaleDateString('zh-CN')}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleTogglePublish(page.id, page.isPublished)}
                    className={`px-3 py-1.5 rounded-lg border transition-all text-sm ${
                      page.isPublished
                        ? 'bg-green-500/20 border-green-500/50 text-green-400'
                        : 'bg-white/5 border-white/10 text-white/60'
                    }`}
                  >
                    {page.isPublished ? '已发布' : '草稿'}
                  </button>
                  <button
                    onClick={() => handleEdit(page)}
                    className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-all"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(page.id)}
                    className="p-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/50 rounded-lg transition-all text-red-400"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}

          {pages.length === 0 && (
            <div className="text-center py-12 text-white/40">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>暂无静态页面，点击上方按钮创建第一个页面</p>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
