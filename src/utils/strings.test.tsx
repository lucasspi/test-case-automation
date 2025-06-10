import { describe, it, expect } from 'vitest';
import { capitalize, slugify, truncate, pluralize } from './strings';

describe('strings', () => {
  describe('capitalize', () => {
    it('should capitalize the first letter and lowercase the rest', () => {
      expect(capitalize('hello')).toBe('Hello');
      expect(capitalize('HELLO')).toBe('Hello');
      expect(capitalize('hELLo WoRLD')).toBe('Hello world');
    });

    it('should handle empty strings', () => {
      expect(capitalize('')).toBe('');
    });

    it('should handle single character strings', () => {
      expect(capitalize('a')).toBe('A');
      expect(capitalize('A')).toBe('A');
    });
  });

  describe('slugify', () => {
    it('should convert string to lowercase slug', () => {
      expect(slugify('Hello World')).toBe('hello-world');
      expect(slugify('This is a Test')).toBe('this-is-a-test');
    });

    it('should remove special characters', () => {
      expect(slugify('Hello, World!')).toBe('hello-world');
      expect(slugify('Test@#$%^&*()String')).toBe('teststring');
    });

    it('should handle multiple spaces', () => {
      expect(slugify('Hello    World')).toBe('hello-world');
      expect(slugify('  Trim  Spaces  ')).toBe('trim-spaces');
    });

    it('should handle empty strings', () => {
      expect(slugify('')).toBe('');
    });
  });

  describe('truncate', () => {
    it('should truncate long strings', () => {
      expect(truncate('This is a long string', 10)).toBe('This is...');
      expect(truncate('Short', 10)).toBe('Short');
    });

    it('should handle strings equal to max length', () => {
      expect(truncate('Hello', 5)).toBe('Hello');
    });

    it('should handle very short max lengths', () => {
      expect(truncate('Hello', 3)).toBe('...');
      expect(truncate('Hello', 4)).toBe('H...');
    });

    it('should handle empty strings', () => {
      expect(truncate('', 10)).toBe('');
    });
  });

  describe('pluralize', () => {
    it('should return singular form for count of 1', () => {
      expect(pluralize('cat', 1)).toBe('cat');
      expect(pluralize('dog', 1)).toBe('dog');
    });

    it('should pluralize regular words', () => {
      expect(pluralize('cat', 2)).toBe('cats');
      expect(pluralize('dog', 0)).toBe('dogs');
      expect(pluralize('book', 5)).toBe('books');
    });

    it('should handle words ending in y', () => {
      expect(pluralize('city', 2)).toBe('cities');
      expect(pluralize('baby', 3)).toBe('babies');
    });

    it('should handle words ending in s, sh, ch', () => {
      expect(pluralize('glass', 2)).toBe('glasses');
      expect(pluralize('dish', 2)).toBe('dishes');
      expect(pluralize('church', 2)).toBe('churches');
    });
  });
});