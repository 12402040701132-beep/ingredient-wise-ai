import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { 
  User, Heart, Shield, Leaf, AlertTriangle, Wheat, 
  Apple, Pill, Activity, Save, ArrowLeft, Check, Sparkles,
  Baby, Droplets, Scale, Brain
} from 'lucide-react';
import { Header } from '@/components/Header';
import { useAuth } from '@/hooks/useAuth';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface HealthConcern {
  id: string;
  label: string;
  icon: React.ReactNode;
  description: string;
  category: 'dietary' | 'medical' | 'lifestyle';
}

const healthConcerns: HealthConcern[] = [
  // Dietary
  { id: 'vegan', label: 'Vegan', icon: <Leaf className="w-5 h-5" />, description: 'No animal products', category: 'dietary' },
  { id: 'vegetarian', label: 'Vegetarian', icon: <Apple className="w-5 h-5" />, description: 'No meat or fish', category: 'dietary' },
  { id: 'gluten-free', label: 'Gluten-Free', icon: <Wheat className="w-5 h-5" />, description: 'Celiac or gluten sensitivity', category: 'dietary' },
  { id: 'lactose-free', label: 'Lactose-Free', icon: <Droplets className="w-5 h-5" />, description: 'Dairy intolerance', category: 'dietary' },
  { id: 'keto', label: 'Keto', icon: <Scale className="w-5 h-5" />, description: 'Low carb, high fat diet', category: 'dietary' },
  
  // Medical
  { id: 'diabetic', label: 'Diabetic', icon: <Activity className="w-5 h-5" />, description: 'Blood sugar management', category: 'medical' },
  { id: 'heart-health', label: 'Heart Health', icon: <Heart className="w-5 h-5" />, description: 'Cholesterol & blood pressure', category: 'medical' },
  { id: 'allergies', label: 'Food Allergies', icon: <AlertTriangle className="w-5 h-5" />, description: 'Nuts, shellfish, etc.', category: 'medical' },
  { id: 'pregnancy', label: 'Pregnancy', icon: <Baby className="w-5 h-5" />, description: 'Safe foods for pregnancy', category: 'medical' },
  { id: 'medications', label: 'On Medications', icon: <Pill className="w-5 h-5" />, description: 'Drug-food interactions', category: 'medical' },
  
  // Lifestyle
  { id: 'weight-loss', label: 'Weight Loss', icon: <Scale className="w-5 h-5" />, description: 'Calorie conscious', category: 'lifestyle' },
  { id: 'muscle-building', label: 'Muscle Building', icon: <Shield className="w-5 h-5" />, description: 'High protein focus', category: 'lifestyle' },
  { id: 'mental-wellness', label: 'Mental Wellness', icon: <Brain className="w-5 h-5" />, description: 'Mood & cognitive health', category: 'lifestyle' },
];

const categoryLabels = {
  dietary: { label: 'Dietary Preferences', icon: <Leaf className="w-5 h-5" /> },
  medical: { label: 'Medical Conditions', icon: <Heart className="w-5 h-5" /> },
  lifestyle: { label: 'Lifestyle Goals', icon: <Activity className="w-5 h-5" /> },
};

