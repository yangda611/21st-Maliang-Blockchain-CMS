/**
 * Admin Categories API Route
 * Handles CRUD operations for content categories with service role bypass
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase-server';

// GET /api/categories/admin - Get all categories (admin access)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const contentType = searchParams.get('contentType');
    const parentId = searchParams.get('parent');
    const active = searchParams.get('active');

    // Use service role client to bypass RLS
    const supabase = createServiceRoleClient();

    let query = supabase
      .from('content_categories')
      .select(`
        *,
        parent:content_categories!parent_id(*),
        children:content_categories!parent_id(*)
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
        { error: 'Failed to fetch categories', details: error.message || String(error) },
        { status: 500 }
      );
    }

    return NextResponse.json({ categories: data });

  } catch (error: any) {
    console.error('Error in admin categories API:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error?.message || String(error) },
      { status: 500 }
    );
  }
}

// POST /api/categories/admin - Create new category (admin access)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Use service role client to bypass RLS
    const supabase = createServiceRoleClient();

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
        { error: 'Failed to create category', details: error.message || String(error) },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 201 });

  } catch (error: any) {
    console.error('Error in admin categories POST API:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error?.message || String(error) },
      { status: 500 }
    );
  }
}

// PUT /api/categories/admin/[id] - Update category (admin access)
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Missing category ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const supabase = createServiceRoleClient();

    const { data, error } = await supabase
      .from('content_categories')
      .update({
        name: body.name,
        description: body.description,
        slug: body.slug,
        parent_id: body.parentId,
        hierarchy_level: body.hierarchyLevel,
        content_type: body.contentType,
        display_order: body.displayOrder,
        is_active: body.isActive,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating category:', error);
      return NextResponse.json(
        { error: 'Failed to update category', details: error.message || String(error) },
        { status: 500 }
      );
    }

    return NextResponse.json(data);

  } catch (error: any) {
    console.error('Error in admin categories PUT API:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error?.message || String(error) },
      { status: 500 }
    );
  }
}

// DELETE /api/categories/admin/[id] - Delete category (admin access)
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Missing category ID' },
        { status: 400 }
      );
    }

    const supabase = createServiceRoleClient();

    const { error } = await supabase
      .from('content_categories')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting category:', error);
      return NextResponse.json(
        { error: 'Failed to delete category', details: error.message || String(error) },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error('Error in admin categories DELETE API:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error?.message || String(error) },
      { status: 500 }
    );
  }
}
