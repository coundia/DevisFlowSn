
type Translations = {
  [key: string]: {
    [key: string]: string;
  };
};

const translations: Translations = {
  fr: {
    invoiceTitle: 'Facture',
    proformaInvoiceTitle: 'Facture Proforma',
    date: 'Date',
    dueDate: 'Échéance',
    billedTo: 'Facturé à',
    description: 'Description',
    quantity: 'Qté',
    rate: 'P.U.',
    amount: 'Montant',
    noItems: 'Aucun article',
    subtotal: 'Sous-Total',
    tax: 'TVA',
    totalDue: 'Total à Payer',
    notes: 'Notes',
    legalInfo: 'Infos légales',
    defaultNote: 'Merci pour votre confiance.',
    generatedWith: 'Généré avec DevisFlow SN',
  },
  en: {
    invoiceTitle: 'Invoice',
    proformaInvoiceTitle: 'Proforma Invoice',
    date: 'Date',
    dueDate: 'Due Date',
    billedTo: 'Billed To',
    description: 'Description',
    quantity: 'Qty',
    rate: 'Rate',
    amount: 'Amount',
    noItems: 'No items',
    subtotal: 'Subtotal',
    tax: 'Tax',
    totalDue: 'Total Due',
    notes: 'Notes',
    legalInfo: 'Legal Info',
    defaultNote: 'Thank you for your business.',
    generatedWith: 'Generated with DevisFlow SN',
  },
};

export const t = (key: string, lang: 'fr' | 'en'): string => {
  return translations[lang]?.[key] || key;
};
