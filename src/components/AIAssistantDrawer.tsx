import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  X,
  Send,
  Bot,
  User,
  ShoppingBag,
  ExternalLink,
  RotateCcw,
  Tag,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useRouter } from '../context/RouterContext';
import { AIMessage } from '../types';

export const AIAssistantDrawer: React.FC = () => {
  const { isAIAssistantOpen, setIsAIAssistantOpen, products, addToCart } = useStore();
  const { navigate } = useRouter();

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<AIMessage[]>([
    {
      id: 'msg-welcome',
      role: 'assistant',
      text: "Namaste! ✨ I'm Nova AI, your personal fashion stylist for NovaCart Ai. What occasion or style are you shopping for today? Tell me your preferred category, budget, or color!",
      followUpQuestions: [
        'College handbag under ₹1500',
        'Festive dress for family function',
        'Minimalist daily gold jewellery',
        'Sunglasses & accessories under ₹1000',
      ],
      timestamp: 'Just now',
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isAIAssistantOpen) {
      scrollToBottom();
    }
  }, [messages, isAIAssistantOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    const userMessage: AIMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      text: query.trim(),
      timestamp: 'Just now',
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      // Call server-side /api/assistant with Gemini 3.8 Flash
      const response = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query.trim(),
          history: messages.slice(-5),
          catalog: products.map((p) => ({
            id: p.id,
            name: p.name,
            category: p.category,
            price: p.price,
            originalPrice: p.originalPrice,
            stock: p.stock,
            colors: p.colors,
            tags: p.tags,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error('Server response failed');
      }

      const data = await response.json();

      const assistantMessage: AIMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        text: data.reply || "Here are my style recommendations for you!",
        recommendedProductIds: data.suggestedProductIds || [],
        followUpQuestions: data.followUpQuestions || [
          'Show me options under ₹1000',
          'What about matching jewellery?',
          'Do you have other colors?',
        ],
        timestamp: 'Just now',
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.warn('AI Assistant API fallback:', err);
      // Smart local fallback matching query keywords against actual product tags
      const lower = query.toLowerCase();
      const matched = products.filter((p) => {
        if (p.stock <= 0) return false;
        return (
          p.tags.some((t) => lower.includes(t)) ||
          p.name.toLowerCase().includes(lower) ||
          p.category.toLowerCase().includes(lower) ||
          (lower.includes('college') && p.tags.includes('college')) ||
          (lower.includes('handbag') && p.category === 'handbags') ||
          (lower.includes('dress') && p.category === 'dresses') ||
          (lower.includes('jewellery') && p.category === 'jewellery') ||
          (lower.includes('party') && p.tags.includes('party'))
        );
      });

      const fallbackMsg: AIMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        text: `Here are great options from our catalog matching "${query}". Let me know if you would like to refine by price or color!`,
        recommendedProductIds: matched.slice(0, 3).map((p) => p.id),
        followUpQuestions: [
          'Looking for a specific color?',
          'What is your budget?',
          'Show me festive wear',
        ],
        timestamp: 'Just now',
      };

      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: `msg-${Date.now()}`,
        role: 'assistant',
        text: "Hi again! What are you styling for today? Let's find your perfect match!",
        followUpQuestions: [
          'College handbag under ₹1500',
          'Floral dresses for weekend',
          'Traditional Chikankari Kurta',
          'Trending accessories',
        ],
        timestamp: 'Just now',
      },
    ]);
  };

  return (
    <>
      {/* Floating "Ask Nova AI" Launcher Button */}
      {!isAIAssistantOpen && (
        <button
          onClick={() => setIsAIAssistantOpen(true)}
          className="fixed bottom-20 lg:bottom-8 right-4 lg:right-8 z-40 group flex items-center space-x-2 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white pl-4 pr-5 py-3 rounded-full shadow-xl hover:shadow-2xl shadow-blue-600/30 hover:scale-105 active:scale-95 transition transform duration-200"
          aria-label="Ask Nova AI Shopping Assistant"
        >
          <div className="relative">
            <Sparkles className="w-5 h-5 text-amber-300 animate-spin-slow" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
          </div>
          <span className="font-bold text-sm tracking-tight">Ask Nova AI</span>
        </button>
      )}

      {/* Slide-over Assistant Drawer */}
      {isAIAssistantOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setIsAIAssistantOpen(false)}
          />

          {/* Drawer Panel */}
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 text-white flex items-center justify-between shadow-md">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center text-amber-300 shadow-inner">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center space-x-1.5">
                    <h3 className="font-bold text-base leading-tight">Nova AI Stylist</h3>
                    <span className="text-[10px] bg-blue-800/80 text-blue-200 font-semibold px-1.5 py-0.2 rounded uppercase">
                      Live
                    </span>
                  </div>
                  <p className="text-xs text-blue-100">Personalized Indian Fashion Assistant</p>
                </div>
              </div>

              <div className="flex items-center space-x-1">
                <button
                  onClick={handleResetChat}
                  className="p-1.5 text-blue-100 hover:text-white hover:bg-white/10 rounded-lg transition"
                  title="Clear conversation"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsAIAssistantOpen(false)}
                  className="p-1.5 text-blue-100 hover:text-white hover:bg-white/10 rounded-lg transition"
                  title="Close Assistant"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Conversation Log */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
              {messages.map((msg) => {
                const isAssistant = msg.role === 'assistant';
                const recommendedProducts = (msg.recommendedProductIds || [])
                  .map((id) => products.find((p) => p.id === id))
                  .filter(Boolean);

                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isAssistant ? 'items-start' : 'items-end'}`}
                  >
                    <div
                      className={`flex items-start space-x-2 max-w-[88%] ${
                        isAssistant ? '' : 'flex-row-reverse space-x-reverse'
                      }`}
                    >
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                          isAssistant
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 text-gray-700'
                        }`}
                      >
                        {isAssistant ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                      </div>

                      <div
                        className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-xs ${
                          isAssistant
                            ? 'bg-white text-gray-900 border border-blue-100 rounded-tl-xs'
                            : 'bg-blue-600 text-white rounded-tr-xs'
                        }`}
                      >
                        <p className="whitespace-pre-line">{msg.text}</p>
                      </div>
                    </div>

                    {/* Rich Product Cards inside chat */}
                    {isAssistant && recommendedProducts.length > 0 && (
                      <div className="mt-3 pl-9 w-full space-y-2">
                        <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider flex items-center space-x-1">
                          <Tag className="w-3 h-3 text-blue-600" />
                          <span>Recommended in Store ({recommendedProducts.length})</span>
                        </div>
                        <div className="grid grid-cols-1 gap-2">
                          {recommendedProducts.map((prod) => {
                            if (!prod) return null;
                            return (
                              <div
                                key={prod.id}
                                className="bg-white p-2.5 rounded-xl border border-blue-100 shadow-xs flex items-center justify-between gap-3 hover:border-blue-300 transition"
                              >
                                <img
                                  src={prod.images[0]}
                                  alt={prod.name}
                                  className="w-14 h-16 object-cover rounded-lg shrink-0"
                                />
                                <div className="flex-1 min-w-0">
                                  <h4 className="text-xs font-semibold text-gray-900 truncate">
                                    {prod.name}
                                  </h4>
                                  <div className="flex items-center space-x-2 mt-1">
                                    <span className="text-xs font-bold text-gray-900">
                                      ₹{prod.price}
                                    </span>
                                    {prod.originalPrice > prod.price && (
                                      <span className="text-[10px] text-gray-400 line-through">
                                        ₹{prod.originalPrice}
                                      </span>
                                    )}
                                    <span className="text-[10px] text-green-600 font-bold">
                                      {prod.discount}% off
                                    </span>
                                  </div>
                                  <div className="text-[10px] text-gray-500 truncate mt-0.5">
                                    {prod.category} • {prod.stock > 0 ? `${prod.stock} in stock` : 'Out of stock'}
                                  </div>
                                </div>
                                <div className="flex flex-col space-y-1">
                                  <button
                                    onClick={() => {
                                      setIsAIAssistantOpen(false);
                                      navigate(`/product/${prod.id}`);
                                    }}
                                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg text-[11px] font-semibold flex items-center justify-center"
                                    title="View Product"
                                  >
                                    <ExternalLink className="w-3.5 h-3.5" />
                                  </button>
                                  {prod.stock > 0 && (
                                    <button
                                      onClick={() => addToCart(prod, 1)}
                                      className="p-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[11px] flex items-center justify-center"
                                      title="Add to Cart"
                                    >
                                      <ShoppingBag className="w-3.5 h-3.5" />
                                    </button>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Follow-up question chips */}
                    {isAssistant && msg.followUpQuestions && msg.followUpQuestions.length > 0 && (
                      <div className="mt-2.5 pl-9 flex flex-wrap gap-1.5">
                        {msg.followUpQuestions.map((q, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleSendMessage(q)}
                            className="text-[11px] bg-white hover:bg-blue-50 text-blue-700 border border-blue-200 hover:border-blue-400 px-2.5 py-1 rounded-full transition font-medium text-left"
                          >
                            {q}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}

              {loading && (
                <div className="flex items-center space-x-2 pl-9">
                  <div className="bg-white border border-blue-100 rounded-2xl px-4 py-2.5 flex items-center space-x-2 shadow-xs">
                    <div className="flex space-x-1">
                      <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce" />
                      <span
                        className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce"
                        style={{ animationDelay: '0.2s' }}
                      />
                      <span
                        className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce"
                        style={{ animationDelay: '0.4s' }}
                      />
                    </div>
                    <span className="text-xs text-gray-500 font-medium">
                      Nova AI is styling your look...
                    </span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <div className="p-3 bg-white border-t border-gray-100">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center space-x-2"
              >
                <input
                  type="text"
                  placeholder="e.g. Need a handbag for college under ₹1500..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={loading}
                  className="flex-1 bg-gray-50 border border-gray-200 focus:border-blue-600 focus:bg-white rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-100"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || loading}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 text-white p-2.5 rounded-xl transition shadow-xs flex items-center justify-center shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
              <p className="text-[10px] text-gray-400 text-center mt-2">
                Nova AI analyzes store stock, occasions, and Indian fashion trends in real-time.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
