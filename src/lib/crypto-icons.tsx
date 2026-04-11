
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
 * @fileOverview ترسانة أيقونات ناميكس العالمية v60.0
 * محرك Iconify المطور لضمان تغطية 2000+ عملة رقمية وسهم عالمي.
 */

export const CRYPTO_ICONS_MAP: Record<string, any> = {
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
};

export const ICON_OPTIONS = Object.keys(CRYPTO_ICONS_MAP).map(key => ({
  id: key,
  label: key.replace('NAMIX_', '').replace('_', ' ')
}));

export function CryptoIcon({ name, color, size = 24, className }: { name: string, color?: string, size?: number, className?: string }) {
  const iconKey = (name || "").toUpperCase();
  
  // 1. التحقق من أيقونات النظام الأساسية
  const LucideIcon = CRYPTO_ICONS_MAP[iconKey];
  if (LucideIcon && typeof LucideIcon !== 'string') {
    return (
      <div style={{ width: size, height: size }} className={cn("flex items-center justify-center shrink-0", className)}>
        <LucideIcon color={color || "currentColor"} size={size} strokeWidth={2.5} />
      </div>
    );
  }

  // 2. محرك جلب الأيقونات العالمية (تغطية شاملة للعملات الرقمية)
  // نستخدم مجموعة "cryptocurrency-color" و "logos" لضمان الجودة
  let iconName = `cryptocurrency-color:${iconKey.toLowerCase()}`;
  
  // تخصيص استثنائي لبعض الرموز التي قد تختلف تسميتها
  const overrides: Record<string, string> = {
    'USDT': 'cryptocurrency-color:usdt',
    'BTC': 'cryptocurrency-color:btc',
    'ETH': 'cryptocurrency-color:eth',
    'BNB': 'cryptocurrency-color:bnb',
    'SOL': 'cryptocurrency-color:sol',
    'TRX': 'cryptocurrency-color:trx',
    'MATIC': 'cryptocurrency-color:matic',
    'APPLE': 'logos:apple',
    'GOOGLE': 'logos:google-icon',
    'BINANCE': 'logos:binance',
    'VISA': 'logos:visa',
    'MASTERCARD': 'logos:mastercard'
  };

  if (overrides[iconKey]) {
    iconName = overrides[iconKey];
  }

  return (
    <div className={cn("shrink-0 flex items-center justify-center", className)} style={{ width: size, height: size }}>
      <Icon 
        icon={iconName} 
        width={size} 
        height={size} 
        style={color ? { color } : undefined}
        onError={(e) => {
          // Fallback to generic coin if specific icon fails
          const target = e.target as any;
          if (target && target.setAttribute) {
            target.setAttribute('icon', 'lucide:coins');
          }
        }}
      />
    </div>
  );
}
