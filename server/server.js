import { WebSocketServer } from "ws";

// Create a WebSocket server on port 3000
const wss = new WebSocketServer({
  port: 3000,
});

console.log("✅ WebSocket server running at ws://localhost:3000");

wss.on("connection", (ws) => {
  console.log("✅ Client connected");

  ws.send("Welcome!");

  ws.on("message", (message) => {
    const text = message.toString();

    console.log("Received:", text);

    // Echo the message back
    ws.send(text);
  });

  ws.on("close", () => {
    console.log("❌ Client disconnected");
  });
});