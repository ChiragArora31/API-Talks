#!/bin/bash

# Script to push API-Talks code to GitHub repository
# Repository: https://github.com/ChiragArora31/API-Talks

set -e

echo "🚀 Pushing API-Talks to GitHub..."

# Initialize git if not already done
if [ ! -d .git ]; then
    echo "📦 Initializing git repository..."
    git init
fi

# Add all files
echo "📝 Adding files to git..."
git add .

# Create initial commit if no commits exist
if [ -z "$(git log -1 2>/dev/null)" ]; then
    echo "💾 Creating initial commit..."
    git commit -m "Initial commit: API-Talks - AI-powered conversational API explorer

- Full RAG implementation with vector embeddings
- Support for 10+ API platforms (GitHub, YouTube, Spotify, Twitter, Google Maps, Stripe, OpenAI, OpenWeatherMap, Notion, Reddit)
- Modern UI with light/dark theme support
- Professional code highlighting and formatting
- TypeScript + Next.js 14 architecture"
else
    echo "✅ Repository already has commits"
fi

# Check if remote already exists
if git remote get-url origin &> /dev/null; then
    echo "✅ Remote 'origin' already configured"
    REMOTE_URL=$(git remote get-url origin)
    echo "   Current remote: $REMOTE_URL"
else
    echo "🔗 Adding remote origin..."
    git remote add origin https://github.com/ChiragArora31/API-Talks.git
fi

# Set branch to main
echo "🌿 Setting branch to main..."
git branch -M main 2>/dev/null || echo "   Branch already set to main"

# Push to GitHub
echo "📤 Pushing to GitHub..."
git push -u origin main || {
    echo ""
    echo "⚠️  Push failed. This might be because:"
    echo "   1. You haven't accepted Xcode license: sudo xcodebuild -license"
    echo "   2. You're not authenticated with GitHub"
    echo "   3. You need to set up SSH keys or use HTTPS authentication"
    echo ""
    echo "📝 If using HTTPS, you may need to use a Personal Access Token:"
    echo "   Visit: https://github.com/settings/tokens"
    echo "   Generate a new token with 'repo' permissions"
    echo "   Use it as password when prompted"
    exit 1
}

echo ""
echo "✅ Code pushed successfully!"
echo "🌐 Repository URL: https://github.com/ChiragArora31/API-Talks"
echo ""
echo "🎉 Done! Your code is now on GitHub!"

