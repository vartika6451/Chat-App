import React from "react";
import Sidebar from "../components/Sidebar";

const AppLayout = ({ children }) => {
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
};

export default AppLayout;
