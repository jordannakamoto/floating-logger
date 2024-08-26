// src/initLogger.ts

// Define the type for the log function
export type LogFunctionType = (
  levelOrMessage: 'info' | 'warn' | 'error' | 'debug' | 'api' | string,
  message?: string
) => void;

// Initialize external log function
export let externalAddLog: LogFunctionType = () => {}; // No-op function

export const setLogFunction = (fn: LogFunctionType) => {
  externalAddLog = fn;
};

// Example function to add log
export const addLog: LogFunctionType = (levelOrMessage, message?) => {
  if (typeof message === 'undefined') {
    externalAddLog('info', levelOrMessage);
  } else {
    externalAddLog(levelOrMessage as 'info' | 'warn' | 'error' | 'debug' | 'api' , message);
  }
};
let logFunctionAlias = 'addLog';

let isLogging = false; // Flag to prevent recursive calls

export const configureLogger = (aliasName: string) => {
logFunctionAlias = aliasName;
if (typeof globalThis !== 'undefined') {
  (globalThis as any)[logFunctionAlias] = addLog;
}
};

declare global {
var addLog: LogFunctionType;
var addInfoLog: (message: string) => void;
}

if (typeof globalThis !== 'undefined') {
console.log('Global setup running...'); // Debugging log
if (typeof (globalThis as any)[logFunctionAlias] === 'undefined') {
  (globalThis as any)[logFunctionAlias] = addLog;
  console.log('Global log function set up:', logFunctionAlias);  // Debugging log
}

if (typeof globalThis.addInfoLog === 'undefined') {
  globalThis.addInfoLog = (message: string) => addLog('info', message);
  console.log('Global addInfoLog function set up.');  // Debugging log
}
}

// Note: Do not set the log function globally at this point to avoid SSR issues
// setLogFunction(addLog);