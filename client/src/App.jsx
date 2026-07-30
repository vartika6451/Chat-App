import { useEffect, useRef, useState } from "react";

function App() {
  const socketRef = useRef(null);

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:3000");
    socketRef.current = socket;

    socket.onopen = () => {
      console.log("Connected to server");
    };

    socket.onmessage = (event) => {
      setMessages((prev) => [...prev, event.data]);
    };

    socket.onclose = () => {
      console.log("Disconnected");
    };

    return () => socket.close();
  }, []);

  const sendMessage = () => {
    if (!message.trim()) return;

    socketRef.current.send(message);
    setMessage("");
  };

  return (
    <div style={{ padding: "30px" }}>
      <h1>WebSocket Chat</h1>

      <div
        style={{
          border: "1px solid black",
          height: "300px",
          overflowY: "scroll",
          marginBottom: "20px",
          padding: "10px",
        }}
      >
        {messages.map((msg, index) => (
          <p key={index}>{msg}</p>
        ))}
      </div>

      <input
        type="text"
        placeholder="Type a message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default App;