import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle2, AlertTriangle, Info, HelpCircle, ArrowRight } from 'lucide-react';
import type { IngredientInsight } from '@/types';
import { cn } from '@/lib/utils';

interface InsightCardProps {
  insight: IngredientInsight;
  index: number;
}

const impactStyles = {
  positive: {
    bg: 'bg-success/10',
    border: 'border-success/30',
    icon: CheckCircle2,
    iconColor: 'text-success',
    badge: 'bg-success/20 text-success',
  },
  neutral: {
    bg: 'bg-secondary',
    border: 'border-border',
    icon: Info,
    iconColor: 'text-muted-foreground',
    badge: 'bg-muted text-muted-foreground',
  },
  concern: {
    bg: 'bg-warning/10',
    border: 'border-warning/30',
    icon: AlertTriangle,
    iconColor: 'text-warning',
    badge: 'bg-warning/20 text-warning-foreground',
  },
  warning: {
    bg: 'bg-destructive/10',
    border: 'border-destructive/30',
    icon: AlertCircle,
    iconColor: 'text-destructive',
    badge: 'bg-destructive/20 text-destructive',
  },
};

const confidenceLabels = {
  low: { text: 'Limited data', icon: HelpCircle },
  medium: { text: 'Moderate certainty', icon: Info },
  high: { text: 'Well documented', icon: CheckCircle2 },
};

export function InsightCard({ insight, index }: InsightCardProps) {
  const style = impactStyles[insight.healthImpact];
  const Icon = style.icon;
  const ConfidenceIcon = confidenceLabels[insight.confidence].icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      className={cn(
        'rounded-xl border p-4 space-y-3 transition-all hover:shadow-soft',
        style.bg,
        style.border
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <Icon className={cn('w-5 h-5 flex-shrink-0', style.iconColor)} />
          <h4 className="font-semibold text-foreground">{insight.name}</h4>
        </div>
        <div className={cn('flex items-center gap-1 px-2 py-0.5 rounded-full text-xs', style.badge)}>
          <ConfidenceIcon className="w-3 h-3" />
          {confidenceLabels[insight.confidence].text}
        </div>
      </div>

      {/* Explanation */}
      <p className="text-sm text-muted-foreground leading-relaxed">
        {insight.explanation}
      </p>

      {/* Health Impacts */}
      <div className="space-y-1.5">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Health Impacts
        </span>
        <ul className="space-y-1">
          {insight.impacts.map((impact, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-foreground">
              <ArrowRight className="w-3 h-3 mt-1 flex-shrink-0 text-primary" />
              {impact}
            </li>
          ))}
        </ul>
      </div>

      {/* Tradeoffs */}
      {insight.tradeoffs && (
        <div className="pt-2 border-t border-border/50">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Tradeoffs
          </span>
          <p className="mt-1 text-sm text-foreground/80 italic">
            "{insight.tradeoffs}"
          </p>
        </div>
      )}

      {/* Alternatives */}
      {insight.alternatives && insight.alternatives.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-2">
          <span className="text-xs text-muted-foreground mr-1">Alternatives:</span>
          {insight.alternatives.map((alt, i) => (
            <span
              key={i}
              className="px-2 py-0.5 text-xs rounded-full bg-primary/10 text-primary"
            >
              {alt}
            </span>
          ))}
        </div>
      )}
    </motion.div>
  );
}

export function InsightsSummary({ summary, concerns }: { summary: string; concerns: string[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl p-4 border border-primary/20"
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full gradient-hero flex items-center justify-center flex-shrink-0">
          <CheckCircle2 className="w-5 h-5 text-primary-foreground" />
        </div>
        <div className="space-y-2">
          <h3 className="font-semibold text-foreground">Summary</h3>
          <p className="text-sm text-foreground/80 leading-relaxed">{summary}</p>
          {concerns.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              <span className="text-xs text-muted-foreground">Detected concerns:</span>
              {concerns.map((concern, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 text-xs rounded-full bg-primary/20 text-primary font-medium capitalize"
                >
                  {concern}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
