// src/server/wsServer.ts
import WebSocket, { WebSocketServer } from 'ws';
// Maintain a singleton pattern for WebSocketServer to avoid multiple instances
let wss = null;
// A list to keep track of all connected clients
const clients = [];
if (!wss) {
    wss = new WebSocketServer({ port: 8080 });
    console.log('WebSocket server started on port 8080');
    wss.on('connection', (ws) => {
        clients.push(ws);
        ws.on('message', (message) => {
            console.log(`Received message => ${message}`);
        });
        ws.on('close', () => {
            // Remove the client from the list when it disconnects
            const index = clients.indexOf(ws);
            if (index !== -1) {
                clients.splice(index, 1);
            }
        });
    });
}
export const broadcastLog = (log) => {
    clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(log);
        }
    });
};
