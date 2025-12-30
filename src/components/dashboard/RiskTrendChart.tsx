import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, AlertTriangle, Target } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { cn } from '@/lib/utils';

interface RiskTrendChartProps {
  data: { day: string; risk: number; safe: number }[];
  topConcern: string;
  topConcernPercentage: number;
}

export function RiskTrendChart({ data, topConcern, topConcernPercentage }: RiskTrendChartProps) {
  const totalRisk = data.reduce((sum, d) => sum + d.risk, 0);
  const totalSafe = data.reduce((sum, d) => sum + d.safe, 0);
  const total = totalRisk + totalSafe;
  const riskPercentage = total > 0 ? Math.round((totalRisk / total) * 100) : 0;
  
  return (
    <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-6 h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-400" />
            Health Risk Trends
          </h3>
          <p className="text-slate-400 text-sm">Weekly analysis breakdown</p>
        </div>
        <div className={cn(
          "px-3 py-1.5 rounded-full text-sm font-medium",
          riskPercentage > 50 ? "bg-red-500/20 text-red-400" : "bg-emerald-500/20 text-emerald-400"
        )}>
          {riskPercentage > 50 ? <TrendingDown className="w-4 h-4 inline mr-1" /> : <TrendingUp className="w-4 h-4 inline mr-1" />}
          {riskPercentage}% risk ratio
        </div>
      </div>

      {/* Chart */}
      <div className="h-48 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
            <XAxis 
              dataKey="day" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94a3b8', fontSize: 12 }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94a3b8', fontSize: 12 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1e293b',
                border: '1px solid #334155',
                borderRadius: '12px',
                color: '#f8fafc',
              }}
            />
            <Bar dataKey="safe" fill="#10b981" radius={[4, 4, 0, 0]} name="Safe Products" />
            <Bar dataKey="risk" fill="#ef4444" radius={[4, 4, 0, 0]} name="Risk Products" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Top Concern Meter */}
      <div className="bg-slate-800/50 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <span className="text-white font-medium">Top Concern</span>
          </div>
          <span className="text-amber-400 font-semibold">{topConcern}</span>
        </div>
        
        {/* Risk Meter */}
        <div className="relative h-3 bg-slate-700 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${topConcernPercentage}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className={cn(
              "absolute h-full rounded-full",
              topConcernPercentage >= 70 ? "bg-gradient-to-r from-red-500 to-red-400" :
              topConcernPercentage >= 40 ? "bg-gradient-to-r from-amber-500 to-amber-400" :
              "bg-gradient-to-r from-emerald-500 to-emerald-400"
            )}
          />
        </div>
        <p className="text-slate-400 text-sm mt-2">
          Appears in {topConcernPercentage}% of your scanned products
        </p>
      </div>
    </div>
  );
}
