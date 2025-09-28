import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp, TrendingDown, DollarSign, Calendar } from "lucide-react";
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Transaction, SystemProgram, PublicKey } from '@solana/web3.js';
import { supabase } from "@/client/supabase_client";
import { toast } from 'sonner';

interface TradingModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "long" | "short";
  symbol: string;
}

const TradingModal = ({ isOpen, onClose, type, symbol }: TradingModalProps) => {
  const [amount, setAmount] = useState("");
  const [duration, setDuration] = useState("");
  const [clickedLoad, setClickedLoad] = useState(false);
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();

  // Fetch current price from CoinGecko
  const fetchSolanaPrice = async (): Promise<number> => {
    try {
      const response = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd',
        {
          headers: {
            'accept': 'application/json',
            'user-agent': 'trading-app/1.0'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`CoinGecko API error: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.solana?.usd || typeof data.solana.usd !== 'number') {
        throw new Error('Invalid price data from CoinGecko');
      }

      return data.solana.usd;
    } catch (error) {
      console.error('Failed to fetch Solana price:', error);
      throw new Error('Unable to get current Solana price. Please try again.');
    }
  };

  const handleSubmit = async () => {
    setClickedLoad(true);

    if (!publicKey) {
      toast.error("⚠️ Wallet not connected");
      setClickedLoad(false);
      return;
    }

    if (!amount || !duration) {
      toast.error("⚠️ Please fill in all fields");
      setClickedLoad(false);
      return;
    }

    try {
      // 1. Fetch current Solana price first
      toast.info("📊 Getting current Solana price...");
      const currentSolPrice = await fetchSolanaPrice();
      console.log(`💰 Current SOL price: $${currentSolPrice}`);

      // 2. Convert amount from SOL → lamports
      const lamports = Math.floor(parseFloat(amount) * 1_000_000_000);

      if (lamports <= 0) {
        toast.error("⚠️ Please enter a valid amount");
        setClickedLoad(false);
        return;
      }

      // 3. Validate vault public key
      const vaultPubkeyString = import.meta.env.VITE_VAULT_PUBLIC_KEY as string;
      if (!vaultPubkeyString) {
        toast.error("⚠️ Vault address not configured");
        setClickedLoad(false);
        return;
      }

      let vaultPubkey: PublicKey;
      try {
        vaultPubkey = new PublicKey(vaultPubkeyString);
      } catch (err) {
        toast.error("⚠️ Invalid vault address");
        setClickedLoad(false);
        return;
      }

      // 4. Get latest blockhash for the transaction
      const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash('confirmed');

      // 5. Create transaction with proper configuration
      const tx = new Transaction({
        recentBlockhash: blockhash,
        feePayer: publicKey
      }).add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: vaultPubkey,
          lamports: lamports,
        })
      );

      console.log(`📤 Sending ${amount} SOL (${lamports} lamports) to vault...`);

      // 6. Send and confirm transaction with proper commitment levels
      const signature = await sendTransaction(tx, connection, {
        maxRetries: 3,
        preflightCommitment: 'confirmed',
      });

      console.log(`🔄 Transaction sent: ${signature}`);
      toast.info("🔄 Transaction sent, waiting for confirmation...");

      // 7. Wait for confirmation with timeout
      const confirmationStrategy = {
        signature,
        blockhash,
        lastValidBlockHeight,
      };

      const confirmation = await connection.confirmTransaction(
        confirmationStrategy,
        'confirmed'
      );

      if (confirmation.value.err) {
        throw new Error(`Transaction failed: ${confirmation.value.err}`);
      }

      console.log(`✅ Transaction confirmed: ${signature}`);

      // 8. Map duration string → seconds
      const durationSeconds = {
        "1h": 3600,
        "4h": 4 * 3600,
        "1d": 24 * 3600,
        "1w": 7 * 24 * 3600,
        "1m": 30 * 24 * 3600,
      }[duration] || 0;

      // 9. Insert bet into Supabase with USD entry price
      const { data, error } = await supabase.from("bets").insert([
        {
          pubkey: publicKey.toBase58(),
          intent: type === "long" ? "long" : "short",
          amount: lamports,
          timeline: durationSeconds,
          start_ts: new Date().toISOString(),
          entry_price: currentSolPrice, // Store current USD price from CoinGecko
          symbol: "solana", // Use CoinGecko ID format for consistency
          tx_signature: signature,
          resolved: false,
        },
      ]);

      if (error) {
        console.error("Database error:", error);
        throw new Error(`Failed to record bet: ${error.message}`);
      }

      console.log("📥 Bet recorded in DB:", data);
      console.log(`📊 Entry price recorded: $${currentSolPrice}`);
      toast.success(`✅ ${type === "long" ? "Long" : "Short"} position opened at $${currentSolPrice.toFixed(4)}!`);
      
      // Reset form
      setAmount("");
      setDuration("");
      onClose();

    } catch (err: any) {
      console.error("❌ Transaction failed:", err);
      
      // More specific error messages
      if (err.message?.includes('insufficient funds')) {
        toast.error("❌ Insufficient SOL balance");
      } else if (err.message?.includes('User rejected')) {
        toast.error("❌ Transaction cancelled by user");
      } else if (err.message?.includes('blockhash not found')) {
        toast.error("❌ Transaction expired, please try again");
      } else if (err.message?.includes('CoinGecko') || err.message?.includes('price')) {
        toast.error(`❌ ${err.message}`);
      } else {
        toast.error(`❌ Transaction failed: ${err.message || 'Unknown error'}`);
      }
    } finally {
      setClickedLoad(false);
    }
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
              <span>Position Size (in SOL)</span>
            </Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0.01"
              placeholder="Enter amount in SOL"
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
              <SelectContent className="bg-white">
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
              <span className="font-semibold text-success">
                +{amount ? (parseFloat(amount) * 0.85).toFixed(4) : "0.0000"} SOL
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Max Loss:</span>
              <span className="font-semibold text-destructive">-{amount || "0.0000"} SOL</span>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Entry price will be set at execution</span>
            </div>
          </div>

          <div className="flex space-x-2">
            <Button variant="outline" onClick={onClose} className="flex-1" disabled={clickedLoad}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              className={`flex-1 ${
                type === "long" 
                  ? "bg-success hover:bg-success/90 text-success-foreground" 
                  : "bg-destructive hover:bg-destructive/90 text-destructive-foreground"
              }`}
              disabled={!amount || !duration || !publicKey || clickedLoad}
            >
              {clickedLoad 
                ? `Placing ${type === "long" ? "Long" : "Short"} Order...` 
                : `Place ${type === "long" ? "Long" : "Short"} Order`
              } 
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TradingModal;