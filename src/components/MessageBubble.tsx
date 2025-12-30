import { motion } from 'framer-motion';
import { User, Bot, Heart, Sparkles, Shield, AlertTriangle } from 'lucide-react';
import type { Message } from '@/types';
import { cn } from '@/lib/utils';
import { InsightCard } from './InsightCard';
import { HealthScoreCard } from './HealthScoreCard';
import { ThinkingIndicator } from './LoadingSpinner';

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';
  const hasHealthData = message.healthScore !== undefined;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'flex gap-3 w-full',
        isUser ? 'flex-row-reverse' : 'flex-row'
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          'w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0',
          isUser ? 'gradient-hero' : 'bg-secondary'
        )}
      >
        {isUser ? (
          <User className="w-4 h-4 text-primary-foreground" />
        ) : (
          <Bot className="w-4 h-4 text-primary" />
        )}
      </div>

      {/* Content */}
      <div
        className={cn(
          'flex-1 max-w-[85%] space-y-3',
          isUser ? 'items-end' : 'items-start'
        )}
      >
        {/* Image preview if present */}
        {message.imageUrl && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={cn(
              'rounded-xl overflow-hidden shadow-soft border border-border max-w-xs',
              isUser ? 'ml-auto' : 'mr-auto'
            )}
          >
            <img
              src={message.imageUrl}
              alt="Uploaded food label"
              className="w-full h-auto max-h-48 object-cover"
            />
          </motion.div>
        )}

        {/* Text content */}
        {message.content && (
          <div
            className={cn(
              'rounded-2xl px-4 py-3 text-sm leading-relaxed',
              isUser
                ? 'bg-chat-user text-primary-foreground ml-auto'
                : 'bg-chat-ai text-foreground border border-border shadow-soft'
            )}
          >
            {message.content}
          </div>
        )}

        {/* Loading state */}
        {message.isLoading && (
          <div className="bg-chat-ai text-foreground border border-border shadow-soft rounded-2xl px-4 py-3">
            <ThinkingIndicator />
          </div>
        )}

        {/* Health Score Card - New medical feature */}
        {hasHealthData && (
          <HealthScoreCard
            score={message.healthScore!}
            summary={message.content}
            concerns={message.concerns || []}
            recommendations={message.recommendations || []}
            allergenAlerts={message.allergenAlerts || []}
            drugInteractions={message.drugInteractions || []}
          />
        )}

        {/* Insights */}
        {message.insights && message.insights.length > 0 && (
          <div className="space-y-3 w-full">
            {message.insights.map((insight, index) => (
              <InsightCard key={insight.name} insight={insight} index={index} />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

export function WelcomeMessage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="flex flex-col items-center text-center py-12 px-4 space-y-6"
    >
      <motion.div
        className="w-20 h-20 rounded-3xl gradient-hero flex items-center justify-center shadow-glow"
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Bot className="w-10 h-10 text-primary-foreground" />
      </motion.div>
      
      <div className="space-y-2 max-w-md">
        <h2 className="text-2xl font-display font-bold text-foreground">
          Welcome to Ingredient Co-Pilot
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          Upload a food label photo or ask me about any product. I'll analyze ingredients and explain what they mean for your health.
        </p>
      </div>

      {/* Feature highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-lg w-full">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-4 rounded-xl glass-card text-center"
        >
          <Heart className="w-6 h-6 text-destructive mx-auto mb-2" />
          <span className="text-xs font-medium text-foreground">Health Score</span>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="p-4 rounded-xl glass-card text-center"
        >
          <AlertTriangle className="w-6 h-6 text-warning mx-auto mb-2" />
          <span className="text-xs font-medium text-foreground">Allergen Alerts</span>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="p-4 rounded-xl glass-card text-center"
        >
          <Shield className="w-6 h-6 text-primary mx-auto mb-2" />
          <span className="text-xs font-medium text-foreground">Drug Interactions</span>
        </motion.div>
      </div>

      <div className="flex flex-wrap justify-center gap-2 max-w-sm">
        {['Is this safe for diabetics?', 'What about allergies?', 'Is this vegan?'].map((suggestion, i) => (
          <motion.span
            key={suggestion}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 + i * 0.1 }}
            className="px-3 py-1.5 text-xs rounded-full bg-secondary text-secondary-foreground border border-border"
          >
            {suggestion}
          </motion.span>
        ))}
      </div>
    </motion.div>
  );
}
