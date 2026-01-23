import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Brain, Loader2 } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { ChatMessage } from '../types';
import { DEVELOPER_INFO, PROJECTS } from '../data';

export const AIChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: `Hi! I'm an AI assistant. Ask me anything about ${DEVELOPER_INFO.name}'s skills or projects.`, timestamp: Date.now() }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg, timestamp: Date.now() }]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      // Prepare context about the developer
      const context = `
        You are a helpful portfolio assistant for ${DEVELOPER_INFO.name}.
        Bio: ${DEVELOPER_INFO.bio}
        Role: ${DEVELOPER_INFO.role}
        Skills: ${DEVELOPER_INFO.skills.join(', ')}
        Services Offered: ${DEVELOPER_INFO.services.join(', ')}
        Location: ${DEVELOPER_INFO.location}
        Contact: ${DEVELOPER_INFO.email}
        
        Here is a list of their projects:
        ${JSON.stringify(PROJECTS)}
        
        Answer questions concisely and professionally. If you don't know the answer based on this info, say you don't know but suggest contacting them directly.
        Keep answers under 50 words unless asked for details.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: userMsg,
        config: {
          systemInstruction: context,
        }
      });

      const reply = response.text || "I couldn't generate a response. Please try again.";

      setMessages(prev => [...prev, { role: 'model', text: reply, timestamp: Date.now() }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'model', text: "Sorry, I'm having trouble connecting right now.", timestamp: Date.now() }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-24 md:bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-[calc(100vw-3rem)] md:w-96 bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-neutral-800 overflow-hidden flex flex-col animate-fade-in-up transition-all duration-300 transform origin-bottom-right">
          {/* Header */}
          <div className="bg-slate-800 dark:bg-black p-4 flex justify-between items-center text-white">
            <div className="flex items-center gap-2">
              <Brain size={16} className="text-blue-400" />
              <span className="font-medium text-sm">Ask about {DEVELOPER_INFO.name}</span>
            </div>
            <button 
              onClick={() => setIsOpen(false)} 
              aria-label="Close chat"
              title="Close chat"
              className="hover:bg-slate-700 dark:hover:bg-neutral-900 p-1 rounded transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="h-80 overflow-y-auto p-4 bg-stone-50 dark:bg-neutral-950 space-y-4">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div 
                  className={`max-w-[85%] p-3 text-sm rounded-xl leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-slate-800 text-white rounded-tr-none' 
                      : 'bg-white dark:bg-neutral-800 text-slate-700 dark:text-neutral-100 border border-slate-200 dark:border-neutral-700 shadow-sm rounded-tl-none'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
               <div className="flex justify-start">
                 <div className="bg-white dark:bg-neutral-800 p-3 rounded-xl rounded-tl-none border border-slate-200 dark:border-neutral-700 shadow-sm flex items-center gap-2">
                   <Loader2 size={16} className="animate-spin text-slate-400 dark:text-neutral-300" />
                   <span className="text-xs text-slate-400 dark:text-neutral-300">Thinking...</span>
                 </div>
               </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 bg-white dark:bg-neutral-900 border-t border-slate-100 dark:border-neutral-800 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask about my skills..."
              className="flex-1 px-3 py-2 text-sm bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-200 dark:focus:ring-neutral-700 transition-all text-slate-700 dark:text-neutral-200"
            />
            <button 
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              aria-label="Send message"
              title="Send message"
              className="p-2 bg-slate-800 dark:bg-neutral-800 text-white rounded-lg hover:bg-slate-700 dark:hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Close AI chat" : "Open AI chat"}
        title={isOpen ? "Close AI chat" : "Open AI chat"}
        className={`p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-105 flex items-center justify-center ${isOpen ? 'bg-slate-200 text-slate-600 rotate-90 dark:bg-neutral-800 dark:text-neutral-200' : 'bg-slate-800 text-white dark:bg-neutral-800'}`}
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </button>
    </div>
  );
};