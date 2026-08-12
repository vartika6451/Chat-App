"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Landing = () => {
  const router = useRouter();
  const [animateState, setAnimateState] = useState("loading"); // "loading" | "fade-in-girl" | "headline-reveal" | "final-reveal"

  const canvasRef = useRef(null);
  const spotlightRef = useRef(null);
  const stageRef = useRef(null);
  const wrapRef = useRef(null);

  useEffect(() => {
    // 1. Particle Canvas Wave Animation
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const mouse = { x: null, y: null };

    class Particle {
      constructor() {
        this.reset();
      }
      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 80 + 40;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
        this.alpha = Math.random() * 0.2 + 0.05;
        this.color = Math.random() > 0.5 ? "255, 233, 240" : "216, 199, 239"; // soft white or lav
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;

        // Interactive mouse repellent force
        if (mouse.x !== null && mouse.y !== null) {
          const dx = this.x - mouse.x;
          const dy = this.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 220) {
            const force = ((220 - dist) / 220) * 0.65;
            this.x += (dx / (dist || 1)) * force;
            this.y += (dy / (dist || 1)) * force;
          }
        }

        if (
          this.x < -this.size ||
          this.x > width + this.size ||
          this.y < -this.size ||
          this.y > height + this.size
        ) {
          this.reset();
        }
      }
      draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        const grad = ctx.createRadialGradient(
          this.x,
          this.y,
          0,
          this.x,
          this.y,
          this.size
        );
        grad.addColorStop(0, `rgba(${this.color}, 1)`);
        grad.addColorStop(1, `rgba(${this.color}, 0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    const particles = Array.from({ length: 12 }, () => new Particle());

    let animationId;
    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach((p) => {
        p.update();
        p.draw();
      });
      animationId = requestAnimationFrame(animate);
    };
    animate();

    // 2. Parallax and Mouse Spotlight Rotation
    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      const xPct = e.clientX / window.innerWidth - 0.5;
      const yPct = e.clientY / window.innerHeight - 0.5;

      if (spotlightRef.current) {
        spotlightRef.current.style.transform = `translate(${xPct * 40}px, ${yPct * 40}px)`;
      }
      if (wrapRef.current) {
        wrapRef.current.style.transform = `rotateY(${xPct * 15}deg) rotateX(${-yPct * 15}deg) scale(1.02)`;
      }
    };
    window.addEventListener("mousemove", handleMouseMove);

    // 3. Sparkles Generation
    const colors = ["#fff", "var(--color-brand-primary-light)", "var(--color-brand-accent)", "var(--color-brand-primary)"];
    const sparklesInterval = setInterval(() => {
      if (!stageRef.current) return;
      const sparkle = document.createElement("div");
      sparkle.className = "sparkle";
      sparkle.style.left = Math.random() * 80 + 10 + "%";
      sparkle.style.top = Math.random() * 80 + 10 + "%";

      const size = Math.random() * 8 + 6;
      sparkle.innerHTML = `
        <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="${
        colors[Math.floor(Math.random() * colors.length)]
      }">
          <path d="M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4Z"/>
        </svg>
      `;

      stageRef.current.appendChild(sparkle);

      sparkle.style.transition = "opacity 0.6s ease, transform 0.6s ease";
      setTimeout(() => {
        sparkle.style.opacity = "1";
        sparkle.style.transform = "scale(1.2) rotate(15deg)";
      }, 50);

      setTimeout(() => {
        sparkle.style.opacity = "0";
        sparkle.style.transform = "scale(0.5) rotate(45deg)";
      }, 1000);

      setTimeout(() => {
        sparkle.remove();
      }, 1600);
    }, 350);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      clearInterval(sparklesInterval);
      cancelAnimationFrame(animationId);
    };
  }, []);

  // Timeline entry sequences
  useEffect(() => {
    const timer1 = setTimeout(() => {
      setAnimateState("fade-in-girl");
    }, 600);

    const timer2 = setTimeout(() => {
      setAnimateState("headline-reveal");
    }, 1200);

    const timer3 = setTimeout(() => {
      setAnimateState("final-reveal");
    }, 1800);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  const headlineLines = ["expression.", "emotion.", "connection."];
  const isLineVisible = animateState === "headline-reveal" || animateState === "final-reveal";
  const isFinalVisible = animateState === "final-reveal";

  return (
    <div className="relative min-h-screen text-white overflow-x-hidden font-sans select-none">
      {/* 1. Loader screen overlay */}
      <div
        className={`fixed inset-0 z-50 bg-gradient-to-b from-[#fbf9f6] to-[#e6dfd8] flex items-center justify-center transition-all duration-800 ease-in-out ${
          animateState !== "loading" ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
        <div className="w-10 h-10 rounded-full border border-[rgba(154,139,128,.25)] border-t-[var(--color-brand-primary)] animate-spin" />
      </div>

      {/* 2. Visual background layers */}
      <div className="bg-base">
        <div ref={spotlightRef} className="spotlight" />
      </div>
      <div className="rays" />
      <canvas ref={canvasRef} id="ambient" className="fixed inset-0 z-1 pointer-events-none" />
      <div className="vignette" />
      <div className="grain" />

      {/* 3. Header Navigation */}
      <header
        className="relative z-10 flex items-center justify-between px-6 py-8 md:px-16"
        style={{
          opacity: animateState !== "loading" ? 1 : 0,
          transition: "opacity 1s ease",
        }}
      >
        <div className="logo font-logo font-extrabold text-[22px] tracking-wide flex items-center gap-2.5 text-white">
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#ffffff"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ filter: "drop-shadow(0px 1px 2px rgba(0, 0, 0, 0.2))" }}
          >
            {/* Cute Cat Head Silhouette */}
            <path d="M3 12c0-3 1-6.5 3-8l3.5 3c1.5-.6 3.5-.6 5 0L18 4c2 1.5 3 5 3 8 0 5-4 9-9 9s-9-4-9-9z" />
            {/* Inner Ears (Pink accent matching the UI) */}
            <path d="M6 7.5L8 9.5" stroke="#ee93b3" strokeWidth="1.5" />
            <path d="M18 7.5L16 9.5" stroke="#ee93b3" strokeWidth="1.5" />
            {/* Winking Left Eye */}
            <path d="M7.5 12c.5 1.2 1.5 1.2 2 0" strokeWidth="2.2" />
            {/* Open Right Eye */}
            <circle cx="15.5" cy="11.5" r="1.8" fill="#ffffff" stroke="none" />
            {/* Cute Neko Mouth */}
            <path d="M12 14v1c-.3.4-.7.4-1 0M12 15c.3.4.7.4 1 0" strokeWidth="1.5" />
            {/* Whiskers */}
            <path d="M4 14.5H1M3.5 16.5L1 17M20 14.5h3M20.5 16.5l2.5.5" strokeWidth="1.5" />
          </svg>
          <span style={{
            fontFamily: "'Great Vibes', cursive",
            fontSize: "42px",
            fontWeight: "normal",
            textTransform: "none",
            lineHeight: 1,
            paddingBottom: "2px",
            color: "#ffffff",
            filter: "drop-shadow(0px 1px 2px rgba(0, 0, 0, 0.2)) drop-shadow(0px 0px 4px rgba(238, 147, 179, 0.4))",
            display: "inline-block"
          }}>Blink</span>
        </div>
      </header>

      {/* 4. Main content */}
      <main className="relative z-10">
        <section className="min-h-screen flex flex-col items-center justify-center text-center px-6 pt-12 pb-24 relative">
          {/* Girl Stage */}
          <div ref={stageRef} className="girl-stage">
            <div
              className="girl-glow"
              style={{
                opacity: animateState !== "loading" ? 1 : 0,
                transform: animateState !== "loading" ? "scale(1)" : "scale(.7)",
              }}
            />
            <div
              ref={wrapRef}
              className="girl-wrap"
              style={{
                opacity: animateState !== "loading" ? 1 : 0,
                transform:
                  animateState !== "loading"
                    ? "translateY(0) rotate(0deg) scale(1)"
                    : "translateY(-620px) rotate(-7deg) scale(.94)",
              }}
            >
              {/* True 3D depth-layered mascot illustration */}
              <img
                src="/hero-mascot.png"
                alt="Vibing cozy cat mascot"
                className="w-full h-full object-contain"
                style={{ transform: "translateZ(20px)" }}
              />

              {/* 3D claymorphic speech bubble in front */}
              <div
                className="absolute -top-4 -right-12 clay-3d bg-[var(--color-brand-accent)] px-3.5 py-2 rounded-2xl flex items-center gap-2 select-none z-20 animate-drift-slow"
                style={{ transform: "translateZ(60px)" }}
              >
                <span className="text-xs font-bold text-[#4e4844] drop-shadow-sm">Vibe check?</span>
                <span className="text-xs">💬</span>
              </div>

              {/* 3D claymorphic heart bubble in mid-front */}
              <div
                className="absolute -bottom-6 -left-10 clay-3d bg-[var(--color-brand-primary-light)] p-3 rounded-full flex items-center justify-center shadow-lg z-10 animate-drift-medium"
                style={{ transform: "translateZ(45px)" }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="var(--color-brand-danger)" stroke="none">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              </div>

              {/* 3D claymorphic sparkles in background */}
              <div
                className="absolute -top-12 -left-8 clay-3d bg-[#fffdf0] p-2.5 rounded-xl flex items-center justify-center shadow-md animate-drift-fast"
                style={{ transform: "translateZ(-15px) rotate(-15deg)" }}
              >
                <span className="text-sm">✨</span>
              </div>

              {/* 3D claymorphic music bubble in mid-front */}
              <div
                className="absolute -bottom-8 -right-8 clay-3d bg-[var(--color-brand-accent)] p-2.5 rounded-full flex items-center justify-center shadow-md animate-drift-slow"
                style={{ transform: "translateZ(30px) rotate(15deg)" }}
              >
                <span className="text-sm">🎵</span>
              </div>
            </div>
          </div>

          {/* Eyebrow */}
          <div
            className="eyebrow"
            style={{
              opacity: isFinalVisible ? 1 : 0,
              transform: isFinalVisible ? "translateY(0)" : "translateY(18px)",
              transition: "transform 1s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.8s ease",
              color: "#ffffff"
            }}
          >
            Stop texting. Start vibing.
          </div>

          {/* Headline */}
          <h1 className="headline">
            {headlineLines.map((line, i) => (
              <span
                key={i}
                className="line"
                style={{
                  opacity: isLineVisible ? 1 : 0,
                  filter: isLineVisible ? "blur(0)" : "blur(9px)",
                  transform: isLineVisible ? "translateY(0)" : "translateY(26px)",
                  transition:
                    "transform 1s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.8s ease, filter 0.8s ease",
                  transitionDelay: `${i * 150}ms`,
                }}
              >
                {line}
              </span>
            ))}
          </h1>

          {/* Subtitle */}
          <p
            className="sub"
            style={{
              opacity: isFinalVisible ? 1 : 0,
              transform: isFinalVisible ? "translateY(0)" : "translateY(18px)",
              transition: "transform 1s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.8s ease",
              color: "rgba(255, 255, 255, 0.95)",
              fontFamily: "'Great Vibes', cursive",
              fontSize: "28px",
              lineHeight: 1.3,
              textTransform: "none"
            }}
          >
            <span style={{ color: "#ee93b3" }}>Blink</span> is a cozy corner for your closest friends. Share how you feel with dynamic ambient spaces, custom aesthetic cards, and real-time vibe checks.
          </p>

          {/* CTA Row */}
          <div
            className="cta-row"
            style={{
              opacity: isFinalVisible ? 1 : 0,
              transform: isFinalVisible ? "translateY(0)" : "translateY(18px)",
              transition: "transform 1s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.8s ease",
            }}
          >
            <button onClick={() => router.push("/signup")} className="btn-custom primary">
              vibe with us
            </button>
          </div>

          {/* Scroll Hint */}
          <div
            className="scroll-hint"
            style={{
              opacity: isFinalVisible ? 1 : 0,
              transform: isFinalVisible ? "translateY(0)" : "translateY(18px)",
              transition: "transform 1s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.8s ease",
            }}
          >
            <div className="line" />
            <span>SCROLL DOWN</span>
          </div>
        </section>

        {/* Next fold section */}
        <section className="next-section">
          <h2>
            <em>A new kind of chat.</em> No algorithms, no noise. Just you and the people who matter most, sharing spaces that react to your mood in real-time.
          </h2>
        </section>
      </main>
    </div>
  );
};

export default Landing;
