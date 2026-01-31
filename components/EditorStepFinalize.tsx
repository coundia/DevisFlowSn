
import React from 'react';
import { FileCheck, Palette } from 'lucide-react';
import { InvoiceData, INVOICE_THEMES } from '../types';

interface Props {
  invoice: InvoiceData;
  onUpdate: (field: string, value: any) => void;
}

const EditorStepFinalize: React.FC<Props> = ({ invoice, onUpdate }) => {
  const inputClasses = "w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400";
  const labelClasses = "text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase block mb-1.5 ml-1";

  return (
    <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 p-8 shadow-sm space-y-8 transition-colors">
      <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
        <FileCheck className="w-5 h-5 text-indigo-600" /> Options & Rendu
      </h2>
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className={labelClasses}>Devise de facturation</label>
          <select className={inputClasses} value={invoice.currency} onChange={e => onUpdate('currency', e.target.value)}>
            <option value="XOF">FCFA (Sénégal)</option>
            <option value="EUR">Euro (€)</option>
            <option value="USD">Dollar ($)</option>
          </select>
        </div>
        <div>
          <label className={labelClasses}>Taux TVA (%)</label>
          <input type="number" className={inputClasses} value={invoice.taxRate} onChange={e => onUpdate('taxRate', parseFloat(e.target.value) || 0)} />
        </div>
        <div className="col-span-2">
          <label className={labelClasses}>Notes de bas de page</label>
          <textarea className={inputClasses} rows={3} value={invoice.notes} onChange={e => onUpdate('notes', e.target.value)} placeholder="Ex: Merci pour votre confiance. Informations bancaires..." />
        </div>
      </div>
      
      <div>
        <label className={`${labelClasses} flex items-center gap-2 mb-4`}><Palette className="w-3 h-3" /> Thème Graphique</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {INVOICE_THEMES.map(t => (
            <button 
              key={t.id} 
              onClick={() => onUpdate('themeId', t.id)} 
              className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${invoice.themeId === t.id ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/30' : 'border-slate-50 dark:border-slate-800 bg-white dark:bg-slate-800 hover:border-slate-200 dark:hover:border-slate-700'}`}
            >
              <div className="w-8 h-8 rounded-full border shadow-sm" style={{ background: t.accent }} />
              <span className={`text-[10px] font-black uppercase tracking-tight ${invoice.themeId === t.id ? 'text-indigo-700 dark:text-indigo-300' : 'text-slate-500 dark:text-slate-400'}`}>{t.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
export default EditorStepFinalize;
