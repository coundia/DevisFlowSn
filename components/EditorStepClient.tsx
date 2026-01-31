
import React from 'react';
import { User } from 'lucide-react';
import { CompanyDetails } from '../types';

interface Props {
  receiver: CompanyDetails;
  invoiceNumber: string;
  dueDate: string;
  onUpdateReceiver: (field: string, value: any) => void;
  onUpdateInvoice: (field: string, value: any) => void;
}

const EditorStepClient: React.FC<Props> = ({ receiver, invoiceNumber, dueDate, onUpdateReceiver, onUpdateInvoice }) => {
  const inputClasses = "w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-2xl px-5 py-3.5 text-sm font-bold text-slate-900 dark:text-slate-100 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600";
  const labelClasses = "text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] block mb-2 ml-1";

  return (
    <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-200 dark:border-slate-800 p-10 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.05)] dark:shadow-none space-y-8">
      <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
        <div className="p-2.5 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl">
          <User className="w-5 h-5 text-indigo-600" />
        </div>
        Informations Client
      </h2>
      <div className="space-y-8">
        <div className="col-span-2">
          <label className={labelClasses}>Nom du Client / Société</label>
          <input className={inputClasses} value={receiver.name} onChange={e => onUpdateReceiver('name', e.target.value)} placeholder="Raison sociale ou nom complet..." />
        </div>
        <div className="grid grid-cols-2 gap-8">
          <div>
            <label className={labelClasses}>Email</label>
            <input className={inputClasses} value={receiver.email} onChange={e => onUpdateReceiver('email', e.target.value)} placeholder="contact@client.com" />
          </div>
          <div>
            <label className={labelClasses}>Téléphone</label>
            <input className={inputClasses} value={receiver.phone} onChange={e => onUpdateReceiver('phone', e.target.value)} placeholder="+221..." />
          </div>
        </div>
        <div className="col-span-2">
          <label className={labelClasses}>Adresse de facturation</label>
          <textarea className={inputClasses} rows={3} value={receiver.address} onChange={e => onUpdateReceiver('address', e.target.value)} placeholder="Adresse complète pour la facturation..." />
        </div>
        <div className="grid grid-cols-2 gap-8 pt-2">
          <div>
            <label className={labelClasses}>Numéro de Facture</label>
            <input className={inputClasses} value={invoiceNumber} onChange={e => onUpdateInvoice('invoiceNumber', e.target.value)} placeholder="FAC-2024-001" />
          </div>
          <div>
            <label className={labelClasses}>Date d'échéance</label>
            <input type="date" className={inputClasses} value={dueDate} onChange={e => onUpdateInvoice('dueDate', e.target.value)} />
          </div>
        </div>
      </div>
    </div>
  );
};
export default EditorStepClient;