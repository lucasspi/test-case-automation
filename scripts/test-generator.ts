import fs from 'fs-extra';
import path from 'path';
import { glob } from 'glob';

interface ComponentAnalysis {
  name: string;
  isReactComponent: boolean;
  hasProps: boolean;
  propsInterface?: string;
  hasState: boolean;
  hasEffects: boolean;
  exportedFunctions: string[];
  importedModules: string[];
  filePath: string;
}

interface FunctionAnalysis {
  name: string;
  parameters: string[];
  returnType: string;
  isAsync: boolean;
  filePath: string;
}

export class TestGenerator {
  private srcDir: string;
  private testDir: string;

  constructor(srcDir: string = 'src', testDir: string = 'src') {
    this.srcDir = srcDir;
    this.testDir = testDir;
  }

  /**
   * Analyze a TypeScript/JSX file and extract testable components
   */
  async analyzeFile(filePath: string): Promise<ComponentAnalysis | FunctionAnalysis | null> {
    const content = await fs.readFile(filePath, 'utf-8');
    const fileName = path.basename(filePath, path.extname(filePath));

    // Skip test files and config files
    if (fileName.includes('.test') || fileName.includes('.spec') || fileName.includes('config')) {
      return null;
    }

    // Determine if it's a React component
    const isReactComponent = this.isReactComponent(content);

    if (isReactComponent) {
      return this.analyzeReactComponent(content, fileName, filePath);
    } else {
      return this.analyzeUtilityFile(content, fileName, filePath);
    }
  }

  /**
   * Check if file contains a React component
   */
  private isReactComponent(content: string): boolean {
    const hasReactImport = /import\s+React|import.*from\s+['"]react['"]/.test(content);
    const hasJSXReturn = /return\s*\([\s\S]*<|return\s*</.test(content);
    const hasFunctionComponent = /function\s+\w+.*\(.*\).*{[\s\S]*return[\s\S]*</.test(content) ||
                                /const\s+\w+.*=.*\(.*\).*=>[\s\S]*</.test(content) ||
                                /export\s+default\s+function/.test(content);
    
    return (hasReactImport || hasJSXReturn) && (hasFunctionComponent || hasJSXReturn);
  }

  /**
   * Analyze React component
   */
  private analyzeReactComponent(content: string, fileName: string, filePath: string): ComponentAnalysis {
    const hasProps = /props\s*[:\(]|interface\s+\w+Props/.test(content);
    const hasState = /useState|this\.state/.test(content);
    const hasEffects = /useEffect|componentDidMount|componentDidUpdate/.test(content);
    
    // Extract props interface
    const propsInterfaceMatch = content.match(/interface\s+(\w+Props?)\s*{[^}]*}/);
    const propsInterface = propsInterfaceMatch ? propsInterfaceMatch[1] : undefined;

    // Extract exported functions
    const exportedFunctions = this.extractExportedFunctions(content);
    
    // Extract imported modules
    const importedModules = this.extractImports(content);

    return {
      name: fileName,
      isReactComponent: true,
      hasProps,
      propsInterface,
      hasState,
      hasEffects,
      exportedFunctions,
      importedModules,
      filePath
    };
  }

  /**
   * Analyze utility/function file
   */
  private analyzeUtilityFile(content: string, fileName: string, filePath: string): FunctionAnalysis {
    const exportedFunctions = this.extractExportedFunctions(content);
    const isAsync = /async\s+function|=\s*async/.test(content);

    return {
      name: fileName,
      parameters: [],
      returnType: 'unknown',
      isAsync,
      filePath
    } as FunctionAnalysis;
  }

  /**
   * Extract exported functions from file content
   */
  private extractExportedFunctions(content: string): string[] {
    const functions: string[] = [];
    
    // Match various export patterns
    const patterns = [
      /export\s+function\s+(\w+)/g,
      /export\s+const\s+(\w+)\s*=/g,
      /export\s+{\s*([^}]+)\s*}/g,
      /export\s+default\s+function\s+(\w+)/g,
      /export\s+default\s+(\w+)/g
    ];

    patterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        if (match[1].includes(',')) {
          // Handle multiple exports: export { func1, func2 }
          const multipleExports = match[1].split(',').map(f => f.trim());
          functions.push(...multipleExports);
        } else {
          functions.push(match[1]);
        }
      }
    });

