import { useEffect, useRef, useState } from "react";
import { Radio, Send, WifiOff } from "lucide-react";

const WS_URL = "ws://localhost:3000";

function SignalBars({ connected }) {
  return (
    <div className="flex items-end gap-[3px] h-4">
      {[5, 8, 11, 14].map((h, i) => (
        <div
          key={i}
          className="w-[3px] rounded-full transition-colors duration-300"
          style={{
            height: `${h}px`,
            backgroundColor: connected ? "#F2A93B" : "#3A404C",
            animation: connected ? `pulse-bar 1.4s ease-in-out ${i * 0.15}s infinite` : "none",
          }}
        />
      ))}
    </div>
  );
}

function App() {
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [status, setStatus] = useState("connecting");

  useEffect(() => {
    let socket;
    let reconnectTimeout;
    let cancelled = false;

    const connect = () => {
      setStatus("connecting");
      socket = new WebSocket(WS_URL);
      socketRef.current = socket;

      socket.onopen = () => {
        if (cancelled) return;
        setIsConnected(true);
        setStatus("online");
      };

      socket.onmessage = (event) => {
        if (cancelled) return;
        setMessages((prev) => [
          ...prev,
          { id: crypto.randomUUID(), text: event.data, mine: false, ts: Date.now() },
        ]);
      };

      socket.onclose = () => {
        if (cancelled) return;
        setIsConnected(false);
        setStatus("offline");
        reconnectTimeout = setTimeout(connect, 2000);
      };

      socket.onerror = () => {
        if (cancelled) return;
        setStatus("offline");
      };
    };

    connect();

    return () => {
      cancelled = true;
      clearTimeout(reconnectTimeout);
      socket && socket.close();
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    const trimmed = message.trim();
    if (!trimmed) return;

    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(trimmed);
      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), text: trimmed, mine: true, ts: Date.now() },
      ]);
      setMessage("");
    }
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  const formatTime = (ts) =>
    new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const statusCopy = {
    connecting: "Establishing link…",
    online: "Link established",
    offline: "Link lost — retrying",
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center p-6"
      style={{ backgroundColor: "#0D0F14", fontFamily: "Inter, sans-serif" }}
    >
      <style>{`
        @keyframes pulse-bar {
          0%, 100% { opacity: 0.4; transform: scaleY(0.85); }
          50% { opacity: 1; transform: scaleY(1); }
        }
        @keyframes slide-in {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes blink-caret {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.2; }
        }
        .msg-enter { animation: slide-in 0.25s ease-out; }
        ::selection { background: #F2A93B44; }
        .console-scroll::-webkit-scrollbar { width: 6px; }
        .console-scroll::-webkit-scrollbar-track { background: transparent; }
        .console-scroll::-webkit-scrollbar-thumb { background: #2A2F3A; border-radius: 3px; }
      `}</style>

      <div
        className="w-full max-w-md rounded-2xl overflow-hidden flex flex-col"
        style={{
          backgroundColor: "#171B24",
          border: "1px solid #262B36",
          boxShadow: "0 24px 60px -20px rgba(0,0,0,0.6)",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom: "1px solid #262B36", backgroundColor: "#1B202B" }}
        >
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: "#F2A93B1A" }}
            >
              <Radio size={16} color="#F2A93B" strokeWidth={2.25} />
            </div>
            <div>
              <h1
                className="text-[15px] font-semibold tracking-tight leading-none"
                style={{ color: "#E9E6DD", fontFamily: "'Space Grotesk', sans-serif" }}
              >
                Transmission
              </h1>
              <p
                className="text-[11px] mt-1 leading-none"
                style={{ color: isConnected ? "#F2A93B" : "#707786", fontFamily: "'JetBrains Mono', monospace" }}
              >
                {statusCopy[status]}
              </p>
            </div>
          </div>
          <SignalBars connected={isConnected} />
        </div>

        {/* Messages */}
        <div
          className="console-scroll flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-2.5"
          style={{ height: "420px" }}
        >
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center gap-2 text-center px-6">
              <WifiOff size={20} color="#3A404C" />
              <p className="text-[13px]" style={{ color: "#4B5160" }}>
                Nothing on the line yet. Type below to transmit the first message.
              </p>
            </div>
          )}

          {messages.map((msg) => (
            <div
              key={msg.id}
              className="msg-enter flex flex-col"
              style={{ alignItems: msg.mine ? "flex-end" : "flex-start" }}
            >
              <div
                className="px-3.5 py-2 rounded-2xl text-[13.5px] leading-snug max-w-[80%]"
                style={{
                  backgroundColor: msg.mine ? "#F2A93B" : "#232936",
                  color: msg.mine ? "#181205" : "#E9E6DD",
                  borderBottomRightRadius: msg.mine ? "4px" : "16px",
                  borderBottomLeftRadius: msg.mine ? "16px" : "4px",
                }}
              >
                {msg.text}
              </div>
              <span
                className="text-[10px] mt-1 px-1"
                style={{ color: "#4B5160", fontFamily: "'JetBrains Mono', monospace" }}
              >
                {formatTime(msg.ts)}
              </span>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div
          className="flex items-center gap-2 px-3.5 py-3.5"
          style={{ borderTop: "1px solid #262B36", backgroundColor: "#1B202B" }}
        >
          <input
            ref={inputRef}
            type="text"
            placeholder={isConnected ? "Type a message…" : "Type — will send once reconnected"}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 text-[13.5px] px-3.5 py-2.5 rounded-xl outline-none transition-shadow"
            style={{
              backgroundColor: "#12151C",
              color: "#E9E6DD",
              border: "1px solid #2A2F3A",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#F2A93B")}
            onBlur={(e) => (e.target.style.borderColor = "#2A2F3A")}
          />
          <button
            onClick={sendMessage}
            disabled={!isConnected || !message.trim()}
            className="w-10 h-10 shrink-0 rounded-xl flex items-center justify-center transition-opacity"
            style={{
              backgroundColor: "#F2A93B",
              opacity: !isConnected || !message.trim() ? 0.35 : 1,
              cursor: !isConnected || !message.trim() ? "not-allowed" : "pointer",
            }}
          >
            <Send size={15} color="#181205" strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;