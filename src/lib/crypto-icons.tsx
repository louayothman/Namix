
"use client";

import React from "react";
import { Icon } from "@iconify/react";
import { 
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
  TrendingDown
} from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * NAMIX SOVEREIGN ICONS v5.0 - Universal Hybrid Engine
 * تم دمج Iconify للعملات الرقمية الملونة مع Lucide لأيقونات النظام.
 * متوافق تماماً مع React 19.
 */

export const CRYPTO_ICONS_MAP: Record<string, any> = {
  // --- Crypto Mappings (Iconify - Colored) ---
  BTC: "cryptocurrency:btc",
  Bitcoin: "cryptocurrency:btc",
  ETH: "cryptocurrency:eth",
  Ethereum: "cryptocurrency:eth",
  USDT: "cryptocurrency:usdt",
  Tether: "cryptocurrency:usdt",
  SOL: "cryptocurrency:sol",
  Solana: "cryptocurrency:sol",
  TRX: "cryptocurrency:trx",
  Tron: "cryptocurrency:trx",
  ADA: "cryptocurrency:ada",
  Cardano: "cryptocurrency:ada",
  DOT: "cryptocurrency:dot",
  Polkadot: "cryptocurrency:dot",
  MATIC: "cryptocurrency:matic",
  Polygon: "cryptocurrency:matic",
  LINK: "cryptocurrency:link",
  Chainlink: "cryptocurrency:link",
  LTC: "cryptocurrency:ltc",
  Litecoin: "cryptocurrency:ltc",
  DOGE: "cryptocurrency:doge",
  Dogecoin: "cryptocurrency:doge",
  XRP: "cryptocurrency:xrp",
  Xrp: "cryptocurrency:xrp",
  BNB: "cryptocurrency:bnb",
  USDC: "cryptocurrency:usdc",
  AVAX: "cryptocurrency:avax",
  SHIB: "cryptocurrency:shib",
  
  // --- Generic & Financial (Lucide) ---
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

export function CryptoIcon({ name, color, size = 24, className }: { name: string, color?: string, size?: number, className?: string }) {
  const iconData = CRYPTO_ICONS_MAP[name] || CRYPTO_ICONS_MAP.Coins;
  
  // إذا كانت البيانات نصية، فهي أيقونة من Iconify
  if (typeof iconData === 'string') {
    return (
      <Icon 
        icon={iconData} 
        width={size} 
        height={size} 
        className={cn("shrink-0", className)}
        style={color ? { color } : undefined}
      />
    );
  }

  // إذا كانت مكوناً، فهي من Lucide
  const LucideIcon = iconData;
  return (
    <div style={{ width: size, height: size }} className={cn("flex items-center justify-center shrink-0", className)}>
      <LucideIcon color={color || "currentColor"} size={size} strokeWidth={2.5} />
    </div>
  );
}
