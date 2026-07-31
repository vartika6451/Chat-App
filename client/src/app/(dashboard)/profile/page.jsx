"use client";

import React, { useState } from "react";
import { User, Edit3, MessageSquare, Users, Sparkles, Save, X, Globe, ShieldAlert } from "lucide-react";
import { toast } from "react-hot-toast";
import { useAuth } from "../../../context/AuthContext";
import PageHeader from "../../../components/PageHeader";
import Avatar from "../../../components/Avatar";
import Button from "../../../components/Button";
import Card from "../../../components/Card";
import Input from "../../../components/Input";
import Modal from "../../../components/Modal";

const Profile = () => {
  const { user, updateUserProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user?.name || "");
  const [editUsername, setEditUsername] = useState(user?.username || "");
  const [editBio, setEditBio] = useState(user?.bio || "");
  const [loading, setLoading] = useState(false);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!editName.trim() || !editUsername.trim()) {
      toast.error("Name and username are required");
      return;
    }

    try {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 800)); // Simulate api call
      updateUserProfile({
        name: editName,
        username: editUsername,
        bio: editBio,
      });
      toast.success("Profile updated successfully!", {
        style: { background: "#18181B", color: "#fff", border: "1px solid #27272A" },
      });
      setIsEditing(false);
    } catch (err) {
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenEdit = () => {
    setEditName(user?.name || "");
    setEditUsername(user?.username || "");
    setEditBio(user?.bio || "");
    setIsEditing(true);
  };

  return (
    <div className="flex-1 p-6 overflow-y-auto max-w-4xl mx-auto w-full">
      <PageHeader
        title="Profile Dashboard"
        description="Manage your Blink public identity and metrics"
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={handleOpenEdit}
            iconBefore={<Edit3 size={15} />}
          >
            Edit Profile
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Main profile Identity Card */}
        <Card variant="glass" className="md:col-span-1 p-6 border-white/5 flex flex-col items-center text-center">
          <Avatar
            username={user?.name || "User"}
            size="xl"
            status="online"
            className="mb-4"
          />
          <h2 className="text-xl font-bold text-white tracking-tight">{user?.name || "Blink User"}</h2>
          <p className="text-sm text-brand-primary font-semibold mt-0.5">@{user?.username || "username"}</p>

          <p className="text-xs text-brand-text-secondary leading-relaxed mt-4 px-2">
            {user?.bio || "No bio specified yet. Click Edit Profile to add one!"}
          </p>

          <div className="h-[1px] bg-zinc-800 w-full my-6" />

          {/* Social details mockup */}
          <div className="w-full space-y-3 text-left">
            <div className="flex items-center gap-3 text-xs text-gray-400">
              <Globe size={14} className="text-gray-500" />
              <span>Location: San Francisco, CA</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-gray-400">
              <User size={14} className="text-gray-500" />
              <span>Member since: July 2026</span>
            </div>
          </div>
        </Card>

        {/* Stats and Achievements Panel */}
        <div className="md:col-span-2 space-y-6">
          <h3 className="text-lg font-bold text-white tracking-tight">Your Metrics</h3>

          {/* Stats grid */}
          <div className="grid grid-cols-3 gap-4">
            <Card variant="default" className="p-5 border-zinc-850 flex flex-col items-center justify-center text-center bg-brand-surface/40">
              <div className="w-10 h-10 rounded-xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-primary mb-3">
                <Users size={18} />
              </div>
              <span className="text-2xl font-extrabold text-white tracking-tight">
                {user?.stats?.friends ?? 42}
              </span>
              <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider mt-1">Friends</span>
            </Card>

            <Card variant="default" className="p-5 border-zinc-850 flex flex-col items-center justify-center text-center bg-brand-surface/40">
              <div className="w-10 h-10 rounded-xl bg-brand-accent/10 border border-brand-accent/20 flex items-center justify-center text-brand-accent mb-3">
                <Sparkles size={18} />
              </div>
              <span className="text-2xl font-extrabold text-white tracking-tight">
                {user?.stats?.cardsCreated ?? 12}
              </span>
              <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider mt-1">Cards Generated</span>
            </Card>

            <Card variant="default" className="p-5 border-zinc-850 flex flex-col items-center justify-center text-center bg-brand-surface/40">
              <div className="w-10 h-10 rounded-xl bg-brand-success/10 border border-brand-success/20 flex items-center justify-center text-brand-success mb-3">
                <MessageSquare size={18} />
              </div>
              <span className="text-2xl font-extrabold text-white tracking-tight">
                {user?.stats?.messages ?? 1337}
              </span>
              <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider mt-1">Total Messages</span>
            </Card>
          </div>

          {/* Dummy account activities section */}
          <h3 className="text-base font-bold text-white tracking-tight pt-2">Recent Activities</h3>
          <Card variant="default" className="p-6 border-zinc-850 space-y-4 bg-brand-surface/20">
            <div className="flex gap-4 items-start text-xs border-b border-zinc-800/40 pb-4">
              <div className="w-8 h-8 rounded-full bg-brand-accent/10 flex items-center justify-center text-brand-accent mt-0.5 shrink-0">
                <Sparkles size={14} />
              </div>
              <div>
                <p className="text-gray-300 font-medium">Generated the &quot;Cyberpunk Birthday&quot; template using AI</p>
                <span className="text-[10px] text-gray-500 mt-1 block">2 hours ago</span>
              </div>
            </div>
            <div className="flex gap-4 items-start text-xs border-b border-zinc-800/40 pb-4">
              <div className="w-8 h-8 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary mt-0.5 shrink-0">
                <User size={14} />
              </div>
              <div>
                <p className="text-gray-300 font-medium">Accepted friend request from Mark Zuckerberg</p>
                <span className="text-[10px] text-gray-500 mt-1 block">Yesterday</span>
              </div>
            </div>
            <div className="flex gap-4 items-start text-xs">
              <div className="w-8 h-8 rounded-full bg-zinc-900 flex items-center justify-center text-gray-400 mt-0.5 shrink-0">
                <ShieldAlert size={14} />
              </div>
              <div>
                <p className="text-gray-300 font-medium">Security settings audit completed</p>
                <span className="text-[10px] text-gray-500 mt-1 block">3 days ago</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <Modal isOpen={isEditing} onClose={() => setIsEditing(false)} title="Edit Public Identity" size="md">
        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <Input
            label="Full Name"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            placeholder="John Doe"
            required
            disabled={loading}
          />
          <Input
            label="Username"
            value={editUsername}
            onChange={(e) => setEditUsername(e.target.value)}
            placeholder="johndoe"
            required
            disabled={loading}
          />
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Bio</label>
            <textarea
              value={editBio}
              onChange={(e) => setEditBio(e.target.value)}
              placeholder="Tell us about yourself..."
              rows={3}
              disabled={loading}
              className="w-full px-4 py-3 rounded-xl bg-brand-surface border border-zinc-800 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition-all duration-200 resize-none disabled:opacity-50"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="submit"
              variant="primary"
              className="flex-1 py-3 text-sm"
              loading={loading}
              iconBefore={<Save size={16} />}
            >
              Save Changes
            </Button>
            <Button
              type="button"
              variant="outline"
              className="flex-1 py-3 text-sm"
              onClick={() => setIsEditing(false)}
              disabled={loading}
              iconBefore={<X size={15} />}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Profile;
