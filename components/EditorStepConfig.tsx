
import React from 'react';
import { Settings, FileText, Languages } from 'lucide-react';
import { InvoiceData } from '../types';

interface Props {
  invoice: InvoiceData;
  onUpdate: (field: keyof InvoiceData, value: any) => void;
}

const EditorStepConfig: React.FC<Props> = ({ invoice, onUpdate }) => {
  const labelClasses = "text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] block mb-3 ml-1";

  const buttonClasses = (isActive: boolean) =>
    `flex-1 px-4 py-3 rounded-xl text-sm font-bold border-2 transition-all ${
      isActive
        ? 'bg-indigo-50 dark:bg-indigo-900/40 border-indigo-500 text-indigo-700 dark:text-indigo-300 shadow-sm'
        : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
    }`;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-200 dark:border-slate-800 p-10 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.05)] dark:shadow-none space-y-10">
      <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
        <div className="p-2.5 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl">
          <Settings className="w-5 h-5 text-indigo-600" />
        </div>
        Réglages du Document
      </h2>

      <div className="space-y-8">
        <div>
          <label className={`${labelClasses} flex items-center gap-2`}><FileText className="w-3.5 h-3.5" /> Type de document</label>
          <div className="flex gap-3 bg-white dark:bg-slate-900 p-2 rounded-2xl border dark:border-slate-800">
            <button 
                className={buttonClasses(invoice.documentType === 'invoice')} 
                onClick={() => onUpdate('documentType', 'invoice')}
            >
                Facture
            </button>
            <button 
                className={buttonClasses(invoice.documentType === 'proforma')} 
                onClick={() => onUpdate('documentType', 'proforma')}
            >
                Facture Proforma
            </button>
          </div>
        </div>

        <div>
            <label className={`${labelClasses} flex items-center gap-2`}><Languages className="w-3.5 h-3.5" /> Langue</label>
            <div className="flex gap-3 bg-white dark:bg-slate-900 p-2 rounded-2xl border dark:border-slate-800">
                <button 
                    className={buttonClasses(invoice.language === 'fr')} 
                    onClick={() => onUpdate('language', 'fr')}
                >
                    🇫🇷 Français
                </button>
                <button 
                    className={buttonClasses(invoice.language === 'en')} 
                    onClick={() => onUpdate('language', 'en')}
                >
                    🇬🇧 English
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default EditorStepConfig;
