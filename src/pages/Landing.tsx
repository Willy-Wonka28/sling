import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import DynamicText from "@/components/DynamicText";
import { ArrowRight, TrendingUp, Shield, Zap } from "lucide-react";

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-20 pb-32">
        <div className="text-center space-y-8 animate-fade-in">
          <div className="space-y-4">
            <h1 className="text-6xl md:text-7xl font-bold leading-tight">
              Tokenize{" "}
              <DynamicText />
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              The world's most advanced prediction market platform.
              <br />
              Trade, predict, and profit from market movements.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/markets">
              <Button size="lg" className="group">
                Start Trading
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/screener">
              <Button variant="outline" size="lg">
                View Market Analysis
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Tokenize?</h2>
          <p className="text-lg text-muted-foreground">
            Advanced trading features powered by cutting-edge technology
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center space-y-4 p-8 hover-lift rounded-lg border border-card-border">
            <div className="mx-auto w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">Real-Time Analytics</h3>
            <p className="text-muted-foreground">
              Advanced market analysis and prediction algorithms to help you make informed decisions.
            </p>
          </div>

          <div className="text-center space-y-4 p-8 hover-lift rounded-lg border border-card-border">
            <div className="mx-auto w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center">
              <Shield className="h-6 w-6 text-success" />
            </div>
            <h3 className="text-xl font-semibold">Secure Trading</h3>
            <p className="text-muted-foreground">
              Bank-level security with smart contract protection and transparent settlement.
            </p>
          </div>

          <div className="text-center space-y-4 p-8 hover-lift rounded-lg border border-card-border">
            <div className="mx-auto w-12 h-12 rounded-lg bg-warning/10 flex items-center justify-center">
              <Zap className="h-6 w-6 text-warning" />
            </div>
            <h3 className="text-xl font-semibold">Lightning Fast</h3>
            <p className="text-muted-foreground">
              Execute trades instantly with minimal fees and maximum efficiency.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-t border-border py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-3xl font-bold">$2.4B+</div>
              <div className="text-muted-foreground">Total Volume Traded</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold">150K+</div>
              <div className="text-muted-foreground">Active Traders</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold">99.9%</div>
              <div className="text-muted-foreground">Uptime</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold">24/7</div>
              <div className="text-muted-foreground">Market Access</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;