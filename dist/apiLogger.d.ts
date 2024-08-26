import { NextResponse } from 'next/server';
export declare function withGlobalLogging(handler: (req: Request) => Promise<NextResponse>): (req: Request) => Promise<NextResponse>;
