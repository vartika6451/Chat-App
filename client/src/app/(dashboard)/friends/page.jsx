"use client";

import React, { useState, useEffect } from "react";
import { UserPlus, Search, Check, X, MessageSquare, Loader2, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import PageHeader from "../../../components/PageHeader";
import Avatar from "../../../components/Avatar";
import Button from "../../../components/Button";
import Card from "../../../components/Card";
import Modal from "../../../components/Modal";
import api from "../../../utils/api";
import { toast } from "react-hot-toast";

const Friends = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  // Mock Friends data
  const defaultFriends = [
    { id: "fr-1", name: "Leo Messi", username: "leomessi", status: "online", mutuals: 15 },
    { id: "fr-2", name: "Taylor Swift", username: "taylorswift", status: "away", mutuals: 8 },
    { id: "fr-3", name: "Sam Altman", username: "samaltman", status: "offline", mutuals: 3 },
    { id: "fr-4", name: "Elon Musk", username: "elonmusk", status: "online", mutuals: 12 },
    { id: "fr-5", name: "Ariana Grande", username: "arianagrande", status: "online", mutuals: 2 },
    { id: "fr-6", name: "Zendaya", username: "zendaya", status: "offline", mutuals: 1 },
  ];

  // Mock Incoming Requests
  const defaultRequests = [
    { id: "req-1", name: "Bill Gates", username: "billgates", avatar: "", mutuals: 5 },
    { id: "req-2", name: "Mark Zuckerberg", username: "zuck", avatar: "", mutuals: 21 },
  ];

  // State-backed lists
  const [friends, setFriends] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("blink_friends_list");
      return saved ? JSON.parse(saved) : defaultFriends;
    }
    return defaultFriends;
  });

  const [requests, setRequests] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("blink_friend_requests");
      return saved ? JSON.parse(saved) : defaultRequests;
    }
    return defaultRequests;
  });

  // Sync to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("blink_friends_list", JSON.stringify(friends));
    }
  }, [friends]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("blink_friend_requests", JSON.stringify(requests));
    }
  }, [requests]);

  // Add Friend Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [modalSearchQuery, setModalSearchQuery] = useState("");
  const [modalSearchResults, setModalSearchResults] = useState([]);
  const [modalSearching, setModalSearching] = useState(false);

  // Search users inside Modal
  useEffect(() => {
    if (!modalSearchQuery.trim()) {
      setModalSearchResults([]);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      setModalSearching(true);
      try {
        const res = await api.get(`/users/search?q=${modalSearchQuery}`);
        if (res.data.success) {
          setModalSearchResults(res.data.users);
        }
      } catch (err) {
        console.error("❌ [CLIENT] Modal user search error:", err);
      } finally {
        setModalSearching(false);
      }
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [modalSearchQuery]);

  const handleAddFriend = (userToAdd) => {
    // Check if already in friends list
    const isAlreadyFriend = friends.some(
      (f) => f.id === userToAdd.id || f.username.toLowerCase() === userToAdd.username.toLowerCase()
    );

    if (isAlreadyFriend) {
      toast.error("User is already in your friends list!");
      return;
    }

    setFriends((prev) => [
      ...prev,
      {
        id: userToAdd.id,
        name: userToAdd.name,
        username: userToAdd.username,
        status: "online", // Always show new friends/bots online initially
        mutuals: 0,
        profileImage: userToAdd.profileImage || "",
      }
    ]);

    toast.success(`Added ${userToAdd.name} to your friends!`);
  };

  const handleAcceptRequest = (req) => {
    setRequests((prev) => prev.filter((r) => r.id !== req.id));
    setFriends((prev) => [
      ...prev,
      {
        id: req.id,
        name: req.name,
        username: req.username,
        status: "online",
        mutuals: req.mutuals || 0,
      }
    ]);
    toast.success(`Accepted friend request from ${req.name}!`);
  };

  const handleDeclineRequest = (id) => {
    setRequests((prev) => prev.filter((r) => r.id !== id));
    toast.success("Declined friend request");
  };

  const filteredFriends = friends.filter(
    (friend) =>
      (friend.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        friend.username.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (activeTab === "all" ||
        (activeTab === "online" && friend.status === "online") ||
        (activeTab === "offline" && friend.status === "offline"))
  );  return (
    <div className="flex-1 p-6 overflow-y-auto max-w-5xl mx-auto w-full flex flex-col justify-center">
      {/* Outer Window Panel */}
      <div className="w-full flex flex-col h-full bg-white dark:bg-zinc-900/60 backdrop-blur-md rounded-[24px] border border-zinc-150 dark:border-zinc-800/60 shadow-[0_4px_20px_rgba(0,0,0,0.015)] overflow-hidden min-h-[600px]">
        {/* Inner Content Area */}
        <div className="flex-1 p-8 overflow-y-auto flex flex-col">
          {/* Header section in the window */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800/80 pb-5 mb-6">
            <div>
              <h2 className="text-xl font-bold text-zinc-800 dark:text-zinc-150 tracking-tight">Friends Directory</h2>
              <p className="text-xs text-gray-400 dark:text-zinc-550 font-semibold mt-1">Interact and manage your sticker club connections</p>
            </div>
            <Button
              onClick={() => setIsAddModalOpen(true)}
              variant="primary"
              size="sm"
              iconBefore={<UserPlus size={14} />}
            >
              Add New Friend
            </Button>
          </div>

          {/* Tabs Menu */}
          <div className="flex items-center gap-2 mb-6 select-none">
            {["all", "online", "requests"].map((tab) => {
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-2xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                    isActive
                      ? "bg-[var(--color-brand-accent-pink-light)]/30 text-[var(--color-brand-accent-pink)] border border-[var(--color-brand-accent-pink-light)]/20 shadow-sm"
                      : "bg-transparent text-zinc-400 hover:text-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800/40 border border-transparent"
                  }`}
                >
                  {tab === "requests" ? `Requests (${requests.length})` : tab}
                </button>
              );
            })}
          </div>

          {/* Search Input for Friends */}
          {activeTab !== "requests" && (
            <div className="relative mb-6 max-w-sm">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
              <input
                type="text"
                placeholder="Search friends..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-150 dark:border-zinc-800/60 text-xs text-zinc-800 dark:text-zinc-100 placeholder-gray-400 focus:outline-none focus:border-[var(--color-brand-accent-pink)] transition-all duration-200"
              />
            </div>
          )}

          {/* Friends list grids */}
          {activeTab === "requests" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {requests.length === 0 ? (
                <div className="col-span-full text-center py-12 text-xs text-gray-400 font-bold uppercase">
                  No pending friend requests.
                </div>
              ) : (
                requests.map((req) => (
                  <div
                    key={req.id}
                    className="p-4 bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800/80 rounded-[20px] shadow-[0_2px_12px_rgba(0,0,0,0.01)] hover:shadow-md hover:scale-[1.01] transition-all duration-300 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar username={req.name} size="md" className="rounded-full" />
                      <div>
                        <h4 className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">{req.name}</h4>
                        <p className="text-[10px] text-gray-400 mt-0.5">@{req.username} • {req.mutuals} mutuals</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleAcceptRequest(req)}
                        className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-450 border border-emerald-100 dark:border-emerald-900/60 flex items-center justify-center cursor-pointer transition-all hover:scale-105 active:scale-95"
                        title="Accept"
                      >
                        <Check size={14} strokeWidth={2.5} />
                      </button>
                      <button
                        onClick={() => handleDeclineRequest(req.id)}
                        className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 dark:bg-rose-950/20 dark:text-rose-450 border border-rose-100 dark:border-rose-900/60 flex items-center justify-center cursor-pointer transition-all hover:scale-105 active:scale-95"
                        title="Decline"
                      >
                        <X size={14} strokeWidth={2.5} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredFriends.length === 0 ? (
                <div className="col-span-full text-center py-12 text-xs text-gray-400 font-bold uppercase">
                  No friends found matching requirements.
                </div>
              ) : (
                filteredFriends.map((friend) => (
                  <div
                    key={friend.id}
                    className="p-4 bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800/80 rounded-[20px] shadow-[0_2px_12px_rgba(0,0,0,0.01)] hover:shadow-md hover:scale-[1.01] transition-all duration-300 flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar
                        username={friend.name}
                        status={friend.status}
                        size="md"
                        className="rounded-full"
                      />
                      <div>
                        <h4 className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">{friend.name}</h4>
                        <p className="text-[10px] text-gray-400 mt-0.5">@{friend.username} • {friend.mutuals} mutuals</p>
                      </div>
                    </div>
                    <button
                      onClick={() => router.push("/chat")}
                      className="p-2.5 rounded-xl bg-[var(--color-brand-accent-pink-light)]/20 hover:bg-[var(--color-brand-accent-pink-light)]/40 text-[var(--color-brand-accent-pink)] border border-[var(--color-brand-accent-pink-light)]/10 flex items-center justify-center hover:scale-105 active:scale-95 transition-all cursor-pointer"
                    >
                      <MessageSquare size={14} strokeWidth={2.5} />
                    </button>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Add Friend Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setModalSearchQuery("");
          setModalSearchResults([]);
        }}
        title="Add Friend"
        size="md"
      >
        <div className="flex flex-col gap-4">
          <p className="text-[11px] text-gray-400 leading-relaxed font-semibold">
            Search by name or username to add friends and start chatting with other users on Blink.
          </p>

          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
            <input
              type="text"
              placeholder="Search by name or @username..."
              value={modalSearchQuery}
              onChange={(e) => setModalSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-150 dark:border-zinc-800/60 text-xs text-zinc-800 dark:text-zinc-100 focus:outline-none focus:border-[var(--color-brand-accent-pink)] transition-all duration-200"
            />
          </div>

          <div className="mt-2 space-y-2.5 max-h-[300px] overflow-y-auto">
            {modalSearching ? (
              <div className="flex items-center justify-center py-8 text-gray-400 gap-2 font-semibold text-xs">
                <Loader2 size={14} className="animate-spin text-[var(--color-brand-accent-pink)]" />
                <span>Searching directory...</span>
              </div>
            ) : modalSearchQuery.trim() === "" ? (
              <div className="text-center py-8 text-[11px] text-gray-400 font-semibold">
                Type a name to begin searching.
              </div>
            ) : modalSearchResults.length === 0 ? (
              <div className="text-center py-8 text-[11px] text-gray-400 font-semibold">
                No users found.
              </div>
            ) : (
              modalSearchResults.map((user) => {
                const isFriend = friends.some((f) => f.id === user.id || f.username.toLowerCase() === user.username.toLowerCase());
                return (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-3.5 bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-150 dark:border-zinc-800/60 rounded-2xl hover:bg-zinc-100/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar username={user.name} src={user.profileImage} size="md" className="rounded-full" />
                      <div>
                        <h5 className="text-xs font-semibold text-zinc-850 dark:text-zinc-200">{user.name}</h5>
                        <p className="text-[9px] text-gray-400">@{user.username}</p>
                      </div>
                    </div>
                    {isFriend ? (
                      <span className="text-[10px] font-bold text-[var(--color-brand-accent-pink)] bg-[var(--color-brand-accent-pink-light)]/20 border border-[var(--color-brand-accent-pink-light)]/20 px-3 py-1 rounded-xl">
                        Friends
                      </span>
                    ) : (
                      <button
                        onClick={() => handleAddFriend(user)}
                        className="px-3.5 py-1.5 bg-[var(--color-brand-accent-pink-light)]/20 hover:bg-[var(--color-brand-accent-pink-light)]/40 text-[var(--color-brand-accent-pink)] border border-[var(--color-brand-accent-pink-light)]/10 font-bold text-[10px] rounded-xl hover:scale-105 active:scale-95 transition-all cursor-pointer"
                      >
                        ADD
                      </button>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Friends;


