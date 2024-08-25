import { addLog as externalAddLog, setLogFunction } from './initLogger'; // Import the correct LogFunctionType
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
// Initialize the context with default values
const LogContext = createContext(undefined);
let isLogging = false; // Prevent recursive logging
// Create a provider component that sets up the logging function and manages log state
export const LogProvider = ({ children }) => {
    const [logs, setLogs] = useState([]); // State to hold log entries
    // Memoize the log function to prevent unnecessary re-renders
    const log = useCallback((levelOrMessage, message) => {
        if (isLogging)
            return; // Exit if already logging to prevent recursion
        isLogging = true; // Set the flag to indicate logging in progress
        try {
            if (typeof message === 'undefined') {
                const newLog = { level: 'info', message: levelOrMessage, timestamp: new Date() };
                setLogs((prevLogs) => [...prevLogs, newLog]);
                externalAddLog('info', levelOrMessage); // Call the external log function
            }
            else {
                const newLog = { level: levelOrMessage, message, timestamp: new Date() };
                setLogs((prevLogs) => [...prevLogs, newLog]);
                externalAddLog(levelOrMessage, message); // Call the external log function
            }
        }
        finally {
            isLogging = false; // Reset the flag after logging is done
        }
    }, []);
    useEffect(() => {
        // Set up the log function globally only once to avoid re-triggering the effect
        setLogFunction(log);
    }, [log]);
    return (React.createElement(LogContext.Provider, { value: { logs, log } }, children));
};
// Custom hook to use the log function context
export const useLog = () => {
    const context = useContext(LogContext);
    if (context === undefined) {
        throw new Error('useLog must be used within a LogProvider');
    }
    return context;
};
