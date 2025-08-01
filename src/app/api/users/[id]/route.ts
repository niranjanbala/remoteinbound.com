import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { supabaseServer } from '@/lib/supabase-server';
import { updateUserSchema, uuidSchema } from '@/lib/validations';
import {
  withParamsValidation,
  withValidation,
  createSuccessResponse,
  createErrorResponse
} from '@/lib/validation-middleware';

// Schema for validating the ID parameter
const paramsSchema = z.object({
  id: uuidSchema,
});

// GET /api/users/[id] - Get user by ID
export const GET = withParamsValidation(
  paramsSchema,
  async (request: NextRequest, validatedParams) => {
    try {
      const { data, error } = await supabaseServer
        .from('users')
        .select('*')
        .eq('id', validatedParams.id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return createErrorResponse('User not found', 404);
        }
        return createErrorResponse(`Failed to fetch user: ${error.message}`, 500);
      }

      return createSuccessResponse(data);
    } catch (error) {
      console.error('GET /api/users/[id] error:', error);
      return createErrorResponse('Internal server error', 500);
    }
  }
);

// PUT /api/users/[id] - Update user with validation
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // First validate params
  const paramsValidation = paramsSchema.safeParse(params);
  if (!paramsValidation.success) {
    return createErrorResponse('Invalid user ID format', 400);
  }

  // Then validate body with the validation middleware
  return withValidation(
    updateUserSchema,
    async (req: NextRequest, validatedData) => {
      try {
        const { email, fullName, company, jobTitle, phone } = validatedData;

        // Check if user exists
        const { data: existingUser } = await supabaseServer
          .from('users')
          .select('id')
          .eq('id', paramsValidation.data.id)
          .single();

        if (!existingUser) {
          return createErrorResponse('User not found', 404);
        }

        // Check if email is already taken by another user
        if (email) {
          const { data: emailUser } = await supabaseServer
            .from('users')
            .select('id')
            .eq('email', email)
            .neq('id', paramsValidation.data.id)
            .single();

          if (emailUser) {
            return createErrorResponse('Email already taken by another user', 409);
          }
        }

        const updateData: Record<string, unknown> = {
          updated_at: new Date().toISOString(),
        };

        if (email) updateData.email = email;
        if (fullName) updateData.full_name = fullName;
        if (company !== undefined) updateData.company = company;
        if (jobTitle !== undefined) updateData.job_title = jobTitle;
        if (phone !== undefined) updateData.phone = phone;

        const { data, error } = await supabaseServer
          .from('users')
          .update(updateData)
          .eq('id', paramsValidation.data.id)
          .select()
          .single();

        if (error) {
          return createErrorResponse(`Failed to update user: ${error.message}`, 500);
        }

        return createSuccessResponse(data, 'User updated successfully');
      } catch (error) {
        console.error('PUT /api/users/[id] error:', error);
        return createErrorResponse('Internal server error', 500);
      }
    }
  )(request);
}

// DELETE /api/users/[id] - Delete user
export const DELETE = withParamsValidation(
  paramsSchema,
  async (request: NextRequest, validatedParams) => {
    try {
      // Check if user exists
      const { data: existingUser } = await supabaseServer
        .from('users')
        .select('id')
        .eq('id', validatedParams.id)
        .single();

      if (!existingUser) {
        return createErrorResponse('User not found', 404);
      }

      const { error } = await supabaseServer
        .from('users')
        .delete()
        .eq('id', validatedParams.id);

      if (error) {
        return createErrorResponse(`Failed to delete user: ${error.message}`, 500);
      }

      return createSuccessResponse(null, 'User deleted successfully');
    } catch (error) {
      console.error('DELETE /api/users/[id] error:', error);
      return createErrorResponse('Internal server error', 500);
    }
  }
);