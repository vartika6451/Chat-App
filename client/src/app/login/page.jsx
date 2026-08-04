/* eslint-disable */
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, Lock, Radio } from "lucide-react";
import { toast } from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import Button from "../../components/Button";
import Input from "../../components/Input";
import Card from "../../components/Card";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { login, signup } = useAuth();
  const router = useRouter();

  const validateForm = () => {
    const newErrors = {};
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Invalid email format";
    }
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      await login(email, password);
      toast.success("Welcome back to Blink!", {
        style: {
          background: "#18181B",
          color: "#fff",
          border: "1px solid #27272A",
        },
      });
      router.push("/chat");
    } catch (err) {
      toast.error("Failed to login. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    toast.success("Redirecting to Google Auth...", {
      style: {
        background: "#18181B",
        color: "#fff",
        border: "1px solid #27272A",
      },
    });
    setTimeout(async () => {
      try {
        await login("google-user@gmail.com", "google-oauth-pwd");
        router.push("/chat");
      } catch (err) {
        try {
          await signup("Google User", "google_user", "google-user@gmail.com", "google-oauth-pwd");
          router.push("/chat");
        } catch (signupErr) {
          toast.error("Failed to sign in with Google");
        }
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-brand-bg text-[#2E2A25] flex flex-col justify-center items-center px-4 relative overflow-hidden">
      {/* Floating Gradients */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-brand-primary/10 rounded-full blur-[120px]" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-brand-accent/10 rounded-full blur-[120px]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Brand logo header */}
        <div className="flex flex-col items-center mb-8">
          <Link href="/" className="flex items-center gap-2 group mb-2">
            <div className="w-10 h-10 rounded-xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center">
              <Radio className="text-brand-primary" size={20} />
            </div>
            <span className="text-2xl font-bold tracking-tight text-[#2E2A25]">
              Blink<span className="text-brand-primary">.</span>
            </span>
          </Link>
          <p className="text-sm text-brand-text-secondary">
            Sign in to access your messaging feed
          </p>
        </div>

        {/* Auth Card */}
        <Card variant="glass" className="p-8 shadow-2xl relative border-white/5 backdrop-blur-xl bg-brand-surface/70">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Input */}
            <Input
              label="Email Address"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              icon={<Mail size={18} />}
              required
            />

            {/* Password Input */}
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              icon={<Lock size={18} />}
              required
            />

            {/* Extras Option Block */}
            <div className="flex items-center justify-between text-xs mt-1">
              <label className="flex items-center gap-2 text-gray-400 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-zinc-800 bg-zinc-950 text-brand-primary focus:ring-brand-primary/20"
                />
                Remember me
              </label>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  toast.success("Forgot password link placeholder clicked!", {
                    style: { background: "#18181B", color: "#fff", border: "1px solid #27272A" },
                  });
                }}
                className="text-brand-primary hover:text-indigo-400 transition-colors font-medium"
              >
                Forgot password?
              </a>
            </div>

            {/* Login CTA */}
            <Button
              type="submit"
              variant="primary"
              className="w-full py-3"
              loading={loading}
            >
              Sign In
            </Button>
          </form>

          {/* Social Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-800" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-brand-surface px-3 text-gray-500 font-semibold tracking-wider">
                Or Continue With
              </span>
            </div>
          </div>

          {/* Google SSO mockup */}
          <Button
            type="button"
            variant="outline"
            className="w-full py-3"
            onClick={handleGoogleLogin}
            iconBefore={
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
              </svg>
            }
          >
            Google
          </Button>

          {/* Form Switcher */}
          <p className="text-center text-xs text-gray-500 mt-6">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="text-brand-primary hover:text-indigo-400 font-semibold transition-colors"
            >
              Sign up for free
            </Link>
          </p>
        </Card>
      </motion.div>
    </div>
  );
};

export default Login;
