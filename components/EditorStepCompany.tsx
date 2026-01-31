
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

  return (
    <div className="bg-white rounded-[2rem] border border-slate-100 p-8 shadow-sm space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Building2 className="w-5 h-5 text-indigo-600" /> Profil Entreprise
        </h2>
        <button onClick={onAdd} className="text-xs font-bold text-indigo-600">+ Nouveau Profil</button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
        {profiles.map(p => (
          <div key={p.id} className="relative shrink-0">
            <button 
              onClick={() => onSwitch(p.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold border-2 transition-all ${activeProfileId === p.id ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-50 bg-slate-50 text-slate-500'}`}
            >
              {p.name || 'Sans nom'}
            </button>
            {profiles.length > 1 && (
              <button onClick={() => onDelete(p.id)} className="absolute -top-1 -right-1 bg-white border rounded-full p-0.5 text-slate-400 hover:text-red-500 shadow-sm">
                <X className="w-2.5 h-2.5" />
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="flex items-center gap-6 p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
        <div className="w-16 h-16 bg-white rounded-xl shadow-sm flex items-center justify-center overflow-hidden border">
          {sender.logo ? <img src={sender.logo} className="w-full h-full object-contain p-1" /> : <Upload className="w-5 h-5 text-slate-300" />}
        </div>
        <button onClick={() => fileRef.current?.click()} className="text-sm font-bold text-indigo-600 hover:underline">Charger Logo</button>
        <input type="file" ref={fileRef} className="hidden" accept="image/*" onChange={handleLogo} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">Nom Société</label>
          <input className="w-full bg-slate-50 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 focus:ring-1 ring-indigo-500 outline-none" value={sender.name} onChange={e => onUpdate('name', e.target.value)} />
        </div>
        <div className="col-span-2">
          <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">Adresse</label>
          <textarea className="w-full bg-slate-50 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 focus:ring-1 ring-indigo-500 outline-none" rows={2} value={sender.address} onChange={e => onUpdate('address', e.target.value)} />
        </div>
        <div>
          <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">Email</label>
          <input className="w-full bg-slate-50 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 focus:ring-1 ring-indigo-500 outline-none" value={sender.email} onChange={e => onUpdate('email', e.target.value)} />
        </div>
        <div>
          <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">Tél</label>
          <input className="w-full bg-slate-50 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 focus:ring-1 ring-indigo-500 outline-none" value={sender.phone} onChange={e => onUpdate('phone', e.target.value)} />
        </div>
        <div>
          <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">NINEA</label>
          <input className="w-full bg-slate-50 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 focus:ring-1 ring-indigo-500 outline-none" value={sender.ninea} onChange={e => onUpdate('ninea', e.target.value)} />
        </div>
        <div>
          <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">RCCM</label>
          <input className="w-full bg-slate-50 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 focus:ring-1 ring-indigo-500 outline-none" value={sender.rccm} onChange={e => onUpdate('rccm', e.target.value)} />
        </div>
      </div>
    </div>
  );
};
export default EditorStepCompany;
