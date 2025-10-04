/**
 * Messages API Route
 * Handles visitor messages and contact form submissions
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { supabaseAdmin } from '@/lib/supabase';

// GET /api/messages - Get visitor messages (admin only)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const unread = searchParams.get('unread');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    const supabase = createClient();

    let query = supabase
      .from('visitor_messages')
      .select('*')
      .range(offset, offset + limit - 1);

    // Apply filters
    if (unread !== null) {
      query = query.eq('is_read', unread === 'true');
    }

    const { data, error, count } = await query.order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching messages:', error);
      return NextResponse.json(
        { error: 'Failed to fetch messages' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      messages: data,
      total: count,
      limit,
      offset
    });

  } catch (error) {
    console.error('Error in messages GET API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/messages - Create new visitor message
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // Prefer service role client to bypass RLS for public contact submissions
    const supabase = supabaseAdmin ?? createClient();

    // Validate required fields
    const { name, email, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Missing required fields: name, email, message' },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('visitor_messages')
      .insert([{ 
        name,
        email,
        phone: body.phone || null,
        message,
        message_type: body.messageType || 'contact',
        related_id: body.relatedId || null,
        is_read: false,
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating message:', error);
      return NextResponse.json(
        { error: 'Failed to send message' },
        { status: 500 }
      );
    }

    // Send notification email (you can implement this later)
    // await sendNotificationEmail(data);

    return NextResponse.json({
      success: true,
      message: 'Message sent successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Error in messages POST API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
