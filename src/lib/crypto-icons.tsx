
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
  Flag, Anchor, Navigation2, Compass, Trophy, MousePointerClick, MessageSquare,
  Hash, User
} from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * @fileOverview ترسانة أيقونات ناميكس العالمية v80.0
 * تم تطوير المحرك ليدعم مئات العملات الملونة ومعالجة البادئات الرقمية (1000, 1M) تلقائياً.
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
  NAMIX_STAR: Star,
  NAMIX_SPARKLES: Sparkles,
  NAMIX_REFRESH: RefreshCcw,
  NAMIX_ID: Hash,
  NAMIX_INTERNAL_USER: (props: any) => (
    <div className="relative inline-flex">
      <User {...props} />
      <div className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-[#f9a885] border-2 border-white shadow-sm" />
    </div>
  ),
};

// قاموس التصحيحات اليدوية للبراندات العالمية والرموز الخاصة
const ICON_OVERRIDES: Record<string, string> = {
  'USDT': 'cryptocurrency-color:usdt',
  'BTC': 'cryptocurrency-color:btc',
  'ETH': 'cryptocurrency-color:eth',
  'BNB': 'cryptocurrency-color:bnb',
  'SOL': 'cryptocurrency-color:sol',
  'APPLE': 'logos:apple',
  'GOOGLE': 'logos:google-icon',
  'BINANCE': 'logos:binance',
  'VISA': 'logos:visa',
  'MASTERCARD': 'logos:mastercard',
  'TESLA': 'logos:tesla',
  'NVIDIA': 'logos:nvidia',
  '1INCH': 'cryptocurrency-color:1inch',
  'DOGE': 'cryptocurrency-color:doge',
  'SHIB': 'cryptocurrency-color:shib',
  'PEPE': 'cryptocurrency-color:pepe',
  'FLOKI': 'cryptocurrency-color:floki',
  'BONK': 'cryptocurrency-color:bonk'
};

export const ICON_OPTIONS = [
  { id: 'USDT', label: 'Tether (USDT)' },
  { id: 'BTC', label: 'Bitcoin (BTC)' },
  { id: 'ETH', label: 'Ethereum (ETH)' },
  { id: 'BNB', label: 'Binance Coin (BNB)' },
  { id: 'SOL', label: 'Solana (SOL)' },
  { id: 'XRP', label: 'Ripple (XRP)' },
  { id: 'ADA', label: 'Cardano (ADA)' },
  { id: 'AVAX', label: 'Avalanche (AVAX)' },
  { id: 'DOGE', label: 'Dogecoin (DOGE)' },
  { id: 'DOT', label: 'Polkadot (DOT)' },
  { id: 'TRX', label: 'Tron (TRX)' },
  { id: 'LINK', label: 'Chainlink (LINK)' },
  { id: 'MATIC', label: 'Polygon (MATIC)' },
  { id: 'SHIB', label: 'Shiba Inu (SHIB)' },
  { id: 'LTC', label: 'Litecoin (LTC)' },
  { id: 'BCH', label: 'Bitcoin Cash (BCH)' },
  { id: 'NEAR', label: 'Near Protocol (NEAR)' },
  { id: 'UNI', label: 'Uniswap (UNI)' },
  { id: 'STX', label: 'Stacks (STX)' },
  { id: 'FIL', label: 'Filecoin (FIL)' },
  { id: 'ATOM', label: 'Cosmos (ATOM)' },
  { id: 'LDO', label: 'Lido DAO (LDO)' },
  { id: 'ICP', label: 'Internet Computer (ICP)' },
  { id: 'HBAR', label: 'Hedera (HBAR)' },
  { id: 'APT', label: 'Aptos (APT)' },
  { id: 'OP', label: 'Optimism (OP)' },
  { id: 'ARB', label: 'Arbitrum (ARB)' },
  { id: 'VET', label: 'VeChain (VET)' },
  { id: 'TIA', label: 'Celestia (TIA)' },
  { id: 'SUI', label: 'Sui (SUI)' },
  { id: 'FTM', label: 'Fantom (FTM)' },
  { id: 'INJ', label: 'Injective (INJ)' },
  { id: 'PEPE', label: 'Pepe (PEPE)' },
  { id: 'THETA', label: 'Theta (THETA)' },
  { id: 'SEI', label: 'Sui (SEI)' },
  { id: 'GRT', label: 'The Graph (GRT)' },
  { id: 'BONK', label: 'Bonk (BONK)' },
  { id: 'FLOKI', label: 'Floki (FLOKI)' },
  { id: 'WIF', label: 'dogwifhat (WIF)' },
  { id: 'JUP', label: 'Jupiter (JUP)' },
  { id: 'NAMIX_ID', label: 'Namix ID Transfer' },
  { id: 'NAMIX_INTERNAL_USER', label: 'Namix User Internal' }
];

export function CryptoIcon({ name, color, size = 24, className }: { name: string, color?: string, size?: number, className?: string }) {
  const iconKey = (name || "").toUpperCase();
  
  // 1. فحص الأيقونات المخصصة (Lucide)
  const LucideIcon = CRYPTO_ICONS_MAP[iconKey];
  if (LucideIcon && typeof LucideIcon !== 'string') {
    return (
      <div style={{ width: size, height: size }} className={cn("flex items-center justify-center shrink-0", className)}>
        <LucideIcon color={color || "currentColor"} size={size} strokeWidth={2.5} />
      </div>
    );
  }

  // 2. فحص الـ Overrides اليدوية
  if (ICON_OVERRIDES[iconKey]) {
    return (
      <div className={cn("shrink-0 flex items-center justify-center", className)} style={{ width: size, height: size }}>
        <Icon icon={ICON_OVERRIDES[iconKey]} width={size} height={size} style={color ? { color } : undefined} />
      </div>
    );
  }

  // 3. معالجة الرموز المعقدة والبادئات الرقمية (مثل 1000SATS)
  const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
  
  const cleanSymbol = (s: string) => {
    let cleaned = normalize(s);
    // إزالة البادئات الشائعة في بينانس للرموز المصغرة
    if (cleaned.startsWith('1000')) cleaned = cleaned.substring(4);
    else if (cleaned.startsWith('1m')) cleaned = cleaned.substring(2);
    return cleaned;
  };

  const primaryIcon = `cryptocurrency-color:${normalize(name)}`;
  const secondaryIcon = `cryptocurrency-color:${cleanSymbol(name)}`;

  return (
    <div className={cn("shrink-0 flex items-center justify-center", className)} style={{ width: size, height: size }}>
      <Icon 
        icon={primaryIcon} 
        width={size} 
        height={size} 
        style={color ? { color } : undefined}
        fallback={
          <Icon 
            icon={secondaryIcon}
            width={size}
            height={size}
            style={color ? { color } : undefined}
            // الخيار الأخير في حال فشل كل المحاولات
            fallback={<Coins size={size} className="text-gray-200" />}
          />
        }
      />
    </div>
  );
}
