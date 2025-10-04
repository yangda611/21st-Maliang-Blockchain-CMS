/**
 * Article Detail API Route
 * Handles operations for individual articles by slug
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

interface RouteParams {
  params: {
    slug: string;
  };
}

// GET /api/articles/[slug] - Get specific article by slug
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { slug } = params;
    const supabase = createClient();

    const { data, error } = await supabase
      .from('articles')
      .select(`
        *,
        category:content_categories(*),
        author:admin_users(*),
        tags:content_tags(*)
      `)
      .eq('slug', slug)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Article not found' },
          { status: 404 }
        );
      }

      console.error('Error fetching article:', error);
      return NextResponse.json(
        { error: 'Failed to fetch article' },
        { status: 500 }
      );
    }

    return NextResponse.json(data);

  } catch (error) {
    console.error('Error in article detail API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
