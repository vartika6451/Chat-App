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
  const [logoSrc, setLogoSrc] = useState("/logo_open.png");

  useEffect(() => {
    const winkTimer = setTimeout(() => {
      setLogoSrc("/logo.png");
    }, 1000);

    const introTimer = setTimeout(() => {
      setShowIntro(false);
    }, 2500);

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
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-brand-bg"
          >
            <motion.div
              layoutId="app-logo-wrapper"
              className="flex flex-col items-center gap-6 select-none"
            >
              <motion.img
                src={logoSrc}
                alt="Blink Logo"
                className="w-48 h-48 object-cover rounded-[36px] border border-zinc-800/10 shadow-2xl"
                initial={{ scale: 0.3, opacity: 0 }}
                animate={{
                  scale: [0.3, 1.1, 1],
                  opacity: 1,
                }}
                transition={{
                  duration: 0.8,
                  ease: "easeInOut"
                }}
              />
              <motion.span
                className="font-logo text-6xl text-brand-accent mt-2 leading-none"
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

      {/* Features Section */}
      <section id="features" className="py-24 bg-zinc-950/40 relative z-10 px-6 border-t border-zinc-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-4">
              Designed for the Next Era
            </h2>
            <p className="text-sm text-brand-text-secondary leading-relaxed">
              Blink pairs fluid web messaging interfaces with generative AI pipelines to elevate your standard social feed into creative memory channels.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Card variant="glass" hoverEffect className="p-6 h-full flex flex-col items-start glass-panel-hover">
                  <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800/50 mb-5">
                    {feature.icon}
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-xs text-brand-text-secondary leading-relaxed">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="bg-zinc-950 border-t border-zinc-900 py-16 px-6 relative z-10 mt-auto">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Column 1 - Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center">
                <Radio className="text-brand-primary" size={14} />
              </div>
              <span className="font-bold text-white text-base">Blink.</span>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed mb-6">
              A modern messaging platform where conversations become memories.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-gray-500 hover:text-white transition-colors"><Globe size={16} /></a>
              <a href="#" className="text-gray-500 hover:text-white transition-colors"><Code size={16} /></a>
              <a href="#" className="text-gray-500 hover:text-white transition-colors"><Heart size={16} /></a>
            </div>
          </div>

          {/* Column 2 - Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-4">Product</h4>
            <ul className="space-y-2.5">
              <li><a href="#features" className="text-xs text-gray-500 hover:text-white transition-colors">Features</a></li>
              <li><a href="#" className="text-xs text-gray-500 hover:text-white transition-colors">Integrations</a></li>
              <li><a href="#" className="text-xs text-gray-500 hover:text-white transition-colors">Roadmap</a></li>
            </ul>
          </div>

          {/* Column 3 - Resources */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-4">Company</h4>
            <ul className="space-y-2.5">
              <li><a href="#" className="text-xs text-gray-500 hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="text-xs text-gray-500 hover:text-white transition-colors">Careers</a></li>
              <li><a href="#" className="text-xs text-gray-500 hover:text-white transition-colors">Privacy Policy</a></li>
            </ul>
          </div>

          {/* Column 4 - Newsletter */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-4">Stay Tuned</h4>
            <p className="text-xs text-gray-500 mb-4 leading-relaxed">Subscribe to stay updated with newest designs.</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter email"
                className="w-full bg-brand-surface border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-primary placeholder-gray-600"
              />
              <Button variant="primary" size="sm" className="px-3.5">
                Join
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-600">&copy; {new Date().getFullYear()} Blink. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="text-xs text-gray-600 hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="text-xs text-gray-600 hover:text-white transition-colors">Privacy Settings</a>
          </div>
        </div>
      </footer>
      </motion.div>
    </div>
  );
};

export default Landing;
