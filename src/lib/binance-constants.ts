/**
 * @fileOverview Binance Asset Constants
 * Shared constants for Binance assets and networks.
 * Optimized to prevent duplicate keys and match official SAPI requirements.
 */

export const BINANCE_SUPPORTED_ASSETS = [
  { 
    coin: "USDT", 
    name: "TetherUS", 
    icon: "Coins", 
    networks: [
      { label: "TRC20 (Tron)", code: "TRX" },
      { label: "ERC20 (Ethereum)", code: "ETH" },
      { label: "BEP20 (Binance Smart Chain)", code: "BSC" },
      { label: "Solana", code: "SOL" }
    ] 
  },
  { 
    coin: "BTC", 
    name: "Bitcoin", 
    icon: "Bitcoin", 
    networks: [
      { label: "Bitcoin (Legacy/SegWit)", code: "BTC" },
      { label: "BEP20 (Binance Smart Chain)", code: "BSC" }
    ] 
  },
  { 
    coin: "ETH", 
    name: "Ethereum", 
    icon: "Diamond", 
    networks: [
      { label: "ERC20 (Ethereum)", code: "ETH" },
      { label: "BEP20 (Binance Smart Chain)", code: "BSC" },
      { label: "Arbitrum One", code: "ARBITRUM" }
    ] 
  },
  { 
    coin: "TRX", 
    name: "TRON", 
    icon: "Zap", 
    networks: [
      { label: "TRC20 (Tron)", code: "TRX" }
    ] 
  },
  { 
    coin: "LTC", 
    name: "Litecoin", 
    icon: "Coins", 
    networks: [
      { label: "Litecoin", code: "LTC" },
      { label: "BEP20 (Binance Smart Chain)", code: "BSC" }
    ] 
  },
];
