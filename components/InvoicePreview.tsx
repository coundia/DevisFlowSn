
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
    <div id="invoice-pdf-content" className="bg-white p-12 w-full text-slate-800 invoice-document min-h-[297mm] flex flex-col mx-auto shadow-2xl relative overflow-hidden" style={{ maxWidth: '210mm' }}>
      {/* Visual Accent Top Bar */}
      <div 
        className="absolute top-0 left-0 w-full h-2" 
        style={{ backgroundColor: theme.primary }}
      ></div>

      <div className="flex justify-between items-start mb-12 relative z-10">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 flex items-center justify-center overflow-hidden">
            {data.sender.logo ? (
              <img 
                src={data.sender.logo} 
                alt="Logo" 
                className="max-w-full max-h-full object-contain" 
              />
            ) : (
              <div 
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-black text-3xl"
                style={{ backgroundColor: theme.primary }}
              >
                {data.sender.name.charAt(0)}
              </div>
            )}
          </div>
          <div className="max-w-xs">
            <h1 className="text-2xl font-black text-slate-900 leading-tight mb-2 tracking-tighter">{data.sender.name}</h1>
            <div className="text-[11px] text-slate-500 whitespace-pre-line font-bold leading-relaxed tracking-tight">
              {data.sender.address}
              <div className="mt-3 space-y-0.5">
                {data.sender.email && <p className="text-slate-700 font-medium">{data.sender.email}</p>}
                {data.sender.phone && <p className="text-slate-700 font-medium">{data.sender.phone}</p>}
              </div>
            </div>
          </div>
        </div>
        <div className="text-right">
           <div className="space-y-3 text-left">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Facture N°</p>
              <p className="text-base font-black text-slate-900 tracking-tight">{data.invoiceNumber}</p>
            </div>
            <div className="flex gap-8">
               <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</p>
                <p className="text-[11px] font-bold text-slate-700">{new Date(data.date).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Échéance</p>
                <p className="text-[11px] font-bold text-rose-600">{new Date(data.dueDate).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-12 p-6 rounded-2xl border border-slate-100 bg-slate-50/50">
        <h3 
          className="text-[9px] font-black uppercase tracking-[0.3em] mb-2"
          style={{ color: theme.accent }}
        >
          Facturé à
        </h3>
        <h4 className="text-lg font-black text-slate-900 mb-1 tracking-tighter">{data.receiver.name}</h4>
        <div className="text-xs text-slate-500 whitespace-pre-line font-bold leading-relaxed max-w-sm">
          {data.receiver.address}
        </div>
      </div>

      <div className="flex-grow">
        <table className="w-full text-left table-fixed">
          <thead>
            <tr className="border-b-2" style={{ borderColor: theme.primary }}>
              <th className="py-3 w-1/2 text-[10px] font-black text-slate-900 uppercase tracking-[0.2em]">Description</th>
              <th className="py-3 w-[15%] text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] text-center">Qté</th>
              <th className="py-3 w-[20%] text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] text-right">P.U.</th>
              <th className="py-3 w-[20%] text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] text-right">Montant</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.items.length > 0 ? data.items.map((item) => (
              <tr key={item.id} className="break-inside-avoid group">
                <td className="py-4 pr-6">
                  <p className="text-sm font-bold text-slate-900 leading-tight tracking-tight">{item.description}</p>
                </td>
                <td className="py-4 text-sm text-slate-500 font-bold text-center align-top">{item.quantity}</td>
                <td className="py-4 text-sm text-slate-500 font-bold text-right align-top whitespace-nowrap">{item.rate.toLocaleString()}</td>
                <td className="py-4 text-sm font-bold text-slate-900 text-right align-top whitespace-nowrap">{(item.quantity * item.rate).toLocaleString()}</td>
              </tr>
            )) : (
              <tr>
                <td colSpan={4} className="py-12 text-center text-slate-300 font-bold uppercase tracking-widest text-[10px]">Aucun article</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end mt-10">
        <div className="w-full max-w-[280px] space-y-3">
          <div className="flex justify-between text-sm font-bold text-slate-500">
            <span>Sous-Total</span>
            <span>{calculateSubtotal().toLocaleString()} {symbol}</span>
          </div>
          <div className="flex justify-between text-sm font-bold text-slate-500">
            <span>TVA ({data.taxRate}%)</span>
            <span>{calculateTax().toLocaleString()} {symbol}</span>
          </div>
          <div className="h-px bg-slate-200 w-full my-2"></div>
          <div className="flex justify-between items-center">
            <span className="text-base font-black uppercase" style={{ color: theme.primary }}>Total à Payer</span>
            <span className="text-2xl font-black tracking-tighter" style={{ color: theme.primary }}>
              {calculateTotal().toLocaleString()} <span className="text-base align-baseline">{symbol}</span>
            </span>
          </div>
        </div>
      </div>

      <div className="pt-8 border-t border-slate-100">
        <div className="grid grid-cols-2 gap-10">
           <div>
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Notes</h4>
            <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
              {data.notes || "Merci pour votre confiance."}
            </p>
          </div>
           <div>
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Infos légales</h4>
            <div className="text-[11px] text-slate-500 space-y-1 font-medium">
                {data.sender.ninea && <p><strong>NINEA:</strong> {data.sender.ninea}</p>}
                {data.sender.rccm && <p><strong>RCCM:</strong> {data.sender.rccm}</p>}
             </div>
          </div>
        </div>
        <div className="mt-12 text-center border-t border-slate-50 pt-6">
          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.2em]">
            Généré avec DevisFlow SN
          </p>
        </div>
      </div>
    </div>
  );
};

export default InvoicePreview;
