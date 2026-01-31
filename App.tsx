
import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, 
  Trash2, 
  Download, 
  Eye, 
  FileText, 
  Sparkles,
  RefreshCw,
  Info,
  Check,
  Building2,
  Upload,
  X,
  User,
  ListOrdered,
  FileCheck,
  ChevronRight,
  Settings2,
  Palette,
  Briefcase,
  MessageSquare,
  Send,
  Bot,
  Sparkle
} from 'lucide-react';
import { InvoiceData, DEFAULT_INVOICE, LineItem, CompanyDetails, DEFAULT_SENDER, INVOICE_THEMES } from './types';
import InvoicePreview from './components/InvoicePreview';
import { GoogleGenAI, Type } from "@google/genai";

interface ChatMessage {
  role: 'user' | 'assistant';
  text: string;
}

const App: React.FC = () => {
  const [profiles, setProfiles] = useState<CompanyDetails[]>([]);
  const [activeProfileId, setActiveProfileId] = useState<string>('');
  const [invoice, setInvoice] = useState<InvoiceData>(DEFAULT_INVOICE);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const [activeStep, setActiveStep] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Chat State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', text: "Bonjour ! Je suis votre assistant DevisFlow. Comment puis-je vous aider à configurer votre facture aujourd'hui ?" }
  ]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const steps = [
    { id: 0, label: 'Entreprise', icon: Building2 },
    { id: 1, label: 'Client', icon: User },
    { id: 2, label: 'Articles', icon: ListOrdered },
    { id: 3, label: 'Finaliser', icon: FileCheck },
  ];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isChatOpen]);

  // Initialization: Load profiles and current draft
  useEffect(() => {
    const savedProfiles = localStorage.getItem('devisflow_profiles');
    const savedDraft = localStorage.getItem('devisflow_current_invoice');
    const savedTheme = localStorage.getItem('devisflow_last_theme');
    
    let initialProfiles: CompanyDetails[] = [DEFAULT_SENDER];
    if (savedProfiles) {
      initialProfiles = JSON.parse(savedProfiles);
    }
    setProfiles(initialProfiles);

    if (savedDraft) {
      const parsedDraft = JSON.parse(savedDraft);
      setInvoice(parsedDraft);
      setActiveProfileId(parsedDraft.sender.id);
    } else {
      setActiveProfileId(initialProfiles[0].id);
      setInvoice({
        ...DEFAULT_INVOICE,
        sender: initialProfiles[0],
        themeId: savedTheme || DEFAULT_INVOICE.themeId
      });
    }
  }, []);

  // Save profiles whenever they change
  useEffect(() => {
    if (profiles.length > 0) {
      localStorage.setItem('devisflow_profiles', JSON.stringify(profiles));
    }
  }, [profiles]);

  // Save current invoice draft whenever it changes
  useEffect(() => {
    localStorage.setItem('devisflow_current_invoice', JSON.stringify(invoice));
    localStorage.setItem('devisflow_last_theme', invoice.themeId);
  }, [invoice]);

  const updateSender = (field: string, value: string | undefined) => {
    setInvoice(prev => {
      const newSender = { ...prev.sender, [field]: value };
      setProfiles(prevProfiles => prevProfiles.map(p => p.id === activeProfileId ? newSender : p));
      return { ...prev, sender: newSender };
    });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => updateSender('logo', reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const updateReceiver = (field: string, value: string) => {
    setInvoice(prev => ({ ...prev, receiver: { ...prev.receiver, [field]: value } }));
  };

  const updateItem = (id: string, field: keyof LineItem, value: string | number) => {
    setInvoice(prev => ({
      ...prev,
      items: prev.items.map(item => item.id === id ? { ...item, [field]: value } : item)
    }));
  };

  const addItem = () => {
    setInvoice(prev => ({
      ...prev,
      items: [...prev.items, { id: Math.random().toString(36).substr(2, 9), description: '', quantity: 1, rate: 0 }]
    }));
  };

  const removeItem = (id: string) => {
    setInvoice(prev => ({ ...prev, items: prev.items.filter(item => item.id !== id) }));
  };

  const switchProfile = (id: string) => {
    const profile = profiles.find(p => p.id === id);
    if (profile) {
      setActiveProfileId(id);
      setInvoice(prev => ({ ...prev, sender: profile }));
    }
  };

  const addNewProfile = () => {
    const newId = Math.random().toString(36).substr(2, 9);
    const newProfile = { ...DEFAULT_SENDER, id: newId, name: 'Nouvelle Société', logo: undefined };
    setProfiles(prev => [...prev, newProfile]);
    setActiveProfileId(newId);
    setInvoice(prev => ({ ...prev, sender: newProfile }));
  };

  const deleteProfile = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (profiles.length === 1) return;
    const newProfiles = profiles.filter(p => p.id !== id);
    setProfiles(newProfiles);
    if (activeProfileId === id) {
      setActiveProfileId(newProfiles[0].id);
      setInvoice(prev => ({ ...prev, sender: newProfiles[0] }));
    }
  };

  const resetInvoice = () => {
    if (window.confirm('Voulez-vous vraiment réinitialiser cette facture ? Tous les champs clients et articles seront vidés.')) {
      const currentSender = invoice.sender;
      setInvoice({
        ...DEFAULT_INVOICE,
        sender: currentSender,
        invoiceNumber: 'FAC-' + Math.floor(1000 + Math.random() * 9000),
      });
      setActiveStep(0);
    }
  };

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isAiLoading) return;

    const userMessage = chatInput.trim();
    setChatInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsAiLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Tu es un assistant expert en facturation pour le marché Sénégalais.
          VOICI LA FACTURE ACTUELLE (JSON): ${JSON.stringify(invoice)}
          REQUÊTE UTILISATEUR: "${userMessage}"
          
          INSTRUCTIONS:
          1. Analyse la requête pour mettre à jour les données (ajouter/supprimer articles, changer client, modifier taxes, etc.).
          2. Retourne la facture MISE À JOUR au format JSON exact de l'objet fourni.
          3. Ajoute un champ "assistantMessage" décrivant brièvement ce que tu as fait en français.
          4. Respecte les formats : dates (YYYY-MM-DD), nombres (uniquement numériques), id (strings uniques).`,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              updatedInvoice: {
                type: Type.OBJECT,
                properties: {
                  invoiceNumber: { type: Type.STRING },
                  date: { type: Type.STRING },
                  dueDate: { type: Type.STRING },
                  taxRate: { type: Type.NUMBER },
                  currency: { type: Type.STRING },
                  notes: { type: Type.STRING },
                  terms: { type: Type.STRING },
                  themeId: { type: Type.STRING },
                  receiver: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      address: { type: Type.STRING },
                      email: { type: Type.STRING },
                      phone: { type: Type.STRING }
                    }
                  },
                  items: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        id: { type: Type.STRING },
                        description: { type: Type.STRING },
                        quantity: { type: Type.NUMBER },
                        rate: { type: Type.NUMBER }
                      }
                    }
                  }
                }
              },
              assistantMessage: { type: Type.STRING }
            }
          }
        }
      });

      const result = JSON.parse(response.text);
      if (result.updatedInvoice) {
        setInvoice(prev => ({
          ...prev,
          ...result.updatedInvoice,
          sender: prev.sender 
        }));
      }
      setMessages(prev => [...prev, { role: 'assistant', text: result.assistantMessage || "C'est fait !" }]);
    } catch (error) {
      console.error('AI Chat Error:', error);
      setMessages(prev => [...prev, { role: 'assistant', text: "Désolé, j'ai eu un problème pour traiter votre demande. Réessayez ?" }]);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleAiSuggestions = async () => {
    setIsAiLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Générez 3 articles de facturation professionnelle pour une entreprise nommée "${invoice.sender.name}" fournissant des services à "${invoice.receiver.name}". Retournez un tableau JSON d'objets avec description (en français), quantity et rate.`,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                description: { type: Type.STRING },
                quantity: { type: Type.NUMBER },
                rate: { type: Type.NUMBER }
              },
              required: ['description', 'quantity', 'rate']
            }
          }
        }
      });
      const suggestions = JSON.parse(response.text);
      setInvoice(prev => ({ ...prev, items: [...prev.items, ...suggestions.map((s: any) => ({ ...s, id: Math.random().toString(36).substr(2, 9) }))] }));
    } catch (error) {
      console.error('AI error:', error);
    } finally {
      setIsAiLoading(false);
    }
  };

  const calculateSubtotal = () => invoice.items.reduce((acc, item) => acc + (item.quantity * item.rate), 0);
  const calculateTax = () => calculateSubtotal() * (invoice.taxRate / 100);
  const calculateTotal = () => calculateSubtotal() + calculateTax();

  return (
    <div className="min-h-screen bg-[#FDFDFE] flex flex-col font-inter antialiased overflow-x-hidden">
      <header className="bg-white/80 backdrop-blur-md border-b sticky top-0 z-50 px-6 py-4 no-print">
        <div className="max-w-[1600px] mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 w-10 h-10 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-100">
              <FileText className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900 leading-none">DevisFlow SN</h1>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1">Facturation Sénégal</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex bg-slate-100 p-1 rounded-xl">
              <button 
                onClick={() => setActiveTab('edit')}
                className={`px-5 py-1.5 rounded-lg text-sm font-semibold transition-all ${activeTab === 'edit' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Éditeur
              </button>
              <button 
                onClick={() => setActiveTab('preview')}
                className={`px-5 py-1.5 rounded-lg text-sm font-semibold transition-all ${activeTab === 'preview' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Aperçu
              </button>
            </div>
            <button 
              onClick={() => window.print()}
              className="bg-slate-900 hover:bg-black text-white px-6 py-2 rounded-xl flex items-center gap-2 text-sm font-bold transition-all shadow-xl active:scale-95"
            >
              <Download className="w-4 h-4" /> <span className="hidden xs:inline">Télécharger PDF</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-[1600px] mx-auto w-full p-4 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative">
        
        <aside className="lg:col-span-1 hidden lg:flex flex-col gap-4 no-print sticky top-32">
          {steps.map((step) => {
            const Icon = step.icon;
            const isActive = activeStep === step.id;
            return (
              <button
                key={step.id}
                onClick={() => setActiveStep(step.id)}
                className={`flex flex-col items-center justify-center w-20 h-20 rounded-2xl transition-all group ${
                  isActive ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-200' : 'bg-white border border-slate-100 text-slate-400 hover:border-indigo-200 hover:text-indigo-600'
                }`}
              >
                <Icon className={`w-6 h-6 mb-1 ${isActive ? 'scale-110' : 'group-hover:scale-110'} transition-transform`} />
                <span className="text-[10px] font-bold uppercase">{step.label}</span>
              </button>
            );
          })}
          <div className="flex flex-col items-center justify-center w-20 mt-4">
            <button 
              onClick={resetInvoice}
              className="p-3 bg-white border border-slate-100 text-slate-400 hover:text-red-600 hover:border-red-100 rounded-2xl transition-all shadow-sm"
              title="Réinitialiser la facture"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
            <span className="text-[8px] font-black text-slate-400 uppercase mt-2">Reset</span>
          </div>
        </aside>

        <section className={`lg:col-span-5 space-y-6 ${activeTab === 'preview' ? 'hidden' : 'block'} no-print`}>
          
          <div className="lg:hidden flex overflow-x-auto gap-2 pb-2 -mx-2 px-2 scrollbar-hide">
            {steps.map((step) => (
              <button
                key={step.id}
                onClick={() => setActiveStep(step.id)}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold transition-all border ${
                  activeStep === step.id ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-500 border-slate-200'
                }`}
              >
                {step.label}
              </button>
            ))}
          </div>

          {activeStep === 0 && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="bg-white rounded-[2rem] border border-slate-100 p-8 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-indigo-600" /> Profil de l'entreprise
                  </h2>
                  <button onClick={addNewProfile} className="text-xs font-bold text-indigo-600 hover:text-indigo-700">+ Nouvelle Entreprise</button>
                </div>

                <div className="flex gap-2 overflow-x-auto pb-4 mb-6">
                  {profiles.map(p => (
                    <button 
                      key={p.id}
                      onClick={() => switchProfile(p.id)}
                      className={`relative px-4 py-2 rounded-xl text-xs font-bold border-2 transition-all shrink-0 ${
                        activeProfileId === p.id ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-50 bg-slate-50 text-slate-500 hover:border-slate-200'
                      }`}
                    >
                      {p.name || 'Sans nom'}
                      {profiles.length > 1 && (
                        <div onClick={(e) => deleteProfile(p.id, e)} className="absolute -top-1 -right-1 bg-white border border-slate-200 rounded-full p-0.5 text-slate-400 hover:text-red-500 shadow-sm">
                          <X className="w-2.5 h-2.5" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>

                <div className="space-y-6">
                  <div className="flex items-center gap-6 p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                    <div className="relative w-16 h-16 bg-white rounded-xl shadow-sm flex items-center justify-center overflow-hidden border">
                      {invoice.sender.logo ? (
                        <img src={invoice.sender.logo} className="w-full h-full object-contain p-2" />
                      ) : (
                        <Upload className="w-5 h-5 text-slate-300" />
                      )}
                    </div>
                    <div>
                      <button onClick={() => fileInputRef.current?.click()} className="text-sm font-bold text-indigo-600 hover:underline">Charger le Logo</button>
                      <p className="text-[10px] text-slate-500 font-bold mt-1">PNG, JPG ou SVG. Max 1MB.</p>
                      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleLogoUpload} />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Nom de l'entreprise</label>
                      <input type="text" value={invoice.sender.name} onChange={(e) => updateSender('name', e.target.value)} className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-indigo-100" />
                    </div>
                    <div className="col-span-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Adresse Complète</label>
                      <textarea rows={2} value={invoice.sender.address} onChange={(e) => updateSender('address', e.target.value)} className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-indigo-100 resize-none" />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Email Entreprise</label>
                      <input type="email" value={invoice.sender.email} onChange={(e) => updateSender('email', e.target.value)} className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-indigo-100" />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Téléphone Entreprise</label>
                      <input type="text" value={invoice.sender.phone} onChange={(e) => updateSender('phone', e.target.value)} className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-indigo-100" />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">NINEA</label>
                      <input type="text" placeholder="Ex: 1234567 2G3" value={invoice.sender.ninea} onChange={(e) => updateSender('ninea', e.target.value)} className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-indigo-100" />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">RCCM</label>
                      <input type="text" placeholder="Ex: SN-DKR-2024-B-000" value={invoice.sender.rccm} onChange={(e) => updateSender('rccm', e.target.value)} className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-indigo-100" />
                    </div>
                    <div className="col-span-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Site Web</label>
                      <input type="text" placeholder="www.votre-entreprise.sn" value={invoice.sender.website} onChange={(e) => updateSender('website', e.target.value)} className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-indigo-100" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeStep === 1 && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="bg-white rounded-[2rem] border border-slate-100 p-8 shadow-sm">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-8">
                  <User className="w-5 h-5 text-indigo-600" /> Informations Client
                </h2>
                <div className="space-y-6">
                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Nom du Client</label>
                    <input type="text" value={invoice.receiver.name} onChange={(e) => updateReceiver('name', e.target.value)} className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm font-semibold text-slate-900" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Email Client</label>
                      <input type="email" value={invoice.receiver.email} onChange={(e) => updateReceiver('email', e.target.value)} className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm font-semibold text-slate-900" />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Téléphone Client</label>
                      <input type="text" value={invoice.receiver.phone} onChange={(e) => updateReceiver('phone', e.target.value)} className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm font-semibold text-slate-900" />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Adresse Client</label>
                    <textarea rows={3} value={invoice.receiver.address} onChange={(e) => updateReceiver('address', e.target.value)} className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm font-semibold text-slate-900 resize-none" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">N° Facture</label>
                      <input type="text" value={invoice.invoiceNumber} onChange={(e) => setInvoice(prev => ({...prev, invoiceNumber: e.target.value}))} className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm font-semibold text-slate-900" />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Date d'échéance</label>
                      <input type="date" value={invoice.dueDate} onChange={(e) => setInvoice(prev => ({...prev, dueDate: e.target.value}))} className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm font-semibold text-slate-900" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeStep === 2 && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="bg-white rounded-[2rem] border border-slate-100 p-8 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <ListOrdered className="w-5 h-5 text-indigo-600" /> Lignes de facturation
                  </h2>
                  <button 
                    onClick={handleAiSuggestions} 
                    disabled={isAiLoading}
                    className="flex items-center gap-2 text-indigo-600 bg-indigo-50 px-4 py-2 rounded-xl text-xs font-bold hover:bg-indigo-100 transition-all disabled:opacity-50"
                  >
                    {isAiLoading ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                    IA Suggérer
                  </button>
                </div>

                <div className="space-y-4">
                  {invoice.items.length === 0 && (
                    <div className="text-center py-12 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                      <p className="text-slate-500 text-sm font-bold">Aucun article. Ajoutez-en un !</p>
                    </div>
                  )}
                  {invoice.items.map((item) => (
                    <div key={item.id} className="relative bg-slate-50 p-5 rounded-2xl border border-slate-100 group transition-all hover:bg-white hover:shadow-lg hover:shadow-slate-100">
                      <div className="grid grid-cols-12 gap-4">
                        <div className="col-span-12 sm:col-span-7">
                          <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1 block">Désignation</label>
                          <input type="text" value={item.description} onChange={(e) => updateItem(item.id, 'description', e.target.value)} className="w-full bg-transparent border-none p-0 text-sm font-bold text-slate-900 focus:ring-0" placeholder="Ex: Maintenance" />
                        </div>
                        <div className="col-span-4 sm:col-span-2">
                          <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1 block text-center">Qté</label>
                          <input type="number" value={item.quantity} onChange={(e) => updateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)} className="w-full bg-transparent border-none p-0 text-sm font-bold text-slate-900 focus:ring-0 text-center" />
                        </div>
                        <div className="col-span-4 sm:col-span-2">
                          <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1 block text-right">Prix Unit.</label>
                          <input type="number" value={item.rate} onChange={(e) => updateItem(item.id, 'rate', parseFloat(e.target.value) || 0)} className="w-full bg-transparent border-none p-0 text-sm font-bold text-slate-900 focus:ring-0 text-right" />
                        </div>
                        <div className="col-span-4 sm:col-span-1 flex items-center justify-end">
                          <button onClick={() => removeItem(item.id)} className="text-slate-400 hover:text-red-500 transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div className="mt-2 pt-2 border-t border-slate-200 flex justify-between items-center">
                         <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Sous-total</span>
                         <span className="text-xs font-black text-slate-900">{invoice.currency === 'XOF' ? 'FCFA' : invoice.currency} {(item.quantity * item.rate).toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                  <button onClick={addItem} className="w-full py-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-500 text-sm font-bold hover:border-indigo-400 hover:text-indigo-600 transition-all flex items-center justify-center gap-2">
                    <Plus className="w-4 h-4" /> Ajouter un article
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeStep === 3 && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="bg-white rounded-[2rem] border border-slate-100 p-8 shadow-sm space-y-8">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-8">
                    <FileCheck className="w-5 h-5 text-indigo-600" /> Finaliser les Détails
                  </h2>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Devise</label>
                      <select value={invoice.currency} onChange={(e) => setInvoice(prev => ({...prev, currency: e.target.value}))} className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-indigo-100">
                        <option value="XOF">XOF (FCFA)</option>
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Taux TVA (%)</label>
                      <input type="number" value={invoice.taxRate} onChange={(e) => setInvoice(prev => ({...prev, taxRate: parseFloat(e.target.value) || 0}))} className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-indigo-100" />
                    </div>
                    <div className="col-span-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Notes</label>
                      <textarea value={invoice.notes} onChange={(e) => setInvoice(prev => ({...prev, notes: e.target.value}))} className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm font-semibold text-slate-900 resize-none focus:ring-2 focus:ring-indigo-100" placeholder="Note de remerciement..." />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2 mb-4">
                    <Palette className="w-3 h-3" /> Palette de couleurs
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {INVOICE_THEMES.map((theme) => (
                      <button key={theme.id} onClick={() => setInvoice(prev => ({ ...prev, themeId: theme.id }))} className={`group relative flex items-center gap-3 p-3 rounded-2xl border-2 transition-all ${invoice.themeId === theme.id ? 'border-indigo-600 bg-indigo-50/50' : 'border-slate-100 bg-white hover:border-slate-200'}`}>
                        <div className="w-6 h-6 rounded-full border border-white shadow-sm shrink-0" style={{ background: theme.accent }} />
                        <span className={`text-xs font-bold ${invoice.themeId === theme.id ? 'text-indigo-900' : 'text-slate-700'}`}>
                          {theme.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between items-center pt-4">
            <button disabled={activeStep === 0} onClick={() => setActiveStep(prev => Math.max(0, prev - 1))} className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeStep === 0 ? 'opacity-0' : 'text-slate-500 hover:text-indigo-600 hover:bg-slate-100'}`}>Précédent</button>
            <div className="bg-slate-900 text-white px-8 py-3 rounded-2xl flex items-center gap-4 shadow-xl">
              <div className="flex flex-col items-end">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Total TTC</span>
                <span className="text-lg font-black">{invoice.currency === 'XOF' ? 'FCFA' : invoice.currency} {calculateTotal().toLocaleString()}</span>
              </div>
              <div className="w-px h-8 bg-white/10"></div>
              {activeStep < 3 ? (
                <button onClick={() => setActiveStep(prev => prev + 1)} className="flex items-center gap-1 text-sm font-bold hover:text-indigo-400 transition-colors">Suivant <ChevronRight className="w-4 h-4" /></button>
              ) : (
                <button onClick={() => setActiveTab('preview')} className="flex items-center gap-1 text-sm font-bold hover:text-indigo-400 transition-colors">Réviser</button>
              )}
            </div>
          </div>
        </section>

        <section className={`lg:col-span-6 sticky top-28 h-fit ${activeTab === 'preview' ? 'block' : 'hidden lg:block'}`}>
          <div className="relative">
            <div className="absolute -inset-4 bg-slate-100/50 rounded-[2.5rem] -z-10 border border-slate-200/50 no-print"></div>
            <div className="bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] overflow-hidden border border-slate-100 ring-1 ring-slate-100">
              <div className="bg-slate-900 text-white px-6 py-3 flex items-center justify-between no-print">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-indigo-400" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Aperçu du Document</span>
                </div>
              </div>
              <div className="p-2 sm:p-4 bg-[#F8FAFC]">
                 <div className="bg-white shadow-sm ring-1 ring-slate-200/50">
                    <InvoicePreview data={invoice} />
                 </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* AI Chat Drawer */}
      <div className={`fixed inset-y-0 right-0 w-full sm:w-[400px] bg-white shadow-2xl z-[100] transition-transform duration-500 ease-in-out border-l flex flex-col no-print ${isChatOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-6 border-b flex justify-between items-center bg-slate-900 text-white">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center animate-pulse">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm">Assistant IA</h3>
              <p className="text-[10px] text-indigo-300 font-black uppercase">En ligne</p>
            </div>
          </div>
          <button onClick={() => setIsChatOpen(false)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide bg-slate-50/50">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                m.role === 'user' 
                  ? 'bg-indigo-600 text-white rounded-tr-none' 
                  : 'bg-white border border-slate-100 text-slate-900 rounded-tl-none font-medium'
              }`}>
                {m.text}
              </div>
            </div>
          ))}
          {isAiLoading && (
            <div className="flex justify-start">
              <div className="bg-white border border-slate-100 p-4 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2">
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce"></span>
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">L'IA réfléchit...</span>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        <form onSubmit={handleChatSubmit} className="p-6 border-t bg-white">
          <div className="relative group">
            <input 
              type="text" 
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ex: Ajoute un audit à 200,000 FCFA" 
              className="w-full pl-4 pr-12 py-4 bg-slate-50 border-2 border-transparent rounded-2xl text-sm font-bold text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-0 transition-all outline-none"
            />
            <button 
              type="submit" 
              disabled={!chatInput.trim() || isAiLoading}
              className="absolute right-2 top-2 bottom-2 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-all disabled:opacity-50 disabled:bg-slate-300"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <p className="text-[10px] text-slate-400 text-center mt-4 font-medium italic">
            "Demandez à l'IA d'ajouter des articles ou de changer le client"
          </p>
        </form>
      </div>

      {/* Floating Chat Trigger */}
      {!isChatOpen && (
        <button 
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-8 right-8 w-16 h-16 bg-slate-900 text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all z-50 group no-print"
        >
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-indigo-500 rounded-full flex items-center justify-center animate-bounce shadow-lg">
            <Sparkles className="w-3 h-3" />
          </div>
          <MessageSquare className="w-7 h-7 group-hover:hidden" />
          <Bot className="w-7 h-7 hidden group-hover:block animate-in fade-in" />
        </button>
      )}

      <footer className="bg-white border-t py-12 px-6 no-print mt-20">
        <div className="max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 text-slate-500 font-medium">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="text-indigo-600 w-5 h-5" />
              <span className="text-lg font-bold text-slate-900">DevisFlow SN</span>
            </div>
            <p className="text-sm max-w-xs leading-relaxed text-slate-600">Adapté aux normes de facturation du Sénégal. Rapide, clair et professionnel.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
