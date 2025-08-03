import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase-server';

// POST /api/speakers/applications - Submit speaker application
export async function POST(request: NextRequest) {
  try {
    if (!supabaseServer) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 503 }
      );
    }

    const applicationData = await request.json();
    
    // Validate required fields
    const requiredFields = ['email', 'full_name', 'title', 'company', 'bio'];
    const missingFields = requiredFields.filter(field => !applicationData[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }
    
    // Check if application already exists
    const { data: existing } = await supabaseServer
      .from('speaker_applications')
      .select('id, application_status')
      .eq('email', applicationData.email)
      .single();
    
    if (existing) {
      return NextResponse.json(
        { 
          error: 'Application already exists for this email',
          existing_status: existing.application_status,
          application_id: existing.id
        },
        { status: 409 }
      );
    }
    
    // Sanitize and prepare application data
    const cleanApplicationData = {
      email: applicationData.email.toLowerCase().trim(),
      full_name: applicationData.full_name.trim(),
      title: applicationData.title.trim(),
      company: applicationData.company.trim(),
      bio: applicationData.bio.trim(),
      avatar: applicationData.avatar || null,
      social_linkedin: applicationData.social_linkedin || null,
      social_twitter: applicationData.social_twitter || null,
      social_website: applicationData.social_website || null,
      youtube_channel: applicationData.youtube_channel || null,
      experience_level: applicationData.experience_level || 'intermediate',
      preferred_topics: applicationData.preferred_topics || [],
      availability_notes: applicationData.availability_notes || null,
      applied_at: new Date().toISOString()
    };
    
    const { data: application, error } = await supabaseServer
      .from('speaker_applications')
      .insert(cleanApplicationData)
      .select()
      .single();
    
    if (error) {
      console.error('Error submitting application:', error);
      throw error;
    }
    
    return NextResponse.json({ 
      application: {
        id: application.id,
        email: application.email,
        full_name: application.full_name,
        application_status: application.application_status,
        applied_at: application.applied_at
      },
      message: 'Application submitted successfully! We will review it and get back to you soon.'
    });
    
  } catch (error: any) {
    console.error('Error submitting speaker application:', error);
    return NextResponse.json(
      { error: 'Failed to submit application' },
      { status: 500 }
    );
  }
}

// GET /api/speakers/applications - List applications (admin only)
export async function GET(request: NextRequest) {
  try {
    if (!supabaseServer) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 503 }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const email = searchParams.get('email');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    
    // TODO: Add authentication check for admin role or user's own application
    
    let query = supabaseServer
      .from('speaker_applications')
      .select('*')
      .order('applied_at', { ascending: false })
      .range(offset, offset + limit - 1);
    
    if (status && status !== 'all') {
      query = query.eq('application_status', status);
    }
    
    if (email) {
      query = query.eq('email', email.toLowerCase());
    }
    
    const { data: applications, error } = await query;
    
    if (error) {
      console.error('Error fetching applications:', error);
      throw error;
    }
    
    // Get total count for pagination
    let countQuery = supabaseServer
      .from('speaker_applications')
      .select('*', { count: 'exact', head: true });
    
    if (status && status !== 'all') {
      countQuery = countQuery.eq('application_status', status);
    }
    
    if (email) {
      countQuery = countQuery.eq('email', email.toLowerCase());
    }
    
    const { count } = await countQuery;
    
    return NextResponse.json({
      applications: applications || [],
      total: count || 0,
      limit,
      offset,
      summary: {
        pending: applications?.filter(app => app.application_status === 'pending').length || 0,
        approved: applications?.filter(app => app.application_status === 'approved').length || 0,
        rejected: applications?.filter(app => app.application_status === 'rejected').length || 0
      }
    });
    
  } catch (error: any) {
    console.error('Error fetching speaker applications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch applications' },
      { status: 500 }
    );
  }
}