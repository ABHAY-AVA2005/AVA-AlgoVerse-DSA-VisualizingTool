import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, X, Send, Sparkles } from 'lucide-react';
import { cn } from '../../lib/utils';

interface AIAssistantProps {
  activeSection: string;
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  role: 'system' | 'user' | 'model';
  text: string;
}

export const AIAssistant: React.FC<AIAssistantProps> = ({ activeSection, isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const lastSectionRef = useRef("");

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        { role: 'system', text: `> SYSTEM_LINK ESTABLISHED [${activeSection.toUpperCase()}]` },
        { role: 'model', text: `I am **AVA**. Connected to **Pollinations AI**. Ready.` }
      ]);
      lastSectionRef.current = activeSection;
    }
  }, [activeSection]);

  useEffect(() => {
    if (activeSection !== lastSectionRef.current && messages.length > 0) {
        setMessages(prev => [
            ...prev,
            { role: 'system', text: `> CONTEXT UPDATED: [${activeSection.toUpperCase()}]` }
        ]);
        lastSectionRef.current = activeSection;
    }
  }, [activeSection, messages.length]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isTyping, isOpen]);

  const fetchAIResponse = async (userQuery: string, history: Message[]) => {
    const createURL = (query: string, hist: Message[]) => {
        const cleanHistory = hist.slice(-2).map(m => {
            let text = m.text.replace(/```[\s\S]*?```/g, '[Code Snippet]');
            text = text.length > 100 ? text.substring(0, 100) + "..." : text;
            return `${m.role === 'user' ? 'User' : 'AVA'}: ${text}`;
        }).join('\n');
        const systemPrompt = `You are AVA. Context: ${activeSection}. Concise answers.`;
        const fullPrompt = `${systemPrompt}\n\nPrev: ${cleanHistory}\nUser: ${query}\nAVA:`;
        return `https://text.pollinations.ai/${encodeURIComponent(fullPrompt)}`;
    };
    try {
      const urlWithContext = createURL(userQuery, history);
      let response = await fetch(urlWithContext, { method: 'GET', cache: 'no-cache' });
      if (!response.ok) {
          const urlSimple = `https://text.pollinations.ai/${encodeURIComponent(`User: ${userQuery}\nAVA:`)}`;
          response = await fetch(urlSimple, { method: 'GET', cache: 'no-cache' });
      }
      if (!response.ok) return "System Overload. Please ask a simpler question.";
      return await response.text() || "No Data.";
    } catch (error) {
      return "Connection Failed. Retrying...";
    }
  };

  const handleSend = async (override?: string) => {
    const txt = override || input;
    if (!txt.trim()) return;
    setInput('');
    const userMsg = { role: 'user' as const, text: txt };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);
    try {
      const reply = await fetchAIResponse(txt, messages);
      setMessages(prev => [...prev, { role: 'model', text: reply }]);
    } catch (error: any) {
      setMessages(prev => [...prev, { role: 'system', text: `⚠️ Error: ${error.message}` }]);
    } finally {
      setIsTyping(false);
    }
  };

  const clearChat = () => {
      setMessages([
        { role: 'system', text: `> MEMORY FLUSHED.` },
        { role: 'model', text: `Ready.` }
      ]);
  };

  const renderMessage = (text: string) => {
    let formatted = text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    formatted = formatted.replace(/```([\s\S]*?)```/g, '<div class="bg-black/50 border border-white/10 rounded p-2 my-2 font-mono text-[10px] whitespace-pre-wrap text-neutral-300">$1</div>');
    formatted = formatted.replace(/`([^`]+)`/g, '<span class="bg-white/10 px-1 rounded font-mono text-cyan-300">$1</span>');
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<span class="text-cyan-400 font-bold">$1</span>');
    formatted = formatted.replace(/\n/g, '<br />');
    return <span dangerouslySetInnerHTML={{ __html: formatted }} />;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black/60 backdrop-blur-[2px] z-[100] cursor-pointer" />
          <motion.div initial={{ x: '100%', opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: '100%', opacity: 0 }} transition={{ type: "spring", damping: 25, stiffness: 200 }} className="fixed inset-y-4 right-4 w-[90vw] sm:w-[420px] bg-[var(--bg-secondary)]/95 backdrop-blur-2xl border border-[var(--border-color)] rounded-2xl z-[101] shadow-2xl flex flex-col overflow-hidden no-scroll" >
            <div className="h-14 border-b border-[var(--border-color)] flex justify-between items-center px-6 bg-[var(--bg-primary)]/50">
              <div className="flex items-center gap-3">
                 <div className="w-2 h-2 bg-[var(--primary)] rounded-full animate-pulse" />
                 <div className="flex flex-col">
                    <span className="font-mono font-bold text-[var(--text-primary)] text-xs tracking-[0.2em]">AVA</span>
                    <span className="text-[8px] text-[var(--text-secondary)] font-mono uppercase tracking-widest">Pollinations Net</span>
                 </div>
              </div>
              <div className="flex gap-2">
                  <button onClick={clearChat} className="text-[var(--text-secondary)] hover:text-rose-500 transition-colors" title="Clear History">
                    <Trash2 size={16} />
                  </button>
                  <button onClick={onClose} className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                    <X size={16} />
                  </button>
              </div>
            </div>
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-6 scroll-smooth">
               {messages.map((m, i) => (
                 <motion.div key={i} initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} className={cn("flex flex-col gap-1", m.role === 'user' ? "items-end" : "items-start")}>
                    {m.role !== 'system' && <span className="text-[9px] text-[var(--text-secondary)] font-mono uppercase tracking-wider mb-1">{m.role === 'user' ? 'OPERATOR' : 'AVA CORE'}</span>}
                    <div className={cn("max-w-[85%] px-4 py-3 text-xs font-mono leading-relaxed border shadow-sm", m.role === 'model' ? "bg-[var(--card-bg)] border-[var(--border-color)] rounded-tr-xl rounded-br-xl rounded-bl-xl text-[var(--text-primary)]" : m.role === 'user' ? "bg-[var(--primary)]/10 border-[var(--primary)]/30 rounded-tl-xl rounded-bl-xl rounded-br-xl text-[var(--text-primary)]" : "w-full text-center bg-transparent border-none text-[10px] text-[var(--error)]")}>
                        {m.role === 'system' ? <span>{m.text}</span> : renderMessage(m.text)}
                    </div>
                 </motion.div>
               ))}
               {isTyping && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 px-1"><span className="text-[10px] text-[var(--primary)] font-mono animate-pulse">COMPUTING</span></motion.div>}
            </div>
            <div className="p-4 border-t border-[var(--border-color)] bg-[var(--bg-primary)]/50">
               <div className="relative flex items-center gap-2">
                  <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && !isTyping && handleSend()} placeholder="Enter command..." className="relative w-full bg-[var(--card-bg)] border border-[var(--border-color)] rounded px-4 py-3 text-xs font-mono text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)] transition-all" />
                  <button onClick={() => handleSend()} disabled={!input.trim() || isTyping} className="p-3 bg-[var(--card-bg)] border border-[var(--border-color)] rounded hover:bg-[var(--primary)]/10 hover:border-[var(--primary)] text-[var(--text-secondary)] transition-all disabled:opacity-30"><Send size={14} /></button>
               </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
