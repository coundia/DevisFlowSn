
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, X, MessageSquare, Sparkles } from 'lucide-react';
import { handleAiChat } from '../services/aiService';
import { InvoiceData } from '../types';

interface Props {
  invoice: InvoiceData;
  onInvoiceUpdate: (updated: InvoiceData) => void;
}

const ChatAssistant: React.FC<Props> = ({ invoice, onInvoiceUpdate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([{ role: 'assistant', text: "Comment puis-je vous aider ?" }]);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => endRef.current?.scrollIntoView({ behavior: 'smooth' }), [messages, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    const msg = input; setInput(''); setLoading(true);
    setMessages(p => [...p, { role: 'user', text: msg }]);
    
    try {
      const res = await handleAiChat(msg, invoice);
      if (res.updatedInvoice) onInvoiceUpdate(res.updatedInvoice);
      setMessages(p => [...p, { role: 'assistant', text: res.assistantMessage }]);
    } catch {
      setMessages(p => [...p, { role: 'assistant', text: "Erreur, réessayez." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className={`fixed inset-y-0 right-0 w-full sm:w-[400px] bg-white shadow-2xl z-[100] transition-transform duration-500 ease-in-out border-l flex flex-col no-print ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-6 border-b flex justify-between items-center bg-slate-900 text-white">
          <div className="flex items-center gap-3"><Bot className="w-5 h-5" /><h3 className="font-bold text-sm">Assistant IA</h3></div>
          <button onClick={() => setIsOpen(false)}><X className="w-5 h-5" /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] p-4 rounded-2xl text-sm ${m.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-white text-slate-900 shadow-sm border'}`}>{m.text}</div>
            </div>
          ))}
          <div ref={endRef} />
        </div>
        <form onSubmit={handleSubmit} className="p-6 border-t bg-white flex gap-2">
          <input className="flex-1 bg-slate-50 rounded-xl px-4 text-sm font-bold text-slate-900 outline-none focus:ring-1 ring-indigo-500" value={input} onChange={e => setInput(e.target.value)} placeholder="Action..." />
          <button type="submit" disabled={loading} className="bg-indigo-600 text-white p-3 rounded-xl disabled:opacity-50"><Send className="w-4 h-4" /></button>
        </form>
      </div>
      {!isOpen && <button onClick={() => setIsOpen(true)} className="fixed bottom-8 right-8 w-16 h-16 bg-slate-900 text-white rounded-full flex items-center justify-center shadow-2xl z-50"><MessageSquare className="w-7 h-7" /></button>}
    </>
  );
};
export default ChatAssistant;
