#!/usr/bin/env node

import { Command } from 'commander';
import { TestGenerator } from './test-generator';
import { FileWatcher } from './file-watcher';
import { GitTestIntegration } from './git-integration';

const program = new Command();

program
  .name('test-automation')
  .description('Automated test generation for React applications')
  .version('1.0.0');

// Generate tests for specific file
program
  .command('generate')
  .description('Generate test file for a specific source file')
  .argument('<file>', 'Source file path')
  .action(async (file: string) => {
    const generator = new TestGenerator();
    try {
      const testFile = await generator.generateTestFile(file);
      if (testFile) {
        console.log(`✅ Generated test file: ${testFile}`);
      } else {
        console.log(`ℹ️  No test generated for: ${file}`);
      }
    } catch (error) {
      console.error(`❌ Error generating test:`, error);
      process.exit(1);
    }
  });

// Generate tests for all missing files
program
  .command('generate-all')
  .description('Generate test files for all source files that don\'t have tests')
  .action(async () => {
    const generator = new TestGenerator();
    try {
      await generator.generateAllMissingTests();
      console.log('✅ Finished generating missing tests');
    } catch (error) {
      console.error(`❌ Error generating tests:`, error);
      process.exit(1);
    }
  });

// Watch for file changes
program
  .command('watch')
  .description('Watch for file changes and auto-generate tests')
  .option('-p, --path <path>', 'Path to watch', 'src')
  .action((options) => {
    const watcher = new FileWatcher();
    
    // Handle graceful shutdown
    process.on('SIGINT', () => {
      console.log('\n👋 Shutting down file watcher...');
      watcher.stop();
      process.exit(0);
    });
    
    watcher.start(options.path);
  });

// Git integration commands
program
  .command('git-changed')
  .description('Generate tests for files changed in git')
  .option('-c, --compare <ref>', 'Git reference to compare with', 'HEAD~1')
  .action(async () => {
    const gitIntegration = new GitTestIntegration();
    try {
      await gitIntegration.generateTestsForChangedFiles();
    } catch (error) {
      console.error(`❌ Error:`, error);
      process.exit(1);
    }
  });

program
  .command('git-new')
  .description('Generate tests for new files in git')
  .action(async () => {
    const gitIntegration = new GitTestIntegration();
    try {
      await gitIntegration.generateTestsForNewFiles();
    } catch (error) {
      console.error(`❌ Error:`, error);
      process.exit(1);
    }
  });

// Find files needing tests
program
  .command('check')
  .description('Check which files need tests')
  .action(async () => {
    const generator = new TestGenerator();
    try {
      const filesNeedingTests = await generator.findFilesNeedingTests();
      
      if (filesNeedingTests.length === 0) {
        console.log('✅ All source files have corresponding test files!');
      } else {
        console.log(`📋 Found ${filesNeedingTests.length} files needing tests:`);
        filesNeedingTests.forEach(file => console.log(`  - ${file}`));
      }
    } catch (error) {
      console.error(`❌ Error checking files:`, error);
      process.exit(1);
    }
  });

program.parse();
