'use client'
/**
 * Translation Management Page
 * Interface for managing multi-language content translations
 */

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentAdmin } from '@/lib/supabase';
import AdminLayout from '@/components/admin/admin-layout';
import TranslationManager from '@/components/admin/translation-manager';

export default function TranslationsPage() {
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
      <TranslationManager />
    </AdminLayout>
  );
}
