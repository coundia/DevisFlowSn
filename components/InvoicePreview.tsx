
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
    <div className="bg-white p-8 sm:p-12 w-full h-full text-slate-800 invoice-document min-h-[1050px] flex flex-col">
      <div 
        className="h-2 w-full -mt-8 sm:-mt-12 -mx-8 sm:-mx-12 mb-12" 
        style={{ backgroundColor: theme.primary }}
      ></div>

      <div className="flex justify-between items-start mb-16">
        <div className="space-y-6">
          <div className="w-20 h-20 flex items-center justify-start overflow-hidden">
            {data.sender.logo ? (
              <img 
                src={data.sender.logo} 
                alt="Company logo" 
                className="max-w-full max-h-full object-contain object-left" 
              />
            ) : (
              <div 
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-black text-3xl shadow-lg"
                style={{ backgroundColor: theme.primary }}
              >
                {data.sender.name.charAt(0)}
              </div>
            )}
          </div>
          <div className="max-w-xs">
            <h1 className="text-2xl font-black text-slate-900 leading-tight mb-2">{data.sender.name}</h1>
            <div className="text-[11px] text-slate-600 whitespace-pre-line font-bold leading-relaxed tracking-wide">
              {data.sender.address}
              {data.sender.email && `\nEmail: ${data.sender.email}`}
              {data.sender.phone && `\nTél: ${data.sender.phone}`}
              {data.sender.website && `\nWeb: ${data.sender.website}`}
              {data.sender.ninea && `\nNINEA: ${data.sender.ninea}`}
              {data.sender.rccm && `\nRCCM: ${data.sender.rccm}`}
            </div>
          </div>
        </div>
        <div className="text-right">
          <h2 className="text-5xl font-black text-slate-200 uppercase tracking-tighter mb-4 select-none">Facture</h2>
          <div className="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-100 inline-block text-left min-w-[180px]">
            <div>
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Numéro</p>
              <p className="text-sm font-bold text-slate-900">{data.invoiceNumber}</p>
            </div>
            <div className="flex gap-8">
              <div>
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Date</p>
                <p className="text-[11px] font-bold text-slate-700">{new Date(data.date).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Échéance</p>
                <p className="text-[11px] font-bold text-slate-700">{new Date(data.dueDate).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-16">
        <div className="w-1/2">
          <h3 
            className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 border-b pb-1 inline-block"
            style={{ color: theme.accent, borderColor: `${theme.accent}44` }}
          >
            Facturé à
          </h3>
          <h4 className="text-xl font-black text-slate-900 mb-2">{data.receiver.name}</h4>
          <p className="text-xs text-slate-600 whitespace-pre-line leading-relaxed font-bold">
            {data.receiver.address}
            {data.receiver.phone && `\nTél: ${data.receiver.phone}`}
            {data.receiver.email && `\n${data.receiver.email}`}
          </p>
        </div>
      </div>

      <div className="flex-grow">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b-2" style={{ borderColor: theme.primary }}>
              <th className="py-4 text-[10px] font-black text-slate-900 uppercase tracking-widest">Désignation</th>
              <th className="py-4 text-[10px] font-black text-slate-900 uppercase tracking-widest text-center">Qté</th>
              <th className="py-4 text-[10px] font-black text-slate-900 uppercase tracking-widest text-right">Prix Unit.</th>
              <th className="py-4 text-[10px] font-black text-slate-900 uppercase tracking-widest text-right">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.items.length > 0 ? data.items.map((item) => (
              <tr key={item.id}>
                <td className="py-6 pr-4">
                  <p className="text-sm font-bold text-slate-900">{item.description}</p>
                </td>
                <td className="py-6 text-sm text-slate-600 font-bold text-center">{item.quantity}</td>
                <td className="py-6 text-sm text-slate-600 font-bold text-right">{item.rate.toLocaleString()} {symbol}</td>
                <td className="py-6 text-sm font-black text-slate-900 text-right">{(item.quantity * item.rate).toLocaleString()} {symbol}</td>
              </tr>
            )) : (
              <tr>
                <td colSpan={4} className="py-12 text-center text-slate-400 font-bold italic">Aucun article listé.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end mt-12 mb-16">
        <div className="w-full max-w-[280px] space-y-3 bg-slate-50 p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex justify-between text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            <span>Sous-total HT</span>
            <span className="text-slate-900">{calculateSubtotal().toLocaleString()} {symbol}</span>
          </div>
          <div className="flex justify-between text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            <span>TVA ({data.taxRate}%)</span>
            <span className="text-slate-900">{calculateTax().toLocaleString()} {symbol}</span>
          </div>
          <div className="h-px bg-slate-200 w-full my-2"></div>
          <div className="flex justify-between items-center pt-2">
            <span className="text-sm font-black text-slate-900 uppercase tracking-widest">Total TTC</span>
            <span className="text-2xl font-black tracking-tighter" style={{ color: theme.accent }}>
              {calculateTotal().toLocaleString()} {symbol}
            </span>
          </div>
        </div>
      </div>

      <div className="pt-12 border-t border-slate-100">
        <div className="grid grid-cols-2 gap-12">
          <div>
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Notes</h4>
            <p className="text-[11px] text-slate-600 leading-relaxed font-bold italic">
              {data.notes || "Aucune note particulière."}
            </p>
          </div>
          <div>
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Conditions de règlement</h4>
            <p className="text-[11px] text-slate-600 leading-relaxed font-bold">
              {data.terms || "Le paiement est attendu dans les 14 jours suivant la date de facture. Les pénalités de retard s'appliquent selon la loi en vigueur."}
            </p>
          </div>
        </div>
        <div className="mt-16 text-center border-t border-slate-50 pt-8">
          <p className="text-[9px] text-slate-400 font-black uppercase tracking-[0.3em]">
            Merci de votre confiance
          </p>
        </div>
      </div>
    </div>
  );
};

export default InvoicePreview;
