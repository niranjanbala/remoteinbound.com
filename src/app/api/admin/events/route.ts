import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase-server';
import { withAuth, getUserFromRequest } from '@/lib/auth-middleware';

// GET /api/admin/events - Get all events (admin only)
export async function GET(request: NextRequest) {
  return withAuth(request, async (req) => {
    try {
      const { data, error } = await supabaseServer
        .from('events')
        .select('*')
        .order('start_date', { ascending: true });

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
  }, { requireAdmin: true });
}

// POST /api/admin/events - Create a new event (admin only)
export async function POST(request: NextRequest) {
  return withAuth(request, async (req) => {
    try {
      const body = await req.json();
      const {
        title,
        description,
        startDate,
        endDate,
        timezone,
        status,
        coverImage,
        maxAttendees,
        currentAttendees,
        tags,
        organizer
      } = body;

      if (!title || !description || !startDate || !endDate || !timezone || !organizer) {
        return NextResponse.json(
          { error: 'Title, description, dates, timezone, and organizer are required' },
          { status: 400 }
        );
      }

      const user = getUserFromRequest(req);

      const { data, error } = await supabaseServer
        .from('events')
        .insert({
          title,
          description,
          start_date: startDate,
          end_date: endDate,
          timezone,
          status: status || 'upcoming',
          cover_image: coverImage,
          max_attendees: maxAttendees,
          current_attendees: currentAttendees || 0,
          tags: tags || [],
          organizer_name: organizer.name,
          organizer_email: organizer.email,
          organizer_avatar: organizer.avatar,
          created_by: user.id,
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
  }, { requireAdmin: true });
}