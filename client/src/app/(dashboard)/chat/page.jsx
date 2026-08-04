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
    <div className="flex-1 flex h-full overflow-hidden p-6 gap-6">
      {/* Left Section: Chat List Window */}
      <div className="w-80 flex flex-col h-full retro-window">
        {/* Window Title Bar */}
        <div className="px-4 py-2 bg-[#C5F8C7] border-b-3 border-[#C85B7C] flex items-center justify-between shrink-0 select-none">
          <span className="font-retro text-[10px] font-black text-[#C85B7C] tracking-wider">MAILBOX.EXE</span>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FFCCD7] border border-[#C85B7C]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#FFF1C5] border border-[#C85B7C]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#C5F8C7] border border-[#C85B7C]" />
          </div>
        </div>

        {/* Search & Header */}
        <div className="p-4 border-b-2 border-zinc-200 bg-white flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h1 className="font-retro text-base font-black text-[#C85B7C] tracking-wide">MESSAGES</h1>
            <button
              onClick={() => setIsSearchOpen(true)}
              className="w-7 h-7 rounded-lg bg-[#FFE4EC] border-2 border-[#C85B7C] flex items-center justify-center text-[#C85B7C] hover:scale-105 transition-transform cursor-pointer"
            >
              <Plus size={14} strokeWidth={3} />
            </button>
          </div>
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
              size={14}
            />
            <input
              type="text"
              placeholder="Search chats..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-brand-bg border-2 border-[#C85B7C] text-xs text-zinc-800 placeholder-gray-400 focus:outline-none"
            />
          </div>
        </div>

        {/* Chat List Scrollable */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1.5 bg-white">
          {filteredChats.length === 0 ? (
            <div className="text-center text-xs text-gray-600 py-10 font-medium">
              No mailboxes found
            </div>
          ) : (
            filteredChats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => setActiveChat(chat)}
                className={`flex items-center justify-between p-2.5 rounded-2xl cursor-pointer transition-all duration-150 border-2 select-none ${
                  activeChat?.id === chat.id
                    ? "bg-[#FFE4EC]/70 border-[#C85B7C]"
                    : "bg-white border-transparent hover:bg-zinc-50"
                }`}
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <Avatar
                    username={chat.user.name}
                    status={chat.user.status}
                    size="md"
                    className="border-2 border-[#C85B7C] rounded-full"
                  />
                  <div className="overflow-hidden">
                    <h4 className="font-retro text-xs font-black text-[#C85B7C] truncate">
                      {chat.user.name.toUpperCase()}
                    </h4>
                    <p className="text-[10px] text-gray-500 truncate mt-0.5 font-medium">
                      {chat.lastMessage}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span className="text-[9px] font-bold text-gray-400">
                    {new Date(chat.updatedAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  {chat.unread > 0 && (
                    <span className="w-4 h-4 rounded-full bg-[#FE7B9B] border border-[#C85B7C] text-[9px] font-bold text-white flex items-center justify-center">
                      {chat.unread}
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Right Section: Active Chat Window or Welcome Dialog */}
      <div className="flex-1 flex flex-col h-full justify-center">
        {activeChat ? (
          <div className="flex-1 flex flex-col h-full retro-window">
            {/* Window Title Bar */}
            <div className="px-4 py-2 bg-[#FFCCD7] border-b-3 border-[#C85B7C] flex items-center justify-between shrink-0 select-none">
              <span className="font-retro text-[10px] font-black text-[#C85B7C] tracking-wider uppercase">
                {activeChat.user.name}.exe
              </span>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FFCCD7] border border-[#C85B7C]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#FFF1C5] border border-[#C85B7C]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#C5F8C7] border border-[#C85B7C]" />
              </div>
            </div>

            {/* Chat header panel */}
            <div className="px-6 py-3 border-b-2 border-zinc-200 bg-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar
                  username={activeChat.user.name}
                  status={activeChat.user.status}
                  size="md"
                  className="border-2 border-[#C85B7C] rounded-full"
                />
                <div>
                  <h3 className="font-retro text-sm font-black text-[#C85B7C] leading-none uppercase">
                    {activeChat.user.name}
                  </h3>
                  <span className="text-[9px] font-bold text-[#8E7A82] mt-1 block">
                    @{activeChat.user.username} • {activeChat.user.status}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-zinc-500">
                <button className="p-2 rounded-xl bg-white border-2 border-[#C85B7C] hover:bg-zinc-50 active:translate-x-[1px] active:translate-y-[1px] cursor-pointer">
                  <Phone size={14} className="text-[#C85B7C]" />
                </button>
                <button className="p-2 rounded-xl bg-white border-2 border-[#C85B7C] hover:bg-zinc-50 active:translate-x-[1px] active:translate-y-[1px] cursor-pointer">
                  <Video size={14} className="text-[#C85B7C]" />
                </button>
                <button className="p-2 rounded-xl bg-white border-2 border-[#C85B7C] hover:bg-zinc-50 active:translate-x-[1px] active:translate-y-[1px] cursor-pointer">
                  <Info size={14} className="text-[#C85B7C]" />
                </button>
              </div>
            </div>

            {/* Messages Feed Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-white/70">
              {loadingMessages ? (
                <div className="flex items-center justify-center py-20 text-xs text-gray-500 font-medium">
                  Loading message history...
                </div>
              ) : messages.length === 0 ? (
                <div className="text-center text-xs text-gray-600 py-20 font-medium">
                  Send a sticker or message to start chatting!
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
                      {!isOutgoing && <Avatar username={activeChat.user.name} size="sm" className="border-2 border-[#C85B7C] rounded-full" />}
                      <div className={`flex flex-col ${isOutgoing ? "items-end" : "items-start"}`}>
                        <div
                          className={`px-4 py-2 rounded-2xl text-xs font-bold border-2 border-[#C85B7C] shadow-[2px_2px_0px_0px_#C85B7C] ${
                            isOutgoing
                              ? "bg-[#FFE4EC] text-[#C85B7C] rounded-tr-sm"
                              : "bg-[#FFF1C5] text-[#C85B7C] rounded-tl-sm"
                          }`}
                        >
                          {msg.text}
                        </div>
                        <span className="text-[9px] font-bold text-gray-400 mt-1 px-1">
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
            <form onSubmit={handleSendMessage} className="p-4 border-t-2 border-zinc-250 bg-white flex items-center gap-3">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 px-4 py-2.5 rounded-xl bg-brand-bg border-2 border-[#C85B7C] text-xs text-zinc-800 placeholder-gray-400 focus:outline-none"
              />
              <button
                type="submit"
                disabled={!inputText.trim()}
                className="py-2.5 px-4 bg-[#FFE4EC] border-2 border-[#C85B7C] rounded-xl text-[#C85B7C] font-bold hover:scale-105 active:scale-95 transition-all shadow-[2px_2px_0px_0px_#C85B7C] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[0px_0px_0px_0px_#C85B7C] flex items-center justify-center cursor-pointer"
              >
                <Send size={14} strokeWidth={2.5} />
              </button>
            </form>
          </div>
        ) : (
          /* Retro Welcome / Error Style dialog box in the middle */
          <div className="w-[380px] mx-auto retro-window flex flex-col">
            <div className="px-4 py-1.5 bg-[#FFCCD7] border-b-3 border-[#C85B7C] flex items-center justify-between shrink-0 select-none">
              <span className="font-retro text-[9px] font-black text-[#C85B7C] tracking-wider">ALERT.EXE</span>
              <span className="w-2 h-2 rounded-full bg-[#C5F8C7] border border-[#C85B7C]" />
            </div>
            <div className="p-6 bg-white flex flex-col items-center gap-4 text-center">
              <div className="w-12 h-12 rounded-xl bg-[#FFF1C5] border-2 border-[#C85B7C] flex items-center justify-center">
                <MessageSquare size={24} className="text-[#C85B7C]" />
              </div>
              <div className="space-y-1">
                <h4 className="font-retro text-sm font-black text-[#C85B7C] tracking-wide">NO MAILBOX OPEN</h4>
                <p className="text-[10px] text-gray-500 font-bold max-w-[260px] leading-relaxed">
                  Choose an inbox from the left pane or click '+' to search and add dynamic stickers!
                </p>
              </div>
              <button
                onClick={() => setIsSearchOpen(true)}
                className="mt-2 px-6 py-2 bg-[#E6FCE8] border-2 border-[#C85B7C] rounded-xl font-retro text-xs font-black text-[#C85B7C] shadow-[3px_3px_0px_0px_#C85B7C] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_0px_#C85B7C] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[0px_0px_0px_0px_#C85B7C] cursor-pointer"
              >
                OK
              </button>
            </div>
          </div>
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
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-brand-bg border-2 border-[#C85B7C] text-xs text-zinc-800 focus:outline-none"
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
                  className="flex items-center gap-3 p-2.5 rounded-xl border border-zinc-200/60 hover:bg-[#FFE4EC]/55 cursor-pointer transition-colors"
                >
                  <Avatar username={searchUser.name} size="md" className="border border-[#C85B7C] rounded-full" />
                  <div>
                    <div className="text-xs font-black text-[#C85B7C]">{searchUser.name}</div>
                    <div className="text-[10px] text-gray-500 font-bold">@{searchUser.username}</div>
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
