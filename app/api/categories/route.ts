/**
 * Categories API Route
 * Handles CRUD operations for content categories
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

// GET /api/categories - Get all categories with optional filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const contentType = searchParams.get('contentType');
    const parentId = searchParams.get('parent');
    const active = searchParams.get('active');

    const supabase = createClient();

    let query = supabase
      .from('content_categories')
      .select(`
        *,
        parent:content_categories!parent_id(*),
        children:content_categories!parent_id(*),
        _count(products),
        _count(articles)
      `);

    // Apply filters
    if (contentType) {
      query = query.eq('content_type', contentType);
    }

    if (parentId) {
      query = query.eq('parent_id', parentId);
    }

    if (active !== null) {
      query = query.eq('is_active', active === 'true');
    }

    const { data, error } = await query.order('hierarchy_level').order('display_order');

    if (error) {
      console.error('Error fetching categories:', error);
      return NextResponse.json(
        { error: 'Failed to fetch categories' },
        { status: 500 }
      );
    }

    return NextResponse.json({ categories: data });

  } catch (error) {
    console.error('Error in categories API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/categories - Create new category
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const supabase = createClient();

    // Validate required fields
    const { name, slug, contentType } = body;

    if (!name || !slug || !contentType) {
      return NextResponse.json(
        { error: 'Missing required fields: name, slug, contentType' },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const { data: existingCategory } = await supabase
      .from('content_categories')
      .select('id')
      .eq('slug', slug)
      .single();

    if (existingCategory) {
      return NextResponse.json(
        { error: 'Category slug already exists' },
        { status: 409 }
      );
    }

    const { data, error } = await supabase
      .from('content_categories')
      .insert([{
        name,
        description: body.description || {},
        slug,
        parent_id: body.parentId || null,
        hierarchy_level: body.parentId ? 2 : 1,
        content_type: contentType,
        display_order: body.displayOrder || 0,
        is_active: body.isActive !== false,
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating category:', error);
      return NextResponse.json(
        { error: 'Failed to create category' },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 201 });

  } catch (error) {
    console.error('Error in categories POST API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
