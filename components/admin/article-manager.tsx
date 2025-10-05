/**
 * Article Manager Component
 * CRUD interface for articles with multi-language support
 */

'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useArticles, useCategories } from '@/hooks/use-content';
import { articleService } from '@/lib/services/article-service';
import ContentEditor from './content-editor';
import type { Article, MultiLanguageText } from '@/types/content';
import { fadeInUp, staggerContainer } from '@/utils/animations';
import { Plus, Edit, Trash2, FileText, Calendar, User, Tag } from 'lucide-react';
import { generateSlug } from '@/utils/seo';
import { getSupabaseClient } from '@/lib/supabase';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

interface ArticleFormData {
  categoryId: string;
  authorId: string;
  title: MultiLanguageText;
  content: MultiLanguageText;
  excerpt?: MultiLanguageText;
  featuredImage?: string;
  slug: string;
  tags: string[];
  translationStatus: 'draft' | 'pending_review' | 'published';
  isPublished: boolean;
}

export default function ArticleManager() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string>('');
  
  const [formData, setFormData] = useState<ArticleFormData>({
    categoryId: '',
    authorId: '',
    title: {},
    content: {},
    excerpt: {},
    featuredImage: '',
    slug: '',
    tags: [],
    translationStatus: 'draft',
    isPublished: false,
  });

  const { getList: getArticles } = useArticles();
  const { getList: getCategories } = useCategories();

  useEffect(() => {
    // fetch current auth user id (client-side)
    try {
      const sb = getSupabaseClient();
      sb.auth.getUser().then(({ data: { user } }) => {
        setCurrentUserId(user?.id || '');
      });
    } catch {}

    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [articlesResult, categoriesResult] = await Promise.all([
      getArticles(1, 50),
      getCategories(1, 100, { content_type: 'article', is_active: true }),
    ]);

    if (articlesResult.success && articlesResult.data) {
      setArticles(articlesResult.data.data);
    }

    if (categoriesResult.success && categoriesResult.data) {
      setCategories(categoriesResult.data.data);
    }

    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const submitData = {
        ...formData,
        authorId: formData.authorId || currentUserId || '',
      };

      if (editingId) {
        await articleService.update(editingId, submitData);
      } else {
        await articleService.create(submitData);
      }

      setShowForm(false);
      setEditingId(null);
      resetForm();
      loadData();
    } catch (error) {
      console.error('Failed to save article:', error);
    }
  };

  const handleEdit = (article: Article) => {
    setFormData({
      categoryId: article.categoryId,
      authorId: article.authorId,
      title: article.title,
      content: article.content,
      excerpt: article.excerpt,
      featuredImage: article.featuredImage,
      slug: article.slug,
      tags: article.tags || [],
      translationStatus: article.translationStatus,
      isPublished: article.isPublished,
    });
    setEditingId(article.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除此文章吗？')) return;

    try {
      await articleService.delete(id);
      loadData();
    } catch (error) {
      console.error('Failed to delete article:', error);
    }
  };

  const handleTogglePublish = async (id: string, isPublished: boolean) => {
    try {
      if (isPublished) {
        await articleService.unpublish(id);
      } else {
        await articleService.publish(id);
      }
      loadData();
    } catch (error) {
      console.error('Failed to toggle publish status:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      categoryId: '',
      authorId: '',
      title: {},
      content: {},
      excerpt: {},
      featuredImage: '',
      slug: '',
      tags: [],
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">文章管理</h1>
          <p className="text-white/60 mt-1">管理文章内容和发布状态</p>
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
          <span>新建文章</span>
        </button>
      </div>

      {/* Form Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              {editingId ? '编辑文章' : '新建文章'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">
                文章分类 <span className="text-red-400">*</span>
              </label>
              <select
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                className="w-full px-4 py-3 bg-black/50 border border-white/20 rounded-lg text-white focus:outline-none focus:border-white/40"
                required
              >
                <option value="">选择分类</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name.zh || cat.name.en}
                  </option>
                ))}
              </select>
            </div>

            <ContentEditor
              value={formData.title}
              onChange={handleTitleChange}
              label="文章标题"
              required
            />

            <ContentEditor
              value={formData.content}
              onChange={(content) => setFormData({ ...formData, content })}
              label="文章内容"
              multiline
              rows={12}
              required
            />

            <ContentEditor
              value={formData.excerpt || {}}
              onChange={(excerpt) => setFormData({ ...formData, excerpt })}
              label="文章摘要"
              multiline
              rows={3}
            />

            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">
                特色图片 URL
              </label>
              <input
                type="url"
                value={formData.featuredImage || ''}
                onChange={(e) => setFormData({ ...formData, featuredImage: e.target.value })}
                placeholder="https://example.com/image.jpg"
                className="w-full px-4 py-3 bg-black/50 border border-white/20 rounded-lg text-white focus:outline-none focus:border-white/40"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">
                URL Slug
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="w-full px-4 py-3 bg-black/50 border border-white/20 rounded-lg text-white focus:outline-none focus:border-white/40"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">
                标签 (逗号分隔)
              </label>
              <input
                type="text"
                value={formData.tags.join(', ')}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    tags: e.target.value.split(',').map((t) => t.trim()).filter(Boolean),
                  })
                }
                placeholder="例如: 新闻, 技术, 教程"
                className="w-full px-4 py-3 bg-black/50 border border-white/20 rounded-lg text-white focus:outline-none focus:border-white/40"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isPublished"
                checked={formData.isPublished}
                onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                className="h-4 w-4 rounded border-white/20 bg-black/50"
              />
              <label htmlFor="isPublished" className="text-sm text-white/90">
                立即发布
              </label>
            </div>

            <DialogFooter>
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
              <button
                type="submit"
                className="flex-1 px-4 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg transition-all font-medium"
              >
                {editingId ? '更新' : '创建'}
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Articles List */}
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
          {articles.map((article) => (
            <motion.div
              key={article.id}
              variants={fadeInUp}
              className="p-6 bg-black border border-white/10 rounded-lg hover:border-white/20 transition-all"
            >
              <div className="flex gap-4">
                {article.featuredImage && (
                  <div className="w-32 h-32 flex-shrink-0 bg-white/5 rounded-lg overflow-hidden">
                    <img
                      src={article.featuredImage}
                      alt={article.title.zh || article.title.en}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className="flex-1">
                  <h3 className="text-xl font-medium mb-2">
                    {article.title.zh || article.title.en}
                  </h3>
                  <p className="text-sm text-white/60 line-clamp-2 mb-3">
                    {article.excerpt?.zh || article.excerpt?.en || article.content.zh?.substring(0, 150)}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-white/40 mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(article.createdAt).toLocaleDateString('zh-CN')}
                    </span>
                    {article.tags && article.tags.length > 0 && (
                      <div className="flex items-center gap-1">
                        <Tag className="h-3 w-3" />
                        {article.tags.slice(0, 3).map((tag) => (
                          <span key={tag} className="px-2 py-1 bg-white/5 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleTogglePublish(article.id, article.isPublished)}
                      className={`px-3 py-1.5 rounded-lg border transition-all text-sm ${
                        article.isPublished
                          ? 'bg-green-500/20 border-green-500/50 text-green-400'
                          : 'bg-white/5 border-white/10 text-white/60'
                      }`}
                    >
                      {article.isPublished ? '已发布' : '草稿'}
                    </button>
                    <button
                      onClick={() => handleEdit(article)}
                      className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-all"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(article.id)}
                      className="p-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/50 rounded-lg transition-all text-red-400"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}

          {articles.length === 0 && (
            <div className="text-center py-12 text-white/40">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>暂无文章，点击上方按钮创建第一篇文章</p>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