export default function Profile() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState('');
  const [selectedConcerns, setSelectedConcerns] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('display_name, health_concerns')
        .eq('user_id', user!.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        setDisplayName(data.display_name || '');
        setSelectedConcerns(data.health_concerns || []);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleConcern = (concernId: string) => {
    setSelectedConcerns(prev => 
      prev.includes(concernId) 
        ? prev.filter(c => c !== concernId)
        : [...prev, concernId]
    );
  };

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          display_name: displayName,
          health_concerns: selectedConcerns,
        })
        .eq('user_id', user.id);

      if (error) throw error;
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Failed to save profile');
    } finally {
      setSaving(false);
    }
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

  const groupedConcerns = {
    dietary: healthConcerns.filter(c => c.category === 'dietary'),
    medical: healthConcerns.filter(c => c.category === 'medical'),
    lifestyle: healthConcerns.filter(c => c.category === 'lifestyle'),
  };

  return (
    <>
      <Helmet>
        <title>Health Profile | Ingredient Co-Pilot</title>
        <meta name="description" content="Customize your health profile for personalized ingredient analysis" />
      </Helmet>

      <div className="min-h-screen bg-background animated-bg">
        <Header />
        
        <main className="container mx-auto px-4 py-8 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Header */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/')}
                className="w-10 h-10 rounded-xl glass-card flex items-center justify-center hover:shadow-soft transition-all"
              >
                <ArrowLeft className="w-5 h-5 text-foreground" />
              </button>
              <div>
                <h1 className="text-3xl font-display font-bold text-foreground">Health Profile</h1>
                <p className="text-muted-foreground">Personalize your ingredient analysis</p>
              </div>
            </div>

            {/* Profile Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-card rounded-3xl p-6 md:p-8"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl gradient-hero flex items-center justify-center shadow-glow">
                  <User className="w-8 h-8 text-primary-foreground" />
                </div>
                <div className="flex-1">
                  <label className="text-sm font-medium text-muted-foreground mb-1 block">Display Name</label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={e => setDisplayName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full px-4 py-2 rounded-xl bg-secondary/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-primary/10 text-primary">
                <Sparkles className="w-5 h-5" />
                <span className="text-sm font-medium">AI will use your profile to provide personalized health insights</span>
              </div>
            </motion.div>

            {/* Health Concerns */}
            {Object.entries(groupedConcerns).map(([category, concerns], categoryIndex) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + categoryIndex * 0.1 }}
                className="glass-card rounded-3xl p-6 md:p-8"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center",
                    category === 'dietary' && "bg-success/20 text-success",
                    category === 'medical' && "bg-destructive/20 text-destructive",
                    category === 'lifestyle' && "bg-accent/20 text-accent"
                  )}>
                    {categoryLabels[category as keyof typeof categoryLabels].icon}
                  </div>
                  <h2 className="text-xl font-display font-semibold text-foreground">
                    {categoryLabels[category as keyof typeof categoryLabels].label}
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {concerns.map((concern, index) => {
                    const isSelected = selectedConcerns.includes(concern.id);
                    return (
                      <motion.button
                        key={concern.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 + index * 0.05 }}
                        onClick={() => toggleConcern(concern.id)}
                        className={cn(
                          "relative p-4 rounded-2xl text-left transition-all duration-300",
                          isSelected
                            ? "bg-primary/15 border-2 border-primary shadow-glow"
                            : "bg-secondary/30 border-2 border-transparent hover:bg-secondary/50 hover:shadow-soft"
                        )}
                      >
                        <AnimatePresence>
                          {isSelected && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              exit={{ scale: 0 }}
                              className="absolute top-3 right-3 w-6 h-6 rounded-full gradient-hero flex items-center justify-center"
                            >
                              <Check className="w-4 h-4 text-primary-foreground" />
                            </motion.div>
                          )}
                        </AnimatePresence>
                        
                        <div className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center mb-3",
                          isSelected ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
                        )}>
                          {concern.icon}
                        </div>
                        <h3 className={cn(
                          "font-semibold mb-1",
                          isSelected ? "text-primary" : "text-foreground"
                        )}>
                          {concern.label}
                        </h3>
                        <p className="text-sm text-muted-foreground">{concern.description}</p>
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            ))}

            {/* Save Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex justify-end gap-4 pb-8"
            >
              <button
                onClick={() => navigate('/')}
                className="px-6 py-3 rounded-xl glass-card text-foreground font-medium hover:shadow-soft transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-8 py-3 rounded-xl gradient-hero text-primary-foreground font-semibold shadow-glow hover:shadow-elevated transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Save Profile
                  </>
                )}
              </button>
            </motion.div>
          </motion.div>
        </main>
      </div>
    </>
  );
}
