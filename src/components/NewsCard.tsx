import { useState } from "react";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, Clock } from "lucide-react";

interface NewsCardProps {
  title: string;
  summary: string;
  time: string;
  aiPrediction: "bullish" | "bearish";
  confidence: number;
}

const NewsCard = ({ title, summary, time, aiPrediction, confidence }: NewsCardProps) => {
  const [isPredictionVisible, setIsPredictionVisible] = useState(false);

  return (
    <div className="market-card">
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <h3 className="font-semibold text-lg leading-tight">{title}</h3>
          <div className="flex items-center space-x-1 text-xs text-muted-foreground ml-4">
            <Clock className="h-3 w-3" />
            <span>{time}</span>
          </div>
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed">{summary}</p>

        <div className="flex items-center justify-between pt-2 border-t border-card-border">
          <span className="text-xs text-muted-foreground">AI Market Prediction</span>
          <Button
            onClick={() => setIsPredictionVisible(!isPredictionVisible)}
            variant="ghost"
            size="sm"
            className={`transition-colors ${
              aiPrediction === "bullish" 
                ? isPredictionVisible ? "bg-success text-success-foreground" : "hover:bg-success/10"
                : isPredictionVisible ? "bg-destructive text-destructive-foreground" : "hover:bg-destructive/10"
            }`}
          >
            {aiPrediction === "bullish" ? (
              <TrendingUp className="h-4 w-4 mr-1" />
            ) : (
              <TrendingDown className="h-4 w-4 mr-1" />
            )}
            {isPredictionVisible ? `${confidence}% ${aiPrediction}` : "Reveal"}
          </Button>
        </div>

        {isPredictionVisible && (
          <div className="animate-scale-in p-3 rounded-lg bg-muted/50 text-xs">
            <p>
              AI model predicts <strong>{aiPrediction}</strong> movement with{" "}
              <strong>{confidence}%</strong> confidence based on sentiment analysis and market indicators.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsCard;