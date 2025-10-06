/**
 * Job Posting Manager Component
 * CRUD interface for job postings
 */

'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useJobPostings } from '@/hooks/use-content';
import { jobPostingService } from '@/lib/services/job-posting-service';
import ContentEditor from './content-editor';
import type { JobPosting, MultiLanguageText } from '@/types/content';
import { fadeInUp, staggerContainer } from '@/utils/animations';
import { Plus, Edit, Trash2, Briefcase, MapPin, Clock, CheckCircle, XCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

interface JobFormData {
  title: MultiLanguageText;
  description: MultiLanguageText;
  requirements: MultiLanguageText;
  location?: MultiLanguageText;
  employmentType: string;
  applicationDeadline?: string;
  isActive: boolean;
}

export default function JobPostingManager() {
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState<JobFormData>({
    title: {},
    description: {},
    requirements: {},
    location: {},
    employmentType: 'full-time',
    applicationDeadline: '',
    isActive: true,
  });

  const { getList } = useJobPostings();

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    setLoading(true);
    const result = await getList(1, 100);
    if (result.success && result.data) {
      setJobs(result.data.data);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (editingId) {
        await jobPostingService.update(editingId, formData);
      } else {
        await jobPostingService.create(formData);
      }

      setShowForm(false);
      setEditingId(null);
      resetForm();
      loadJobs();
    } catch (error) {
      console.error('Failed to save job posting:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDialogOpenChange = (open: boolean) => {
    // 只有在非提交状态下才允许关闭弹窗
    if (!open && !isSubmitting) {
      setShowForm(false);
      setEditingId(null);
      resetForm();
    } else if (open && !isSubmitting) {
      setShowForm(true);
    }
  };

  const handleEdit = (job: JobPosting) => {
    setFormData({
      title: job.title,
      description: job.description,
      requirements: job.requirements,
      location: job.location,
      employmentType: job.employmentType,
      applicationDeadline: job.applicationDeadline || '',
      isActive: job.isActive,
    });
    setEditingId(job.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除此招聘信息吗？')) return;

    try {
      await jobPostingService.delete(id);
      loadJobs();
    } catch (error) {
      console.error('Failed to delete job posting:', error);
    }
  };

  const handleToggleActive = async (id: string, isActive: boolean) => {
    try {
      if (isActive) {
        await jobPostingService.deactivate(id);
      } else {
        await jobPostingService.activate(id);
      }
      loadJobs();
    } catch (error) {
      console.error('Failed to toggle active status:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: {},
      description: {},
      requirements: {},
      location: {},
      employmentType: 'full-time',
      applicationDeadline: '',
      isActive: true,
    });
  };

  const isExpired = (deadline?: string) => {
    if (!deadline) return false;
    return new Date(deadline) < new Date();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">招聘管理</h1>
          <p className="text-white/60 mt-1">管理职位发布和招聘信息</p>
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
          <span>发布职位</span>
        </button>
      </div>

      <Dialog open={showForm} onOpenChange={handleDialogOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" preventOutsideClose={true}>
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              {editingId ? '编辑职位' : '发布职位'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            <ContentEditor
              value={formData.title}
              onChange={(title) => setFormData({ ...formData, title })}
              label="职位名称"
              required
            />

            <ContentEditor
              value={formData.description}
              onChange={(description) => setFormData({ ...formData, description })}
              label="职位描述"
              multiline
              rows={6}
              required
            />

            <ContentEditor
              value={formData.requirements}
              onChange={(requirements) => setFormData({ ...formData, requirements })}
              label="任职要求"
              multiline
              rows={6}
              required
            />

            <ContentEditor
              value={formData.location || {}}
              onChange={(location) => setFormData({ ...formData, location })}
              label="工作地点"
            />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">
                  工作类型
                </label>
                <select
                  value={formData.employmentType}
                  onChange={(e) => setFormData({ ...formData, employmentType: e.target.value })}
                  className="w-full px-4 py-3 bg-black/50 border border-white/20 rounded-lg text-white focus:outline-none focus:border-white/40"
                >
                  <option value="full-time">全职</option>
                  <option value="part-time">兼职</option>
                  <option value="contract">合同</option>
                  <option value="internship">实习</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">
                  申请截止日期
                </label>
                <input
                  type="date"
                  value={formData.applicationDeadline}
                  onChange={(e) => setFormData({ ...formData, applicationDeadline: e.target.value })}
                  className="w-full px-4 py-3 bg-black/50 border border-white/20 rounded-lg text-white focus:outline-none focus:border-white/40"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="h-4 w-4 rounded border-white/20 bg-black/50"
              />
              <label htmlFor="isActive" className="text-sm text-white/90">
                立即发布
              </label>
            </div>

            <DialogFooter>
              <button
                type="button"
                onClick={() => {
                  if (!isSubmitting) {
                    setShowForm(false);
                    setEditingId(null);
                    resetForm();
                  }
                }}
                disabled={isSubmitting}
                className="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                取消
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-4 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? '提交中...' : (editingId ? '更新' : '发布')}
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin h-8 w-8 border-2 border-white/20 border-t-white rounded-full" />
        </div>
      ) : (
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid gap-4 md:grid-cols-2"
        >
          {jobs.map((job) => (
            <motion.div
              key={job.id}
              variants={fadeInUp}
              className="p-6 bg-black border border-white/10 rounded-lg hover:border-white/20 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-white/60" />
                  <h3 className="text-lg font-medium">
                    {job.title.zh || job.title.en}
                  </h3>
                </div>
                {job.isActive ? (
                  <CheckCircle className="h-5 w-5 text-green-400" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-400" />
                )}
              </div>

              <p className="text-sm text-white/60 line-clamp-2 mb-4">
                {job.description.zh || job.description.en}
              </p>

              <div className="space-y-2 mb-4 text-sm text-white/60">
                {job.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{job.location.zh || job.location.en}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4" />
                  <span>{job.employmentType}</span>
                </div>
                {job.applicationDeadline && (
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span className={isExpired(job.applicationDeadline) ? 'text-red-400' : ''}>
                      截止: {new Date(job.applicationDeadline).toLocaleDateString('zh-CN')}
                      {isExpired(job.applicationDeadline) && ' (已过期)'}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleToggleActive(job.id, job.isActive)}
                  className={`flex-1 px-3 py-1.5 rounded-lg border transition-all text-sm ${
                    job.isActive
                      ? 'bg-green-500/20 border-green-500/50 text-green-400'
                      : 'bg-white/5 border-white/10 text-white/60'
                  }`}
                >
                  {job.isActive ? '招聘中' : '已关闭'}
                </button>
                <button
                  onClick={() => handleEdit(job)}
                  className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-all"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(job.id)}
                  className="p-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/50 rounded-lg transition-all text-red-400"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          ))}

          {jobs.length === 0 && (
            <div className="col-span-full text-center py-12 text-white/40">
              <Briefcase className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>暂无招聘信息，点击上方按钮发布第一个职位</p>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
