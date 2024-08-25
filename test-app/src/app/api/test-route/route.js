// /app/api/my-route/route.ts

import { NextResponse } from 'next/server';
import { OAuth2Client } from 'google-auth-library';
import { google } from 'googleapis';

export const POST = myCustomLogMiddleware(async (request) => {
  myCustomLog('Processing POST request data', 'info');

  const data = await request.json();

  myCustomLog(`Received data: ${JSON.stringify(data)}`, 'debug');

  const client = new OAuth2Client(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    'http://localhost:3000',
  );

  client.setCredentials(data.tokens);
  const sheets = google.sheets({ version: 'v4', auth: client });
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: data.spreadsheetId,
    range: data.range,
  });

  return NextResponse.json({ response }, { status: 200 });
});

export const GET = myCustomLogMiddleware(async (request) => {
  myCustomLog('Processing GET request data', 'info');
  
  return NextResponse.json({ message: "Hello World" }, { status: 200 });
});