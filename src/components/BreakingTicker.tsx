import React, { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
const BreakingTicker = () => {
  const [currentNews, setCurrentNews] = useState(0);
  const breakingNews = [
    "Senate passes landmark climate legislation with bipartisan support",
    "Federal Reserve announces interest rate decision amid inflation concerns",
    "International summit addresses global security challenges",
    "Economic indicators show mixed signals for Q4 growth",
    "Supreme Court to review constitutional challenge next term"
  ];
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentNews((prev) => (prev + 1) % breakingNews.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="bg-red-600 text-white py-2 mt-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 flex items-center">
        <div className="flex items-center space-x-2 flex-shrink-0">
          <AlertCircle className="w-4 h-4 animate-pulse" />
          <span className="font-bold text-sm uppercase tracking-wide">Breaking</span>
        </div>
        <div className="flex-1 ml-4 overflow-hidden">
          <div 
            className="animate-ticker whitespace-nowrap"
            style={{
              animation: 'ticker 30s linear infinite'
            }}
          >
            <span className="text-sm font-medium">
              {breakingNews[currentNews]}
            </span>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes ticker {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
      `}</style>
    </div>
  );
};

export default BreakingTicker;
