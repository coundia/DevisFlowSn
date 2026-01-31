
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
  return (
    <div className="bg-white rounded-[2rem] border border-slate-100 p-8 shadow-sm space-y-6">
      <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-4">
        <User className="w-5 h-5 text-indigo-600" /> Informations Client
      </h2>
      <div className="space-y-4">
        <div>
          <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">Nom du Client</label>
          <input className="w-full bg-slate-50 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 focus:ring-1 ring-indigo-500 outline-none" value={receiver.name} onChange={e => onUpdateReceiver('name', e.target.value)} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">Email Client</label>
            <input className="w-full bg-slate-50 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 focus:ring-1 ring-indigo-500 outline-none" value={receiver.email} onChange={e => onUpdateReceiver('email', e.target.value)} />
          </div>
          <div>
            <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">Téléphone</label>
            <input className="w-full bg-slate-50 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 focus:ring-1 ring-indigo-500 outline-none" value={receiver.phone} onChange={e => onUpdateReceiver('phone', e.target.value)} />
          </div>
        </div>
        <div>
          <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">Adresse Client</label>
          <textarea className="w-full bg-slate-50 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 focus:ring-1 ring-indigo-500 outline-none" rows={2} value={receiver.address} onChange={e => onUpdateReceiver('address', e.target.value)} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">N° Facture</label>
            <input className="w-full bg-slate-50 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 focus:ring-1 ring-indigo-500 outline-none" value={invoiceNumber} onChange={e => onUpdateInvoice('invoiceNumber', e.target.value)} />
          </div>
          <div>
            <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">Échéance</label>
            <input type="date" className="w-full bg-slate-50 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 focus:ring-1 ring-indigo-500 outline-none" value={dueDate} onChange={e => onUpdateInvoice('dueDate', e.target.value)} />
          </div>
        </div>
      </div>
    </div>
  );
};
export default EditorStepClient;
