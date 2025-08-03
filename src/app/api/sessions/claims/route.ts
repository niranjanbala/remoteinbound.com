import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase-server';

// GET /api/sessions/claims - Get available sessions for claiming
export async function GET(request: NextRequest) {
  try {
    if (!supabaseServer) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 503 }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'available';
    const userId = searchParams.get('userId');
    const eventYear = searchParams.get('eventYear') || '2025';
    const day = searchParams.get('day') || ''; // Sep 3, Sep 4, Sep 5
    
    let query = supabaseServer
      .from('session_claims_overview')
      .select('*')
      .eq('event_year', parseInt(eventYear));
    
    if (status !== 'all') {
      query = query.eq('claim_status', status);
    }
    
    if (userId) {
      query = query.eq('new_speaker_id', userId);
    }

    // Filter by day (Sep 3, 4, 5 = 2025-09-03, 2025-09-04, 2025-09-05)
    if (day) {
      let dateFilter = '';
      switch (day.toLowerCase()) {
        case 'sep 3':
        case 'sep-3':
        case 'september 3':
        case '2025-09-03':
        case 'day1':
          dateFilter = '2025-09-03';
          break;
        case 'sep 4':
        case 'sep-4':
        case 'september 4':
        case '2025-09-04':
        case 'day2':
          dateFilter = '2025-09-04';
          break;
        case 'sep 5':
        case 'sep-5':
        case 'september 5':
        case '2025-09-05':
        case 'day3':
          dateFilter = '2025-09-05';
          break;
      }
      
      if (dateFilter) {
        query = query.gte('start_time', `${dateFilter}T00:00:00Z`)
                    .lt('start_time', `${dateFilter}T23:59:59Z`);
      }
    }
    
    const { data: sessions, error } = await query.order('start_time', { ascending: true });
    
    if (error) {
      console.error('Error fetching session claims:', error);
      return NextResponse.json(
        { error: 'Failed to fetch session claims' },
        { status: 500 }
      );
    }

    // Transform the data to match frontend expectations
    const transformedSessions = sessions?.map(session => ({
      id: session.id,
      title: session.title,
      description: session.description,
      start_time: session.start_time,
      end_time: session.end_time,
      tags: session.tags || [],
      room: session.room,
      max_attendees: session.max_attendees,
      event_year: session.event_year,
      is_claimed: session.is_claimed,
      claim_status: session.claim_status || 'available',
      youtube_stream_url: session.youtube_stream_url,
      youtube_video_id: session.youtube_video_id,
      new_speaker: session.new_speaker_name ? {
        name: session.new_speaker_name,
        company: session.new_speaker_company,
        avatar: session.new_speaker_avatar,
        bio: session.new_speaker_bio
      } : null,
      claimed_at: session.claimed_at,
      confirmed_at: session.confirmed_at,
      notes: session.notes,
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
        : null
    })) || [];
    
    return NextResponse.json({
      sessions: transformedSessions,
      total: transformedSessions.length,
      summary: {
        available: transformedSessions.filter(s => s.claim_status === 'available').length,
        claimed: transformedSessions.filter(s => s.claim_status === 'claimed').length,
        confirmed: transformedSessions.filter(s => s.claim_status === 'confirmed').length,
        completed: transformedSessions.filter(s => s.claim_status === 'completed').length
      }
    });
    
  } catch (error: any) {
    console.error('Unexpected error in session claims API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/sessions/claims - Bulk operations (admin only)
export async function POST(request: NextRequest) {
  try {
    if (!supabaseServer) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 503 }
      );
    }

    const { action, sessionIds, data } = await request.json();
    
    // TODO: Add authentication check for admin role
    
    switch (action) {
      case 'bulk_confirm':
        const { error: confirmError } = await supabaseServer
          .from('session_claims')
          .update({
            claim_status: 'confirmed',
            confirmed_at: new Date().toISOString()
          })
          .in('session_id', sessionIds)
          .eq('claim_status', 'claimed');
        
        if (confirmError) throw confirmError;
        
        return NextResponse.json({ 
          success: true, 
          message: `Confirmed ${sessionIds.length} session claims` 
        });
      
      case 'bulk_reset':
        const { error: resetError } = await supabaseServer
          .from('session_claims')
          .update({
            new_speaker_id: null,
            claim_status: 'available',
            claimed_at: null,
            confirmed_at: null,
            completed_at: null,
            youtube_stream_url: null,
            youtube_video_id: null,
            notes: null
          })
          .in('session_id', sessionIds);
        
        if (resetError) throw resetError;
        
        // Update sessions table
        await supabaseServer
          .from('sessions')
          .update({ is_claimed: false })
          .in('id', sessionIds);
        
        return NextResponse.json({ 
          success: true, 
          message: `Reset ${sessionIds.length} session claims` 
        });
      
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }
    
  } catch (error: any) {
    console.error('Error in bulk session claims operation:', error);
    return NextResponse.json(
      { error: 'Failed to perform bulk operation' },
      { status: 500 }
    );
  }
}