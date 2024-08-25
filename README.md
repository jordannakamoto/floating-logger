# Floating Logger

A development tool for NextJS/Redux apps.

Provides a floating component on the front end to send logs to as an alternative to console.log() so we don't have to check the Web Inspector.

Shows Redux state.

This Repo has a test app environment to develop the tool in though I hope to publish the npm package.

Usage in NextJS (layout.tsx):
- Initialize Redux store and Provider
- Insert the LogProvider and provide the Redux state to Floating Logger
`configureLogger('myCustomLogger')` sets a global function to be used across the app so you don't have to import FloatingLogger elsewhere. i.e. you can just write myCustomLogger("a message") from any component. Or you would set `configureLogger('log')` and then call log("a message").
```
'use client';

import "./globals.css";

import { FloatingLogger, LogProvider, configureLogger } from 'floating-logger'; // Import from your package

import { Inter } from "next/font/google";
import { Provider } from 'react-redux';
import store from './redux/store'; // Adjust the path to your store

const inter = Inter({ subsets: ["latin"] });

// Optionally configure the logger to use a custom function name to avoid conflicts
configureLogger('myCustomLog'); // This sets the global alias (optional)

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <Provider store={store}>
          <LogProvider> {/* Setup the logging context provider once here */}
            <FloatingLogger logSelector={(state) => state} />
            {children}
          </LogProvider>
        </Provider>
      </body>
    </html>
  );
}
```