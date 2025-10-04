/**
 * Banner Manager Component
 * Slideshow management for homepage banners
 */

'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ContentEditor from '../admin/content-editor';
import type { Banner, MultiLanguageText } from '@/types/content';
import { fadeInUp, staggerContainer } from '@/utils/animations';
import { Plus, Edit, Trash2, Image as ImageIcon, Eye, EyeOff } from 'lucide-react';

interface BannerFormData {
  title: MultiLanguageText;
  imageDesktop: string;
  imageMobile: string;
  linkUrl?: string;
  displayOrder: number;
  isActive: boolean;
}

export default function BannerManager() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState<BannerFormData>({
    title: {},
    imageDesktop: '',
    imageMobile: '',
    linkUrl: '',
    displayOrder: 0,
    isActive: true,
  });

  useEffect(() => {
    loadBanners();
  }, []);

  const loadBanners = async () => {
    setLoading(true);
    try {
      // For now, use mock data since we don't have banner service yet
      setBanners([]);
    } catch (error) {
      console.error('Failed to load banners:', error);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingId) {
        // Update existing banner
        setBanners(prev => prev.map(b =>
          b.id === editingId ? { ...b, ...formData } : b
        ));
      } else {
        // Create new banner
        const newBanner: Banner = {
          id: Date.now().toString(),
          ...formData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setBanners(prev => [...prev, newBanner]);
      }

      setShowForm(false);
      setEditingId(null);
      resetForm();
    } catch (error) {
      console.error('Failed to save banner:', error);
    }
  };

  const handleEdit = (banner: Banner) => {
    setFormData({
      title: banner.title,
      imageDesktop: banner.imageDesktop,
      imageMobile: banner.imageMobile,
      linkUrl: banner.linkUrl,
      displayOrder: banner.displayOrder,
      isActive: banner.isActive,
    });
    setEditingId(banner.id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (!confirm('确定要删除此横幅吗？')) return;
    setBanners(prev => prev.filter(b => b.id !== id));
  };

  const resetForm = () => {
    setFormData({
      title: {},
      imageDesktop: '',
      imageMobile: '',
      linkUrl: '',
      displayOrder: banners.length,
      isActive: true,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">横幅管理</h1>
          <p className="text-white/60 mt-1">管理首页轮播横幅和宣传图片</p>
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
          <span>添加横幅</span>
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
              className="w-full max-w-2xl bg-black border border-white/20 rounded-xl p-6 max-h-[90vh] overflow-y-auto"
            >
              <h2 className="text-2xl font-bold mb-6">
                {editingId ? '编辑横幅' : '添加横幅'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <ContentEditor
                  value={formData.title}
                  onChange={(title) => setFormData({ ...formData, title })}
                  label="横幅标题"
                  required
                />

                <div>
                  <label className="block text-sm font-medium text-white/90 mb-2">
                    桌面版图片 URL <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="url"
                    value={formData.imageDesktop}
                    onChange={(e) => setFormData({ ...formData, imageDesktop: e.target.value })}
                    className="w-full px-4 py-3 bg-black border border-white/10 rounded-lg text-white focus:outline-none focus:border-white/30"
                    placeholder="https://example.com/banner-desktop.jpg"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/90 mb-2">
                    手机版图片 URL <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="url"
                    value={formData.imageMobile}
                    onChange={(e) => setFormData({ ...formData, imageMobile: e.target.value })}
                    className="w-full px-4 py-3 bg-black border border-white/10 rounded-lg text-white focus:outline-none focus:border-white/30"
                    placeholder="https://example.com/banner-mobile.jpg"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/90 mb-2">
                    链接 URL (可选)
                  </label>
                  <input
                    type="url"
                    value={formData.linkUrl || ''}
                    onChange={(e) => setFormData({ ...formData, linkUrl: e.target.value })}
                    className="w-full px-4 py-3 bg-black border border-white/10 rounded-lg text-white focus:outline-none focus:border-white/30"
                    placeholder="https://example.com/page"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white/90 mb-2">
                      显示顺序
                    </label>
                    <input
                      type="number"
                      value={formData.displayOrder}
                      onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) })}
                      className="w-full px-4 py-3 bg-black border border-white/10 rounded-lg text-white focus:outline-none focus:border-white/30"
                    />
                  </div>

                  <div className="flex items-center gap-2 mt-8">
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="h-4 w-4 rounded border-white/20 bg-black"
                    />
                    <label htmlFor="isActive" className="text-sm text-white/90">
                      立即启用
                    </label>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg transition-all font-medium"
                  >
                    {editingId ? '更新' : '添加'}
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
          className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
        >
          {banners.map((banner) => (
            <motion.div
              key={banner.id}
              variants={fadeInUp}
              className="p-4 bg-black border border-white/10 rounded-lg hover:border-white/20 transition-all"
            >
              {/* Banner Preview */}
              <div className="aspect-video bg-white/5 rounded-lg overflow-hidden mb-4">
                {banner.imageDesktop ? (
                  <img
                    src={banner.imageDesktop}
                    alt={banner.title.zh || banner.title.en}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="h-12 w-12 text-white/20" />
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="space-y-2">
                <h3 className="font-medium">
                  {banner.title.zh || banner.title.en}
                </h3>
                <div className="flex items-center justify-between text-xs text-white/40">
                  <span>顺序: {banner.displayOrder}</span>
                  {banner.linkUrl && (
                    <span className="truncate max-w-24">{banner.linkUrl}</span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
                <button
                  onClick={() => {
                    setBanners(prev => prev.map(b =>
                      b.id === banner.id ? { ...b, isActive: !b.isActive } : b
                    ));
                  }}
                  className={`p-2 rounded-lg border transition-all ${
                    banner.isActive
                      ? 'bg-green-500/20 border-green-500/50 text-green-400'
                      : 'bg-white/5 border-white/10 text-white/40'
                  }`}
                >
                  {banner.isActive ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEdit(banner)}
                    className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-all"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(banner.id)}
                    className="p-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/50 rounded-lg transition-all text-red-400"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}

          {banners.length === 0 && (
            <div className="col-span-full text-center py-12 text-white/40">
              <ImageIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>暂无横幅，点击上方按钮添加第一个横幅</p>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
