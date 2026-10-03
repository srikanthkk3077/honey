import { CONTACT_INFO } from './constants';

/**
 * Generate a WhatsApp chat URL with optional phone number and pre-filled message text.
 * Sanitizes phone number to international format (digits only).
 */
export function getWhatsAppUrl(phone?: string, text?: string): string {
  const rawNumber = phone || CONTACT_INFO.whatsapp || '917780514383';
  // Strip non-digit characters (e.g. +91 7780514383 -> 917780514383)
  const cleanNumber = rawNumber.replace(/\D/g, '');
  
  const defaultText = text || 'Hi Madhuvan Honey! I would like to inquire about your raw forest honey products.';
  const encodedText = encodeURIComponent(defaultText);

  return `https://wa.me/${cleanNumber}?text=${encodedText}`;
}

/**
 * Open WhatsApp directly in a new window/tab.
 */
export function openWhatsApp(phone?: string, text?: string): void {
  const url = getWhatsAppUrl(phone, text);
  window.open(url, '_blank', 'noopener,noreferrer');
}
