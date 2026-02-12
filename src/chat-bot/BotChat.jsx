import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const BotChat = () => {
  const location = useLocation();
  
  // Define pages where bot should appear
  const allowedPaths = ['/contact', '/support', '/help'];
  
  const shouldShowBot = allowedPaths.some(path => 
    location.pathname.includes(path)
  );

  useEffect(() => {
    if (!shouldShowBot) return;

    // Load Botpress scripts
    const script1 = document.createElement('script');
    script1.src = 'https://cdn.botpress.cloud/webchat/v3.5/inject.js';
    script1.async = true;
    document.body.appendChild(script1);

    const script2 = document.createElement('script');
    script2.src = 'https://files.bpcontent.cloud/2026/01/10/16/20260110165057-S4B9YF14.js';
    script2.defer = true;
    document.body.appendChild(script2);

    // Cleanup function
    return () => {
      script1.remove();
      script2.remove();
      
      // Remove bot widget if it exists
      const botWidget = document.querySelector('#bp-web-widget');
      if (botWidget) botWidget.remove();
    };
  }, [shouldShowBot, location.pathname]);

  return null; // This component doesn't render anything
};

export default BotChat;