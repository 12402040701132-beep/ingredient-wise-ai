import { motion } from 'framer-motion';
import { Sparkles, ChevronRight, Target, Star, Leaf, Heart, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RecoFeedProps {
  recommendations: { title: string; description: string; match: number }[];
  healthConcerns: string[];
}

export function RecoFeed({ recommendations, healthConcerns }: RecoFeedProps) {
  const getIcon = (index: number) => {
    const icons = [
      <Target className="w-5 h-5 text-blue-400" />,
      <Leaf className="w-5 h-5 text-emerald-400" />,
      <Heart className="w-5 h-5 text-rose-400" />,
      <Shield className="w-5 h-5 text-purple-400" />,
    ];
    return icons[index % icons.length];
  };

  return (
    <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-6 h-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-400" />
          <h3 className="text-lg font-semibold text-white">For You</h3>
        </div>
        {healthConcerns.length > 0 && (
          <div className="flex gap-1">
            {healthConcerns.slice(0, 2).map(concern => (
              <span 
                key={concern}
                className="px-2 py-1 rounded-full bg-purple-500/20 text-purple-400 text-xs font-medium border border-purple-500/30"
              >
                {concern}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Recommendations */}
      <div className="space-y-3">
        {recommendations.map((rec, index) => (
          <motion.div
            key={rec.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
            className="group p-4 bg-slate-800/50 hover:bg-slate-800 rounded-xl border border-white/5 hover:border-white/10 transition-all cursor-pointer"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center flex-shrink-0">
                {getIcon(index)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-white font-medium truncate">{rec.title}</h4>
                  <div className="flex items-center gap-1 text-emerald-400">
                    <Star className="w-3 h-3 fill-emerald-400" />
                    <span className="text-xs font-semibold">{rec.match}%</span>
                  </div>
                </div>
                <p className="text-slate-400 text-sm line-clamp-2">{rec.description}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-slate-400 transition-colors flex-shrink-0" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {recommendations.length === 0 && (
        <div className="text-center py-8">
          <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-slate-600" />
          </div>
          <p className="text-slate-400">Scan more products to get personalized recommendations</p>
        </div>
      )}

      {/* Profile CTA */}
      {healthConcerns.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-4 p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
              <Target className="w-5 h-5 text-blue-400" />
            </div>
            <div className="flex-1">
              <p className="text-white text-sm font-medium">Set up your health profile</p>
              <p className="text-slate-400 text-xs">Get personalized recommendations</p>
            </div>
            <ChevronRight className="w-5 h-5 text-blue-400" />
          </div>
        </motion.div>
      )}
    </div>
  );
}
