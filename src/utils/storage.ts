// Helper to strip massive base64 strings so localStorage doesn't hit 5MB quota
const sanitizeForLocalStorage = (val: any): any => {
  if (typeof val === 'string') {
    if (val.startsWith('data:image/') && val.length > 5000) {
      return '/images/brand/hero_illustration_feathered.png';
    }
    return val;
  }
  if (Array.isArray(val)) {
    return val.map(sanitizeForLocalStorage);
  }
  if (val !== null && typeof val === 'object') {
    const copy: any = {};
    for (const k of Object.keys(val)) {
      copy[k] = sanitizeForLocalStorage(val[k]);
    }
    return copy;
  }
  return val;
};

export const storage = {
  get: <T>(key: string, defaultValue: T): T => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (e) {
      console.error(`Error reading ${key} from localStorage`, e);
      return defaultValue;
    }
  },
  set: <T>(key: string, value: T): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e: any) {
      if (e?.name === 'QuotaExceededError' || e?.code === 22) {
        try {
          const sanitized = sanitizeForLocalStorage(value);
          localStorage.setItem(key, JSON.stringify(sanitized));
          return;
        } catch {
          console.warn(`[storage] Quota exceeded for ${key}. Skipping localStorage cache.`);
        }
      } else {
        console.error(`Error writing ${key} to localStorage`, e);
      }
    }
  },
  remove: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.error(`Error removing ${key} from localStorage`, e);
    }
  },
};
