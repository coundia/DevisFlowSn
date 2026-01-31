
import React, { useState } from 'react';
import { FileCheck, Palette, LayoutTemplate, Trash2 } from 'lucide-react';
import { InvoiceData, INVOICE_THEMES, InvoiceTemplate } from '../types';

interface Props {
  invoice: InvoiceData;
  onUpdate: (field: string, value: any) => void;
  templates: InvoiceTemplate[];
  onSaveTemplate: (name: string) => void;
  onApplyTemplate: (id: string) => void;
  onDeleteTemplate: (id: string) => void;
}

const EditorStepFinalize: React.FC<Props> = ({ invoice, onUpdate, templates, onSaveTemplate, onApplyTemplate, onDeleteTemplate }) => {
  const [newTemplateName, setNewTemplateName] = useState('');
  const [showSaveForm, setShowSaveForm] = useState(false);
  
  const handleSaveTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTemplateName.trim()) {
      onSaveTemplate(newTemplateName.trim());
      setNewTemplateName('');
      setShowSaveForm(false);
    }
  };

  const inputClasses = "w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-2xl px-5 py-3.5 text-sm font-bold text-slate-900 dark:text-slate-100 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600";
  const labelClasses = "text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] block mb-2 ml-1";

  return (
    <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-200 dark:border-slate-800 p-10 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.05)] dark:shadow-none space-y-8">
      <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
        <div className="p-2.5 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl">
            <FileCheck className="w-5 h-5 text-indigo-600" />
        </div>
        Options & Rendu
      </h2>
      
      <div className="grid grid-cols-2 gap-8">
        <div>
          <label className={labelClasses}>Devise</label>
          <select className={inputClasses} value={invoice.currency} onChange={e => onUpdate('currency', e.target.value)}>
            <option value="XOF">FCFA (Sénégal)</option>
            <option value="EUR">Euro (€)</option>
            <option value="USD">Dollar ($)</option>
          </select>
        </div>
        <div>
          <label className={labelClasses}>TVA (%)</label>
          <input type="number" className={inputClasses} value={invoice.taxRate} onChange={e => onUpdate('taxRate', parseFloat(e.target.value) || 0)} />
        </div>
        <div className="col-span-2">
          <label className={labelClasses}>Notes de bas de page</label>
          <textarea className={inputClasses} rows={3} value={invoice.notes} onChange={e => onUpdate('notes', e.target.value)} placeholder="Ex: Merci pour votre confiance. Informations bancaires..." />
        </div>
      </div>
      
      <div>
        <label className={`${labelClasses} flex items-center gap-2 mb-4`}><Palette className="w-3 h-3" />Thème Graphique</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {INVOICE_THEMES.map(t => (
            <button key={t.id} onClick={() => onUpdate('themeId', t.id)} className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${invoice.themeId === t.id ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/30' : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-700'}`}>
              <div className="w-8 h-8 rounded-full border shadow-sm" style={{ background: t.accent }} />
              <span className={`text-[10px] font-black uppercase tracking-tight ${invoice.themeId === t.id ? 'text-indigo-700 dark:text-indigo-300' : 'text-slate-500 dark:text-slate-400'}`}>{t.name}</span>
            </button>
          ))}
        </div>
      </div>
      
      <div className="space-y-4 pt-8 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between">
            <label className={`${labelClasses} flex items-center gap-2`}><LayoutTemplate className="w-3 h-3" />Mes Modèles</label>
            <button onClick={() => setShowSaveForm(p => !p)} className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline">{showSaveForm ? 'Annuler' : '+ Sauvegarder Actuel'}</button>
        </div>
        
        {showSaveForm && (
            <form onSubmit={handleSaveTemplate} className="flex gap-2 p-4 mb-4 bg-indigo-50 dark:bg-indigo-950/30 rounded-2xl border border-indigo-100 dark:border-indigo-900/50 animate-in fade-in slide-in-from-top-2 duration-300">
                <input className={inputClasses} value={newTemplateName} onChange={(e) => setNewTemplateName(e.target.value)} placeholder="Nom (ex: Prestation Mensuelle)" required />
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-colors">Sauver</button>
            </form>
        )}

        {templates.length > 0 ? (
            <div className="space-y-2">
                {templates.map(template => (
                    <div key={template.id} className="flex items-center justify-between p-3 pl-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-800 group">
                        <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{template.name}</p>
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => onApplyTemplate(template.id)} className="text-xs font-bold text-indigo-600 bg-indigo-100 dark:bg-indigo-900/50 px-3 py-1.5 rounded-lg hover:bg-indigo-200 dark:hover:bg-indigo-900/80 transition-colors">Appliquer</button>
                            <button onClick={() => onDeleteTemplate(template.id)} className="p-1.5 text-slate-400 hover:text-red-500"><Trash2 className="w-3.5 h-3.5"/></button>
                        </div>
                    </div>
                ))}
            </div>
        ) : (
             <div className="text-center text-xs text-slate-400 py-6 border border-dashed rounded-2xl border-slate-200 dark:border-slate-800">
                <p className="font-bold">Aucun modèle sauvegardé.</p>
                <p className="mt-1">Sauvegardez la facture actuelle pour la réutiliser.</p>
             </div>
        )}
      </div>
    </div>
  );
};
export default EditorStepFinalize;