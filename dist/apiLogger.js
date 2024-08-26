var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { broadcastLog } from './server/wsServer'; // Import broadcastLog function
// Middleware function to log API requests and responses
export function withGlobalLogging(handler) {
    return (req) => __awaiter(this, void 0, void 0, function* () {
        broadcastLog(`API Request: ${req.method} ${req.url}`); // Send log to WebSocket clients
        const response = yield handler(req);
        broadcastLog(`API Response: ${req.method} ${req.url} - Status: ${response.status}`); // Send log to WebSocket clients
        return response;
    });
}
