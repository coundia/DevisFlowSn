
export interface CompanyDetails {
  id: string;
  name: string;
  address: string;
  email: string;
  phone: string;
  website: string;
  logo?: string;
  ninea?: string;
  rccm?: string;
}

export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
}

export interface CatalogItem {
  id: string;
  description: string;
  rate: number;
}

export interface InvoiceTheme {
  id: string;
  name: string;
  primary: string;
  accent: string;
}

export interface InvoiceTemplate {
  id: string;
  name: string;
  templateData: Partial<Omit<InvoiceData, 'sender' | 'receiver' | 'invoiceNumber' | 'date' | 'dueDate'>>;
}

export const INVOICE_THEMES: InvoiceTheme[] = [
  { id: 'professional', name: 'Elite Slate', primary: '#0f172a', accent: '#6366f1' }, 
  { id: 'modern-blue', name: 'Azure Tide', primary: '#1e3a8a', accent: '#3b82f6' }, 
  { id: 'emerald', name: 'Forest Mint', primary: '#064e3b', accent: '#10b981' }, 
  { id: 'ruby', name: 'Velvet Rose', primary: '#881337', accent: '#f43f5e' }, 
  { id: 'midnight', name: 'Onyx Noir', primary: '#09090b', accent: '#71717a' },
];

export interface InvoiceData {
  invoiceNumber: string;
  date: string;
  dueDate: string;
  sender: CompanyDetails;
  receiver: CompanyDetails;
  items: LineItem[];
  taxRate: number;
  currency: string;
  notes: string;
  terms: string;
  themeId: string;
  documentType: 'invoice' | 'proforma';
  language: 'fr' | 'en';
}

export const DEFAULT_SENDER: CompanyDetails = {
  id: 'default',
  name: 'Ma Société Sénégal',
  address: 'Dakar Plateau, Rue 12\nSénégal',
  email: 'contact@societe.sn',
  phone: '+221 33 000 00 00',
  website: 'www.societe.sn',
  ninea: '',
  rccm: ''
};

export const DEFAULT_INVOICE: InvoiceData = {
  invoiceNumber: 'FAC-' + Math.floor(1000 + Math.random() * 9000),
  date: new Date().toISOString().split('T')[0],
  dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  sender: DEFAULT_SENDER,
  receiver: {
    id: 'client-default',
    name: 'Nom du Client',
    address: 'Avenue Cheikh Anta Diop\nDakar, Sénégal',
    email: 'client@email.sn',
    phone: '',
    website: ''
  },
  items: [
    { id: '1', description: 'Prestation de Services', quantity: 1, rate: 50000 }
  ],
  taxRate: 18,
  currency: 'XOF',
  notes: 'Merci de votre confiance !',
  terms: 'Paiement attendu sous 14 jours par virement ou chèque.',
  themeId: 'professional',
  documentType: 'invoice',
  language: 'fr',
};
