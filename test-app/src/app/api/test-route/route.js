// src/app/api/test-route/route.ts

import { NextRequest, NextResponse } from 'next/server';

export async function GET(request) {
  // Simulate some processing
  const data = { message: 'Hello World' };
  myCustomLog("api", "Logging from backend");

  return NextResponse.json(data, { status: 200 });
}

export async function POST(request) {
    try {
      // Parse the request body to extract the number
      const body = await request.json();
      const number = body.number;
  
      if (typeof number !== 'number') {
        myCustomLog("error", "Invalid input: a number is required");
        return NextResponse.json({ error: "Invalid input: a number is required" }, { status: 400 });
      }
  
      myCustomLog("api", `Starting calculations on the backend with number: ${number}`);
  
      // Calculate the square of the number
      const square = number * number;
      myCustomLog("api", `Squared number: ${square}`);
  
      // Add a constant value (e.g., 10) to the squared number
      const result = square + 10;
      myCustomLog("api", `Added 10 to squared number, result is: ${result}`);
  
      // Respond with the calculated data
      const responseData = {
        message: 'Math operations completed successfully',
        originalNumber: number,
        squared: square,
        finalResult: result
      };
  
      return NextResponse.json(responseData, { status: 200 });
    } catch (error) {
      myCustomLog("error", `Error processing request: ${error.message}`);
      return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
    }
  }