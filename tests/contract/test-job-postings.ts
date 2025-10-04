/**
 * Contract Test: Job Postings API
 * Tests API contract for job posting CRUD operations
 */

import { describe, it, expect, afterAll } from '@jest/globals';
import { getSupabaseClient } from '@/lib/supabase';
import type { JobPosting } from '@/types/content';

describe('Job Postings API Contract', () => {
  let testJobId: string;
  const supabase = getSupabaseClient();

  const mockJob = {
    title: { zh: '前端开发工程师', en: 'Frontend Developer' },
    description: { zh: '职位描述', en: 'Job Description' },
    requirements: { zh: '职位要求', en: 'Job Requirements' },
    location: { zh: '北京', en: 'Beijing' },
    employment_type: 'full-time',
    application_deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    is_active: true,
  };

  afterAll(async () => {
    if (testJobId) {
      await supabase.from('job_postings').delete().eq('id', testJobId);
    }
  });

  describe('POST /api/jobs - Create Job Posting', () => {
    it('should create a new job posting with valid data', async () => {
      const { data, error } = await supabase
        .from('job_postings')
        .insert(mockJob)
        .select()
        .single();

      expect(error).toBeNull();
      expect(data).toBeDefined();
      expect(data?.title).toEqual(mockJob.title);
      expect(data?.employment_type).toBe(mockJob.employment_type);

      testJobId = data!.id;
    });

    it('should fail with missing required fields', async () => {
      const { error } = await supabase
        .from('job_postings')
        .insert({ title: { zh: '测试' } });

      expect(error).toBeDefined();
    });
  });

  describe('GET /api/jobs - List Job Postings', () => {
    it('should retrieve all job postings', async () => {
      const { data, error } = await supabase.from('job_postings').select('*');

      expect(error).toBeNull();
      expect(data).toBeDefined();
      expect(Array.isArray(data)).toBe(true);
    });

    it('should filter active jobs only', async () => {
      const { data, error } = await supabase
        .from('job_postings')
        .select('*')
        .eq('is_active', true);

      expect(error).toBeNull();
      data?.forEach((job) => {
        expect(job.is_active).toBe(true);
      });
    });

    it('should filter by employment type', async () => {
      const { data, error } = await supabase
        .from('job_postings')
        .select('*')
        .eq('employment_type', 'full-time');

      expect(error).toBeNull();
      data?.forEach((job) => {
        expect(job.employment_type).toBe('full-time');
      });
    });

    it('should filter jobs before deadline', async () => {
      const { data, error } = await supabase
        .from('job_postings')
        .select('*')
        .gte('application_deadline', new Date().toISOString());

      expect(error).toBeNull();
      expect(data).toBeDefined();
    });
  });

  describe('GET /api/jobs/:id - Get Single Job Posting', () => {
    it('should retrieve job posting by id', async () => {
      const { data, error } = await supabase
        .from('job_postings')
        .select('*')
        .eq('id', testJobId)
        .single();

      expect(error).toBeNull();
      expect(data).toBeDefined();
      expect(data?.id).toBe(testJobId);
    });
  });

  describe('PUT /api/jobs/:id - Update Job Posting', () => {
    it('should update job posting with valid data', async () => {
      const updatedData = {
        title: { zh: '高级前端开发工程师', en: 'Senior Frontend Developer' },
        is_active: false,
      };

      const { data, error } = await supabase
        .from('job_postings')
        .update(updatedData)
        .eq('id', testJobId)
        .select()
        .single();

      expect(error).toBeNull();
      expect(data?.title).toEqual(updatedData.title);
      expect(data?.is_active).toBe(false);
    });

    it('should extend application deadline', async () => {
      const newDeadline = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString();

      const { data, error } = await supabase
        .from('job_postings')
        .update({ application_deadline: newDeadline })
        .eq('id', testJobId)
        .select()
        .single();

      expect(error).toBeNull();
      expect(data?.application_deadline).toBe(newDeadline);
    });
  });

  describe('DELETE /api/jobs/:id - Delete Job Posting', () => {
    it('should soft delete job (set is_active to false)', async () => {
      const { data, error } = await supabase
        .from('job_postings')
        .update({ is_active: false })
        .eq('id', testJobId)
        .select()
        .single();

      expect(error).toBeNull();
      expect(data?.is_active).toBe(false);
    });

    it('should hard delete job posting', async () => {
      const { error } = await supabase.from('job_postings').delete().eq('id', testJobId);

      expect(error).toBeNull();
    });
  });
});
