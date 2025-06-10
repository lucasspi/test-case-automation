/**
 * Utility functions for string manipulation
 */

export function capitalize(str: string): string {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '');
}

export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 3) + '...';
}

export function pluralize(word: string, count: number): string {
  if (count === 1) return word;
  
  // Simple pluralization rules
  if (word.endsWith('y')) {
    return word.slice(0, -1) + 'ies';
  }
  if (word.endsWith('s') || word.endsWith('sh') || word.endsWith('ch')) {
    return word + 'es';
  }
  return word + 's';
}
