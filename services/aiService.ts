
import { GoogleGenAI, Type } from "@google/genai";
import { InvoiceData } from '../types';

export const handleAiChat = async (userMessage: string, currentInvoice: InvoiceData) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Tu es un assistant expert en facturation pour le marché Sénégalais.
      VOICI LA FACTURE ACTUELLE (JSON): ${JSON.stringify(currentInvoice)}
      REQUÊTE UTILISATEUR: "${userMessage}"
      
      INSTRUCTIONS:
      1. Analyse la requête pour mettre à jour les données (ajouter/supprimer articles, changer client, modifier taxes, etc.).
      2. Retourne la facture MISE À JOUR au format JSON exact.
      3. Ajoute un champ "assistantMessage" décrivant brièvement ce que tu as fait en français.`,
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
  return JSON.parse(response.text);
};

export const getAiSuggestions = async (senderName: string, receiverName: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Générez 3 articles de facturation professionnelle pour une entreprise nommée "${senderName}" fournissant des services à "${receiverName}". Retournez un tableau JSON d'objets avec description (en français), quantity et rate.`,
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
  return JSON.parse(response.text);
};
