import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import Header from '@/components/pixellens/Header';
import HeroSection from '@/components/pixellens/HeroSection';
import ToolSection from '@/components/pixellens/ToolSection';
import WhySection from '@/components/pixellens/WhySection';
import HowItWorks from '@/components/pixellens/HowItWorks';
import Footer from '@/components/pixellens/Footer';

const Index = () => {
  const [userId, setUserId] = useState<string | null>(null);

  const fetchSession = async () => {
    try {
      const data = await api.getSession();
      if (data?.user_id) {
        setUserId(data.user_id);
      }
    } catch {
      // Backend not available — tool section will show a connection message
    }
  };

  useEffect(() => {
    fetchSession();
  }, []);

  const handleSessionExpired = async () => {
    toast.info('Session refreshed — please re-upload your image');
    await fetchSession();
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <ToolSection userId={userId} onSessionExpired={handleSessionExpired} onRetryConnection={fetchSession} />
      <WhySection />
      <HowItWorks />
      <Footer />
    </div>
  );
};

export default Index;
