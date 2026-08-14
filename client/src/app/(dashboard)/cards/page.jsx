"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, Edit3, Eye, Wand2, Send } from "lucide-react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import api from "../../../utils/api";
import Button from "../../../components/Button";
import Modal from "../../../components/Modal";

const GreetingStudio = () => {
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const [occasion, setOccasion] = useState("Birthday");
  const [theme, setTheme] = useState("Minimal");
  const [loading, setLoading] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Recipient list & message states
  const [recipients, setRecipients] = useState([]);
  const [selectedRecipientId, setSelectedRecipientId] = useState("");
  const [sendingCard, setSendingCard] = useState(false);

  // Mock initial templates as fallback
  const [templates, setTemplates] = useState([
    {
      id: "tpl-1",
      title: "Cyberpunk Birthday",
      occasion: "Birthday",
      theme: "Neon",
      gradient: "from-[#2A0845] to-[#6441A5]",
      textColor: "text-cyan-400 dark:text-cyan-350",
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
      borderStyle: "border-indigo-250/80 dark:border-indigo-800/80 backdrop-blur-md",
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
  ]);

  // Fetch templates from server on mount
  useEffect(() => {
    const fetchTemplatesAndRecipients = async () => {
      try {
        const [templatesRes, convRes, usersRes] = await Promise.all([
          api.get("/cards/templates"),
          api.get("/chat/conversations"),
          api.get("/users/search"),
        ]);

        if (templatesRes.data.success) {
          const fetched = templatesRes.data.templates;
          const saved = localStorage.getItem("blink_generated_cards");
          const savedCards = saved ? JSON.parse(saved) : [];
          setTemplates(() => {
            const nonDupSaved = savedCards.filter(sc => !fetched.some(f => f.id === sc.id));
            const combined = [...nonDupSaved, ...fetched];
            const seen = new Set();
            return combined.filter(c => {
              if (seen.has(c.id)) return false;
              seen.add(c.id);
              return true;
            });
          });
        }

        const list = [];
        if (convRes.data.success) {
          convRes.data.conversations.forEach((c) => {
            list.push({
              id: c.id,
              name: `💬 Chat with ${c.user.name} (@${c.user.username})`,
              type: "conversation",
              recipientId: c.user.id,
            });
          });
        }

        if (usersRes.data.success) {
          usersRes.data.users.forEach((u) => {
            const alreadyInConv = list.some(item => item.recipientId === u.id);
            if (!alreadyInConv) {
              list.push({
                id: u.id,
                name: `👤 Send to ${u.name} (@${u.username})`,
                type: "user",
                recipientId: u.id,
              });
            }
          });
        }

        setRecipients(list);
        if (list.length > 0) {
          setSelectedRecipientId(list[0].id);
        }
      } catch (err) {
        console.error("❌ Failed to fetch page data:", err);
      }
    };

    fetchTemplatesAndRecipients();
  }, []);

  const handleGenerateAI = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) {
      toast.error("Please enter a text prompt describing your card.");
      return;
    }

    try {
      setLoading(true);
      const res = await api.post("/cards/generate", {
        prompt,
        occasion,
        theme,
      });

      if (res.data.success) {
        const newCard = res.data.generatedCard;
        setTemplates((prev) => {
          const updated = [newCard, ...prev];
          const saved = localStorage.getItem("blink_generated_cards");
          const savedCards = saved ? JSON.parse(saved) : [];
          const uniqueSaved = [newCard, ...savedCards].filter((item, idx, self) => 
            self.findIndex(t => t.id === item.id) === idx
          );
          localStorage.setItem("blink_generated_cards", JSON.stringify(uniqueSaved));
          
          const seen = new Set();
          return updated.filter(c => {
            if (seen.has(c.id)) return false;
            seen.add(c.id);
            return true;
          });
        });
        toast.success("AI greeting card generated successfully!");
        setPrompt("");
      }
    } catch (err) {
      console.error("❌ AI Generation Error:", err);
      toast.error(err.response?.data?.message || "Failed to generate card.");
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

  const handleSendToChat = async () => {
    if (!selectedRecipientId || !selectedTemplate) {
      toast.error("Please select a recipient first.");
      return;
    }

    const selected = recipients.find((r) => r.id === selectedRecipientId);
    if (!selected) return;

    try {
      setSendingCard(true);
      const payload = {
        text: selectedTemplate.description,
      };

      if (selected.type === "conversation") {
        payload.conversationId = selected.id;
      } else {
        payload.recipientId = selected.id;
      }

      const res = await api.post("/chat/message", payload);
      if (res.data.success) {
        toast.success(`Greeting card sent successfully to ${selected.name}!`);
        setIsPreviewOpen(false);
        router.push(`/chat?userId=${selected.recipientId}`);
      }
    } catch (err) {
      console.error("❌ Failed to send card:", err);
      toast.error("Failed to send card. Please try again.");
    } finally {
      setSendingCard(false);
    }
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
                    className="w-full px-4 py-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-150 dark:border-zinc-800/60 text-xs text-zinc-850 dark:text-zinc-200 focus:outline-none focus:border-[var(--color-brand-accent-pink)] cursor-pointer transition-all duration-200"
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
                      <option key={occ} value={occ} className="text-zinc-850 dark:text-zinc-200">
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
                    className="w-full px-4 py-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-150 dark:border-zinc-800/60 text-xs text-zinc-850 dark:text-zinc-200 focus:outline-none focus:border-[var(--color-brand-accent-pink)] cursor-pointer transition-all duration-200"
                  >
                    {["Minimal", "Cute", "Luxury", "Anime", "Neon", "Glass"].map((th) => (
                      <option key={th} value={th} className="text-zinc-850 dark:text-zinc-200">
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
                    loading={loading}
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
              {templates.map((tpl) => {
                const cardGradient = tpl.gradient || gradients[tpl.theme] || "from-pink-100 to-yellow-100";
                const cardTextColor = tpl.textColor || textColors[tpl.theme] || "text-zinc-800 dark:text-zinc-200";
                const cardBorderStyle = tpl.borderStyle || borderStyles[tpl.theme] || "border-zinc-150 dark:border-zinc-800/80";
                const cardAccentSymbol = tpl.accentSymbol || accentSymbols[tpl.occasion] || "✨";
                const cardDescription = tpl.description || `"${prompt || "Custom greeting"}" — customized especially for this ${tpl.occasion}.`;
                const cardAuthor = tpl.author || "Blink System";

                return (
                  <div
                    key={tpl.id}
                    onClick={() => openPreview(tpl)}
                    className={`group relative flex flex-col justify-between aspect-[1.4] p-6 border ${cardBorderStyle} rounded-[20px] shadow-[0_2px_12px_rgba(0,0,0,0.01)] hover:shadow-md hover:scale-[1.01] transition-all duration-350 cursor-pointer bg-white dark:bg-zinc-900 overflow-hidden`}
                  >
                    {/* Background overlay gradient */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${cardGradient} opacity-[0.18] group-hover:opacity-[0.32] transition-opacity duration-300 pointer-events-none`}
                    />

                    {/* Header */}
                    <div className="flex justify-between items-start z-10">
                      <div>
                        <span className="text-[9px] font-bold uppercase tracking-wider text-[var(--color-brand-accent-pink)]">
                          {tpl.occasion}
                        </span>
                        <h4 className="text-xs font-bold text-zinc-850 dark:text-zinc-150 mt-1">{tpl.title}</h4>
                      </div>
                      <span className="text-2xl">{cardAccentSymbol}</span>
                    </div>

                    {/* Body Snippet */}
                    <p className={`text-[11px] ${cardTextColor} font-semibold line-clamp-2 mt-4 leading-relaxed z-10`}>
                      {cardDescription}
                    </p>

                    {/* Footer */}
                    <div className="flex justify-between items-center mt-6 pt-3 border-t border-zinc-100 dark:border-zinc-800/80 z-10">
                      <span className="text-[9px] text-gray-400 font-semibold">By {cardAuthor}</span>
                      <span className="text-[10px] text-[var(--color-brand-accent-pink)] flex items-center gap-1 font-bold">
                        <span>Preview</span>
                        <Eye size={12} strokeWidth={2.5} />
                      </span>
                    </div>
                  </div>
                );
              })}
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
        {selectedTemplate && (() => {
          const cardGradient = selectedTemplate.gradient || gradients[selectedTemplate.theme] || "from-pink-100 to-yellow-100";
          const cardTextColor = selectedTemplate.textColor || textColors[selectedTemplate.theme] || "text-zinc-850 dark:text-zinc-100";
          const cardBorderStyle = selectedTemplate.borderStyle || borderStyles[selectedTemplate.theme] || "border-zinc-150 dark:border-zinc-800";
          const cardAccentSymbol = selectedTemplate.accentSymbol || accentSymbols[selectedTemplate.occasion] || "✨";
          const cardDescription = selectedTemplate.description || `Custom greeting card for ${selectedTemplate.occasion}.`;
          const cardAuthor = selectedTemplate.author || "Blink System";

          return (
            <div className="space-y-6 flex flex-col items-center">
              {/* Postcard Frame Mockup */}
              <div
                className={`w-full aspect-[1.3] bg-gradient-to-br ${cardGradient} border ${cardBorderStyle} shadow-md rounded-[20px] p-8 flex flex-col justify-between relative overflow-hidden`}
              >
                <div className="absolute inset-0 bg-white/10" />

                <div className="relative z-10 flex justify-between items-start">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-white/80 border border-zinc-100 px-3.5 py-1 rounded-full text-zinc-750">
                    {selectedTemplate.occasion}
                  </span>
                  <span className="text-4xl animate-bounce">{cardAccentSymbol}</span>
                </div>

                <div className="relative z-10 text-center my-4">
                  <p className={`text-sm md:text-base font-semibold ${cardTextColor} tracking-tight leading-relaxed px-4`}>
                    {cardDescription}
                  </p>
                </div>

                <div className="relative z-10 border-t border-zinc-200/40 pt-4 flex justify-between items-center text-[9px] text-zinc-500 font-semibold">
                  <span>Blink Studio Engine v1.0</span>
                  <span>By {cardAuthor}</span>
                </div>
              </div>

              {/* Direct Send Form inside Modal */}
              <div className="w-full border-t border-zinc-100 dark:border-zinc-800/80 pt-4 flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                    Select Friend or Chat to Send
                  </label>
                  <div className="flex gap-2.5">
                    <select
                      value={selectedRecipientId}
                      onChange={(e) => setSelectedRecipientId(e.target.value)}
                      disabled={sendingCard}
                      className="flex-1 px-4 py-2.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-150 dark:border-zinc-800/60 text-xs text-zinc-800 dark:text-zinc-200 focus:outline-none focus:border-[var(--color-brand-accent-pink)] cursor-pointer"
                    >
                      {recipients.length === 0 ? (
                        <option value="">No friends or chats available</option>
                      ) : (
                        recipients.map((r) => (
                          <option key={r.id} value={r.id} className="text-zinc-850 dark:text-zinc-200">
                            {r.name}
                          </option>
                        ))
                      )}
                    </select>
                    <Button
                      onClick={handleSendToChat}
                      disabled={sendingCard || !selectedRecipientId}
                      loading={sendingCard}
                      variant="primary"
                      className="px-5 text-xs font-bold py-2 flex items-center gap-1.5"
                    >
                      <Send size={12} />
                      <span>Send</span>
                    </Button>
                  </div>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex gap-3 w-full border-t border-zinc-100 dark:border-zinc-800/80 pt-4">
                <Button
                  onClick={() => setIsPreviewOpen(false)}
                  variant="secondary"
                  className="w-full py-2.5 text-xs font-bold"
                >
                  Close Preview
                </Button>
              </div>
            </div>
          );
        })()}
      </Modal>
    </div>
  );
};

export default GreetingStudio;
