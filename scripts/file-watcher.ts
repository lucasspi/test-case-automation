import chokidar from 'chokidar';
import path from 'path';
import { TestGenerator } from './test-generator';

export class FileWatcher {
  private testGenerator: TestGenerator;
  private watcher: chokidar.FSWatcher | null = null;

  constructor() {
    this.testGenerator = new TestGenerator();
  }

  /**
   * Start watching for file changes
   */
  start(watchPath: string = 'src'): void {
    console.log(`🔍 Starting file watcher on: ${watchPath}`);

    this.watcher = chokidar.watch(watchPath, {
      ignored: [
        /node_modules/,
        /\.git/,
        /\.test\./,
        /\.spec\./,
        /dist/,
        /build/
      ],
      persistent: true,
      ignoreInitial: true
    });

    this.watcher
      .on('add', (filePath) => this.handleFileChange(filePath, 'added'))
      .on('change', (filePath) => this.handleFileChange(filePath, 'changed'))
      .on('unlink', (filePath) => this.handleFileDelete(filePath))
      .on('error', (error) => console.error('Watcher error:', error));

    console.log('✅ File watcher started successfully');
  }

  /**
   * Stop the file watcher
   */
  stop(): void {
    if (this.watcher) {
      this.watcher.close();
      this.watcher = null;
      console.log('🛑 File watcher stopped');
    }
  }

  /**
   * Handle file changes
   */
  private async handleFileChange(filePath: string, action: 'added' | 'changed'): Promise<void> {
    const ext = path.extname(filePath);
    
    // Only process TypeScript/JavaScript/React files
    if (!['.ts', '.tsx', '.js', '.jsx'].includes(ext)) {
      return;
    }

    // Skip test files
    if (filePath.includes('.test.') || filePath.includes('.spec.')) {
      return;
    }

    console.log(`📝 File ${action}: ${filePath}`);

    try {
      const testFilePath = await this.testGenerator.generateTestFile(filePath);
      if (testFilePath) {
        console.log(`✅ Generated test file: ${testFilePath}`);
      }
    } catch (error) {
      console.error(`❌ Error generating test for ${filePath}:`, error);
    }
  }

  /**
   * Handle file deletion
   */
  private handleFileDelete(filePath: string): void {
    console.log(`🗑️  File deleted: ${filePath}`);
    // Note: You might want to ask the user if they want to delete corresponding test files
  }
}

// CLI usage
if (import.meta.url === `file://${process.argv[1]}`) {
  const watcher = new FileWatcher();
  
  // Handle graceful shutdown
  process.on('SIGINT', () => {
    console.log('\n👋 Shutting down file watcher...');
    watcher.stop();
    process.exit(0);
  });

  // Start watching
  watcher.start();
}
