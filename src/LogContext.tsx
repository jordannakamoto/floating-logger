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

// Singleton WebSocket instance
let socketInstance: WebSocket | null = null;

// Function to initialize WebSocket connection
const initializeWebSocket = (setLogs: React.Dispatch<React.SetStateAction<LogEntry[]>>) => {
  if (!socketInstance) {
    socketInstance = new WebSocket('ws://localhost:8080');

    socketInstance.onopen = () => console.log('Floating Logger - Backend Socket connection established');

    socketInstance.onmessage = (event) => {
      try {
        const newLog: LogEntry = JSON.parse(event.data);
        setLogs((prevLogs) => [...prevLogs, newLog]);
      } catch (e) {
        console.error('Error parsing WebSocket message:', e);
      }
    };

    socketInstance.onerror = (error) => console.error('WebSocket error:', error);

    socketInstance.onclose = () => {
      console.log('WebSocket connection closed');
      socketInstance = null; // Reset socketInstance to allow reconnection
    };
  }
};

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

    if (typeof window !== 'undefined') {
      // Only initialize WebSocket connection on the client
      // Start the WebSocket server by calling the API route
      fetch('/api/start-logger-server')
        .then((response) => response.json())
        .then(() => {
          initializeWebSocket(setLogs); // Initialize WebSocket
        })
        .catch((error) => {
          console.error('Error starting WebSocket server:', error);
        });
    }

    // Cleanup function to close WebSocket connection on component unmount
    return () => {
      if (socketInstance) {
        socketInstance.close();
        socketInstance = null; // Reset socket reference
      }
    };
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