import ChatInterface from "@/components/ChatInterface";
import ThemeToggle from "@/components/ThemeToggle";

export default function Home() {
  return (
    <main className="h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-[#0a0a0a] dark:via-[#0f0f0f] dark:to-slate-950 flex flex-col relative">
      <div className="flex-1 container mx-auto px-4 py-4 md:py-6 flex flex-col min-h-0 relative">
        {/* Theme Toggle - Top Right */}
        <div className="absolute top-3 right-4 md:top-4 md:right-6 z-50 pointer-events-auto">
          <ThemeToggle />
        </div>
        
        <div className="mb-4 md:mb-6 text-center animate-fade-in flex-shrink-0">
          <div className="inline-flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 mb-2 md:mb-3 shadow-lg">
            <svg className="w-6 h-6 md:w-7 md:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-1 md:mb-2 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
            API-Talks
          </h1>
          <p className="text-base md:text-lg text-slate-600 dark:text-slate-300 font-medium mb-1">
            Your AI-Powered API Assistant
          </p>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
          Get quick, ready-to-run API code snippets from 10+ popular platforms.
          </p>
        </div>
        <div className="flex-1 min-h-0">
          <ChatInterface />
        </div>
      </div>
    </main>
  );
}
