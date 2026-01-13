import { useEffect, useState } from "react";

export default function BotChat() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("Loading Fillops chatbot...");
    
    // Load the main Botpress webchat script (v3.5)
    const mainScript = document.createElement("script");
    mainScript.src = "https://cdn.botpress.cloud/webchat/v3.5/inject.js";
    mainScript.async = true;
    
    mainScript.onload = () => {
      console.log("Main script loaded");
      
      // Load your bot's configuration script
      const configScript = document.createElement("script");
      configScript.src = "https://files.bpcontent.cloud/2026/01/10/16/20260110165057-S4B9YF14.js";
      configScript.defer = true;
      
      configScript.onload = () => {
        console.log("Bot configuration loaded successfully");
        setLoading(false);
        setError(null);
      };
      
      
      configScript.onerror = () => {
        console.error("Bot configuration failed to load");
        setError("Failed to load bot configuration");
        setLoading(false);
      };
      
      document.body.appendChild(configScript);
    };
    
    mainScript.onerror = () => {
      console.error("Main script failed to load");
      setError("Failed to load chatbot. Please check your internet connection.");
      setLoading(false);
    };
    
    document.body.appendChild(mainScript);
    
    // Cleanup function
    return () => {
      const scripts = document.querySelectorAll('script[src*="botpress"]');
      scripts.forEach(script => {
        if (document.body.contains(script)) {
          document.body.removeChild(script);
        }
      });
    };
  }, []);

  return (
    <>
      {/* {error && (
        <div className="fixed bottom-0 right-6 z-50 bg-red-500 text-white p-4 rounded-lg shadow-lg max-w-sm">
          <div className="font-bold mb-2">⚠️ Chatbot Error</div>
          <div className="text-sm">{error}</div>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-3 bg-white text-red-500 px-4 py-2 rounded text-sm font-semibold hover:bg-red-50"
          >
            Retry
          </button>
        </div>
      )} */}
      
      {loading && !error && (
        <div className="fixed bottom-0 right-6 z-50 bg-blue-500 text-white p-3 rounded-lg shadow-lg text-sm">
          ⏳ Loading Fillops Assistant...
        </div>
      )}
    </>
  );
}