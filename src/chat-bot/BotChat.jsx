// import { useEffect } from 'react';
// import { useLocation } from 'react-router-dom';

// const BotChat = () => {
//   const location = useLocation();
  
//   // Define pages where bot should appear
//   const allowedPaths = ['/user/dashboard', '/support', '/help'];
  
//   const shouldShowBot = allowedPaths.some(path => 
//     location.pathname.includes(path)
//   );

//   useEffect(() => {
//     if (!shouldShowBot) return;

//     // Load Botpress scripts
//     const script1 = document.createElement('script');
//     script1.src = 'https://cdn.botpress.cloud/webchat/v3.5/inject.js';
//     script1.async = true;
//     document.body.appendChild(script1);

//     const script2 = document.createElement('script');
//     script2.src = 'https://files.bpcontent.cloud/2026/01/10/16/20260110165057-S4B9YF14.js';
//     script2.defer = true;
//     document.body.appendChild(script2);

//     // Cleanup function
//     return () => {
//       script1.remove();
//       script2.remove();
      
//       // Remove bot widget if it exists
//       const botWidget = document.querySelector('#bp-web-widget');
//       if (botWidget) botWidget.remove();
//     };
//   }, [shouldShowBot, location.pathname]);

//   return null; // This component doesn't render anything
// };

// export default BotChat;













import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const BotChat = () => {
  const location = useLocation();
  const isMounted = useRef(false);
  const botInitialized = useRef(false);

  // Where the bot should appear (exact paths)
  const allowedPaths = [
    // '/',
    '/user/dashboard',
    '/tutor/dashboard',
  ];

  const shouldShowBot = allowedPaths.includes(location.pathname);

  // Thorough cleanup
  const cleanupBot = () => {
    // 1. Official destroy
    if (window.botpress?.webchat?.destroy) {
      try {
        window.botpress.webchat.destroy();
      } catch {}
    }

    // 2. Remove Botpress DOM elements
    [
      '#bp-web-widget-container',
      '#bp-web-widget',
      '.bpw-widget-bubble',
      '.bpw-web-widget',
      '[data-bp-widget]',
      'iframe[src*="botpress.cloud"]',
    ].forEach(sel => {
      document.querySelectorAll(sel).forEach(el => el.remove());
    });

    // 3. Remove scripts
    [
      'script[src*="cdn.botpress.cloud/webchat/v3.5/inject.js"]',
      'script[src*="files.bpcontent.cloud/2026/01/10/16/20260110165057-S4B9YF14.js"]',
    ].forEach(sel => {
      document.querySelectorAll(sel).forEach(s => s.remove());
    });

    // 4. Clear globals
    ['botpress', 'botpressWebChat', '__BOTPRESS_WEBCHAT_LOADED', 'bp'].forEach(k => {
      if (window[k]) delete window[k];
    });

    botInitialized.current = false;
  };

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      cleanupBot(); // initial cleanup
    }

    if (!shouldShowBot) {
      cleanupBot();
      return;
    }

    if (botInitialized.current) return;

    botInitialized.current = true;

    const loadScripts = async () => {
      // 1. Load main inject.js first
      await new Promise((resolve, reject) => {
        if (document.querySelector('script[src*="cdn.botpress.cloud/webchat/v3.5/inject.js"]')) {
          resolve();
          return;
        }

        const script1 = document.createElement('script');
        script1.src = 'https://cdn.botpress.cloud/webchat/v3.5/inject.js';
        script1.async = true;
        script1.onload = resolve;
        script1.onerror = () => {
          console.error('[BotChat] Failed to load inject.js');
          reject();
        };
        document.body.appendChild(script1);
      });

      // 2. Only then load your config script
      if (!document.querySelector('script[src*="files.bpcontent.cloud/2026/01/10/16/20260110165057-S4B9YF14.js"]')) {
        const script2 = document.createElement('script');
        script2.src = 'https://files.bpcontent.cloud/2026/01/10/16/20260110165057-S4B9YF14.js';
        script2.defer = true;
        document.body.appendChild(script2);
      }

      // 3. Wait a bit and try to force visibility / open
      setTimeout(() => {
        const bubble = document.querySelector('.bpw-widget-bubble');
        if (bubble) {
          bubble.style.display = 'block';
          bubble.style.visibility = 'visible';
          bubble.style.opacity = '1';
        }

        // Optional: auto-open only on dashboards (uncomment if wanted)
        // if (window.botpress?.webchat?.open && location.pathname !== '/') {
        //   window.botpress.webchat.open();
        // }
      }, 1500);
    };

    loadScripts().catch(err => {
      console.error('[BotChat] Script loading failed:', err);
      botInitialized.current = false;
    });

    return cleanupBot;
  }, [shouldShowBot, location.pathname]);

  return null;
};

export default BotChat;