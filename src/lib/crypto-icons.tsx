
"use client";

import React from "react";
import { 
  Bitcoin as LucideBitcoin, 
  Coins, 
  Zap, 
  Activity, 
  Globe, 
  Target, 
  Diamond, 
  Landmark, 
  Wallet, 
  CreditCard, 
  ShieldCheck, 
  TrendingUp, 
  Gem, 
  Award, 
  Shield,
  CircleDollarSign,
  Banknote,
  Flame,
  Rocket,
  Cpu,
  Layers,
  Box,
  Hexagon,
  Circle,
  Triangle,
  Square,
  Star,
  Sparkles,
  RefreshCcw,
  Scale,
  Gavel,
  History,
  LineChart,
  BarChart3,
  PieChart,
  Waves,
  Unplug,
  Wifi,
  Lock,
  Eye,
  Scan,
  Fingerprint,
  TrendingDown,
  Smile
} from "lucide-react";

/**
 * NAMIX SOVEREIGN ICONS v4.0 - Universal Asset Mapping
 * تم إعادة بناء المحرك ليعتمد كلياً على Lucide الموثوقة لضمان التوافق مع React 19.
 * تم اختيار الأيقونات بعناية لتمثيل الأصول الرقمية بأسلوب احترافي موحد.
 */

export const CRYPTO_ICONS_MAP: Record<string, any> = {
  // Common Crypto Mappings
  Bitcoin: LucideBitcoin,
  BTC: LucideBitcoin,
  Ethereum: Diamond,
  ETH: Diamond,
  Tether: Coins,
  USDT: Coins,
  Solana: Zap,
  SOL: Zap,
  Tron: Zap,
  TRX: Zap,
  Xrp: Activity,
  XRP: Activity,
  Cardano: Target,
  ADA: Target,
  Polkadot: Layers,
  DOT: Layers,
  Polygon: Box,
  MATIC: Box,
  Chainlink: Unplug,
  LINK: Unplug,
  Litecoin: Coins,
  LTC: Coins,
  Dogecoin: Rocket,
  DOGE: Rocket,
  
  // Generic & Financial
  Coins,
  Zap,
  Globe,
  Activity,
  Target,
  Diamond,
  Landmark,
  Wallet,
  CreditCard,
  ShieldCheck,
  TrendingUp,
  Gem,
  Award,
  Shield,
  CircleDollarSign,
  Banknote,
  Flame,
  Rocket,
  Cpu,
  Layers,
  Box,
  Hexagon,
  Circle,
  Triangle,
  Square,
  Star,
  Sparkles,
  RefreshCcw,
  Scale,
  Gavel,
  History,
  LineChart,
  BarChart3,
  PieChart,
  Waves,
  Unplug,
  Wifi,
  Lock,
  Eye,
  Scan,
  Fingerprint,
  TrendingDown
};

export function CryptoIcon({ name, color = "currentColor", size = 24 }: { name: string, color?: string, size?: number }) {
  const Icon = CRYPTO_ICONS_MAP[name] || CRYPTO_ICONS_MAP.Coins;
  
  return (
    <div style={{ width: size, height: size }} className="flex items-center justify-center">
      <Icon color={color} size={size} strokeWidth={2.5} />
    </div>
  );
}
