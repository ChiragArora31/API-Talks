'use client';

import { useState, useRef, useEffect } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

// Modern Send icon component
const SendIcon = ({ disabled }: { disabled: boolean }) => (
  <svg 
    width="20" 
    height="20" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2"
    className={disabled ? "opacity-40" : ""}
  >
    <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
  </svg>
);

// Loading dots animation
const LoadingDots = () => (
  <div className="flex items-center space-x-1.5">
    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
  </div>
);

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  codeSnippet?: string;
  loading?: boolean;
}

// Helper function to extract code blocks from markdown
function extractCodeBlocks(text: string): Array<{ language: string; code: string; index: number; endIndex: number }> {
  const codeBlockRegex = /```(\w+)?\n?([\s\S]*?)```/g;
  const blocks: Array<{ language: string; code: string; index: number; endIndex: number }> = [];
  let match;

  while ((match = codeBlockRegex.exec(text)) !== null) {
    const startIndex = match.index;
    const endIndex = match.index + match[0].length;
    blocks.push({
      language: match[1] || 'javascript',
      code: match[2].trim(),
      index: startIndex,
      endIndex: endIndex,
    });
  }

  return blocks;
}

// Helper function to parse and render markdown-like content
function parseMarkdown(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  let remaining = text;
  
  // Process each line
  const lines = remaining.split('\n');
  
  return lines.map((line, lineIdx) => {
    // Handle headers
    if (line.trim().startsWith('## ')) {
      const headerText = line.trim().slice(3);
      return <h2 key={lineIdx} className="text-lg font-semibold mt-6 mb-3 text-slate-900 dark:text-slate-100">{parseInlineMarkdown(headerText)}</h2>;
    }
    if (line.trim().startsWith('### ')) {
      const headerText = line.trim().slice(4);
      return <h3 key={lineIdx} className="text-base font-semibold mt-5 mb-2.5 text-slate-900 dark:text-slate-100">{parseInlineMarkdown(headerText)}</h3>;
    }
    // Handle bullet points
    if (line.trim().startsWith('- ') || (line.trim().startsWith('* ') && !line.trim().startsWith('**'))) {
      const bulletText = line.trim().slice(2);
      return (
        <li key={lineIdx} className="ml-5 mb-2 list-disc text-[15px] leading-relaxed">
          {parseInlineMarkdown(bulletText)}
        </li>
      );
    }
    // Regular paragraph with markdown parsing
    if (line.trim()) {
      return (
        <p key={lineIdx} className="mb-3 text-[15px] leading-relaxed">
          {parseInlineMarkdown(line)}
        </p>
      );
    }
    return <br key={lineIdx} />;
  });
}

// Helper function to parse inline markdown (bold, italic, code, etc.)
function parseInlineMarkdown(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let key = 0;
  
  // Combined regex for bold, code, and regular text
  const combinedRegex = /(\*\*.*?\*\*|`.*?`)/g;
  let match;
  
  while ((match = combinedRegex.exec(text)) !== null) {
    // Add text before match
    if (match.index > lastIndex) {
      parts.push(<span key={key++}>{text.substring(lastIndex, match.index)}</span>);
    }
    
    // Handle bold (**text**)
    if (match[0].startsWith('**') && match[0].endsWith('**')) {
      const boldText = match[0].slice(2, -2);
      parts.push(<strong key={key++} className="font-semibold text-slate-900 dark:text-slate-100">{boldText}</strong>);
    }
    // Handle inline code (`code`)
    else if (match[0].startsWith('`') && match[0].endsWith('`')) {
      const codeText = match[0].slice(1, -1);
      parts.push(
        <code key={key++} className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400 rounded text-[14px] font-mono">
          {codeText}
        </code>
      );
    }
    
    lastIndex = match.index + match[0].length;
  }
  
  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(<span key={key++}>{text.substring(lastIndex)}</span>);
  }
  
  return parts.length > 0 ? parts : [text];
}

