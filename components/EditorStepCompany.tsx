
import React, { useRef } from 'react';
import { Building2, Upload, X } from 'lucide-react';
import { CompanyDetails } from '../types';

interface Props {
  sender: CompanyDetails;
  profiles: CompanyDetails[];
  activeProfileId: string;
  onUpdate: (field: string, value: any) => void;
  onSwitch: (id: string) => void;
  onAdd: () => void;
  onDelete: (id: string) => void;
}

const EditorStepCompany: React.FC<Props> = ({ sender, profiles, activeProfileId, onUpdate, onSwitch, onAdd, onDelete }) => {
  const fileRef = useRef<HTMLInputElement>(null);

  const handleLogo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => onUpdate('logo', reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const inputClasses = "w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400";
  const labelClasses = "text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase block mb-1.5 ml-1";

  return (
    <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 p-8 shadow-sm space-y-6 transition-colors">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Building2 className="w-5 h-5 text-indigo-600" /> Profil Entreprise
        </h2>
        <button onClick={onAdd} className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline">+ Nouveau Profil</button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
        {profiles.map(p => (
          <div key={p.id} className="relative shrink-0">
            <button 
              onClick={() => onSwitch(p.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold border-2 transition-all ${activeProfileId === p.id ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-300' : 'border-slate-50 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-500'}`}
            >
              {p.name || 'Sans nom'}
            </button>
            {profiles.length > 1 && (
              <button onClick={() => onDelete(p.id)} className="absolute -top-1 -right-1 bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-full p-0.5 text-slate-400 hover:text-red-500 shadow-sm transition-colors">
                <X className="w-2.5 h-2.5" />
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="flex items-center gap-6 p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 transition-colors">
        <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-xl shadow-sm flex items-center justify-center overflow-hidden border dark:border-slate-700">
          {sender.logo ? <img src={sender.logo} className="w-full h-full object-contain p-1" /> : <Upload className="w-5 h-5 text-slate-300 dark:text-slate-600" />}
        </div>
        <div className="flex flex-col gap-1">
          <button onClick={() => fileRef.current?.click()} className="text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:underline">Charger un logo</button>
          <p className="text-[10px] text-slate-400 font-medium italic">Format carré recommandé (PNG/JPG)</p>
        </div>
        <input type="file" ref={fileRef} className="hidden" accept="image/*" onChange={handleLogo} />
      </div>

      <div className="grid grid-cols-2 gap-5">
        <div className="col-span-2">
          <label className={labelClasses}>Nom de la Société</label>
          <input className={inputClasses} value={sender.name} onChange={e => onUpdate('name', e.target.value)} placeholder="Ex: Dakar Services SARL" />
        </div>
        <div className="col-span-2">
          <label className={labelClasses}>Adresse Siège</label>
          <textarea className={inputClasses} rows={2} value={sender.address} onChange={e => onUpdate('address', e.target.value)} placeholder="Rue 12, Dakar Plateau..." />
        </div>
        <div>
          <label className={labelClasses}>Email Pro</label>
          <input className={inputClasses} value={sender.email} onChange={e => onUpdate('email', e.target.value)} placeholder="contact@entreprise.sn" />
        </div>
        <div>
          <label className={labelClasses}>Téléphone</label>
          <input className={inputClasses} value={sender.phone} onChange={e => onUpdate('phone', e.target.value)} placeholder="+221 ..." />
        </div>
        <div>
          <label className={labelClasses}>NINEA</label>
          <input className={inputClasses} value={sender.ninea} onChange={e => onUpdate('ninea', e.target.value)} placeholder="0000000 2Y3" />
        </div>
        <div>
          <label className={labelClasses}>RCCM</label>
          <input className={inputClasses} value={sender.rccm} onChange={e => onUpdate('rccm', e.target.value)} placeholder="SN DKR 2024 ..." />
        </div>
      </div>
    </div>
  );
};
export default EditorStepCompany;
