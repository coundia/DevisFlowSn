
import { describe, it, expect } from 'vitest';
import { calculateSubtotal, calculateTax, calculateTotal, getCurrencySymbol } from './invoiceUtils';
import { LineItem } from '../types';

describe('Invoice Utility Functions', () => {

  const sampleItems: LineItem[] = [
    { id: '1', description: 'Web Development', quantity: 10, rate: 100 }, // 1000
    { id: '2', description: 'UI/UX Design', quantity: 1, rate: 500 },     // 500
    { id: '3', description: 'Hosting', quantity: 12, rate: 25 },       // 300
  ];

  describe('calculateSubtotal', () => {
    it('should return 0 for an empty array of items', () => {
      expect(calculateSubtotal([])).toBe(0);
    });

    it('should correctly calculate the subtotal for a single item', () => {
      const singleItem = [{ id: '1', description: 'Test', quantity: 2, rate: 50 }];
      expect(calculateSubtotal(singleItem)).toBe(100);
    });

    it('should correctly calculate the subtotal for multiple items', () => {
      expect(calculateSubtotal(sampleItems)).toBe(1800);
    });

    it('should handle items with zero quantity or rate', () => {
      const itemsWithZeros = [
        ...sampleItems,
        { id: '4', description: 'Freebie', quantity: 1, rate: 0 },
        { id: '5', description: 'Not used', quantity: 0, rate: 1000 },
      ];
      expect(calculateSubtotal(itemsWithZeros)).toBe(1800);
    });
  });

  describe('calculateTax', () => {
    it('should return 0 if the tax rate is 0', () => {
      expect(calculateTax(1000, 0)).toBe(0);
    });

    it('should return 0 if the subtotal is 0', () => {
      expect(calculateTax(0, 18)).toBe(0);
    });

    it('should correctly calculate the tax amount for a given subtotal and tax rate', () => {
      expect(calculateTax(1000, 18)).toBe(180);
      expect(calculateTax(150, 10)).toBe(15);
    });

    it('should handle floating point tax rates', () => {
      expect(calculateTax(1000, 8.5)).toBe(85);
    });
  });

  describe('calculateTotal', () => {
    it('should return 0 for an empty list of items', () => {
      expect(calculateTotal([], 18)).toBe(0);
    });

    it('should return the subtotal if the tax rate is 0', () => {
      expect(calculateTotal(sampleItems, 0)).toBe(1800);
    });

    it('should correctly calculate the total including tax', () => {
      // Subtotal = 1800, Tax (10%) = 180
      expect(calculateTotal(sampleItems, 10)).toBe(1980);
    });

     it('should handle a complex tax rate', () => {
      // Subtotal = 1800, Tax (18%) = 324
      expect(calculateTotal(sampleItems, 18)).toBe(2124);
    });
  });

  describe('getCurrencySymbol', () => {
    it('should return "FCFA" for currency code "XOF"', () => {
      expect(getCurrencySymbol('XOF')).toBe('FCFA');
    });

    it('should return "€" for currency code "EUR"', () => {
      expect(getCurrencySymbol('EUR')).toBe('€');
    });

    it('should return "$" as the default for an unknown currency code', () => {
      expect(getCurrencySymbol('USD')).toBe('$');
      expect(getCurrencySymbol('CAD')).toBe('$');
      expect(getCurrencySymbol('JPY')).toBe('$');
    });
  });

});
