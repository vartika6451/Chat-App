import React, { useState } from "react";
import { Users, UserPlus, Search, Check, X, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import Avatar from "../components/Avatar";
import Button from "../components/Button";
import Card from "../components/Card";

const Friends = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  // Mock Friends data
  const mockFriends = [
    { id: "fr-1", name: "Leo Messi", username: "leomessi", status: "online", mutuals: 15 },
    { id: "fr-2", name: "Taylor Swift", username: "taylorswift", status: "away", mutuals: 8 },
    { id: "fr-3", name: "Sam Altman", username: "samaltman", status: "offline", mutuals: 3 },
    { id: "fr-4", name: "Elon Musk", username: "elonmusk", status: "online", mutuals: 12 },
    { id: "fr-5", name: "Ariana Grande", username: "arianagrande", status: "online", mutuals: 2 },
    { id: "fr-6", name: "Zendaya", username: "zendaya", status: "offline", mutuals: 1 },
  ];

  // Mock Incoming Requests
  const mockRequests = [
    { id: "req-1", name: "Bill Gates", username: "billgates", avatar: "", mutuals: 5 },
    { id: "req-2", name: "Mark Zuckerberg", username: "zuck", avatar: "", mutuals: 21 },
  ];

  const handleAcceptRequest = (id) => {
    alert(`Accepted friend request from ID: ${id}`);
  };

  const handleDeclineRequest = (id) => {
    alert(`Declined friend request from ID: ${id}`);
  };

  const filteredFriends = mockFriends.filter(
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
            onClick={() => alert("Add friend modal placeholder")}
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
            {tab === "requests" ? `Requests (${mockRequests.length})` : tab}
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
          {mockRequests.length === 0 ? (
            <div className="col-span-full text-center py-10 text-xs text-gray-500">
              No pending friend requests.
            </div>
          ) : (
            mockRequests.map((req) => (
              <Card key={req.id} variant="default" className="p-4 flex items-center justify-between border-zinc-850">
                <div className="flex items-center gap-3">
                  <Avatar username={req.name} size="md" />
                  <div>
                    <h4 className="text-sm font-semibold text-white">{req.name}</h4>
                    <p className="text-xs text-gray-500">@{req.username} • {req.mutuals} mutual friends</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleAcceptRequest(req.id)}
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
              <Card key={friend.id} variant="default" className="p-4 flex items-center justify-between border-zinc-850 hover:border-zinc-800 transition-colors">
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
                  onClick={() => navigate("/chat")}
                  className="p-2 min-w-0"
                >
                  <MessageSquare size={16} />
                </Button>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Friends;
