import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase-server';
import { createUserSchema } from '@/lib/validations';
import { withValidation, createSuccessResponse, createErrorResponse } from '@/lib/validation-middleware';

// GET /api/users - Get all users
export async function GET() {
  try {
    const { data, error } = await supabaseServer
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return createErrorResponse(`Failed to fetch users: ${error.message}`, 500);
    }

    return createSuccessResponse(data);
  } catch (error) {
    console.error('GET /api/users error:', error);
    return createErrorResponse('Internal server error', 500);
  }
}

// POST /api/users - Create a new user with validation
export const POST = withValidation(
  createUserSchema,
  async (request: NextRequest, validatedData) => {
    try {
      const { email, fullName, company, jobTitle, phone } = validatedData;

      // Check if user already exists
      const { data: existingUser } = await supabaseServer
        .from('users')
        .select('id')
        .eq('email', email)
        .single();

      if (existingUser) {
        return createErrorResponse('User with this email already exists', 409);
      }

      const { data, error } = await supabaseServer
        .from('users')
        .insert({
          email,
          full_name: fullName,
          company,
          job_title: jobTitle,
          phone,
        })
        .select()
        .single();

      if (error) {
        return createErrorResponse(`Failed to create user: ${error.message}`, 500);
      }

      return createSuccessResponse(data, 'User created successfully', 201);
    } catch (error) {
      console.error('POST /api/users error:', error);
      return createErrorResponse('Internal server error', 500);
    }
  }
);