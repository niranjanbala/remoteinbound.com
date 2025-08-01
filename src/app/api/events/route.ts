import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase-server';
import { createEventSchema } from '@/lib/validations';
import { withValidation, createSuccessResponse, createErrorResponse } from '@/lib/validation-middleware';

// GET /api/events - Get all events
export async function GET() {
  try {
    const { data, error } = await supabaseServer
      .from('events')
      .select('*')
      .order('start_date', { ascending: true });

    if (error) {
      return createErrorResponse(`Failed to fetch events: ${error.message}`, 500);
    }

    return createSuccessResponse(data);
  } catch (error) {
    console.error('GET /api/events error:', error);
    return createErrorResponse('Internal server error', 500);
  }
}

// POST /api/events - Create a new event with validation
export const POST = withValidation(
  createEventSchema,
  async (request: NextRequest, validatedData) => {
    try {
      const {
        title,
        description,
        startDate,
        endDate,
        timezone,
        status,
        coverImage,
        maxAttendees,
        currentAttendees,
        tags,
        organizer
      } = validatedData;

      // Check for conflicting events (optional business logic)
      const { data: conflictingEvents } = await supabaseServer
        .from('events')
        .select('id, title')
        .eq('title', title)
        .eq('start_date', startDate);

      if (conflictingEvents && conflictingEvents.length > 0) {
        return createErrorResponse('An event with the same title and start date already exists', 409);
      }

      const { data, error } = await supabaseServer
        .from('events')
        .insert({
          title,
          description,
          start_date: startDate,
          end_date: endDate,
          timezone,
          status,
          cover_image: coverImage,
          max_attendees: maxAttendees,
          current_attendees: currentAttendees,
          tags,
          organizer_name: organizer.name,
          organizer_email: organizer.email,
          organizer_avatar: organizer.avatar,
        })
        .select()
        .single();

      if (error) {
        return createErrorResponse(`Failed to create event: ${error.message}`, 500);
      }

      return createSuccessResponse(data, 'Event created successfully', 201);
    } catch (error) {
      console.error('POST /api/events error:', error);
      return createErrorResponse('Internal server error', 500);
    }
  }
);