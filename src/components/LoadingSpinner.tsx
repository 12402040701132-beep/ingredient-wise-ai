import { motion } from 'framer-motion';
import { Leaf, Sparkles } from 'lucide-react';

export function LoadingSpinner({ message = 'Analyzing...' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-8">
      <motion.div
        className="relative"
        animate={{ rotate: 360 }}
        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
      >
        <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary" />
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <Leaf className="w-5 h-5 text-primary" />
        </motion.div>
      </motion.div>
      <motion.p
        className="text-sm text-muted-foreground"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        {message}
      </motion.p>
    </div>
  );
}

export function ThinkingIndicator() {
  return (
    <div className="flex items-center gap-2 text-muted-foreground">
      <Sparkles className="w-4 h-4 text-primary animate-pulse" />
      <span className="text-sm">Thinking</span>
      <motion.span
        className="flex gap-1"
        initial="hidden"
        animate="visible"
      >
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-primary"
            animate={{ y: [0, -4, 0] }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              delay: i * 0.15,
            }}
          />
        ))}
      </motion.span>
    </div>
  );
}

export function SkeletonInsight() {
  return (
    <div className="space-y-3 p-4 bg-card rounded-xl animate-pulse">
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 rounded-full bg-muted" />
        <div className="h-4 w-32 bg-muted rounded" />
      </div>
      <div className="space-y-2">
        <div className="h-3 w-full bg-muted rounded" />
        <div className="h-3 w-3/4 bg-muted rounded" />
        <div className="h-3 w-1/2 bg-muted rounded" />
      </div>
    </div>
  );
}
