import { Leaf } from 'lucide-react';
import { motion } from 'framer-motion';

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="max-w-2xl mx-auto px-4 h-16 flex items-center justify-between">
        <motion.div
          className="flex items-center gap-3"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="w-10 h-10 rounded-xl gradient-hero flex items-center justify-center shadow-glow">
            <Leaf className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-display font-bold text-lg text-foreground leading-tight">
              Ingredient Co-Pilot
            </h1>
            <p className="text-xs text-muted-foreground">AI-powered food analysis</p>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2"
        >
          <span className="px-2 py-1 text-xs rounded-full bg-success/20 text-success font-medium">
            ENCODE Hackathon
          </span>
        </motion.div>
      </div>
    </header>
  );
}