// Helper function to render markdown-like content
function renderContent(content: string) {
  const codeBlocks = extractCodeBlocks(content);
  
  if (codeBlocks.length === 0) {
    // No code blocks, render as plain text with markdown formatting
    return (
      <div className="text-slate-900 dark:text-slate-100 leading-relaxed">
        {parseMarkdown(content)}
      </div>
    );
  }

  // Has code blocks, render with code highlighting
  let lastIndex = 0;
  const elements: React.ReactNode[] = [];

  codeBlocks.forEach((block, blockIdx) => {
    // Text before code block
    if (block.index > lastIndex) {
      const textBefore = content.substring(lastIndex, block.index).trim();
      if (textBefore) {
        // Limit to 2-3 lines of context before code
        const lines = textBefore.split('\n').filter(l => l.trim());
        const contextLines = lines.slice(-3).join('\n');
        
        elements.push(
          <div key={`text-${blockIdx}`} className="mb-5 text-slate-700 dark:text-slate-200 leading-relaxed">
            {parseMarkdown(contextLines)}
          </div>
        );
      }
    }

    // Code block with professional styling
    elements.push(
      <div key={`code-${blockIdx}`} className="mb-6 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 shadow-lg bg-slate-900">
        <div className="bg-slate-800/90 dark:bg-slate-800 px-4 py-3 flex items-center justify-between border-b border-slate-700">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="ml-3 text-xs font-semibold text-slate-300 uppercase tracking-wide">
              {block.language || 'code'}
            </span>
          </div>
          <button
            onClick={() => {
              navigator.clipboard.writeText(block.code);
            }}
            className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-700/50 hover:bg-slate-700 rounded-md transition-all duration-200 flex items-center gap-1.5"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            Copy
          </button>
        </div>
        <div className="overflow-x-auto">
          <SyntaxHighlighter
            language={block.language || 'javascript'}
            style={vscDarkPlus}
            customStyle={{
              margin: 0,
              padding: '1.5rem',
              fontSize: '0.875rem',
              lineHeight: '1.6',
              background: '#0f172a',
            }}
            PreTag="div"
          >
            {block.code}
          </SyntaxHighlighter>
        </div>
      </div>
    );

    lastIndex = block.endIndex;
  });

  // Text after last code block
  if (lastIndex < content.length) {
    const textAfter = content.substring(lastIndex).trim();
    if (textAfter) {
      elements.push(
        <div key="text-after" className="mt-5 text-slate-700 dark:text-slate-200 leading-relaxed">
          {parseMarkdown(textAfter)}
        </div>
      );
    }
  }

  return <div className="space-y-1">{elements}</div>;
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
    };

    // Single-turn: Clear previous messages and start fresh
    setMessages([userMessage]);
    setInput('');
    setIsLoading(true);

    // Add loading message
    const loadingMessageId = (Date.now() + 1).toString();
    setMessages((prev) => [
      ...prev,
      {
        id: loadingMessageId,
        role: 'assistant',
        content: '',
        loading: true,
      },
    ]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage.content }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === loadingMessageId
            ? {
                id: loadingMessageId,
                role: 'assistant',
                content: data.response || '',
                codeSnippet: data.codeSnippet,
              }
            : msg
        )
      );
    } catch (error) {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === loadingMessageId
            ? {
                id: loadingMessageId,
                role: 'assistant',
                content: 'Sorry, I encountered an error. Please try again or rephrase your question.',
              }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const exampleQuestions = [
    { text: "How can I search for tracks using Spotify API?", icon: "🎵", platform: "spotify" },
    { text: "How to generate embeddings using OpenAI API?", icon: "🤖", platform: "openai" },
    { text: "Show me how to get GitHub repositories", icon: "⚡", platform: "github" },
    { text: "How do I create a payment intent with Stripe?", icon: "💳", platform: "stripe" },
  ];

  return (
    <div className="max-w-4xl mx-auto h-full flex flex-col">
      {/* Modern Card Container */}
      <div className="bg-white dark:bg-[#0f0f0f] rounded-2xl shadow-xl border border-slate-200/50 dark:border-slate-800/50 overflow-hidden backdrop-blur-sm flex flex-col h-full">
        
        {/* Minimal Header */}
        <div className="px-4 md:px-6 py-3 md:py-4 border-b border-slate-100 dark:border-slate-800/50 bg-gradient-to-r from-slate-50/50 to-transparent dark:from-slate-900/50 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base md:text-lg font-semibold text-slate-900 dark:text-slate-100">API Assistant</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Powered by AI • 10+ Platforms Supported</p>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Ready</span>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-4 md:px-6 py-4 md:py-6 bg-gradient-to-b from-white to-slate-50/30 dark:from-[#0f0f0f] dark:to-slate-950/30 min-h-0">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center text-center px-4 pt-8 pb-6 md:pt-12 md:pb-8">
              <div className="mb-4 md:mb-6 animate-fade-in">
                <div className="w-12 h-12 md:w-14 md:h-14 mx-auto mb-3 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 md:w-7 md:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
                <h3 className="text-xl md:text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-1.5">
                  How can I help you today?
                </h3>
                <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                  Ask me anything about APIs. I&apos;ll provide code examples and explanations.
                </p>
              </div>
              
              <div className="w-full max-w-2xl space-y-1.5 md:space-y-2 animate-fade-in-up">
                <p className="text-xs font-medium text-slate-400 dark:text-slate-500 mb-2">Try asking:</p>
                {exampleQuestions.map((example, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setInput(example.text);
                      setTimeout(() => {
                        const event = new Event('submit', { bubbles: true, cancelable: true });
                        handleSubmit(event as any);
                      }, 100);
                    }}
                    className="w-full text-left px-3 md:px-4 py-2.5 md:py-3 rounded-lg md:rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-all duration-200 group"
                  >
                    <div className="flex items-center gap-2 md:gap-3">
                      <span className="text-lg md:text-xl group-hover:scale-110 transition-transform">{example.icon}</span>
                      <span className="text-xs md:text-sm text-slate-700 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                        {example.text}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6 pb-4">
              {messages.map((message, idx) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in-up`}
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <div className={`max-w-[85%] ${message.role === 'user' ? 'order-2' : 'order-1'}`}>
                    {message.role === 'user' ? (
                      <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl rounded-tr-sm px-4 py-3 shadow-lg">
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                      </div>
                    ) : (
                      <div className="bg-white dark:bg-slate-900 rounded-2xl rounded-tl-sm border border-slate-200 dark:border-slate-700 shadow-lg p-6">
                        {message.loading ? (
                          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                            <LoadingDots />
                            <span className="text-sm">Thinking...</span>
                          </div>
                        ) : (
                          <div className="w-full">
                            {renderContent(message.content)}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Modern Input Area */}
        <div className="border-t border-slate-200 dark:border-slate-800/50 bg-white dark:bg-[#0f0f0f] px-4 md:px-6 py-3 md:py-4 flex-shrink-0">
          <form onSubmit={handleSubmit} className="relative">
            <div className="relative flex items-end gap-2 md:gap-3">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about any API..."
                  className="w-full px-4 md:px-5 py-2.5 md:py-3 pr-10 md:pr-12 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl md:rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 dark:focus:border-blue-600 text-xs md:text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all"
                  disabled={isLoading}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit(e as any);
                    }
                  }}
                />
                {input.trim() && (
                  <button
                    type="button"
                    onClick={() => setInput('')}
                    className="absolute right-2 md:right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="px-4 md:px-5 py-2.5 md:py-3.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-slate-300 disabled:to-slate-400 text-white rounded-xl md:rounded-2xl font-medium text-xs md:text-sm shadow-lg hover:shadow-xl disabled:shadow-none transition-all duration-200 disabled:cursor-not-allowed flex items-center gap-1.5 md:gap-2 min-w-[70px] md:min-w-[90px] justify-center"
              >
                {isLoading ? (
                  <>
                    <LoadingDots />
                    <span className="hidden md:inline">Sending</span>
                  </>
                ) : (
                  <>
                    <SendIcon disabled={!input.trim()} />
                    <span className="hidden md:inline">Send</span>
                  </>
                )}
              </button>
            </div>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-2 ml-2 hidden md:block">
              Press <kbd className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-xs">Enter</kbd> to send
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
