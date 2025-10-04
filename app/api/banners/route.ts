/**
 * Banners API Route
 * Handles CRUD operations for banners/slideshow
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

// GET /api/banners - Get active banners
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const active = searchParams.get('active');

    const supabase = createClient();

    let query = supabase
      .from('banners')
      .select('*');

    // Apply filters
    if (active !== null) {
      query = query.eq('is_active', active === 'true');
    }

    const { data, error } = await query.order('display_order');

    if (error) {
      console.error('Error fetching banners:', error);
      return NextResponse.json(
        { error: 'Failed to fetch banners' },
        { status: 500 }
      );
    }

    return NextResponse.json({ banners: data });

  } catch (error) {
    console.error('Error in banners GET API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/banners - Create new banner
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const supabase = createClient();

    // Validate required fields
    const { title, imageDesktop, imageMobile } = body;

    if (!title || !imageDesktop || !imageMobile) {
      return NextResponse.json(
        { error: 'Missing required fields: title, imageDesktop, imageMobile' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('banners')
      .insert([{
        title,
        image_desktop: imageDesktop,
        image_mobile: imageMobile,
        link_url: body.linkUrl || null,
        display_order: body.displayOrder || 0,
        is_active: body.isActive !== false,
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating banner:', error);
      return NextResponse.json(
        { error: 'Failed to create banner' },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 201 });

  } catch (error) {
    console.error('Error in banners POST API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
