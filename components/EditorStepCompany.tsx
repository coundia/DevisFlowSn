
import React, { useRef } from 'react';
import { Building2, Upload, X, Copy } from 'lucide-react';
import { CompanyDetails } from '../types';

interface Props {
  sender: CompanyDetails;
  profiles: CompanyDetails[];
  activeProfileId: string;
  onUpdate: (field: string, value: any) => void;
  onSwitch: (id: string) => void;
  onAdd: () => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
}

const EditorStepCompany: React.FC<Props> = ({ 
  sender, profiles, activeProfileId, onUpdate, onSwitch, onAdd, onDuplicate, onDelete 
}) => {
  const fileRef = useRef<HTMLInputElement>(null);

  const handleLogo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => onUpdate('logo', reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const inputClasses = "w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-2xl px-5 py-3.5 text-sm font-bold text-slate-900 dark:text-slate-100 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600";
  const labelClasses = "text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] block mb-2 ml-1";

  return (
    <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-200 dark:border-slate-800 p-10 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.05)] dark:shadow-none space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
          <div className="p-2.5 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl">
            <Building2 className="w-5 h-5 text-indigo-600" />
          </div>
          Profil Entreprise
        </h2>
        <button onClick={onAdd} className="text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 transition-colors px-4 py-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl">Ajouter</button>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-hide -mx-2 px-2">
        {profiles.map(p => (
          <div key={p.id} className="relative shrink-0 group">
            <button 
              onClick={() => onSwitch(p.id)}
              className={`px-6 py-3 rounded-2xl text-[11px] font-black uppercase tracking-wider border-2 transition-all flex items-center gap-3 ${activeProfileId === p.id ? 'border-indigo-600 bg-indigo-600 text-white shadow-xl shadow-indigo-100 dark:shadow-none' : 'border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 text-slate-400 hover:border-slate-300 hover:text-slate-600'}`}
            >
              <span className="truncate max-w-[120px]">{p.name || 'Sans nom'}</span>
            </button>
            <div className="absolute -top-2.5 -right-2.5 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
              <button 
                onClick={(e) => { e.stopPropagation(); onDuplicate(p.id); }} 
                className="bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-full p-2 text-slate-400 hover:text-indigo-600 shadow-xl transition-all hover:scale-125"
                title="Cloner"
              >
                <Copy className="w-3 h-3" />
              </button>
              {profiles.length > 1 && (
                <button 
                  onClick={(e) => { e.stopPropagation(); onDelete(p.id); }} 
                  className="bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-full p-2 text-slate-400 hover:text-rose-600 shadow-xl transition-all hover:scale-125"
                  title="Supprimer"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-8 p-7 bg-slate-50/50 dark:bg-slate-800/30 rounded-[2rem] border border-dashed border-slate-200 dark:border-slate-700 transition-all hover:border-indigo-400 group">
        <div className="w-20 h-20 bg-white dark:bg-slate-800 rounded-2xl shadow-sm flex items-center justify-center overflow-hidden border border-slate-200 dark:border-slate-700 group-hover:scale-105 transition-transform">
          {sender.logo ? <img src={sender.logo} className="w-full h-full object-contain p-2" /> : <Upload className="w-6 h-6 text-slate-300 dark:text-slate-600" />}
        </div>
        <div className="flex flex-col gap-2">
          <button onClick={() => fileRef.current?.click()} className="text-xs font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 hover:text-indigo-700">Mettre à jour le logo</button>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold tracking-tight">SVG, PNG ou JPG (min. 400x400px)</p>
        </div>
        <input type="file" ref={fileRef} className="hidden" accept="image/*" onChange={handleLogo} />
      </div>

      <div className="grid grid-cols-2 gap-8">
        <div className="col-span-2">
          <label className={labelClasses}>Nom de la Société</label>
          <input className={inputClasses} value={sender.name} onChange={e => onUpdate('name', e.target.value)} placeholder="Ex: DevisFlow Creative Studio" />
        </div>
        <div className="col-span-2">
          <label className={labelClasses}>Adresse du siège social</label>
          <textarea className={inputClasses} rows={3} value={sender.address} onChange={e => onUpdate('address', e.target.value)} placeholder="Adresse complète de l'entreprise..." />
        </div>
        <div>
          <label className={labelClasses}>Email Professionnel</label>
          <input className={inputClasses} value={sender.email} onChange={e => onUpdate('email', e.target.value)} placeholder="contact@entreprise.sn" />
        </div>
        <div>
          <label className={labelClasses}>Numéro de Contact</label>
          <input className={inputClasses} value={sender.phone} onChange={e => onUpdate('phone', e.target.value)} placeholder="+221 ..." />
        </div>
        <div className="pt-2">
          <label className={labelClasses}>NINEA (Sénégal)</label>
          <input className={inputClasses} value={sender.ninea} onChange={e => onUpdate('ninea', e.target.value)} placeholder="0000000 2Y3" />
        </div>
        <div className="pt-2">
          <label className={labelClasses}>RCCM</label>
          <input className={inputClasses} value={sender.rccm} onChange={e => onUpdate('rccm', e.target.value)} placeholder="SN DKR 2024 ..." />
        </div>
      </div>
    </div>
  );
};
export default EditorStepCompany;