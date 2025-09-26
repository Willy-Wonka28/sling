import { Link } from "react-router-dom";
import { TrendingUp, TrendingDown } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface MarketCardProps {
  symbol: string;
  img: string;
  name: string;
  coingeckoId?: string;  // Optional ID for CoinGecko API
  price?: string;        // Made optional since we'll get it from API for crypto
  change?: number;       // Made optional since we'll get it from API for crypto
  volume?: string;       // Made optional since we'll get it from API for crypto
  marketCap?: string;    // Made optional since we'll get it from API for crypto
}

const MarketCard = ({ symbol, name, price, change, volume, marketCap, img, coingeckoId }: MarketCardProps) => {
  const { data } = useQuery({
    queryKey: ["tokenData", coingeckoId],
    queryFn: async () => {
      if (!coingeckoId) return null;
      const response = await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${coingeckoId}&x_cg_demo_api_key=${import.meta.env.VITE_COINGECKO_API_KEY}`);
      if (!response.ok) throw new Error('There is an issue with this request(MarketCard)');
      const data = await response.json();
      return data[0];
    },
    refetchInterval: 10000,
    refetchIntervalInBackground: true,
    enabled: !!coingeckoId
  });

  const isPositive = data ? data.price_change_percentage_24h > 0 : (change ? change > 0 : false);

  console.log("Testing...");
  console.log(data);

 return (
  <Link to={symbol == "$sSOL" ? `/market/${symbol.toLowerCase()}` : ""}>
    <div className={`market-card group ${!coingeckoId ? 'opacity-75' : ''}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <img 
              className={`w-15 h-15 ${!coingeckoId ? 'grayscale' : ''}`} 
              src={img}
            />
          </div>
          <div>
            <h3 className="text-lg font-semibold">{symbol}</h3>
            <p className="text-sm text-muted-foreground">
              {name} 
              {!coingeckoId && <span className="font-mono text-xs ml-2">(coming soon)</span>}
            </p>
          </div>
        </div>
        <div className={`flex items-center space-x-1 px-2 py-1 rounded text-xs font-medium ${
          isPositive ? "status-positive" : "status-negative"
        }`}>
          {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
          <span>{data 
            ? Math.abs(data.price_change_percentage_24h).toFixed(2) 
            : "..."}%</span>
        </div>
      </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Price</span>
            <span className="font-semibold">
              {data 
                ? `$${data.current_price.toLocaleString()}` 
                : (price || "...")}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Market Cap</span>
            <span className="text-sm">
              {data 
                ? `$${(data.market_cap / 1e9).toFixed(1)}B`
                : (marketCap || "...")}
            </span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-card-border">
          <div className="text-xs text-muted-foreground">
            Click to view details →
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MarketCard;