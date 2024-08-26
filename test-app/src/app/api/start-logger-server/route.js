import { NextRequest, NextResponse } from 'next/server';

export async function GET(request) {
  if (typeof window === 'undefined') {
    // Server-side code to start the WebSocket server
    await import('floating-logger/server');
  }

  return NextResponse.json('Floating Logger Websocket server initialized', { status: 200 });
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