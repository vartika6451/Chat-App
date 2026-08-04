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
    { name: "MAIL", path: "/chat", icon: <MessageSquare size={24} className="text-[#C85B7C]" /> },
    { name: "FILES", path: "/friends", icon: <Users size={24} className="text-[#C85B7C]" /> },
    { name: "STUDIO", path: "/cards", icon: <Sparkles size={24} className="text-[#C85B7C]" /> },
    { name: "SETTINGS", path: "/settings", icon: <Settings size={24} className="text-[#C85B7C]" /> },
  ];

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <aside className="w-28 h-screen bg-white border-r-3 border-[#C85B7C] flex flex-col justify-between shrink-0 select-none z-10">
      {/* Top Section - Brand Logo */}
      <div className="p-3 border-b-3 border-[#C85B7C] flex flex-col items-center justify-center bg-[#FFF1C5]">
        <Link href="/chat" className="flex flex-col items-center gap-1 cursor-pointer">
          <span className="font-retro text-lg font-black text-[#C85B7C] tracking-wide leading-none">
            BLINK
          </span>
          <span className="text-[9px] font-bold text-[#C85B7C]">v1.0.exe</span>
        </Link>
      </div>

      {/* Mid Section - Navigation Items (Sticker Style) */}
      <nav className="flex-1 py-4 flex flex-col items-center gap-6 overflow-y-auto bg-white/50">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.name}
              href={item.path}
              className="flex flex-col items-center gap-1 group cursor-pointer w-full px-2"
            >
              <div
                className={`w-16 h-16 rounded-2xl flex items-center justify-center border-3 border-[#C85B7C] transition-all duration-150 ${
                  isActive
                    ? "bg-[#FFE4EC] shadow-[0px_0px_0px_0px_#C85B7C] translate-x-[2px] translate-y-[2px]"
                    : "bg-white shadow-[3px_3px_0px_0px_#C85B7C] hover:translate-y-[-2px] hover:shadow-[5px_5px_0px_0px_#C85B7C]"
                }`}
              >
                {item.icon}
              </div>
              <span className="font-retro text-[10px] font-extrabold text-[#C85B7C] tracking-widest mt-1">
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section - Profile & Logout */}
      <div className="p-2 border-t-3 border-[#C85B7C] flex flex-col items-center gap-3 bg-[#E6FCE8]/80">
        {/* User Profile Preview */}
        <div
          onClick={() => router.push("/profile")}
          className="flex flex-col items-center gap-1.5 cursor-pointer p-1.5 w-full rounded-xl hover:bg-white/60 transition-colors"
        >
          <Avatar
            username={currentUser.name}
            src={currentUser.profileImage}
            status="online"
            size="sm"
            className="border-2 border-[#C85B7C] rounded-full"
          />
          <span className="font-retro text-[9px] font-bold text-[#C85B7C] truncate w-full text-center max-w-[80px]">
            {currentUser.name.split(" ")[0].toUpperCase()}
          </span>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-10 h-10 rounded-xl bg-white border-2 border-[#C85B7C] shadow-[2px_2px_0px_0px_#C85B7C] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[0px_0px_0px_0px_#C85B7C] flex items-center justify-center text-gray-500 hover:text-[#C85B7C] transition-all cursor-pointer"
          title="Logout"
        >
          <LogOut size={16} className="text-[#C85B7C]" />
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
