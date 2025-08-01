import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

export async function withAuth(
  request: NextRequest,
  handler: (request: NextRequest) => Promise<NextResponse>,
  options: { requireAdmin?: boolean } = {}
) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    if (options.requireAdmin && session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    // Add user info to request headers for use in handlers
    const requestWithUser = new NextRequest(request.url, {
      method: request.method,
      headers: {
        ...request.headers,
        'x-user-id': session.user.id,
        'x-user-email': session.user.email || '',
        'x-user-role': session.user.role || 'attendee',
      },
      body: request.body,
    });

    return handler(requestWithUser);
  } catch (error) {
    console.error('Auth middleware error:', error);
    return NextResponse.json(
      { error: 'Authentication error' },
      { status: 500 }
    );
  }
}

// Helper function to get user from request headers
export function getUserFromRequest(request: NextRequest) {
  return {
    id: request.headers.get('x-user-id') || '',
    email: request.headers.get('x-user-email') || '',
    role: request.headers.get('x-user-role') || 'attendee',
  };
}