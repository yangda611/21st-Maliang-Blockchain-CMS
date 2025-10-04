/**
 * Articles API Route
 * Handles CRUD operations for articles
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

// GET /api/articles - Get all articles with optional filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('category');
    const published = searchParams.get('published');
    const search = searchParams.get('search');
    const authorId = searchParams.get('author');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    const supabase = createClient();

    let query = supabase
      .from('articles')
      .select(`
        *,
        category:content_categories(*),
        author:admin_users(*),
        tags:content_tags(*)
      `)
      .range(offset, offset + limit - 1);

    // Apply filters
    if (categoryId) {
      query = query.eq('category_id', categoryId);
    }

    if (authorId) {
      query = query.eq('author_id', authorId);
    }

    if (published !== null) {
      query = query.eq('is_published', published === 'true');
    }

    if (search) {
      query = query.or(`title->zh.ilike.%${search}%,title->en.ilike.%${search}%,excerpt->zh.ilike.%${search}%,excerpt->en.ilike.%${search}%`);
    }

    const { data, error, count } = await query.order('published_at', { ascending: false });

    if (error) {
      console.error('Error fetching articles:', error);
      return NextResponse.json(
        { error: 'Failed to fetch articles' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      articles: data,
      total: count,
      limit,
      offset
    });

  } catch (error) {
    console.error('Error in articles API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/articles - Create new article
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const supabase = createClient();

    // Validate required fields
    const { title, content, categoryId, slug, authorId } = body;

    if (!title || !content || !categoryId || !slug || !authorId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const { data: existingArticle } = await supabase
      .from('articles')
      .select('id')
      .eq('slug', slug)
      .single();

    if (existingArticle) {
      return NextResponse.json(
        { error: 'Article slug already exists' },
        { status: 409 }
      );
    }

    const { data, error } = await supabase
      .from('articles')
      .insert([{
        category_id: categoryId,
        title,
        content,
        excerpt: body.excerpt,
        featured_image: body.featuredImage,
        author_id: authorId,
        slug,
        tags: body.tags || [],
        translation_status: body.translationStatus || 'draft',
        is_published: body.isPublished || false,
        published_at: body.isPublished ? new Date().toISOString() : null,
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating article:', error);
      return NextResponse.json(
        { error: 'Failed to create article' },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 201 });

  } catch (error) {
    console.error('Error in articles POST API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
