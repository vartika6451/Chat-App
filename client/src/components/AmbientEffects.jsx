// client/src/components/AmbientEffects.jsx
"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Helper to generate a stable set of random properties for particles
const useParticles = (count, emotion) => {
  const [particles, setParticles] = useState([]);
  useEffect(() => {
    const list = Array.from({ length: count }).map((_, i) => ({
      id: `${emotion}-${i}`,
      left: `${Math.random() * 100}%`,
      delay: Math.random() * 5,
      duration: 4 + Math.random() * 6,
      size: 10 + Math.random() * 20,
      color: ["#FD6B8F", "#EADCF8", "#FFE2E8", "#FD6B8F"][i % 4],
      rotate: Math.random() * 360,
    }));
    setParticles(list);
  }, [count, emotion]);
  return particles;
};

// --- Emojis and Blobs for Funny Theme ---
const FunnyParticles = () => {
  const blobs = ["🤪", "😂", "✨", "🌟", "😺", "🍭"];
  const list = useParticles(6, "funny");

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 opacity-40">
      {list.map((p, idx) => (
        <motion.div
          key={p.id}
          className="absolute text-xl select-none"
          style={{ left: p.left, bottom: "-5%" }}
          initial={{ y: 0, scale: 0.5, rotate: p.rotate, opacity: 0 }}
          animate={{
            y: -500,
            scale: [0.8, 1.2, 0.8],
            rotate: p.rotate + 360,
            opacity: [0, 0.9, 0],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeInOut",
          }}
        >
          {blobs[idx % blobs.length]}
        </motion.div>
      ))}
    </div>
  );
};

// --- Floating Hearts for Romantic Theme ---
const HeartSVG = ({ color }) => (
  <svg viewBox="0 0 24 24" width="100%" height="100%" fill={color} className="drop-shadow-md">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);

const RomanticParticles = () => {
  const list = useParticles(10, "romantic");
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 opacity-80">
      {list.map((p) => (
        <motion.div
          key={p.id}
          className="absolute"
          style={{ left: p.left, bottom: "-10%", width: p.size, height: p.size }}
          initial={{ y: 0, scale: 0.5, opacity: 0 }}
          animate={{
            y: -550,
            x: [0, Math.sin(p.size) * 30, 0],
            scale: [0.7, 1.3, 0.8],
            opacity: [0, 0.85, 0],
          }}
          transition={{
            duration: p.duration + 2,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeInOut",
          }}
        >
          <HeartSVG color={p.color} />
        </motion.div>
      ))}
    </div>
  );
};

