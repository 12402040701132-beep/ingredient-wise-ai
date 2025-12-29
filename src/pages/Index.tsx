import { Header } from '@/components/Header';
import { ChatWindow } from '@/components/ChatWindow';
import { Helmet } from 'react-helmet-async';

const Index = () => {
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
      
      <div className="flex flex-col h-screen bg-background">
        <Header />
        <main className="flex-1 overflow-hidden">
          <ChatWindow />
        </main>
      </div>
    </>
  );
};

export default Index;
