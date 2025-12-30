import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { 
  Activity, TrendingUp, Shield, AlertTriangle, Heart, 
  Sparkles, ArrowLeft, RefreshCw, Zap, Target, Award,
  AlertCircle, CheckCircle, Clock, ChevronRight
} from 'lucide-react';
import { Header } from '@/components/Header';
import { useAuth } from '@/hooks/useAuth';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';
import { RiskTrendChart } from '@/components/dashboard/RiskTrendChart';
import { NutritionScoreCard } from '@/components/dashboard/NutritionScoreCard';
import { RecoFeed } from '@/components/dashboard/RecoFeed';
import { EmergencyAlerts } from '@/components/dashboard/EmergencyAlerts';
import type { AnalysisResult } from '@/types';

interface DashboardStats {
  totalScans: number;
  avgHealthScore: number;
  riskProducts: number;
  safeProducts: number;
  topConcern: string;
  topConcernPercentage: number;
  weeklyTrend: { day: string; risk: number; safe: number }[];
  recentAlerts: { ingredient: string; count: number; severity: 'high' | 'medium' | 'low' }[];
  recommendations: { title: string; description: string; match: number }[];
  nutritionBreakdown: { category: string; score: number; label: string }[];
}

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [healthConcerns, setHealthConcerns] = useState<string[]>([]);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    try {
      // Load health concerns
      const { data: profile } = await supabase
        .from('profiles')
        .select('health_concerns')
        .eq('user_id', user!.id)
        .single();

      if (profile?.health_concerns) {
        setHealthConcerns(profile.health_concerns);
      }

      // Load analysis history
      const { data: history } = await supabase
        .from('analysis_history')
        .select('*')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false });

      // Process stats from history
      const processedStats = processHistoryData(history || [], profile?.health_concerns || []);
      setStats(processedStats);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const processHistoryData = (history: any[], concerns: string[]): DashboardStats => {
    const analyses = history.map(h => h.analysis_result as AnalysisResult | null).filter(Boolean);
    
    // Calculate totals
    const totalScans = analyses.length || 0;
    const avgHealthScore = totalScans > 0 
      ? Math.round(analyses.reduce((sum, a) => sum + (a?.healthScore || 5), 0) / totalScans)
      : 0;
    const riskProducts = analyses.filter(a => (a?.healthScore || 5) < 5).length;
    const safeProducts = analyses.filter(a => (a?.healthScore || 5) >= 7).length;

    // Find top concern ingredient
    const ingredientCounts: Record<string, number> = {};
    analyses.forEach(a => {
      a?.insights?.forEach(insight => {
        if (insight.healthImpact === 'concern' || insight.healthImpact === 'warning') {
          ingredientCounts[insight.name] = (ingredientCounts[insight.name] || 0) + 1;
        }
      });
    });
    
    const sortedIngredients = Object.entries(ingredientCounts).sort((a, b) => b[1] - a[1]);
    const topConcern = sortedIngredients[0]?.[0] || 'None detected';
    const topConcernPercentage = totalScans > 0 
      ? Math.round((sortedIngredients[0]?.[1] || 0) / totalScans * 100)
      : 0;

    // Weekly trend (mock for demo - would use real dates in production)
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const weeklyTrend = days.map((day, i) => ({
      day,
      risk: Math.max(0, Math.floor(Math.random() * 3) + (i < 3 ? 2 : 0)),
      safe: Math.floor(Math.random() * 4) + (i > 3 ? 2 : 1),
    }));

    // Recent alerts
    const recentAlerts = sortedIngredients.slice(0, 4).map(([ingredient, count]) => ({
      ingredient,
      count,
      severity: count >= 3 ? 'high' : count >= 2 ? 'medium' : 'low' as 'high' | 'medium' | 'low',
    }));

    // Personalized recommendations based on concerns
    const recommendations = generateRecommendations(concerns, analyses);

    // Nutrition breakdown
    const nutritionBreakdown = [
      { category: 'Sugar Control', score: Math.min(10, Math.max(1, 10 - riskProducts)), label: getGrade(10 - riskProducts) },
      { category: 'Allergen Safety', score: Math.min(10, Math.max(1, 8)), label: getGrade(8) },
      { category: 'Additive Score', score: Math.min(10, Math.max(1, avgHealthScore)), label: getGrade(avgHealthScore) },
      { category: 'Overall Health', score: avgHealthScore || 5, label: getGrade(avgHealthScore || 5) },
    ];

    return {
      totalScans,
      avgHealthScore,
      riskProducts,
      safeProducts,
      topConcern,
      topConcernPercentage,
      weeklyTrend,
      recentAlerts,
      recommendations,
      nutritionBreakdown,
    };
  };

  const getGrade = (score: number): string => {
    if (score >= 9) return 'A+';
    if (score >= 8) return 'A';
    if (score >= 7) return 'B+';
    if (score >= 6) return 'B';
    if (score >= 5) return 'C';
    if (score >= 4) return 'D';
    return 'F';
  };

  const generateRecommendations = (concerns: string[], analyses: (AnalysisResult | null)[]): { title: string; description: string; match: number }[] => {
    const recs = [];
    
    if (concerns.includes('diabetic')) {
      recs.push({
        title: 'Low-GI Alternatives',
        description: 'Switch to whole grain options for better blood sugar control',
        match: 94,
      });
    }
    if (concerns.includes('vegan')) {
      recs.push({
        title: 'Plant-Based Protein',
        description: 'Try legume-based products for complete nutrition',
        match: 89,
      });
    }
    if (concerns.includes('allergies')) {
      recs.push({
        title: 'Allergen-Free Options',
        description: 'Consider products with clean ingredient lists',
        match: 91,
      });
    }
    if (concerns.includes('heart-health')) {
      recs.push({
        title: 'Heart-Healthy Choices',
        description: 'Opt for products with omega-3s and low sodium',
        match: 87,
      });
    }
    
    // Default recommendations
    if (recs.length === 0) {
      recs.push(
        { title: 'Whole Food Focus', description: 'Choose products with fewer processed ingredients', match: 85 },
        { title: 'Label Reading', description: 'Check for hidden sugars and additives', match: 82 },
      );
    }
    
    return recs.slice(0, 3);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <LoadingSpinner />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <>
      <Helmet>
        <title>Health Dashboard | Ingredient Co-Pilot</title>
        <meta name="description" content="Your personal health command center for food decisions" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <Header />
        
        <main className="container mx-auto px-4 py-6 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => navigate('/')}
                  className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all"
                >
                  <ArrowLeft className="w-5 h-5 text-white" />
                </button>
                <div>
                  <h1 className="text-2xl md:text-3xl font-display font-bold text-white">
                    Health Dashboard
                  </h1>
                  <p className="text-slate-400 text-sm">Your personal food health command center</p>
                </div>
              </div>
              <button
                onClick={loadDashboardData}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30 transition-all"
              >
                <RefreshCw className="w-4 h-4" />
                <span className="hidden sm:inline">Refresh</span>
              </button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 border border-blue-500/20 rounded-2xl p-4"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                    <Activity className="w-5 h-5 text-blue-400" />
                  </div>
                  <span className="text-3xl font-bold text-white">{stats?.totalScans || 0}</span>
                </div>
                <p className="text-slate-400 text-sm">Total Scans</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 border border-emerald-500/20 rounded-2xl p-4"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                    <Heart className="w-5 h-5 text-emerald-400" />
                  </div>
                  <span className="text-3xl font-bold text-white">{stats?.avgHealthScore || 0}</span>
                </div>
                <p className="text-slate-400 text-sm">Avg Health Score</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/20 rounded-2xl p-4"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-amber-400" />
                  </div>
                  <span className="text-3xl font-bold text-white">{stats?.riskProducts || 0}</span>
                </div>
                <p className="text-slate-400 text-sm">Risk Products</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="bg-gradient-to-br from-green-500/20 to-green-600/10 border border-green-500/20 rounded-2xl p-4"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  </div>
                  <span className="text-3xl font-bold text-white">{stats?.safeProducts || 0}</span>
                </div>
                <p className="text-slate-400 text-sm">Safe Products</p>
              </motion.div>
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Risk Trends */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="lg:col-span-2"
              >
                <RiskTrendChart 
                  data={stats?.weeklyTrend || []}
                  topConcern={stats?.topConcern || 'None'}
                  topConcernPercentage={stats?.topConcernPercentage || 0}
                />
              </motion.div>

              {/* Right Column - Nutrition Score */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35 }}
              >
                <NutritionScoreCard 
                  breakdown={stats?.nutritionBreakdown || []}
                  overallScore={stats?.avgHealthScore || 0}
                />
              </motion.div>
            </div>

            {/* Bottom Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Emergency Alerts */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <EmergencyAlerts 
                  alerts={stats?.recentAlerts || []}
                  totalScans={stats?.totalScans || 0}
                />
              </motion.div>

              {/* Recommendations */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}
              >
                <RecoFeed 
                  recommendations={stats?.recommendations || []}
                  healthConcerns={healthConcerns}
                />
              </motion.div>
            </div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-gradient-to-r from-emerald-500/20 via-blue-500/20 to-purple-500/20 border border-white/10 rounded-2xl p-6 text-center"
            >
              <Sparkles className="w-8 h-8 text-emerald-400 mx-auto mb-3" />
              <h3 className="text-xl font-semibold text-white mb-2">Ready to improve your health score?</h3>
              <p className="text-slate-400 mb-4">Scan more products to get personalized insights and track your progress</p>
              <button
                onClick={() => navigate('/')}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-blue-500 text-white font-semibold hover:shadow-lg hover:shadow-emerald-500/25 transition-all"
              >
                Start New Scan
              </button>
            </motion.div>
          </motion.div>
        </main>
      </div>
    </>
  );
}
