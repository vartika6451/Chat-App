// socket/socketHandler.js
import { WebSocketServer } from "ws";

// TODO: Implement real-time group/private chat notifications and message storage handlers

export const initSocket = (server) => {
  const wss = new WebSocketServer({ noServer: true });

  console.log("⚡ [SOCKET] WebSocket server setup initialized");

  // Handle socket connection upgrades from Express HTTP server
  server.on("upgrade", (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit("connection", ws, request);
    });
  });

  wss.on("connection", (ws) => {
    console.log("🔌 [SOCKET] Client connected to transmission channel");

    ws.send(JSON.stringify({ type: "WELCOME", message: "Blink Link Established" }));

    ws.on("message", (message) => {
      try {
        const data = JSON.parse(message.toString());
        console.log(`📨 [SOCKET] Received message payload type: ${data.type}`);
        
        // Echo back for now
        ws.send(JSON.stringify({ type: "ECHO", data }));
      } catch (err) {
        console.log(`📨 [SOCKET] Received raw string: ${message.toString()}`);
        ws.send(message.toString()); // Echo raw message
      }
    });

    ws.on("close", () => {
      console.log("🔌 [SOCKET] Client disconnected from transmission channel");
    });
  });

  return wss;
};
