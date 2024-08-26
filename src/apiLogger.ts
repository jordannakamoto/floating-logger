// src/server/apiLogger.ts
import { NextRequest, NextResponse } from 'next/server';

import { addLog } from './initLogger';
import { broadcastLog } from './server/wsServer'; // Import broadcastLog function

// Middleware function to log API requests and responses
export function withGlobalLogging(handler: (req: Request) => Promise<NextResponse>) {
  return async (req: Request): Promise<NextResponse> => {

    broadcastLog(`API Request: ${req.method} ${req.url}`); // Send log to WebSocket clients

    const response = await handler(req);

    broadcastLog(`API Response: ${req.method} ${req.url} - Status: ${response.status}`); // Send log to WebSocket clients

    return response;
  };
}