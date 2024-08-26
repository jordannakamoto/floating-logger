# Floating Logger Dev Tool

A development tool for Next.js and Redux applications that captures and displays logs directly within a floating panel on the app.

## Features

- **Floating Log Display**: Shows logs in a floating panel within your application interface.
- **Redux State Viewer**: Displays the current Redux state.
- **Backend and Frontend Logging**: Capture logs from your API routes as well as the front end components.

## Installation

Install the package via npm:

```bash
npm install floating-logger
```

## Setup in Next.js

### 1. Initialize Redux Store and Providers

In your `layout.tsx` or `App.tsx`, set up the Redux store and the Floating Logger:

```tsx
'use client';

import "./globals.css";
import { FloatingLogger, LogProvider, configureLogger } from 'floating-logger';
import { Inter } from "next/font/google";
import { Provider } from 'react-redux';
import store from './redux/store';

const inter = Inter({ subsets: ["latin"] });

configureLogger('myCustomLog'); // Sets a global logging function alias

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <Provider store={store}>
          <LogProvider>
            <FloatingLogger logSelector={(state) => state} />
            {children}
          </LogProvider>
        </Provider>
      </body>
    </html>
  );
}
```

### 2. Use Logging in Your Components

Log messages directly from any component:

```tsx
'use client';

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { increment } from './redux/store';

const Home = () => {
  const dispatch = useDispatch();
  const count = useSelector((state) => state.counter.count);

  useEffect(() => {
    myCustomLog('info', 'Home page loaded');
  }, []);

  const handleIncrement = () => {
    dispatch(increment());
    myCustomLog('warn', 'Incremented count');
  };

  return (
    <div>
      <h1>Floating Logger Test App</h1>
      <p>Count: {count}</p>
      <button onClick={handleIncrement}>Increment</button>
    </div>
  );
};

export default Home;
```

### 3. Backend Logging Setup

**Floating Logger** API/server logs can also be sent to floating logger. Information from the backend is sent over a Websocket so we can view it directly in our app. You will have to add an api route to allow the floating-logger package to establish the socket connection:

#### Step 1: Create an API Route to Start the Logger

Add the API route in Next at `src/app/api/start-logger-server.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  if (typeof window === 'undefined') {
    await import('floating-logger/server'); // Start the WebSocket server
  }

  return NextResponse.json({ message: 'WebSocket server initialized' }, { status: 200 });
}

export async function POST(request: NextRequest) {
  try {
    const { aliasName } = await request.json();

    if (typeof window === 'undefined') {
      const { configureServerLogger } = await import('floating-logger/server');
      configureServerLogger(aliasName);
      return NextResponse.json({ message: 'Logger configured' }, { status: 200 });
    }

    return NextResponse.json({ error: 'Cannot configure logger on the client side' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to configure logger' }, { status: 500 });
  }
}
```

#### Step 2: Start and Configure the Logger

- **Start the Logger**: Send a `GET` request to `/api/start-logger-server` to initialize the WebSocket server.
- **Configure Logger Alias**: Send a `POST` request to `/api/start-logger-server` with the desired alias name (`aliasName`) to synchronize the alias with the frontend logger.

### Configuring the Alias Name

To ensure consistency between frontend and backend logging, the log function alias name is configured once on the frontend using `configureLogger('myCustomLog')` or maybe `configureLogger('log')`. The same alias is then applied to the backend.

## Quick Start Commands

1. **Log Information**: `myCustomLog('info', 'This is an info log');`
2. **Log Warnings**: `myCustomLog('warn', 'This is a warning log');`
3. **Log Errors**: `myCustomLog('error', 'This is an error log');`
4. **Log Debug Messages**: `myCustomLog('debug', 'Debugging log message');`
