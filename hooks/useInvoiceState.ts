
import { useState, useEffect } from 'react';
import { CompanyDetails, InvoiceData, DEFAULT_INVOICE, DEFAULT_SENDER, LineItem } from '../types';

export function useInvoiceState() {
  const [profiles, setProfiles] = useState<CompanyDetails[]>([]);
  const [activeProfileId, setActiveProfileId] = useState<string>('');
  const [invoice, setInvoice] = useState<InvoiceData>(DEFAULT_INVOICE);

  useEffect(() => {
    const savedProfiles = localStorage.getItem('devisflow_profiles');
    const savedDraft = localStorage.getItem('devisflow_current_invoice');
    const initialProfiles = savedProfiles ? JSON.parse(savedProfiles) : [DEFAULT_SENDER];
    
    setProfiles(initialProfiles);
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
  }, [profiles, invoice]);

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

  return { 
    invoice, setInvoice, profiles, activeProfileId, 
    updateSender, updateReceiver, addItem, updateItem, removeItem, 
    switchProfile, addNewProfile, deleteProfile, resetInvoice 
  };
}
