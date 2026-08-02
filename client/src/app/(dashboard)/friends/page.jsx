"use client";

import React, { useState, useEffect } from "react";
import { UserPlus, Search, Check, X, MessageSquare, Loader2 } from "lucide-react";
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
    <div className="flex-1 p-6 overflow-y-auto max-w-5xl mx-auto w-full">
      <PageHeader
        title="Friends"
        description="Interact and manage your connections on Blink"
        actions={
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsAddModalOpen(true)}
            iconBefore={<UserPlus size={16} />}
          >
            Add Friend
          </Button>
        }
      />

      {/* Tabs Menu */}
      <div className="flex items-center gap-2 border-b border-zinc-800 pb-3 mb-6">
        {["all", "online", "requests"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
              activeTab === tab
                ? "bg-brand-primary/10 text-brand-primary border border-brand-primary/20"
                : "text-gray-400 hover:text-white"
            }`}
          >
            {tab === "requests" ? `Requests (${requests.length})` : tab}
          </button>
        ))}
      </div>

      {/* Search Input for Friends */}
      {activeTab !== "requests" && (
        <div className="relative mb-6 max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
          <input
            type="text"
            placeholder="Search friends..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-brand-surface border border-zinc-800 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-primary"
          />
        </div>
      )}

      {/* Friends list grids */}
      {activeTab === "requests" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {requests.length === 0 ? (
            <div className="col-span-full text-center py-10 text-xs text-gray-500">
              No pending friend requests.
            </div>
          ) : (
            requests.map((req) => (
              <Card key={req.id} variant="default" className="p-4 flex items-center justify-between border-zinc-850 bg-brand-surface/40">
                <div className="flex items-center gap-3">
                  <Avatar username={req.name} size="md" />
                  <div>
                    <h4 className="text-sm font-semibold text-white">{req.name}</h4>
                    <p className="text-xs text-gray-500">@{req.username} • {req.mutuals} mutual friends</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleAcceptRequest(req)}
                    className="p-2 rounded-lg bg-brand-primary/10 hover:bg-brand-primary text-brand-primary hover:text-white transition-colors cursor-pointer"
                  >
                    <Check size={16} />
                  </button>
                  <button
                    onClick={() => handleDeclineRequest(req.id)}
                    className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-gray-400 hover:text-brand-danger transition-colors cursor-pointer"
                  >
                    <X size={16} />
                  </button>
                </div>
              </Card>
            ))
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredFriends.length === 0 ? (
            <div className="col-span-full text-center py-10 text-xs text-gray-500">
              No friends found matching requirements.
            </div>
          ) : (
            filteredFriends.map((friend) => (
              <Card key={friend.id} variant="default" className="p-4 flex items-center justify-between border-zinc-850 hover:border-zinc-850 bg-brand-surface/40 transition-colors">
                <div className="flex items-center gap-3">
                  <Avatar username={friend.name} status={friend.status} size="md" />
                  <div>
                    <h4 className="text-sm font-semibold text-white">{friend.name}</h4>
                    <p className="text-xs text-gray-500">@{friend.username} • {friend.mutuals} mutuals</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push("/chat")}
                  className="p-2 min-w-0"
                >
                  <MessageSquare size={16} />
                </Button>
              </Card>
            ))
          )}
        </div>
      )}

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
          <p className="text-xs text-gray-400 leading-relaxed">
            Search by name or username to add friends and start chatting with other users on Blink.
          </p>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
            <input
              type="text"
              placeholder="Search by name or @username..."
              value={modalSearchQuery}
              onChange={(e) => setModalSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-brand-surface border border-zinc-800 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-primary"
            />
          </div>

          <div className="mt-2 space-y-2 max-h-[300px] overflow-y-auto">
            {modalSearching ? (
              <div className="flex items-center justify-center py-8 text-gray-500 gap-2">
                <Loader2 size={16} className="animate-spin text-brand-primary" />
                <span className="text-xs">Searching users...</span>
              </div>
            ) : modalSearchQuery.trim() === "" ? (
              <div className="text-center py-8 text-xs text-gray-600">
                Type a name to begin searching.
              </div>
            ) : modalSearchResults.length === 0 ? (
              <div className="text-center py-8 text-xs text-gray-600">
                No users found.
              </div>
            ) : (
              modalSearchResults.map((user) => {
                const isFriend = friends.some((f) => f.id === user.id || f.username.toLowerCase() === user.username.toLowerCase());
                return (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-zinc-900/30 border border-zinc-800/40 hover:border-zinc-800 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar username={user.name} src={user.profileImage} size="md" />
                      <div>
                        <h5 className="text-sm font-semibold text-white">{user.name}</h5>
                        <p className="text-xs text-gray-500">@{user.username}</p>
                      </div>
                    </div>
                    {isFriend ? (
                      <span className="text-[10px] uppercase font-semibold text-brand-primary tracking-wider bg-brand-primary/10 px-2.5 py-1 rounded-lg">
                        Friends
                      </span>
                    ) : (
                      <Button
                        variant="primary"
                        size="xs"
                        onClick={() => handleAddFriend(user)}
                        iconBefore={<UserPlus size={12} />}
                      >
                        Add
                      </Button>
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
