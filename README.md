# API-Talks 🚀

> An AI-powered conversational API explorer that helps developers interact with APIs through natural language queries.

![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=flat-square&logo=tailwind-css)
![Google Gemini](https://img.shields.io/badge/Gemini-2.5--Flash-4285f4?style=flat-square&logo=google)

## ✨ Features

- 🤖 **AI-Powered Responses**: Uses Google Gemini 2.5 Flash for intelligent, context-aware responses
- 💬 **Natural Language Interface**: Ask questions in plain English about any API
- 🔍 **RAG-Powered Search**: Retrieval-Augmented Generation for accurate, relevant responses
- 💻 **Code Generation**: Get ready-to-run code snippets with proper syntax highlighting
- 🎨 **Modern UI/UX**: Beautiful, minimalistic interface with light/dark theme support
- 🌐 **10+ API Platforms**: Comprehensive support for popular APIs
- ⚡ **Real-time**: Instant responses with fast vector search

## 🎯 Supported APIs

- **GitHub** - Repositories, search, issues, pull requests, and more
- **YouTube** - Videos, channels, playlists, comments, and more
- **Spotify** - Tracks, artists, albums, playlists, search, and more
- **Twitter/X** - Tweets, users, timelines, and more
- **Google Maps** - Geocoding, places, directions, and more
- **Stripe** - Payments, customers, subscriptions, and more
- **OpenAI** - Chat completions, embeddings, fine-tuning, and more
- **OpenWeatherMap** - Weather data, forecasts, and more
- **Notion** - Pages, databases, blocks, and more
- **Reddit** - Posts, comments, subreddits, and more

## 🏗️ Architecture

### RAG System (Retrieval-Augmented Generation)

```
User Query → Embedding → Vector Search → Relevant Docs → LLM → Response
```

1. **Retrieval**: Semantic search across API documentation using vector embeddings
2. **Augmentation**: Context injection with most relevant documentation
3. **Generation**: LLM generates responses using query + retrieved context

### Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **AI**: Google Gemini 2.5 Flash
- **Vector Store**: File-based with cosine similarity search
- **Syntax Highlighting**: React Syntax Highlighter

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- Google Gemini API key (free tier available)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ChiragArora31/API-Talks.git
   cd API-Talks
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
   
   Get your free API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📖 Usage

1. **Ask questions naturally**
   - "How to generate embeddings using OpenAI API?"
   - "Show me how to search for tracks using Spotify API"
   - "How do I create a payment intent with Stripe?"

2. **Get instant responses**
   - Contextual explanations
   - Ready-to-run code snippets
   - Properly formatted and highlighted

3. **Toggle themes**
   - Click the theme toggle button (top right)
   - Switch between light and dark modes

## 📁 Project Structure

```
API-Talks/
├── app/
│   ├── api/
│   │   ├── chat/                    # Chat API endpoint
│   │   └── init-vector-store/       # Vector store initialization
│   ├── globals.css                  # Global styles
│   ├── layout.tsx                   # Root layout with theme provider
│   └── page.tsx                     # Home page
├── components/
│   ├── ChatInterface.tsx            # Main chat UI component
│   ├── ThemeProvider.tsx             # Theme context provider
│   └── ThemeToggle.tsx               # Theme toggle button
├── lib/
│   ├── documentation-fetcher.ts     # API documentation fetcher
│   ├── embedding-service.ts         # Vector embedding generator
│   ├── vector-store.ts              # Vector database
│   ├── rag-service.ts               # RAG orchestration
│   ├── code-generator.ts            # Code snippet generator
│   └── llm-service.ts               # LLM integration
├── .gitignore
├── package.json
└── README.md
```

## 🔧 Configuration

### Vector Store

The vector store is automatically initialized on first use. It stores embeddings for all API documentation in `.vector-store.json` (git-ignored).

To manually reinitialize:
```bash
# Via API
curl -X POST http://localhost:3000/api/init-vector-store
```

### Environment Variables

- `GEMINI_API_KEY` - Required for AI-powered responses
- Without API key, the app will show an error (API key is required)

## 🛠️ Development

### Build for Production

```bash
npm run build
npm start
```

### Run Linting

```bash
npm run lint
```

## 🎨 UI Features

- **Modern Design**: Clean, minimalistic interface
- **Theme Support**: Light and dark modes with smooth transitions
- **Code Highlighting**: Professional syntax highlighting for code blocks
- **Responsive**: Works seamlessly on desktop and mobile
- **Copy to Clipboard**: One-click code copying

## 🔒 Security

- Never commit `.env.local` or API keys
- Vector store file (`.vector-store.json`) is git-ignored
- All sensitive files are excluded via `.gitignore`

## 🤝 Contributing

Contributions are welcome! Feel free to:

- Add support for more APIs
- Improve code generation logic
- Enhance UI/UX
- Add new features
- Fix bugs

## 📝 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Powered by [Google Gemini](https://deepmind.google/technologies/gemini/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)

## 📧 Contact

For questions or suggestions, please open an issue on GitHub.

---

**Made with ❤️ for developers**
