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

    // Build query using the existing sessions table structure
    let query = supabaseServer
      .from('sessions')
      .select('*')
      .order('start_time', { ascending: true });

    // Apply filters
    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
    }

    if (level && level !== 'All Levels') {
      query = query.eq('session_level', level);
    }

    const { data: sessions, error } = await query;

    if (error) {
      console.error('Error fetching sessions:', error);
      return NextResponse.json(
        { error: 'Failed to fetch sessions' },
        { status: 500 }
      );
    }

    // Get unique speaker IDs from all sessions
    const allSpeakerIds = new Set<string>();
    sessions?.forEach(session => {
      if (session.speaker_ids && Array.isArray(session.speaker_ids)) {
        session.speaker_ids.forEach((id: string) => allSpeakerIds.add(id));
      }
    });

    // Fetch speaker details if we have speaker IDs
    let speakersMap = new Map();
    if (allSpeakerIds.size > 0) {
      const { data: speakersData } = await supabaseServer
        .from('speakers')
        .select('id, name, title, company, avatar')
        .in('id', Array.from(allSpeakerIds));
      
      speakersData?.forEach(speaker => {
        speakersMap.set(speaker.id, speaker);
      });
    }

    // Transform the data to match the frontend expectations
    let transformedSessions = sessions?.map(session => {
      // Get speaker details for this session
      const speakers = session.speaker_ids && Array.isArray(session.speaker_ids)
        ? session.speaker_ids.map((id: string) => speakersMap.get(id)).filter(Boolean)
        : [];

      // Handle tags array
      const tags = session.tags || [];

      return {
        id: session.id,
        title: session.title,
        description: session.description,
        start_time: session.start_time,
        end_time: session.end_time,
        session_level: 'OPEN TO ALL LEVELS', // Default for existing schema
        reservation_required: false, // Default for existing schema
        sponsor_name: null, // Not in existing schema
        sponsor_logo: null, // Not in existing schema
        room: session.room,
        max_attendees: session.max_attendees,
        current_attendees: session.current_attendees,
        speakers: speakers,
        tags: tags,
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
        type: tags.length > 0
          ? (tags.find((tag: string) =>
              ['Keynote', 'Workshop', 'Session', 'Deep Dive'].includes(tag)
            ) || 'Session')
          : 'Session',
        // Determine track from tags
        track: tags.length > 0 ? (tags[0] || 'General') : 'General',
        // Featured status (could be based on speaker count or other criteria)
        featured: speakers && speakers.length > 1,
        // Attendee count for display
        attendees: session.current_attendees || 0
      };
    }) || [];

    // Apply client-side filtering for track and type since they're derived from tags
    if (track && track !== 'All Tracks') {
      transformedSessions = transformedSessions.filter(session =>
        session.track === track
      );
    }

    if (type && type !== 'All Types') {
      transformedSessions = transformedSessions.filter(session =>
        session.type === type
      );
    }

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