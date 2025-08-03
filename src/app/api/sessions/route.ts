import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase-server';

export async function GET(request: NextRequest) {
  try {
    if (!supabaseServer) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 503 }
      );
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const track = searchParams.get('track');
    const level = searchParams.get('level');
    const type = searchParams.get('type');

    // Build query using the session_details view for proper speaker/tag aggregation
    let query = supabaseServer
      .from('session_details')
      .select('*')
      .order('start_time', { ascending: true });

    // Apply filters
    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
    }

    if (level && level !== 'All Levels') {
      query = query.eq('session_level', level);
    }

    // For track and type filtering, we'll need to handle these in the frontend
    // since they might be stored in tags or other fields

    const { data: sessions, error } = await query;

    if (error) {
      console.error('Error fetching sessions:', error);
      return NextResponse.json(
        { error: 'Failed to fetch sessions' },
        { status: 500 }
      );
    }

    // Transform the data to match the frontend expectations
    const transformedSessions = sessions?.map(session => {
      // Parse speakers and tags from JSON if they're strings
      const speakers = typeof session.speakers === 'string'
        ? JSON.parse(session.speakers)
        : session.speakers || [];
      const tags = typeof session.tags === 'string'
        ? JSON.parse(session.tags)
        : session.tags || [];

      // Extract tag names for easier processing
      const tagNames = tags.map((tag: any) =>
        typeof tag === 'object' ? tag.name : tag
      ).filter(Boolean);

      return {
        id: session.id,
        title: session.title,
        description: session.description,
        start_time: session.start_time,
        end_time: session.end_time,
        session_level: session.session_level || 'OPEN TO ALL LEVELS',
        reservation_required: session.reservation_required || false,
        sponsor_name: session.sponsor_name,
        sponsor_logo: session.sponsor_logo,
        room: session.room,
        max_attendees: session.max_attendees,
        current_attendees: session.current_attendees,
        speakers: speakers,
        tags: tagNames,
        // Calculate duration
        duration: session.start_time && session.end_time
          ? Math.round((new Date(session.end_time).getTime() - new Date(session.start_time).getTime()) / (1000 * 60))
          : null,
        // Format time for display
        time: session.start_time
          ? new Date(session.start_time).toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: true
            })
          : null,
        // Extract date
        date: session.start_time
          ? new Date(session.start_time).toISOString().split('T')[0]
          : null,
        // Determine session type from tags
        type: tagNames.length > 0
          ? (tagNames.find((tag: string) =>
              ['Keynote', 'Workshop', 'Session', 'Deep Dive'].includes(tag)
            ) || 'Session')
          : 'Session',
        // Determine track from tags
        track: tagNames.length > 0 ? (tagNames[0] || 'General') : 'General',
        // Featured status (could be based on speaker count or other criteria)
        featured: speakers && speakers.length > 1,
        // Attendee count for display
        attendees: session.current_attendees || 0
      };
    }) || [];

    return NextResponse.json({
      sessions: transformedSessions,
      total: transformedSessions.length
    });

  } catch (error) {
    console.error('Unexpected error in sessions API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}