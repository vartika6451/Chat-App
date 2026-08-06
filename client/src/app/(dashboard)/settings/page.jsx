"use client";

import React, { useState } from "react";
import { Palette, Bell, Shield, LogOut, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { useAuth } from "../../../context/AuthContext";
import { useTheme } from "../../../context/ThemeContext";
import PageHeader from "../../../components/PageHeader";
import Button from "../../../components/Button";
import Card from "../../../components/Card";

const Settings = () => {
  const { logout } = useAuth();
  const { isDark: darkMode, toggleTheme, themeMode, setThemeMode, lockedTheme, lockTheme } = useTheme();
  const router = useRouter();

  // Settings State Mock
  const [notifications, setNotifications] = useState(true);
  const [readReceipts, setReadReceipts] = useState(true);
  const [profileSearchable, setProfileSearchable] = useState(true);
  const [chatTheme, setChatTheme] = useState("indigo");

  const handleSaveSettings = () => {
    toast.success("Settings saved successfully!", {
      style: { background: "#18181B", color: "#fff", border: "1px solid #27272A" },
    });
  };

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully.");
    router.push("/");
  };

  return (
    <div className="flex-1 p-6 overflow-y-auto max-w-4xl mx-auto w-full">
      <PageHeader
        title="Settings"
        description="Configure your client experience, visual theme, and privacy"
      />

      <div className="space-y-6">
        {/* Appearance Settings */}
        <Card variant="glass" className="p-6 space-y-4">
          <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-200 tracking-tight flex items-center gap-2">
            <Palette size={16} className="text-[var(--color-brand-accent-pink)]" />
            <span>Appearance & Theme</span>
          </h3>

          <div className="flex items-center justify-between text-xs py-3 border-b border-zinc-100 dark:border-zinc-800/80">
            <div>
              <h4 className="font-semibold text-zinc-800 dark:text-zinc-250">Force Dark Mode</h4>
              <p className="text-gray-400 dark:text-zinc-550 mt-0.5">Toggle default interface color palette</p>
            </div>
            <button
              onClick={toggleTheme}
              className={`w-10 h-6 rounded-full transition-all cursor-pointer relative ${
                darkMode ? "bg-[var(--color-brand-accent-pink)]" : "bg-zinc-200 dark:bg-zinc-800"
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${
                  darkMode ? "left-5" : "left-1"
                }`}
              />
            </button>
          </div>

          <div className="flex flex-col gap-1.5 pt-2">
            <label className="text-xs font-semibold text-zinc-500">Primary Color Override</label>
            <div className="flex gap-3 mt-1.5">
              {[
                { name: "indigo", bg: "bg-indigo-500" },
                { name: "violet", bg: "bg-violet-500" },
                { name: "rose", bg: "bg-rose-500" },
                { name: "emerald", bg: "bg-emerald-500" },
              ].map((c) => (
                <button
                  key={c.name}
                  onClick={() => setChatTheme(c.name)}
                  className={`w-8 h-8 rounded-full ${c.bg} flex items-center justify-center border-2 cursor-pointer transition-transform hover:scale-105 ${
                    chatTheme === c.name ? "border-white" : "border-transparent"
                  }`}
                  title={`${c.name} theme`}
                />
              ))}
            </div>
          </div>
        </Card>

        {/* AI Theme Engine Settings */}
        <Card variant="glass" className="p-6 space-y-4">
          <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-200 tracking-tight flex items-center gap-2">
            <Sparkles size={16} className="text-[var(--color-brand-accent-pink)]" />
            <span>AI Sentiment Themes</span>
          </h3>

          <div className="flex flex-col gap-4 text-xs">
            {/* Mode selection switches */}
            <div className="flex flex-col gap-2">
              <label className="font-semibold text-zinc-650 dark:text-zinc-400">Theme Engine Control Mode</label>
              <div className="flex flex-wrap gap-2.5 mt-1">
                {[
                  { mode: "auto", label: "Auto (AI Sentiment)" },
                  { mode: "manual", label: "Manual Theme Lock" },
                  { mode: "disabled", label: "Disable AI Themes" }
                ].map((item) => (
                  <button
                    key={item.mode}
                    onClick={() => setThemeMode(item.mode)}
                    className={`px-4 py-2 border rounded-xl font-bold cursor-pointer transition-all ${
                      themeMode === item.mode
                        ? "bg-[var(--color-brand-accent-pink-light)]/20 border-[var(--color-brand-accent-pink-light)] text-[var(--color-brand-accent-pink)] shadow-sm"
                        : "bg-white dark:bg-zinc-850 border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Locked theme selection dropdown - visible only in manual mode */}
            {themeMode === "manual" && (
              <div className="flex flex-col gap-1.5 pt-2 animate-fade-in">
                <label className="font-semibold text-zinc-650 dark:text-zinc-400">Select locked emotion theme</label>
                <select
                  value={lockedTheme}
                  onChange={(e) => lockTheme(e.target.value)}
                  className="w-full max-w-xs px-4 py-3 bg-zinc-50 dark:bg-zinc-850 border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 font-bold rounded-2xl focus:outline-none cursor-pointer"
                >
                  {[
                    { value: "friendly", label: "Friendly (Default Retro)" },
                    { value: "romantic", label: "Romantic ❤️" },
                    { value: "funny", label: "Funny 😂" },
                    { value: "angry", label: "Angry 😠" },
                    { value: "sad", label: "Sad 😢" },
                    { value: "excited", label: "Excited 🎉" },
                    { value: "calm", label: "Calm 🌿" },
                    { value: "motivational", label: "Motivational 🚀" },
                    { value: "celebration", label: "Celebration 🥳" },
                    { value: "professional", label: "Professional 💼" },
                    { value: "horror", label: "Horror 💀" },
                    { value: "fantasy", label: "Fantasy 🪄" }
                  ].map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </Card>

        {/* Notification Settings */}
        <Card variant="glass" className="p-6 space-y-4">
          <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-200 tracking-tight flex items-center gap-2">
            <Bell size={16} className="text-[var(--color-brand-accent-pink)]" />
            <span>Notifications</span>
          </h3>

          <div className="flex items-center justify-between text-xs py-2">
            <div>
              <h4 className="font-semibold text-zinc-800 dark:text-zinc-250">Desktop Push Notifications</h4>
              <p className="text-gray-400 dark:text-zinc-550 mt-0.5">Show notifications on incoming messages</p>
            </div>
            <button
              onClick={() => setNotifications(!notifications)}
              className={`w-10 h-6 rounded-full transition-all cursor-pointer relative ${
                notifications ? "bg-[var(--color-brand-accent-pink)]" : "bg-zinc-200 dark:bg-zinc-800"
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${
                  notifications ? "left-5" : "left-1"
                }`}
              />
            </button>
          </div>
        </Card>

        {/* Privacy Settings */}
        <Card variant="glass" className="p-6 space-y-4">
          <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-200 tracking-tight flex items-center gap-2">
            <Shield size={16} className="text-[var(--color-brand-accent-pink)]" />
            <span>Security & Privacy</span>
          </h3>

          <div className="flex items-center justify-between text-xs py-3 border-b border-zinc-100 dark:border-zinc-800/80">
            <div>
              <h4 className="font-semibold text-zinc-800 dark:text-zinc-250">Send Read Receipts</h4>
              <p className="text-gray-400 dark:text-zinc-550 mt-0.5">Let contacts see when you read messages</p>
            </div>
            <button
              onClick={() => setReadReceipts(!readReceipts)}
              className={`w-10 h-6 rounded-full transition-all cursor-pointer relative ${
                readReceipts ? "bg-[var(--color-brand-accent-pink)]" : "bg-zinc-200 dark:bg-zinc-800"
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${
                  readReceipts ? "left-5" : "left-1"
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between text-xs py-2">
            <div>
              <h4 className="font-semibold text-zinc-800 dark:text-zinc-250">Discoverable via email</h4>
              <p className="text-gray-400 dark:text-zinc-550 mt-0.5">Let users search for your profile by email</p>
            </div>
            <button
              onClick={() => setProfileSearchable(!profileSearchable)}
              className={`w-10 h-6 rounded-full transition-all cursor-pointer relative ${
                profileSearchable ? "bg-[var(--color-brand-accent-pink)]" : "bg-zinc-200 dark:bg-zinc-800"
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${
                  profileSearchable ? "left-5" : "left-1"
                }`}
              />
            </button>
          </div>
        </Card>

        {/* Save & Action Block */}
        <div className="flex gap-4 pt-2">
          <Button variant="primary" size="md" onClick={handleSaveSettings} className="px-8">
            Save Settings
          </Button>
          <Button variant="outline" size="md" onClick={handleLogout} className="px-8" iconBefore={<LogOut size={16} />}>
            Logout from Blink
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
