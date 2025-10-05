/**
 * Product Manager Component
 * CRUD interface for products with multi-language support
 */

'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useProducts, useCategories } from '@/hooks/use-content';
import { productService } from '@/lib/services/product-service';
import ContentEditor from './content-editor';
import type { Product, MultiLanguageText } from '@/types/content';
import { fadeInUp, staggerContainer } from '@/utils/animations';
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Package,
  Image as ImageIcon,
  Tag,
  DollarSign,
} from 'lucide-react';
import { generateSlug } from '@/utils/seo';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

interface ProductFormData {
  categoryId: string;
  name: MultiLanguageText;
  description: MultiLanguageText;
  specifications?: MultiLanguageText;
  pricing?: { currency: string; amount: number };
  images: string[];
  slug: string;
  tags: string[];
  translationStatus: 'draft' | 'pending_review' | 'published';
  isPublished: boolean;
}

export default function ProductManager() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<ProductFormData>({
    categoryId: '',
    name: {},
    description: {},
    specifications: {},
    pricing: { currency: 'CNY', amount: 0 },
    images: [],
    slug: '',
    tags: [],
    translationStatus: 'draft',
    isPublished: false,
  });

  const { getList: getProducts } = useProducts();
  const { getList: getCategories } = useCategories();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [productsResult, categoriesResult] = await Promise.all([
      getProducts(1, 50),
      getCategories(1, 100, { content_type: 'product', is_active: true }),
    ]);

    if (productsResult.success && productsResult.data) {
      setProducts(productsResult.data.data);
    }

    if (categoriesResult.success && categoriesResult.data) {
      setCategories(categoriesResult.data.data);
    }

    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingId) {
        await productService.update(editingId, formData);
      } else {
        await productService.create(formData);
      }

      setShowForm(false);
      setEditingId(null);
      resetForm();
      loadData();
    } catch (error) {
      console.error('Failed to save product:', error);
    }
  };

  const handleEdit = (product: Product) => {
    setFormData({
      categoryId: product.categoryId,
      name: product.name,
      description: product.description,
      specifications: product.specifications,
      pricing: product.pricing,
      images: product.images || [],
      slug: product.slug,
      tags: product.tags || [],
      translationStatus: product.translationStatus,
      isPublished: product.isPublished,
    });
    setEditingId(product.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除此产品吗？')) return;

    try {
      await productService.delete(id);
      loadData();
    } catch (error) {
      console.error('Failed to delete product:', error);
    }
  };

  const handleTogglePublish = async (id: string, isPublished: boolean) => {
    try {
      if (isPublished) {
        await productService.unpublish(id);
      } else {
        await productService.publish(id);
      }
      loadData();
    } catch (error) {
      console.error('Failed to toggle publish status:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      categoryId: '',
      name: {},
      description: {},
      specifications: {},
      pricing: { currency: 'CNY', amount: 0 },
      images: [],
      slug: '',
      tags: [],
      translationStatus: 'draft',
      isPublished: false,
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
          <h1 className="text-3xl font-bold">产品管理</h1>
          <p className="text-white/60 mt-1">管理产品信息和多语言内容</p>
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
          <span>新建产品</span>
        </button>
      </div>

      {/* Form Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              {editingId ? '编辑产品' : '新建产品'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">
                产品分类 <span className="text-red-400">*</span>
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
              value={formData.name}
              onChange={handleNameChange}
              label="产品名称"
              required
            />

            <ContentEditor
              value={formData.description}
              onChange={(description) => setFormData({ ...formData, description })}
              label="产品描述"
              multiline
              rows={4}
              required
            />

            <ContentEditor
              value={formData.specifications || {}}
              onChange={(specifications) => setFormData({ ...formData, specifications })}
              label="产品规格"
              multiline
              rows={3}
            />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">
                  价格
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.pricing?.amount || 0}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      pricing: { ...formData.pricing!, amount: parseFloat(e.target.value) },
                    })
                  }
                  className="w-full px-4 py-3 bg-black/50 border border-white/20 rounded-lg text-white focus:outline-none focus:border-white/40"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">
                  货币
                </label>
                <select
                  value={formData.pricing?.currency || 'CNY'}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      pricing: { ...formData.pricing!, currency: e.target.value },
                    })
                  }
                  className="w-full px-4 py-3 bg-black/50 border border-white/20 rounded-lg text-white focus:outline-none focus:border-white/40"
                >
                  <option value="CNY">CNY (¥)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                </select>
              </div>
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
                placeholder="例如: 新品, 热销, 推荐"
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

      {/* Products Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin h-8 w-8 border-2 border-white/20 border-t-white rounded-full" />
        </div>
      ) : (
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
        >
          {products.map((product) => (
            <motion.div
              key={product.id}
              variants={fadeInUp}
              className="p-4 bg-black border border-white/10 rounded-lg hover:border-white/20 transition-all"
            >
              <div className="aspect-video bg-white/5 rounded-lg mb-4 flex items-center justify-center">
                {product.images && product.images.length > 0 ? (
                  <img
                    src={product.images[0]}
                    alt={product.name.zh || product.name.en}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <Package className="h-12 w-12 text-white/20" />
                )}
              </div>

              <h3 className="font-medium mb-2">{product.name.zh || product.name.en}</h3>
              <p className="text-sm text-white/60 line-clamp-2 mb-3">
                {product.description.zh || product.description.en}
              </p>

              <div className="flex items-center gap-2 mb-3 text-sm">
                <DollarSign className="h-4 w-4 text-white/40" />
                <span className="text-white/80">
                  {product.pricing?.currency} {product.pricing?.amount}
                </span>
              </div>

              {product.tags && product.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {product.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 text-xs bg-white/5 border border-white/10 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleTogglePublish(product.id, product.isPublished)}
                  className={`flex-1 p-2 rounded-lg border transition-all text-sm ${
                    product.isPublished
                      ? 'bg-green-500/20 border-green-500/50 text-green-400'
                      : 'bg-white/5 border-white/10 text-white/60'
                  }`}
                >
                  {product.isPublished ? '已发布' : '草稿'}
                </button>
                <button
                  onClick={() => handleEdit(product)}
                  className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-all"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(product.id)}
                  className="p-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/50 rounded-lg transition-all text-red-400"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          ))}

          {products.length === 0 && (
            <div className="col-span-full text-center py-12 text-white/40">
              <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>暂无产品，点击上方按钮创建第一个产品</p>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
