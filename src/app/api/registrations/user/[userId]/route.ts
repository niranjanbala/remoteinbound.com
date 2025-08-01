import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase-server';

// GET /api/registrations/user/[userId] - Get user registrations
export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { data, error } = await supabaseServer
      .from('registrations')
      .select('event_id')
      .eq('user_id', params.userId)
      .eq('status', 'confirmed');

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const eventIds = data.map(reg => reg.event_id);
    return NextResponse.json(eventIds);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}