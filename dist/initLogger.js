// src/initLogger.ts
// Initialize external log function
export let externalAddLog = () => { }; // No-op function
export const setLogFunction = (fn) => {
    externalAddLog = fn;
};
// Example function to add log
export const addLog = (levelOrMessage, message) => {
    if (typeof message === 'undefined') {
        externalAddLog('info', levelOrMessage);
    }
    else {
        externalAddLog(levelOrMessage, message);
    }
};
let logFunctionAlias = 'addLog';
let isLogging = false; // Flag to prevent recursive calls
export const configureLogger = (aliasName) => {
    logFunctionAlias = aliasName;
    if (typeof globalThis !== 'undefined') {
        globalThis[logFunctionAlias] = addLog;
    }
};
if (typeof globalThis !== 'undefined') {
    console.log('Global setup running...'); // Debugging log
    if (typeof globalThis[logFunctionAlias] === 'undefined') {
        globalThis[logFunctionAlias] = addLog;
        console.log('Global log function set up:', logFunctionAlias); // Debugging log
    }
    if (typeof globalThis.addInfoLog === 'undefined') {
        globalThis.addInfoLog = (message) => addLog('info', message);
        console.log('Global addInfoLog function set up.'); // Debugging log
    }
}
// Note: Do not set the log function globally at this point to avoid SSR issues
// setLogFunction(addLog);
