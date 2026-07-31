"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Sparkles, Shield, Archive, ArrowRight, Code, Globe, Heart, Radio } from "lucide-react";
import Navbar from "../components/Navbar";
import Button from "../components/Button";
import Card from "../components/Card";

const Landing = () => {
  const router = useRouter();
  const [showIntro, setShowIntro] = useState(true);
  const [isWinking, setIsWinking] = useState(false);

  useEffect(() => {
    const winkTimer = setTimeout(() => {
      setIsWinking(true);
    }, 1100);

    const introTimer = setTimeout(() => {
      setShowIntro(false);
    }, 3100);

    return () => {
      clearTimeout(winkTimer);
      clearTimeout(introTimer);
    };
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } },
  };

  // Intro Floating Particles
  const particles = [
    { id: 1, type: "sparkle", top: "22%", left: "33%", size: 36, delay: 0.3, color: "text-brand-primary" },
    { id: 2, type: "heart", top: "28%", left: "62%", size: 30, delay: 0.5, color: "text-brand-danger" },
    { id: 3, type: "sparkle", top: "66%", left: "30%", size: 24, delay: 0.6, color: "text-brand-accent" },
    { id: 4, type: "sparkle", top: "62%", left: "66%", size: 40, delay: 0.4, color: "text-brand-primary" },
  ];

  const features = [
    {
      title: "Real-Time Messaging",
      description: "Chat seamlessly with low-latency sockets and instantly connect with friends in style.",
      icon: <MessageSquare className="text-brand-primary" size={24} />,
    },
    {
      title: "AI Greeting Cards",
      description: "Generate highly personalized, stunning greeting cards for any occasion in seconds.",
      icon: <Sparkles className="text-brand-accent" size={24} />,
    },
    {
      title: "Secure Conversations",
      description: "Your conversations are fully protected. Enjoy secure end-to-end messaging pipelines.",
      icon: <Shield className="text-brand-success" size={24} />,
    },
    {
      title: "Memory Vault",
      description: "Safekeep special memories, shared images, and custom cards in your persistent archive.",
      icon: <Archive className="text-brand-primary" size={24} />,
    },
  ];

  return (
    <div className="h-screen overflow-hidden bg-brand-bg text-white gradient-bg flex flex-col font-sans">
      <AnimatePresence>
        {showIntro && (
          <motion.div
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-brand-bg overflow-hidden"
          >
            {/* Pulsing Back Glow */}
            <motion.div
              className="absolute w-[450px] h-[450px] rounded-full bg-gradient-to-r from-brand-accent/20 via-pink-400/5 to-brand-primary/20 blur-3xl"
              animate={{
                scale: [1, 1.15, 1],
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            {/* Floating Particles */}
            {particles.map((p) => (
              <motion.div
                key={p.id}
                className={`absolute ${p.color}`}
                style={{ top: p.top, left: p.left }}
                initial={{ scale: 0, opacity: 0, y: 15 }}
                animate={{
                  scale: 1,
                  opacity: 0.85,
                  y: [0, -12, 0],
                  rotate: [0, 15, -15, 0]
                }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{
                  scale: { delay: p.delay, duration: 0.6, type: "spring", stiffness: 100 },
                  opacity: { delay: p.delay, duration: 0.6 },
                  y: { repeat: Infinity, duration: 3.5, ease: "easeInOut", delay: p.delay },
                  rotate: { repeat: Infinity, duration: 4.5, ease: "easeInOut", delay: p.delay }
                }}
              >
                {p.type === "sparkle" ? (
                  <Sparkles size={p.size} className="fill-brand-primary/10" />
                ) : (
                  <Heart size={p.size} className="fill-current" />
                )}
              </motion.div>
            ))}

            {/* Main Centered Logo Card */}
            <motion.div
              layoutId="app-logo-wrapper"
              className="flex flex-col items-center gap-6 select-none relative z-10"
            >
              <motion.div
                className="relative rounded-[40px] p-2 bg-brand-surface/40 backdrop-blur-md border border-white/5 shadow-2xl overflow-hidden"
                initial={{ scale: 0.3, opacity: 0, rotate: -5 }}
                animate={{
                  scale: [0.3, 1.08, 0.96, 1.02, 1],
                  opacity: 1,
                  rotate: 0
                }}
                transition={{
                  duration: 1.0,
                  ease: "easeOut"
                }}
              >
                {/* Stacked Images for Seamless Crossfade Wink */}
                <div className="relative w-52 h-52 overflow-hidden rounded-[32px]">
                  {/* Base Layer: Both Eyes Open (starts visible) */}
                  <img
                    src="/logo_open.png?v=3"
                    alt="Blink Logo Open"
                    className="absolute inset-0 w-full h-full object-cover select-none"
                  />
                  
                  {/* Overlay Layer: Winking (fades in to close the eye) */}
                  <motion.img
                    src="/logo.png?v=3"
                    alt="Blink Logo Wink"
                    className="absolute inset-0 w-full h-full object-cover select-none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isWinking ? 1 : 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                  />
                </div>
              </motion.div>

              <motion.span
                className="font-logo text-[72px] text-brand-accent mt-3 leading-none drop-shadow-sm"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
              >
                Blink
              </motion.span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Navbar showIntro={showIntro} />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: showIntro ? 0 : 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="flex-1 flex flex-col"
      >
      <section id="home" className="relative pt-32 pb-24 md:pt-40 md:pb-32 px-6 flex-1 flex flex-col justify-center overflow-hidden">
        {/* Glow Spheres */}
        <div className="absolute top-[20%] left-[10%] w-72 h-72 rounded-full bg-brand-primary/10 blur-[120px] animate-float" />
        <div className="absolute bottom-[20%] right-[10%] w-96 h-96 rounded-full bg-brand-accent/10 blur-[150px] animate-pulse-slow" />

        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          {/* Hero text */}
          <motion.div
            className="lg:col-span-7 flex flex-col items-start text-left"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.h1
              variants={itemVariants}
              className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6 text-white"
            >
              Chat. Create. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary via-indigo-400 to-brand-accent">
                Celebrate.
              </span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-lg md:text-xl text-brand-text-secondary leading-relaxed max-w-xl mb-10"
            >
              Blink is a modern messaging platform where conversations become memories. Express yourself in real-time, generate custom greeting cards, and celebrate key moments.
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-wrap gap-4 w-full sm:w-auto">
              <Button
                variant="primary"
                onClick={() => router.push("/signup")}
                className="w-full sm:w-auto text-sm py-3 px-6"
                iconAfter={<ArrowRight size={16} />}
              >
                Get Started
              </Button>
              <Button
                variant="glass"
                onClick={() => {
                  const element = document.getElementById("features");
                  element?.scrollIntoView({ behavior: "smooth" });
                }}
                className="w-full sm:w-auto text-sm py-3 px-6"
              >
                Learn More
              </Button>
            </motion.div>
          </motion.div>

          {/* Hero Illustration Placeholder */}
          <motion.div
            className="lg:col-span-5 flex justify-center"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="relative w-full max-w-[420px] aspect-square rounded-3xl glass-panel p-6 border border-white/10 shadow-2xl flex flex-col justify-between overflow-hidden">
              {/* Header inside dummy app screen */}
              <div className="flex items-center justify-between pb-4 border-b border-zinc-800/80">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-brand-danger/30" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/30" />
                  <div className="w-3 h-3 rounded-full bg-brand-success/30" />
                </div>
                <div className="px-2 py-0.5 rounded bg-zinc-800/50 text-[10px] text-gray-500">blink_channel</div>
              </div>

              {/* Chat simulation */}
              <div className="flex-1 py-6 flex flex-col gap-4 justify-end">
                <div className="flex flex-col items-start max-w-[80%]">
                  <div className="px-4 py-2.5 rounded-2xl bg-[#A2B0C4] text-xs text-white rounded-bl-sm">
                    Hey! Have you tried the AI Greeting Card generator on Blink yet?
                  </div>
                </div>
                <div className="flex flex-col items-end max-w-[80%] self-end">
                  <div className="px-4 py-2.5 rounded-2xl bg-brand-primary text-xs text-white rounded-br-sm shadow-md">
                    Yes! Made a retro cyberpunk card for Leo's birthday. It looks amazing! 🚀
                  </div>
                </div>
                <div className="flex flex-col items-start max-w-[80%]">
                  <div className="px-4 py-2.5 rounded-2xl bg-[#A2B0C4] text-xs text-white rounded-bl-sm flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#231A16]/50 animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#231A16]/50 animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#231A16]/50 animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>

              {/* Input section mockup */}
              <div className="pt-4 border-t border-zinc-800/80 flex gap-2">
                <div className="flex-1 h-9 rounded-xl bg-zinc-950 border border-zinc-850 px-3 flex items-center text-xs text-gray-600">
                  Type something...
                </div>
                <div className="w-9 h-9 rounded-xl bg-brand-primary flex items-center justify-center text-zinc-950">
                  <ArrowRight size={14} />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      </motion.div>
    </div>
  );
};

export default Landing;
