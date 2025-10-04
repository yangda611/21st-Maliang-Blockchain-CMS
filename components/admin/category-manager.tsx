/**
 * Category Manager Component
 * CRUD interface for content categories
 */

'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCategories } from '@/hooks/use-content';
import { contentCategoryService } from '@/lib/services/content-category-service';
import ContentEditor from './content-editor';
import type { ContentCategory, ContentType, MultiLanguageText } from '@/types/content';
import { fadeInUp, staggerContainer } from '@/utils/animations';
import { Plus, Edit, Trash2, Eye, EyeOff, Folder, ChevronRight } from 'lucide-react';
import { generateSlug } from '@/utils/seo';

interface CategoryFormData {
  name: MultiLanguageText;
  description?: MultiLanguageText;
  slug: string;
  parentId?: string;
  hierarchyLevel: number;
  contentType: ContentType;
  displayOrder: number;
  isActive: boolean;
}

export default function CategoryManager() {
  const [categories, setCategories] = useState<ContentCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<CategoryFormData>({
    name: {},
    description: {},
    slug: '',
    hierarchyLevel: 1,
    contentType: 'product',
    displayOrder: 0,
    isActive: true,
  });

  const { getList } = useCategories();

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setLoading(true);
    const result = await getList(1, 100);
    if (result.success && result.data) {
      setCategories(result.data.data);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingId) {
        await contentCategoryService.update(editingId, formData);
      } else {
        await contentCategoryService.create(formData);
      }

      setShowForm(false);
      setEditingId(null);
      resetForm();
      loadCategories();
    } catch (error) {
      console.error('Failed to save category:', error);
    }
  };

  const handleEdit = (category: ContentCategory) => {
    setFormData({
      name: category.name,
      description: category.description,
      slug: category.slug,
      parentId: category.parentId,
      hierarchyLevel: category.hierarchyLevel,
      contentType: category.contentType,
      displayOrder: category.displayOrder,
      isActive: category.isActive,
    });
    setEditingId(category.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除此分类吗？')) return;

    try {
      await contentCategoryService.delete(id);
      loadCategories();
    } catch (error) {
      console.error('Failed to delete category:', error);
    }
  };

  const handleToggleActive = async (id: string, isActive: boolean) => {
    try {
      await contentCategoryService.update(id, { isActive: !isActive });
      loadCategories();
    } catch (error) {
      console.error('Failed to toggle category status:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: {},
      description: {},
      slug: '',
      hierarchyLevel: 1,
      contentType: 'product',
      displayOrder: 0,
      isActive: true,
    });
  };

  const handleNameChange = (name: MultiLanguageText) => {
    setFormData((prev) => ({
      ...prev,
      name,
      slug: prev.slug || generateSlug(name.zh || name.en || ''),
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">分类管理</h1>
          <p className="text-white/60 mt-1">管理内容分类和层级结构</p>
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
          <span>新建分类</span>
        </button>
      </div>

      {/* Form Modal */}
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
              className="w-full max-w-2xl bg-black border border-white/20 rounded-xl p-6 max-h-[90vh] overflow-y-auto"
            >
              <h2 className="text-2xl font-bold mb-6">
                {editingId ? '编辑分类' : '新建分类'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <ContentEditor
                  value={formData.name}
                  onChange={handleNameChange}
                  label="分类名称"
                  required
                />

                <ContentEditor
                  value={formData.description || {}}
                  onChange={(description) => setFormData({ ...formData, description })}
                  label="分类描述"
                  multiline
                  rows={3}
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

                <div>
                  <label className="block text-sm font-medium text-white/90 mb-2">
                    内容类型
                  </label>
                  <select
                    value={formData.contentType}
                    onChange={(e) =>
                      setFormData({ ...formData, contentType: e.target.value as ContentType })
                    }
                    className="w-full px-4 py-3 bg-black border border-white/10 rounded-lg text-white focus:outline-none focus:border-white/30"
                  >
                    <option value="product">产品</option>
                    <option value="article">文章</option>
                    <option value="page">页面</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/90 mb-2">
                    显示顺序
                  </label>
                  <input
                    type="number"
                    value={formData.displayOrder}
                    onChange={(e) =>
                      setFormData({ ...formData, displayOrder: parseInt(e.target.value) })
                    }
                    className="w-full px-4 py-3 bg-black border border-white/10 rounded-lg text-white focus:outline-none focus:border-white/30"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="h-4 w-4 rounded border-white/20 bg-black"
                  />
                  <label htmlFor="isActive" className="text-sm text-white/90">
                    启用此分类
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

      {/* Categories List */}
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
          {categories.map((category) => (
            <motion.div
              key={category.id}
              variants={fadeInUp}
              className="p-4 bg-black border border-white/10 rounded-lg hover:border-white/20 transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <Folder className="h-5 w-5 text-white/60" />
                  <div className="flex-1">
                    <h3 className="font-medium">{category.name.zh || category.name.en}</h3>
                    <p className="text-sm text-white/60 mt-1">
                      {category.description?.zh || category.description?.en}
                    </p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-white/40">
                      <span>类型: {category.contentType}</span>
                      <span>•</span>
                      <span>Slug: {category.slug}</span>
                      <span>•</span>
                      <span>顺序: {category.displayOrder}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleActive(category.id, category.isActive)}
                    className={`p-2 rounded-lg border transition-all ${
                      category.isActive
                        ? 'bg-green-500/20 border-green-500/50 text-green-400'
                        : 'bg-white/5 border-white/10 text-white/40'
                    }`}
                  >
                    {category.isActive ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </button>
                  <button
                    onClick={() => handleEdit(category)}
                    className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-all"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(category.id)}
                    className="p-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/50 rounded-lg transition-all text-red-400"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}

          {categories.length === 0 && (
            <div className="text-center py-12 text-white/40">
              <Folder className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>暂无分类，点击上方按钮创建第一个分类</p>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
