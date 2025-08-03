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
    const company = searchParams.get('company') || '';
    const includeDetails = searchParams.get('include_details') === 'true';
    
    const offset = (page - 1) * limit;

    let query = supabase
      .from(includeDetails ? 'remote_speaker_details' : 'remote_speakers')
      .select('*');

    // Apply filters
    if (search) {
      query = query.or(`name.ilike.%${search}%,title.ilike.%${search}%,company.ilike.%${search}%`);
    }

    if (company) {
      query = query.eq('company', company);
    }

    // Apply pagination
    query = query
      .range(offset, offset + limit - 1)
      .order('name', { ascending: true });

    const { data: speakers, error, count } = await query;

    if (error) {
      console.error('Error fetching remote speakers:', error);
      return NextResponse.json(
        { error: 'Failed to fetch remote speakers' },
        { status: 500 }
      );
    }

    // Get total count for pagination
    const { count: totalCount } = await supabase
      .from('remote_speakers')
      .select('*', { count: 'exact', head: true });

    return NextResponse.json({
      speakers: speakers || [],
      pagination: {
        page,
        limit,
        total: totalCount || 0,
        totalPages: Math.ceil((totalCount || 0) / limit)
      }
    });

  } catch (error) {
    console.error('Error in remote speakers API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, speaker_data, speaker_id } = body;

    if (action === 'sync_all') {
      // Sync all speakers from speakers table to remote_speakers
      const { data, error } = await supabase.rpc('sync_all_speakers_to_remote');
      
      if (error) {
        console.error('Error syncing all speakers:', error);
        return NextResponse.json(
          { error: 'Failed to sync speakers' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        message: 'Successfully synced all speakers to remote_speakers',
        synced_count: data
      });
    }

    if (action === 'sync_all_sessions') {
      // Sync all session speakers to remote session speakers
      const { data, error } = await supabase.rpc('sync_all_session_speakers_to_remote');
      
      if (error) {
        console.error('Error syncing session speakers:', error);
        return NextResponse.json(
          { error: 'Failed to sync session speakers' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        message: 'Successfully synced all session speakers to remote session speakers',
        synced_count: data
      });
    }

    if (action === 'sync_session' && body.session_id) {
      // Sync specific session speakers to remote
      const { data, error } = await supabase.rpc('sync_session_speakers_to_remote', {
        p_session_id: body.session_id
      });
      
      if (error) {
        console.error('Error syncing session speakers:', error);
        return NextResponse.json(
          { error: 'Failed to sync session speakers' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        message: 'Successfully synced session speakers to remote',
        synced_count: data
      });
    }

    if (action === 'assign_to_session' && body.session_id && body.remote_speaker_id) {
      // Assign remote speaker to session
      const { error } = await supabase.rpc('assign_remote_speaker_to_session', {
        p_session_id: body.session_id,
        p_remote_speaker_id: body.remote_speaker_id,
        p_speaker_order: body.speaker_order || 1
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

    if (action === 'remove_from_session' && body.session_id && body.remote_speaker_id) {
      // Remove remote speaker from session
      const { error } = await supabase.rpc('remove_remote_speaker_from_session', {
        p_session_id: body.session_id,
        p_remote_speaker_id: body.remote_speaker_id
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

    if (action === 'sync_one' && speaker_id) {
      // Sync specific speaker from speakers table to remote_speakers
      const { error } = await supabase.rpc('sync_speaker_to_remote', {
        speaker_uuid: speaker_id
      });
      
      if (error) {
        console.error('Error syncing speaker:', error);
        return NextResponse.json(
          { error: 'Failed to sync speaker' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        message: 'Successfully synced speaker to remote_speakers'
      });
    }

    if (action === 'create' && speaker_data) {
      // Create new remote speaker
      const { data, error } = await supabase
        .from('remote_speakers')
        .insert([speaker_data])
        .select()
        .single();

      if (error) {
        console.error('Error creating remote speaker:', error);
        return NextResponse.json(
          { error: 'Failed to create remote speaker' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        message: 'Remote speaker created successfully',
        speaker: data
      });
    }

    return NextResponse.json(
      { error: 'Invalid action or missing required parameters' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Error in remote speakers POST API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Speaker ID is required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('remote_speakers')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating remote speaker:', error);
      return NextResponse.json(
        { error: 'Failed to update remote speaker' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Remote speaker updated successfully',
      speaker: data
    });

  } catch (error) {
    console.error('Error in remote speakers PUT API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Speaker ID is required' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('remote_speakers')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting remote speaker:', error);
      return NextResponse.json(
        { error: 'Failed to delete remote speaker' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Remote speaker deleted successfully'
    });

  } catch (error) {
    console.error('Error in remote speakers DELETE API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}