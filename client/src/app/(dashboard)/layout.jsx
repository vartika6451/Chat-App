"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sun, Moon } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import Sidebar from "../../components/Sidebar";
import Loader from "../../components/Loader";

export default function DashboardLayout({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [loading, isAuthenticated, router]);

  if (loading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center">
        <Loader size="lg" color="primary" />
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-brand-bg text-[#2E2A25] font-sans relative">
      {/* Theme Toggle Button */}
      <button
        onClick={toggleTheme}
        className="fixed top-5 right-6 z-40 p-2.5 rounded-xl bg-brand-surface border-2 border-brand-primary text-brand-primary hover:scale-105 active:scale-95 transition-all shadow-[2px_2px_0px_0px_var(--color-brand-primary)] cursor-pointer flex items-center justify-center"
        title="Toggle Theme"
      >
        {isDark ? <Sun size={15} /> : <Moon size={15} />}
      </button>

      {/* App Sidebar */}
      <Sidebar />

      {/* Primary view content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden retro-grid-bg">
        {children}
      </main>
    </div>
  );
}