    return [...new Set(functions)]; // Remove duplicates
  }

  /**
   * Extract import statements
   */
  private extractImports(content: string): string[] {
    const imports: string[] = [];
    const importPattern = /import.*from\s+['"]([^'"]+)['"]/g;
    
    let match;
    while ((match = importPattern.exec(content)) !== null) {
      imports.push(match[1]);
    }

    return imports;
  }

  /**
   * Generate test file for React component
   */
  private generateReactComponentTest(analysis: ComponentAnalysis): string {
    const { name, hasProps, propsInterface, hasState, hasEffects } = analysis;
    
    return `import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ${name} from './${name}';

describe('${name}', () => {
  it('renders without crashing', () => {
    render(<${name}${hasProps ? ' {...mockProps}' : ''} />);
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  ${hasProps ? this.generatePropsTests(name, propsInterface) : ''}
  
  ${hasState ? this.generateStateTests(name) : ''}
  
  ${hasEffects ? this.generateEffectTests(name) : ''}
  
  it('matches snapshot', () => {
    const { container } = render(<${name}${hasProps ? ' {...mockProps}' : ''} />);
    expect(container.firstChild).toMatchSnapshot();
  });
});

${hasProps ? this.generateMockProps(propsInterface) : ''}`;
  }

  /**
   * Generate props-related tests
   */
  private generatePropsTests(componentName: string, propsInterface?: string): string {
    const interfaceComment = propsInterface ? `// Props interface: ${propsInterface}` : '';
    return `
  ${interfaceComment}
  it('renders with required props', () => {
    const props = {
      // TODO: Add required props based on ${propsInterface || 'component interface'}
    };
    render(<${componentName} {...props} />);
    // TODO: Add assertions for prop rendering
  });

  it('handles optional props correctly', () => {
    const props = {
      // TODO: Add optional props
    };
    render(<${componentName} {...props} />);
    // TODO: Add assertions for optional prop handling
  });`;
  }

  /**
   * Generate state-related tests
   */
  private generateStateTests(componentName: string): string {
    return `
  it('manages state correctly', () => {
    render(<${componentName} />);
    // TODO: Add state management tests
    // Example: fireEvent.click(screen.getByRole('button'));
    // Example: expect(screen.getByText('Updated State')).toBeInTheDocument();
  });`;
  }

  /**
   * Generate effect-related tests
   */
  private generateEffectTests(componentName: string): string {
    return `
  it('handles side effects properly', () => {
    render(<${componentName} />);
    // TODO: Add effect testing
    // Example: await waitFor(() => expect(mockApi).toHaveBeenCalled());
  });`;
  }

  /**
   * Generate mock props
   */
  private generateMockProps(propsInterface?: string): string {
    const interfaceComment = propsInterface ? `// Mock props for ${propsInterface}` : '// Mock props';
    return `
${interfaceComment}
const mockProps = {
  // TODO: Add mock props here
};`;
  }

  /**
   * Generate test file for utility functions
   */
  private generateUtilityTest(analysis: FunctionAnalysis): string {
    const { name } = analysis;
    
    return `import { describe, it, expect } from 'vitest';
import * as ${name} from './${name}';

describe('${name}', () => {
  // TODO: Add tests for exported functions
  
  it('should be defined', () => {
    expect(${name}).toBeDefined();
  });

  // Example test structure:
  // it('functionName should return expected value', () => {
  //   const result = ${name}.functionName(input);
  //   expect(result).toBe(expectedOutput);
  // });
});`;
  }

  /**
   * Generate test file for a given source file
   */
  async generateTestFile(filePath: string): Promise<string | null> {
    const analysis = await this.analyzeFile(filePath);
    
    if (!analysis) {
      return null;
    }

    const testFileName = `${analysis.name}.test.tsx`;
    const testFilePath = path.join(path.dirname(filePath), testFileName);

    // Check if test file already exists
    if (await fs.pathExists(testFilePath)) {
      console.log(`Test file already exists: ${testFilePath}`);
      return testFilePath;
    }

    let testContent: string;

    if ('isReactComponent' in analysis && analysis.isReactComponent) {
      testContent = this.generateReactComponentTest(analysis);
    } else {
      testContent = this.generateUtilityTest(analysis as FunctionAnalysis);
    }

    await fs.writeFile(testFilePath, testContent);
    console.log(`Generated test file: ${testFilePath}`);
    
    return testFilePath;
  }

  /**
   * Find all source files that need tests
   */
  async findFilesNeedingTests(): Promise<string[]> {
    const sourceFiles = await glob(`${this.srcDir}/**/*.{ts,tsx,js,jsx}`, {
      ignore: ['**/*.test.*', '**/*.spec.*', '**/node_modules/**']
    });

    const filesNeedingTests: string[] = [];

    for (const file of sourceFiles) {
      const testFile = this.getTestFilePath(file);
      if (!await fs.pathExists(testFile)) {
        filesNeedingTests.push(file);
      }
    }

    return filesNeedingTests;
  }

  /**
   * Get the expected test file path for a source file
   */
  private getTestFilePath(sourceFile: string): string {
    const dir = path.dirname(sourceFile);
    const ext = path.extname(sourceFile);
    const name = path.basename(sourceFile, ext);
    return path.join(dir, `${name}.test${ext}`);
  }

  /**
   * Generate tests for all files that need them
   */
  async generateAllMissingTests(): Promise<void> {
    const filesNeedingTests = await this.findFilesNeedingTests();
    
    console.log(`Found ${filesNeedingTests.length} files needing tests`);
    
    for (const file of filesNeedingTests) {
      try {
        await this.generateTestFile(file);
      } catch (error) {
        console.error(`Error generating test for ${file}:`, error);
      }
    }
  }
}
