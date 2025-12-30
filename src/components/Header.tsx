import { useNavigate } from 'react-router-dom';
import { Leaf, LogOut, User, History, Settings } from 'lucide-react';
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

export function Header() {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: 'Signed out',
      description: 'You have been successfully signed out.',
    });
  };

  const displayName = user?.user_metadata?.display_name || user?.email?.split('@')[0] || 'User';
  const initials = displayName.slice(0, 2).toUpperCase();

  return (
    <header className="sticky top-0 z-40 border-b border-border/50 bg-background/70 backdrop-blur-xl">
      <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
        <motion.div
          className="flex items-center gap-3 cursor-pointer"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate('/')}
        >
          <div className="w-10 h-10 rounded-xl gradient-hero flex items-center justify-center shadow-glow">
            <Leaf className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-display font-bold text-lg text-foreground leading-tight">
              Ingredient Co-Pilot
            </h1>
            <p className="text-xs text-muted-foreground">AI-powered food analysis</p>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
        >
          <span className="hidden sm:inline-flex px-3 py-1.5 text-xs rounded-full bg-success/15 text-success font-medium border border-success/20">
            ENCODE Hackathon
          </span>

          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="relative h-10 w-10 rounded-full gradient-hero text-primary-foreground font-semibold hover:shadow-glow transition-all"
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
