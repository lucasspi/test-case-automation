#!/bin/bash

# Git Hooks Setup for Test Automation

echo "🔧 Setting up Git hooks for test automation..."

# Create hooks directory if it doesn't exist
mkdir -p .git/hooks

# Pre-commit hook - Generate tests for new/changed files
cat > .git/hooks/pre-commit << 'EOF'
#!/bin/bash

# Test Automation Pre-commit Hook
echo "🧪 Running test automation checks..."

# Check if there are any new or changed TypeScript/React files
changed_files=$(git diff --cached --name-only --diff-filter=AM | grep -E '\.(ts|tsx|js|jsx)$' | grep -v '\.test\.' | grep -v '\.spec\.')

if [ -z "$changed_files" ]; then
    echo "ℹ️  No relevant files changed"
    exit 0
fi

echo "📝 Found changed files:"
echo "$changed_files"

# Generate tests for changed files
npm run test:git-changed

# Add any generated test files to the commit
git add **/*.test.{ts,tsx,js,jsx} 2>/dev/null || true

echo "✅ Test automation complete"
EOF

# Post-commit hook - Optional: Run tests after commit
cat > .git/hooks/post-commit << 'EOF'
#!/bin/bash

# Test Automation Post-commit Hook
echo "🧪 Running tests after commit..."

# Run tests to ensure everything passes
npm run test:run

if [ $? -eq 0 ]; then
    echo "✅ All tests passed!"
else
    echo "❌ Some tests failed. Please review."
fi
EOF

# Make hooks executable
chmod +x .git/hooks/pre-commit
chmod +x .git/hooks/post-commit

echo "✅ Git hooks installed successfully!"
echo ""
echo "📋 Available hooks:"
echo "  - pre-commit: Generates tests for new/changed files"
echo "  - post-commit: Runs tests after commit"
echo ""
echo "💡 To disable hooks temporarily, use: git commit --no-verify"
