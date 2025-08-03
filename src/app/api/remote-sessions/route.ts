import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const search = searchParams.get('search') || '';
    const hasRemoteSpeakers = searchParams.get('has_remote_speakers');
    const speakerName = searchParams.get('speaker_name') || '';
    const day = searchParams.get('day') || ''; // Sep 3, Sep 4, Sep 5
    
    const offset = (page - 1) * limit;

    let query = supabase
      .from('remote_session_details')
      .select('*');

    // Apply filters
    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
    }

    if (hasRemoteSpeakers === 'true') {
      query = query.gt('remote_speaker_count', 0);
    } else if (hasRemoteSpeakers === 'false') {
      query = query.eq('remote_speaker_count', 0);
    }

    if (speakerName) {
      // First get remote speaker IDs that match the name
      const { data: matchingSpeakers } = await supabase
        .from('remote_speakers')
        .select('id')
        .ilike('name', `%${speakerName}%`);
      
      if (matchingSpeakers && matchingSpeakers.length > 0) {
        const speakerIds = matchingSpeakers.map(s => s.id);
        
        // Then get session IDs that have these speakers
        const { data: sessionIds } = await supabase
          .from('remote_session_speakers')
          .select('session_id')
          .in('remote_speaker_id', speakerIds);
        
        if (sessionIds && sessionIds.length > 0) {
          query = query.in('id', sessionIds.map(s => s.session_id));
        } else {
          // No sessions found with that speaker name
          return NextResponse.json({
            sessions: [],
            pagination: {
              page,
              limit,
              total: 0,
              totalPages: 0
            }
          });
        }
      } else {
        // No speakers found with that name
        return NextResponse.json({
          sessions: [],
          pagination: {
            page,
            limit,
            total: 0,
            totalPages: 0
          }
        });
      }
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

    // Apply pagination
    query = query
      .range(offset, offset + limit - 1)
      .order('start_time', { ascending: true });

    const { data: sessions, error } = await query;

    if (error) {
      console.error('Error fetching remote sessions:', error);
      return NextResponse.json(
        { error: 'Failed to fetch remote sessions' },
        { status: 500 }
      );
    }

    // Get total count for pagination
    let countQuery = supabase
      .from('remote_session_details')
      .select('*', { count: 'exact', head: true });

    if (search) {
      countQuery = countQuery.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
    }

    if (hasRemoteSpeakers === 'true') {
      countQuery = countQuery.gt('remote_speaker_count', 0);
    } else if (hasRemoteSpeakers === 'false') {
      countQuery = countQuery.eq('remote_speaker_count', 0);
    }

    const { count: totalCount } = await countQuery;

    return NextResponse.json({
      sessions: sessions || [],
      pagination: {
        page,
        limit,
        total: totalCount || 0,
        totalPages: Math.ceil((totalCount || 0) / limit)
      }
    });

  } catch (error) {
    console.error('Error in remote sessions API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, session_id, remote_speaker_id, speaker_order } = body;

    if (action === 'assign_speaker' && session_id && remote_speaker_id) {
      // Assign remote speaker to session
      const { error } = await supabase.rpc('assign_remote_speaker_to_session', {
        p_session_id: session_id,
        p_remote_speaker_id: remote_speaker_id,
        p_speaker_order: speaker_order || 1
      });
      
      if (error) {
        console.error('Error assigning remote speaker to session:', error);
        return NextResponse.json(
          { error: 'Failed to assign remote speaker to session' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        message: 'Successfully assigned remote speaker to session'
      });
    }

    if (action === 'remove_speaker' && session_id && remote_speaker_id) {
      // Remove remote speaker from session
      const { error } = await supabase.rpc('remove_remote_speaker_from_session', {
        p_session_id: session_id,
        p_remote_speaker_id: remote_speaker_id
      });
      
      if (error) {
        console.error('Error removing remote speaker from session:', error);
        return NextResponse.json(
          { error: 'Failed to remove remote speaker from session' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        message: 'Successfully removed remote speaker from session'
      });
    }

    if (action === 'bulk_assign' && body.assignments) {
      // Bulk assign multiple speakers to sessions
      const assignments = body.assignments; // Array of {session_id, remote_speaker_id, speaker_order}
      const results = [];

      for (const assignment of assignments) {
        try {
          const { error } = await supabase.rpc('assign_remote_speaker_to_session', {
            p_session_id: assignment.session_id,
            p_remote_speaker_id: assignment.remote_speaker_id,
            p_speaker_order: assignment.speaker_order || 1
          });
          
          if (error) {
            results.push({
              session_id: assignment.session_id,
              remote_speaker_id: assignment.remote_speaker_id,
              success: false,
              error: error.message
            });
          } else {
            results.push({
              session_id: assignment.session_id,
              remote_speaker_id: assignment.remote_speaker_id,
              success: true
            });
          }
        } catch (err) {
          results.push({
            session_id: assignment.session_id,
            remote_speaker_id: assignment.remote_speaker_id,
            success: false,
            error: err instanceof Error ? err.message : 'Unknown error'
          });
        }
      }

      const successCount = results.filter(r => r.success).length;
      const failureCount = results.filter(r => !r.success).length;

      return NextResponse.json({
        message: `Bulk assignment completed: ${successCount} successful, ${failureCount} failed`,
        results,
        summary: {
          total: results.length,
          successful: successCount,
          failed: failureCount
        }
      });
    }

    return NextResponse.json(
      { error: 'Invalid action or missing required parameters' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Error in remote sessions POST API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { session_id, remote_speaker_id, speaker_order } = body;

    if (!session_id || !remote_speaker_id) {
      return NextResponse.json(
        { error: 'Session ID and Remote Speaker ID are required' },
        { status: 400 }
      );
    }

    // Update speaker order for existing assignment
    const { error } = await supabase
      .from('remote_session_speakers')
      .update({ speaker_order: speaker_order || 1 })
      .eq('session_id', session_id)
      .eq('remote_speaker_id', remote_speaker_id);

    if (error) {
      console.error('Error updating remote session speaker:', error);
      return NextResponse.json(
        { error: 'Failed to update remote session speaker' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Successfully updated remote session speaker'
    });

  } catch (error) {
    console.error('Error in remote sessions PUT API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('session_id');
    const remoteSpeakerId = searchParams.get('remote_speaker_id');

    if (!sessionId || !remoteSpeakerId) {
      return NextResponse.json(
        { error: 'Session ID and Remote Speaker ID are required' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('remote_session_speakers')
      .delete()
      .eq('session_id', sessionId)
      .eq('remote_speaker_id', remoteSpeakerId);

    if (error) {
      console.error('Error removing remote session speaker:', error);
      return NextResponse.json(
        { error: 'Failed to remove remote session speaker' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Successfully removed remote speaker from session'
    });

  } catch (error) {
    console.error('Error in remote sessions DELETE API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}