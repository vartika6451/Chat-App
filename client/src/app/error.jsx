"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { AlertTriangle, RefreshCw, ArrowLeft } from "lucide-react";
import Button from "../components/Button";

const Error = ({ error, reset }) => {
  const router = useRouter();

  useEffect(() => {
    // Log the error to the console
    console.error("🚨 [App Error Boundary]:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-brand-bg text-[#2E2A25] flex flex-col justify-center items-center px-4 relative overflow-hidden">
      {/* Glow backgrounds */}
      <div className="absolute top-[30%] left-[30%] w-80 h-80 rounded-full bg-brand-danger/5 blur-[120px]" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md relative z-10"
      >
        <div className="w-20 h-20 rounded-3xl bg-brand-danger/10 border border-brand-danger/20 flex items-center justify-center text-brand-danger mx-auto mb-8 shadow-lg shadow-brand-danger/15 animate-pulse">
          <AlertTriangle size={36} />
        </div>

        <h1 className="text-6xl font-black tracking-tight text-[#2E2A25] mb-2 select-none">
          Oops!
        </h1>
        <h2 className="text-xl font-bold text-[#2E2A25] mb-4">
          Transmission disrupted
        </h2>
        <p className="text-sm text-brand-text-secondary leading-relaxed mb-6">
          An unexpected error occurred in the Blink system. We've logged the problem and are looking into it.
        </p>

        {error && error.message && (
          <div className="mb-8 p-3 rounded-xl bg-zinc-900/50 border border-zinc-800 text-left text-xs font-mono text-zinc-400 max-h-24 overflow-y-auto">
            <span className="text-brand-danger font-semibold">Error:</span> {error.message}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
          <Button
            variant="primary"
            onClick={() => reset()}
            iconBefore={<RefreshCw size={16} />}
          >
            Try Again
          </Button>
          <Button
            variant="secondary"
            onClick={() => router.push("/")}
            iconBefore={<ArrowLeft size={16} />}
          >
            Back to Home
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default Error;
