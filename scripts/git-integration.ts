import { execSync } from 'child_process';
import { TestGenerator } from './test-generator';

export class GitTestIntegration {
  private testGenerator: TestGenerator;

  constructor() {
    this.testGenerator = new TestGenerator();
  }

  /**
   * Get changed files from git
   */
  getChangedFiles(compareWith: string = 'HEAD~1'): string[] {
    try {
      const output = execSync(`git diff --name-only ${compareWith}`, { encoding: 'utf8' });
      return output
        .split('\n')
        .filter(file => file.trim() !== '')
        .filter(file => /\.(ts|tsx|js|jsx)$/.test(file))
        .filter(file => !file.includes('.test.') && !file.includes('.spec.'));
    } catch (error) {
      console.error('Error getting changed files from git:', error);
      return [];
    }
  }

  /**
   * Get newly added files from git
   */
  getNewFiles(): string[] {
    try {
      const output = execSync('git diff --name-only --diff-filter=A HEAD~1', { encoding: 'utf8' });
      return output
        .split('\n')
        .filter(file => file.trim() !== '')
        .filter(file => /\.(ts|tsx|js|jsx)$/.test(file))
        .filter(file => !file.includes('.test.') && !file.includes('.spec.'));
    } catch (error) {
      console.error('Error getting new files from git:', error);
      return [];
    }
  }

  /**
   * Generate tests for changed files
   */
  async generateTestsForChangedFiles(): Promise<void> {
    const changedFiles = this.getChangedFiles();
    
    if (changedFiles.length === 0) {
      console.log('No relevant file changes detected');
      return;
    }

    console.log(`Found ${changedFiles.length} changed files:`);
    changedFiles.forEach(file => console.log(`  - ${file}`));

    for (const file of changedFiles) {
      try {
        const testFile = await this.testGenerator.generateTestFile(file);
        if (testFile) {
          console.log(`✅ Generated/updated test: ${testFile}`);
        }
      } catch (error) {
        console.error(`❌ Error generating test for ${file}:`, error);
      }
    }
  }

  /**
   * Generate tests for new files only
   */
  async generateTestsForNewFiles(): Promise<void> {
    const newFiles = this.getNewFiles();
    
    if (newFiles.length === 0) {
      console.log('No new files detected');
      return;
    }

    console.log(`Found ${newFiles.length} new files:`);
    newFiles.forEach(file => console.log(`  - ${file}`));

    for (const file of newFiles) {
      try {
        const testFile = await this.testGenerator.generateTestFile(file);
        if (testFile) {
          console.log(`✅ Generated test: ${testFile}`);
        }
      } catch (error) {
        console.error(`❌ Error generating test for ${file}:`, error);
      }
    }
  }

  /**
   * Check if working directory is clean
   */
  isWorkingDirectoryClean(): boolean {
    try {
      const output = execSync('git status --porcelain', { encoding: 'utf8' });
      return output.trim() === '';
    } catch (error) {
      return false;
    }
  }

  /**
   * Stage generated test files
   */
  stageTestFiles(): void {
    try {
      execSync('git add **/*.test.{ts,tsx,js,jsx}');
      console.log('✅ Staged generated test files');
    } catch (error) {
      console.error('Error staging test files:', error);
    }
  }
}

// CLI usage for git hooks
if (import.meta.url === `file://${process.argv[1]}`) {
  const gitIntegration = new GitTestIntegration();
  const command = process.argv[2];

  switch (command) {
    case 'changed':
      gitIntegration.generateTestsForChangedFiles();
      break;
    case 'new':
      gitIntegration.generateTestsForNewFiles();
      break;
    case 'stage':
      gitIntegration.stageTestFiles();
      break;
    default:
      console.log('Usage: node git-integration.js [changed|new|stage]');
  }
}
