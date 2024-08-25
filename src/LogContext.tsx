import { LogFunctionType, addLog as externalAddLog, setLogFunction } from './initLogger'; // Import the correct LogFunctionType
import React, { ReactNode, createContext, useCallback, useContext, useEffect, useState } from 'react';

// Define the structure of a log entry
interface LogEntry {
  level: 'info' | 'warn' | 'error' | 'debug';
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

// Create a provider component that sets up the logging function and manages log state
export const LogProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [logs, setLogs] = useState<LogEntry[]>([]); // State to hold log entries

  // Memoize the log function to prevent unnecessary re-renders
  const log: LogFunctionType = useCallback((levelOrMessage, message?) => {
    if (isLogging) return; // Exit if already logging to prevent recursion
    isLogging = true; // Set the flag to indicate logging in progress
    try {
      if (typeof message === 'undefined') {
        const newLog: LogEntry = { level: 'info', message: levelOrMessage as string, timestamp: new Date() };
        setLogs((prevLogs) => [...prevLogs, newLog]);
        externalAddLog('info', levelOrMessage); // Call the external log function
      } else {
        const newLog: LogEntry = { level: levelOrMessage as 'info' | 'warn' | 'error' | 'debug', message, timestamp: new Date() };
        setLogs((prevLogs) => [...prevLogs, newLog]);
        externalAddLog(levelOrMessage as 'info' | 'warn' | 'error' | 'debug', message); // Call the external log function
      }
    } finally {
      isLogging = false; // Reset the flag after logging is done
    }
  }, []);

  useEffect(() => {
    // Set up the log function globally only once to avoid re-triggering the effect
    setLogFunction(log);
  }, [log]);

  return (
    <LogContext.Provider value={{ logs, log }}>
      {children}
    </LogContext.Provider>
  );
};

// Custom hook to use the log function context
export const useLog = () => {
  const context = useContext(LogContext);
  if (context === undefined) {
    throw new Error('useLog must be used within a LogProvider');
  }
  return context;
};