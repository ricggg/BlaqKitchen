"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Dumbbell } from "lucide-react";

type Msg = { role: "user" | "assistant"; text: string };

const INTRO: Msg = {
  role: "assistant",
  text: "Hey! I'm the Blag GYM assistant. Ask me about classes, membership pricing, trainers, or Blags Kitchen — or I can help you book a session.",
};

export default function AIChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([INTRO]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  async function handleSend() {
    const text = input.trim();
    if (!text || sending) return;
    const nextMessages: Msg[] = [...messages, { role: "user", text }];
    setMessages(nextMessages);
    setInput("");
    setSending(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
      });
      const data = await res.json();
      setMessages((m) => [
        ...m,
        { role: "assistant", text: data.reply ?? "Sorry, I didn't catch that — try again?" },
      ]);
    } catch {
      setMessages((m) => [
        ...m,
        { role: "assistant", text: "I'm having trouble connecting right now — try again in a moment." },
      ]);
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      <motion.button
        aria-label="Open chat"
        onClick={() => setOpen((v) => !v)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-5 right-5 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-[var(--color-blaze)] text-white shadow-2xl shadow-black/50"
      >
        {open ? <X size={22} /> : <MessageCircle size={22} />}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-5 z-50 w-[92vw] max-w-sm h-[65vh] max-h-[520px] rounded-md border border-[var(--color-border-strong)] bg-[var(--color-surface)] shadow-2xl flex flex-col overflow-hidden"
          >
            <div className="flex items-center gap-2 px-4 py-3 border-b border-[var(--color-border)] bg-[var(--color-surface-elevated)]">
              <Dumbbell size={18} className="text-[var(--color-blaze)]" />
              <p className="text-sm font-semibold text-[var(--color-text)]">Blag GYM Assistant</p>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`max-w-[85%] rounded-md px-3.5 py-2.5 text-sm leading-relaxed ${
                    m.role === "user"
                      ? "ml-auto bg-[var(--color-blaze)] text-white"
                      : "bg-[var(--color-surface-elevated)] text-[var(--color-text)] border border-[var(--color-border)]"
                  }`}
                >
                  {m.text}
                </div>
              ))}
              {sending && (
                <div className="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] text-[var(--color-text-faint)] rounded-md px-3.5 py-2.5 text-sm w-fit">
                  Typing…
                </div>
              )}
            </div>

            <div className="p-3 border-t border-[var(--color-border)] flex items-center gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Ask about classes, pricing, menu…"
                className="flex-1 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-sm px-3 py-2 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-faint)] focus:outline-none focus:border-[var(--color-blaze)]"
              />
              <button
                onClick={handleSend}
                aria-label="Send message"
                className="w-9 h-9 shrink-0 flex items-center justify-center rounded-sm bg-[var(--color-blaze)] text-white"
              >
                <Send size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
