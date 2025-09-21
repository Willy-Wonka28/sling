import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import MarketCard from "@/components/MarketCard";

const Markets = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const markets = [
    {
      symbol: "$sSOL",
      name: "Synthetic Solana",
      price: "$142.35",
      change: 8.42,
      volume: "$24.5M",
      marketCap: "$3.2B"
    },
    {
      symbol: "$sBTC",
      name: "Synthetic Bitcoin",
      price: "$67,890",
      change: -2.15,
      volume: "$156.8M",
      marketCap: "$1.3T"
    },
    {
      symbol: "$sETH",
      name: "Synthetic Ethereum",
      price: "$3,421",
      change: 5.67,
      volume: "$89.2M",
      marketCap: "$412B"
    },
    {
      symbol: "$sAAPL",
      name: "Synthetic Apple",
      price: "$189.42",
      change: 1.23,
      volume: "$45.6M",
      marketCap: "$2.9T"
    },
    {
      symbol: "$sTSLA",
      name: "Synthetic Tesla",
      price: "$248.76",
      change: -4.89,
      volume: "$78.3M",
      marketCap: "$790B"
    }
  ];

  const filteredMarkets = markets.filter(market =>
    market.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
    market.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="space-y-4">
            <div className="animate-fade-in">
              <h1 className="text-4xl font-bold">Markets</h1>
              <p className="text-lg text-muted-foreground">
                Trade synthetic assets and profit from market predictions
              </p>
            </div>

            {/* Search */}
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search markets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Market Stats */}
          <div className="grid md:grid-cols-4 gap-6 animate-slide-up">
            <div className="bg-card border border-card-border rounded-lg p-4">
              <div className="text-sm text-muted-foreground">Total Markets</div>
              <div className="text-2xl font-bold">{markets.length}</div>
            </div>
            <div className="bg-card border border-card-border rounded-lg p-4">
              <div className="text-sm text-muted-foreground">24h Volume</div>
              <div className="text-2xl font-bold">$394.4M</div>
            </div>
            <div className="bg-card border border-card-border rounded-lg p-4">
              <div className="text-sm text-muted-foreground">Active Positions</div>
              <div className="text-2xl font-bold">12,847</div>
            </div>
            <div className="bg-card border border-card-border rounded-lg p-4">
              <div className="text-sm text-muted-foreground">Total TVL</div>
              <div className="text-2xl font-bold">$847.2M</div>
            </div>
          </div>

          {/* Markets Grid */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Available Markets</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMarkets.map((market, index) => (
                <div key={market.symbol} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <MarketCard {...market} />
                </div>
              ))}
            </div>
          </div>

          {filteredMarkets.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No markets found matching your search.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Markets;