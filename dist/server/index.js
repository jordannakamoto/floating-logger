// src/server/index.ts
import './wsServer'; // Import to initialize WebSocket server
// Import your server-side logging functions from initLoggerServer
import { addLog, configureServerLogger } from './initLoggerServer';
// Re-export the logging functions to make them available for other parts of the server
export { addLog, configureServerLogger };
// Export broadcastLog from wsServer to allow broadcasting logs via WebSocket
export { broadcastLog } from './wsServer';
