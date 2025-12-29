import { useState, useRef, useEffect, FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, ImagePlus, Sparkles, X, Zap } from 'lucide-react';
import type { Message, AnalysisResult } from '@/types';
import { cn } from '@/lib/utils';
import { performOCR } from '@/lib/ocr';
import { getMockAnalysis, inferHealthConcerns } from '@/lib/mock-data';
import { MessageBubble, WelcomeMessage } from './MessageBubble';
import { ImageUpload } from './ImageUpload';

function generateId() {
  return Math.random().toString(36).substring(2, 9);
}

export function ChatWindow() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleImageSelect = (file: File) => {
    setSelectedImage(file);
    const preview = URL.createObjectURL(file);
    setImagePreview(preview);
    setShowUpload(false);
  };

  const clearImage = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    setSelectedImage(null);
    setImagePreview(null);
  };

  const processAnalysis = async (query: string, imageFile?: File): Promise<AnalysisResult> => {
    let extractedText = '';
    
    if (imageFile) {
      const ocrResult = await performOCR(imageFile);
      if (ocrResult.success) {
        extractedText = ocrResult.text;
      }
    }

    const concerns = inferHealthConcerns(query);
    const analysis = getMockAnalysis(query || extractedText);
    
    if (concerns.length > 0) {
      analysis.healthProfile.concerns = [...new Set([...concerns, ...analysis.healthProfile.concerns])];
    }

    return analysis;
  };

  const handleSubmit = async (e?: FormEvent) => {
    e?.preventDefault();
    
    if (!inputValue.trim() && !selectedImage) return;

    const userMessage: Message = {
      id: generateId(),
      role: 'user',
      content: inputValue || 'Analyze this food label',
      timestamp: new Date(),
      imageUrl: imagePreview || undefined,
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    const loadingMessage: Message = {
      id: generateId(),
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      isLoading: true,
    };
    setMessages(prev => [...prev, loadingMessage]);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const analysis = await processAnalysis(inputValue, selectedImage || undefined);

      let responseContent = '';
      if (analysis.healthProfile.concerns.length > 0) {
        responseContent = `Based on your ${analysis.healthProfile.concerns.join(' and ')} concerns, here's my analysis of ${analysis.productName || 'this product'}:`;
      } else {
        responseContent = `Here's my analysis of ${analysis.productName || 'this product'}:`;
      }

      const assistantMessage: Message = {
        id: generateId(),
        role: 'assistant',
        content: responseContent,
        timestamp: new Date(),
        insights: analysis.insights,
      };

      setMessages(prev => {
        const newMessages = prev.filter(m => !m.isLoading);
        return [...newMessages, assistantMessage];
      });

      setTimeout(() => {
        const summaryMessage: Message = {
          id: generateId(),
          role: 'assistant',
          content: analysis.summary,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, summaryMessage]);
      }, 500);

    } catch (error) {
      console.error('Analysis error:', error);
      const errorMessage: Message = {
        id: generateId(),
        role: 'assistant',
        content: "I had trouble analyzing that. Could you try a clearer image or describe the product you're asking about?",
        timestamp: new Date(),
      };
      setMessages(prev => {
        const newMessages = prev.filter(m => !m.isLoading);
        return [...newMessages, errorMessage];
      });
    } finally {
      setIsLoading(false);
      clearImage();
    }
  };

  const suggestedQueries = [
    { text: 'Is this safe for diabetics?', icon: '🩺' },
    { text: 'Check for common allergens', icon: '⚠️' },
    { text: 'Is this product vegan?', icon: '🌱' },
    { text: 'Analyze sodium content', icon: '🧂' },
  ];

  const handleSuggestion = (query: string) => {
    setInputValue(query);
    inputRef.current?.focus();
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-2xl mx-auto space-y-6">
          {messages.length === 0 ? (
            <WelcomeMessage />
          ) : (
            messages.map(message => (
              <MessageBubble key={message.id} message={message} />
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Upload Modal */}
      <AnimatePresence>
        {showUpload && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowUpload(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-md"
            >
              <div className="glass-card rounded-3xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-display font-semibold text-foreground text-lg">Upload Food Label</h3>
                  <button
                    onClick={() => setShowUpload(false)}
                    className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
                  >
                    <X className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>
                <ImageUpload
                  onImageSelect={handleImageSelect}
                  previewUrl={imagePreview || undefined}
                  onClear={clearImage}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input Area */}
      <div className="border-t border-border/50 bg-card/50 backdrop-blur-xl px-4 py-4">
        <div className="max-w-2xl mx-auto space-y-3">
          {/* Image Preview */}
          <AnimatePresence>
            {imagePreview && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-center gap-3"
              >
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Selected"
                    className="h-16 w-16 object-cover rounded-xl border-2 border-primary/30 shadow-soft"
                  />
                  <button
                    onClick={clearImage}
                    className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center shadow-soft"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium">
                  <Zap className="w-4 h-4" />
                  Ready to analyze
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Suggestions */}
          {messages.length === 0 && (
            <div className="flex flex-wrap gap-2">
              {suggestedQueries.map((query, i) => (
                <motion.button
                  key={query.text}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => handleSuggestion(query.text)}
                  className="px-4 py-2 text-sm rounded-full glass-card hover:shadow-soft transition-all duration-300 flex items-center gap-2"
                >
                  <span>{query.icon}</span>
                  <span className="text-foreground">{query.text}</span>
                </motion.button>
              ))}
            </div>
          )}

          {/* Input Form */}
          <form onSubmit={handleSubmit} className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowUpload(true)}
              className={cn(
                'w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300',
                imagePreview
                  ? 'gradient-hero text-primary-foreground shadow-glow'
                  : 'glass-card hover:shadow-soft text-foreground'
              )}
            >
              <ImagePlus className="w-5 h-5" />
            </button>
            
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                placeholder="Ask about any food product..."
                className="w-full px-5 py-3.5 pr-12 rounded-xl glass-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:shadow-soft transition-all"
                disabled={isLoading}
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <Sparkles className="w-4 h-4 text-primary/40" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || (!inputValue.trim() && !selectedImage)}
              className={cn(
                'w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300',
                isLoading || (!inputValue.trim() && !selectedImage)
                  ? 'bg-muted text-muted-foreground cursor-not-allowed'
                  : 'gradient-hero text-primary-foreground shadow-glow hover:shadow-elevated'
              )}
            >
              <Send className="w-5 h-5" />
            </button>
          </form>

          <p className="text-xs text-center text-muted-foreground">
            Ingredient Co-Pilot provides general information. Consult healthcare professionals for medical advice.
          </p>
        </div>
      </div>
    </div>
  );
}
