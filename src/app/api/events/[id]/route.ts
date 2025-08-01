import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase-server';

// GET /api/events/[id] - Get event by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { data, error } = await supabaseServer
      .from('events')
      .select('*')
      .eq('id', params.id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Event not found' }, { status: 404 });
      }
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

// PUT /api/events/[id] - Update event
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
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

    const updateData: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (startDate) updateData.start_date = startDate;
    if (endDate) updateData.end_date = endDate;
    if (timezone) updateData.timezone = timezone;
    if (status) updateData.status = status;
    if (coverImage) updateData.cover_image = coverImage;
    if (maxAttendees) updateData.max_attendees = maxAttendees;
    if (currentAttendees !== undefined) updateData.current_attendees = currentAttendees;
    if (tags) updateData.tags = tags;
    if (organizer) {
      updateData.organizer_name = organizer.name;
      updateData.organizer_email = organizer.email;
      updateData.organizer_avatar = organizer.avatar;
    }

    const { data, error } = await supabaseServer
      .from('events')
      .update(updateData)
      .eq('id', params.id)
      .select()
      .single();

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

// DELETE /api/events/[id] - Delete event
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { error } = await supabaseServer
      .from('events')
      .delete()
      .eq('id', params.id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Event deleted successfully' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}