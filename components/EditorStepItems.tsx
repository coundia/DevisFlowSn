
import React, { useState } from 'react';
import { Plus, Trash2, ListOrdered, Sparkles, RefreshCw, Check, X } from 'lucide-react';
import { InvoiceData } from '../types';
import { getAiSuggestions } from '../services/aiService';

interface Props {
  invoice: InvoiceData;
  updateItem: (id: string, field: any, value: any) => void;
  addItem: (item?: any) => void;
  removeItem: (id: string) => void;
}

const EditorStepItems: React.FC<Props> = ({ invoice, updateItem, addItem, removeItem }) => {
  const [loading, setLoading] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const handleSuggest = async () => {
    setLoading(true);
    try {
      const suggestions = await getAiSuggestions(invoice.sender.name, invoice.receiver.name);
      suggestions.forEach((s: any) => addItem(s));
    } finally {
      setLoading(false);
    }
  };

  const inputClasses = "w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm font-bold text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all";

  return (
    <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 p-8 shadow-sm transition-colors">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ListOrdered className="w-5 h-5 text-indigo-600" /> Articles & Services
        </h2>
        <button 
          onClick={handleSuggest} 
          disabled={loading} 
          className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/30 px-4 py-2 rounded-xl text-xs font-bold hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-all border border-indigo-100 dark:border-indigo-900/50"
        >
          {loading ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />} Suggestions IA
        </button>
      </div>
      
      <div className="space-y-4">
        {invoice.items.length > 0 ? (
          <div className="grid grid-cols-12 gap-2 mb-2 px-1 hidden sm:grid">
            <span className="col-span-6 text-[10px] font-black text-slate-400 uppercase">Description</span>
            <span className="col-span-2 text-[10px] font-black text-slate-400 uppercase text-center">Qté</span>
            <span className="col-span-3 text-[10px] font-black text-slate-400 uppercase text-right">Prix Unitaire</span>
          </div>
        ) : null}

        {invoice.items.map(item => (
          <div key={item.id} className={`bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border transition-all ${confirmDeleteId === item.id ? 'border-red-200 dark:border-red-900 ring-2 ring-red-500/10' : 'border-slate-100 dark:border-slate-800'}`}>
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
              {confirmDeleteId === item.id ? (
                <div className="col-span-12 flex items-center justify-between animate-in fade-in slide-in-from-top-1 duration-200">
                  <div className="flex items-center gap-3">
                    <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-lg">
                      <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">Supprimer cet article ?</p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium italic">Cette action est irréversible.</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setConfirmDeleteId(null)} 
                      className="px-4 py-2 bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-200 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-600 hover:bg-slate-50 transition-all flex items-center gap-1"
                    >
                      <X className="w-3 h-3" /> Annuler
                    </button>
                    <button 
                      onClick={() => { removeItem(item.id); setConfirmDeleteId(null); }} 
                      className="px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-200 dark:shadow-none flex items-center gap-1"
                    >
                      <Check className="w-3 h-3" /> Confirmer
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="sm:col-span-6">
                    <input 
                      className={inputClasses} 
                      value={item.description} 
                      onChange={(e) => updateItem(item.id, 'description', e.target.value)} 
                      placeholder="Description du service..."
                    />
                  </div>
                  <div className="grid grid-cols-3 sm:col-span-6 gap-2">
                    <div className="col-span-1">
                      <input 
                        type="number" 
                        className={`${inputClasses} text-center`}
                        value={item.quantity} 
                        onChange={(e) => updateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)} 
                      />
                    </div>
                    <div className="col-span-1">
                      <input 
                        type="number" 
                        className={`${inputClasses} text-right`}
                        value={item.rate} 
                        onChange={(e) => updateItem(item.id, 'rate', parseFloat(e.target.value) || 0)} 
                      />
                    </div>
                    <div className="col-span-1 flex justify-end items-center">
                      <button 
                        onClick={() => setConfirmDeleteId(item.id)} 
                        className="p-2 text-slate-300 dark:text-slate-600 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                        title="Supprimer l'article"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
        
        <button 
          onClick={() => addItem()} 
          className="w-full py-5 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-slate-400 dark:text-slate-500 text-sm font-bold hover:border-indigo-400 dark:hover:border-indigo-700 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all flex items-center justify-center gap-2 bg-white/50 dark:bg-slate-900/50"
        >
          <Plus className="w-4 h-4" /> Ajouter un nouvel article
        </button>
      </div>
    </div>
  );
};
export default EditorStepItems;
