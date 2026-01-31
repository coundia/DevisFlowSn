
import React, { useState, useEffect } from 'react';
import { FileText, Download, Eye, Building2, User, ListOrdered, FileCheck, RefreshCw, ChevronRight, Moon, Sun, Loader2, CheckCircle2, WifiOff, Bookmark, Settings } from 'lucide-react';
import { useInvoiceState } from './hooks/useInvoiceState';
import { calculateTotal } from './utils/invoiceUtils';
import InvoicePreview from './components/InvoicePreview';
import EditorStepCompany from './components/EditorStepCompany';
import EditorStepClient from './components/EditorStepClient';
import EditorStepItems from './components/EditorStepItems';
import EditorStepFinalize from './components/EditorStepFinalize';
import ChatAssistant from './components/ChatAssistant';
import EditorStepCatalog from './components/EditorStepCatalog';
import EditorStepConfig from './components/EditorStepConfig';

const App: React.FC = () => {
  const { 
    invoice, setInvoice, profiles, activeProfileId, templates, catalog,
    updateSender, updateReceiver, addItem, updateItem, removeItem, 
    switchProfile, addNewProfile, duplicateProfile, deleteProfile, resetInvoice,
    saveAsTemplate, applyTemplate, deleteTemplate,
    addCatalogItem, updateCatalogItem, deleteCatalogItem
  } = useInvoiceState();
  
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const [activeStep, setActiveStep] = useState(0);
  const [isDark, setIsDark] = useState(() => {
    if (localStorage.getItem('theme') === 'dark') return true;
    if (localStorage.getItem('theme') === 'light') return false;
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const [isDownloading, setIsDownloading] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date>(new Date());
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (invoice.items.length > 0 || invoice.receiver.name !== 'Nom du Client') {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [invoice]);

  useEffect(() => {
    setLastSaved(new Date());
  }, [invoice]);

  useEffect(() => {
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const handleDownloadPDF = async () => {
    const element = document.getElementById('invoice-pdf-content');
    if (!element) return;
    setIsDownloading(true);
    const opt = {
      margin: 0,
      filename: `Facture-${invoice.invoiceNumber}-${invoice.receiver.name.replace(/\s+/g, '_')}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, letterRendering: true, backgroundColor: '#ffffff' },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    try {
      // @ts-ignore
      await html2pdf().from(element).set(opt).save();
    } catch (error) {
      console.error('PDF Generation failed:', error);
      window.print();
    } finally {
      setIsDownloading(false);
    }
  };
  
  const handleApplyTemplate = (templateId: string) => {
    if (applyTemplate(templateId)) {
      setActiveStep(1); 
      setActiveTab('edit');
    }
  };

  const steps = [
    { id: 0, label: 'Société', icon: Building2 },
    { id: 1, label: 'Client', icon: User },
    { id: 2, label: 'Catalogue', icon: Bookmark },
    { id: 3, label: 'Articles', icon: ListOrdered },
    { id: 4, label: 'Réglages', icon: Settings },
    { id: 5, label: 'Finaliser', icon: FileCheck },
  ];

  return (
    <div className={`${isDark ? 'dark' : ''} min-h-screen bg-slate-100 dark:bg-slate-950 flex flex-col font-inter antialiased transition-colors duration-500`}>
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50 px-6 py-4 no-print flex justify-between items-center transition-all">
        <div className="flex items-center gap-4">
          <div className="bg-gradient-to-br from-indigo-500 to-indigo-700 w-11 h-11 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200 dark:shadow-indigo-900/20">
            <FileText className="text-white w-6 h-6" />
          </div>
          <div className="hidden xs:block">
            <h1 className="text-lg font-black text-slate-900 dark:text-white tracking-tight leading-none">DevisFlow SN</h1>
            <div className="flex items-center gap-2 mt-1.5">
               <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest">Facturation Pro</p>
               {!isOnline && (
                 <span className="flex items-center gap-1 text-[9px] bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded-full font-black uppercase tracking-tighter">
                   <WifiOff className="w-2.5 h-2.5" /> Offline
                 </span>
               )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="hidden md:flex items-center gap-2.5 px-3.5 py-2 bg-slate-100/50 dark:bg-slate-800/40 rounded-xl border border-slate-200/60 dark:border-slate-700/50">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
              Saved: {lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
          <div className="h-8 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block" />
          <button 
            onClick={() => setIsDark(!isDark)}
            className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-700 hover:shadow-sm transition-all border border-slate-200/50 dark:border-slate-700"
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          
          <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-xl hidden sm:flex border border-slate-200/50 dark:border-slate-700">
            <button onClick={() => setActiveTab('edit')} className={`px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${activeTab === 'edit' ? 'bg-white dark:bg-slate-700 shadow-md text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'}`}>Éditeur</button>
            <button onClick={() => setActiveTab('preview')} className={`px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${activeTab === 'preview' ? 'bg-white dark:bg-slate-700 shadow-md text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'}`}>Aperçu</button>
          </div>
          
          <button 
            onClick={handleDownloadPDF} 
            disabled={isDownloading}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 sm:px-7 py-2.5 rounded-xl text-sm font-black flex items-center gap-2.5 shadow-[0_10px_20px_-5px_rgba(79,70,229,0.4)] dark:shadow-none hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
          >
            {isDownloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            <span className="hidden sm:inline uppercase tracking-widest text-[11px]">{isDownloading ? 'Génération...' : 'Exporter PDF'}</span>
            <span className="sm:hidden font-black uppercase tracking-widest text-[11px]">PDF</span>
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-[1600px] mx-auto w-full p-4 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-10 relative">
        <aside className="lg:col-span-1 hidden lg:flex flex-col gap-5 sticky top-32 no-print h-fit">
          {steps.map(s => (
            <button 
              key={s.id} 
              onClick={() => { setActiveStep(s.id); setActiveTab('edit'); }} 
              className={`w-20 h-20 rounded-3xl flex flex-col items-center justify-center transition-all group relative ${activeStep === s.id ? 'bg-indigo-600 text-white shadow-2xl shadow-indigo-200 dark:shadow-none translate-x-2' : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500 hover:border-indigo-200 dark:hover:border-indigo-800 hover:text-indigo-600 hover:-translate-y-1'}`}
            >
              <s.icon className={`w-6 h-6 mb-1.5 transition-transform ${activeStep === s.id ? 'scale-110' : 'group-hover:scale-110'}`} />
              <span className="text-[9px] font-black uppercase tracking-tighter">{s.label}</span>
              {activeStep === s.id && <div className="absolute -left-1 w-1.5 h-8 bg-indigo-600 rounded-full" />}
            </button>
          ))}
          <div className="h-px bg-slate-200 dark:bg-slate-800 my-4" />
          <button 
            onClick={resetInvoice} 
            className="w-20 h-20 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-400 hover:text-rose-500 hover:border-rose-100 dark:hover:border-rose-900 flex flex-col items-center justify-center transition-all hover:-translate-y-1"
          >
            <RefreshCw className="w-5 h-5" />
            <span className="text-[9px] font-black uppercase mt-1.5">Reset</span>
          </button>
        </aside>

        <section className={`lg:col-span-5 space-y-8 ${activeTab === 'preview' ? 'hidden' : 'animate-in fade-in slide-in-from-bottom-4 duration-500'}`}>
          <div className="lg:hidden flex overflow-x-auto gap-3 pb-4 scrollbar-hide no-print">
            {steps.map(s => (
              <button 
                key={s.id} 
                onClick={() => setActiveStep(s.id)} 
                className={`px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest shrink-0 border transition-all ${activeStep === s.id ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-100 dark:shadow-none' : 'bg-white dark:bg-slate-900 text-slate-500 border-slate-200 dark:border-slate-800'}`}
              >
                {s.label}
              </button>
            ))}
          </div>

          <div className="transition-all duration-300">
            {activeStep === 0 && <EditorStepCompany sender={invoice.sender} profiles={profiles} activeProfileId={activeProfileId} onUpdate={updateSender} onSwitch={switchProfile} onAdd={addNewProfile} onDuplicate={duplicateProfile} onDelete={deleteProfile} />}
            {activeStep === 1 && <EditorStepClient receiver={invoice.receiver} invoiceNumber={invoice.invoiceNumber} dueDate={invoice.dueDate} onUpdateReceiver={updateReceiver} onUpdateInvoice={(f, v) => setInvoice(p => ({ ...p, [f]: v }))} />}
            {activeStep === 2 && <EditorStepCatalog catalog={catalog} onAdd={addCatalogItem} onUpdate={updateCatalogItem} onDelete={deleteCatalogItem} />}
            {activeStep === 3 && <EditorStepItems invoice={invoice} updateItem={updateItem} addItem={addItem} removeItem={removeItem} catalog={catalog} />}
            {activeStep === 4 && <EditorStepConfig invoice={invoice} onUpdate={(f, v) => setInvoice(p => ({ ...p, [f]: v }))} />}
            {activeStep === 5 && <EditorStepFinalize invoice={invoice} onUpdate={(f, v) => setInvoice(p => ({ ...p, [f]: v }))} templates={templates} onSaveTemplate={saveAsTemplate} onApplyTemplate={handleApplyTemplate} onDeleteTemplate={deleteTemplate} />}
          </div>
          
          <div className="flex justify-between items-center pt-6 no-print">
            <button 
              disabled={activeStep === 0} 
              onClick={() => setActiveStep(p => p - 1)} 
              className={`text-slate-400 dark:text-slate-500 font-black uppercase tracking-[0.2em] text-[10px] hover:text-indigo-600 transition-colors py-3 px-6 rounded-2xl hover:bg-indigo-50 dark:hover:bg-slate-800 ${activeStep === 0 ? 'opacity-0 pointer-events-none' : ''}`}
            >
              Précédent
            </button>
            <div className="bg-slate-950 dark:bg-slate-900 text-white px-7 sm:px-10 py-4 rounded-[2.5rem] flex items-center gap-6 sm:gap-10 shadow-2xl border border-white/10">
               <div className="flex flex-col items-end">
                 <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1.5">Total à Payer</span>
                 <span className="text-xl font-black tracking-tight leading-none">{calculateTotal(invoice.items, invoice.taxRate).toLocaleString()} <span className="text-indigo-400 ml-1">{invoice.currency}</span></span>
               </div>
               <div className="w-px h-10 bg-white/10" />
               <button 
                 onClick={() => activeStep < 5 ? setActiveStep(p => p + 1) : setActiveTab('preview')} 
                 className="text-[11px] font-black uppercase tracking-[0.2em] flex items-center gap-2 hover:text-indigo-400 transition-all active:scale-90"
               >
                 {activeStep < 5 ? 'Suivant' : 'Vérifier'} <ChevronRight className="w-4 h-4" />
               </button>
            </div>
          </div>
        </section>

        <section className={`lg:col-span-6 sticky top-28 h-fit ${activeTab === 'preview' ? 'block' : 'hidden lg:block'}`}>
           <div className="bg-white dark:bg-slate-900 rounded-[3rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)] dark:shadow-none overflow-hidden border border-slate-200 dark:border-slate-800 relative group">
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              <div className="bg-slate-950 dark:bg-slate-800 text-white px-8 py-3.5 flex justify-between items-center no-print">
                <div className="flex items-center gap-3">
                  <Eye className="w-4 h-4 text-indigo-400" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">Aperçu HD</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest">Format A4</span>
                  {activeTab === 'preview' && (
                    <span className="text-[9px] bg-indigo-600 px-3 py-1 rounded-full font-black uppercase tracking-tighter">1:1 Zoom</span>
                  )}
                </div>
              </div>
              <div className="bg-slate-50 dark:bg-slate-950 p-2 sm:p-6 md:p-12 overflow-hidden transition-colors duration-500">
                 <InvoicePreview data={invoice} />
              </div>
           </div>
        </section>
      </main>

      <ChatAssistant invoice={invoice} onInvoiceUpdate={(u) => setInvoice(prev => ({ ...prev, ...u }))} isOnline={isOnline} />
      
      {isDownloading && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-md z-[200] flex items-center justify-center no-print animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 p-12 rounded-[3rem] shadow-2xl flex flex-col items-center gap-6 max-w-sm text-center border border-slate-100 dark:border-slate-800">
            <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-900/30 rounded-3xl flex items-center justify-center relative">
              <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-4 border-white dark:border-slate-900" />
            </div>
            <div>
              <h4 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Génération PDF</h4>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 font-medium">Préparation du rendu haute définition...</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default App;
