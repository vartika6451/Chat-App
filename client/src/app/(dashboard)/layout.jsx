"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import Sidebar from "../../components/Sidebar";
import Loader from "../../components/Loader";

export default function DashboardLayout({ children }) {
  const { isAuthenticated, loading } = useAuth();
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
    <div className="flex h-screen w-screen overflow-hidden bg-brand-bg text-white font-sans">
      {/* App Sidebar */}
      <Sidebar />

      {/* Primary view content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden bg-zinc-950/80">
        {children}
      </main>
    </div>
  );
}
