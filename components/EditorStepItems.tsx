
import React, { useState, useRef, useEffect } from 'react';
import { Plus, Trash2, ListOrdered, Sparkles, RefreshCw, Check, X, Bookmark, ChevronDown } from 'lucide-react';
import { InvoiceData, CatalogItem } from '../types';
import { getAiSuggestions } from '../services/aiService';

interface Props {
  invoice: InvoiceData;
  catalog: CatalogItem[];
  updateItem: (id: string, field: any, value: any) => void;
  addItem: (item?: any) => void;
  removeItem: (id: string) => void;
}

const EditorStepItems: React.FC<Props> = ({ invoice, catalog, updateItem, addItem, removeItem }) => {
  const [loading, setLoading] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const catalogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (catalogRef.current && !catalogRef.current.contains(event.target as Node)) {
        setIsCatalogOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [catalogRef]);

  const handleSuggest = async () => {
    setLoading(true);
    try {
      const suggestions = await getAiSuggestions(invoice.sender.name, invoice.receiver.name);
      suggestions.forEach((s: any) => addItem(s));
    } finally {
      setLoading(false);
    }
  };

  const handleSelectCatalogItem = (item: CatalogItem) => {
    addItem({ description: item.description, rate: item.rate });
    setIsCatalogOpen(false);
  }

  const inputClasses = "w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm font-bold text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all";
  const labelClasses = "text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] block mb-1.5";

  return (
    <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-200 dark:border-slate-800 p-10 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.05)] dark:shadow-none space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
          <div className="p-2.5 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl">
            <ListOrdered className="w-5 h-5 text-indigo-600" />
          </div>
          Articles & Services
        </h2>
        <button 
          onClick={handleSuggest} 
          disabled={loading} 
          className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/30 px-4 py-2 rounded-xl text-xs font-bold hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-all border border-indigo-100 dark:border-indigo-900/50 outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500 dark:focus-visible:ring-offset-slate-900"
        >
          {loading ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />} Suggestions IA
        </button>
      </div>
      
      <div className="space-y-4">
        {invoice.items.length > 0 ? (
          <div className="grid grid-cols-12 gap-4 mb-2 px-2 hidden sm:grid">
            <span className={`${labelClasses} col-span-6`}>Description</span>
            <span className={`${labelClasses} col-span-2 text-center`}>Qté</span>
            <span className={`${labelClasses} col-span-3 text-right`}>Prix Unitaire</span>
          </div>
        ) : null}

        {invoice.items.map(item => (
          <div key={item.id} className={`bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border transition-all ${confirmDeleteId === item.id ? 'border-red-200 dark:border-red-900 ring-2 ring-red-500/10' : 'border-slate-200 dark:border-slate-800'}`}>
              {confirmDeleteId === item.id ? (
                <div className="col-span-12 flex items-center justify-between animate-in fade-in slide-in-from-top-1 duration-200">
                  <div className="flex items-center gap-3">
                    <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-lg"><Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" /></div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">Supprimer cet article ?</p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium italic">Cette action est irréversible.</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setConfirmDeleteId(null)} className="px-4 py-2 bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-200 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-600 hover:bg-slate-50 transition-all flex items-center gap-1 outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-500 dark:focus-visible:ring-offset-slate-900"><X className="w-3 h-3" /> Annuler</button>
                    <button onClick={() => { removeItem(item.id); setConfirmDeleteId(null); }} className="px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-200 dark:shadow-none flex items-center gap-1 outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-500 dark:focus-visible:ring-offset-slate-900"><Check className="w-3 h-3" /> Confirmer</button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-12 gap-x-4 gap-y-3 sm:items-center">
                  <div className="col-span-12 sm:col-span-6">
                    <label className={`${labelClasses} sm:hidden`}>Description</label>
                    <input className={inputClasses} value={item.description} onChange={(e) => updateItem(item.id, 'description', e.target.value)} placeholder="Description..." />
                  </div>
                  <div className="col-span-5 sm:col-span-2">
                    <label className={`${labelClasses} sm:hidden`}>Qté</label>
                    <input type="number" className={`${inputClasses} text-center`} value={item.quantity} onChange={(e) => updateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)} />
                  </div>
                  <div className="col-span-5 sm:col-span-3">
                    <label className={`${labelClasses} sm:hidden`}>Prix Unitaire</label>
                    <input type="number" className={`${inputClasses} text-right`} value={item.rate} onChange={(e) => updateItem(item.id, 'rate', parseFloat(e.target.value) || 0)} />
                  </div>
                  <div className="col-span-2 sm:col-span-1 flex justify-end items-end sm:items-center h-full">
                    <button onClick={() => setConfirmDeleteId(item.id)} className="p-2 text-slate-300 dark:text-slate-600 hover:text-red-500 dark:hover:text-red-400 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-red-500 rounded-full" aria-label={`Supprimer l'article ${item.description}`}><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              )}
          </div>
        ))}
        
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <button 
            onClick={() => addItem()} 
            className="flex-1 py-4 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-slate-400 dark:text-slate-500 text-sm font-bold hover:border-indigo-400 dark:hover:border-indigo-700 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all flex items-center justify-center gap-2 bg-white/50 dark:bg-slate-900/50 outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500 dark:focus-visible:ring-offset-slate-900"
          >
            <Plus className="w-4 h-4" /> Ajouter une Ligne (Alt+N)
          </button>
          <div className="relative flex-1" ref={catalogRef}>
             <button 
                onClick={() => setIsCatalogOpen(p => !p)} 
                aria-haspopup="true"
                aria-expanded={isCatalogOpen}
                className="w-full py-4 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-slate-400 dark:text-slate-500 text-sm font-bold hover:border-indigo-400 dark:hover:border-indigo-700 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all flex items-center justify-center gap-2 bg-white/50 dark:bg-slate-900/50 outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500 dark:focus-visible:ring-offset-slate-900"
            >
                <Bookmark className="w-4 h-4" /> Ajouter du Catalogue <ChevronDown className={`w-4 h-4 transition-transform ${isCatalogOpen ? 'rotate-180' : ''}`} />
            </button>
            {isCatalogOpen && (
                <div className="absolute bottom-full right-0 mb-2 w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border dark:border-slate-700 z-10 overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-200">
                    <div className="p-2 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase text-center border-b dark:border-slate-700">Sélectionner un article</div>
                    <div role="menu" className="max-h-60 overflow-y-auto">
                      {catalog.length > 0 ? (
                        catalog.map(item => (
                            <button role="menuitem" key={item.id} onClick={() => handleSelectCatalogItem(item)} className="w-full text-left flex justify-between items-center p-3 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors outline-none focus-visible:bg-indigo-50 dark:focus-visible:bg-slate-700">
                                <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{item.description}</span>
                                <span className="text-xs font-bold text-indigo-500 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/40 px-2 py-1 rounded-md">{item.rate.toLocaleString()}</span>
                            </button>
                        ))
                      ) : (
                        <p className="text-center text-xs text-slate-400 py-6">Votre catalogue est vide. Ajoutez des articles dans l'onglet "Catalogue".</p>
                      )}
                    </div>
                </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default EditorStepItems;
