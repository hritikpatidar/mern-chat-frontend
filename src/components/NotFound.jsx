import React from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles } from "lucide-react";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f5f2ec] flex flex-col items-center justify-center px-6 py-12 text-center relative overflow-hidden">
      
      <h1 className="text-[48px] md:text-[60px] font-serif font-bold text-[#2a1b0e] mb-6 tracking-wider z-10">
        NAQSH
      </h1>

      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-[55%] text-[#e0dbd1] text-[180px] md:text-[250px] font-black tracking-tight select-none z-0 pointer-events-none">
        404
      </div>

      <div className="z-10">
        <h2 className="text-3xl md:text-4xl font-semibold text-[#2a1b0e] mb-4 flex items-center justify-center gap-2">
          <Sparkles className="w-6 h-6 text-[#b09a6c]" />
          Page Not Found
        </h2>
        <p className="text-gray-700 mb-8 max-w-md mx-auto">
          Sorry, we couldn't find the page you're looking for. It may have been moved or deleted.
        </p>

        <button
          onClick={() => navigate("/")}
          className="bg-[#2a1b0e] text-white px-6 py-3 rounded-full hover:bg-[#3a2a1e] transition shadow-md"
        >
          Go Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default NotFound;