// --- Embers for Angry Theme ---
const AngryParticles = () => {
  const list = useParticles(12, "angry");
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 opacity-30">
      {list.map((p, idx) => (
        <motion.div
          key={p.id}
          className="absolute rounded-sm"
          style={{
            left: p.left,
            bottom: "-5%",
            width: p.size * 0.4,
            height: p.size * 0.4,
            background: `radial-gradient(circle, #FF8A00 0%, #E53E3E 100%)`,
            boxShadow: "0 0 8px #FF8A00",
          }}
          initial={{ y: 0, rotate: 0, opacity: 0 }}
          animate={{
            y: -600,
            x: [0, (idx % 2 === 0 ? 40 : -40), 0],
            rotate: p.rotate * 2,
            opacity: [0, 0.9, 0],
          }}
          transition={{
            duration: p.duration - 1,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
};

// --- Raindrops for Sad Theme ---
const SadParticles = () => {
  const list = useParticles(20, "sad");
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 opacity-25">
      {list.map((p) => (
        <motion.div
          key={p.id}
          className="absolute w-[1.5px] bg-[#5C7CFA]"
          style={{
            left: p.left,
            top: "-10%",
            height: p.size * 1.5,
          }}
          initial={{ y: 0, opacity: 0 }}
          animate={{
            y: 650,
            opacity: [0.1, 0.7, 0.1],
          }}
          transition={{
            duration: p.duration * 0.3 + 1,
            repeat: Infinity,
            delay: p.delay * 0.5,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
};

// --- Sparkles for Excited Theme ---
const SparkleSVG = ({ color }) => (
  <svg viewBox="0 0 24 24" width="100%" height="100%" fill={color}>
    <path d="M12 2l2.4 7.2L22 12l-7.6 2.4L12 22l-2.4-7.6L2 12l7.6-2.4z" />
  </svg>
);

const ExcitedParticles = () => {
  const list = useParticles(10, "excited");
  const colors = ["#00E5FF", "#E040FB", "#FEFCBF", "#9C27B0"];

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 opacity-50">
      {list.map((p, idx) => (
        <motion.div
          key={p.id}
          className="absolute"
          style={{
            left: p.left,
            top: `${20 + Math.random() * 60}%`,
            width: p.size,
            height: p.size,
          }}
          initial={{ scale: 0, opacity: 0, rotate: 0 }}
          animate={{
            scale: [0, 1.4, 0],
            opacity: [0, 0.9, 0],
            rotate: [0, 180],
          }}
          transition={{
            duration: p.duration * 0.5 + 1.5,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeInOut",
          }}
        >
          <SparkleSVG color={colors[idx % colors.length]} />
        </motion.div>
      ))}
    </div>
  );
};

// --- Falling Leaves for Calm Theme ---
const LeafSVG = ({ color }) => (
  <svg viewBox="0 0 24 24" width="100%" height="100%" fill={color}>
    <path d="M17.5 2C15.5 2 13 4 12 6c-1-2-3.5-4-5.5-4C4.5 2 2.5 4 2.5 7c0 4.5 5 10 9.5 14 4.5-4 9.5-9.5 9.5-14 0-3-2-5-4.5-5zM12 17.5c-2.5-2.2-5.5-5.5-5.5-8.5 0-1.5 1-2.5 2-2.5.8 0 1.6.8 2.2 1.8L12 10.3l1.3-2c.6-1 1.4-1.8 2.2-1.8 1 0 2 1 2 2.5 0 3-3 6.3-5.5 8.5z" />
  </svg>
);

const CalmParticles = () => {
  const list = useParticles(8, "calm");
  const colors = ["#38A169", "#48BB78", "#68D391", "#81E6D9"];

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 opacity-30">
      {list.map((p, idx) => (
        <motion.div
          key={p.id}
          className="absolute"
          style={{
            left: p.left,
            top: "-10%",
            width: p.size * 1.2,
            height: p.size * 1.2,
          }}
          initial={{ y: 0, rotate: 0, opacity: 0 }}
          animate={{
            y: 650,
            x: [0, 50, -50, 0],
            rotate: [0, p.rotate + 180],
            opacity: [0, 0.8, 0],
          }}
          transition={{
            duration: p.duration + 3,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeInOut",
          }}
        >
          <LeafSVG color={colors[idx % colors.length]} />
        </motion.div>
      ))}
    </div>
  );
};

// --- Confetti & Balloons for Celebration Theme ---
const CelebrationParticles = () => {
  const list = useParticles(12, "celebration");
  const colors = ["#FE7B9B", "#FFF1C5", "#C5F8C7", "#FFA4A4", "#9F7AEA"];

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 opacity-40">
      {list.map((p, idx) => (
        <motion.div
          key={p.id}
          className="absolute"
          style={{
            left: p.left,
            top: "-5%",
            width: p.size * 0.4,
            height: p.size * 0.7,
            backgroundColor: colors[idx % colors.length],
            borderRadius: "2px",
          }}
          initial={{ y: 0, rotate: 0, opacity: 0 }}
          animate={{
            y: 600,
            x: [0, (idx % 2 === 0 ? 30 : -30), (idx % 2 === 0 ? -20 : 20)],
            rotate: [0, 360],
            opacity: [0, 0.9, 0],
          }}
          transition={{
            duration: p.duration - 1,
            repeat: Infinity,
            delay: p.delay * 0.4,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
};

// --- Magic Twinkles for Fantasy Theme ---
const FantasyParticles = () => {
  const list = useParticles(10, "fantasy");

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 opacity-45">
      {list.map((p, idx) => (
        <motion.div
          key={p.id}
          className="absolute"
          style={{
            left: p.left,
            top: `${10 + Math.random() * 80}%`,
            width: p.size * 0.8,
            height: p.size * 0.8,
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            scale: [0, 1.3, 0],
            opacity: [0, 0.85, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: p.duration * 0.4 + 2,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeInOut",
          }}
        >
          <SparkleSVG color="#E0AAFF" />
        </motion.div>
      ))}
    </div>
  );
};

// --- Glowing Rockets/Rays for Motivational Theme ---
const MotivationalParticles = () => {
  const list = useParticles(6, "motivational");
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 opacity-30">
      {list.map((p, idx) => (
        <motion.div
          key={p.id}
          className="absolute flex flex-col items-center"
          style={{
            left: p.left,
            bottom: "-10%",
          }}
          initial={{ y: 0, opacity: 0 }}
          animate={{
            y: -550,
            opacity: [0, 0.9, 0],
          }}
          transition={{
            duration: p.duration * 0.7 + 2,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeInOut",
          }}
        >
          {/* Glowing particle trail */}
          <div
            className="w-1.5 rounded-full"
            style={{
              height: p.size * 2,
              background: "linear-gradient(to top, rgba(221,107,32,0) 0%, #FFB000 100%)",
              boxShadow: "0 0 10px #FFB000",
            }}
          />
        </motion.div>
      ))}
    </div>
  );
};

// --- Mist & Ghosts for Horror Theme ---
const HorrorParticles = () => {
  const list = useParticles(5, "horror");
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 opacity-20">
      {list.map((p, idx) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full filter blur-xl"
          style={{
            left: p.left,
            top: `${20 + Math.random() * 60}%`,
            width: p.size * 4,
            height: p.size * 4,
            background: "radial-gradient(circle, rgba(130,39,39,0.3) 0%, rgba(0,0,0,0) 70%)",
          }}
          initial={{ x: -100, opacity: 0 }}
          animate={{
            x: 200,
            opacity: [0, 0.8, 0],
          }}
          transition={{
            duration: p.duration + 4,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

// --- Main Ambient Effects Orchestrator ---
const AmbientEffects = ({ emotion }) => {
  const renderEffect = () => {
    switch (emotion) {
      case "romantic":
        return <RomanticParticles />;
      case "funny":
        return <FunnyParticles />;
      case "angry":
        return <AngryParticles />;
      case "sad":
        return <SadParticles />;
      case "excited":
        return <ExcitedParticles />;
      case "calm":
        return <CalmParticles />;
      case "celebration":
        return <CelebrationParticles />;
      case "fantasy":
        return <FantasyParticles />;
      case "motivational":
        return <MotivationalParticles />;
      case "horror":
        return <HorrorParticles />;
      default:
        return null; // professional, friendly, etc. have clean backgrounds
    }
  };

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 select-none">
      <AnimatePresence mode="wait">
        <motion.div
          key={emotion}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="absolute inset-0"
        >
          {renderEffect()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default AmbientEffects;
