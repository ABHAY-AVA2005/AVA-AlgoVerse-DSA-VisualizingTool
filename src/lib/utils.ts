// FIX: Rest parameter type defined
export const cn = (...classes: any[]) => classes.filter(Boolean).join(' ');

// FIX: Parameter 'val' type defined
export const parseValue = (val: any) => {
  if (val === "" || val === null || val === undefined) return "";
  const num = parseInt(val);
  return !isNaN(num) && String(num) === String(val) ? num : val;
};

// FIX: Parameters 'key' and 'size' types defined
export const simpleHash = (key: string | number, size: number) => {
  if (typeof key === 'number') return key % size;
  let hash = 0;
  const str = String(key);
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0; 
  }
  return Math.abs(hash) % size;
};

// FIX: Parameters 'a' and 'b' types defined
export const compareValues = (a: any, b: any) => {
  if (typeof a === typeof b) return a < b ? -1 : (a > b ? 1 : 0);
  return typeof a === 'number' ? -1 : 1;
};

// FIX: Parameter 'ms' type defined
export const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
