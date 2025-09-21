import { useState, useEffect } from "react";

const DynamicText = () => {
  const words = ["Everything*", "Anything*", "$NVDA", "$QQQ", "$TSLA", "$BTC", "$ETH"];
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
    if (word.includes("NVDA") || word.includes("BTC") || word.includes("ETH")) {
      return "text-success";
    }
    if (word.includes("TSLA")) {
      return "text-destructive";
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