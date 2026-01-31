
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

export interface InvoiceTheme {
  id: string;
  name: string;
  primary: string;
  accent: string;
}

export const INVOICE_THEMES: InvoiceTheme[] = [
  { id: 'professional', name: 'Professional', primary: '#0f172a', accent: '#4f46e5' }, // Slate & Indigo
  { id: 'modern-blue', name: 'Modern Blue', primary: '#1e40af', accent: '#3b82f6' }, // Blue
  { id: 'emerald', name: 'Emerald', primary: '#064e3b', accent: '#10b981' }, // Green
  { id: 'ruby', name: 'Ruby', primary: '#9f1239', accent: '#f43f5e' }, // Rose
  { id: 'midnight', name: 'Midnight', primary: '#18181b', accent: '#71717a' }, // Zinc
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
  themeId: 'professional'
};
