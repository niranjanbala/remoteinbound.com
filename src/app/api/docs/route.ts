import { NextResponse } from 'next/server';
import { openApiSpec } from '@/lib/openapi-spec';

// GET /api/docs - Serve OpenAPI specification
export async function GET() {
  return NextResponse.json(openApiSpec, {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}