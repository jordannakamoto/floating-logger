// src/initLogger.ts
// Initialize external log function (no-op function initially)
export let externalAddLog = () => { };
// Function to set the log function
export const setLogFunction = (fn) => {
    externalAddLog = fn;
};
// Log function to be used globally
export const addLog = (levelOrMessage, message) => {
    if (typeof message === 'undefined') {
        externalAddLog('info', levelOrMessage);
    }
    else {
        externalAddLog(levelOrMessage, message);
    }
};
let logFunctionAlias = 'addLog';
export const configureLogger = (aliasName) => {
    logFunctionAlias = aliasName;
    // Set the global log function on the frontend
    if (typeof window !== 'undefined' && typeof globalThis !== 'undefined') {
        globalThis[logFunctionAlias] = addLog;
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
if (typeof globalThis !== 'undefined') {
    if (typeof globalThis[logFunctionAlias] === 'undefined') {
        globalThis[logFunctionAlias] = addLog;
    }
    if (typeof globalThis.addInfoLog === 'undefined') {
        globalThis.addInfoLog = (message) => addLog('info', message);
    }
}
