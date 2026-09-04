'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Bot, X, Send, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const SUGGESTIONS = [
  "What is Sameer's experience?",
  "Show me his featured projects",
  "What tech stack does he use?",
  "How can I contact or hire him?",
];

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  (process.env.NODE_ENV === 'production'
    ? 'https://portfolio-platform-243j.vercel.app'
    : 'http://localhost:8001');

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hey there! 👋 I'm Sameer's AI Assistant. Ask me anything about his projects, skills, experience, or how to get in touch.",
    },
  ]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Initialize session ID from sessionStorage
  useEffect(() => {
    let sId = sessionStorage.getItem('sameer_chat_session_id');
    if (!sId) {
      sId = 'session-' + Math.random().toString(36).substring(2, 11);
      sessionStorage.setItem('sameer_chat_session_id', sId);
    }
    setSessionId(sId);
  }, []);

  // Auto-scroll on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen, isStreaming]);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend ?? input).trim();
    if (!text || isStreaming) return;

    setInput('');
    setMessages((prev) => [
      ...prev,
      { role: 'user', content: text },
      { role: 'assistant', content: '' },
    ]);
    setIsStreaming(true);

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const response = await fetch(`${API_BASE}/chatbot/stream`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, sessionId }),
        signal: controller.signal,
      });

      if (!response.ok || !response.body) {
        throw new Error(`Server returned status ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const parts = buffer.split('\n\n');
        buffer = parts.pop() ?? '';

        for (const part of parts) {
          const lines = part.split('\n');
          let event = 'message';
          let data = '';

          for (const line of lines) {
            if (line.startsWith('event:')) event = line.slice(6).trim();
            else if (line.startsWith('data: ')) data += line.slice(6);
            else if (line.startsWith('data:')) data += line.slice(5);
          }

          if (event === 'session' && data) {
            setSessionId(data);
            sessionStorage.setItem('sameer_chat_session_id', data);
          } else if (event === 'error') {
            setMessages((prev) => {
              const updated = [...prev];
              updated[updated.length - 1] = {
                role: 'assistant',
                content: data || 'Something went wrong. Please try again.',
              };
              return updated;
            });
          } else if (event === 'done') {
            // Streaming complete
          } else {
            const chunk = data.replace(/\\n/g, '\n');
            setMessages((prev) => {
              const updated = [...prev];
              const last = updated[updated.length - 1];
              if (last && last.role === 'assistant') {
                updated[updated.length - 1] = {
                  role: 'assistant',
                  content: last.content + chunk,
                };
              }
              return updated;
            });
          }
        }
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        setMessages((prev) => {
          const updated = [...prev];
          const last = updated[updated.length - 1];
          if (last && last.role === 'assistant' && !last.content) {
            updated[updated.length - 1] = {
              role: 'assistant',
              content: 'Connection lost. Please retry.',
            };
          }
          return updated;
        });
      }
    } finally {
      setIsStreaming(false);
      abortControllerRef.current = null;
    }
  };

  return (
    <>
      {/* Open Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 bg-zinc-950/90 text-white border border-purple-500/30 rounded-full shadow-[0_0_25px_rgba(124,58,237,0.35)] hover:shadow-[0_0_35px_rgba(124,58,237,0.55)] hover:border-purple-500/60 backdrop-blur-xl transition-all duration-300 group cursor-pointer"
        >
          <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-purple-600 to-violet-400 flex items-center justify-center text-white shadow-md shadow-purple-500/40 group-hover:scale-110 transition-transform">
            <Sparkles size={13} />
          </div>
          <span className="text-xs font-semibold tracking-wide text-zinc-100">Ask AI</span>
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
        </button>
      )}

      {/* Floating Chat Widget Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[92vw] sm:w-[410px] h-[560px] flex flex-col border border-white/10 bg-zinc-950/95 backdrop-blur-2xl rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.85)] overflow-hidden font-sans text-sm animate-in fade-in slide-in-from-bottom-4 duration-200">
          {/* Header Bar */}
          <div className="flex items-center justify-between px-4 py-3.5 border-b border-white/10 bg-white/[0.03]">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-purple-600/30">
                  <Sparkles size={15} />
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-zinc-950"></span>
              </div>
              <div>
                <h3 className="text-xs font-semibold text-white tracking-wide flex items-center gap-1.5">
                  Sameer's AI Assistant
                </h3>
                <p className="text-[10px] text-zinc-400 flex items-center gap-1">
                  <span>Online</span>
                  <span>•</span>
                  <span className="text-purple-400">Powered by AI</span>
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-zinc-400 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          {/* Message List */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
            {messages.map((m, idx) => (
              <div key={idx}>
                {m.role === 'user' ? (
                  <div className="flex justify-end">
                    <div className="max-w-[85%] bg-gradient-to-r from-purple-600 to-violet-600 text-white px-4 py-2.5 rounded-2xl rounded-tr-sm shadow-md shadow-purple-900/20 leading-relaxed font-sans text-xs">
                      {m.content}
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-2.5 max-w-[90%] items-start">
                    <div className="w-6 h-6 rounded-full bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-300 shrink-0 mt-0.5">
                      <Bot size={13} />
                    </div>
                    <div className="bg-white/[0.05] border border-white/10 text-zinc-200 px-4 py-2.5 rounded-2xl rounded-tl-sm backdrop-blur-md leading-relaxed font-sans text-xs">
                      <ReactMarkdown
                        components={{
                          strong: ({ node, ...props }) => <strong className="font-semibold text-white" {...props} />,
                          ul: ({ node, ...props }) => <ul className="list-disc list-outside ml-4 space-y-1 my-1.5 text-zinc-200" {...props} />,
                          ol: ({ node, ...props }) => <ol className="list-decimal list-outside ml-4 space-y-1 my-1.5 text-zinc-200" {...props} />,
                          li: ({ node, ...props }) => <li className="pl-0.5" {...props} />,
                          p: ({ node, ...props }) => <p className="mb-2 last:mb-0 leading-relaxed" {...props} />,
                          a: ({ node, ...props }) => <a className="text-purple-400 underline hover:text-purple-300" target="_blank" rel="noopener noreferrer" {...props} />,
                          code: ({ node, ...props }) => <code className="bg-white/10 px-1 py-0.5 rounded text-purple-300 font-mono text-[11px]" {...props} />
                        }}
                      >
                        {m.content}
                      </ReactMarkdown>
                      {isStreaming && idx === messages.length - 1 && m.role === 'assistant' && (
                        <span className="inline-block w-1.5 h-3.5 bg-purple-400 ml-1 animate-pulse align-middle" />
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Quick Suggestion Chips */}
            {messages.length <= 1 && !isStreaming && (
              <div className="pt-3 space-y-2">
                <div className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">Suggested Questions</div>
                <div className="flex flex-wrap gap-1.5">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => handleSend(s)}
                      className="text-[11px] px-3 py-1.5 border border-white/10 bg-white/[0.03] text-zinc-300 rounded-full hover:border-purple-500/50 hover:bg-purple-500/10 hover:text-purple-200 transition-all text-left"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Form Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="border-t border-white/10 p-3 bg-zinc-950 flex items-center gap-2"
          >
            <div className="flex-1 flex items-center gap-2 bg-white/[0.05] border border-white/10 focus-within:border-purple-500/50 rounded-full px-3.5 py-1.5 transition-all">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about Sameer's background..."
                disabled={isStreaming}
                className="flex-1 bg-transparent border-0 outline-none text-xs text-white placeholder:text-zinc-500 font-sans"
              />
            </div>
            <button
              type="submit"
              disabled={isStreaming || !input.trim()}
              className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-violet-500 flex items-center justify-center text-white hover:opacity-90 disabled:opacity-40 transition-all shadow-md shadow-purple-600/30 shrink-0"
            >
              <Send size={13} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
