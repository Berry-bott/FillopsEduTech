import React from 'react';
import { useToast } from "@/components/ui/use-toast";

const TestToast = () => {
  const { toast } = useToast();
  
  const handleTest = () => {
    console.log("Toast function:", toast);
    console.log("Showing toast...");
    
    toast({
      title: "Test Toast 🎉",
      description: "If you see this, toast system works!",
      variant: "default",
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-3xl font-bold mb-8">Toast Test Page</h1>
      
      <button
        onClick={handleTest}
        className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg"
      >
        Click to Test Toast
      </button>
      
      <div className="mt-8 p-4 bg-yellow-100 border border-yellow-300 rounded">
        <h2 className="font-bold">Debug Info:</h2>
        <p>Check browser console (F12) for logs</p>
        <p>Toast should appear in top-right corner</p>
      </div>
    </div>
  );
};

export default TestToast;   