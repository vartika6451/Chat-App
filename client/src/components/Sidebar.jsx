"use client";

import React from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { MessageSquare, Users, Sparkles, Settings, LogOut, FileText, Save, Trash } from "lucide-react";
import Avatar from "./Avatar";
import { useAuth } from "../context/AuthContext";

const Sidebar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const currentUser = user || {
    name: "User",
    username: "user",
    email: "",
    profileImage: "",
  };

  const navItems = [
    { name: "CHAT", path: "/chat", icon: <MessageSquare size={24} className="text-[var(--color-brand-border)]" /> },
    { name: "CONNECT", path: "/friends", icon: <Users size={24} className="text-[var(--color-brand-border)]" /> },
    { name: "STUDIO", path: "/cards", icon: <Sparkles size={24} className="text-[var(--color-brand-border)]" /> },
    { name: "SETTINGS", path: "/settings", icon: <Settings size={24} className="text-[var(--color-brand-border)]" /> },
  ];

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <aside className="w-20 h-[calc(100vh-2rem)] bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800/60 m-4 rounded-[24px] shadow-[0_10px_35px_rgba(0,0,0,0.03)] flex flex-col justify-between shrink-0 select-none z-10">
      {/* Top Section - Brand Logo */}
      <div className="p-4 flex flex-col items-center justify-center pt-6">
        <Link href="/chat" className="flex flex-col items-center cursor-pointer">
          <span className="font-logo text-xl font-bold tracking-tight text-[var(--color-brand-accent-pink)]">
            Blink
          </span>
        </Link>
      </div>

      {/* Mid Section - Navigation Items (Sticker Style) */}
      <nav className="flex-1 py-4 flex flex-col items-center gap-5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.name}
              href={item.path}
              className="flex flex-col items-center justify-center w-full px-2"
            >
              <div
                className={`w-13 h-13 rounded-2xl flex items-center justify-center transition-all duration-300 relative cursor-pointer group ${
                  isActive
                    ? "bg-[var(--color-brand-accent-pink-light)]/40 text-[var(--color-brand-accent-pink)] shadow-[0_0_15px_rgba(238,147,179,0.1)] scale-105"
                    : "text-zinc-400 hover:text-zinc-600 hover:bg-zinc-50 dark:hover:bg-zinc-800/40 hover:scale-[1.02]"
                }`}
              >
                {isActive && (
                  <span className="absolute left-0 w-0.75 h-5 rounded-r-full bg-[var(--color-brand-accent-pink)]" />
                )}
                {React.cloneElement(item.icon, {
                  className: `transition-all duration-300 ${
                    isActive
                      ? "text-[var(--color-brand-accent-pink)] scale-105"
                      : "text-zinc-400 dark:text-zinc-500 group-hover:scale-110"
                  }`,
                })}
              </div>
              <span className={`text-[8.5px] font-bold tracking-wider mt-1.5 transition-all duration-300 uppercase ${
                isActive ? "text-[var(--color-brand-accent-pink)]" : "text-zinc-400 dark:text-zinc-500"
              }`}>
                {item.name.toLowerCase()}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section - Profile & Logout */}
      <div className="p-3 pb-5 flex flex-col items-center gap-3.5">
        {/* User Profile Preview */}
        <div
          onClick={() => router.push("/profile")}
          className="flex flex-col items-center justify-center cursor-pointer p-0.5 w-full rounded-2xl hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-all duration-300"
        >
          <Avatar
            username={currentUser.name}
            src={currentUser.profileImage}
            status="online"
            size="sm"
            className="border border-zinc-100 dark:border-zinc-800 rounded-full shadow-sm"
          />
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-10 h-10 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 hover:border-rose-100 transition-all duration-300 cursor-pointer"
          title="Logout"
        >
          <LogOut size={15} />
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
