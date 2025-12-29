import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { ChatWindow } from '@/components/ChatWindow';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '@/hooks/useAuth';
import { LoadingSpinner } from '@/components/LoadingSpinner';

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  if (loading) {
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
        <title>Ingredient Co-Pilot | AI-Powered Food Label Analyzer</title>
        <meta 
          name="description" 
          content="Upload food labels or ask about ingredients. Get AI-powered health insights, tradeoffs, and alternatives for informed eating choices." 
        />
        <meta name="keywords" content="food ingredients, health analysis, nutrition, AI, food labels, diet" />
      </Helmet>
      
      <div className="flex flex-col h-screen bg-background animated-bg">
        <Header />
        <main className="flex-1 overflow-hidden">
          <ChatWindow />
        </main>
      </div>
    </>
  );
};

export default Index;
