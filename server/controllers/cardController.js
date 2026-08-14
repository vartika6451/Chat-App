// controllers/cardController.js
import { prisma } from "../config/prisma.js";

export const getTemplates = async (req, res) => {
  console.log("🎨 [CARDS] Fetching default greeting card templates");

  const mockTemplates = [
    {
      id: "tpl-1",
      title: "Cyberpunk Birthday",
      occasion: "Birthday",
      theme: "Neon",
      gradient: "from-[#2A0845] to-[#6441A5]",
      textColor: "text-cyan-400 dark:text-cyan-300",
      borderStyle: "border-purple-500/60 dark:border-purple-400/80 shadow-[0_0_15px_rgba(168,85,247,0.15)]",
      description: "May your neon grid burn bright this year. Happy Birthday!",
      author: "AI Assistant",
      accentSymbol: "⚡",
    },
    {
      id: "tpl-2",
      title: "Glass Anniversary",
      occasion: "Anniversary",
      theme: "Glass",
      gradient: "from-blue-50 to-pink-50",
      textColor: "text-indigo-900 dark:text-indigo-200",
      borderStyle: "border-indigo-200/80 dark:border-indigo-800/80 backdrop-blur-md",
      description: "Celebrating another milestone year of glass-clear love.",
      author: "System Classic",
      accentSymbol: "✨",
    },
    {
      id: "tpl-3",
      title: "Golden Luxury Thanks",
      occasion: "Thank You",
      theme: "Luxury",
      gradient: "from-amber-100 to-yellow-50",
      textColor: "text-amber-950 dark:text-amber-300",
      borderStyle: "border-amber-400/40 dark:border-amber-600/60",
      description: "With sincere appreciation and gold-tier standards.",
      author: "Blink Premium",
      accentSymbol: "🏆",
    },
    {
      id: "tpl-4",
      title: "Neon Congratulations",
      occasion: "Congratulations",
      theme: "Neon",
      gradient: "from-emerald-50 to-teal-100",
      textColor: "text-teal-950 dark:text-teal-300",
      borderStyle: "border-emerald-300/40 dark:border-emerald-700/60",
      description: "Huge achievements warrant neon celebrations!",
      author: "AI Assistant",
      accentSymbol: "🚀",
    },
    {
      id: "tpl-5",
      title: "Kawaii Cute Valentine",
      occasion: "Valentine",
      theme: "Cute",
      gradient: "from-rose-100 to-orange-100",
      textColor: "text-rose-950 dark:text-rose-300",
      borderStyle: "border-rose-300/40 dark:border-rose-700/60",
      description: "You make my heart blink with joy. Be mine!",
      author: "Mochi Design",
      accentSymbol: "💖",
    },
    {
      id: "tpl-6",
      title: "Academic Graduation",
      occasion: "Graduation",
      theme: "Minimal",
      gradient: "from-slate-100 to-indigo-100",
      textColor: "text-slate-900 dark:text-slate-300",
      borderStyle: "border-slate-300/40 dark:border-slate-700/60",
      description: "The cap is thrown, the grid is conquered. Well done!",
      author: "System Classic",
      accentSymbol: "🎓",
    },
  ];

  return res.status(200).json({
    success: true,
    templates: mockTemplates,
  });
};

export const generateCard = async (req, res) => {
  const { prompt, occasion, theme } = req.body;
  console.log(`🎨 [CARDS] Requesting AI generation: Occasion=${occasion}, Theme=${theme}, Prompt="${prompt}"`);

  if (!prompt) {
    return res.status(400).json({
      success: false,
      message: "Please enter a descriptive prompt for AI generation",
    });
  }

  const gradients = {
    Minimal: "from-zinc-100 to-slate-200",
    Cute: "from-pink-100 to-red-100",
    Luxury: "from-yellow-100 via-yellow-50 to-amber-100",
    Anime: "from-violet-100 to-pink-100",
    Neon: "from-[#FFE4EC] to-[#FFF1C5]",
    Glass: "from-white to-pink-50",
  };

  const textColors = {
    Minimal: "text-slate-800 dark:text-slate-200",
    Cute: "text-rose-800 dark:text-rose-200",
    Luxury: "text-amber-900 dark:text-amber-200",
    Anime: "text-violet-850 dark:text-violet-200",
    Neon: "text-purple-700 dark:text-purple-200",
    Glass: "text-cyan-900 dark:text-cyan-200",
  };

  const borderStyles = {
    Minimal: "border-slate-250 dark:border-slate-700",
    Cute: "border-rose-200 dark:border-rose-800",
    Luxury: "border-amber-300/50 dark:border-amber-700/60",
    Anime: "border-violet-200 dark:border-violet-800",
    Neon: "border-purple-300/50 dark:border-purple-700/60",
    Glass: "border-cyan-150 dark:border-cyan-800/80 backdrop-blur-md",
  };

  const accentSymbols = {
    Birthday: "🎂",
    Valentine: "💝",
    Anniversary: "💍",
    Graduation: "🎓",
    Wedding: "🤵👰",
    "Thank You": "🙏",
    Congratulations: "🎉",
  };

  const generatedCard = {
    id: `tpl-${Date.now()}`,
    title: `AI ${occasion} (${theme})`,
    occasion,
    theme,
    gradient: gradients[theme] || "from-pink-100 to-yellow-100",
    textColor: textColors[theme] || "text-zinc-800 dark:text-zinc-200",
    borderStyle: borderStyles[theme] || "border-zinc-200 dark:border-zinc-800",
    description: `"${prompt}" — customized especially for this ${occasion}.`,
    author: "My AI Studio",
    accentSymbol: accentSymbols[occasion] || "✨",
    createdAt: new Date().toISOString(),
  };

  return res.status(200).json({
    success: true,
    message: "Card generated successfully",
    generatedCard,
  });
};

