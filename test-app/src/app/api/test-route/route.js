// src/app/api/test-route/route.ts

import { NextRequest, NextResponse } from 'next/server';

export async function GET(request) {
  // Simulate some processing
  const data = { message: 'Hello World' };
  myCustomLog("api", "Logging from backend");

  return NextResponse.json(data, { status: 200 });
}

export async function POST(request) {

  // Parse the request body
  const body = await req.json();
  myCustomLog("api", "Logging from backend");

  // Respond with the received data
  const responseData = { message: 'Received data', received: body };

  return NextResponse.json(responseData, { status: 200 });
}