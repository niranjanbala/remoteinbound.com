import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase-server';

// POST /api/sessions/[id]/claim - Claim a session
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (!supabaseServer) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 503 }
      );
    }

    const { speakerId, notes } = await request.json();
    const sessionId = params.id;
    
    if (!speakerId) {
      return NextResponse.json(
        { error: 'Speaker ID is required' },
        { status: 400 }
      );
    }
    
    // Check if session exists and is available
    const { data: existingClaim, error: checkError } = await supabaseServer
      .from('session_claims')
      .select('*')
      .eq('session_id', sessionId)
      .single();
    
    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error checking existing claim:', checkError);
      throw checkError;
    }
    
    if (existingClaim && existingClaim.claim_status !== 'available') {
      return NextResponse.json(
        { 
          error: 'Session is already claimed',
          current_status: existingClaim.claim_status,
          claimed_by: existingClaim.new_speaker_id
        },
        { status: 409 }
      );
    }
    
    // Verify speaker exists
    const { data: speaker, error: speakerError } = await supabaseServer
      .from('speakers')
      .select('id, name, company')
      .eq('id', speakerId)
      .single();
    
    if (speakerError || !speaker) {
      return NextResponse.json(
        { error: 'Speaker not found' },
        { status: 404 }
      );
    }
    
    // Update or create claim
    const claimData = {
      session_id: sessionId,
      new_speaker_id: speakerId,
      claim_status: 'claimed',
      claimed_at: new Date().toISOString(),
      notes: notes || null
    };
    
    const { data: claim, error: claimError } = await supabaseServer
      .from('session_claims')
      .upsert(claimData, { onConflict: 'session_id' })
      .select()
      .single();
    
    if (claimError) {
      console.error('Error creating/updating claim:', claimError);
      throw claimError;
    }
    
    // Update session status
    const { error: sessionUpdateError } = await supabaseServer
      .from('sessions')
      .update({ is_claimed: true })
      .eq('id', sessionId);
    
    if (sessionUpdateError) {
      console.error('Error updating session status:', sessionUpdateError);
      // Don't throw here as the claim was successful
    }
    
    return NextResponse.json({ 
      claim,
      speaker: {
        id: speaker.id,
        name: speaker.name,
        company: speaker.company
      },
      message: `Session successfully claimed by ${speaker.name}`
    });
    
  } catch (error: any) {
    console.error('Error claiming session:', error);
    return NextResponse.json(
      { error: 'Failed to claim session' },
      { status: 500 }
    );
  }
}

// PUT /api/sessions/[id]/claim - Update claim details
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (!supabaseServer) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 503 }
      );
    }

    const updates = await request.json();
    const sessionId = params.id;
    
    // Validate allowed updates
    const allowedFields = [
      'youtube_stream_url',
      'youtube_video_id',
      'notes',
      'claim_status'
    ];
    
    const filteredUpdates = Object.keys(updates)
      .filter(key => allowedFields.includes(key))
      .reduce((obj, key) => {
        obj[key] = updates[key];
        return obj;
      }, {} as any);
    
    if (Object.keys(filteredUpdates).length === 0) {
      return NextResponse.json(
        { error: 'No valid fields to update' },
        { status: 400 }
      );
    }
    
    // Add timestamp for status changes
    if (filteredUpdates.claim_status) {
      switch (filteredUpdates.claim_status) {
        case 'confirmed':
          filteredUpdates.confirmed_at = new Date().toISOString();
          break;
        case 'completed':
          filteredUpdates.completed_at = new Date().toISOString();
          break;
      }
    }
    
    const { data: claim, error } = await supabaseServer
      .from('session_claims')
      .update(filteredUpdates)
      .eq('session_id', sessionId)
      .select(`
        *,
        speaker:new_speaker_id (
          id,
          name,
          company,
          avatar
        )
      `)
      .single();
    
    if (error) {
      console.error('Error updating claim:', error);
      throw error;
    }
    
    return NextResponse.json({ 
      claim,
      message: 'Claim updated successfully'
    });
    
  } catch (error: any) {
    console.error('Error updating claim:', error);
    return NextResponse.json(
      { error: 'Failed to update claim' },
      { status: 500 }
    );
  }
}

// DELETE /api/sessions/[id]/claim - Release a claim
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (!supabaseServer) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 503 }
      );
    }

    const sessionId = params.id;
    
    // Get current claim info for logging
    const { data: currentClaim } = await supabaseServer
      .from('session_claims')
      .select(`
        *,
        speaker:new_speaker_id (name, company)
      `)
      .eq('session_id', sessionId)
      .single();
    
    // Reset claim to available
    const { error: claimError } = await supabaseServer
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
      .eq('session_id', sessionId);
    
    if (claimError) {
      console.error('Error releasing claim:', claimError);
      throw claimError;
    }
    
    // Update session status
    const { error: sessionUpdateError } = await supabaseServer
      .from('sessions')
      .update({ is_claimed: false })
      .eq('id', sessionId);
    
    if (sessionUpdateError) {
      console.error('Error updating session status:', sessionUpdateError);
      // Don't throw here as the claim release was successful
    }
    
    return NextResponse.json({ 
      success: true,
      message: currentClaim?.speaker 
        ? `Session released from ${currentClaim.speaker.name}`
        : 'Session released successfully'
    });
    
  } catch (error: any) {
    console.error('Error releasing claim:', error);
    return NextResponse.json(
      { error: 'Failed to release claim' },
      { status: 500 }
    );
  }
}

// GET /api/sessions/[id]/claim - Get claim details for a session
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (!supabaseServer) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 503 }
      );
    }

    const sessionId = params.id;
    
    const { data: claim, error } = await supabaseServer
      .from('session_claims_overview')
      .select('*')
      .eq('id', sessionId)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Session not found' },
          { status: 404 }
        );
      }
      throw error;
    }
    
    return NextResponse.json({ claim });
    
  } catch (error: any) {
    console.error('Error fetching claim details:', error);
    return NextResponse.json(
      { error: 'Failed to fetch claim details' },
      { status: 500 }
    );
  }
}