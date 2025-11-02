#!/bin/bash

# Quick script to create and push API-Talks repository to GitHub
# Make sure you've accepted Xcode license: sudo xcodebuild -license

set -e

echo "🚀 Creating API-Talks GitHub Repository..."

# Check if git is initialized
if [ ! -d .git ]; then
    echo "📦 Initializing git repository..."
    git init
fi

# Check if files are already staged/committed
if git diff --staged --quiet && git diff --quiet; then
    if [ -z "$(git log -1 2>/dev/null)" ]; then
        echo "📝 Adding files to git..."
        git add .
        
        echo "💾 Creating initial commit..."
        git commit -m "Initial commit: API-Talks - AI-powered conversational API explorer

- Full RAG implementation with vector embeddings
- Support for 10+ API platforms (GitHub, YouTube, Spotify, Twitter, Google Maps, Stripe, OpenAI, OpenWeatherMap, Notion, Reddit)
- Modern UI with light/dark theme support
- Professional code highlighting and formatting
- TypeScript + Next.js 14 architecture"
    else
        echo "✅ Git repository already initialized with commits"
    fi
else
    echo "📝 Staging changes..."
    git add .
    
    if [ -z "$(git log -1 2>/dev/null)" ]; then
        echo "💾 Creating initial commit..."
        git commit -m "Initial commit: API-Talks - AI-powered conversational API explorer

- Full RAG implementation with vector embeddings
- Support for 10+ API platforms
- Modern UI with light/dark theme support
- Professional code highlighting and formatting
- TypeScript + Next.js 14 architecture"
    else
        echo "💾 Committing changes..."
        git commit -m "Update: API-Talks repository setup"
    fi
fi

# Check if GitHub CLI is available and authenticated
if command -v gh &> /dev/null; then
    if gh auth status &> /dev/null; then
        echo "✅ GitHub CLI is authenticated"
        
        # Check if remote already exists
        if git remote get-url origin &> /dev/null; then
            echo "⚠️  Remote 'origin' already exists"
            echo "📤 Pushing to existing remote..."
        else
            echo "🌐 Creating GitHub repository 'API-Talks'..."
            gh repo create API-Talks \
                --public \
                --source=. \
                --remote=origin \
                --description="AI-powered conversational API explorer that helps developers interact with APIs through natural language queries" \
                --clone=false || {
                echo "⚠️  Repository might already exist or there was an error"
                echo "📤 Attempting to push to existing repository..."
            }
        fi
    else
        echo "⚠️  GitHub CLI is not authenticated"
        echo "Run: gh auth login"
        exit 1
    fi
else
    echo "❌ GitHub CLI (gh) is not installed"
    echo "Install with: brew install gh"
    echo ""
    echo "📝 Manual steps required:"
    echo "1. Go to: https://github.com/new"
    echo "2. Repository name: API-Talks"
    echo "3. Set to Public"
    echo "4. DO NOT initialize with README/gitignore/license"
    echo "5. Click Create"
    echo "6. Then run:"
    echo "   git remote add origin https://github.com/ChiragArora31/API-Talks.git"
    echo "   git branch -M main"
    echo "   git push -u origin main"
    exit 1
fi

# Set branch to main and push
echo "🌿 Setting branch to main..."
git branch -M main || echo "Branch already set to main"

echo "📤 Pushing to GitHub..."
git push -u origin main || {
    echo "⚠️  Push failed. Trying to set upstream..."
    git push --set-upstream origin main || {
        echo "❌ Push failed. Check your GitHub authentication and repository access"
        exit 1
    }
}

echo ""
echo "✅ Repository created and pushed successfully!"
echo "🌐 Repository URL: https://github.com/ChiragArora31/API-Talks"
echo ""
echo "🎉 Done! Visit your repository: https://github.com/ChiragArora31/API-Talks"

