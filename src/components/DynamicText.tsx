import { useState, useEffect } from "react";

const DynamicText = () => {
  const words = ["$sNVDA", "$sQQQ", "$sTSLA", "$sBTC", "$sETH", "$sSOL"];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % words.length);
        setIsAnimating(false);
      }, 300);
    }, 3000);

    return () => clearInterval(interval);
  }, [words.length]);

  const getWordColor = (word: string) => {
    if (word.includes("NVDA")) {
      return "text-success";
    }
    if (word.includes("TSLA")) {
      return "text-destructive";
    }
    if (word.includes("QQQ")) {
      return "text-[#000000]";
    }
    if (word.includes("BTC")) {
      return "text-[#F7931A]";
    }
    if (word.includes("ETH")) {
      return "text-[#497493]";
    }
    if (word.includes("SOL")) {
      return "text-[#9945FF]";
    }
    return "text-foreground";
  };

  const currentWord = words[currentIndex];

  return (
    <div className="relative h-20 flex items-center">
      <span
        className={`text-6xl md:text-7xl font-bold transition-all duration-300 ${
          isAnimating ? "transform translate-y-4 opacity-0" : "transform translate-y-0 opacity-100"
        } ${getWordColor(currentWord)}`}
      >
        {currentWord}
      </span>
    </div>
  );
};

export default DynamicText;