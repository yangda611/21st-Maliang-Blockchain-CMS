'use client'
/**
 * Job Postings Management Page
 * CRUD interface for job postings
 */

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentAdmin } from '@/lib/supabase';
import AdminLayout from '@/components/admin/admin-layout';
import JobPostingManager from '@/components/admin/job-posting-manager';

export default function JobsPage() {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const user = await getCurrentAdmin();
      if (!user) {
        router.push('/maliang-admin');
      }
    };

    checkAuth();
  }, [router]);

  return (
    <AdminLayout>
      <JobPostingManager />
    </AdminLayout>
  );
}
