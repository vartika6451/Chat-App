"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { AlertCircle, ArrowLeft } from "lucide-react";
import Button from "../components/Button";

const NotFound = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-brand-bg text-[#2E2A25] flex flex-col justify-center items-center px-4 relative overflow-hidden">
      {/* Glow backgrounds */}
      <div className="absolute top-[30%] left-[30%] w-80 h-80 rounded-full bg-brand-danger/5 blur-[120px]" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md"
      >
        <div className="w-20 h-20 rounded-3xl bg-brand-danger/10 border border-brand-danger/20 flex items-center justify-center text-brand-danger mx-auto mb-8 shadow-lg shadow-brand-danger/15 animate-bounce">
          <AlertCircle size={36} />
        </div>

        <h1 className="text-8xl font-black tracking-tight text-[#2E2A25] mb-2 select-none">
          404
        </h1>
        <h2 className="text-xl font-bold text-[#2E2A25] mb-4">
          Lost in transmission
        </h2>
        <p className="text-sm text-brand-text-secondary leading-relaxed mb-8">
          The link you requested does not exist or has been removed from the Blink network. Check the path and try transmitting again.
        </p>

        <Button
          variant="primary"
          onClick={() => router.push("/")}
          className="mx-auto"
          iconBefore={<ArrowLeft size={16} />}
        >
          Back to Home
        </Button>
      </motion.div>
    </div>
  );
};

export default NotFound;
