"use client";

import React, { useState } from "react";
import { Search, MessageSquare, Plus, Send, Phone, Video, Info } from "lucide-react";
import Avatar from "../../../components/Avatar";
import EmptyState from "../../../components/EmptyState";
import Button from "../../../components/Button";

const Chat = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeChat, setActiveChat] = useState(null);

  // Mock Conversations
  const mockChats = [
    {
      id: "chat-1",
      user: {
        name: "Leo Messi",
        username: "leomessi",
        avatar: "",
        status: "online",
      },
      lastMessage: "The card was perfect! Thanks Vartika.",
      time: "10:42 AM",
      unread: 2,
    },
    {
      id: "chat-2",
      user: {
        name: "Taylor Swift",
        username: "taylorswift",
        avatar: "",
        status: "away",
      },
      lastMessage: "Can we collaborate on the next card theme?",
      time: "Yesterday",
      unread: 0,
    },
    {
      id: "chat-3",
      user: {
        name: "Sam Altman",
        username: "samaltman",
        avatar: "",
        status: "offline",
      },
      lastMessage: "Thanks for the congratulations card!",
      time: "July 29",
      unread: 0,
    },
    {
      id: "chat-4",
      user: {
        name: "Elon Musk",
        username: "elonmusk",
        avatar: "",
        status: "online",
      },
      lastMessage: "Blink is going to Mars.",
      time: "July 28",
      unread: 0,
    },
  ];

  const filteredChats = mockChats.filter(
    (chat) =>
      chat.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 flex h-full overflow-hidden">
      {/* Middle Section: Chat List */}
      <div className="w-80 border-r border-zinc-800/80 flex flex-col h-full bg-zinc-950/40">
        {/* Search & Header */}
        <div className="p-4 border-b border-zinc-800/80 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-white tracking-tight">Messages</h1>
            <button
              onClick={() => {
                alert("Add conversation feature placeholder");
              }}
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
                  <span className="text-[10px] text-gray-600">{chat.time}</span>
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
              {/* Dummy chat alert */}
              <div className="max-w-md mx-auto bg-brand-primary/10 border border-brand-primary/20 rounded-xl p-4 text-center">
                <p className="text-xs text-brand-primary font-medium">
                  💡 Chat Transmission Feature Placeholder
                </p>
                <p className="text-[11px] text-gray-400 mt-1 leading-relaxed">
                  Real-time WebSocket event listeners, database models, and chat history
                  synchronization will be implemented in the next phase.
                </p>
                {/* TODO: Implement real-time websocket connection and state sync here */}
              </div>

              {/* Mock Chat bubble (Incoming) */}
              <div className="flex items-start gap-3 max-w-[80%]">
                <Avatar username={activeChat.user.name} size="sm" />
                <div className="flex flex-col items-start">
                  <div className="px-4 py-2.5 rounded-2xl bg-[#A2B0C4] text-sm text-white rounded-tl-sm">
                    {activeChat.lastMessage}
                  </div>
                  <span className="text-[9px] text-gray-600 mt-1 pl-1">
                    {activeChat.time}
                  </span>
                </div>
              </div>

              {/* Mock Chat bubble (Outgoing) */}
              <div className="flex items-start gap-3 max-w-[80%] self-end flex-row-reverse">
                <div className="flex flex-col items-end">
                  <div className="px-4 py-2.5 rounded-2xl bg-brand-primary text-sm text-white rounded-tr-sm shadow-md">
                    Got it! Talk to you soon.
                  </div>
                  <span className="text-[9px] text-gray-600 mt-1 pr-1">
                    10:44 AM
                  </span>
                </div>
              </div>
            </div>

            {/* Chat Input footer mockup */}
            <div className="p-4 border-t border-zinc-800/80 bg-brand-surface/10 flex items-center gap-3">
              <input
                disabled
                type="text"
                placeholder="Chat input is disabled (Placeholders only)"
                className="flex-1 px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-850 text-xs text-gray-500 cursor-not-allowed focus:outline-none"
              />
              <Button disabled variant="primary" className="py-2.5 px-4">
                <Send size={14} />
              </Button>
            </div>
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
                onClick={() => {
                  alert("Create group or conversation popup placeholder");
                }}
                iconBefore={<Plus size={14} />}
              >
                New Conversation
              </Button>
            }
          />
        )}
      </div>
    </div>
  );
};

export default Chat;
