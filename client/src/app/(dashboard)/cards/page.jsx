"use client";

import React, { useState } from "react";
import { Sparkles, Edit3, Eye, Wand2, FileText } from "lucide-react";
import { toast } from "react-hot-toast";
import PageHeader from "../../../components/PageHeader";
import Avatar from "../../../components/Avatar";
import Button from "../../../components/Button";
import Card from "../../../components/Card";
import Modal from "../../../components/Modal";

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
      gradient: "from-fuchsia-100 to-cyan-100",
      textColor: "text-[#C85B7C]",
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
      textColor: "text-[#C85B7C]",
      borderStyle: "border-[#C85B7C]",
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
      textColor: "text-[#C85B7C]",
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
      textColor: "text-[#C85B7C]",
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
      gradient: "from-slate-100 to-indigo-100",
      textColor: "text-[#C85B7C]",
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
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const gradients = {
        Minimal: "from-zinc-100 to-slate-200",
        Cute: "from-pink-100 to-red-100",
        Luxury: "from-yellow-100 via-yellow-50 to-amber-100",
        Anime: "from-violet-100 to-pink-100",
        Neon: "from-[#FFE4EC] to-[#FFF1C5]",
        Glass: "from-white to-pink-50",
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
        gradient: gradients[theme] || "from-pink-100 to-yellow-100",
        textColor: "text-[#C85B7C]",
        description: `"${prompt}" — customized especially for this ${occasion}.`,
        author: "My AI Studio",
        accentSymbol: accentSymbols[occasion] || "✨",
      };

      setTemplates((prev) => [newCard, ...prev]);
      toast.success("AI greeting card generated successfully!");
      setPrompt("");
    } catch (err) {
      toast.error("Failed to generate card.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateManually = () => {
    toast.success("Manual card builder opened (Placeholder)");
  };

  const openPreview = (tpl) => {
    setSelectedTemplate(tpl);
    setIsPreviewOpen(true);
  };

  return (
    <div className="flex-1 p-6 overflow-y-auto max-w-5xl mx-auto w-full flex flex-col justify-center">
      {/* Outer Page Window */}
      <div className="w-full flex flex-col h-full bg-white dark:bg-zinc-900/60 backdrop-blur-md rounded-[24px] border border-zinc-150 dark:border-zinc-800/60 shadow-[0_4px_20px_rgba(0,0,0,0.015)] overflow-hidden min-h-[600px]">
        {/* Inner Content Grid */}
        <div className="flex-1 p-8 bg-white dark:bg-zinc-900/10 overflow-y-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: AI Builder Frame */}
          <div className="lg:col-span-1">
            <div className="p-6 bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800/80 rounded-[20px] shadow-[0_4px_20px_rgba(0,0,0,0.01)] sticky top-2">
              <h3 className="text-xs font-bold text-zinc-800 dark:text-zinc-200 mb-4 flex items-center gap-2">
                <Sparkles size={15} className="text-[var(--color-brand-accent-pink)]" />
                <span>AI Builder</span>
              </h3>

              <form onSubmit={handleGenerateAI} className="space-y-4">
                {/* Prompt */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">
                    Describe card message
                  </label>
                  <textarea
                    placeholder="e.g. Cute birthday card for a programmer with cat stickers"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    disabled={loading}
                    rows={4}
                    className="w-full px-4 py-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-150 dark:border-zinc-800/60 text-xs text-zinc-800 dark:text-zinc-100 placeholder-gray-400 focus:outline-none focus:border-[var(--color-brand-accent-pink)] transition-all duration-200 resize-none"
                  />
                </div>

                {/* Occasion */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">
                    Occasion
                  </label>
                  <select
                    value={occasion}
                    onChange={(e) => setOccasion(e.target.value)}
                    disabled={loading}
                    className="w-full px-4 py-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-150 dark:border-zinc-800/60 text-xs text-zinc-800 dark:text-zinc-200 focus:outline-none focus:border-[var(--color-brand-accent-pink)] cursor-pointer transition-all duration-200"
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
                      <option key={occ} value={occ} className="text-zinc-800 dark:text-zinc-200">
                        {occ}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Theme */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">
                    Artistic Style
                  </label>
                  <select
                    value={theme}
                    onChange={(e) => setTheme(e.target.value)}
                    disabled={loading}
                    className="w-full px-4 py-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-150 dark:border-zinc-800/60 text-xs text-zinc-800 dark:text-zinc-200 focus:outline-none focus:border-[var(--color-brand-accent-pink)] cursor-pointer transition-all duration-200"
                  >
                    {["Minimal", "Cute", "Luxury", "Anime", "Neon", "Glass"].map((th) => (
                      <option key={th} value={th} className="text-zinc-800 dark:text-zinc-200">
                        {th}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Submit Buttons */}
                <div className="flex flex-col gap-2 pt-2">
                  <Button
                    type="submit"
                    disabled={loading}
                    variant="primary"
                    iconBefore={<Wand2 size={14} />}
                    className="w-full"
                  >
                    Generate with AI
                  </Button>
                  <Button
                    type="button"
                    onClick={handleCreateManually}
                    disabled={loading}
                    variant="outline"
                    iconBefore={<Edit3 size={14} />}
                    className="w-full"
                  >
                    Create Manually
                  </Button>
                </div>
              </form>
            </div>
          </div>

          {/* Right Column: Templates Grid */}
          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-200 tracking-tight flex items-center gap-2.5">
              <span>Templates Directory</span>
              <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-[var(--color-brand-accent-pink-light)]/20 text-[var(--color-brand-accent-pink)] border border-[var(--color-brand-accent-pink-light)]/10">
                {templates.length} cards
              </span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {templates.map((tpl) => (
                <div
                  key={tpl.id}
                  onClick={() => openPreview(tpl)}
                  className="group relative flex flex-col justify-between aspect-[1.4] p-6 border border-zinc-150 dark:border-zinc-800/80 rounded-[20px] shadow-[0_2px_12px_rgba(0,0,0,0.01)] hover:shadow-md hover:scale-[1.01] transition-all duration-350 cursor-pointer bg-white dark:bg-zinc-900 overflow-hidden"
                >
                  {/* Background overlay gradient */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${tpl.gradient} opacity-[0.25] group-hover:opacity-[0.4] transition-opacity duration-300 pointer-events-none`}
                  />

                  {/* Header */}
                  <div className="flex justify-between items-start z-10">
                    <div>
                      <span className="text-[9px] font-bold uppercase tracking-wider text-[var(--color-brand-accent-pink)]">
                        {tpl.occasion}
                      </span>
                      <h4 className="text-xs font-bold text-zinc-850 dark:text-zinc-150 mt-1">{tpl.title}</h4>
                    </div>
                    <span className="text-2xl">{tpl.accentSymbol}</span>
                  </div>

                  {/* Body Snippet */}
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium line-clamp-2 mt-4 leading-relaxed z-10">
                    {tpl.description}
                  </p>

                  {/* Footer */}
                  <div className="flex justify-between items-center mt-6 pt-3 border-t border-zinc-100 dark:border-zinc-800/80 z-10">
                    <span className="text-[9px] text-gray-400 font-semibold">By {tpl.author}</span>
                    <span className="text-[10px] text-[var(--color-brand-accent-pink)] flex items-center gap-1 font-bold">
                      <span>Preview</span>
                      <Eye size={12} strokeWidth={2.5} />
                    </span>
                  </div>
                </div>
              ))}
            </div>
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
            {/* Postcard Frame Mockup */}
            <div
              className={`w-full aspect-[1.3] bg-gradient-to-br ${selectedTemplate.gradient} border border-zinc-150 dark:border-zinc-800 shadow-md rounded-[20px] p-8 flex flex-col justify-between relative overflow-hidden`}
            >
              <div className="absolute inset-0 bg-white/10" />

              <div className="relative z-10 flex justify-between items-start">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-white/80 border border-zinc-100 px-3.5 py-1 rounded-full text-zinc-700">
                  {selectedTemplate.occasion}
                </span>
                <span className="text-4xl animate-bounce">{selectedTemplate.accentSymbol}</span>
              </div>

              <div className="relative z-10 text-center my-4">
                <p className="text-sm md:text-base font-semibold text-zinc-800 dark:text-zinc-100 tracking-tight leading-relaxed px-4">
                  {selectedTemplate.description}
                </p>
              </div>

              <div className="relative z-10 border-t border-zinc-200/40 pt-4 flex justify-between items-center text-[9px] text-zinc-500 font-semibold">
                <span>Blink Studio Engine v1.0</span>
                <span>By {selectedTemplate.author}</span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex gap-3 w-full">
              <Button
                onClick={() => {
                  toast.success("Saved greeting card successfully!");
                  setIsPreviewOpen(false);
                }}
                variant="primary"
                className="flex-1"
              >
                Save Card
              </Button>
              <Button
                onClick={() => setIsPreviewOpen(false)}
                variant="secondary"
                className="flex-1"
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
