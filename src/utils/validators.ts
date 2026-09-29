export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPhone = (phone: string): boolean => {
  const cleaned = phone.replace(/[\s\-\(\)\+]/g, '');
  return cleaned.length >= 10 && cleaned.length <= 13;
};

export const isValidPincode = (pincode: string): boolean => {
  return /^[1-9][0-9]{5}$/.test(pincode.trim());
};
