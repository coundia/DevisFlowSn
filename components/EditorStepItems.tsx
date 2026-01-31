
import React, { useState } from 'react';
import { Plus, Trash2, ListOrdered, Sparkles, RefreshCw } from 'lucide-react';
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

  const handleSuggest = async () => {
    setLoading(true);
    try {
      const suggestions = await getAiSuggestions(invoice.sender.name, invoice.receiver.name);
      suggestions.forEach((s: any) => addItem(s));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-[2rem] border border-slate-100 p-8 shadow-sm">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <ListOrdered className="w-5 h-5 text-indigo-600" /> Articles
        </h2>
        <button onClick={handleSuggest} disabled={loading} className="flex items-center gap-2 text-indigo-600 bg-indigo-50 px-4 py-2 rounded-xl text-xs font-bold hover:bg-indigo-100 transition-all">
          {loading ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />} IA Suggest
        </button>
      </div>
      <div className="space-y-4">
        {invoice.items.map(item => (
          <div key={item.id} className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
            <div className="grid grid-cols-12 gap-4">
              <input className="col-span-7 bg-transparent font-bold text-slate-900 text-sm focus:ring-0 border-none p-0" value={item.description} onChange={(e) => updateItem(item.id, 'description', e.target.value)} />
              <input type="number" className="col-span-2 bg-transparent text-center font-bold text-sm focus:ring-0 border-none p-0" value={item.quantity} onChange={(e) => updateItem(item.id, 'quantity', parseFloat(e.target.value))} />
              <input type="number" className="col-span-2 bg-transparent text-right font-bold text-sm focus:ring-0 border-none p-0" value={item.rate} onChange={(e) => updateItem(item.id, 'rate', parseFloat(e.target.value))} />
              <button onClick={() => removeItem(item.id)} className="col-span-1 flex justify-end text-slate-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
        <button onClick={() => addItem()} className="w-full py-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-500 text-sm font-bold hover:border-indigo-400 hover:text-indigo-600 transition-all flex items-center justify-center gap-2">
          <Plus className="w-4 h-4" /> Ajouter un article
        </button>
      </div>
    </div>
  );
};
export default EditorStepItems;
