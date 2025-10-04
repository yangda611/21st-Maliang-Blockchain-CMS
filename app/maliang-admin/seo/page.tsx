'use client'
/**
 * SEO Management Page
 * Interface for managing SEO settings and metadata
 */

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentAdmin } from '@/lib/supabase';
import AdminLayout from '@/components/admin/admin-layout';
import SEOManager from '@/components/admin/seo-manager';

export default function SEOPage() {
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
      <SEOManager />
    </AdminLayout>
  );
}
