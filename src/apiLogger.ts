// src/apiLogger.ts

import { NextRequest, NextResponse } from 'next/server';

import { addLog } from './initLogger'; // Default logging function in case no global alias is set

// Middleware function to log API requests and responses
export function withApiLogging(handler: (req: NextRequest) => Promise<NextResponse>) {
  return async (req: NextRequest): Promise<NextResponse> => {
    // Dynamically get the logging function alias set by configureLogger or fall back to addLog
    const logger = (globalThis as any)[(globalThis as any).logFunctionAlias] || addLog;

    // Log incoming request details
    logger('api', `API Request: ${req.method} ${req.url}`);

    // Run the original handler to get the response
    const response = await handler(req);

    // Clone the response to log it and still be able to send it
    const clonedResponse = response.clone();

    // Log response details
    logger('api', `API Response: ${req.method} ${req.url} - Status: ${clonedResponse.status}`);

    // Return the original response
    return response;
  };
}