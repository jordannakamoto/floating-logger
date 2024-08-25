# Floating Logger Dev Tool

A development tool for Next.js and Redux applications.

**Floating Logger** is a front-end tool to capture and display logs directly in your application, eliminating the need to check the browser's console. It also displays the Redux state for easy monitoring of app state changes.

![Floating Logger Screenshot](https://github.com/user-attachments/assets/f1b46199-6f36-40f1-822f-f76ca2df26ee)

## Features

- **Floating Log Display**: Shows logs in a floating panel on the application interface.
- **Redux State Viewer**: Displays current Redux state.
- **Customizable Logger Function**: Allows you to set a global function for logging across your app.

## Installation

First, install the package via npm:

```bash
npm install floating-logger
```

## Setup in Next.js

To use Floating Logger in your Next.js app, follow these steps:

### 1. Initialize Redux Store and Providers

In your `layout.tsx` or `App.tsx` (for older Next.js versions), set up the Redux store and the Floating Logger:

```tsx
'use client';

import "./globals.css";
import { FloatingLogger, LogProvider, configureLogger } from 'floating-logger';
import { Inter } from "next/font/google";
import { Provider } from 'react-redux';
import store from './redux/store'; // Adjust the path to your store

const inter = Inter({ subsets: ["latin"] });

configureLogger('myCustomLog'); // Optional: Set a global logging function

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <Provider store={store}>
          <LogProvider> {/* Provides the logging context */}
            <FloatingLogger logSelector={(state) => state} /> {/* Displays the floating logger */}
            {children}
          </LogProvider>
        </Provider>
      </body>
    </html>
  );
}
```

### 2. Use Logging in Your Components

Log messages directly from any component without needing additional imports:

Example in `page.tsx`:

```tsx
'use client';

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { increment } from './redux/store';

const Home = () => {
  const dispatch = useDispatch();
  const count = useSelector((state) => state.counter.count);

  useEffect(() => {
    myCustomLog('info', 'Home page loaded'); // Log message using the custom alias
  }, []);

  const handleIncrement = () => {
    dispatch(increment());
    myCustomLog('warn', 'Incremented count'); // Log a warning
  };

  const test = () => {
    myCustomLog('debug', 'Test button clicked'); // Log a debug message
  };

  return (
    <div style={{ height: '100vh' }}>
      <h1>Floating Logger Test App</h1>
      <p>Count: {count}</p>
      <button onClick={handleIncrement}>Increment</button>
      <button onClick={test}>Test</button>
    </div>
  );
};

export default Home;
```

### 3. Configure Logger Globally (Optional)

To avoid importing `FloatingLogger` everywhere, configure a global logger function:

```tsx
configureLogger('myCustomLog'); // Now use myCustomLog() anywhere in your app
```

## Configuration

- **`configureLogger(alias: string)`**: Set a global alias for the logging function to avoid name conflicts. The default alias is `'addLog'`.

## Example Usage

- **Log Information**: `myCustomLog('info', 'This is an info log');`
- **Log Warnings**: `myCustomLog('warn', 'This is a warning log');`
- **Log Errors**: `myCustomLog('error', 'This is an error log');`
- **Log Debug Messages**: `myCustomLog('debug', 'Debugging log message');`

This documentation is now fully formatted with appropriate markdown for each section, providing clear and simple instructions on how to install, set up, and use the Floating Logger in a Next.js application.
