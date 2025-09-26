import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Search, TrendingUp } from "lucide-react";
import { CustomWalletButton } from "./CustomWalletButton";
import '@solana/wallet-adapter-react-ui/styles.css';

const Navigation = () => {
  const location = useLocation();

  const navItems = [
    { label: "Markets", path: "/markets" },
    { label: "Screener", path: "/screener" },
  ];

  const isActivePath = (path: string) => location.pathname === path || (path === "/markets" && location.pathname === "/");

  return (
    <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <TrendingUp className="h-6 w-6" />
            <span className="text-xl font-bold">Tokenize</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-sm font-medium transition-colors hover:text-foreground/80 ${
                  isActivePath(item.path)
                    ? "text-foreground"
                    : "text-muted-foreground"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:block">
            <CustomWalletButton />
          </div>

          <Button variant="ghost" size="sm" className="md:hidden">
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Navigation;