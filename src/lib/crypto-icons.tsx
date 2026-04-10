
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
 * NAMIX FINANCIAL ICONS v19.0 - Sovereign Unified Arsenal
 * تم إصلاح خريطة الأيقونات لضمان ظهور العملات الرقمية الملونة بجانب الأسهم والسلع.
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
  
  // --- Core System Icons (Lucide) ---
  Coins, Zap, Globe, Activity, Target, Diamond, Landmark, Wallet, CreditCard, 
  ShieldCheck, TrendingUp, Gem, Award, Shield, CircleDollarSign, Banknote, 
  Flame, Rocket, Cpu, Layers, Box, Hexagon, Star, Sparkles, RefreshCcw, 
  Scale, Gavel, History, LineChart, BarChart3, PieChart, Waves, Lock, 
  Eye, Scan, Fingerprint, TrendingDown, Briefcase, Gift, Timer, 
  Navigation, KeyRound, FileText, UserCheck, Search, CheckCircle2, 
  AlertTriangle, Radar, Droplets, Building2
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
