
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, X, MessageSquare, WifiOff } from 'lucide-react';
import { handleAiChat } from '../services/aiService';
import { InvoiceData } from '../types';

interface Props {
  invoice: InvoiceData;
  onInvoiceUpdate: (updated: InvoiceData) => void;
  isOnline: boolean;
}

const ChatAssistant: React.FC<Props> = ({ invoice, onInvoiceUpdate, isOnline }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([{ role: 'assistant', text: "Bonjour ! Je peux vous aider à modifier votre facture par simple commande vocale ou textuelle. Que souhaitez-vous faire ?" }]);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

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
      <div className={`fixed inset-y-0 right-0 w-full sm:w-[450px] bg-white dark:bg-slate-900 shadow-2xl z-[100] transition-transform duration-500 ease-in-out border-l dark:border-slate-800 flex flex-col no-print ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-6 border-b dark:border-slate-800 flex justify-between items-center bg-slate-900 text-white">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-500 p-2 rounded-lg">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-sm">Assistant IA DevisFlow</h3>
              <p className="text-[10px] text-slate-400">
                {isOnline ? 'En ligne • Optimisé par Gemini 3' : 'Mode hors-ligne'}
              </p>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-slate-800 rounded-lg transition-colors"><X className="w-5 h-5" /></button>
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
            className="flex-1 bg-slate-50 dark:bg-slate-800 border dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 dark:text-slate-100 outline-none focus:ring-2 ring-indigo-500/20 disabled:opacity-50" 
            value={input} 
            disabled={!isOnline}
            onChange={e => setInput(e.target.value)} 
            placeholder={isOnline ? "Ex: Ajoute un service de maintenance..." : "Connexion requise..."} 
          />
          <button 
            type="submit" 
            disabled={loading || !input.trim() || !isOnline} 
            className="bg-indigo-600 text-white p-3 rounded-xl disabled:opacity-50 shadow-lg shadow-indigo-200 dark:shadow-none transition-all active:scale-90"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
      
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)} 
          className="fixed bottom-8 right-8 w-16 h-16 bg-slate-900 dark:bg-indigo-600 text-white rounded-full flex items-center justify-center shadow-2xl z-50 hover:scale-110 active:scale-90 transition-all group"
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
