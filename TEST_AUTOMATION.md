# Test Automation System

This project includes an automated test generation system that can detect new code and automatically create unit test templates.

## Features

- 🔍 **File Watching**: Automatically generates tests when new files are created
- 🎯 **Smart Analysis**: Analyzes React components and utility functions to create appropriate test structures
- 🔧 **Git Integration**: Generates tests for changed/new files in git commits
- 📝 **Template Generation**: Creates comprehensive test templates with common patterns
- ⚙️ **Configurable**: Customizable templates and patterns

## Quick Start

### 1. Generate Tests for All Missing Files

```bash
npm run test:generate
```

### 2. Check Which Files Need Tests

```bash
npm run test:check
```

### 3. Generate Test for Specific File

```bash
npm run test:generate-file src/components/MyComponent.tsx
```

### 4. Watch for File Changes (Auto-generate)

```bash
npm run test:watch
```

## Git Integration

### Setup Git Hooks

```bash
./scripts/setup-git-hooks.sh
```

This will install git hooks that automatically:
- Generate tests for new/changed files before commits
- Run tests after commits (optional)

### Manual Git Commands

```bash
# Generate tests for files changed since last commit
npm run test:git-changed

# Generate tests for newly added files
npm run test:git-new
```

## CLI Commands

The test automation system provides several CLI commands:

```bash
# Generate test for specific file
npx tsx scripts/cli.ts generate <file-path>

# Generate tests for all files missing tests
npx tsx scripts/cli.ts generate-all

# Watch for file changes
npx tsx scripts/cli.ts watch [--path <path>]

# Check which files need tests
npx tsx scripts/cli.ts check

# Git integration
npx tsx scripts/cli.ts git-changed
npx tsx scripts/cli.ts git-new
```

## Generated Test Templates

### React Component Tests

For React components, the system generates tests that include:

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import MyComponent from './MyComponent';

describe('MyComponent', () => {
  it('renders without crashing', () => {
    render(<MyComponent />);
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('renders with required props', () => {
    // TODO: Add required props
  });

  it('manages state correctly', () => {
    // TODO: Add state management tests
  });

  it('matches snapshot', () => {
    const { container } = render(<MyComponent />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
```

### Utility Function Tests

For utility functions, the system generates:

```typescript
import { describe, it, expect } from 'vitest';
import * as utils from './utils';

describe('utils', () => {
  it('should be defined', () => {
    expect(utils).toBeDefined();
  });

  // TODO: Add tests for exported functions
});
```

## Configuration

The system can be configured via `test-automation.config.json`:

```json
{
  "testAutomation": {
    "srcDir": "src",
    "testDir": "src",
    "watchPaths": ["src"],
    "excludePatterns": ["**/*.test.*", "**/*.spec.*"],
    "fileExtensions": [".ts", ".tsx", ".js", ".jsx"],
    "gitIntegration": {
      "enabled": true,
      "autoStage": true
    }
  }
}
```

## What Gets Analyzed

The system analyzes your code to determine:

- **React Components**: Detects JSX, hooks, props, state
- **Utility Functions**: Identifies exported functions and their signatures
- **Props Interfaces**: Extracts TypeScript prop definitions
- **State Management**: Detects useState, useEffect, etc.
- **Imports/Dependencies**: Identifies external dependencies

## Workflow Integration

### Development Workflow

1. Create new component or utility file
2. Test automation automatically generates test template
3. Fill in the TODO items in the generated test
4. Run tests to ensure they pass

### Git Workflow

1. Make changes to code
2. Git pre-commit hook generates tests for changed files
3. Review generated tests
4. Commit includes both code and test changes

## File Structure

```
scripts/
├── cli.ts              # Main CLI interface
├── test-generator.ts   # Core test generation logic
├── file-watcher.ts     # File system watcher
├── git-integration.ts  # Git integration utilities
└── setup-git-hooks.sh # Git hooks installer
```

## Customization

### Custom Templates

You can modify the test templates in `scripts/test-generator.ts`:

- `generateReactComponentTest()` - React component templates
- `generateUtilityTest()` - Utility function templates
- `generatePropsTests()` - Props testing patterns
- `generateStateTests()` - State testing patterns

### Adding New File Types

To support additional file types, modify the `analyzeFile()` method in `TestGenerator` class.

## Best Practices

1. **Review Generated Tests**: Always review and customize generated tests
2. **Add Real Assertions**: Replace TODO comments with actual test logic
3. **Mock Dependencies**: Add appropriate mocks for external dependencies
4. **Test Edge Cases**: Add additional tests for edge cases and error conditions
5. **Keep Tests Updated**: Re-run generation when component interfaces change

## Troubleshooting

### Common Issues

1. **Tests not generating**: Check file extensions and exclude patterns
2. **Git hooks not working**: Ensure hooks are executable (`chmod +x`)
3. **TypeScript errors**: Ensure proper imports and type definitions

### Debug Mode

Run with debug information:

```bash
DEBUG=test-automation npm run test:generate
```

## Contributing

To extend the test automation system:

1. Add new analysis patterns in `test-generator.ts`
2. Update templates for new test patterns
3. Add configuration options in the config file
4. Update documentation

## Dependencies

- `chokidar` - File watching
- `commander` - CLI interface
- `fs-extra` - File system utilities
- `glob` - File pattern matching
- `tsx` - TypeScript execution

---

## Examples

### Example: Generated Component Test

Given this component:

```typescript
// src/components/Button.tsx
interface ButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

export default function Button({ label, onClick, disabled }: ButtonProps) {
  return (
    <button onClick={onClick} disabled={disabled}>
      {label}
    </button>
  );
}
```

The system generates:

```typescript
// src/components/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Button from './Button';

describe('Button', () => {
  it('renders without crashing', () => {
    render(<Button {...mockProps} />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('renders with required props', () => {
    const props = {
      label: 'Click me',
      onClick: vitest.fn()
    };
    render(<Button {...props} />);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = vitest.fn();
    render(<Button label="Click me" onClick={handleClick} />);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button label="Click me" onClick={vitest.fn()} disabled />);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});

const mockProps = {
  label: 'Test Button',
  onClick: vitest.fn()
};
```

This gives you a solid starting point for comprehensive component testing!
