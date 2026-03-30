
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
  Radar
} from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * NAMIX SOVEREIGN ICONS v15.0 - Ultimate Unique Arsenal
 * مصفوفة أيقونات فريدة 100% تدمج بين العملات الملونة (Iconify) وأيقونات النظام (Lucide).
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
  AVAX: "cryptocurrency:avax",
  SHIB: "cryptocurrency:shib",
  DAI: "cryptocurrency:dai",
  UNI: "cryptocurrency:uni",
  ATOM: "cryptocurrency:atom",
  BCH: "cryptocurrency:bch",
  ALGO: "cryptocurrency:algo",
  NEAR: "cryptocurrency:near",
  FIL: "cryptocurrency:fil",
  ICP: "cryptocurrency:icp",
  VET: "cryptocurrency:vet",
  SAND: "cryptocurrency:sand",
  MANA: "cryptocurrency:mana",
  AAVE: "cryptocurrency:aave",
  AXS: "cryptocurrency:axs",
  EOS: "cryptocurrency:eos",
  THETA: "cryptocurrency:theta",
  FTM: "cryptocurrency:ftm",
  MKR: "cryptocurrency:mkr",
  GRT: "cryptocurrency:grt",
  CAKE: "cryptocurrency:cake",
  KAVA: "cryptocurrency:kava",
  RUNE: "cryptocurrency:rune",
  ZEC: "cryptocurrency:zec",
  DASH: "cryptocurrency:dash",
  XMR: "cryptocurrency:xmr",
  WAVES: "cryptocurrency:waves",
  BAT: "cryptocurrency:bat",
  ENJ: "cryptocurrency:enj",
  HOT: "cryptocurrency:hot",
  CELO: "cryptocurrency:celo",
  ROSE: "cryptocurrency:rose",
  GALA: "cryptocurrency:gala",
  FLOW: "cryptocurrency:flow",
  LUNA: "cryptocurrency:luna",
  HBAR: "cryptocurrency:hbar",
  
  // --- Unique System & Finance (Lucide) ---
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
  Radar
};

export function CryptoIcon({ name, color, size = 24, className }: { name: string, color?: string, size?: number, className?: string }) {
  const iconData = CRYPTO_ICONS_MAP[name] || CRYPTO_ICONS_MAP.Coins;
  
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
