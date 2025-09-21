import { Link } from "react-router-dom";
import { TrendingUp, TrendingDown } from "lucide-react";

interface MarketCardProps {
  symbol: string;
  name: string;
  price: string;
  change: number;
  volume: string;
  marketCap: string;
}

const MarketCard = ({ symbol, name, price, change, volume, marketCap }: MarketCardProps) => {
  const isPositive = change > 0;

  return (
    <Link to={`/market/${symbol.toLowerCase()}`}>
      <div className="market-card group">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold">{symbol}</h3>
            <p className="text-sm text-muted-foreground">{name}</p>
          </div>
          <div className={`flex items-center space-x-1 px-2 py-1 rounded text-xs font-medium ${
            isPositive ? "status-positive" : "status-negative"
          }`}>
            {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            <span>{Math.abs(change).toFixed(2)}%</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Price</span>
            <span className="font-semibold">{price}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Volume</span>
            <span className="text-sm">{volume}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Market Cap</span>
            <span className="text-sm">{marketCap}</span>
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