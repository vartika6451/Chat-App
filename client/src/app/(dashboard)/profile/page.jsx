"use client";

import React, { useState, useEffect } from "react";
import { User, Edit3, MessageSquare, Users, Sparkles, Save, X, Globe, ShieldAlert } from "lucide-react";
import { toast } from "react-hot-toast";
import { useAuth } from "../../../context/AuthContext";
import PageHeader from "../../../components/PageHeader";
import Avatar from "../../../components/Avatar";
import Button from "../../../components/Button";
import Card from "../../../components/Card";
import Input from "../../../components/Input";
import Modal from "../../../components/Modal";
import api from "../../../utils/api";

const Profile = () => {
  const { user, updateUserProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user?.name || "");
  const [editUsername, setEditUsername] = useState(user?.username || "");
  const [editBio, setEditBio] = useState(user?.bio || "");
  const [editProfileImage, setEditProfileImage] = useState(user?.profileImage || "");
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [activities, setActivities] = useState([]);
  const [cardsCount, setCardsCount] = useState(0);

  useEffect(() => {
    const loadProfileData = async () => {
      try {
        const profileRes = await api.get(`/users/profile/${user?.id}`);
        if (profileRes.data.success) {
          setProfileData(profileRes.data.user);
        }
      } catch (err) {
        console.error("Failed to load user profile metrics:", err);
      }

      try {
        const activitiesRes = await api.get("/users/activities");
        if (activitiesRes.data.success) {
          setActivities(activitiesRes.data.activities);
        }
      } catch (err) {
        console.error("Failed to load user activity logs:", err);
      }
    };

    if (user?.id) {
      loadProfileData();
    }

    if (typeof window !== "undefined") {
      const savedCards = JSON.parse(localStorage.getItem("blink_generated_cards") || "[]");
      setCardsCount(savedCards.length);
    }
  }, [user]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image must be smaller than 2MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!editName.trim() || !editUsername.trim()) {
      toast.error("Name and username are required");
      return;
    }

    try {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 800)); // Simulate api call
      await updateUserProfile({
        name: editName,
        username: editUsername,
        bio: editBio,
        profileImage: editProfileImage,
      });
      setProfileData(prev => prev ? { ...prev, name: editName, username: editUsername, bio: editBio, avatar: editProfileImage } : null);
      toast.success("Profile updated successfully!", {
        style: { background: "#18181B", color: "#fff", border: "1px solid #27272A" },
      });
      setIsEditing(false);
    } catch (err) {
      toast.error(err.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenEdit = () => {
    setEditName(user?.name || "");
    setEditUsername(user?.username || "");
    setEditBio(user?.bio || "");
    setEditProfileImage(user?.profileImage || "");
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
        <Card variant="glass" className="md:col-span-1 p-6 flex flex-col items-center text-center">
          <Avatar
            src={user?.profileImage}
            username={user?.name || "User"}
            size="xl"
            status="online"
            className="mb-4"
          />
          <h2 className="text-xl font-bold text-zinc-800 dark:text-zinc-100 tracking-tight">{user?.name || "Blink User"}</h2>
          <p className="text-sm text-[var(--color-brand-accent-pink)] font-semibold mt-0.5">@{user?.username || "username"}</p>

          <p className="text-xs text-zinc-500 leading-relaxed mt-4 px-2">
            {user?.bio || "No bio specified yet. Click Edit Profile to add one!"}
          </p>

          <div className="h-[1px] bg-zinc-100 dark:bg-zinc-800 w-full my-6" />

          {/* Social details mockup */}
          <div className="w-full space-y-3 text-left">
            <div className="flex items-center gap-3 text-xs text-gray-400 dark:text-zinc-500">
              <Globe size={14} className="text-gray-400 dark:text-zinc-500" />
              <span>Location: San Francisco, CA</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-gray-400 dark:text-zinc-500">
              <User size={14} className="text-gray-400 dark:text-zinc-500" />
              <span>Member since: July 2026</span>
            </div>
          </div>
        </Card>

        {/* Stats and Achievements Panel */}
        <div className="md:col-span-2 space-y-6">
          <h3 className="text-base font-bold text-zinc-800 dark:text-zinc-200 tracking-tight">Your Metrics</h3>

          {/* Stats grid */}
          <div className="grid grid-cols-3 gap-4">
             <Card variant="default" className="p-5 flex flex-col items-center justify-center text-center bg-white dark:bg-zinc-900 shadow-sm hover:shadow-md hover:scale-[1.01] transition-all duration-300">
              <div className="w-10 h-10 rounded-full bg-[var(--color-brand-accent-pink-light)]/20 flex items-center justify-center text-[var(--color-brand-accent-pink)] mb-3">
                <Users size={18} />
              </div>
              <span className="text-2xl font-bold text-zinc-800 dark:text-zinc-100 tracking-tight">
                {profileData?.stats?.friends ?? 0}
              </span>
              <span className="text-[9px] uppercase font-bold text-gray-400 tracking-wider mt-1">Friends</span>
            </Card>

            <Card variant="default" className="p-5 flex flex-col items-center justify-center text-center bg-white dark:bg-zinc-900 shadow-sm hover:shadow-md hover:scale-[1.01] transition-all duration-300">
              <div className="w-10 h-10 rounded-full bg-[var(--color-brand-accent-pink-light)]/20 flex items-center justify-center text-[var(--color-brand-accent-pink)] mb-3">
                <Sparkles size={18} />
              </div>
              <span className="text-2xl font-bold text-zinc-800 dark:text-zinc-100 tracking-tight">
                {cardsCount}
              </span>
              <span className="text-[9px] uppercase font-bold text-gray-400 tracking-wider mt-1">Cards Generated</span>
            </Card>

            <Card variant="default" className="p-5 flex flex-col items-center justify-center text-center bg-white dark:bg-zinc-900 shadow-sm hover:shadow-md hover:scale-[1.01] transition-all duration-300">
              <div className="w-10 h-10 rounded-full bg-[var(--color-brand-accent-pink-light)]/20 flex items-center justify-center text-[var(--color-brand-accent-pink)] mb-3">
                <MessageSquare size={18} />
              </div>
              <span className="text-2xl font-bold text-zinc-800 dark:text-zinc-100 tracking-tight">
                {profileData?.stats?.messages ?? 0}
              </span>
              <span className="text-[9px] uppercase font-bold text-gray-400 tracking-wider mt-1">Total Messages</span>
            </Card>
          </div>

          {/* Dynamic account activities section */}
          <h3 className="text-base font-bold text-zinc-800 dark:text-zinc-200 tracking-tight pt-2">Recent Activities</h3>
          <Card variant="default" className="p-6 space-y-4">
            {activities.length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-4">No recent activities found.</p>
            ) : (
              activities.map((act) => {
                const getIcon = (type) => {
                  switch (type) {
                    case "signup": return <User size={14} />;
                    case "conversation": return <Users size={14} />;
                    case "message": return <MessageSquare size={14} />;
                    default: return <Sparkles size={14} />;
                  }
                };

                const formatTime = (ts) => {
                  const diffMs = Date.now() - new Date(ts).getTime();
                  const diffMins = Math.floor(diffMs / 60000);
                  const diffHours = Math.floor(diffMins / 60);
                  const diffDays = Math.floor(diffHours / 24);

                  if (diffMins < 1) return "Just now";
                  if (diffMins < 60) return `${diffMins}m ago`;
                  if (diffHours < 24) return `${diffHours}h ago`;
                  return `${diffDays}d ago`;
                };

                return (
                  <div key={act.id} className="flex gap-4 items-start text-xs border-b border-zinc-100 dark:border-zinc-800/80 pb-4 last:border-b-0 last:pb-0">
                    <div className="w-8 h-8 rounded-full bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 mt-0.5 shrink-0">
                      {getIcon(act.type)}
                    </div>
                    <div>
                      <p className="text-zinc-700 dark:text-zinc-300 font-medium">{act.title}</p>
                      <p className="text-[10px] text-gray-400 dark:text-zinc-500 mt-0.5">{act.description}</p>
                      <span className="text-[9px] text-gray-400 dark:text-zinc-550 mt-1 block">{formatTime(act.timestamp)}</span>
                    </div>
                  </div>
                );
              })
            )}
          </Card>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <Modal isOpen={isEditing} onClose={() => setIsEditing(false)} title="Edit Public Identity" size="md">
        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div className="flex flex-col items-center gap-2 pb-4">
            <label className="text-xs font-semibold text-zinc-500">Profile Picture</label>
            <div className="relative group cursor-pointer" onClick={() => document.getElementById("avatar-file-input").click()}>
              <Avatar src={editProfileImage} username={editName} size="xl" className="border-4 border-[var(--color-brand-accent-pink-light)]/20 rounded-full" />
              <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <Edit3 size={20} className="text-white" />
              </div>
            </div>
            <input
              id="avatar-file-input"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              disabled={loading}
            />
            <span className="text-[10px] text-gray-400">Click to upload custom image (max 2MB)</span>
          </div>

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
            <label className="text-xs font-semibold text-zinc-500 ml-1">Bio</label>
            <textarea
              value={editBio}
              onChange={(e) => setEditBio(e.target.value)}
              placeholder="Tell us about yourself..."
              rows={3}
              disabled={loading}
              className="w-full px-4 py-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-150 dark:border-zinc-800/60 text-sm text-zinc-800 dark:text-zinc-100 placeholder-gray-400 focus:outline-none focus:border-[var(--color-brand-accent-pink)] focus:ring-2 focus:ring-[var(--color-brand-accent-pink)]/10 transition-all duration-200 resize-none disabled:opacity-50"
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
