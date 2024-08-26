import { addLog as externalAddLog, setLogFunction } from './initLogger';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
// Initialize the context with default values
const LogContext = createContext(undefined);
let isLogging = false; // Prevent recursive logging
export const LogProvider = ({ children }) => {
    const [logs, setLogs] = useState([]); // State to hold log entries
    const log = useCallback((levelOrMessage, message) => {
        if (isLogging)
            return;
        isLogging = true;
        try {
            const newLog = typeof message === 'undefined'
                ? { level: 'info', message: levelOrMessage, timestamp: new Date() }
                : { level: levelOrMessage, message, timestamp: new Date() };
            setLogs((prevLogs) => [...prevLogs, newLog]);
            externalAddLog(newLog.level, newLog.message);
        }
        finally {
            isLogging = false;
        }
    }, []);
    useEffect(() => {
        setLogFunction(log);
        // Start the WebSocket server by calling the API route
        fetch('/api/start-logger-server')
            .then((response) => response.json())
            .then(() => {
            // Initialize WebSocket connection
            const socket = new WebSocket('ws://localhost:8080');
            socket.onopen = () => console.log('WebSocket connection established');
            socket.onmessage = (event) => {
                try {
                    const newLog = JSON.parse(event.data);
                    setLogs((prevLogs) => [...prevLogs, newLog]);
                }
                catch (e) {
                    console.error('Error parsing WebSocket message:', e);
                }
            };
            socket.onerror = (error) => console.error('WebSocket error:', error);
            socket.onclose = () => console.log('WebSocket connection closed');
            return () => socket.close();
        })
            .catch((error) => {
            console.error('Error starting WebSocket server:', error);
        });
    }, [log]);
    return (React.createElement(LogContext.Provider, { value: { logs, log } }, children));
};
export const useLog = () => {
    const context = useContext(LogContext);
    if (context === undefined) {
        throw new Error('useLog must be used within a LogProvider');
    }
    return context;
};
