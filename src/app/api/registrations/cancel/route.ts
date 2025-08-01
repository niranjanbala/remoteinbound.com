import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase-server';

// PUT /api/registrations/cancel - Cancel registration
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, eventId } = body;

    if (!userId || !eventId) {
      return NextResponse.json(
        { error: 'User ID and Event ID are required' },
        { status: 400 }
      );
    }

    const { error } = await supabaseServer
      .from('registrations')
      .update({ status: 'cancelled' })
      .eq('user_id', userId)
      .eq('event_id', eventId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Registration cancelled successfully' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}