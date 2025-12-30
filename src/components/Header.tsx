import { useNavigate, useLocation } from 'react-router-dom';
import { Leaf, LogOut, User, History, Settings, LayoutDashboard } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export function Header() {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: 'Signed out',
      description: 'You have been successfully signed out.',
    });
  };

  const displayName = user?.user_metadata?.display_name || user?.email?.split('@')[0] || 'User';
  const initials = displayName.slice(0, 2).toUpperCase();
  const isDashboard = location.pathname === '/dashboard';

  return (
    <header className={cn(
      "sticky top-0 z-40 border-b backdrop-blur-xl",
      isDashboard 
        ? "border-white/10 bg-slate-950/70" 
        : "border-border/50 bg-background/70"
    )}>
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <motion.div
          className="flex items-center gap-3 cursor-pointer"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate('/')}
        >
          <div className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center shadow-glow",
            isDashboard 
              ? "bg-gradient-to-br from-emerald-500 to-blue-500" 
              : "gradient-hero"
          )}>
            <Leaf className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className={cn(
              "font-display font-bold text-lg leading-tight",
              isDashboard ? "text-white" : "text-foreground"
            )}>
              Ingredient Co-Pilot
            </h1>
            <p className={cn(
              "text-xs",
              isDashboard ? "text-slate-400" : "text-muted-foreground"
            )}>AI-powered food analysis</p>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
        >
          {/* Dashboard Link */}
          {user && !isDashboard && (
            <button
              onClick={() => navigate('/dashboard')}
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500/20 to-blue-500/20 text-emerald-600 border border-emerald-500/30 hover:shadow-glow transition-all"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span className="text-sm font-medium">Dashboard</span>
            </button>
          )}

          <span className={cn(
            "hidden sm:inline-flex px-3 py-1.5 text-xs rounded-full font-medium border",
            isDashboard
              ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/20"
              : "bg-success/15 text-success border-success/20"
          )}>
            ENCODE Hackathon
          </span>

          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className={cn(
                    "relative h-10 w-10 rounded-full font-semibold transition-all",
                    isDashboard 
                      ? "bg-gradient-to-br from-emerald-500 to-blue-500 text-white hover:shadow-lg hover:shadow-emerald-500/25"
                      : "gradient-hero text-primary-foreground hover:shadow-glow"
                  )}
                >
                  {initials}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 rounded-xl">
                <div className="px-3 py-2">
                  <p className="text-sm font-medium text-foreground">{displayName}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="gap-2 cursor-pointer"
                  onClick={() => navigate('/dashboard')}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Health Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="gap-2 cursor-pointer"
                  onClick={() => navigate('/profile')}
                >
                  <Settings className="w-4 h-4" />
                  Health Profile
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="gap-2 cursor-pointer"
                  onClick={() => navigate('/history')}
                >
                  <History className="w-4 h-4" />
                  Analysis History
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="gap-2 cursor-pointer text-destructive focus:text-destructive"
                  onClick={handleSignOut}
                >
                  <LogOut className="w-4 h-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </motion.div>
      </div>
    </header>
  );
}
