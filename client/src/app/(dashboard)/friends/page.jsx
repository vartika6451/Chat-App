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
  );

  return (
    <div className="flex-1 p-6 overflow-y-auto max-w-5xl mx-auto w-full flex flex-col justify-center">
      {/* Outer Window Panel */}
      <div className="w-full flex flex-col h-full retro-window min-h-[600px]">
        {/* Window Title Bar */}
        <div className="px-4 py-2 bg-brand-accent border-b-3 border-[var(--color-brand-border)] flex items-center justify-between shrink-0 select-none">
          <div className="flex items-center gap-2">
            <Users size={14} className="text-[var(--color-brand-border)]" />
            <span className="font-retro text-[10px] font-black text-[var(--color-brand-border)] tracking-wider">FRIENDS_CLUB.EXE</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-danger border border-[var(--color-brand-border)]" />
            <span className="w-2.5 h-2.5 rounded-full bg-brand-accent border border-[var(--color-brand-border)]" />
            <span className="w-2.5 h-2.5 rounded-full bg-brand-success border border-[var(--color-brand-border)]" />
          </div>
        </div>

        {/* Inner Content Area */}
        <div className="flex-1 p-6 bg-white overflow-y-auto flex flex-col">
          {/* Header section in the window */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-2 border-zinc-200 pb-4 mb-6">
            <div>
              <h2 className="font-retro text-lg font-black text-[var(--color-brand-border)] tracking-wide">FRIENDS DIRECTORY</h2>
              <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase">Interact and manage your stickers club connections</p>
            </div>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2.5 bg-brand-primary-light border-3 border-[var(--color-brand-border)] rounded-xl text-[var(--color-brand-border)] font-retro text-xs font-black shadow-[3px_3px_0px_0px_var(--color-brand-border)] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_0px_var(--color-brand-border)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[0px_0px_0px_0px_var(--color-brand-border)] flex items-center gap-2 cursor-pointer w-fit"
            >
              <UserPlus size={14} strokeWidth={2.5} />
              <span>ADD NEW FRIEND</span>
            </button>
          </div>

          {/* Tabs Menu */}
          <div className="flex items-center gap-2 mb-6 select-none">
            {["all", "online", "requests"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-xl border-3 border-[var(--color-brand-border)] font-retro text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === tab
                    ? "bg-brand-primary-light text-[var(--color-brand-border)] shadow-[0px_0px_0px_0px_var(--color-brand-border)] translate-x-[2px] translate-y-[2px]"
                    : "bg-white text-zinc-500 shadow-[2.5px_2.5px_0px_0px_var(--color-brand-border)] hover:translate-y-[-1px] hover:shadow-[3.5px_3.5px_0px_0px_var(--color-brand-border)]"
                }`}
              >
                {tab === "requests" ? `Requests (${requests.length})` : tab}
              </button>
            ))}
          </div>

          {/* Search Input for Friends */}
          {activeTab !== "requests" && (
            <div className="relative mb-6 max-w-sm">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
              <input
                type="text"
                placeholder="Search friends..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-brand-bg border-2 border-[var(--color-brand-border)] text-xs text-zinc-800 placeholder-gray-400 focus:outline-none"
              />
            </div>
          )}

          {/* Friends list grids */}
          {activeTab === "requests" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {requests.length === 0 ? (
                <div className="col-span-full text-center py-12 text-xs text-gray-500 font-bold uppercase">
                  No pending friend requests.
                </div>
              ) : (
                requests.map((req) => (
                  <div
                    key={req.id}
                    className="p-3.5 bg-white border-3 border-[var(--color-brand-border)] shadow-[3px_3px_0px_0px_var(--color-brand-border)] rounded-2xl flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar username={req.name} size="md" className="border-2 border-[var(--color-brand-border)] rounded-full" />
                      <div>
                        <h4 className="font-retro text-xs font-black text-[var(--color-brand-border)] uppercase">{req.name}</h4>
                        <p className="text-[10px] text-gray-500 font-bold mt-0.5">@{req.username} • {req.mutuals} mutuals</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleAcceptRequest(req)}
                        className="p-2 rounded-xl bg-[#E6FCE8] border-2 border-[var(--color-brand-border)] shadow-[2px_2px_0px_0px_var(--color-brand-border)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[0px_0px_0px_0px_var(--color-brand-border)] text-[var(--color-brand-border)] flex items-center justify-center cursor-pointer"
                        title="Accept"
                      >
                        <Check size={14} strokeWidth={3} />
                      </button>
                      <button
                        onClick={() => handleDeclineRequest(req.id)}
                        className="p-2 rounded-xl bg-white border-2 border-[var(--color-brand-border)] shadow-[2px_2px_0px_0px_var(--color-brand-border)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[0px_0px_0px_0px_var(--color-brand-border)] text-gray-400 hover:text-brand-danger flex items-center justify-center cursor-pointer"
                        title="Decline"
                      >
                        <X size={14} strokeWidth={3} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredFriends.length === 0 ? (
                <div className="col-span-full text-center py-12 text-xs text-gray-500 font-bold uppercase">
                  No friends found matching requirements.
                </div>
              ) : (
                filteredFriends.map((friend) => (
                  <div
                    key={friend.id}
                    className="p-3.5 bg-white border-3 border-[var(--color-brand-border)] shadow-[3px_3px_0px_0px_var(--color-brand-border)] rounded-2xl flex items-center justify-between hover:translate-y-[-2px] hover:shadow-[5px_5px_0px_0px_var(--color-brand-border)] transition-all duration-150 group"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar
                        username={friend.name}
                        status={friend.status}
                        size="md"
                        className="border-2 border-[var(--color-brand-border)] rounded-full"
                      />
                      <div>
                        <h4 className="font-retro text-xs font-black text-[var(--color-brand-border)] uppercase">{friend.name}</h4>
                        <p className="text-[10px] text-gray-500 font-bold mt-0.5">@{friend.username} • {friend.mutuals} mutuals</p>
                      </div>
                    </div>
                    <button
                      onClick={() => router.push("/chat")}
                      className="p-2.5 rounded-xl bg-brand-primary-light border-2 border-[var(--color-brand-border)] text-[var(--color-brand-border)] flex items-center justify-center hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-[2px_2px_0px_0px_var(--color-brand-border)]"
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
          <p className="text-[10px] text-[#8E7A82] leading-relaxed font-bold uppercase">
            Search by name or username to add friends and start chatting with other users on Blink.
          </p>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
            <input
              type="text"
              placeholder="Search by name or @username..."
              value={modalSearchQuery}
              onChange={(e) => setModalSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-brand-bg border-2 border-[var(--color-brand-border)] text-xs text-zinc-800 focus:outline-none"
            />
          </div>

          <div className="mt-2 space-y-2.5 max-h-[300px] overflow-y-auto">
            {modalSearching ? (
              <div className="flex items-center justify-center py-8 text-gray-500 gap-2 font-bold text-xs uppercase">
                <Loader2 size={14} className="animate-spin text-[var(--color-brand-border)]" />
                <span>Searching stickers...</span>
              </div>
            ) : modalSearchQuery.trim() === "" ? (
              <div className="text-center py-8 text-[10px] text-gray-400 font-bold uppercase">
                Type a name to begin searching.
              </div>
            ) : modalSearchResults.length === 0 ? (
              <div className="text-center py-8 text-[10px] text-gray-400 font-bold uppercase">
                No users found.
              </div>
            ) : (
              modalSearchResults.map((user) => {
                const isFriend = friends.some((f) => f.id === user.id || f.username.toLowerCase() === user.username.toLowerCase());
                return (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-[#FFFBFD] border-2 border-[var(--color-brand-border)] hover:bg-brand-primary-light/40 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar username={user.name} src={user.profileImage} size="md" className="border border-[var(--color-brand-border)] rounded-full" />
                      <div>
                        <h5 className="font-retro text-xs font-black text-[var(--color-brand-border)] uppercase">{user.name}</h5>
                        <p className="text-[9px] text-gray-500 font-bold">@{user.username}</p>
                      </div>
                    </div>
                    {isFriend ? (
                      <span className="text-[9px] uppercase font-black text-[var(--color-brand-border)] tracking-wider bg-brand-primary-light border-2 border-[var(--color-brand-border)] px-2.5 py-1 rounded-lg">
                        Friends
                      </span>
                    ) : (
                      <button
                        onClick={() => handleAddFriend(user)}
                        className="px-3.5 py-1.5 bg-[#E6FCE8] border-2 border-[var(--color-brand-border)] text-[var(--color-brand-border)] font-retro text-[10px] font-black rounded-xl hover:scale-105 active:scale-95 shadow-[1.5px_1.5px_0px_0px_var(--color-brand-border)] active:translate-x-[1.5px] active:translate-y-[1.5px] active:shadow-[0px_0px_0px_0px_var(--color-brand-border)] cursor-pointer"
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
