import { motion } from 'framer-motion';
import { Award, Zap, Shield, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NutritionScoreCardProps {
  breakdown: { category: string; score: number; label: string }[];
  overallScore: number;
}

export function NutritionScoreCard({ breakdown, overallScore }: NutritionScoreCardProps) {
  const getGradeColor = (label: string) => {
    if (label.startsWith('A')) return 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30';
    if (label.startsWith('B')) return 'text-blue-400 bg-blue-500/20 border-blue-500/30';
    if (label.startsWith('C')) return 'text-amber-400 bg-amber-500/20 border-amber-500/30';
    return 'text-red-400 bg-red-500/20 border-red-500/30';
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'stroke-emerald-500';
    if (score >= 6) return 'stroke-blue-500';
    if (score >= 4) return 'stroke-amber-500';
    return 'stroke-red-500';
  };

  const overallGrade = 
    overallScore >= 9 ? 'A+' :
    overallScore >= 8 ? 'A' :
    overallScore >= 7 ? 'B+' :
    overallScore >= 6 ? 'B' :
    overallScore >= 5 ? 'C' :
    overallScore >= 4 ? 'D' : 'F';

  const circumference = 2 * Math.PI * 45;
  const progress = (overallScore / 10) * circumference;

  return (
    <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-6 h-full">
      <div className="flex items-center gap-2 mb-6">
        <Award className="w-5 h-5 text-amber-400" />
        <h3 className="text-lg font-semibold text-white">Nutrition Score</h3>
      </div>

      {/* Main Score Ring */}
      <div className="flex justify-center mb-6">
        <div className="relative w-32 h-32">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="64"
              cy="64"
              r="45"
              stroke="#334155"
              strokeWidth="8"
              fill="none"
            />
            <motion.circle
              cx="64"
              cy="64"
              r="45"
              stroke="url(#scoreGradient)"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: circumference - progress }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
            <defs>
              <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="50%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold text-white">{overallGrade}</span>
            <span className="text-slate-400 text-xs">Overall</span>
          </div>
        </div>
      </div>

      {/* Breakdown */}
      <div className="space-y-3">
        {breakdown.map((item, index) => (
          <motion.div
            key={item.category}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 * index }}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center">
                {index === 0 && <Zap className="w-4 h-4 text-amber-400" />}
                {index === 1 && <Shield className="w-4 h-4 text-blue-400" />}
                {index === 2 && <Award className="w-4 h-4 text-purple-400" />}
                {index === 3 && <Heart className="w-4 h-4 text-rose-400" />}
              </div>
              <span className="text-slate-300 text-sm">{item.category}</span>
            </div>
            <div className="flex items-center gap-2">
              {/* Mini progress bar */}
              <div className="w-16 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${item.score * 10}%` }}
                  transition={{ duration: 0.8, delay: 0.2 * index }}
                  className={cn(
                    "h-full rounded-full",
                    item.score >= 8 ? "bg-emerald-500" :
                    item.score >= 6 ? "bg-blue-500" :
                    item.score >= 4 ? "bg-amber-500" : "bg-red-500"
                  )}
                />
              </div>
              <span className={cn(
                "px-2 py-0.5 rounded text-xs font-semibold border",
                getGradeColor(item.label)
              )}>
                {item.label}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Medical Badge */}
      <div className="mt-6 p-3 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border border-emerald-500/20 rounded-xl">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center animate-pulse">
            <Heart className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <p className="text-emerald-400 text-sm font-medium">Health Tracking Active</p>
            <p className="text-slate-500 text-xs">Personalized to your profile</p>
          </div>
        </div>
      </div>
    </div>
  );
}
