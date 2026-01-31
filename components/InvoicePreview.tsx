
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
    <div className="bg-white p-12 sm:p-20 w-full text-slate-800 invoice-document min-h-[297mm] flex flex-col mx-auto shadow-2xl relative overflow-hidden" style={{ maxWidth: '210mm' }}>
      {/* Visual Accent Top Bar */}
      <div 
        className="absolute top-0 left-0 w-full h-3" 
        style={{ backgroundColor: theme.primary }}
      ></div>

      <div className="flex justify-between items-start mb-20 relative z-10">
        <div className="space-y-8">
          <div className="w-28 h-28 flex items-center justify-start overflow-hidden">
            {data.sender.logo ? (
              <img 
                src={data.sender.logo} 
                alt="Logo" 
                className="max-w-full max-h-full object-contain object-left grayscale-[20%]" 
              />
            ) : (
              <div 
                className="w-24 h-24 rounded-3xl flex items-center justify-center text-white font-black text-5xl shadow-2xl"
                style={{ backgroundColor: theme.primary }}
              >
                {data.sender.name.charAt(0)}
              </div>
            )}
          </div>
          <div className="max-w-xs">
            <h1 className="text-3xl font-black text-slate-900 leading-none mb-3 tracking-tighter">{data.sender.name}</h1>
            <div className="text-[12px] text-slate-500 whitespace-pre-line font-bold leading-relaxed tracking-tight">
              {data.sender.address}
              <div className="mt-4 space-y-1">
                {data.sender.email && <div className="flex gap-2"><span className="text-slate-300">@</span> <span className="text-slate-900">{data.sender.email}</span></div>}
                {data.sender.phone && <div className="flex gap-2"><span className="text-slate-300">T</span> <span className="text-slate-900">{data.sender.phone}</span></div>}
              </div>
              <div className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-2 gap-4">
                {data.sender.ninea && <div><span className="text-[9px] uppercase tracking-[0.2em] text-slate-400 block mb-1">NINEA</span><span className="text-slate-900 font-black">{data.sender.ninea}</span></div>}
                {data.sender.rccm && <div><span className="text-[9px] uppercase tracking-[0.2em] text-slate-400 block mb-1">RCCM</span><span className="text-slate-900 font-black">{data.sender.rccm}</span></div>}
              </div>
            </div>
          </div>
        </div>
        <div className="text-right">
          <h2 
            className="text-8xl font-black uppercase tracking-tighter mb-8 select-none opacity-5 leading-none"
            style={{ color: theme.primary }}
          >
            Bill
          </h2>
          <div className="space-y-5 bg-slate-50 p-8 rounded-[2rem] border border-slate-100 inline-block text-left min-w-[260px] shadow-sm">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Invoice #</p>
              <p className="text-xl font-black text-slate-900 tracking-tight">{data.invoiceNumber}</p>
            </div>
            <div className="flex gap-10 border-t border-slate-200 pt-5">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Date</p>
                <p className="text-[12px] font-black text-slate-700">{new Date(data.date).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Due Date</p>
                <p className="text-[12px] font-black text-rose-600">{new Date(data.dueDate).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-20">
        <h3 
          className="text-[11px] font-black uppercase tracking-[0.3em] mb-6 inline-block"
          style={{ color: theme.accent }}
        >
          Customer Profile
        </h3>
        <h4 className="text-2xl font-black text-slate-900 mb-2.5 tracking-tighter">{data.receiver.name}</h4>
        <div className="text-sm text-slate-500 whitespace-pre-line font-bold leading-relaxed max-w-sm">
          {data.receiver.address}
          <div className="mt-5 space-y-1.5">
            {data.receiver.phone && <div className="flex gap-3"><span className="text-slate-300 font-black">T</span> {data.receiver.phone}</div>}
            {data.receiver.email && <div className="flex gap-3"><span className="text-slate-300 font-black">@</span> {data.receiver.email}</div>}
          </div>
        </div>
      </div>

      <div className="flex-grow">
        <table className="w-full text-left table-fixed">
          <thead>
            <tr className="border-b-4" style={{ borderColor: theme.primary }}>
              <th className="py-5 w-1/2 text-[11px] font-black text-slate-900 uppercase tracking-[0.2em]">Service Description</th>
              <th className="py-5 w-[10%] text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] text-center">Qty</th>
              <th className="py-5 w-[20%] text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] text-right">Unit Price</th>
              <th className="py-5 w-[20%] text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.items.length > 0 ? data.items.map((item) => (
              <tr key={item.id} className="break-inside-avoid group">
                <td className="py-8 pr-6">
                  <p className="text-base font-black text-slate-900 leading-tight tracking-tight">{item.description}</p>
                </td>
                <td className="py-8 text-sm text-slate-500 font-black text-center align-top">{item.quantity}</td>
                <td className="py-8 text-sm text-slate-500 font-black text-right align-top whitespace-nowrap">{item.rate.toLocaleString()} <span className="text-[10px] ml-1">{symbol}</span></td>
                <td className="py-8 text-base font-black text-slate-900 text-right align-top whitespace-nowrap">{(item.quantity * item.rate).toLocaleString()} <span className="text-[10px] ml-1">{symbol}</span></td>
              </tr>
            )) : (
              <tr>
                <td colSpan={4} className="py-16 text-center text-slate-300 font-black uppercase tracking-widest text-[10px]">Empty Item List</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end mt-16 mb-20">
        <div className="w-full max-w-[340px] space-y-5 bg-slate-900 p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16" />
          <div className="flex justify-between text-[11px] font-black text-slate-400 uppercase tracking-widest">
            <span>Sub-total</span>
            <span className="text-white">{calculateSubtotal().toLocaleString()} {symbol}</span>
          </div>
          <div className="flex justify-between text-[11px] font-black text-slate-400 uppercase tracking-widest">
            <span>Sales Tax ({data.taxRate}%)</span>
            <span className="text-white">{calculateTax().toLocaleString()} {symbol}</span>
          </div>
          <div className="h-px bg-white/10 w-full my-3"></div>
          <div className="flex justify-between items-center">
            <span className="text-xs font-black text-indigo-400 uppercase tracking-[0.3em]">Total Net</span>
            <span className="text-3xl font-black text-white tracking-tighter">
              {calculateTotal().toLocaleString()} <span className="text-sm font-bold text-slate-500">{symbol}</span>
            </span>
          </div>
        </div>
      </div>

      <div className="pt-12 border-t border-slate-100 mt-auto">
        <div className="grid grid-cols-2 gap-16">
          <div className="break-inside-avoid">
            <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] mb-4">Official Notes</h4>
            <p className="text-[12px] text-slate-500 leading-relaxed font-bold italic">
              {data.notes || "Professional services rendered as per the agreed specifications. We appreciate your business."}
            </p>
          </div>
          <div className="break-inside-avoid">
            <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] mb-4">Settlement Terms</h4>
            <p className="text-[12px] text-slate-500 leading-relaxed font-black">
              {data.terms || "Standard payment terms: 14 days from date of issue. Direct bank transfer preferred."}
            </p>
          </div>
        </div>
        <div className="mt-20 text-center border-t border-slate-50 pt-10 opacity-30">
          <p className="text-[9px] text-slate-400 font-black uppercase tracking-[0.5em]">
            Digital Receipt Verified • DevisFlow Global SN
          </p>
        </div>
      </div>
    </div>
  );
};

export default InvoicePreview;
