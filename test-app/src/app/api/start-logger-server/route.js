// src/app/api/test-route/route.js

import { NextResponse } from 'next/server';

// Use a global variable to track the initialization state
globalThis.isWebSocketServerInitialized = globalThis.isWebSocketServerInitialized || false;

export async function GET(request) {
  // Only initialize the WebSocket server once
  if (typeof window === 'undefined' && !globalThis.isWebSocketServerInitialized) {
    await import('floating-logger/server'); // Initialize WebSocket server
    globalThis.isWebSocketServerInitialized = true; // Mark as initialized
    console.log('WebSocket server initialized');
  }

  return NextResponse.json('Floating Logger WebSocket server initialized', { status: 200 });
}

export async function POST(request) {
  try {
    const { aliasName } = await request.json();

    if (!aliasName) {
      return NextResponse.json({ error: 'Invalid alias name' }, { status: 400 });
    }

    if (typeof window === 'undefined') {
      // Server-side code to configure the logger
      configureServerLogger(aliasName);
      return NextResponse.json({ message: 'Logger configured successfully' }, { status: 200 });
    }

    return NextResponse.json({ error: 'Cannot configure logger on the client side' }, { status: 400 });
  } catch (error) {
    console.error('Error configuring logger:', error);
    return NextResponse.json({ error: 'Failed to configure logger' }, { status: 500 });
  }
}