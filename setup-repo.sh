#!/bin/bash

# API-Talks GitHub Repository Setup Script
# Run this script after accepting Xcode license: sudo xcodebuild -license

set -e

echo "🚀 Setting up API-Talks GitHub repository..."

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed. Please install Git first."
    exit 1
fi

# Initialize git repository
echo "📦 Initializing git repository..."
git init

# Add all files
echo "📝 Adding files to git..."
git add .

# Create initial commit
echo "💾 Creating initial commit..."
git commit -m "Initial commit: API-Talks - AI-powered conversational API explorer

- Full RAG implementation with vector embeddings
- Support for 10+ API platforms
- Modern UI with light/dark theme support
- Professional code highlighting and formatting
- TypeScript + Next.js 14 architecture"

# Check if GitHub CLI is available
if command -v gh &> /dev/null; then
    echo "🔐 Checking GitHub authentication..."
    if gh auth status &> /dev/null; then
        echo "✅ GitHub CLI is authenticated"
        
        read -p "Create GitHub repository 'API-Talks'? (y/n): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            echo "🌐 Creating GitHub repository..."
            gh repo create API-Talks --public --source=. --remote=origin --description="AI-powered conversational API explorer that helps developers interact with APIs through natural language queries"
            
            echo "📤 Pushing to GitHub..."
            git branch -M main
            git push -u origin main
            
            echo "✅ Repository created and pushed successfully!"
            echo "🌐 Repository URL: https://github.com/ChiragArora31/API-Talks"
        else
            echo "⏭️  Skipping GitHub repository creation"
        fi
    else
        echo "⚠️  GitHub CLI is not authenticated"
        echo "📝 To authenticate, run: gh auth login"
        echo "📝 Then manually create the repository on GitHub and push:"
        echo "   git remote add origin https://github.com/ChiragArora31/API-Talks.git"
        echo "   git branch -M main"
        echo "   git push -u origin main"
    fi
else
    echo "⚠️  GitHub CLI (gh) is not installed"
    echo "📝 To install: brew install gh"
    echo ""
    echo "📝 Manual setup instructions:"
    echo "   1. Create a new repository on GitHub named 'API-Talks'"
    echo "   2. Run these commands:"
    echo "      git remote add origin https://github.com/ChiragArora31/API-Talks.git"
    echo "      git branch -M main"
    echo "      git push -u origin main"
fi

echo ""
echo "✨ Setup complete!"
echo "📚 Project is ready for development!"

