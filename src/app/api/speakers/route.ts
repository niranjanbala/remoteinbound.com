import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase-server';

// GET /api/speakers - Get all speakers
export async function GET() {
  try {
    const { data, error } = await supabaseServer
      .from('speakers')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/speakers - Create a new speaker
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      title,
      company,
      bio,
      avatar,
      social,
      sessions
    } = body;

    if (!name || !title || !company || !bio) {
      return NextResponse.json(
        { error: 'Name, title, company, and bio are required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseServer
      .from('speakers')
      .insert({
        name,
        title,
        company,
        bio,
        avatar,
        social_twitter: social?.twitter,
        social_linkedin: social?.linkedin,
        social_website: social?.website,
        sessions: sessions || [],
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}