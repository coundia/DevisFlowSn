
import { InvoiceData } from '../types';

export const calculateSubtotal = (items: InvoiceData['items']) => 
  items.reduce((acc, item) => acc + (item.quantity * item.rate), 0);

export const calculateTax = (subtotal: number, taxRate: number) => 
  subtotal * (taxRate / 100);

export const calculateTotal = (items: InvoiceData['items'], taxRate: number) => {
  const subtotal = calculateSubtotal(items);
  return subtotal + calculateTax(subtotal, taxRate);
};

export const getCurrencySymbol = (code: string) => {
  switch(code) {
    case 'XOF': return 'FCFA';
    case 'EUR': return '€';
    default: return '$';
  }
};
