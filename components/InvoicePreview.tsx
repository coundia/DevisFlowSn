
import React from 'react';
import { InvoiceData, INVOICE_THEMES } from '../types';

interface Props {
  data: InvoiceData;
}

const InvoicePreview: React.FC<Props> = ({ data }) => {
  const calculateSubtotal = () => data.items.reduce((acc, item) => acc + (item.quantity * item.rate), 0);
  const calculateTax = () => calculateSubtotal() * (data.taxRate / 100);
  const calculateTotal = () => calculateSubtotal() + calculateTax();

  const theme = INVOICE_THEMES.find(t => t.id === data.themeId) || INVOICE_THEMES[0];

  const getCurrencySymbol = (code: string) => {
    switch(code) {
      case 'XOF': return 'FCFA';
      case 'EUR': return '€';
      case 'GBP': return '£';
      default: return '$';
    }
  };

  const symbol = getCurrencySymbol(data.currency);

  return (
    <div className="bg-white p-8 sm:p-16 w-full text-slate-800 invoice-document min-h-[297mm] flex flex-col mx-auto shadow-sm border border-slate-100" style={{ maxWidth: '210mm' }}>
      {/* Visual Accent Top Bar */}
      <div 
        className="h-2 w-full -mt-8 sm:-mt-16 -mx-8 sm:-mx-16 mb-12" 
        style={{ backgroundColor: theme.primary }}
      ></div>

      <div className="flex justify-between items-start mb-16">
        <div className="space-y-6">
          <div className="w-24 h-24 flex items-center justify-start overflow-hidden">
            {data.sender.logo ? (
              <img 
                src={data.sender.logo} 
                alt="Logo" 
                className="max-w-full max-h-full object-contain object-left" 
              />
            ) : (
              <div 
                className="w-20 h-20 rounded-2xl flex items-center justify-center text-white font-black text-4xl shadow-lg"
                style={{ backgroundColor: theme.primary }}
              >
                {data.sender.name.charAt(0)}
              </div>
            )}
          </div>
          <div className="max-w-xs">
            <h1 className="text-2xl font-black text-slate-900 leading-tight mb-2 tracking-tight">{data.sender.name}</h1>
            <div className="text-[11px] text-slate-600 whitespace-pre-line font-semibold leading-relaxed tracking-wide">
              {data.sender.address}
              <div className="mt-2 space-y-0.5">
                {data.sender.email && <div className="flex gap-1"><span>Email:</span> <span className="text-slate-900">{data.sender.email}</span></div>}
                {data.sender.phone && <div className="flex gap-1"><span>Tél:</span> <span className="text-slate-900">{data.sender.phone}</span></div>}
                {data.sender.website && <div className="flex gap-1"><span>Web:</span> <span className="text-slate-900">{data.sender.website}</span></div>}
              </div>
              <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 gap-1">
                {data.sender.ninea && <div><span className="text-[9px] uppercase tracking-wider text-slate-400 block">NINEA</span><span className="text-slate-900">{data.sender.ninea}</span></div>}
                {data.sender.rccm && <div><span className="text-[9px] uppercase tracking-wider text-slate-400 block">RCCM</span><span className="text-slate-900">{data.sender.rccm}</span></div>}
              </div>
            </div>
          </div>
        </div>
        <div className="text-right">
          <h2 className="text-6xl font-black text-slate-100 uppercase tracking-tighter mb-6 select-none opacity-50">Facture</h2>
          <div className="space-y-4 bg-slate-50 p-6 rounded-2xl border border-slate-100 inline-block text-left min-w-[220px] shadow-sm">
            <div>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Numéro de document</p>
              <p className="text-base font-black text-slate-900">{data.invoiceNumber}</p>
            </div>
            <div className="flex gap-8 border-t border-slate-200 pt-3">
              <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Date d'émission</p>
                <p className="text-[11px] font-bold text-slate-700">{new Date(data.date).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Échéance</p>
                <p className="text-[11px] font-bold text-slate-900">{new Date(data.dueDate).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-16 grid grid-cols-2 gap-8">
        <div>
          <h3 
            className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 border-b pb-1 inline-block"
            style={{ color: theme.accent, borderColor: `${theme.accent}44` }}
          >
            Facturer à l'ordre de
          </h3>
          <h4 className="text-xl font-black text-slate-900 mb-2">{data.receiver.name}</h4>
          <div className="text-xs text-slate-600 whitespace-pre-line font-medium leading-relaxed">
            {data.receiver.address}
            <div className="mt-3 space-y-1">
              {data.receiver.phone && <div className="flex gap-2 font-bold"><span className="text-slate-400">T:</span> {data.receiver.phone}</div>}
              {data.receiver.email && <div className="flex gap-2 font-bold"><span className="text-slate-400">@:</span> {data.receiver.email}</div>}
            </div>
          </div>
        </div>
      </div>

      {/* Table Header Wrapper for better PDF breaks */}
      <div className="flex-grow">
        <table className="w-full text-left table-fixed">
          <thead>
            <tr className="border-b-2" style={{ borderColor: theme.primary }}>
              <th className="py-4 w-1/2 text-[10px] font-black text-slate-900 uppercase tracking-widest">Désignation des prestations</th>
              <th className="py-4 w-[10%] text-[10px] font-black text-slate-900 uppercase tracking-widest text-center">Qté</th>
              <th className="py-4 w-[20%] text-[10px] font-black text-slate-900 uppercase tracking-widest text-right">Prix Unit.</th>
              <th className="py-4 w-[20%] text-[10px] font-black text-slate-900 uppercase tracking-widest text-right">Total HT</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.items.length > 0 ? data.items.map((item) => (
              <tr key={item.id} className="break-inside-avoid">
                <td className="py-6 pr-4">
                  <p className="text-sm font-bold text-slate-900 leading-snug">{item.description}</p>
                </td>
                <td className="py-6 text-sm text-slate-600 font-bold text-center align-top">{item.quantity}</td>
                <td className="py-6 text-sm text-slate-600 font-bold text-right align-top whitespace-nowrap">{item.rate.toLocaleString()} {symbol}</td>
                <td className="py-6 text-sm font-black text-slate-900 text-right align-top whitespace-nowrap">{(item.quantity * item.rate).toLocaleString()} {symbol}</td>
              </tr>
            )) : (
              <tr>
                <td colSpan={4} className="py-12 text-center text-slate-400 font-medium italic">Aucun article n'a été ajouté à cette facture.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Summary Section */}
      <div className="flex justify-end mt-12 mb-16">
        <div className="w-full max-w-[320px] space-y-4 bg-slate-50 p-8 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex justify-between text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            <span>Sous-total HT</span>
            <span className="text-slate-900 font-black">{calculateSubtotal().toLocaleString()} {symbol}</span>
          </div>
          <div className="flex justify-between text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            <span>TVA ({data.taxRate}%)</span>
            <span className="text-slate-900 font-black">{calculateTax().toLocaleString()} {symbol}</span>
          </div>
          <div className="h-px bg-slate-200 w-full my-2"></div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-black text-slate-900 uppercase tracking-widest">Total Net à Payer</span>
            <span className="text-2xl font-black tracking-tighter" style={{ color: theme.accent }}>
              {calculateTotal().toLocaleString()} {symbol}
            </span>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="pt-12 border-t border-slate-100 mt-auto">
        <div className="grid grid-cols-2 gap-12">
          <div className="break-inside-avoid">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Notes & Remarques</h4>
            <p className="text-[11px] text-slate-600 leading-relaxed font-bold italic">
              {data.notes || "Sauf indication contraire, le paiement est exigible immédiatement. Merci pour votre collaboration."}
            </p>
          </div>
          <div className="break-inside-avoid">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Conditions de règlement</h4>
            <p className="text-[11px] text-slate-600 leading-relaxed font-semibold">
              {data.terms || "Veuillez libeller votre paiement à l'ordre de " + data.sender.name + ". Des pénalités de retard peuvent s'appliquer."}
            </p>
          </div>
        </div>
        <div className="mt-20 text-center border-t border-slate-50 pt-8 print-only">
          <p className="text-[9px] text-slate-300 font-black uppercase tracking-[0.4em]">
            Document généré par DevisFlow SN — www.societe.sn
          </p>
        </div>
      </div>
    </div>
  );
};

export default InvoicePreview;
