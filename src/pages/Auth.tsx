import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Leaf, Mail, Lock, User, ArrowRight, Sparkles, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Helmet } from 'react-helmet-async';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: 'Missing fields',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: 'Password too short',
        description: 'Password must be at least 6 characters.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) {
          toast({
            title: 'Login failed',
            description: error.message === 'Invalid login credentials' 
              ? 'Invalid email or password. Please try again.'
              : error.message,
            variant: 'destructive',
          });
        } else {
          toast({
            title: 'Welcome back!',
            description: 'You have successfully logged in.',
          });
        }
      } else {
        const { error } = await signUp(email, password, displayName);
        if (error) {
          if (error.message.includes('already registered')) {
            toast({
              title: 'Account exists',
              description: 'This email is already registered. Try logging in instead.',
              variant: 'destructive',
            });
          } else {
            toast({
              title: 'Sign up failed',
              description: error.message,
              variant: 'destructive',
            });
          }
        } else {
          toast({
            title: 'Account created!',
            description: 'Welcome to Ingredient Co-Pilot.',
          });
        }
      }
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>{isLogin ? 'Login' : 'Sign Up'} | Ingredient Co-Pilot</title>
        <meta name="description" content="Join Ingredient Co-Pilot to analyze food labels and get AI-powered health insights." />
      </Helmet>

      <div className="min-h-screen flex flex-col lg:flex-row">
        {/* Left Panel - Hero */}
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden gradient-hero">
          {/* Animated background elements */}
          <div className="absolute inset-0">
            <div className="absolute top-20 left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-float" />
            <div className="absolute bottom-40 right-20 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-float-slow" />
            <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-white/10 rounded-full blur-2xl animate-pulse-soft" />
          </div>

          {/* Content */}
          <div className="relative z-10 flex flex-col justify-center p-12 lg:p-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-elevated">
                  <Leaf className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="font-display text-3xl font-bold text-white">Ingredient Co-Pilot</h1>
                  <p className="text-white/80">Your AI Health Companion</p>
                </div>
              </div>

              <h2 className="text-4xl lg:text-5xl font-display font-bold text-white leading-tight mb-6">
                Know What You're<br />
                <span className="text-white/90">Really Eating</span>
              </h2>

              <p className="text-lg text-white/80 max-w-md mb-10">
                Upload any food label and get instant AI-powered analysis. Understand ingredients, health impacts, and make informed choices.
              </p>

              <div className="flex flex-wrap gap-4">
                {['🔍 Smart OCR', '🧠 AI Analysis', '💚 Health Insights'].map((feature, i) => (
                  <motion.div
                    key={feature}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    className="px-4 py-2 rounded-full bg-white/15 backdrop-blur-md text-white text-sm font-medium"
                  >
                    {feature}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Decorative shapes */}
          <div className="absolute -bottom-24 -right-24 w-96 h-96 border border-white/20 rounded-full" />
          <div className="absolute -bottom-12 -right-12 w-72 h-72 border border-white/15 rounded-full" />
        </div>

        {/* Right Panel - Form */}
        <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-background animated-bg">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md"
          >
            {/* Mobile Logo */}
            <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-xl gradient-hero flex items-center justify-center shadow-glow">
                <Leaf className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="font-display text-xl font-bold text-foreground">Ingredient Co-Pilot</span>
            </div>

            <div className="glass-card rounded-3xl p-8 lg:p-10">
              <div className="text-center mb-8">
                <h2 className="text-2xl lg:text-3xl font-display font-bold text-foreground mb-2">
                  {isLogin ? 'Welcome back' : 'Get started'}
                </h2>
                <p className="text-muted-foreground">
                  {isLogin ? 'Sign in to continue your health journey' : 'Create your account to begin'}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {!isLogin && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <label className="block text-sm font-medium text-foreground mb-2">Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        type="text"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        placeholder="Your name"
                        className="pl-12 h-12 rounded-xl bg-secondary/50 border-border/50 focus:border-primary"
                      />
                    </div>
                  </motion.div>
                )}

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="pl-12 h-12 rounded-xl bg-secondary/50 border-border/50 focus:border-primary"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="pl-12 pr-12 h-12 rounded-xl bg-secondary/50 border-border/50 focus:border-primary"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-12 rounded-xl gradient-hero text-primary-foreground font-semibold text-base shadow-glow hover:shadow-elevated transition-all duration-300 group"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 animate-spin" />
                      {isLogin ? 'Signing in...' : 'Creating account...'}
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      {isLogin ? 'Sign in' : 'Create account'}
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  )}
                </Button>
              </form>

              <div className="mt-8 text-center">
                <p className="text-muted-foreground">
                  {isLogin ? "Don't have an account?" : 'Already have an account?'}
                  <button
                    type="button"
                    onClick={() => setIsLogin(!isLogin)}
                    className="ml-2 text-primary font-semibold hover:underline"
                  >
                    {isLogin ? 'Sign up' : 'Sign in'}
                  </button>
                </p>
              </div>
            </div>

            <p className="text-center text-xs text-muted-foreground mt-6">
              By continuing, you agree to our Terms of Service and Privacy Policy
            </p>
          </motion.div>
        </div>
      </div>
    </>
  );
}
