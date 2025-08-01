import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase-server';

// POST /api/registrations - Register user for event
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, eventId, type = 'virtual' } = body;

    if (!userId || !eventId) {
      return NextResponse.json(
        { error: 'User ID and Event ID are required' },
        { status: 400 }
      );
    }

    // Check if already registered
    const { data: existing } = await supabaseServer
      .from('registrations')
      .select('id')
      .eq('user_id', userId)
      .eq('event_id', eventId)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: 'User is already registered for this event' },
        { status: 409 }
      );
    }

    // Create registration
    const { data, error } = await supabaseServer
      .from('registrations')
      .insert({
        user_id: userId,
        event_id: eventId,
        registration_type: type,
        status: 'confirmed',
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Update event attendee count
    const { error: updateError } = await supabaseServer.rpc('increment_attendees', {
      event_id: eventId,
    });

    if (updateError) {
      console.error('Failed to update attendee count:', updateError);
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}