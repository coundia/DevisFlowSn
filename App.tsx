
import React, { useState } from 'react';
import { FileText, Download, Eye, Building2, User, ListOrdered, FileCheck, RefreshCw, ChevronRight } from 'lucide-react';
import { useInvoiceState } from './hooks/useInvoiceState';
import { calculateTotal } from './utils/invoiceUtils';
import InvoicePreview from './components/InvoicePreview';
import EditorStepCompany from './components/EditorStepCompany';
import EditorStepClient from './components/EditorStepClient';
import EditorStepItems from './components/EditorStepItems';
import EditorStepFinalize from './components/EditorStepFinalize';
import ChatAssistant from './components/ChatAssistant';

const App: React.FC = () => {
  const { 
    invoice, setInvoice, profiles, activeProfileId,
    updateSender, updateReceiver, addItem, updateItem, removeItem, 
    switchProfile, addNewProfile, deleteProfile, resetInvoice 
  } = useInvoiceState();
  
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    { id: 0, label: 'Entreprise', icon: Building2 },
    { id: 1, label: 'Client', icon: User },
    { id: 2, label: 'Articles', icon: ListOrdered },
    { id: 3, label: 'Finaliser', icon: FileCheck },
  ];

  return (
    <div className="min-h-screen bg-[#FDFDFE] flex flex-col font-inter antialiased overflow-x-hidden">
      <header className="bg-white/80 backdrop-blur-md border-b sticky top-0 z-50 px-6 py-4 no-print flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 w-10 h-10 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-100">
            <FileText className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900 leading-none">DevisFlow SN</h1>
            <p className="text-[10px] text-slate-500 font-bold uppercase mt-1 tracking-wider">Facturation Sénégal</p>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="bg-slate-100 p-1 rounded-xl hidden sm:flex">
            <button onClick={() => setActiveTab('edit')} className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'edit' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}>Éditeur</button>
            <button onClick={() => setActiveTab('preview')} className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'preview' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}>Aperçu</button>
          </div>
          <button onClick={() => window.print()} className="bg-slate-900 text-white px-6 py-2 rounded-xl text-sm font-bold flex items-center gap-2 shadow-xl hover:bg-black active:scale-95 transition-all"><Download className="w-4 h-4" /> PDF</button>
        </div>
      </header>

      <main className="flex-1 max-w-[1600px] mx-auto w-full p-4 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 relative">
        <aside className="lg:col-span-1 hidden lg:flex flex-col gap-4 sticky top-32 no-print h-fit">
          {steps.map(s => (
            <button key={s.id} onClick={() => setActiveStep(s.id)} className={`w-20 h-20 rounded-2xl flex flex-col items-center justify-center transition-all group ${activeStep === s.id ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100' : 'bg-white border text-slate-400 hover:border-indigo-200 hover:text-indigo-600'}`}>
              <s.icon className={`w-6 h-6 mb-1 transition-transform group-hover:scale-110 ${activeStep === s.id ? 'scale-110' : ''}`} />
              <span className="text-[10px] font-bold uppercase">{s.label}</span>
            </button>
          ))}
          <div className="h-px bg-slate-100 my-2" />
          <button onClick={resetInvoice} className="w-20 h-20 rounded-2xl border bg-white text-slate-400 hover:text-red-500 flex flex-col items-center justify-center transition-all"><RefreshCw className="w-5 h-5" /><span className="text-[10px] font-bold uppercase mt-1">Reset</span></button>
        </aside>

        <section className={`lg:col-span-5 space-y-6 ${activeTab === 'preview' ? 'hidden' : 'animate-in fade-in slide-in-from-bottom-2'}`}>
          <div className="lg:hidden flex overflow-x-auto gap-2 pb-2 scrollbar-hide no-print">
            {steps.map(s => (
              <button key={s.id} onClick={() => setActiveStep(s.id)} className={`px-4 py-2 rounded-full text-xs font-bold shrink-0 border transition-all ${activeStep === s.id ? 'bg-indigo-600 text-white' : 'bg-white text-slate-500'}`}>{s.label}</button>
            ))}
          </div>

          {activeStep === 0 && (
            <EditorStepCompany 
              sender={invoice.sender} 
              profiles={profiles} 
              activeProfileId={activeProfileId}
              onUpdate={updateSender}
              onSwitch={switchProfile}
              onAdd={addNewProfile}
              onDelete={deleteProfile}
            />
          )}
          {activeStep === 1 && (
            <EditorStepClient 
              receiver={invoice.receiver} 
              invoiceNumber={invoice.invoiceNumber}
              dueDate={invoice.dueDate}
              onUpdateReceiver={updateReceiver}
              onUpdateInvoice={(f, v) => setInvoice(p => ({ ...p, [f]: v }))}
            />
          )}
          {activeStep === 2 && (
            <EditorStepItems 
              invoice={invoice} 
              updateItem={updateItem} 
              addItem={addItem} 
              removeItem={removeItem} 
            />
          )}
          {activeStep === 3 && (
            <EditorStepFinalize 
              invoice={invoice} 
              onUpdate={(f, v) => setInvoice(p => ({ ...p, [f]: v }))} 
            />
          )}
          
          <div className="flex justify-between items-center pt-4 no-print">
            <button disabled={activeStep === 0} onClick={() => setActiveStep(p => p - 1)} className={`text-slate-500 font-bold hover:text-indigo-600 transition-colors ${activeStep === 0 ? 'opacity-0' : ''}`}>Précédent</button>
            <div className="bg-slate-900 text-white px-8 py-3 rounded-2xl flex items-center gap-6 shadow-2xl">
               <div className="flex flex-col items-end">
                 <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Total TTC</span>
                 <span className="text-lg font-black">{calculateTotal(invoice.items, invoice.taxRate).toLocaleString()} {invoice.currency}</span>
               </div>
               <div className="w-px h-8 bg-white/10" />
               <button onClick={() => activeStep < 3 ? setActiveStep(p => p + 1) : setActiveTab('preview')} className="text-sm font-bold flex items-center gap-1 hover:text-indigo-400 transition-colors">
                 {activeStep < 3 ? 'Suivant' : 'Réviser'} <ChevronRight className="w-4 h-4" />
               </button>
            </div>
          </div>
        </section>

        <section className={`lg:col-span-6 sticky top-28 h-fit ${activeTab === 'preview' ? 'block' : 'hidden lg:block'}`}>
           <div className="bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] overflow-hidden border border-slate-100 ring-1 ring-slate-100">
              <div className="bg-slate-900 text-white px-6 py-2 flex items-center gap-2 no-print">
                <Eye className="w-4 h-4 text-indigo-400" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Aperçu en temps réel</span>
              </div>
              <div className="bg-[#F8FAFC] p-2 sm:p-4">
                 <InvoicePreview data={invoice} />
              </div>
           </div>
        </section>
      </main>

      <ChatAssistant invoice={invoice} onInvoiceUpdate={(u) => setInvoice(prev => ({ ...prev, ...u }))} />
    </div>
  );
};
export default App;
