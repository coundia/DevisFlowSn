
import { useState, useEffect } from 'react';
import { CompanyDetails, InvoiceData, DEFAULT_INVOICE, DEFAULT_SENDER, LineItem, InvoiceTemplate, CatalogItem } from '../types';

export function useInvoiceState() {
  const [profiles, setProfiles] = useState<CompanyDetails[]>([]);
  const [activeProfileId, setActiveProfileId] = useState<string>('');
  const [invoice, setInvoice] = useState<InvoiceData>(DEFAULT_INVOICE);
  const [templates, setTemplates] = useState<InvoiceTemplate[]>([]);
  const [catalog, setCatalog] = useState<CatalogItem[]>([]);

  useEffect(() => {
    const savedProfiles = localStorage.getItem('devisflow_profiles');
    const savedDraft = localStorage.getItem('devisflow_current_invoice');
    const savedTemplates = localStorage.getItem('devisflow_templates');
    const savedCatalog = localStorage.getItem('devisflow_catalog');
    
    const initialProfiles = savedProfiles ? JSON.parse(savedProfiles) : [DEFAULT_SENDER];
    setProfiles(initialProfiles);

    if (savedTemplates) setTemplates(JSON.parse(savedTemplates));
    if (savedCatalog) setCatalog(JSON.parse(savedCatalog));
    
    if (savedDraft) {
      const parsed = JSON.parse(savedDraft);
      setInvoice(parsed);
      setActiveProfileId(parsed.sender.id);
    } else {
      setActiveProfileId(initialProfiles[0].id);
      setInvoice({ ...DEFAULT_INVOICE, sender: initialProfiles[0] });
    }
  }, []);

  useEffect(() => {
    if (profiles.length > 0) localStorage.setItem('devisflow_profiles', JSON.stringify(profiles));
    localStorage.setItem('devisflow_current_invoice', JSON.stringify(invoice));
    if (templates.length > 0 || localStorage.getItem('devisflow_templates')) {
        localStorage.setItem('devisflow_templates', JSON.stringify(templates));
    }
    if (catalog.length > 0 || localStorage.getItem('devisflow_catalog')) {
        localStorage.setItem('devisflow_catalog', JSON.stringify(catalog));
    }
  }, [profiles, invoice, templates, catalog]);

  const updateSender = (field: string, value: any) => {
    setInvoice(prev => {
      const newSender = { ...prev.sender, [field]: value };
      setProfiles(ps => ps.map(p => p.id === activeProfileId ? newSender : p));
      return { ...prev, sender: newSender };
    });
  };

  const updateReceiver = (field: string, value: any) => {
    setInvoice(prev => ({ ...prev, receiver: { ...prev.receiver, [field]: value } }));
  };

  const addItem = (item?: Partial<LineItem>) => {
    const newItem = { 
      id: Math.random().toString(36).substr(2, 9), 
      description: item?.description || '', 
      quantity: item?.quantity || 1, 
      rate: item?.rate || 0 
    };
    setInvoice(prev => ({ ...prev, items: [...prev.items, newItem] }));
  };

  const updateItem = (id: string, field: keyof LineItem, value: any) => {
    setInvoice(prev => ({
      ...prev,
      items: prev.items.map(item => item.id === id ? { ...item, [field]: value } : item)
    }));
  };

  const removeItem = (id: string) => {
    setInvoice(prev => ({ ...prev, items: prev.items.filter(i => i.id !== id) }));
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
    const newProfile = { ...DEFAULT_SENDER, id: newId, name: 'Nouvelle Société' };
    setProfiles(prev => [...prev, newProfile]);
    setActiveProfileId(newId);
    setInvoice(prev => ({ ...prev, sender: newProfile }));
  };

  const duplicateProfile = (id: string) => {
    const profileToClone = profiles.find(p => p.id === id);
    if (!profileToClone) return;
    const newId = Math.random().toString(36).substr(2, 9);
    const clonedProfile = { ...profileToClone, id: newId, name: `${profileToClone.name} (Copie)` };
    setProfiles(prev => [...prev, clonedProfile]);
    setActiveProfileId(newId);
    setInvoice(prev => ({ ...prev, sender: clonedProfile }));
  };

  const deleteProfile = (id: string) => {
    if (profiles.length <= 1) return;
    const filtered = profiles.filter(p => p.id !== id);
    setProfiles(filtered);
    if (activeProfileId === id) {
      setActiveProfileId(filtered[0].id);
      setInvoice(prev => ({ ...prev, sender: filtered[0] }));
    }
  };

  const resetInvoice = () => {
    if (window.confirm('Réinitialiser la facture ?')) {
      setInvoice({ ...DEFAULT_INVOICE, sender: invoice.sender });
    }
  };

  const saveAsTemplate = (name: string) => {
    const { sender, receiver, invoiceNumber, date, dueDate, ...templateData } = invoice;
    const newTemplate: InvoiceTemplate = {
      id: `tpl-${Date.now()}`,
      name,
      templateData,
    };
    setTemplates(prev => [...prev, newTemplate]);
  };

  const applyTemplate = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template && window.confirm(`Appliquer le modèle "${template.name}" ? Ceci écrasera les articles et options actuels.`)) {
      setInvoice(prev => ({
        ...DEFAULT_INVOICE,
        ...prev,
        ...template.templateData,
        sender: prev.sender,
        invoiceNumber: 'FAC-' + Math.floor(1000 + Math.random() * 9000),
        date: new Date().toISOString().split('T')[0],
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        receiver: DEFAULT_INVOICE.receiver,
      }));
      return true;
    }
    return false;
  };
  
  const deleteTemplate = (templateId: string) => {
     if (window.confirm('Voulez-vous vraiment supprimer ce modèle ?')) {
        setTemplates(prev => prev.filter(t => t.id !== templateId));
     }
  };

  const addCatalogItem = (item: Omit<CatalogItem, 'id'>) => {
    const newItem: CatalogItem = {
      id: `cat-${Date.now()}`,
      ...item,
    };
    setCatalog(prev => [...prev, newItem]);
  };

  const updateCatalogItem = (id: string, updates: Partial<CatalogItem>) => {
    setCatalog(prev => prev.map(item => item.id === id ? { ...item, ...updates } : item));
  };

  const deleteCatalogItem = (id: string) => {
    setCatalog(prev => prev.filter(item => item.id !== id));
  };

  return { 
    invoice, setInvoice, profiles, activeProfileId, templates, catalog,
    updateSender, updateReceiver, addItem, updateItem, removeItem, 
    switchProfile, addNewProfile, duplicateProfile, deleteProfile, resetInvoice,
    saveAsTemplate, applyTemplate, deleteTemplate,
    addCatalogItem, updateCatalogItem, deleteCatalogItem
  };
}
