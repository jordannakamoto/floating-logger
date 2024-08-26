import { LogFunctionType, addLog as externalAddLog, setLogFunction } from './initLogger';
import React, { ReactNode, createContext, useCallback, useContext, useEffect, useState } from 'react';

// Define the structure of a log entry
interface LogEntry {
  level: 'info' | 'warn' | 'error' | 'debug' | 'api';
  message: string;
  timestamp: Date;
}

// Define the context type
interface LogContextType {
  logs: LogEntry[];
  log: LogFunctionType;
}

// Initialize the context with default values
const LogContext = createContext<LogContextType | undefined>(undefined);

let isLogging = false; // Prevent recursive logging

export const LogProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [logs, setLogs] = useState<LogEntry[]>([]); // State to hold log entries

  const log: LogFunctionType = useCallback((levelOrMessage, message?) => {
    if (isLogging) return;
    isLogging = true;
    try {
      const newLog: LogEntry = typeof message === 'undefined'
        ? { level: 'info', message: levelOrMessage as string, timestamp: new Date() }
        : { level: levelOrMessage as 'info' | 'warn' | 'error' | 'debug' | 'api', message, timestamp: new Date() };
      
      setLogs((prevLogs) => [...prevLogs, newLog]);
      externalAddLog(newLog.level, newLog.message);
    } finally {
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
            const newLog: LogEntry = JSON.parse(event.data);
            setLogs((prevLogs) => [...prevLogs, newLog]);
          } catch (e) {
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

  return (
    <LogContext.Provider value={{ logs, log }}>
      {children}
    </LogContext.Provider>
  );
};

export const useLog = () => {
  const context = useContext(LogContext);
  if (context === undefined) {
    throw new Error('useLog must be used within a LogProvider');
  }
  return context;
};