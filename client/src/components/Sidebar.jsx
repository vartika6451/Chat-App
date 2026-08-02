"use client";

import React from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { MessageSquare, Users, Sparkles, Settings, LogOut, Radio, User } from "lucide-react";
import Avatar from "./Avatar";

const Sidebar = () => {
  const router = useRouter();
  const pathname = usePathname();

  // Mock User
  const user = {
    username: "Vartika Sharma",
    email: "vartika@blink.app",
    avatar: "",
    status: "online",
  };

  const navItems = [
    { name: "Chats", path: "/chat", icon: <MessageSquare size={20} /> },
    { name: "Friends", path: "/friends", icon: <Users size={20} /> },
    { name: "Greeting Studio", path: "/cards", icon: <Sparkles size={20} /> },
    { name: "Profile", path: "/profile", icon: <User size={20} /> },
    { name: "Settings", path: "/settings", icon: <Settings size={20} /> },
  ];

  const handleLogout = () => {
    // TODO: Connect auth service logout logic here
    router.push("/");
  };

  return (
    <aside className="w-64 h-screen bg-brand-surface border-r border-zinc-800 flex flex-col justify-between shrink-0">
      {/* Top Section - Brand Logo */}
      <div className="p-6 border-b border-zinc-800/80">
        <Link href="/chat" className="flex items-center gap-3 group select-none cursor-pointer">
          <img
            src="/logo.png?v=4"
            alt="Blink Logo"
            className="w-14 h-14 object-cover rounded-2xl border border-zinc-800/10 group-hover:scale-105 transition-transform duration-300"
          />
          <span className="font-logo text-[42px] font-medium text-brand-accent pt-2 leading-none">
            Blink
          </span>
        </Link>
      </div>

      {/* Mid Section - Navigation Items */}
      <nav className="flex-1 py-6 px-4 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.name}
              href={item.path}
              className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 select-none group cursor-pointer ${
                isActive
                  ? "bg-brand-accent/10 text-brand-accent border-l-2 border-brand-accent pl-3.5"
                  : "text-gray-400 hover:text-white hover:bg-zinc-900/50"
              }`}
            >
              <span className="transition-transform group-hover:scale-105 duration-200">
                {item.icon}
              </span>
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section - Profile & Logout */}
      <div className="p-4 border-t border-zinc-800/80 flex flex-col gap-2.5 bg-zinc-900/20">
        {/* User Profile Preview */}
        <div
          onClick={() => router.push("/profile")}
          className="flex items-center gap-3 p-2 rounded-xl hover:bg-zinc-800/50 cursor-pointer transition-colors"
        >
          <Avatar
            username={user.username}
            status={user.status}
            size="md"
          />
          <div className="overflow-hidden">
            <h4 className="text-sm font-semibold text-white truncate">
              {user.username}
            </h4>
            <p className="text-xs text-gray-500 truncate">{user.email}</p>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-400 hover:text-brand-danger hover:bg-brand-danger/5 rounded-xl transition-all duration-200 cursor-pointer"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
