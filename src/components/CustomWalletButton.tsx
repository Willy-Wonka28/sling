import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';

export const CustomWalletButton = () => {
  const { publicKey } = useWallet();

  const formatPubKey = (pubkey: PublicKey) => {
    const pubkeyStr = pubkey.toString();
    return pubkeyStr.slice(0, 4) + '..' + pubkeyStr.slice(-4);
  };

  return (
    <WalletMultiButton 
      className="!bg-primary hover:!bg-primary/90"
      startIcon={undefined}
    >
      {publicKey ? formatPubKey(publicKey) : 'Connect Wallet'}
    </WalletMultiButton>
  );
};