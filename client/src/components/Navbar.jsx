"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";
import { motion } from "framer-motion";
import Button from "./Button";

const Navbar = ({ showIntro = false }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "#home" },
    { name: "Features", href: "#features" },
    { name: "About", href: "#about" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? "py-4 glass-panel border-b border-white/5 shadow-lg shadow-black/20"
          : "py-6 bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center justify-start shrink-0 min-w-[130px] min-h-[56px]">
          {!showIntro && (
            <Link href="/" className="flex items-center gap-3 group select-none cursor-pointer">
              <motion.div
                layoutId="app-logo-wrapper"
                className="flex items-center gap-3"
              >
                <img
                  src="/logo.png?v=2"
                  alt="Blink Logo"
                  className="w-14 h-14 object-cover rounded-2xl border border-zinc-800/10 group-hover:scale-105 transition-transform duration-300"
                />
                <span className="font-logo text-[42px] font-medium text-brand-accent pt-2 leading-none">
                  Blink
                </span>
              </motion.div>
            </Link>
          )}
        </div>

        {/* Desktop Navigation */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: showIntro ? 0 : 1, y: showIntro ? -10 : 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="hidden md:flex items-center gap-8"
        >
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-gray-400 hover:text-white transition-colors duration-200"
            >
              {link.name}
            </a>
          ))}
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: showIntro ? 0 : 1, scale: showIntro ? 0.8 : 1 }}
          transition={{ duration: 0.5, delay: 0.4, type: "spring", stiffness: 100 }}
          className="hidden md:flex items-center gap-3"
        >
          <Button variant="ghost" size="sm" onClick={() => router.push("/login")}>
            Login
          </Button>
          <Button variant="primary" size="sm" onClick={() => router.push("/signup")}>
            Sign Up
          </Button>
        </motion.div>

        {/* Mobile menu button */}
        {!showIntro && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1 text-gray-400 hover:text-white transition-colors"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </motion.button>
        )}
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-panel border-b border-white/5 absolute top-full left-0 right-0 py-6 px-6 flex flex-col gap-6 shadow-xl animate-in slide-in-from-top-4 duration-200">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-medium text-gray-300 hover:text-white transition-colors py-1"
              >
                {link.name}
              </a>
            ))}
          </div>
          <div className="h-[1px] bg-zinc-800" />
          <div className="flex flex-col gap-3">
            <Button variant="outline" className="w-full" onClick={() => { setMobileMenuOpen(false); router.push("/login"); }}>
              Login
            </Button>
            <Button variant="primary" className="w-full" onClick={() => { setMobileMenuOpen(false); router.push("/signup"); }}>
              Sign Up
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
