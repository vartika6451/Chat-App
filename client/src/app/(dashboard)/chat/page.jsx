/* eslint-disable */
"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, MessageSquare, Plus, Send, Phone, Video, Info, Clock, Calendar, X, VideoOff } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import api from "../../../utils/api";
import Avatar from "../../../components/Avatar";
import EmptyState from "../../../components/EmptyState";
import Button from "../../../components/Button";
import Modal from "../../../components/Modal";
import { toast } from "react-hot-toast";
import { useTheme } from "../../../context/ThemeContext";
import AmbientEffects from "../../../components/AmbientEffects";

const Chat = () => {
  const { user } = useAuth();
  const { themeMode, activeEmotion, setActiveEmotion, updateEmotion, lockedTheme } = useTheme();
  
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

  // Message Scheduling States
  const [isScheduleMsgOpen, setIsScheduleMsgOpen] = useState(false);
  const [scheduledMsgText, setScheduledMsgText] = useState("");
  const [scheduledMsgTime, setScheduledMsgTime] = useState("");

  // Call Modal / Overlay States
  const [isCallModalOpen, setIsCallModalOpen] = useState(false);
  const [scheduledCallTitle, setScheduledCallTitle] = useState("");
  const [scheduledCallType, setScheduledCallType] = useState("video");
  const [scheduledCallTime, setScheduledCallTime] = useState("");

  // Active Call Screen Mockup State
  const [activeCall, setActiveCall] = useState(null);
  const [callTimer, setCallTimer] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [incomingCall, setIncomingCall] = useState(null);

  // Scheduled Items Drawer State
  const [isScheduledDrawerOpen, setIsScheduledDrawerOpen] = useState(false);
  const [scheduledMessages, setScheduledMessages] = useState([]);
  const [scheduledCalls, setScheduledCalls] = useState([]);

  // Fetch Scheduled messages & calls
  const fetchScheduledItems = async (conversationId) => {
    if (!conversationId) return;
    try {
      const [msgRes, callRes] = await Promise.all([
        api.get(`/chat/scheduled-messages/${conversationId}`),
        api.get(`/chat/scheduled-calls/${conversationId}`)
      ]);
      if (msgRes.data.success) {
        setScheduledMessages(msgRes.data.scheduledMessages);
      }
      if (callRes.data.success) {
        setScheduledCalls(callRes.data.scheduledCalls);
      }
    } catch (err) {
      console.error("❌ Error fetching scheduled items:", err);
    }
  };

  // Sync scheduled items
  useEffect(() => {
    if (activeChat && activeChat.id) {
      fetchScheduledItems(activeChat.id);
    } else {
      setScheduledMessages([]);
      setScheduledCalls([]);
    }
  }, [activeChat, isScheduledDrawerOpen]);

  // Call handling functions
  const handleStartInstantCall = (type) => {
    setActiveCall({
      id: Math.random().toString(36).substr(2, 9),
      title: type === "video" ? "Video Sync" : "Voice Session",
      type,
      status: "CONNECTED",
    });
    setCallTimer(0);
    toast.success(`Calling ${activeChat?.user?.name || "Blink User"}...`);

    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(
        JSON.stringify({
          type: "SEND_MESSAGE",
          payload: {
            conversationId: activeChat.id,
            text: `📞 Started an instant ${type} call. Join now!`,
          },
        })
      );
    }
  };

  // Timer useEffect for active call duration
  useEffect(() => {
    let interval;
    if (activeCall && activeCall.status === "CONNECTED") {
      interval = setInterval(() => {
        setCallTimer((prev) => prev + 1);
      }, 1000);
    } else {
      setCallTimer(0);
    }
    return () => clearInterval(interval);
  }, [activeCall]);

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

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
      let initialized = false;

      if (typeof window !== "undefined") {
        const urlParams = new URLSearchParams(window.location.search);
        const startUserId = urlParams.get("userId");
        if (startUserId) {
          const existing = fetched.find((c) => c.user.id === startUserId);
          if (existing) {
            setActiveChat(existing);
            initialized = true;
          } else {
            try {
              const res = await api.get(`/users/profile/${startUserId}`);
              if (res.data.success) {
                const selectedUser = res.data.user;
                setActiveChat({
                  id: null,
                  user: {
                    id: selectedUser.id,
                    name: selectedUser.name,
                    username: selectedUser.username,
                    status: "offline",
                    profileImage: selectedUser.avatar || "",
                  },
                  lastMessage: "",
                  updatedAt: new Date().toISOString(),
                });
                initialized = true;
              }
            } catch (err) {
              console.error("Failed to start chat from url params:", err);
            }
          }
          // Clear query param
          window.history.replaceState({}, document.title, window.location.pathname);
        }

        if (!initialized) {
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

      const fetchInitialEmotion = async () => {
        try {
          const res = await api.get(`/chat/conversation/${activeChat.id}/emotion`);
          if (res.data.success) {
            updateEmotion(res.data.emotion, res.data.confidence);
          }
        } catch (err) {
          console.error("Error fetching conversation emotion:", err);
        }
      };

      fetchMessages();
      fetchInitialEmotion();
    } else {
      setMessages([]);
      setActiveEmotion("friendly");
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
        } else if (data.type === "EMOTION_UPDATE") {
          const { conversationId, emotion, confidence } = data.payload;
          if (activeChatRef.current && activeChatRef.current.id === conversationId) {
            updateEmotion(emotion, confidence);
          }
        } else if (data.type === "CALL_STARTED") {
          const callData = data.payload;
          toast.success(`Incoming call: "${callData.title}" from ${callData.hostName}!`, {
            duration: 8000,
            icon: "📞"
          });
          setIncomingCall(callData);
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
    <div className="flex-1 flex h-full overflow-hidden p-6 pr-8 gap-6">
      {/* Left Section: Chat List Window */}
      <div className="w-80 flex flex-col h-full bg-white dark:bg-zinc-900/60 backdrop-blur-md rounded-[24px] border border-zinc-150 dark:border-zinc-800/60 shadow-[0_4px_20px_rgba(0,0,0,0.015)] overflow-hidden">
        {/* Search & Header */}
        <div className="p-4.5 border-b border-zinc-100 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/40 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h1 className="text-sm font-bold text-zinc-850 dark:text-zinc-200 tracking-tight">Messages</h1>
            <button
              onClick={() => setIsSearchOpen(true)}
              className="w-8 h-8 rounded-full bg-[var(--color-brand-accent-pink-light)]/40 hover:bg-[var(--color-brand-accent-pink-light)]/60 text-[var(--color-brand-accent-pink)] flex items-center justify-center hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <Plus size={15} strokeWidth={2.5} />
            </button>
          </div>
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={13}
            />
            <input
              type="text"
              placeholder="Search chats..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-150 dark:border-zinc-800/60 text-xs text-zinc-800 dark:text-zinc-100 placeholder-gray-400 focus:outline-none focus:border-[var(--color-brand-accent-pink)] focus:ring-1 focus:ring-[var(--color-brand-accent-pink)]/20 transition-all duration-200"
            />
          </div>
        </div>

        {/* Chat List Scrollable */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1 bg-white dark:bg-zinc-900/10">
          {filteredChats.length === 0 ? (
            <div className="text-center text-xs text-gray-400 py-12 font-medium">
              No chats found
            </div>
          ) : (
            filteredChats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => setActiveChat(chat)}
                className={`flex items-center justify-between p-3 rounded-2xl cursor-pointer transition-all duration-200 border border-transparent select-none ${
                  activeChat?.id === chat.id
                    ? "bg-[var(--color-brand-accent-pink-light)]/20 shadow-[0_2px_10px_rgba(238,147,179,0.05)] border-[var(--color-brand-accent-pink-light)]/10"
                    : "bg-transparent hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30"
                }`}
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <Avatar
                    src={chat.user.profileImage}
                    username={chat.user.name}
                    status={chat.user.status}
                    size="md"
                    className="rounded-full"
                  />
                  <div className="overflow-hidden">
                    <h4 className={`text-xs font-semibold truncate ${
                      activeChat?.id === chat.id ? "text-[var(--color-brand-accent-pink)]" : "text-zinc-800 dark:text-zinc-200"
                    }`}>
                      {chat.user.name}
                    </h4>
                    <p className="text-[10px] text-gray-400 dark:text-zinc-500 truncate mt-0.5 font-medium">
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
                    <span className="w-4 h-4 rounded-full bg-[var(--color-brand-accent-pink)] text-[8px] font-bold text-white flex items-center justify-center shadow-sm shadow-pink-500/10">
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
      <div className="flex-grow flex flex-col h-full justify-center">
        {activeChat ? (
          <div className="flex-1 flex h-full relative overflow-hidden">
            <div className={`flex-grow flex flex-col h-full bg-white dark:bg-zinc-900/60 backdrop-blur-md rounded-[24px] border border-zinc-150 dark:border-zinc-800/60 shadow-[0_4px_20px_rgba(0,0,0,0.015)] overflow-hidden transition-all duration-300 ${
              isScheduledDrawerOpen ? "mr-72" : ""
            }`}>
              {/* Chat header panel */}
              <div className="px-6 py-3.5 border-b border-zinc-100 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/40 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar
                    src={activeChat.user.profileImage}
                    username={activeChat.user.name}
                    status={activeChat.user.status}
                    size="md"
                    className="rounded-full"
                  />
                  <div>
                    <h3 className="text-xs font-bold text-zinc-800 dark:text-zinc-200 leading-none">
                      {activeChat.user.name}
                    </h3>
                    <span className="text-[9px] font-bold text-gray-400 dark:text-zinc-500 mt-1 block">
                      @{activeChat.user.username} • {activeChat.user.status}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-zinc-500">
                  <button
                    onClick={() => setIsScheduledDrawerOpen(prev => !prev)}
                    className={`p-2.5 rounded-xl border transition-all duration-200 cursor-pointer flex items-center justify-center ${
                      isScheduledDrawerOpen
                        ? "bg-[var(--color-brand-accent-pink-light)]/20 text-[var(--color-brand-accent-pink)] border-[var(--color-brand-accent-pink)]"
                        : "bg-white dark:bg-zinc-900 text-zinc-400 border-zinc-200 dark:border-zinc-800/60 hover:bg-zinc-50 dark:hover:bg-zinc-800/40 hover:scale-105 active:scale-95"
                    }`}
                    title="View Scheduled Messages & Calls"
                  >
                    <Calendar size={14} />
                  </button>
                  <button
                    onClick={() => {
                      setScheduledCallTitle("Sync Session");
                      setScheduledCallType("audio");
                      setIsCallModalOpen(true);
                    }}
                    className="p-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/60 text-zinc-400 hover:text-[var(--color-brand-accent-pink)] hover:bg-zinc-50 dark:hover:bg-zinc-800/40 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer flex items-center justify-center"
                    title="Voice Call / Schedule"
                  >
                    <Phone size={14} />
                  </button>
                  <button
                    onClick={() => {
                      setScheduledCallTitle("Video Sync");
                      setScheduledCallType("video");
                      setIsCallModalOpen(true);
                    }}
                    className="p-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/60 text-zinc-400 hover:text-[var(--color-brand-accent-pink)] hover:bg-zinc-50 dark:hover:bg-zinc-800/40 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer flex items-center justify-center"
                    title="Video Call / Schedule"
                  >
                    <Video size={14} />
                  </button>
                  <button className="p-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/60 text-zinc-400 hover:text-[var(--color-brand-accent-pink)] hover:bg-zinc-50 dark:hover:bg-zinc-800/40 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer flex items-center justify-center">
                    <Info size={14} />
                  </button>
                </div>
              </div>

            {/* Messages Feed Area Wrapper (viewport-locked overlay container) */}
            <div className="flex-1 relative overflow-hidden flex flex-col bg-brand-surface/20">
              <AmbientEffects emotion={themeMode === "disabled" ? "none" : (themeMode === "manual" ? lockedTheme : activeEmotion)} />
              <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-transparent relative z-10 messages-feed-bg">
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
                        className={`flex items-start gap-3 max-w-[80%] relative z-10 ${
                          isOutgoing ? "self-end flex-row-reverse" : ""
                        }`}
                      >
                        {!isOutgoing && <Avatar src={activeChat.user.profileImage} username={activeChat.user.name} size="sm" className="border-2 border-[var(--color-brand-border)] rounded-full" />}
                        <div className={`flex flex-col ${isOutgoing ? "items-end" : "items-start"}`}>
                          <div
                            className={`px-4 py-2 rounded-2xl text-xs font-bold border-2 border-[var(--color-brand-border)] shadow-[2px_2px_0px_0px_var(--color-brand-border)] ${
                              isOutgoing
                                ? "bg-brand-primary-light text-[var(--color-brand-border)] rounded-tr-sm"
                                : "bg-brand-accent text-[var(--color-brand-border)] rounded-tl-sm"
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
            </div>

            {/* Chat Input footer */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  if (!activeChat || !activeChat.id) {
                    toast.error("Open a conversation to schedule a message!");
                    return;
                  }
                  setScheduledMsgText(inputText);
                  setIsScheduleMsgOpen(true);
                }}
                className="p-3 bg-zinc-50 dark:bg-zinc-850 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-zinc-500 hover:text-[var(--color-brand-accent-pink)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center cursor-pointer"
                title="Schedule Message"
              >
                <Clock size={14} />
              </button>
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 px-4 py-2.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800/60 text-xs text-zinc-800 dark:text-zinc-100 placeholder-gray-400 focus:outline-none focus:border-[var(--color-brand-accent-pink)] focus:ring-1 focus:ring-[var(--color-brand-accent-pink)]/20 transition-all duration-200"
              />
              <button
                type="submit"
                disabled={!inputText.trim()}
                className="py-2.5 px-4 bg-gradient-to-r from-[var(--color-brand-accent-pink-light)] to-[var(--color-brand-accent-pink)] hover:opacity-95 text-white font-bold rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-md shadow-pink-500/10 flex items-center justify-center cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={14} strokeWidth={2.5} />
              </button>
            </form>
          </div>

          {/* Scheduled Drawer Panel */}
          {isScheduledDrawerOpen && (
            <div className="absolute right-0 top-0 bottom-0 w-72 bg-white dark:bg-zinc-900 border-l border-zinc-150 dark:border-zinc-800 shadow-2xl flex flex-col z-20">
              <div className="px-4 py-3 border-b border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-center justify-between shrink-0 select-none">
                <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300 tracking-tight uppercase">
                  Scheduled Log
                </span>
                <button
                  onClick={() => setIsScheduledDrawerOpen(false)}
                  className="p-1.5 text-zinc-400 hover:text-zinc-650 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-xl cursor-pointer"
                >
                  <X size={14} strokeWidth={2} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-5">
                {/* Scheduled Messages List */}
                <div>
                  <h5 className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-2 border-b border-zinc-100 dark:border-zinc-800 pb-1 flex items-center gap-1.5">
                    <Clock size={11} /> Scheduled Messages
                  </h5>
                  {scheduledMessages.length === 0 ? (
                    <p className="text-[10px] text-gray-400 font-semibold italic text-center py-4">No scheduled messages</p>
                  ) : (
                    <div className="space-y-2">
                      {scheduledMessages.map((msg) => (
                        <div key={msg.id} className="p-2.5 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/30 flex flex-col gap-1">
                          <p className="text-[11px] text-zinc-700 dark:text-zinc-300 font-semibold break-all leading-tight">
                            "{msg.text}"
                          </p>
                          <div className="flex justify-between items-center mt-1">
                            <span className="text-[9px] font-bold text-gray-400">
                              {new Date(msg.scheduledAt).toLocaleString()}
                            </span>
                            <button
                              onClick={async () => {
                                  try {
                                    await api.delete(`/chat/scheduled-messages/${msg.id}`);
                                    toast.success("Scheduled message deleted");
                                    fetchScheduledItems(activeChat.id);
                                  } catch (err) {
                                    toast.error("Failed to delete");
                                  }
                              }}
                              className="text-[9px] font-bold text-[var(--color-brand-accent-pink)] hover:text-rose-600 uppercase cursor-pointer"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Scheduled Calls List */}
                <div>
                  <h5 className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-2 border-b border-zinc-100 dark:border-zinc-800 pb-1 flex items-center gap-1.5">
                    <Phone size={11} /> Scheduled Calls
                  </h5>
                  {scheduledCalls.length === 0 ? (
                    <p className="text-[10px] text-gray-400 font-semibold italic text-center py-4">No scheduled calls</p>
                  ) : (
                    <div className="space-y-2">
                      {scheduledCalls.map((call) => (
                        <div key={call.id} className="p-2.5 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/30 flex flex-col gap-1">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-zinc-700 dark:text-zinc-355 truncate max-w-[120px]">
                              {call.title}
                            </span>
                            <span className="text-[8px] font-bold text-zinc-450 uppercase bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 px-1 rounded-md">
                              {call.callType}
                            </span>
                          </div>
                          <div className="flex justify-between items-center mt-1">
                            <span className="text-[9px] font-bold text-gray-400">
                              {new Date(call.scheduledAt).toLocaleString()}
                            </span>
                            <button
                              onClick={async () => {
                                  try {
                                    await api.delete(`/chat/scheduled-calls/${call.id}`);
                                    toast.success("Scheduled call cancelled");
                                    fetchScheduledItems(activeChat.id);
                                  } catch (err) {
                                    toast.error("Failed to cancel");
                                  }
                              }}
                              className="text-[9px] font-bold text-[var(--color-brand-accent-pink)] hover:text-rose-600 uppercase cursor-pointer"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
        ) : (
          /* Welcome Card in the middle */
          <div className="w-[360px] mx-auto bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800/60 shadow-[0_8px_30px_rgba(0,0,0,0.02)] rounded-[28px] overflow-hidden flex flex-col">
            <div className="p-8 flex flex-col items-center gap-5 text-center bg-white dark:bg-zinc-900">
              <div className="w-14 h-14 rounded-full bg-[var(--color-brand-accent-pink-light)]/20 flex items-center justify-center text-[var(--color-brand-accent-pink)]">
                <MessageSquare size={24} />
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-bold text-zinc-800 dark:text-zinc-200 tracking-tight">No Chat Open</h4>
                <p className="text-xs text-gray-400 dark:text-zinc-500 font-medium max-w-[260px] leading-relaxed">
                  Choose a conversation from the left pane or click '+' to search and start custom chats!
                </p>
              </div>
              <button
                onClick={() => setIsSearchOpen(true)}
                className="mt-2 px-6 py-2.5 bg-gradient-to-r from-[var(--color-brand-accent-pink-light)] to-[var(--color-brand-accent-pink)] hover:opacity-95 text-white font-semibold text-xs rounded-2xl shadow-md shadow-pink-500/10 cursor-pointer"
              >
                Start Chatting
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
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-brand-bg border-2 border-[var(--color-brand-border)] text-xs text-zinc-800 focus:outline-none"
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
                  className="flex items-center gap-3 p-2.5 rounded-xl border border-zinc-200/60 hover:bg-brand-primary-light/55 cursor-pointer transition-colors"
                >
                  <Avatar src={searchUser.profileImage} username={searchUser.name} size="md" className="border border-[var(--color-brand-border)] rounded-full" />
                  <div>
                    <div className="text-xs font-black text-[var(--color-brand-border)]">{searchUser.name}</div>
                    <div className="text-[10px] text-gray-500 font-bold">@{searchUser.username}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </Modal>

      {/* Schedule Message Modal */}
      <Modal
        isOpen={isScheduleMsgOpen}
        onClose={() => setIsScheduleMsgOpen(false)}
        title="Schedule Message"
        size="md"
      >
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            if (!scheduledMsgText.trim() || !scheduledMsgTime) {
              toast.error("Message text and time are required");
              return;
            }
            try {
              const res = await api.post("/chat/scheduled-messages", {
                conversationId: activeChat.id,
                text: scheduledMsgText.trim(),
                scheduledAt: new Date(scheduledMsgTime).toISOString(),
              });
              if (res.data.success) {
                toast.success("Message scheduled successfully!");
                setIsScheduleMsgOpen(false);
                setScheduledMsgText("");
                setScheduledMsgTime("");
                fetchScheduledItems(activeChat.id);
              }
            } catch (err) {
              console.error("Error scheduling message:", err);
              toast.error("Failed to schedule message");
            }
          }}
          className="space-y-4"
        >
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase">Message Text</label>
            <textarea
              value={scheduledMsgText}
              onChange={(e) => setScheduledMsgText(e.target.value)}
              placeholder="Type your message to schedule..."
              className="w-full mt-1.5 px-3 py-2 rounded-xl bg-brand-bg border-2 border-[var(--color-brand-border)] text-xs text-zinc-800 placeholder-gray-400 focus:outline-none resize-none"
              rows={3}
              required
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase">Send Time</label>
            <input
              type="datetime-local"
              value={scheduledMsgTime}
              onChange={(e) => setScheduledMsgTime(e.target.value)}
              className="w-full mt-1.5 px-3 py-2 rounded-xl bg-brand-bg border-2 border-[var(--color-brand-border)] text-xs text-zinc-800 focus:outline-none cursor-pointer"
              required
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setIsScheduleMsgOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Schedule Message
            </Button>
          </div>
        </form>
      </Modal>

      {/* Call Options Modal (Start Instant or Schedule Call) */}
      <Modal
        isOpen={isCallModalOpen}
        onClose={() => setIsCallModalOpen(false)}
        title="Call Options"
        size="md"
      >
        <div className="space-y-6">
          {/* Instant Call Row */}
          <div className="p-4 rounded-2xl bg-brand-primary-light/40 border-2 border-dashed border-[var(--color-brand-border)] flex flex-col items-center gap-3 text-center">
            <h4 className="font-retro text-xs font-black text-[var(--color-brand-border)]">START INSTANT TRANSMISSION</h4>
            <p className="text-[10px] text-gray-500 font-semibold max-w-[300px]">
              Instantly connect with a secure audio or video stream to {activeChat?.user?.name}.
            </p>
            <div className="flex gap-2.5">
              <Button
                variant="primary"
                onClick={() => {
                  setIsCallModalOpen(false);
                  handleStartInstantCall("audio");
                }}
                iconBefore={<Phone size={14} />}
              >
                Instant Audio
              </Button>
              <Button
                variant="accent"
                onClick={() => {
                  setIsCallModalOpen(false);
                  handleStartInstantCall("video");
                }}
                iconBefore={<Video size={14} />}
              >
                Instant Video
              </Button>
            </div>
          </div>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-zinc-200"></div>
            <span className="flex-shrink mx-4 text-xs font-bold text-gray-400">OR SCHEDULE CALL</span>
            <div className="flex-grow border-t border-zinc-200"></div>
          </div>

          {/* Schedule Call Form */}
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              if (!scheduledCallTitle.trim() || !scheduledCallTime) {
                toast.error("Call title and time are required");
                return;
              }
              try {
                const res = await api.post("/chat/scheduled-calls", {
                  conversationId: activeChat.id,
                  title: scheduledCallTitle.trim(),
                  callType: scheduledCallType,
                  scheduledAt: new Date(scheduledCallTime).toISOString(),
                });
                if (res.data.success) {
                  toast.success("Call scheduled successfully!");
                  setIsCallModalOpen(false);
                  setScheduledCallTitle("");
                  setScheduledCallTime("");
                  fetchScheduledItems(activeChat.id);
                  // Refresh messages feed to see the "scheduled call" notice
                  if (activeChat.id) {
                    const msgRes = await api.get(`/chat/messages/${activeChat.id}`);
                    if (msgRes.data.success) {
                      setMessages(msgRes.data.messages);
                    }
                  }
                }
              } catch (err) {
                console.error("Error scheduling call:", err);
                toast.error("Failed to schedule call");
              }
            }}
            className="space-y-4"
          >
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase">Call Topic/Title</label>
              <input
                type="text"
                value={scheduledCallTitle}
                onChange={(e) => setScheduledCallTitle(e.target.value)}
                placeholder="Weekly Sync, Brainstorming, etc."
                className="w-full mt-1.5 px-3 py-2.5 rounded-xl bg-brand-bg border-2 border-[var(--color-brand-border)] text-xs text-zinc-800 focus:outline-none"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase">Call Type</label>
                <select
                  value={scheduledCallType}
                  onChange={(e) => setScheduledCallType(e.target.value)}
                  className="w-full mt-1.5 px-3 py-2.5 rounded-xl bg-brand-bg border-2 border-[var(--color-brand-border)] text-xs text-zinc-800 focus:outline-none cursor-pointer"
                >
                  <option value="audio">Audio Connection</option>
                  <option value="video">Video Stream</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase">Scheduled Time</label>
                <input
                  type="datetime-local"
                  value={scheduledCallTime}
                  onChange={(e) => setScheduledCallTime(e.target.value)}
                  className="w-full mt-1.5 px-3 py-2.5 rounded-xl bg-brand-bg border-2 border-[var(--color-brand-border)] text-xs text-zinc-800 focus:outline-none cursor-pointer"
                  required
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setIsCallModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Schedule Call
              </Button>
            </div>
          </form>
        </div>
      </Modal>

      {/* Active Call Overlay */}
      {activeCall && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex flex-col items-center justify-between p-8 z-50 animate-fade-in font-sans text-white">
          <div className="text-center mt-6">
            <span className="text-[9px] tracking-widest font-black uppercase text-brand-primary bg-brand-primary/10 border border-brand-primary/20 px-2 py-0.5 rounded-md">
              SECURE BLINK STREAM ({activeCall.type.toUpperCase()})
            </span>
            <h2 className="text-xl font-bold tracking-tight text-white mt-3 uppercase">
              {activeCall.title}
            </h2>
            <p className="text-xs text-brand-text-secondary mt-1">
              With {activeChat?.user?.name || "Blink Friend"} • {formatDuration(callTimer)}
            </p>
          </div>

          <div className="flex-1 flex items-center justify-center relative w-full max-w-xl aspect-video rounded-3xl border-3 border-[var(--color-brand-border)] bg-zinc-950 overflow-hidden shadow-2xl">
            <div className="absolute top-[20%] left-[25%] w-48 h-48 rounded-full bg-brand-primary/20 blur-[60px]" />
            <div className="absolute bottom-[20%] right-[25%] w-48 h-48 rounded-full bg-brand-accent/20 blur-[60px]" />

            {activeCall.type === "video" && !isCameraOff ? (
              <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-gradient-to-tr from-zinc-900 to-indigo-950/80">
                {isScreenSharing ? (
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-16 h-16 rounded-2xl bg-brand-primary/20 border border-brand-primary/30 flex items-center justify-center text-brand-primary animate-pulse">
                      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <span className="text-xs font-semibold text-zinc-400">Sharing your screen...</span>
                  </div>
                ) : (
                  <div className="relative w-full h-full">
                    <div className="absolute inset-0 flex items-center justify-center opacity-30 select-none">
                      <div className="w-20 h-20 rounded-full border border-white/10 flex items-center justify-center">
                        <Video size={40} className="text-zinc-500" />
                      </div>
                    </div>

                    <div className="absolute bottom-4 right-4 w-32 aspect-video rounded-xl border border-zinc-700 bg-zinc-900 overflow-hidden shadow-md flex items-center justify-center text-[10px] font-bold text-zinc-500">
                      Local Cam
                    </div>

                    <div className="absolute top-4 left-4 flex items-center gap-1.5 px-2 py-0.5 bg-black/60 border border-zinc-700 rounded-md text-[9px] font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-danger animate-pulse" /> LIVE STREAM
                    </div>

                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                      <Avatar
                        src={activeChat?.user?.profileImage}
                        username={activeChat?.user?.name || "Blink"}
                        size="lg"
                        className="w-24 h-24 border-3 border-brand-primary rounded-full shadow-lg"
                      />
                      <span className="text-xs font-bold text-white tracking-wide bg-black/40 px-3 py-1 rounded-full border border-white/5">
                        {activeChat?.user?.name}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center gap-6">
                <div className="relative flex items-center justify-center">
                  <span className="absolute inline-flex h-32 w-32 rounded-full bg-brand-primary/20 animate-ping opacity-75" />
                  <span className="absolute inline-flex h-24 w-24 rounded-full bg-brand-accent/20 animate-pulse" />
                  
                  <Avatar
                    src={activeChat?.user?.profileImage}
                    username={activeChat?.user?.name || "Blink"}
                    size="lg"
                    className="w-20 h-20 border-3 border-brand-primary rounded-full relative z-10"
                  />
                </div>

                <div className="flex items-center gap-1 h-6">
                  {[...Array(6)].map((_, i) => (
                    <span
                      key={i}
                      className="w-1.5 bg-brand-primary rounded-full animate-bounce"
                      style={{
                        height: `${30 + Math.random() * 70}%`,
                        animationDuration: `${0.6 + i * 0.1}s`
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="mb-6 p-4 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center gap-4 shadow-xl">
            <button
              onClick={() => {
                setIsMuted(!isMuted);
                toast.success(isMuted ? "Microphone active" : "Microphone muted");
              }}
              className={`p-3.5 rounded-xl border border-zinc-800 flex items-center justify-center hover:scale-105 active:scale-95 transition-all cursor-pointer ${
                isMuted ? "bg-brand-danger text-zinc-950" : "bg-zinc-950 text-white"
              }`}
              title={isMuted ? "Unmute Mic" : "Mute Mic"}
            >
              {isMuted ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              )}
            </button>

            {activeCall.type === "video" && (
              <button
                onClick={() => {
                  setIsCameraOff(!isCameraOff);
                  toast.success(isCameraOff ? "Camera active" : "Camera turned off");
                }}
                className={`p-3.5 rounded-xl border border-zinc-800 flex items-center justify-center hover:scale-105 active:scale-95 transition-all cursor-pointer ${
                  isCameraOff ? "bg-brand-danger text-zinc-950" : "bg-zinc-950 text-white"
                }`}
                title={isCameraOff ? "Camera On" : "Camera Off"}
              >
                {isCameraOff ? <VideoOff size={20} /> : <Video size={20} />}
              </button>
            )}

            {activeCall.type === "video" && (
              <button
                onClick={() => {
                  setIsScreenSharing(!isScreenSharing);
                  toast.success(isScreenSharing ? "Screen sharing ended" : "Sharing screen stream");
                }}
                className={`p-3.5 rounded-xl border border-zinc-800 flex items-center justify-center hover:scale-105 active:scale-95 transition-all cursor-pointer ${
                  isScreenSharing ? "bg-brand-primary text-zinc-950" : "bg-zinc-950 text-white"
                }`}
                title={isScreenSharing ? "Stop Sharing" : "Share Screen"}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </button>
            )}

            <button
              onClick={() => {
                setActiveCall(null);
                setCallTimer(0);
                setIsScreenSharing(false);
                setIsCameraOff(false);
                setIsMuted(false);
                toast.error("Call connection terminated");
              }}
              className="p-3.5 rounded-xl bg-brand-danger border border-transparent text-zinc-950 flex items-center justify-center hover:scale-110 active:scale-95 transition-all font-bold cursor-pointer"
              title="Hang Up Call"
            >
              <svg className="w-5 h-5 rotate-[135deg]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M21 16.5c0 .38-.21.71-.53.88l-4.87 2.44c-.38.19-.84.1-1.12-.22l-2.07-2.07c-2.82-1.46-5.11-3.75-6.57-6.57l2.07-2.07c.28-.28.37-.74.22-1.12L5.68 3.53C5.51 3.21 5.18 3 4.8 3H3.5C2.67 3 2 3.67 2 4.5 2 13.61 9.39 21 18.5 21c.83 0 1.5-.67 1.5-1.5v-3c0-.38-.21-.71-.53-.88l-4.87-2.44c-.38-.19-.84-.1-1.12.22l-2.07 2.07c-2.82-1.46-5.11-3.75-6.57-6.57l2.07-2.07c.28-.28.37-.74.22-1.12L5.68 3.53c-.15-.31-.48-.53-.86-.53H3.5" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Incoming Call Ringing Dialog */}
      {incomingCall && (
        <div className="fixed bottom-6 right-6 w-80 bg-white dark:bg-zinc-900 p-5 shadow-[0_10px_35px_rgba(0,0,0,0.06)] z-50 flex flex-col gap-4 border border-zinc-150 dark:border-zinc-800 rounded-3xl animate-bounce">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[var(--color-brand-accent-pink-light)]/20 text-[var(--color-brand-accent-pink)] flex items-center justify-center animate-pulse">
              <Phone size={16} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-zinc-850 dark:text-zinc-200 tracking-wider">Incoming Call...</h4>
              <p className="text-[10px] text-gray-400 dark:text-zinc-500 font-semibold">
                {incomingCall.hostName} is calling you ({incomingCall.callType})
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="primary"
              className="flex-1 text-xs py-2"
              onClick={() => {
                setActiveCall({
                  id: incomingCall.id,
                  title: incomingCall.title,
                  type: incomingCall.callType,
                  status: "CONNECTED"
                });
                setCallTimer(0);
                setIncomingCall(null);
                toast.success("Call connected successfully!");
              }}
            >
              Accept
            </Button>
            <Button
              variant="outline"
              className="flex-grow-0 text-xs py-2 text-brand-primary"
              onClick={() => {
                setIncomingCall(null);
                toast.error("Call declined");
              }}
            >
              Decline
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;
