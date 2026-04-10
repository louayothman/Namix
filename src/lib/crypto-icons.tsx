
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
  Lock,
  Eye,
  Scan,
  Fingerprint,
  TrendingDown,
  Briefcase,
  Gift,
  Timer,
  Navigation,
  KeyRound,
  FileText,
  UserCheck,
  Search,
  CheckCircle2,
  AlertTriangle,
  Radar,
  Droplets,
  Building2,
  Apple
} from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * NAMIX FINANCIAL ICONS v16.0 - Global Asset Arsenal
 * تم توسيع المصفوفة لتشمل أيقونات السلع (الذهب، النفط) والأسهم العالمية (Apple، الشركات).
 */

export const CRYPTO_ICONS_MAP: Record<string, any> = {
  // --- Unique Crypto Assets (Iconify - Colored) ---
  BTC: "cryptocurrency:btc",
  ETH: "cryptocurrency:eth",
  USDT: "cryptocurrency:usdt",
  SOL: "cryptocurrency:sol",
  TRX: "cryptocurrency:trx",
  ADA: "cryptocurrency:ada",
  DOT: "cryptocurrency:dot",
  MATIC: "cryptocurrency:matic",
  LINK: "cryptocurrency:link",
  LTC: "cryptocurrency:ltc",
  DOGE: "cryptocurrency:doge",
  XRP: "cryptocurrency:xrp",
  BNB: "cryptocurrency:bnb",
  USDC: "cryptocurrency:usdc",
  
  // --- Global Markets & Commodities (Lucide Specialized) ---
  GOLD: Gem,
  OIL: Droplets,
  STOCK: Building2,
  APPLE: Apple,
  FOREX: Globe,
  INDEX: BarChart3,
  
  // --- Core System Icons (Lucide) ---
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
  Lock,
  Eye,
  Scan,
  Fingerprint,
  TrendingDown,
  Briefcase,
  Gift,
  Timer,
  Navigation,
  KeyRound,
  FileText,
  UserCheck,
  Search,
  CheckCircle2,
  AlertTriangle,
  Radar,
  Droplets,
  Building2,
  Apple
};

export function CryptoIcon({ name, color, size = 24, className }: { name: string, color?: string, size?: number, className?: string }) {
  const iconKey = name.toUpperCase();
  const iconData = CRYPTO_ICONS_MAP[iconKey] || CRYPTO_ICONS_MAP.Coins;
  
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

  const LucideIcon = iconData;
  return (
    <div style={{ width: size, height: size }} className={cn("flex items-center justify-center shrink-0", className)}>
      <LucideIcon color={color || "currentColor"} size={size} strokeWidth={2.5} />
    </div>
  );
}
