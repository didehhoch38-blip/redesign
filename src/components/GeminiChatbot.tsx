import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  Zap, 
  BrainCircuit, 
  Trash2, 
  HelpCircle,
  Lightbulb,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import { ChatMessage, GeminiModelChoice, RoomAnalysisResult } from '../types/declutter.js';

interface GeminiChatbotProps {
  roomAnalysis?: RoomAnalysisResult | null;
  initialQuestion?: string | null;
}

export const GeminiChatbot: React.FC<GeminiChatbotProps> = ({ roomAnalysis, initialQuestion }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: roomAnalysis
        ? `Hello! I'm your AI Decluttering & Spatial Planner. I've analyzed your **${roomAnalysis.roomType}** (Zen Score: ${roomAnalysis.zenScore}/100). How can I assist you today? You can ask me how to organize specific items, where to donate, or how to tackle your hotspots!`
        : `Hello! I'm your AI Decluttering & Spatial Planning Consultant. Upload a photo of any messy room or ask me any question about organizing, storage solutions, or the 5-bin decluttering method!`,
      timestamp: Date.now(),
      modelUsed: 'gemini-3.8-flash',
    },
  ]);

  const [input, setInput] = useState<string>('');
  const [selectedModel, setSelectedModel] = useState<GeminiModelChoice>('gemini-3.8-flash');
  const [isSending, setIsSending] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-fill input if initialQuestion is provided
  useEffect(() => {
    if (initialQuestion) {
      setInput(`How should I organize and store ${initialQuestion}? What is the best practical storage solution?`);
    }
  }, [initialQuestion]);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isSending]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || isSending) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: Date.now(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setIsSending(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          model: selectedModel,
          roomContext: roomAnalysis
            ? {
                roomType: roomAnalysis.roomType,
                zenScore: roomAnalysis.zenScore,
                primaryBlocker: roomAnalysis.primaryBlocker,
                hotspots: roomAnalysis.hotspots,
              }
            : null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get response');
      }

      const data = await response.json();

      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.reply,
        timestamp: Date.now(),
        modelUsed: data.modelUsed || selectedModel,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      console.error('Chat error:', err);
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: `I encountered an issue connecting to ${selectedModel}: ${err.message}. Please try again or switch to another model above.`,
        timestamp: Date.now(),
        modelUsed: selectedModel,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsSending(false);
    }
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: 'reset',
        role: 'assistant',
        content: roomAnalysis
          ? `Conversation reset. I am still ready with the context of your **${roomAnalysis.roomType}**. What area should we focus on?`
          : `Conversation reset. Ask me any question about room decluttering, storage gear, or spatial flow!`,
        timestamp: Date.now(),
        modelUsed: selectedModel,
      },
    ]);
  };

  const suggestionPrompts = roomAnalysis
    ? [
        'How should I tackle all the tangled cables and electronics?',
        'Give me a 15-minute blitz plan for this room',
        'Where can I donate used items and clothes locally?',
        'How do I decide whether to keep or toss sentimental papers?',
      ]
    : [
        'What is the KonMari method for organizing clothes?',
        'What are the best affordable organizers for a cluttered desk?',
        'How do I start decluttering when I feel completely overwhelmed?',
        'How does the 5-bin decluttering sorting system work?',
      ];

  const getModelBadge = (model: GeminiModelChoice) => {
    switch (model) {
      case 'gemini-4-argon':
        return (
          <span className="flex items-center gap-1 text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
            <Sparkles className="w-3 h-3 text-amber-600" />
            gemini-4-argon (Complex Tasks)
          </span>
        );
      case 'gemini-3.1-flash-lite':
        return (
          <span className="flex items-center gap-1 text-[10px] font-bold text-teal-800 bg-teal-100 px-2 py-0.5 rounded-full">
            <Zap className="w-3 h-3 text-teal-600" />
            gemini-3.1-flash-lite (Fast)
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1 text-[10px] font-bold text-stone-800 bg-stone-100 px-2 py-0.5 rounded-full">
            <BrainCircuit className="w-3 h-3 text-stone-600" />
            gemini-3.8-flash (General)
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs flex flex-col h-[640px]">
      {/* Chat Header */}
      <div className="p-4 border-b border-stone-100 bg-stone-50/60 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center shadow-xs">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-stone-900 font-['Outfit',sans-serif] flex items-center gap-1.5">
              <span>Gemini Organizer Assistant</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </h3>
            <p className="text-[11px] text-stone-500">
              Multi-turn spatial advice & item triage
            </p>
          </div>
        </div>

        {/* Model Selector Tabs satisfying user requirement */}
        <div className="flex items-center gap-1 bg-stone-200/70 p-1 rounded-xl">
          <button
            onClick={() => setSelectedModel('gemini-4-argon')}
            className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition flex items-center gap-1 ${
              selectedModel === 'gemini-4-argon'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
            title="Use gemini-4-argon for particularly complex tasks and spatial reasoning"
            aria-label="Select gemini-4-argon model"
          >
            <Sparkles className="w-3 h-3 text-amber-600" />
            <span>gemini-4-argon</span>
          </button>

          <button
            onClick={() => setSelectedModel('gemini-3.8-flash')}
            className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition flex items-center gap-1 ${
              selectedModel === 'gemini-3.8-flash'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
            title="Use gemini-3.8-flash for general organization tasks"
            aria-label="Select gemini-3.8-flash model"
          >
            <BrainCircuit className="w-3 h-3 text-stone-600" />
            <span>gemini-3.8-flash</span>
          </button>

          <button
            onClick={() => setSelectedModel('gemini-3.1-flash-lite')}
            className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition flex items-center gap-1 ${
              selectedModel === 'gemini-3.1-flash-lite'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
            title="Use gemini-3.1-flash-lite for tasks that should happen fast"
            aria-label="Select gemini-3.1-flash-lite model"
          >
            <Zap className="w-3 h-3 text-teal-600" />
            <span>gemini-3.1-flash-lite</span>
          </button>

          <button
            onClick={handleClearHistory}
            className="p-1 text-stone-400 hover:text-rose-600 transition ml-1"
            title="Clear chat history"
            aria-label="Clear chat history"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Scrollable Message Thread */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
        {messages.map((message) => {
          const isUser = message.role === 'user';
          return (
            <div
              key={message.id}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${
                  isUser
                    ? 'bg-stone-900 text-white'
                    : 'bg-amber-100 text-amber-800 border border-amber-200'
                }`}
              >
                {isUser ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
              </div>

              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed shadow-2xs ${
                  isUser
                    ? 'bg-stone-900 text-white rounded-tr-xs'
                    : 'bg-stone-50 border border-stone-200 text-stone-800 rounded-tl-xs'
                }`}
              >
                {!isUser && message.modelUsed && (
                  <div className="mb-2">{getModelBadge(message.modelUsed as GeminiModelChoice)}</div>
                )}

                {/* Message Content formatted with line breaks and markdown basics */}
                <div className="whitespace-pre-wrap space-y-2">
                  {message.content.split('\n\n').map((paragraph, i) => (
                    <p key={i}>
                      {paragraph.split('**').map((chunk, j) =>
                        j % 2 === 1 ? <strong key={j} className="font-bold">{chunk}</strong> : chunk
                      )}
                    </p>
                  ))}
                </div>

                <div
                  className={`mt-1.5 text-[10px] text-right ${
                    isUser ? 'text-stone-400' : 'text-stone-400'
                  }`}
                >
                  {new Date(message.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </div>
            </div>
          );
        })}

        {isSending && (
          <div className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 border border-amber-200">
              <Bot className="w-3.5 h-3.5 animate-pulse" />
            </div>
            <div className="bg-stone-50 border border-stone-200 rounded-2xl p-3.5 rounded-tl-xs flex items-center gap-2 text-xs text-stone-500">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-600" />
              <span>{selectedModel} is thinking...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggestion Prompts */}
      <div className="px-4 py-2 bg-stone-50/50 border-t border-stone-100 flex items-center gap-2 overflow-x-auto text-[11px]">
        <span className="text-stone-400 font-semibold shrink-0 flex items-center gap-1">
          <Lightbulb className="w-3 h-3 text-amber-500" />
          Try asking:
        </span>
        {suggestionPrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(prompt)}
            disabled={isSending}
            className="px-2.5 py-1 bg-white hover:bg-amber-50 hover:border-amber-300 border border-stone-200 rounded-lg text-stone-700 transition shrink-0 whitespace-nowrap disabled:opacity-50"
            aria-label={`Prompt: ${prompt}`}
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Chat Input Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="p-3 bg-white border-t border-stone-200 flex items-center gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Ask ${selectedModel} anything about organizing this space...`}
          disabled={isSending}
          className="flex-1 px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs sm:text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500 transition disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={!input.trim() || isSending}
          className={`p-2.5 rounded-xl transition ${
            input.trim() && !isSending
              ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-xs'
              : 'bg-stone-100 text-stone-300 cursor-not-allowed'
          }`}
          aria-label="Send chat message"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
