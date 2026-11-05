export const toSlug = (name: string): string =>
  name.toLowerCase().replace(/\s+/g, '-');

export const parsePrice = (text: string): number =>
  parseFloat(text.replace(/[^0-9.]/g, ''));