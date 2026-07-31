import React, { useState } from "react";
import { Sparkles, Edit3, Heart, Award, Gift, Eye, Wand2 } from "lucide-react";
import { toast } from "react-hot-toast";
import PageHeader from "../components/PageHeader";
import Button from "../components/Button";
import Card from "../components/Card";
import Modal from "../components/Modal";
import Loader from "../components/Loader";

const GreetingStudio = () => {
  const [prompt, setPrompt] = useState("");
  const [occasion, setOccasion] = useState("Birthday");
  const [theme, setTheme] = useState("Minimal");
  const [loading, setLoading] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Mock initial templates
  const [templates, setTemplates] = useState([
    {
      id: "tpl-1",
      title: "Cyberpunk Birthday",
      occasion: "Birthday",
      theme: "Neon",
      gradient: "from-fuchsia-600 via-pink-600 to-cyan-500",
      textColor: "text-white",
      description: "May your neon grid burn bright this year. Happy Birthday!",
      author: "AI Assistant",
      accentSymbol: "⚡",
    },
    {
      id: "tpl-2",
      title: "Glass Anniversary",
      occasion: "Anniversary",
      theme: "Glass",
      gradient: "from-zinc-900/60 via-zinc-800/40 to-zinc-900/60",
      textColor: "text-gray-150",
      borderStyle: "border-white/10 backdrop-blur-xl",
      description: "Celebrating another milestone year of glass-clear love.",
      author: "System Classic",
      accentSymbol: "✨",
    },
    {
      id: "tpl-3",
      title: "Golden Luxury Thanks",
      occasion: "Thank You",
      theme: "Luxury",
      gradient: "from-amber-600 via-yellow-700 to-amber-900",
      textColor: "text-amber-50",
      description: "With sincere appreciation and gold-tier standards.",
      author: "Blink Premium",
      accentSymbol: "🏆",
    },
    {
      id: "tpl-4",
      title: "Neon Congratulations",
      occasion: "Congratulations",
      theme: "Neon",
      gradient: "from-emerald-500 via-teal-600 to-indigo-700",
      textColor: "text-white",
      description: "Huge achievements warrant neon celebrations!",
      author: "AI Assistant",
      accentSymbol: "🚀",
    },
    {
      id: "tpl-5",
      title: "Kawaii Cute Valentine",
      occasion: "Valentine",
      theme: "Cute",
      gradient: "from-rose-400 via-pink-400 to-orange-300",
      textColor: "text-rose-950",
      description: "You make my heart blink with joy. Be mine!",
      author: "Mochi Design",
      accentSymbol: "💖",
    },
    {
      id: "tpl-6",
      title: "Academic Graduation",
      occasion: "Graduation",
      theme: "Minimal",
      gradient: "from-slate-900 via-indigo-950 to-slate-900",
      textColor: "text-indigo-200",
      description: "The cap is thrown, the grid is conquered. Well done!",
      author: "System Classic",
      accentSymbol: "🎓",
    },
  ]);

  const handleGenerateAI = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) {
      toast.error("Please enter a text prompt describing your card.");
      return;
    }

    try {
      setLoading(true);
      // Simulate API generation delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const gradients = {
        Minimal: "from-zinc-900 via-slate-800 to-zinc-950",
        Cute: "from-pink-400 to-red-300",
        Luxury: "from-yellow-600 via-yellow-700 to-amber-950",
        Anime: "from-violet-500 via-purple-500 to-pink-500",
        Neon: "from-purple-900 via-pink-700 to-cyan-500",
        Glass: "from-white/10 via-transparent to-white/5",
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

      const newCard = {
        id: `tpl-${Date.now()}`,
        title: `AI ${occasion} (${theme})`,
        occasion,
        theme,
        gradient: gradients[theme] || "from-brand-primary to-brand-accent",
        textColor: theme === "Cute" ? "text-rose-950" : "text-white",
        description: `"${prompt}" — customized especially for this ${occasion}.`,
        author: "My AI Studio",
        accentSymbol: accentSymbols[occasion] || "✨",
      };

      setTemplates((prev) => [newCard, ...prev]);
      toast.success("AI greeting card generated successfully!", {
        style: { background: "#18181B", color: "#fff", border: "1px solid #27272A" },
      });
      setPrompt("");
    } catch (err) {
      toast.error("Failed to generate card.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateManually = () => {
    toast.success("Manual card builder opened (Placeholder)", {
      style: { background: "#18181B", color: "#fff", border: "1px solid #27272A" },
    });
  };

  const openPreview = (tpl) => {
    setSelectedTemplate(tpl);
    setIsPreviewOpen(true);
  };

  return (
    <div className="flex-1 p-6 overflow-y-auto max-w-5xl mx-auto w-full">
      <PageHeader
        title="Greeting Studio"
        description="Design and generate beautiful cards using Blink AI"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Creation Input Section */}
        <div className="lg:col-span-1">
          <Card variant="glass" className="p-6 border-white/5 sticky top-6">
            <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <Sparkles size={18} className="text-brand-accent" />
              <span>AI Greeting Builder</span>
            </h2>

            <form onSubmit={handleGenerateAI} className="space-y-4">
              {/* Prompt Input */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Describe Card Topic / Message
                </label>
                <textarea
                  placeholder="e.g. Retrowave birthday card for a software dev with space rockets"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  disabled={loading}
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl bg-brand-surface border border-zinc-800 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition-all duration-200 resize-none disabled:opacity-50"
                />
              </div>

              {/* Occasion Selection */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Occasion
                </label>
                <select
                  value={occasion}
                  onChange={(e) => setOccasion(e.target.value)}
                  disabled={loading}
                  className="w-full px-4 py-3 rounded-xl bg-brand-surface border border-zinc-800 text-sm text-white focus:outline-none focus:border-brand-primary transition-all duration-200 disabled:opacity-50 cursor-pointer"
                >
                  {[
                    "Birthday",
                    "Valentine",
                    "Anniversary",
                    "Graduation",
                    "Wedding",
                    "Thank You",
                    "Congratulations",
                  ].map((occ) => (
                    <option key={occ} value={occ} className="bg-brand-surface text-white">
                      {occ}
                    </option>
                  ))}
                </select>
              </div>

              {/* Theme Selection */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Artistic Theme
                </label>
                <select
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  disabled={loading}
                  className="w-full px-4 py-3 rounded-xl bg-brand-surface border border-zinc-800 text-sm text-white focus:outline-none focus:border-brand-primary transition-all duration-200 disabled:opacity-50 cursor-pointer"
                >
                  {["Minimal", "Cute", "Luxury", "Anime", "Neon", "Glass"].map((th) => (
                    <option key={th} value={th} className="bg-brand-surface text-white">
                      {th}
                    </option>
                  ))}
                </select>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2 pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  className="w-full py-3"
                  loading={loading}
                  iconBefore={<Wand2 size={16} />}
                >
                  Generate with AI
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full py-3"
                  onClick={handleCreateManually}
                  disabled={loading}
                  iconBefore={<Edit3 size={15} />}
                >
                  Create Manually
                </Button>
              </div>
            </form>
          </Card>
        </div>

        {/* Templates Display Grid */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <span>Beautiful Templates</span>
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-zinc-900 border border-zinc-800 text-brand-text-secondary">
              {templates.length} cards
            </span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {templates.map((tpl) => (
              <Card
                key={tpl.id}
                variant="default"
                hoverEffect
                onClick={() => openPreview(tpl)}
                className="group relative flex flex-col justify-between aspect-[1.4] p-6 border-zinc-850 hover:border-brand-primary/40 overflow-hidden cursor-pointer"
              >
                {/* Background overlay gradient */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${tpl.gradient} opacity-[0.06] group-hover:opacity-[0.12] transition-opacity duration-300 pointer-events-none`}
                />

                {/* Card header */}
                <div className="flex justify-between items-start z-10">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-brand-primary">
                      {tpl.occasion}
                    </span>
                    <h3 className="text-base font-bold text-white mt-0.5">{tpl.title}</h3>
                  </div>
                  <span className="text-2xl">{tpl.accentSymbol}</span>
                </div>

                {/* Message snippet */}
                <p className="text-xs text-brand-text-secondary line-clamp-2 mt-4 leading-relaxed z-10">
                  {tpl.description}
                </p>

                {/* Card footer details */}
                <div className="flex justify-between items-center mt-6 pt-4 border-t border-zinc-800/40 z-10">
                  <span className="text-[10px] text-gray-500 font-mono">By {tpl.author}</span>
                  <span className="text-xs text-brand-primary flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity font-semibold">
                    <span>Preview</span>
                    <Eye size={12} />
                  </span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Greeting Card Modal Preview */}
      <Modal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        title="Card Preview Studio"
        size="md"
      >
        {selectedTemplate && (
          <div className="space-y-6 flex flex-col items-center">
            {/* The actual styled card component mockup */}
            <div
              className={`w-full aspect-[1.3] bg-gradient-to-br ${selectedTemplate.gradient} ${
                selectedTemplate.borderStyle || "border border-white/5 shadow-2xl"
              } rounded-2xl p-8 flex flex-col justify-between relative overflow-hidden text-center`}
            >
              {/* Internal card glass frame details */}
              <div className="absolute inset-0 bg-black/10 backdrop-brightness-[0.95]" />

              <div className="relative z-10 flex flex-col items-center">
                <span className="text-4xl animate-bounce mb-3 block">
                  {selectedTemplate.accentSymbol}
                </span>
                <span className="text-[10px] font-extrabold uppercase tracking-widest bg-black/40 px-3 py-1 rounded-full text-white/90 border border-white/5">
                  {selectedTemplate.occasion}
                </span>
              </div>

              <div className="relative z-10">
                <p
                  className={`text-base md:text-lg font-bold italic tracking-wide leading-relaxed px-4 ${selectedTemplate.textColor}`}
                >
                  {selectedTemplate.description}
                </p>
              </div>

              <div className="relative z-10 border-t border-white/10 pt-4 flex justify-between items-center text-[10px] text-white/50 font-mono">
                <span>BLINK STUDIO ENGINE v1</span>
                <span>BY {selectedTemplate.author.toUpperCase()}</span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex gap-3 w-full">
              <Button
                variant="primary"
                onClick={() => {
                  toast.success("Saved greeting card to Memory Vault!", {
                    style: { background: "#18181B", color: "#fff", border: "1px solid #27272A" },
                  });
                  setIsPreviewOpen(false);
                }}
                className="flex-1 py-3 text-sm"
              >
                Save Card
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsPreviewOpen(false)}
                className="flex-1 py-3 text-sm"
              >
                Close Preview
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default GreetingStudio;
