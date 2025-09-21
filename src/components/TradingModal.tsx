import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp, TrendingDown, DollarSign, Calendar } from "lucide-react";

interface TradingModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "long" | "short";
  symbol: string;
}

const TradingModal = ({ isOpen, onClose, type, symbol }: TradingModalProps) => {
  const [amount, setAmount] = useState("");
  const [duration, setDuration] = useState("");

  const handleSubmit = () => {
    // Handle trade submission
    console.log("Trade submitted:", { type, symbol, amount, duration });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            {type === "long" ? (
              <TrendingUp className="h-5 w-5 text-success" />
            ) : (
              <TrendingDown className="h-5 w-5 text-destructive" />
            )}
            <span>
              {type === "long" ? "Long" : "Short"} {symbol}
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="amount" className="flex items-center space-x-1">
              <DollarSign className="h-4 w-4" />
              <span>Position Size</span>
            </Label>
            <Input
              id="amount"
              type="number"
              placeholder="Enter amount in USD"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="duration" className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span>Contract Duration</span>
            </Label>
            <Select value={duration} onValueChange={setDuration}>
              <SelectTrigger>
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1h">1 Hour</SelectItem>
                <SelectItem value="4h">4 Hours</SelectItem>
                <SelectItem value="1d">1 Day</SelectItem>
                <SelectItem value="1w">1 Week</SelectItem>
                <SelectItem value="1m">1 Month</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Potential Return:</span>
              <span className="font-semibold text-success">+{amount ? (parseFloat(amount) * 0.85).toFixed(2) : "0.00"} USD</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Max Loss:</span>
              <span className="font-semibold text-destructive">-{amount || "0.00"} USD</span>
            </div>
          </div>

          <div className="flex space-x-2">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              className={`flex-1 ${
                type === "long" 
                  ? "bg-success hover:bg-success/90 text-success-foreground" 
                  : "bg-destructive hover:bg-destructive/90 text-destructive-foreground"
              }`}
              disabled={!amount || !duration}
            >
              Place {type === "long" ? "Long" : "Short"} Order
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TradingModal;