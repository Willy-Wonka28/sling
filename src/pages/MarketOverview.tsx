import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, MoreHorizontal, BarChart3 } from "lucide-react";
import TradingModal from "@/components/TradingModal";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Plotly from 'plotly.js-dist';

interface CoinGeckoData {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  market_cap: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  last_updated: string;
}

const MarketOverview = () => {
  // const { symbol } = useParams<{ symbol: string }>();
  const [showLongDetails, setShowLongDetails] = useState(false);
  const [showShortDetails, setShowShortDetails] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [time, setTime] = useState<String>("1D");
  const [modalType, setModalType] = useState<"long" | "short">("long");


  // timestamps in seconds
  const TIME_1D_HRS = 24*60*60*1000;

  const TIME_1W_SEC = TIME_1D_HRS*7;

  const TIME_1M_SEC = TIME_1W_SEC*30;

  // For now the only marketData is for SOL...this is an MVP so we are trying to focus on functionality and feasibility of the idea

  const queryClient = useQueryClient();
  const cachedData = queryClient.getQueryData<CoinGeckoData>(["tokenData", "solana"])
  
  const marketData = {
    img: "/assets/sol.svg",
    symbol: "$sSOL",
    name: "Synthetic Solana",
    price: cachedData ? `$${cachedData.current_price.toLocaleString()}` : "...",
    change: cachedData ? cachedData.price_change_percentage_24h : 0,
    high24h: cachedData ? `$${cachedData.high_24h.toLocaleString()}` : "...",
    low24h: cachedData ? `$${cachedData.low_24h.toLocaleString()}` : "...",
    volume: cachedData ? `$${(cachedData.total_volume / 1e6).toFixed(1)}M` : "...",
    marketCap: cachedData ? `$${(cachedData.market_cap / 1e9).toFixed(1)}B` : "..."
  };


  const isPositive = marketData.change > 0;

  const handleGraph = async (selectedTime: String) => {
    const currentDate = Date.now();
    let timeStamp;
    switch (selectedTime) {
      case "1W":
        timeStamp = (currentDate - TIME_1W_SEC);
        break;
      case "1M":
        timeStamp = (currentDate - TIME_1M_SEC);
        break;
      default:
        timeStamp = (currentDate - TIME_1D_HRS);
        break;
    }
    
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/solana/market_chart/range?vs_currency=usd&from=${Math.floor(timeStamp / 1000)}&to=${Math.floor(Date.now() / 1000)}&x_cg_demo_api_key=${import.meta.env.VITE_COINGECKO_API_KEY}`
    );
    
    if (!response.ok) throw new Error('There is an issue with this request(MarketGraph)');
    const data = await response.json();
    return data;
  };

  const handleTrade = (type: "long" | "short") => {
    setModalType(type);
    setModalOpen(true);
  };

  const { data: graphData } = useQuery({
    queryKey: ["tokenGraphData", "solana", time],
    queryFn: () => handleGraph(time),
    refetchInterval: 20000,
    refetchIntervalInBackground: false
  });

  useEffect(() => {
    if (graphData?.prices) {
      const trace = {
        x: graphData.prices.map(p => new Date(p[0])),
        y: graphData.prices.map(p => p[1]),
        type: 'scatter',
        mode: 'lines',
        name: 'Price',
        line: {
          color: `${isPositive ? '#22c55e' : "red" }`
        }
      };

      const layout = {
        title: 'Token Price Over Time',
        paper_bgcolor: 'transparent',
        plot_bgcolor: 'transparent',
        hoverlabel: {
          bgcolor: 'grey',
          font: {
            family: 'Courier New, monospace',
            size: 12,
            color: '#ffffff'
          },
        },
        xaxis: { 
          title: 'Date',
          gridcolor: '#1f2937',
          showgrid: false
        },
        yaxis: { 
          title: 'Price (USD)',
          gridcolor: '#1f2937',
          showgrid: true
        },
        margin: { t: 30 },
        font: {
          color: '#9ca3af'  // Gray color for text
        }
      };

      const config = {
        responsive: true,
        displayModeBar: false  // Hides the plotly toolbar
      };

      Plotly.newPlot('plotlyChart', [trace], layout, config);
    }
  }, [graphData]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Header Section */}
          <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <div className="space-y-2 flex items-center gap-4">
                <div>
              <img className="w-20 h-20" src = {marketData.img}/>
               </div>
               <div>
                <h1 className="text-4xl font-bold">{marketData.symbol}</h1>
                <p className="text-lg text-muted-foreground">{marketData.name}</p>
                </div>
              </div>
              <Badge variant={isPositive ? "success" : "destructive"} className="text-lg px-3 py-1">
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
                  {["1H", "1D", "1W", "1M"].map((timeframe) => (
                    <Button className={time == timeframe ? 'bg-gray-200' : ""} key={timeframe} variant="outline" size="sm" onClick={()=>{setTime(timeframe);handleGraph}}>
                      {timeframe}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Price Chart */}
              <div id="plotlyChart" className="h-[50vh] rounded-lg"></div>
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