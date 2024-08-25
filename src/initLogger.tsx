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
    externalAddLog(levelOrMessage as 'info' | 'warn' | 'error' | 'debug' | 'api', message);
  }
};

let logFunctionAlias = 'addLog';
let isLogging = false; // Flag to prevent recursive calls

export const configureLogger = (aliasName: string) => {
  logFunctionAlias = aliasName;
  if (typeof globalThis !== 'undefined') {
    (globalThis as any)[logFunctionAlias] = addLog;
    (globalThis as any)[`${logFunctionAlias}Middleware`] = withGlobalLogging; // Setup middleware under alias
  }
};

// Middleware function to log API requests and responses
export function withGlobalLogging(handler: (req: Request) => Promise<Response>) {
  return async (req: Request): Promise<Response> => {
    // Use the global logging alias if available
    const logger = (globalThis as any)[logFunctionAlias] || addLog;

    // Log the incoming request
    logger('api', `API Request: ${req.method} ${req.url}`);

    // Run the original handler and get the response
    const response = await handler(req);

    // Clone the response to log it and still be able to send it
    const clonedResponse = response.clone();

    // Log response status and URL
    logger('api', `API Response: ${req.method} ${req.url} - Status: ${clonedResponse.status}`);

    // Return the original response
    return response;
  };
};

declare global {
  var addLog: LogFunctionType;
  var addInfoLog: (message: string) => void;
  var myCustomLogMiddleware: (handler: (req: Request) => Promise<Response>) => (req: Request) => Promise<Response>; // Add this line
}

if (typeof globalThis !== 'undefined') {
  console.log('Global setup running...'); // Debugging log
  if (typeof (globalThis as any)[logFunctionAlias] === 'undefined') {
    (globalThis as any)[logFunctionAlias] = addLog;
    (globalThis as any)[`${logFunctionAlias}Middleware`] = withGlobalLogging; // Initialize the middleware alias globally
    console.log('Global log function set up:', logFunctionAlias);  // Debugging log
  }

  if (typeof globalThis.addInfoLog === 'undefined') {
    globalThis.addInfoLog = (message: string) => addLog('info', message);
    console.log('Global addInfoLog function set up.');  // Debugging log
  }
}