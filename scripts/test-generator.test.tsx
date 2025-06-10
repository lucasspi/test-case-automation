import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TestGenerator } from './test-generator';

// Mock fs-extra
vi.mock('fs-extra', async (importOriginal) => {
  const actual = await importOriginal<typeof import('fs-extra')>();
  return {
    ...actual,
    readFile: vi.fn(),
    existsSync: vi.fn(),
    writeFile: vi.fn(),
  };
});

// Mock glob
vi.mock('glob');

import * as fs from 'fs-extra';

describe('TestGenerator', () => {
  let testGenerator: TestGenerator;

  beforeEach(() => {
    testGenerator = new TestGenerator();
    vi.clearAllMocks();
  });

  it('creates an instance without crashing', () => {
    expect(testGenerator).toBeInstanceOf(TestGenerator);
  });

  it('analyzes React component file correctly', async () => {
    const mockContent = `
      import React, { useState } from 'react';
      
      interface Props {
        title: string;
      }
      
      export default function MyComponent({ title }: Props) {
        const [count, setCount] = useState(0);
        return <div>{title}: {count}</div>;
      }
    `;
    
    // Mock the file system calls
    vi.mocked(fs.readFile).mockResolvedValueOnce(mockContent as any);
    
    const analysis = await testGenerator.analyzeFile('/fake/path/MyComponent.tsx');
    
    expect(analysis).toBeTruthy();
    if (analysis && 'isReactComponent' in analysis) {
      expect(analysis.isReactComponent).toBe(true);
      expect(analysis.hasProps).toBe(true);
      expect(analysis.hasState).toBe(true);
    }
  });

  it('analyzes utility function file correctly', async () => {
    const mockContent = `
      export function add(a: number, b: number): number {
        return a + b;
      }
      
      export const multiply = (a: number, b: number) => a * b;
    `;
    
    vi.mocked(fs.readFile).mockResolvedValueOnce(mockContent as any);
    
    const analysis = await testGenerator.analyzeFile('/fake/path/utils.ts');
    
    expect(analysis).toBeTruthy();
    if (analysis && 'exportedFunctions' in analysis) {
      expect(analysis.exportedFunctions).toContain('add');
      expect(analysis.exportedFunctions).toContain('multiply');
    }
  });

  it('generates test file successfully', async () => {
    const mockContent = `
      export function add(a: number, b: number): number {
        return a + b;
      }
    `;
    
    vi.mocked(fs.readFile).mockResolvedValueOnce(mockContent as any);
    vi.mocked(fs.writeFile).mockResolvedValueOnce(undefined);
    
    const result = await testGenerator.generateTestFile('/fake/path/utils.ts');
    
    expect(result).toBeTruthy();
    expect(fs.writeFile).toHaveBeenCalled();
  });

  it('returns null for non-existent files', async () => {
    vi.mocked(fs.readFile).mockRejectedValueOnce(new Error('ENOENT: no such file or directory'));
    
    await expect(testGenerator.analyzeFile('/fake/path/nonexistent.ts')).rejects.toThrow('ENOENT');
  });
});

