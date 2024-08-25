// src/index.tsx in floating-logger
import { LogProvider, useLog } from './LogContext'; // Import the LogProvider and useLog hook
import { addLog, configureLogger, setLogFunction } from './initLogger'; // Import from initLogger
import FloatingLogger from './FloatingLogger';
// Export all necessary components and functions
export { FloatingLogger, LogProvider, useLog, setLogFunction, addLog, configureLogger };
