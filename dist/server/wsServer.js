// src/server/wsServer.ts
import WebSocket, { WebSocketServer } from 'ws';
const wss = new WebSocketServer({ port: 8080 }); // You can change the port number if needed
console.log('WebSocket server started on port 8080');
// A list to keep track of all connected clients
const clients = [];
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
export const broadcastLog = (log) => {
    // Send the log to all connected clients
    clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(log);
        }
    });
};
