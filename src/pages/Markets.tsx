import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import MarketCard from "@/components/MarketCard";

const Markets = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const markets = [
    {
      symbol: "$sSOL",
      img: "/assets/sol.svg",
      name: "Synthetic Solana",
      coingeckoId: "solana"
    },
    {
      symbol: "$sBTC",
      img: "/assets/btc.svg",
      name: "Synthetic Bitcoin",
    },
    {
      symbol: "$sETH",
      img: "/assets/eth.svg",
      name: "Synthetic Ethereum",
    },
    {
      symbol: "$sAAPL",
      img: "/assets/appl.svg",
      name: "Synthetic Apple",
      price: "...",
      change: 0,
      volume: "...",
      marketCap: "..."
    },
    {
      symbol: "$sTSLA",
      img: "/assets/tsla.svg",
      name: "Synthetic Tesla",
      price: "...",
      change: 0,
      volume: "...",
      marketCap: "..."
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
            <div className="relative max-w-md border">
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
            <div className="flex justify-between items-center gap-3">
            <h2 className="text-2xl font-semibold">Available Markets</h2>
            <div>
              <a href="https://www.coingecko.com/en/api/">
              <img 
                src="/assets/attribution_coingecko.avif" 
                alt="coingecko_attribution" 
                className="w-40 sm:w-48 md:w-56 lg:w-64 h-auto object-contain" 
              />
              </a>
            </div>
            </div>
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