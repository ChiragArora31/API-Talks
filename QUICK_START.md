# 🚀 Quick Start: Create GitHub Repository

## Prerequisites

**IMPORTANT**: First accept the Xcode license:
```bash
sudo xcodebuild -license
```
Press `space` to scroll, then type `agree` when prompted.

## Option 1: Automated Setup (Recommended)

Run the setup script:
```bash
cd /Users/chiragarora/Desktop/APITalks
./create-repo.sh
```

This will:
1. Initialize git (if not already done)
2. Add all files
3. Create initial commit
4. Create GitHub repository via GitHub CLI
5. Push to GitHub

## Option 2: Manual Setup

### Step 1: Initialize Git
```bash
cd /Users/chiragarora/Desktop/APITalks
git init
git add .
git commit -m "Initial commit: API-Talks - AI-powered conversational API explorer

- Full RAG implementation with vector embeddings
- Support for 10+ API platforms
- Modern UI with light/dark theme support
- Professional code highlighting and formatting
- TypeScript + Next.js 14 architecture"
```

### Step 2: Create Repository on GitHub

1. Go to: **https://github.com/new**
2. **Repository name**: `API-Talks`
3. **Description**: `AI-powered conversational API explorer that helps developers interact with APIs through natural language queries`
4. **Visibility**: Select **Public**
5. **IMPORTANT**: 
   - ❌ Do NOT check "Add a README file"
   - ❌ Do NOT check "Add .gitignore"
   - ❌ Do NOT check "Choose a license"
   (We already have these files!)
6. Click **"Create repository"**

### Step 3: Push to GitHub
```bash
git remote add origin https://github.com/ChiragArora31/API-Talks.git
git branch -M main
git push -u origin main
```

## Option 3: Using GitHub CLI

If you have GitHub CLI installed and authenticated:

```bash
# Make sure you're authenticated
gh auth login

# Create repository
gh repo create API-Talks \
  --public \
  --source=. \
  --remote=origin \
  --description="AI-powered conversational API explorer that helps developers interact with APIs through natural language queries"

# Push
git branch -M main
git push -u origin main
```

## Verification

After setup, visit:
**https://github.com/ChiragArora31/API-Talks**

## Troubleshooting

### Xcode License Issue
If you see "You have not agreed to the Xcode license agreements":
```bash
sudo xcodebuild -license
```

### GitHub CLI Not Authenticated
```bash
gh auth login
```

### Repository Already Exists
If the repository already exists, just push:
```bash
git remote add origin https://github.com/ChiragArora31/API-Talks.git
git branch -M main
git push -u origin main
```

---

**Need Help?** Check `SETUP_INSTRUCTIONS.md` for detailed instructions.

