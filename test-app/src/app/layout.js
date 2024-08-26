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
            <FloatingLogger logSelector={(state) => state} /> {/* Include the floating logger if desired */}
            {children}
          </LogProvider>
        </Provider>
      </body>
    </html>
  );
}2