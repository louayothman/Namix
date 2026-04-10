
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
  Apple,
  Bitcoin
} from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * @fileOverview NAMIX UNIFIED ICON ARSENAL v22.0 - Case-Insensitive Fix
 * تم توحيد كافة المفاتيح لتصبح UPPERCASE لضمان دقة الاستدعاء البرمجي ومنع الخلل البصري المتكرر.
 */

export const CRYPTO_ICONS_MAP: Record<string, any> = {
  // --- Colored Crypto Assets (Iconify) ---
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
  SHIB: "cryptocurrency:shib",
  AVAX: "cryptocurrency:avax",
  NEAR: "cryptocurrency:near",
  UNI: "cryptocurrency:uni",
  ATOM: "cryptocurrency:atom",
  
  // --- Global Stock Logos (Iconify) ---
  APPLE: "logos:apple",
  GOOGLE: "logos:google-icon",
  MICROSOFT: "logos:microsoft-icon",
  AMAZON: "logos:amazon-icon",
  TESLA: "logos:tesla",
  NVIDIA: "logos:nvidia",
  META: "logos:meta-icon",
  NETFLIX: "logos:netflix-icon",
  
  // --- Commodities & Traditional Markets (Lucide) ---
  GOLD: Gem,
  OIL: Droplets,
  STOCK: Building2,
  FOREX: Globe,
  INDEX: BarChart3,
  APPLE_STK: Apple,
  BITCOIN: Bitcoin,
  
  // --- Core System Icons (Lucide - Strictly UPPERCASE) ---
  COINS: Coins,
  ZAP: Zap,
  GLOBE: Globe,
  ACTIVITY: Activity,
  TARGET: Target,
  DIAMOND: Diamond,
  LANDMARK: Landmark,
  WALLET: Wallet,
  CREDITCARD: CreditCard,
  SHIELDCHECK: ShieldCheck,
  TRENDINGUP: TrendingUp,
  GEM: Gem,
  AWARD: Award,
  SHIELD: Shield,
  CIRCLEDOLLARSIGN: CircleDollarSign,
  BANKNOTE: Banknote,
  FLAME: Flame,
  ROCKET: Rocket,
  CPU: Cpu,
  LAYERS: Layers,
  BOX: Box,
  HEXAGON: Hexagon,
  STAR: Star,
  SPARKLES: Sparkles,
  REFRESHCCW: RefreshCcw,
  SCALE: Scale,
  GAVEL: Gavel,
  HISTORY: History,
  LINECHART: LineChart,
  BARCHART3: BarChart3,
  PIECHART: PieChart,
  WAVES: Waves,
  LOCK: Lock,
  EYE: Eye,
  SCAN: Scan,
  FINGERPRINT: Fingerprint,
  TRENDINGDOWN: TrendingDown,
  BRIEFCASE: Briefcase,
  GIFT: Gift,
  TIMER: Timer,
  NAVIGATION: Navigation,
  KEYROUND: KeyRound,
  FILETEXT: FileText,
  USERCHECK: UserCheck,
  SEARCH: Search,
  CHECKCIRCLE2: CheckCircle2,
  ALERTRIANGLE: AlertTriangle,
  RADAR: Radar,
  DROPLETS: Droplets,
  BUILDING2: Building2
};

export function CryptoIcon({ name, color, size = 24, className }: { name: string, color?: string, size?: number, className?: string }) {
  // بروتوكول التوحيد: تحويل كافة المفاتيح لأحرف كبيرة لضمان المطابقة
  const iconKey = (name || "").toUpperCase();
  const iconData = CRYPTO_ICONS_MAP[iconKey] || CRYPTO_ICONS_MAP.COINS;
  
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
