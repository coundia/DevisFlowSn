
import React, { useState } from 'react';
import { Bookmark, Plus, Trash2 } from 'lucide-react';
import { CatalogItem } from '../types';

interface Props {
  catalog: CatalogItem[];
  onAdd: (item: Omit<CatalogItem, 'id'>) => void;
  onUpdate: (id: string, updates: Partial<CatalogItem>) => void;
  onDelete: (id: string) => void;
}

const EditorStepCatalog: React.FC<Props> = ({ catalog, onAdd, onUpdate, onDelete }) => {
  const [newDesc, setNewDesc] = useState('');
  const [newRate, setNewRate] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDesc.trim() || !newRate.trim()) return;
    onAdd({ description: newDesc, rate: parseFloat(newRate) });
    setNewDesc('');
    setNewRate('');
  };

  const inputClasses = "w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm font-bold text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all";
  const labelClasses = "text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] block";

  return (
    <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-200 dark:border-slate-800 p-10 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.05)] dark:shadow-none space-y-8">
      <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
        <div className="p-2.5 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl">
          <Bookmark className="w-5 h-5 text-indigo-600" />
        </div>
        Catalogue de Services/Articles
      </h2>
      
      <div className="space-y-4">
        {catalog.length > 0 ? (
          <>
            <div className="grid grid-cols-12 gap-4 mb-2 px-2 hidden sm:grid">
                <span className={`${labelClasses} col-span-7`}>Description</span>
                <span className={`${labelClasses} col-span-4 text-right`}>Prix Unitaire</span>
            </div>
            {catalog.map(item => (
            <div key={item.id} className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl border border-slate-200 dark:border-slate-800">
                <div className="grid grid-cols-12 gap-3 items-center">
                    <div className="sm:col-span-7 col-span-12"><input className={inputClasses} value={item.description} onChange={(e) => onUpdate(item.id, { description: e.target.value })} placeholder="Description..." /></div>
                    <div className="grid grid-cols-subgrid sm:col-span-5 col-span-12 gap-2">
                        <div className="sm:col-span-3 col-span-9"><input type="number" className={`${inputClasses} text-right`} value={item.rate} onChange={(e) => onUpdate(item.id, { rate: parseFloat(e.target.value) || 0 })} /></div>
                        <div className="sm:col-span-2 col-span-3 flex justify-end items-center"><button onClick={() => onDelete(item.id)} className="p-2 text-slate-300 dark:text-slate-600 hover:text-red-500 dark:hover:text-red-400 transition-colors" title="Supprimer"><Trash2 className="w-4 h-4" /></button></div>
                    </div>
                </div>
            </div>
            ))}
          </>
        ) : (
            <div className="text-center text-xs text-slate-400 py-10 border border-dashed rounded-2xl border-slate-200 dark:border-slate-800">
                <p className="font-bold">Votre catalogue est vide.</p>
                <p className="mt-1">Ajoutez vos services ou articles pour les réutiliser facilement.</p>
            </div>
        )}
      </div>

      <form onSubmit={handleAdd} className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center gap-4">
        <input 
            className={`${inputClasses} flex-grow`}
            value={newDesc}
            onChange={e => setNewDesc(e.target.value)}
            placeholder="Description du service/article"
            required
        />
        <input 
            type="number"
            className={`${inputClasses} sm:w-40 text-right`}
            value={newRate}
            onChange={e => setNewRate(e.target.value)}
            placeholder="Prix"
            required
        />
        <button 
          type="submit" 
          className="w-full sm:w-auto px-6 py-3 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-100 dark:shadow-none"
        >
          <Plus className="w-4 h-4" /> Ajouter
        </button>
      </form>
    </div>
  );
};
export default EditorStepCatalog;
