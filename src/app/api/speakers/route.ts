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
    const category = searchParams.get('category');

    // Get all sessions first
    const { data: sessions, error: sessionsError } = await supabaseServer
      .from('sessions')
      .select('*')
      .order('start_time', { ascending: true });

    if (sessionsError) {
      console.error('Error fetching sessions:', sessionsError);
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
    let speakersData: any[] = [];
    if (allSpeakerIds.size > 0) {
      const { data, error: speakersError } = await supabaseServer
        .from('speakers')
        .select('id, name, title, company, avatar, bio')
        .in('id', Array.from(allSpeakerIds));
      
      if (speakersError) {
        console.error('Error fetching speakers:', speakersError);
        return NextResponse.json(
          { error: 'Failed to fetch speaker details' },
          { status: 500 }
        );
      }
      
      speakersData = data || [];
    }

    // Create speakers map and session mapping
    const speakersMap = new Map();
    const speakerSessions = new Map();

    // Initialize speakers map
    speakersData.forEach(speaker => {
      speakersMap.set(speaker.id, {
        id: speaker.id,
        name: speaker.name,
        title: speaker.title,
        company: speaker.company,
        avatar: speaker.avatar,
        bio: speaker.bio || `${speaker.title} at ${speaker.company}`,
        expertise: [], // Will be populated from session tags
        sessions: [],
        featured: false // Will be determined by session count or other criteria
      });
      speakerSessions.set(speaker.id, []);
    });

    // Map sessions to speakers
    sessions?.forEach(session => {
      if (session.speaker_ids && Array.isArray(session.speaker_ids)) {
        session.speaker_ids.forEach((speakerId: string) => {
          if (speakersMap.has(speakerId)) {
            speakerSessions.get(speakerId).push({
              id: session.id,
              title: session.title,
              description: session.description,
              start_time: session.start_time,
              tags: session.tags || []
            });
          }
        });
      }
    });

    // Convert to array and enrich with session data
    const speakers = Array.from(speakersMap.values()).map(speaker => {
      const sessions = speakerSessions.get(speaker.id) || [];
      
      // Extract expertise from session tags
      const expertiseSet = new Set();
      sessions.forEach((session: any) => {
        if (session.tags && Array.isArray(session.tags)) {
          session.tags.forEach((tag: string) => {
            if (tag) {
              expertiseSet.add(tag);
            }
          });
        }
      });

      // Determine if speaker is featured (has multiple sessions)
      const featured = sessions.length > 1;

      return {
        ...speaker,
        expertise: Array.from(expertiseSet).slice(0, 5), // Limit to top 5 expertise areas
        sessions: sessions.map((s: any) => s.title), // Just session titles for display
        sessionCount: sessions.length,
        featured,
        // Use first session for primary session display
        session: sessions.length > 0 ? sessions[0].title : 'Session TBA'
      };
    });

    // Sort speakers by session count and name
    speakers.sort((a, b) => {
      if (a.featured !== b.featured) return b.featured ? 1 : -1;
      if (a.sessionCount !== b.sessionCount) return b.sessionCount - a.sessionCount;
      return a.name.localeCompare(b.name);
    });

    // Filter by category if specified
    let filteredSpeakers = speakers;
    if (category && category !== 'All Speakers') {
      if (category === 'Featured') {
        filteredSpeakers = speakers.filter(s => s.featured);
      } else {
        // Filter by expertise area
        filteredSpeakers = speakers.filter(s => 
          s.expertise.some((exp: string) => 
            exp.toLowerCase().includes(category.toLowerCase()) ||
            category.toLowerCase().includes(exp.toLowerCase())
          )
        );
      }
    }

    return NextResponse.json({
      speakers: filteredSpeakers,
      total: filteredSpeakers.length,
      categories: {
        'All Speakers': speakers.length,
        'Featured': speakers.filter(s => s.featured).length,
        'Growth Marketing': speakers.filter(s => 
          s.expertise.some((exp: string) => exp.toLowerCase().includes('growth') || exp.toLowerCase().includes('marketing'))
        ).length,
        'Sales & RevOps': speakers.filter(s => 
          s.expertise.some((exp: string) => exp.toLowerCase().includes('sales') || exp.toLowerCase().includes('revenue'))
        ).length,
        'Customer Success': speakers.filter(s => 
          s.expertise.some((exp: string) => exp.toLowerCase().includes('customer') || exp.toLowerCase().includes('success'))
        ).length
      }
    });

  } catch (error) {
    console.error('Unexpected error in speakers API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}