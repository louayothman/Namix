
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
 * @fileOverview ترسانة أيقونات ناميكس العالمية v67.0
 * إضافة أيقونة NAMIX_INTERNAL_USER المخصصة (User + Namix Dot).
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

export const ICON_OPTIONS = [
  { id: 'NAMIX_INTERNAL_USER', label: 'Namix User Internal' },
  { id: 'NAMIX_ID', label: 'Namix ID Transfer' },
  { id: 'USDT', label: 'Tether (USDT)' },
  { id: 'BTC', label: 'Bitcoin (BTC)' },
  { id: 'ETH', label: 'Ethereum (ETH)' },
  { id: 'BNB', label: 'Binance Coin (BNB)' },
  { id: 'SOL', label: 'Solana (SOL)' },
  { id: 'XRP', label: 'Ripple (XRP)' },
  { id: 'USDC', label: 'USD Coin (USDC)' },
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
  { id: 'DAI', label: 'Dai (DAI)' },
  { id: 'STX', label: 'Stacks (STX)' },
  { id: 'FIL', label: 'Filecoin (FIL)' },
  { id: 'ATOM', label: 'Cosmos (ATOM)' },
  { id: 'LDO', label: 'Lido DAO (LDO)' },
  { id: 'ICP', label: 'Internet Computer (ICP)' },
  { id: 'IMX', label: 'Immutable (IMX)' },
  { id: 'HBAR', label: 'Hedera (HBAR)' },
  { id: 'KAS', label: 'Kaspa (KAS)' },
  { id: 'ETC', label: 'Ethereum Classic (ETC)' },
  { id: 'APT', label: 'Aptos (APT)' },
  { id: 'OP', label: 'Optimism (OP)' },
  { id: 'RNDR', label: 'Render (RNDR)' },
  { id: 'ARB', label: 'Arbitrum (ARB)' },
  { id: 'VET', label: 'VeChain (VET)' },
  { id: 'TIA', label: 'Celestia (TIA)' },
  { id: 'SUI', label: 'Sui (SUI)' },
  { id: 'FTM', label: 'Fantom (FTM)' },
  { id: 'INJ', label: 'Injective (INJ)' },
  { id: 'PEPE', label: 'Pepe (PEPE)' },
  { id: 'THETA', label: 'Theta (THETA)' },
  { id: 'RUNE', label: 'THORChain (RUNE)' },
  { id: 'SEI', label: 'Sui (SEI)' },
  { id: 'GRT', label: 'The Graph (GRT)' },
  { id: 'AR', label: 'Arweave (AR)' },
  { id: 'ALGO', label: 'Algorand (ALGO)' },
  { id: 'FLOW', label: 'Flow (FLOW)' },
  { id: 'GALA', label: 'Gala (GALA)' },
  { id: 'BONK', label: 'Bonk (BONK)' },
  { id: 'FLOKI', label: 'Pepe (FLOKI)' },
  { id: 'WIF', label: 'dogwifhat (WIF)' },
  { id: 'JUP', label: 'Jupiter (JUP)' },
  { id: 'STRK', label: 'Starknet (STRK)' },
  { id: 'PYTH', label: 'Pyth Network (PYTH)' },
  { id: 'APPLE', label: 'Apple Inc.' },
  { id: 'GOOGLE', label: 'Google / Alphabet' },
  { id: 'MICROSOFT', label: 'Microsoft' },
  { id: 'AMAZON', label: 'Amazon' },
  { id: 'TESLA', label: 'Tesla Motors' },
  { id: 'META', label: 'Meta / Facebook' },
  { id: 'NVIDIA', label: 'Nvidia' },
  { id: 'VISA', label: 'Visa' },
  { id: 'MASTERCARD', label: 'Mastercard' },
  { id: 'NETFLIX', label: 'Netflix' },
];

export function CryptoIcon({ name, color, size = 24, className }: { name: string, color?: string, size?: number, className?: string }) {
  const iconKey = (name || "").toUpperCase();
  
  const LucideIcon = CRYPTO_ICONS_MAP[iconKey];
  if (LucideIcon && typeof LucideIcon !== 'string') {
    return (
      <div style={{ width: size, height: size }} className={cn("flex items-center justify-center shrink-0", className)}>
        <LucideIcon color={color || "currentColor"} size={size} strokeWidth={2.5} />
      </div>
    );
  }

  let iconName = `cryptocurrency-color:${iconKey.toLowerCase()}`;
  
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
    'MASTERCARD': 'logos:mastercard',
    'TESLA': 'logos:tesla',
    'NVIDIA': 'logos:nvidia'
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
          const target = e.target as any;
          if (target && target.setAttribute) {
            target.setAttribute('icon', 'lucide:coins');
          }
        }}
      />
    </div>
  );
}
