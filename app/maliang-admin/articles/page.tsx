'use client'
/**
 * Articles Management Page
 * CRUD interface for articles
 */

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentAdmin } from '@/lib/supabase';
import AdminLayout from '@/components/admin/admin-layout';
import ArticleManager from '@/components/admin/article-manager';

export default function ArticlesPage() {
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
      <ArticleManager />
    </AdminLayout>
  );
}
