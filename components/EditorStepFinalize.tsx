
import React from 'react';
import { FileCheck, Palette } from 'lucide-react';
import { InvoiceData, INVOICE_THEMES } from '../types';

interface Props {
  invoice: InvoiceData;
  onUpdate: (field: string, value: any) => void;
}

const EditorStepFinalize: React.FC<Props> = ({ invoice, onUpdate }) => {
  return (
    <div className="bg-white rounded-[2rem] border border-slate-100 p-8 shadow-sm space-y-8">
      <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-4">
        <FileCheck className="w-5 h-5 text-indigo-600" /> Finalisation
      </h2>
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">Devise</label>
          <select className="w-full bg-slate-50 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 outline-none" value={invoice.currency} onChange={e => onUpdate('currency', e.target.value)}>
            <option value="XOF">XOF (FCFA)</option>
            <option value="EUR">EUR (€)</option>
            <option value="USD">USD ($)</option>
          </select>
        </div>
        <div>
          <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">TVA (%)</label>
          <input type="number" className="w-full bg-slate-50 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 outline-none" value={invoice.taxRate} onChange={e => onUpdate('taxRate', parseFloat(e.target.value))} />
        </div>
        <div className="col-span-2">
          <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">Notes</label>
          <textarea className="w-full bg-slate-50 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 outline-none" rows={2} value={invoice.notes} onChange={e => onUpdate('notes', e.target.value)} placeholder="Merci..." />
        </div>
      </div>
      <div>
        <label className="text-[10px] font-black text-slate-500 uppercase flex items-center gap-2 mb-4"><Palette className="w-3 h-3" /> Thème Visuel</label>
        <div className="grid grid-cols-2 gap-3">
          {INVOICE_THEMES.map(t => (
            <button key={t.id} onClick={() => onUpdate('themeId', t.id)} className={`flex items-center gap-3 p-3 rounded-2xl border-2 transition-all ${invoice.themeId === t.id ? 'border-indigo-600 bg-indigo-50' : 'border-slate-50 bg-white'}`}>
              <div className="w-5 h-5 rounded-full border" style={{ background: t.accent }} />
              <span className="text-xs font-bold text-slate-700">{t.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
export default EditorStepFinalize;
