
import React, { useState, useEffect } from 'react';
import { FileText, Download, Eye, Building2, User, ListOrdered, FileCheck, RefreshCw, ChevronRight, Moon, Sun, Loader2 } from 'lucide-react';
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
  const [isDark, setIsDark] = useState(() => localStorage.getItem('theme') === 'dark');
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const handleDownloadPDF = async () => {
    const element = document.getElementById('invoice-preview-capture');
    if (!element) return;
    
    setIsDownloading(true);
    
    const opt = {
      margin: 0,
      filename: `Facture-${invoice.invoiceNumber}-${invoice.receiver.name.replace(/\s+/g, '_')}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2, 
        useCORS: true,
        letterRendering: true,
        backgroundColor: '#ffffff'
      },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    try {
      // @ts-ignore - html2pdf is loaded from CDN in index.html
      await html2pdf().from(element).set(opt).save();
    } catch (error) {
      console.error('PDF Generation failed:', error);
      // Fallback to window.print if html2pdf fails
      window.print();
    } finally {
      setIsDownloading(false);
    }
  };

  const steps = [
    { id: 0, label: 'Entreprise', icon: Building2 },
    { id: 1, label: 'Client', icon: User },
    { id: 2, label: 'Articles', icon: ListOrdered },
    { id: 3, label: 'Finaliser', icon: FileCheck },
  ];

  return (
    <div className={`${isDark ? 'dark' : ''} min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col font-inter antialiased transition-colors duration-300`}>
      <header className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b dark:border-slate-800 sticky top-0 z-50 px-6 py-4 no-print flex justify-between items-center transition-colors">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 w-10 h-10 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-100 dark:shadow-none">
            <FileText className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900 dark:text-white leading-none">DevisFlow SN</h1>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase mt-1 tracking-wider">Facturation Professionnelle</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsDark(!isDark)}
            className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all border border-transparent dark:border-slate-700"
            title="Changer le thème"
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          
          <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-xl hidden sm:flex border border-transparent dark:border-slate-700">
            <button onClick={() => setActiveTab('edit')} className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'edit' ? 'bg-white dark:bg-slate-700 shadow-sm text-indigo-600 dark:text-indigo-300' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}>Éditeur</button>
            <button onClick={() => setActiveTab('preview')} className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'preview' ? 'bg-white dark:bg-slate-700 shadow-sm text-indigo-600 dark:text-indigo-300' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}>Aperçu</button>
          </div>
          
          <button 
            onClick={handleDownloadPDF} 
            disabled={isDownloading}
            className="bg-slate-900 dark:bg-indigo-600 text-white px-6 py-2 rounded-xl text-sm font-bold flex items-center gap-2 shadow-xl hover:bg-black dark:hover:bg-indigo-500 active:scale-95 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isDownloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            {isDownloading ? 'Génération...' : 'Télécharger PDF'}
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-[1600px] mx-auto w-full p-4 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 relative">
        {/* Navigation Sidebar */}
        <aside className="lg:col-span-1 hidden lg:flex flex-col gap-4 sticky top-32 no-print h-fit">
          {steps.map(s => (
            <button 
              key={s.id} 
              onClick={() => { setActiveStep(s.id); setActiveTab('edit'); }} 
              className={`w-20 h-20 rounded-2xl flex flex-col items-center justify-center transition-all group ${activeStep === s.id ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100 dark:shadow-none' : 'bg-white dark:bg-slate-900 border dark:border-slate-800 text-slate-400 dark:text-slate-500 hover:border-indigo-200 dark:hover:border-indigo-800 hover:text-indigo-600'}`}
              title={s.label}
            >
              <s.icon className={`w-6 h-6 mb-1 transition-transform group-hover:scale-110 ${activeStep === s.id ? 'scale-110' : ''}`} />
              <span className="text-[10px] font-bold uppercase tracking-tighter">{s.label}</span>
            </button>
          ))}
          <div className="h-px bg-slate-200 dark:bg-slate-800 my-2" />
          <button 
            onClick={resetInvoice} 
            className="w-20 h-20 rounded-2xl border dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-400 hover:text-red-500 flex flex-col items-center justify-center transition-all"
            title="Réinitialiser"
          >
            <RefreshCw className="w-5 h-5" />
            <span className="text-[10px] font-bold uppercase mt-1">Reset</span>
          </button>
        </aside>

        {/* Editor Column */}
        <section className={`lg:col-span-5 space-y-6 ${activeTab === 'preview' ? 'hidden' : 'animate-in fade-in slide-in-from-bottom-2'}`}>
          <div className="lg:hidden flex overflow-x-auto gap-2 pb-2 scrollbar-hide no-print mb-4">
            {steps.map(s => (
              <button 
                key={s.id} 
                onClick={() => setActiveStep(s.id)} 
                className={`px-4 py-2 rounded-full text-xs font-bold shrink-0 border dark:border-slate-800 transition-all ${activeStep === s.id ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-slate-900 text-slate-500'}`}
              >
                {s.label}
              </button>
            ))}
          </div>

          <div className="transition-all duration-300">
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
          </div>
          
          {/* Navigation Controls */}
          <div className="flex justify-between items-center pt-4 no-print">
            <button 
              disabled={activeStep === 0} 
              onClick={() => setActiveStep(p => p - 1)} 
              className={`text-slate-500 dark:text-slate-400 font-bold hover:text-indigo-600 transition-colors py-2 px-4 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 ${activeStep === 0 ? 'opacity-0 pointer-events-none' : ''}`}
            >
              Précédent
            </button>
            <div className="bg-slate-900 dark:bg-slate-800 text-white px-6 sm:px-8 py-3 rounded-2xl flex items-center gap-4 sm:gap-6 shadow-2xl border dark:border-slate-700">
               <div className="flex flex-col items-end">
                 <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Total à payer</span>
                 <span className="text-lg font-black whitespace-nowrap">{calculateTotal(invoice.items, invoice.taxRate).toLocaleString()} {invoice.currency}</span>
               </div>
               <div className="w-px h-8 bg-white/10 dark:bg-slate-700" />
               <button 
                 onClick={() => activeStep < 3 ? setActiveStep(p => p + 1) : setActiveTab('preview')} 
                 className="text-sm font-bold flex items-center gap-1 hover:text-indigo-400 transition-colors px-2"
               >
                 {activeStep < 3 ? 'Suivant' : 'Terminer'} <ChevronRight className="w-4 h-4" />
               </button>
            </div>
          </div>
        </section>

        {/* Preview Column */}
        <section className={`lg:col-span-6 sticky top-28 h-fit ${activeTab === 'preview' ? 'block' : 'hidden lg:block'}`}>
           <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] overflow-hidden border border-slate-100 dark:border-slate-800 ring-1 ring-slate-100 dark:ring-slate-800">
              <div className="bg-slate-900 dark:bg-slate-800 text-white px-6 py-2.5 flex justify-between items-center no-print">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-indigo-400" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Rendu Direct</span>
                </div>
                {activeTab === 'preview' && (
                  <span className="text-[9px] bg-indigo-600 px-2 py-0.5 rounded font-black uppercase">Format A4</span>
                )}
              </div>
              <div id="invoice-preview-capture" className="bg-slate-50 dark:bg-slate-950 p-0 sm:p-4 md:p-8 overflow-hidden">
                 <InvoicePreview data={invoice} />
              </div>
           </div>
        </section>
      </main>

      <ChatAssistant invoice={invoice} onInvoiceUpdate={(u) => setInvoice(prev => ({ ...prev, ...u }))} />
      
      {/* Global Overlays */}
      {isDownloading && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-[200] flex items-center justify-center no-print">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] shadow-2xl flex flex-col items-center gap-4 max-w-sm text-center border dark:border-slate-800">
            <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white">Génération de votre PDF</h4>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Préparation du rendu haute définition...</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default App;
