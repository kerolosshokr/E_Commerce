/** Format price as USD currency string */
export const formatPrice = (price: number): string =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);

/** Truncate long strings */
export const truncate = (str: string, len = 60): string =>
  str.length > len ? str.slice(0, len) + '…' : str;

/** Generate a random order ID */
export const generateOrderId = (): string =>
  'SW-' + Math.random().toString(36).slice(2, 8).toUpperCase();

/** Validate email format */
export const isValidEmail = (email: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

/** Validate card number (basic Luhn check) */
export const isValidCard = (num: string): boolean => {
  const digits = num.replace(/\s/g, '');
  if (!/^\d{16}$/.test(digits)) return false;
  let sum = 0;
  for (let i = 0; i < digits.length; i++) {
    let d = parseInt(digits[i]);
    if ((digits.length - i) % 2 === 0) { d *= 2; if (d > 9) d -= 9; }
    sum += d;
  }
  return sum % 10 === 0;
};

/** Format card number with spaces */
export const formatCardNumber = (val: string): string =>
  val.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();

/** Format expiry MM/YY */
export const formatExpiry = (val: string): string => {
  const v = val.replace(/\D/g, '').slice(0, 4);
  return v.length > 2 ? v.slice(0, 2) + '/' + v.slice(2) : v;
};
