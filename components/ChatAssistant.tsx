
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, X, MessageSquare, WifiOff } from 'lucide-react';
import { handleAiChat } from '../services/aiService';
import { InvoiceData } from '../types';

interface Props {
  invoice: InvoiceData;
  onInvoiceUpdate: (updated: Partial<InvoiceData>) => void;
  isOnline: boolean;
  isOpen: boolean;
  onClose: () => void;
  openerRef: React.RefObject<HTMLButtonElement>;
}

const ChatAssistant: React.FC<Props> = ({ invoice, onInvoiceUpdate, isOnline, isOpen, onClose, openerRef }) => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([{ role: 'assistant', text: "Bonjour ! Je peux vous aider à modifier votre facture. Que souhaitez-vous faire ?" }]);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
        endRef.current?.scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => inputRef.current?.focus(), 100); 

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
            if (e.key === 'Tab') {
                 if (!panelRef.current) return;
                 const focusable = panelRef.current.querySelectorAll<HTMLElement>('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
                 const first = focusable[0];
                 const last = focusable[focusable.length - 1];
                 if (e.shiftKey && document.activeElement === first) {
                     last.focus();
                     e.preventDefault();
                 } else if (!e.shiftKey && document.activeElement === last) {
                     first.focus();
                     e.preventDefault();
                 }
            }
        };
        
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading || !isOnline) return;
    const msg = input; setInput(''); setLoading(true);
    setMessages(p => [...p, { role: 'user', text: msg }]);
    
    try {
      const res = await handleAiChat(msg, invoice);
      if (res.updatedInvoice) onInvoiceUpdate(res.updatedInvoice);
      setMessages(p => [...p, { role: 'assistant', text: res.assistantMessage }]);
    } catch {
      setMessages(p => [...p, { role: 'assistant', text: "Désolé, j'ai rencontré une erreur technique. Veuillez réessayer." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div ref={panelRef} className={`fixed inset-y-0 right-0 w-full sm:w-[450px] bg-white dark:bg-slate-900 shadow-2xl z-[100] transition-transform duration-500 ease-in-out border-l dark:border-slate-800 flex flex-col no-print ${isOpen ? 'translate-x-0' : 'translate-x-full'}`} role="dialog" aria-modal="true" aria-labelledby="chat-assistant-title">
        <div className="p-6 border-b dark:border-slate-800 flex justify-between items-center bg-slate-900 text-white">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-500 p-2 rounded-lg">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 id="chat-assistant-title" className="font-bold text-sm">Assistant IA DevisFlow</h3>
              <p className="text-[10px] text-slate-400">
                {isOnline ? 'En ligne • Optimisé par Gemini 3' : 'Mode hors-ligne'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-lg transition-colors outline-none focus-visible:ring-2 focus-visible:ring-indigo-400" aria-label="Fermer l'assistant IA"><X className="w-5 h-5" /></button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50 dark:bg-slate-950/30">
          {!isOnline && (
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-900/50 p-4 rounded-xl flex gap-3 items-center animate-in fade-in zoom-in duration-300">
              <WifiOff className="w-5 h-5 text-amber-600 shrink-0" />
              <p className="text-xs text-amber-800 dark:text-amber-300 font-bold leading-relaxed">
                L'assistant IA nécessite une connexion internet. Vous pouvez continuer à éditer manuellement votre facture.
              </p>
            </div>
          )}
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${m.role === 'user' ? 'bg-indigo-600 text-white font-medium' : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border dark:border-slate-700'}`}>
                {m.text}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border dark:border-slate-700 flex gap-1">
                <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" />
                <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 border-t dark:border-slate-800 bg-white dark:bg-slate-900 flex gap-3">
          <input 
            ref={inputRef}
            className="flex-1 bg-slate-50 dark:bg-slate-800 border dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 dark:text-slate-100 outline-none focus:ring-2 ring-transparent focus:ring-indigo-500 disabled:opacity-50" 
            value={input} 
            disabled={!isOnline}
            onChange={e => setInput(e.target.value)} 
            placeholder={isOnline ? "Ex: Ajoute un service de maintenance..." : "Connexion requise..."} 
          />
          <button 
            type="submit" 
            disabled={loading || !input.trim() || !isOnline} 
            aria-label="Envoyer le message"
            className="bg-indigo-600 text-white p-3 rounded-xl disabled:opacity-50 shadow-lg shadow-indigo-200 dark:shadow-none transition-all active:scale-90 outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500 dark:focus-visible:ring-offset-slate-900"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
      
      {!isOpen && (
        <button 
          ref={openerRef}
          onClick={() => isOpen ? onClose() : (panelRef.current?.focus(), setTimeout(() => inputRef.current?.focus(), 100))}
          aria-haspopup="dialog"
          aria-label="Ouvrir l'assistant IA (Ctrl+K)"
          className="fixed bottom-8 right-8 w-16 h-16 bg-slate-900 dark:bg-indigo-600 text-white rounded-full flex items-center justify-center shadow-2xl z-50 hover:scale-110 active:scale-90 transition-all group outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500 dark:focus-visible:ring-offset-slate-950"
        >
          <MessageSquare className="w-7 h-7 group-hover:rotate-12 transition-transform" />
          {isOnline && <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-950" />}
          {!isOnline && <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 rounded-full border-2 border-white dark:border-slate-950 flex items-center justify-center text-[8px] font-black"><WifiOff className="w-2 h-2 text-white" /></div>}
        </button>
      )}
    </>
  );
};
export default ChatAssistant;
