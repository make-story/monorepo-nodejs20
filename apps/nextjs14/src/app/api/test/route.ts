/**
 * [example] API Route
 */
//import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  return new Response('TEST', { status: 200 });
}
