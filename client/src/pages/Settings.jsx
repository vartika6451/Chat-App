import React, { useState } from "react";
import { Settings as SettingsIcon, Bell, Eye, EyeOff, Shield, Palette, Moon, LogOut, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import PageHeader from "../components/PageHeader";
import Button from "../components/Button";
import Card from "../components/Card";

const Settings = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  // Settings State Mock
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [readReceipts, setReadReceipts] = useState(true);
  const [profileSearchable, setProfileSearchable] = useState(true);
  const [chatTheme, setChatTheme] = useState("indigo");

  const handleToggleDarkMode = () => {
    // UI Only
    toast.success("Blink is fully optimized for Dark Mode! Light theme is coming soon.", {
      style: { background: "#18181B", color: "#fff", border: "1px solid #27272A" },
      icon: "🌓",
    });
  };

  const handleSaveSettings = () => {
    toast.success("Settings saved successfully!", {
      style: { background: "#18181B", color: "#fff", border: "1px solid #27272A" },
    });
  };

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully.");
    navigate("/");
  };

  return (
    <div className="flex-1 p-6 overflow-y-auto max-w-4xl mx-auto w-full">
      <PageHeader
        title="Settings"
        description="Configure your client experience, visual theme, and privacy"
      />

      <div className="space-y-6">
        {/* Appearance Settings */}
        <Card variant="glass" className="p-6 border-white/5 space-y-4">
          <h3 className="text-sm font-bold text-white tracking-wider uppercase flex items-center gap-2">
            <Palette size={16} className="text-brand-primary" />
            <span>Appearance & Theme</span>
          </h3>

          <div className="flex items-center justify-between text-xs py-2 border-b border-zinc-800/40">
            <div>
              <h4 className="font-semibold text-gray-200">Force Dark Mode</h4>
              <p className="text-gray-500 mt-0.5">Toggle default interface color palette</p>
            </div>
            <button
              onClick={() => {
                setDarkMode(!darkMode);
                handleToggleDarkMode();
              }}
              className={`w-11 h-6 rounded-full transition-all cursor-pointer relative ${
                darkMode ? "bg-brand-primary" : "bg-zinc-800"
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${
                  darkMode ? "left-6" : "left-1"
                }`}
              />
            </button>
          </div>

          <div className="flex flex-col gap-1.5 pt-2">
            <label className="text-xs font-semibold text-gray-400">Primary Color Override</label>
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

        {/* Notification Settings */}
        <Card variant="glass" className="p-6 border-white/5 space-y-4">
          <h3 className="text-sm font-bold text-white tracking-wider uppercase flex items-center gap-2">
            <Bell size={16} className="text-brand-accent" />
            <span>Notifications</span>
          </h3>

          <div className="flex items-center justify-between text-xs py-2">
            <div>
              <h4 className="font-semibold text-gray-200">Desktop Push Notifications</h4>
              <p className="text-gray-500 mt-0.5">Show notifications on incoming messages</p>
            </div>
            <button
              onClick={() => setNotifications(!notifications)}
              className={`w-11 h-6 rounded-full transition-all cursor-pointer relative ${
                notifications ? "bg-brand-primary" : "bg-zinc-800"
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${
                  notifications ? "left-6" : "left-1"
                }`}
              />
            </button>
          </div>
        </Card>

        {/* Privacy Settings */}
        <Card variant="glass" className="p-6 border-white/5 space-y-4">
          <h3 className="text-sm font-bold text-white tracking-wider uppercase flex items-center gap-2">
            <Shield size={16} className="text-brand-success" />
            <span>Security & Privacy</span>
          </h3>

          <div className="flex items-center justify-between text-xs py-2 border-b border-zinc-800/40">
            <div>
              <h4 className="font-semibold text-gray-200">Send Read Receipts</h4>
              <p className="text-gray-500 mt-0.5">Let contacts see when you read messages</p>
            </div>
            <button
              onClick={() => setReadReceipts(!readReceipts)}
              className={`w-11 h-6 rounded-full transition-all cursor-pointer relative ${
                readReceipts ? "bg-brand-primary" : "bg-zinc-800"
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${
                  readReceipts ? "left-6" : "left-1"
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between text-xs py-2">
            <div>
              <h4 className="font-semibold text-gray-200">Discoverable via email</h4>
              <p className="text-gray-500 mt-0.5">Let users search for your profile by email</p>
            </div>
            <button
              onClick={() => setProfileSearchable(!profileSearchable)}
              className={`w-11 h-6 rounded-full transition-all cursor-pointer relative ${
                profileSearchable ? "bg-brand-primary" : "bg-zinc-800"
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${
                  profileSearchable ? "left-6" : "left-1"
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
          <Button variant="danger" size="md" onClick={handleLogout} className="px-8" iconBefore={<LogOut size={16} />}>
            Logout from Blink
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
