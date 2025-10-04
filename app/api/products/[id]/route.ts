/**
 * Product Detail API Route
 * Handles operations for individual products
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

interface RouteParams {
  params: {
    id: string;
  };
}

// GET /api/products/[id] - Get specific product
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;
    const supabase = createClient();

    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        category:content_categories(*),
        tags:content_tags(*)
      `)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Product not found' },
          { status: 404 }
        );
      }

      console.error('Error fetching product:', error);
      return NextResponse.json(
        { error: 'Failed to fetch product' },
        { status: 500 }
      );
    }

    return NextResponse.json(data);

  } catch (error) {
    console.error('Error in product detail API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/products/[id] - Update product
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;
    const body = await request.json();
    const supabase = createClient();

    // Check if slug conflicts with other products
    if (body.slug) {
      const { data: existingProduct } = await supabase
        .from('products')
        .select('id')
        .eq('slug', body.slug)
        .neq('id', id)
        .single();

      if (existingProduct) {
        return NextResponse.json(
          { error: 'Product slug already exists' },
          { status: 409 }
        );
      }
    }

    const { data, error } = await supabase
      .from('products')
      .update({
        category_id: body.categoryId,
        name: body.name,
        description: body.description,
        specifications: body.specifications,
        pricing: body.pricing,
        images: body.images,
        slug: body.slug,
        tags: body.tags,
        translation_status: body.translationStatus,
        is_published: body.isPublished,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating product:', error);
      return NextResponse.json(
        { error: 'Failed to update product' },
        { status: 500 }
      );
    }

    return NextResponse.json(data);

  } catch (error) {
    console.error('Error in product PUT API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/products/[id] - Delete product
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;
    const supabase = createClient();

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting product:', error);
      return NextResponse.json(
        { error: 'Failed to delete product' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error in product DELETE API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
