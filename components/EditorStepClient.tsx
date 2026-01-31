
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
  const inputClasses = "w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400";
  const labelClasses = "text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase block mb-1.5 ml-1";

  return (
    <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 p-8 shadow-sm space-y-6 transition-colors">
      <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
        <User className="w-5 h-5 text-indigo-600" /> Informations Client
      </h2>
      <div className="space-y-5">
        <div>
          <label className={labelClasses}>Nom complet ou Raison Sociale</label>
          <input className={inputClasses} value={receiver.name} onChange={e => onUpdateReceiver('name', e.target.value)} placeholder="Nom du client..." />
        </div>
        <div className="grid grid-cols-2 gap-5">
          <div>
            <label className={labelClasses}>Email Client</label>
            <input className={inputClasses} value={receiver.email} onChange={e => onUpdateReceiver('email', e.target.value)} placeholder="client@exemple.sn" />
          </div>
          <div>
            <label className={labelClasses}>Téléphone Client</label>
            <input className={inputClasses} value={receiver.phone} onChange={e => onUpdateReceiver('phone', e.target.value)} placeholder="+221 ..." />
          </div>
        </div>
        <div>
          <label className={labelClasses}>Adresse de Facturation</label>
          <textarea className={inputClasses} rows={2} value={receiver.address} onChange={e => onUpdateReceiver('address', e.target.value)} placeholder="Quartier, Ville, Sénégal..." />
        </div>
        <div className="grid grid-cols-2 gap-5">
          <div>
            <label className={labelClasses}>Référence Facture</label>
            <input className={inputClasses} value={invoiceNumber} onChange={e => onUpdateInvoice('invoiceNumber', e.target.value)} placeholder="FAC-001" />
          </div>
          <div>
            <label className={labelClasses}>Date d'Échéance</label>
            <input type="date" className={inputClasses} value={dueDate} onChange={e => onUpdateInvoice('dueDate', e.target.value)} />
          </div>
        </div>
      </div>
    </div>
  );
};
export default EditorStepClient;
