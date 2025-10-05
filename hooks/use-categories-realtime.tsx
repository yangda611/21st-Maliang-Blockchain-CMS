/**
 * Real-time Categories Hook
 * Provides real-time updates for categories when changes are made in admin
 */

'use client';

import { useState, useEffect, useCallback } from 'react';

interface ContentCategory {
  id: string;
  name: { zh: string; en: string; [key: string]: string };
  description?: { zh: string; en: string; [key: string]: string };
  slug: string;
  content_type: string;
  is_active: boolean;
  display_order: number;
}

export function useCategoriesRealtime(contentType: string = 'article') {
  const [categories, setCategories] = useState<ContentCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const loadCategories = useCallback(async () => {
    try {
      const response = await fetch(`/api/categories/admin?contentType=${contentType}&active=true`);
      if (response.ok) {
        const data = await response.json();
        setCategories(data.categories || []);
        setLastUpdated(new Date());
      } else {
        console.error('Failed to load categories');
      }
    } catch (error) {
      console.error('Error loading categories:', error);
    } finally {
      setLoading(false);
    }
  }, [contentType]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  // Listen for custom events when categories are updated
  useEffect(() => {
    const handleCategoriesUpdate = () => {
      console.log('Categories updated, refreshing...');
      loadCategories();
    };

    window.addEventListener('categories-updated', handleCategoriesUpdate);
    
    return () => {
      window.removeEventListener('categories-updated', handleCategoriesUpdate);
    };
  }, [loadCategories]);

  // Poll for updates every 30 seconds as fallback
  useEffect(() => {
    const interval = setInterval(() => {
      loadCategories();
    }, 30000);

    return () => clearInterval(interval);
  }, [loadCategories]);

  const refreshCategories = useCallback(() => {
    loadCategories();
  }, [loadCategories]);

  return {
    categories,
    loading,
    lastUpdated,
    refreshCategories,
  };
}

// Utility function to trigger category update event
export function triggerCategoriesUpdate() {
  window.dispatchEvent(new CustomEvent('categories-updated'));
}
