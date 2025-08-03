import { NextRequest, NextResponse } from 'next/server';

// Temporary placeholder until auth is properly configured
// Sessions and Speakers APIs work without authentication for public access
export async function GET(request: NextRequest) {
  return NextResponse.json({ error: 'Auth not configured' }, { status: 501 });
}

export async function POST(request: NextRequest) {
  return NextResponse.json({ error: 'Auth not configured' }, { status: 501 });
}