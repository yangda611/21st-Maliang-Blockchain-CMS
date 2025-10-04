'use client'
/**
 * Categories Management Page
 * CRUD interface for content categories
 */

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentAdmin } from '@/lib/supabase';
import AdminLayout from '@/components/admin/admin-layout';
import CategoryManager from '@/components/admin/category-manager';

export default function CategoriesPage() {
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
      <CategoryManager />
    </AdminLayout>
  );
}
