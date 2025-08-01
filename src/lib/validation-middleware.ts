import { NextRequest, NextResponse } from 'next/server';
import { z, ZodError } from 'zod';

export interface ValidationError {
  field: string;
  message: string;
}

export function formatZodError(error: ZodError): ValidationError[] {
  return error.issues.map((err) => ({
    field: err.path.join('.'),
    message: err.message,
  }));
}

export function createValidationResponse(errors: ValidationError[]) {
  return NextResponse.json(
    {
      error: 'Validation failed',
      details: {
        validationErrors: errors,
      },
    },
    { status: 400 }
  );
}

// Middleware to validate request body
export function withValidation<T>(
  schema: z.ZodSchema<T>,
  handler: (request: NextRequest, validatedData: T) => Promise<NextResponse>
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    try {
      const body = await request.json();
      const validatedData = schema.parse(body);
      return handler(request, validatedData);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationErrors = formatZodError(error);
        return createValidationResponse(validationErrors);
      }
      
      if (error instanceof SyntaxError) {
        return NextResponse.json(
          { error: 'Invalid JSON format' },
          { status: 400 }
        );
      }

      console.error('Validation middleware error:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  };
}

// Middleware to validate query parameters
export function withQueryValidation<T>(
  schema: z.ZodSchema<T>,
  handler: (request: NextRequest, validatedQuery: T) => Promise<NextResponse>
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    try {
      const { searchParams } = new URL(request.url);
      const queryObject = Object.fromEntries(searchParams.entries());
      const validatedQuery = schema.parse(queryObject);
      return handler(request, validatedQuery);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationErrors = formatZodError(error);
        return createValidationResponse(validationErrors);
      }

      console.error('Query validation middleware error:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  };
}

// Middleware to validate path parameters
export function withParamsValidation<T>(
  schema: z.ZodSchema<T>,
  handler: (request: NextRequest, validatedParams: T, context?: any) => Promise<NextResponse>
) {
  return async (request: NextRequest, context?: any): Promise<NextResponse> => {
    try {
      const validatedParams = schema.parse(context?.params || {});
      return handler(request, validatedParams, context);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationErrors = formatZodError(error);
        return createValidationResponse(validationErrors);
      }

      console.error('Params validation middleware error:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  };
}

// Combined middleware for body + auth validation
export function withValidationAndAuth<T>(
  schema: z.ZodSchema<T>,
  authMiddleware: (request: NextRequest, handler: (req: NextRequest) => Promise<NextResponse>, options?: any) => Promise<NextResponse>,
  handler: (request: NextRequest, validatedData: T) => Promise<NextResponse>,
  authOptions?: any
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    // First validate the request body
    const validatedHandler = withValidation(schema, handler);
    
    // Then apply authentication
    return authMiddleware(request, validatedHandler, authOptions);
  };
}

// Utility function to safely parse JSON
export async function safeParseJSON(request: NextRequest): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    const body = await request.json();
    return { success: true, data: body };
  } catch (error) {
    if (error instanceof SyntaxError) {
      return { success: false, error: 'Invalid JSON format' };
    }
    return { success: false, error: 'Failed to parse request body' };
  }
}

// Utility function to create standardized error responses
export function createErrorResponse(message: string, status: number = 500, details?: any) {
  return NextResponse.json(
    {
      error: message,
      ...(details && { details }),
    },
    { status }
  );
}

// Utility function to create standardized success responses
export function createSuccessResponse(data: any, message?: string, status: number = 200) {
  return NextResponse.json(
    {
      ...(message && { message }),
      data,
    },
    { status }
  );
}