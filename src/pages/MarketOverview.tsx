import { useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, MoreHorizontal, BarChart3 } from "lucide-react";
import TradingModal from "@/components/TradingModal";

const MarketOverview = () => {
  const { symbol } = useParams<{ symbol: string }>();
  const [showLongDetails, setShowLongDetails] = useState(false);
  const [showShortDetails, setShowShortDetails] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"long" | "short">("long");

  // Mock data based on symbol
  const marketData = {
    symbol: symbol?.toUpperCase() || "sSOL",
    name: "Synthetic Solana",
    price: "$142.35",
    change: 8.42,
    high24h: "$148.92",
    low24h: "$134.17",
    volume: "$24.5M",
    marketCap: "$3.2B"
  };

  const isPositive = marketData.change > 0;

  const handleTrade = (type: "long" | "short") => {
    setModalType(type);
    setModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Header Section */}
          <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <div className="space-y-2">
                <h1 className="text-4xl font-bold">{marketData.symbol}</h1>
                <p className="text-lg text-muted-foreground">{marketData.name}</p>
              </div>
              <Badge variant={isPositive ? "default" : "destructive"} className="text-lg px-3 py-1">
                {isPositive ? "+" : ""}{marketData.change.toFixed(2)}%
              </Badge>
            </div>

            {/* Current Valuation */}
            <div className="bg-card border border-card-border rounded-lg p-6">
              <div className="grid md:grid-cols-4 gap-6">
                <div>
                  <div className="text-sm text-muted-foreground">Current Price</div>
                  <div className="text-3xl font-bold">{marketData.price}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">24h High</div>
                  <div className="text-xl font-semibold">{marketData.high24h}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">24h Low</div>
                  <div className="text-xl font-semibold">{marketData.low24h}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Volume</div>
                  <div className="text-xl font-semibold">{marketData.volume}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Chart Section */}
          <div className="animate-slide-up">
            <div className="bg-card border border-card-border rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold">Price Chart</h2>
                <div className="flex space-x-2">
                  {["1H", "4H", "1D", "1W", "1M"].map((timeframe) => (
                    <Button key={timeframe} variant="outline" size="sm">
                      {timeframe}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Placeholder Chart */}
              <div className="h-64 bg-muted/30 rounded-lg flex items-center justify-center border-2 border-dashed border-border">
                <div className="text-center space-y-2">
                  <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground" />
                  <p className="text-muted-foreground">Interactive Chart Placeholder</p>
                  <p className="text-sm text-muted-foreground">Price history and technical analysis</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Section */}
          <div className="grid md:grid-cols-2 gap-6 animate-fade-in">
            {/* Long Position */}
            <div className="bg-card border border-card-border rounded-lg p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-success" />
                  <span className="text-lg font-semibold">Long Position</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowLongDetails(!showLongDetails)}
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>

              <p className="text-sm text-muted-foreground">
                Predict that {marketData.symbol} will increase in value
              </p>

              <Button 
                className="w-full bg-success hover:bg-success/90 text-success-foreground"
                onClick={() => handleTrade("long")}
              >
                Go Long
              </Button>

              {showLongDetails && (
                <div className="animate-scale-in space-y-3 p-4 bg-success-muted rounded-lg">
                  <div className="flex justify-between text-sm">
                    <span>Bullish Traders:</span>
                    <span className="font-semibold">67%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Potential Outcome:</span>
                    <span className="font-semibold text-success">+85% return</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    If price increases by 10% in selected timeframe
                  </div>
                </div>
              )}
            </div>

            {/* Short Position */}
            <div className="bg-card border border-card-border rounded-lg p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <TrendingDown className="h-5 w-5 text-destructive" />
                  <span className="text-lg font-semibold">Short Position</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowShortDetails(!showShortDetails)}
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>

              <p className="text-sm text-muted-foreground">
                Predict that {marketData.symbol} will decrease in value
              </p>

              <Button 
                className="w-full bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                onClick={() => handleTrade("short")}
              >
                Go Short
              </Button>

              {showShortDetails && (
                <div className="animate-scale-in space-y-3 p-4 bg-destructive-muted rounded-lg">
                  <div className="flex justify-between text-sm">
                    <span>Bearish Traders:</span>
                    <span className="font-semibold">33%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Potential Outcome:</span>
                    <span className="font-semibold text-destructive">+120% return</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    If price decreases by 10% in selected timeframe
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Market Stats */}
          <div className="bg-card border border-card-border rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Market Statistics</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <div className="text-sm text-muted-foreground">Market Cap</div>
                <div className="text-lg font-semibold">{marketData.marketCap}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Active Positions</div>
                <div className="text-lg font-semibold">2,847</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Volatility (24h)</div>
                <div className="text-lg font-semibold">12.4%</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <TradingModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        type={modalType}
        symbol={marketData.symbol}
      />
    </div>
  );
};

export default MarketOverview;