import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import Landing from "./pages/Landing";
import Markets from "./pages/Markets";
import StockScreener from "./pages/StockScreener";
import MarketOverview from "./pages/MarketOverview";
import NotFound from "./pages/NotFound";
import "@solana/wallet-adapter-react-ui/styles.css";
import { SolanaProvider } from "@/client/solana_provider";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <SolanaProvider>
      <BrowserRouter>
        <div className="max-h-screen bg-background">
          <Navigation />
          <main>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/markets" element={<Markets />} />
              <Route path="/screener" element={<StockScreener />} />
              <Route path="/market/:symbol" element={<MarketOverview />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
      </SolanaProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
