import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, Search, Trash2, Clock, ChevronRight, Activity } from 'lucide-react';
import { Header } from '@/components/Header';
import { useAuth } from '@/hooks/useAuth';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import type { AnalysisResult } from '@/types';

interface HistoryItem {
  id: string;
  created_at: string;
  product_name: string | null;
  query: string | null;
  analysis_result: unknown;
}

export default function History() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      loadHistory();
    }
  }, [user]);

  const loadHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('analysis_history')
        .select('*')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setHistory(data || []);
    } catch (error) {
      console.error('Error loading history:', error);
      toast.error('Failed to load history');
    } finally {
      setLoading(false);
    }
  };

  const deleteHistoryItem = async (id: string) => {
    try {
      const { error } = await supabase
        .from('analysis_history')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setHistory(prev => prev.filter(item => item.id !== id));
      toast.success('Entry deleted');
    } catch (error) {
      console.error('Error deleting entry:', error);
      toast.error('Failed to delete entry');
    }
  };

  const filteredHistory = history.filter(item => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      item.product_name?.toLowerCase().includes(query) ||
      item.query?.toLowerCase().includes(query)
    );
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getScoreColor = (score: number | undefined) => {
    if (!score) return 'text-muted-foreground bg-secondary';
    if (score >= 8) return 'text-success bg-success/20';
    if (score >= 6) return 'text-primary bg-primary/20';
    if (score >= 4) return 'text-warning bg-warning/20';
    return 'text-destructive bg-destructive/20';
  };

  const getAnalysisResult = (item: HistoryItem) => {
    return item.analysis_result as AnalysisResult | null;
  };
    if (score >= 8) return 'text-success bg-success/20';
    if (score >= 6) return 'text-primary bg-primary/20';
    if (score >= 4) return 'text-warning bg-warning/20';
    return 'text-destructive bg-destructive/20';
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background animated-bg">
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
        <title>Analysis History | Ingredient Co-Pilot</title>
        <meta name="description" content="View your past ingredient analyses" />
      </Helmet>

      <div className="min-h-screen bg-background animated-bg">
        <Header />
        
        <main className="container mx-auto px-4 py-8 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Header */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/')}
                className="w-10 h-10 rounded-xl glass-card flex items-center justify-center hover:shadow-soft transition-all"
              >
                <ArrowLeft className="w-5 h-5 text-foreground" />
              </button>
              <div className="flex-1">
                <h1 className="text-3xl font-display font-bold text-foreground">Analysis History</h1>
                <p className="text-muted-foreground">{history.length} analyses saved</p>
              </div>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search your history..."
                className="w-full pl-12 pr-4 py-3 rounded-xl glass-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>

            {/* History List */}
            {filteredHistory.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <Clock className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {searchQuery ? 'No matches found' : 'No history yet'}
                </h3>
                <p className="text-muted-foreground">
                  {searchQuery 
                    ? 'Try a different search term' 
                    : 'Start analyzing food products to build your history'}
                </p>
              </motion.div>
            ) : (
              <div className="space-y-3">
                {filteredHistory.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="glass-card rounded-2xl p-4 hover:shadow-soft transition-all group"
                  >
                    <div className="flex items-start gap-4">
                      {/* Health Score */}
                      {getAnalysisResult(item)?.healthScore && (
                        <div className={cn(
                          "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0",
                          getScoreColor(getAnalysisResult(item)?.healthScore)
                        )}>
                          <span className="text-lg font-bold">{getAnalysisResult(item)?.healthScore}</span>
                        </div>
                      )}
                      
                      {!getAnalysisResult(item)?.healthScore && (
                        <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0">
                          <Activity className="w-5 h-5 text-muted-foreground" />
                        </div>
                      )}

                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground truncate">
                          {item.product_name || item.query || 'Unknown Product'}
                        </h3>
                        <p className="text-sm text-muted-foreground truncate mb-2">
                          {getAnalysisResult(item)?.summary || item.query}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          {formatDate(item.created_at)}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteHistoryItem(item.id);
                          }}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <ChevronRight className="w-5 h-5 text-muted-foreground" />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </main>
      </div>
    </>
  );
}
