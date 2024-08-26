// src/initLogger.ts

import { broadcastLog } from './server/wsServer'; // Import only when needed

// Define the type for the log function
export type LogFunctionType = (
  levelOrMessage: 'info' | 'warn' | 'error' | 'debug' | 'api' | string,
  message?: string
) => void;

// Initialize external log function (no-op function initially)
export let externalAddLog: LogFunctionType = () => {};

// Function to set the log function
export const setLogFunction = (fn: LogFunctionType) => {
  externalAddLog = fn;
};

// Log function to be used globally
export const addLog: LogFunctionType = (levelOrMessage, message?) => {
  if (typeof message === 'undefined') {
    externalAddLog('info', levelOrMessage);
  } else {
    externalAddLog(levelOrMessage as 'info' | 'warn' | 'error' | 'debug' | 'api', message);
  }
};

let logFunctionAlias = 'addLog';

export const configureLogger = (aliasName: string) => {
  logFunctionAlias = aliasName;

  // Set the global log function on the frontend
  if (typeof window !== 'undefined' && typeof globalThis !== 'undefined') {
    (globalThis as any)[logFunctionAlias] = addLog;
  }

  // Send a request to the backend to configure the server logger with the same alias
  if (typeof window !== 'undefined') {
    fetch('/api/start-logger-server', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ aliasName }),
    }).catch((error) => {
      console.error('Failed to configure server logger:', error);
    });
  }
};

declare global {
  var addLog: LogFunctionType;
  var addInfoLog: (message: string) => void;
}

if (typeof globalThis !== 'undefined') {
  if (typeof (globalThis as any)[logFunctionAlias] === 'undefined') {
    (globalThis as any)[logFunctionAlias] = addLog;
  }

  if (typeof globalThis.addInfoLog === 'undefined') {
    globalThis.addInfoLog = (message: string) => addLog('info', message);
  }
}