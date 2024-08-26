// src/initLoggerServer.ts
import { broadcastLog } from './wsServer';

export type LogFunctionType = (
  levelOrMessage: 'info' | 'warn' | 'error' | 'debug' | 'api' | string,
  message?: string
) => void;

export const addLog: LogFunctionType = (levelOrMessage, message?) => {
  const logEntry = {
    level: typeof message === 'undefined' ? 'info' : (levelOrMessage as string),
    message: typeof message === 'undefined' ? (levelOrMessage as string) : (message as string),
    timestamp: new Date(),
  };

  console.log(`[${logEntry.level.toUpperCase()}] ${logEntry.message}`);
  broadcastLog(JSON.stringify(logEntry)); // Broadcast log to clients
};

// Set up global logger for server-side usage
declare global {
  var addLog: LogFunctionType;
}

if (typeof globalThis !== 'undefined') {
  globalThis.addLog = addLog;
}

// Function to configure a custom global alias for logging
export const configureServerLogger = (aliasName: string) => {
  if (typeof globalThis !== 'undefined') {
    (globalThis as any)[aliasName] = addLog;
  }
};

// Optionally, set up another global function if needed
declare global {
  var configureServerLogger: (aliasName: string) => void;
}

if (typeof globalThis !== 'undefined') {
  globalThis.configureServerLogger = configureServerLogger;
}