"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, MessageSquare, Plus, Send, Phone, Video, Info } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import api from "../../../utils/api";
import Avatar from "../../../components/Avatar";
import EmptyState from "../../../components/EmptyState";
import Button from "../../../components/Button";
import Modal from "../../../components/Modal";
import { toast } from "react-hot-toast";

const Chat = () => {
  const { user } = useAuth();
  
  const [conversations, setConversations] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [inputText, setInputText] = useState("");
  const [loadingMessages, setLoadingMessages] = useState(false);
  
  // User Search Modal States
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [userSearchQuery, setUserSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);

  const socketRef = useRef(null);
  const activeChatRef = useRef(activeChat);
  const messagesEndRef = useRef(null);

  // Keep activeChat ref updated for WebSocket listener closures and persist state
  useEffect(() => {
    activeChatRef.current = activeChat;
    if (typeof window !== "undefined") {
      if (activeChat) {
        localStorage.setItem("blink_active_chat", JSON.stringify(activeChat));
      } else {
        localStorage.removeItem("blink_active_chat");
      }
    }
  }, [activeChat]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Fetch initial conversations list
  const fetchConversations = async () => {
    try {
      const res = await api.get("/chat/conversations");
      if (res.data.success) {
        setConversations(res.data.conversations);
        return res.data.conversations;
      }
    } catch (err) {
      console.error("❌ [CLIENT] Error fetching conversations:", err);
    }
    return [];
  };

  useEffect(() => {
    const initializeChat = async () => {
      const fetched = await fetchConversations();
      if (typeof window !== "undefined") {
        const savedChat = localStorage.getItem("blink_active_chat");
        if (savedChat) {
          try {
            const parsed = JSON.parse(savedChat);
            if (parsed && parsed.id) {
              const updated = fetched.find((c) => c.id === parsed.id);
              if (updated) {
                setActiveChat(updated);
              }
            } else if (parsed) {
              setActiveChat(parsed);
            }
          } catch (e) {
            console.error("Error restoring active chat:", e);
          }
        }
      }
    };
    initializeChat();
  }, []);

  // Fetch conversation messages when active chat changes
  useEffect(() => {
    if (activeChat && activeChat.id) {
      const fetchMessages = async () => {
        setLoadingMessages(true);
        try {
          const res = await api.get(`/chat/messages/${activeChat.id}`);
          if (res.data.success) {
            setMessages(res.data.messages);
          }
        } catch (err) {
          console.error("❌ [CLIENT] Error fetching messages:", err);
          toast.error("Failed to load message history");
        } finally {
          setLoadingMessages(false);
        }
      };

      fetchMessages();
    } else {
      setMessages([]);
    }
  }, [activeChat]);

  // Setup WebSocket connection
  useEffect(() => {
    const token = localStorage.getItem("blink_token");
    if (!token) return;

    // Establish link
    const wsProtocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    // target port 5001
    const wsUrl = `${wsProtocol}//localhost:5001?token=${token}`;
    
    console.log("🔌 [SOCKET] Connecting client websocket to:", wsUrl);
    const socket = new WebSocket(wsUrl);
    socketRef.current = socket;

    socket.onopen = () => {
      console.log("✅ [SOCKET] Connected to transmission server");
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("📥 [SOCKET] Received socket payload:", data);

        if (data.type === "NEW_MESSAGE") {
          const newMsg = data.payload;

          // If the message is for the currently open chat, append it
          if (activeChatRef.current && activeChatRef.current.id === newMsg.conversationId) {
            setMessages((prev) => {
              // Avoid duplicate messages
              if (prev.some((m) => m.id === newMsg.id)) return prev;
              return [...prev, newMsg];
            });
          }

          // Update this conversation's lastMessage in the sidebar
          setConversations((prev) => {
            const index = prev.findIndex((c) => c.id === newMsg.conversationId);
            if (index !== -1) {
              const updated = [...prev];
              updated[index].lastMessage = newMsg.text;
              updated[index].updatedAt = newMsg.createdAt;
              // Move to top
              const [moved] = updated.splice(index, 1);
              return [moved, ...updated];
            } else {
              // If conversation doesn't exist in user list, re-fetch all
              fetchConversations();
              return prev;
            }
          });
        }
      } catch (err) {
        console.error("❌ [SOCKET MESSAGE PARSE ERROR]", err);
      }
    };

    socket.onclose = () => {
      console.log("🔌 [SOCKET] Connection closed");
    };

    return () => {
      if (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING) {
        socket.close();
      }
    };
  }, []);

  // Handle User Search for starting new conversation
  useEffect(() => {
    if (!userSearchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await api.get(`/users/search?q=${userSearchQuery}`);
        if (res.data.success) {
          setSearchResults(res.data.users);
        }
      } catch (err) {
        console.error("❌ [CLIENT] User search error:", err);
      } finally {
        setSearching(false);
      }
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [userSearchQuery]);

  // Filter conversations in sidebar
  const filteredChats = conversations.filter(
    (chat) =>
      chat.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Send message submit handler
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    if (!activeChat) return;

    const messageText = inputText.trim();
    setInputText("");

    // If it's a pre-existing conversation, send via WebSocket
    if (activeChat.id) {
      if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
        socketRef.current.send(
          JSON.stringify({
            type: "SEND_MESSAGE",
            payload: {
              conversationId: activeChat.id,
              text: messageText,
            },
          })
        );
      } else {
        // Fallback to REST API if socket is disconnected
        try {
          await api.post("/chat/message", {
            conversationId: activeChat.id,
            text: messageText,
          });
        } catch (err) {
          console.error("❌ [CLIENT] Send message REST error:", err);
          toast.error("Failed to send message");
        }
      }
    } else {
      // Starting a brand new conversation
      try {
        const res = await api.post("/chat/message", {
          recipientId: activeChat.user.id,
          text: messageText,
        });

        if (res.data.success) {
          const { newMessage } = res.data;
          
          // Re-fetch conversations list to include the newly created conversation
          await fetchConversations();

          // Set active chat to the new conversation
          setActiveChat({
            id: newMessage.conversationId,
            user: activeChat.user,
            lastMessage: newMessage.text,
            updatedAt: newMessage.createdAt,
          });
        }
      } catch (err) {
        console.error("❌ [CLIENT] Error initializing new chat:", err);
        toast.error("Failed to start new conversation");
      }
    }
  };

  const handleStartChatWithUser = (selectedUser) => {
    setIsSearchOpen(false);
    setUserSearchQuery("");
    setSearchResults([]);

    // Check if conversation already exists with this user
    const existing = conversations.find((c) => c.user.id === selectedUser.id);
    if (existing) {
      setActiveChat(existing);
    } else {
      // Pending conversation setup
      setActiveChat({
        id: null,
        user: {
          id: selectedUser.id,
          name: selectedUser.name,
          username: selectedUser.username,
          status: "offline",
          profileImage: selectedUser.profileImage || "",
        },
        lastMessage: "",
        updatedAt: new Date().toISOString(),
      });
    }
  };

  return (
    <div className="flex-1 flex h-full overflow-hidden">
      {/* Middle Section: Chat List */}
      <div className="w-80 border-r border-zinc-800/80 flex flex-col h-full bg-zinc-950/40">
        {/* Search & Header */}
        <div className="p-4 border-b border-zinc-800/80 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-white tracking-tight">Messages</h1>
            <button
              onClick={() => setIsSearchOpen(true)}
              className="w-8 h-8 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 flex items-center justify-center text-gray-400 hover:text-white transition-colors cursor-pointer"
            >
              <Plus size={16} />
            </button>
          </div>
          <div className="relative">
            <Search
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500"
              size={16}
            />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-brand-surface border border-zinc-850 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-primary transition-colors"
            />
          </div>
        </div>

        {/* Chat List Scrollable */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {filteredChats.length === 0 ? (
            <div className="text-center text-xs text-gray-600 py-10">
              No conversations found
            </div>
          ) : (
            filteredChats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => setActiveChat(chat)}
                className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all duration-200 select-none ${
                  activeChat?.id === chat.id
                    ? "bg-brand-accent/10 border-l-2 border-brand-accent pl-2.5"
                    : "hover:bg-zinc-900/50 pl-3"
                }`}
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <Avatar
                    username={chat.user.name}
                    status={chat.user.status}
                    size="md"
                  />
                  <div className="overflow-hidden">
                    <h4 className="text-sm font-semibold text-white truncate">
                      {chat.user.name}
                    </h4>
                    <p className="text-xs text-gray-500 truncate mt-0.5">
                      {chat.lastMessage}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  <span className="text-[10px] text-gray-600">
                    {new Date(chat.updatedAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  {chat.unread > 0 && (
                    <span className="w-4 h-4 rounded-full bg-brand-primary text-[9px] font-bold text-white flex items-center justify-center">
                      {chat.unread}
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Right Section: Active Chat or Empty State */}
      <div className="flex-1 flex flex-col h-full bg-zinc-950/20">
        {activeChat ? (
          <div className="flex-1 flex flex-col h-full overflow-hidden">
            {/* Chat header */}
            <div className="px-6 py-4 border-b border-zinc-800/80 bg-brand-surface/20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar
                  username={activeChat.user.name}
                  status={activeChat.user.status}
                  size="md"
                />
                <div>
                  <h3 className="text-sm font-semibold text-white leading-none">
                    {activeChat.user.name}
                  </h3>
                  <span className="text-[10px] text-brand-text-secondary mt-1 block">
                    @{activeChat.user.username} • {activeChat.user.status}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <button className="p-2 rounded-lg hover:bg-zinc-900 hover:text-white transition-colors cursor-pointer">
                  <Phone size={16} />
                </button>
                <button className="p-2 rounded-lg hover:bg-zinc-900 hover:text-white transition-colors cursor-pointer">
                  <Video size={16} />
                </button>
                <button className="p-2 rounded-lg hover:bg-zinc-900 hover:text-white transition-colors cursor-pointer">
                  <Info size={16} />
                </button>
              </div>
            </div>

            {/* Messages Feed Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {loadingMessages ? (
                <div className="flex items-center justify-center py-20 text-xs text-gray-500">
                  Loading message history...
                </div>
              ) : messages.length === 0 ? (
                <div className="text-center text-xs text-gray-600 py-20">
                  Send a message to start the conversation!
                </div>
              ) : (
                messages.map((msg) => {
                  const isOutgoing = msg.senderId === user?.id;
                  return (
                    <div
                      key={msg.id}
                      className={`flex items-start gap-3 max-w-[80%] ${
                        isOutgoing ? "self-end flex-row-reverse" : ""
                      }`}
                    >
                      {!isOutgoing && <Avatar username={activeChat.user.name} size="sm" />}
                      <div className={`flex flex-col ${isOutgoing ? "items-end" : "items-start"}`}>
                        <div
                          className={`px-4 py-2.5 rounded-2xl text-sm text-white shadow-md ${
                            isOutgoing
                              ? "bg-brand-primary rounded-tr-sm"
                              : "bg-[#A2B0C4] rounded-tl-sm"
                          }`}
                        >
                          {msg.text}
                        </div>
                        <span className="text-[9px] text-gray-600 mt-1 px-1">
                          {new Date(msg.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input footer */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-zinc-800/80 bg-brand-surface/10 flex items-center gap-3">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-850 text-xs text-white focus:outline-none focus:border-brand-primary"
              />
              <Button type="submit" variant="primary" className="py-2.5 px-4" disabled={!inputText.trim()}>
                <Send size={14} />
              </Button>
            </form>
          </div>
        ) : (
          <EmptyState
            title="Select a Conversation"
            description="Choose a chat from the sidebar or search for friends to start blinking."
            icon={<MessageSquare className="text-brand-primary" size={28} />}
            action={
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsSearchOpen(true)}
                iconBefore={<Plus size={14} />}
              >
                New Conversation
              </Button>
            }
          />
        )}
      </div>

      {/* User Search Modal */}
      <Modal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        title="Start New Conversation"
        size="md"
      >
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
            <input
              type="text"
              placeholder="Search by name or username..."
              value={userSearchQuery}
              onChange={(e) => setUserSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-brand-surface border border-zinc-850 text-xs text-white focus:outline-none focus:border-brand-primary"
            />
          </div>

          <div className="space-y-2 max-h-60 overflow-y-auto">
            {searching ? (
              <div className="text-center py-4 text-xs text-gray-500">Searching...</div>
            ) : searchResults.length === 0 ? (
              <div className="text-center py-4 text-xs text-gray-500">
                {userSearchQuery ? "No users found" : "Type to search users"}
              </div>
            ) : (
              searchResults.map((searchUser) => (
                <div
                  key={searchUser.id}
                  onClick={() => handleStartChatWithUser(searchUser)}
                  className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-zinc-800/50 cursor-pointer transition-colors"
                >
                  <Avatar username={searchUser.name} size="md" />
                  <div>
                    <div className="text-sm font-semibold text-white">{searchUser.name}</div>
                    <div className="text-xs text-gray-500">@{searchUser.username}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Chat;
