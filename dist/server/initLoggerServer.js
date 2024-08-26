// src/initLoggerServer.ts
import { broadcastLog } from './wsServer';
export const addLog = (levelOrMessage, message) => {
    const logEntry = {
        level: typeof message === 'undefined' ? 'info' : levelOrMessage,
        message: typeof message === 'undefined' ? levelOrMessage : message,
        timestamp: new Date(),
    };
    console.log(`[${logEntry.level.toUpperCase()}] ${logEntry.message}`);
    broadcastLog(JSON.stringify(logEntry)); // Broadcast log to clients
};
if (typeof globalThis !== 'undefined') {
    globalThis.addLog = addLog;
}
// Function to configure a custom global alias for logging
export const configureServerLogger = (aliasName) => {
    if (typeof globalThis !== 'undefined') {
        globalThis[aliasName] = addLog;
    }
};
if (typeof globalThis !== 'undefined') {
    globalThis.configureServerLogger = configureServerLogger;
}
