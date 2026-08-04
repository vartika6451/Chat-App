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
      <div className="w-full flex flex-col h-full retro-window min-h-[600px]">
        {/* Window Title Bar */}
        <div className="px-4 py-2 bg-[#C5F8C7] border-b-3 border-[#C85B7C] flex items-center justify-between shrink-0 select-none">
          <div className="flex items-center gap-2">
            <Sparkles size={14} className="text-[#C85B7C]" />
            <span className="font-retro text-[10px] font-black text-[#C85B7C] tracking-wider">GREETING_STUDIO.EXE</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FFCCD7] border border-[#C85B7C]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#FFF1C5] border border-[#C85B7C]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#C5F8C7] border border-[#C85B7C]" />
          </div>
        </div>

        {/* Inner Content Grid */}
        <div className="flex-1 p-6 bg-white overflow-y-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: AI Builder Frame */}
          <div className="lg:col-span-1">
            <div className="p-5 border-3 border-[#C85B7C] shadow-[3px_3px_0px_0px_#C85B7C] rounded-2xl bg-white sticky top-2">
              <h3 className="font-retro text-xs font-black text-[#C85B7C] mb-4 flex items-center gap-2">
                <Sparkles size={16} className="text-[#C85B7C]" />
                <span>AI BUILDER.EXE</span>
              </h3>

              <form onSubmit={handleGenerateAI} className="space-y-4">
                {/* Prompt */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-black text-[#8E7A82] uppercase tracking-wider">
                    Describe card message
                  </label>
                  <textarea
                    placeholder="e.g. Cute birthday card for a programmer with cat stickers"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    disabled={loading}
                    rows={4}
                    className="w-full px-3 py-2 rounded-xl bg-brand-bg border-2 border-[#C85B7C] text-xs text-zinc-800 placeholder-gray-400 focus:outline-none resize-none"
                  />
                </div>

                {/* Occasion */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-black text-[#8E7A82] uppercase tracking-wider">
                    Occasion
                  </label>
                  <select
                    value={occasion}
                    onChange={(e) => setOccasion(e.target.value)}
                    disabled={loading}
                    className="w-full px-3 py-2 rounded-xl bg-brand-bg border-2 border-[#C85B7C] text-xs text-zinc-800 focus:outline-none cursor-pointer"
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
                      <option key={occ} value={occ} className="text-zinc-800">
                        {occ}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Theme */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-black text-[#8E7A82] uppercase tracking-wider">
                    Artistic Style
                  </label>
                  <select
                    value={theme}
                    onChange={(e) => setTheme(e.target.value)}
                    disabled={loading}
                    className="w-full px-3 py-2 rounded-xl bg-brand-bg border-2 border-[#C85B7C] text-xs text-zinc-800 focus:outline-none cursor-pointer"
                  >
                    {["Minimal", "Cute", "Luxury", "Anime", "Neon", "Glass"].map((th) => (
                      <option key={th} value={th} className="text-zinc-800">
                        {th}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Submit Buttons */}
                <div className="flex flex-col gap-2 pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 bg-[#FFE4EC] border-2 border-[#C85B7C] rounded-xl text-[#C85B7C] font-retro text-xs font-black shadow-[2px_2px_0px_0px_#C85B7C] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_#C85B7C] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[0px_0px_0px_0px_#C85B7C] flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Wand2 size={14} strokeWidth={2.5} />
                    <span>GENERATE WITH AI</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleCreateManually}
                    disabled={loading}
                    className="w-full py-2.5 bg-white border-2 border-[#C85B7C] rounded-xl text-zinc-500 font-retro text-xs font-black shadow-[2px_2px_0px_0px_#C85B7C] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_#C85B7C] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[0px_0px_0px_0px_#C85B7C] flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Edit3 size={14} strokeWidth={2.5} />
                    <span>CREATE MANUALLY</span>
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Right Column: Templates Grid */}
          <div className="lg:col-span-2 space-y-6">
            <h3 className="font-retro text-base font-black text-[#C85B7C] tracking-wide flex items-center gap-2">
              <span>TEMPLATES DIRECTORY</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FFE4EC] border border-[#C85B7C]">
                {templates.length} cards
              </span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {templates.map((tpl) => (
                <div
                  key={tpl.id}
                  onClick={() => openPreview(tpl)}
                  className="group relative flex flex-col justify-between aspect-[1.4] p-5 border-3 border-[#C85B7C] shadow-[3px_3px_0px_0px_#C85B7C] hover:translate-y-[-2px] hover:shadow-[5px_5px_0px_0px_#C85B7C] transition-all rounded-2xl cursor-pointer bg-white overflow-hidden"
                >
                  {/* Background overlay gradient */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${tpl.gradient} opacity-[0.25] group-hover:opacity-[0.4] transition-opacity duration-300 pointer-events-none`}
                  />

                  {/* Header */}
                  <div className="flex justify-between items-start z-10">
                    <div>
                      <span className="text-[9px] font-black uppercase tracking-widest text-[#C85B7C]">
                        {tpl.occasion}
                      </span>
                      <h4 className="font-retro text-xs font-black text-[#C85B7C] mt-0.5">{tpl.title.toUpperCase()}</h4>
                    </div>
                    <span className="text-2xl">{tpl.accentSymbol}</span>
                  </div>

                  {/* Body Snippet */}
                  <p className="text-[10px] text-zinc-500 font-bold line-clamp-2 mt-4 leading-relaxed z-10">
                    {tpl.description}
                  </p>

                  {/* Footer */}
                  <div className="flex justify-between items-center mt-6 pt-3 border-t border-[#C85B7C]/20 z-10">
                    <span className="text-[9px] text-gray-400 font-bold uppercase">By {tpl.author}</span>
                    <span className="text-[10px] text-[#C85B7C] flex items-center gap-1 font-black uppercase">
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
              className={`w-full aspect-[1.3] bg-gradient-to-br ${selectedTemplate.gradient} border-3 border-[#C85B7C] shadow-[4px_4px_0px_0px_#C85B7C] rounded-2xl p-8 flex flex-col justify-between relative overflow-hidden`}
            >
              <div className="absolute inset-0 bg-white/10" />

              <div className="relative z-10 flex justify-between items-start">
                <span className="text-[10px] font-black uppercase tracking-widest bg-white border-2 border-[#C85B7C] px-3 py-1 rounded-full text-[#C85B7C]">
                  {selectedTemplate.occasion}
                </span>
                <span className="text-4xl animate-bounce">{selectedTemplate.accentSymbol}</span>
              </div>

              <div className="relative z-10 text-center my-4">
                <p className="text-sm md:text-base font-retro font-black text-[#C85B7C] tracking-wide leading-relaxed px-4">
                  {selectedTemplate.description}
                </p>
              </div>

              <div className="relative z-10 border-t-2 border-[#C85B7C]/20 pt-4 flex justify-between items-center text-[8px] text-[#C85B7C] font-bold uppercase">
                <span>BLINK STUDIO ENGINE v1.0</span>
                <span>BY {selectedTemplate.author}</span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex gap-3 w-full">
              <button
                onClick={() => {
                  toast.success("Saved greeting card successfully!");
                  setIsPreviewOpen(false);
                }}
                className="flex-1 py-2.5 bg-[#E6FCE8] border-2 border-[#C85B7C] rounded-xl text-[#C85B7C] font-retro text-xs font-black shadow-[2px_2px_0px_0px_#C85B7C] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[0px_0px_0px_0px_#C85B7C] flex items-center justify-center cursor-pointer"
              >
                Save Card
              </button>
              <button
                onClick={() => setIsPreviewOpen(false)}
                className="flex-1 py-2.5 bg-white border-2 border-[#C85B7C] rounded-xl text-zinc-500 font-retro text-xs font-black shadow-[2px_2px_0px_0px_#C85B7C] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[0px_0px_0px_0px_#C85B7C] flex items-center justify-center cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default GreetingStudio;
