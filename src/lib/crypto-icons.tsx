
"use client";

import React from "react";
import { Icon } from "@iconify/react";
import { 
  Coins, Zap, Activity, Globe, Target, Diamond, Landmark, Wallet, 
  CreditCard, ShieldCheck, TrendingUp, Gem, Award, Shield, 
  CircleDollarSign, Banknote, Flame, Rocket, Cpu, Layers, Box, 
  Hexagon, Star, Sparkles, RefreshCcw, Scale, Gavel, History, 
  LineChart, BarChart3, PieChart, Waves, Lock, Eye, Scan, 
  Fingerprint, TrendingDown, Briefcase, Gift, Timer, Navigation, 
  KeyRound, FileText, UserCheck, Search, CheckCircle2, AlertTriangle, 
  Radar, Droplets, Building2, Apple, Bitcoin, Heart, Crown, Medal,
  Flag, Anchor, Navigation2, Compass, Trophy, MousePointerClick, MessageSquare
} from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * @fileOverview ترسانة أيقونات ناميكس العالمية v50.0
 * تم دمج محرك Iconify لضمان تغطية 1000+ عملة رقمية وسهم عالمي.
 */

export const CRYPTO_ICONS_MAP: Record<string, any> = {
  // --- 1. SYSTEM & CATEGORY ICONS ---
  NAMIX_GEM: Gem,
  NAMIX_WALLET: Wallet,
  NAMIX_COINS: Coins,
  NAMIX_SHIELD: ShieldCheck,
  NAMIX_ZAP: Zap,
  NAMIX_AWARD: Award,
  NAMIX_TROPHY: Trophy,
  NAMIX_ACTIVITY: Activity,
  NAMIX_RADAR: Radar,
  NAMIX_GLOBE: Globe,
  NAMIX_CPU: Cpu,
  NAMIX_LAYERS: Layers,
  NAMIX_BOX: Box,
  NAMIX_HEXAGON: Hexagon,
  NAMIX_STAR: Star,
  NAMIX_SPARKLES: Sparkles,
  NAMIX_REFRESH: RefreshCcw,
  // ... more system icons mapped here
};

export const ICON_OPTIONS = Object.keys(CRYPTO_ICONS_MAP).map(key => ({
  id: key,
  label: key.replace('NAMIX_', '').replace('_', ' ')
}));

export function CryptoIcon({ name, color, size = 24, className }: { name: string, color?: string, size?: number, className?: string }) {
  const iconKey = (name || "").toUpperCase();
  
  // 1. Check if it's a known Lucide system icon
  const LucideIcon = CRYPTO_ICONS_MAP[iconKey];
  if (LucideIcon && typeof LucideIcon !== 'string') {
    return (
      <div style={{ width: size, height: size }} className={cn("flex items-center justify-center shrink-0", className)}>
        <LucideIcon color={color || "currentColor"} size={size} strokeWidth={2.5} />
      </div>
    );
  }

  // 2. Map standard codes to Iconify Cryptocurrency set (covers 1000+ assets)
  // Mapping pattern: cryptocurrency:<lowercase_code>
  // Also support some mapping for stocks if needed
  let iconifyName = `cryptocurrency:${iconKey.toLowerCase()}`;
  
  // Custom overrides for specific logos
  if (iconKey === 'APPLE') iconifyName = "logos:apple";
  if (iconKey === 'GOOGLE') iconifyName = "logos:google-icon";
  if (iconKey === 'BINANCE') iconifyName = "logos:binance";
  if (iconKey === 'USDT') iconifyName = "cryptocurrency:usdt";

  return (
    <div className={cn("shrink-0 flex items-center justify-center", className)} style={{ width: size, height: size }}>
      <Icon 
        icon={iconifyName} 
        width={size} 
        height={size} 
        style={color ? { color } : undefined}
        // Fallback to generic coin if specific crypto icon doesn't exist
        onError={(e) => {
          const target = e.target as HTMLElement;
          // Set a fallback generic icon using Iconify to ensure consistency
          (e as any).currentTarget.setAttribute('icon', 'lucide:coins');
        }}
      />
    </div>
  );
}
