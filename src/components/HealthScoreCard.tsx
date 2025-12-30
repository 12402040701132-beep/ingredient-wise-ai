import { motion } from 'framer-motion';
import { Activity, Shield, AlertTriangle, Heart, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HealthScoreCardProps {
  score: number;
  summary: string;
  concerns: string[];
  recommendations: string[];
  allergenAlerts: string[];
  drugInteractions: string[];
}

export function HealthScoreCard({
  score,
  summary,
  concerns,
  recommendations,
  allergenAlerts,
  drugInteractions,
}: HealthScoreCardProps) {
  const getScoreColor = (s: number) => {
    if (s >= 8) return 'text-success';
    if (s >= 6) return 'text-primary';
    if (s >= 4) return 'text-warning';
    return 'text-destructive';
  };

  const getScoreBg = (s: number) => {
    if (s >= 8) return 'bg-success/20';
    if (s >= 6) return 'bg-primary/20';
    if (s >= 4) return 'bg-warning/20';
    return 'bg-destructive/20';
  };

  const getScoreLabel = (s: number) => {
    if (s >= 8) return 'Excellent';
    if (s >= 6) return 'Good';
    if (s >= 4) return 'Moderate';
    return 'Poor';
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card rounded-2xl p-5 space-y-4"
    >
      {/* Health Score */}
      <div className="flex items-center gap-4">
        <div className={cn("relative w-20 h-20 rounded-2xl flex items-center justify-center", getScoreBg(score))}>
          <span className={cn("text-3xl font-bold font-display", getScoreColor(score))}>{score}</span>
          <span className="absolute -bottom-1 -right-1 text-xs text-muted-foreground">/10</span>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Activity className={cn("w-5 h-5", getScoreColor(score))} />
            <span className={cn("font-semibold", getScoreColor(score))}>{getScoreLabel(score)}</span>
          </div>
          <p className="text-sm text-foreground">{summary}</p>
        </div>
      </div>

      {/* Allergen Alerts */}
      {allergenAlerts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="p-4 rounded-xl bg-destructive/10 border border-destructive/20"
        >
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-destructive" />
            <span className="font-semibold text-destructive">Allergen Alert</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {allergenAlerts.map((alert, i) => (
              <span key={i} className="px-3 py-1 rounded-full bg-destructive/20 text-destructive text-sm font-medium">
                {alert}
              </span>
            ))}
          </div>
        </motion.div>
      )}

      {/* Drug Interactions */}
      {drugInteractions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="p-4 rounded-xl bg-warning/10 border border-warning/20"
        >
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-5 h-5 text-warning" />
            <span className="font-semibold text-warning">Potential Drug Interactions</span>
          </div>
          <ul className="space-y-1">
            {drugInteractions.map((interaction, i) => (
              <li key={i} className="text-sm text-foreground flex items-start gap-2">
                <span className="text-warning mt-1">•</span>
                {interaction}
              </li>
            ))}
          </ul>
        </motion.div>
      )}

      {/* Health Concerns */}
      {concerns.length > 0 && (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 }}
          className="p-4 rounded-xl bg-primary/5 border border-primary/10"
        >
          <div className="flex items-center gap-2 mb-2">
            <Heart className="w-5 h-5 text-primary" />
            <span className="font-semibold text-primary">Based on Your Health Profile</span>
          </div>
          <ul className="space-y-1">
            {concerns.map((concern, i) => (
              <li key={i} className="text-sm text-foreground flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                {concern}
              </li>
            ))}
          </ul>
        </motion.div>
      )}

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="p-4 rounded-xl bg-success/5 border border-success/10"
        >
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-success" />
            <span className="font-semibold text-success">Recommendations</span>
          </div>
          <ul className="space-y-1">
            {recommendations.map((rec, i) => (
              <li key={i} className="text-sm text-foreground flex items-start gap-2">
                <span className="text-success mt-1">✓</span>
                {rec}
              </li>
            ))}
          </ul>
        </motion.div>
      )}
    </motion.div>
  );
}
