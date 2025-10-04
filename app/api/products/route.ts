/**
 * Products API Route
 * Handles CRUD operations for products
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

// GET /api/products - Get all products with optional filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('category');
    const published = searchParams.get('published');
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    const supabase = createClient();

    let query = supabase
      .from('products')
      .select(`
        *,
        category:content_categories(*),
        tags:content_tags(*)
      `)
      .range(offset, offset + limit - 1);

    // Apply filters
    if (categoryId) {
      query = query.eq('category_id', categoryId);
    }

    if (published !== null) {
      query = query.eq('is_published', published === 'true');
    }

    if (search) {
      query = query.or(`name->zh.ilike.%${search}%,name->en.ilike.%${search}%,description->zh.ilike.%${search}%,description->en.ilike.%${search}%`);
    }

    const { data, error, count } = await query;

    if (error) {
      console.error('Error fetching products:', error);
      return NextResponse.json(
        { error: 'Failed to fetch products' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      products: data,
      total: count,
      limit,
      offset
    });

  } catch (error) {
    console.error('Error in products API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/products - Create new product
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const supabase = createClient();

    // Validate required fields
    const { name, description, categoryId, slug } = body;

    if (!name || !description || !categoryId || !slug) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const { data: existingProduct } = await supabase
      .from('products')
      .select('id')
      .eq('slug', slug)
      .single();

    if (existingProduct) {
      return NextResponse.json(
        { error: 'Product slug already exists' },
        { status: 409 }
      );
    }

    const { data, error } = await supabase
      .from('products')
      .insert([{
        category_id: categoryId,
        name,
        description,
        specifications: body.specifications || {},
        pricing: body.pricing || {},
        images: body.images || [],
        slug,
        tags: body.tags || [],
        translation_status: body.translationStatus || 'draft',
        is_published: body.isPublished || false,
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating product:', error);
      return NextResponse.json(
        { error: 'Failed to create product' },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 201 });

  } catch (error) {
    console.error('Error in products POST API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
