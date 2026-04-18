
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
 * @fileOverview ترسانة أيقونات ناميكس العالمية v105.0 - Symmetric Grid Identity
 * تم تطوير المحرك ليدعم شبكة هوية 2x2 متناظرة (أحرف/أرقام) باللون الأسود الخام على خلفية بيضاء.
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
  'NVIDIA': 'logos:nvidia'
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
  { id: 'DAI', label: 'Dai (DAI)' },
  { id: 'LTC', label: 'Litecoin (LTC)' },
  { id: 'BCH', label: 'Bitcoin Cash (BCH)' },
  { id: 'UNI', label: 'Uniswap (UNI)' },
  { id: 'NEAR', label: 'Near Protocol (NEAR)' },
  { id: 'KAS', label: 'Kaspa (KAS)' },
  { id: 'NAMIX_ID', label: 'Namix ID Transfer' },
  { id: 'NAMIX_INTERNAL_USER', label: 'Namix User Internal' }
];

export function CryptoIcon({ name, color, size = 24, className }: { name: string, color?: string, size?: number, className?: string }) {
  const iconKey = (name || "").toUpperCase();
  
  if (CRYPTO_ICONS_MAP[iconKey]) {
    const LucideIcon = CRYPTO_ICONS_MAP[iconKey];
    return (
      <div style={{ width: size, height: size }} className={cn("flex items-center justify-center shrink-0", className)}>
        <LucideIcon color={color || "currentColor"} size={size} strokeWidth={2.5} />
      </div>
    );
  }

  if (ICON_OVERRIDES[iconKey]) {
    return (
      <div className={cn("shrink-0 flex items-center justify-center", className)} style={{ width: size, height: size }}>
        <Icon icon={ICON_OVERRIDES[iconKey]} width={size} height={size} style={color ? { color } : undefined} />
      </div>
    );
  }

  const normalize = (s: string) => {
    let cleaned = s.toLowerCase().replace(/[^a-z0-9]/g, '');
    const junk = ['1000', '1m', 'ld', 'usdt', 'busd', 'up', 'down', 'bull', 'bear', 'st'];
    junk.forEach(prefix => {
      if (cleaned.startsWith(prefix) && cleaned.length > prefix.length) cleaned = cleaned.substring(prefix.length);
    });
    junk.forEach(suffix => {
      if (cleaned.endsWith(suffix) && cleaned.length > suffix.length) cleaned = cleaned.slice(0, -suffix.length);
    });
    return cleaned;
  };

  const symbol = normalize(name);
  const libraries = ['cryptocurrency-color', 'token-icons', 'token', 'cryptocurrency', 'logos', 'simple-icons', 'fa6-brands'];

  /**
   * مُفاعل الهوية الشبكية المتناظر 2x2 (Symmetric Grid Reactor)
   * نصوص سوداء خام على خلفية بيضاء بدون حواف.
   */
  const renderTextFallback = () => {
    const chars = symbol.toUpperCase().split('').slice(0, 4);
    const n = chars.length;
    
    // مصفوفة الشبكة [أعلى-يسار, أعلى-يمين, أسفل-يسار, أسفل-يمين]
    const grid = ['', '', '', ''];
    
    if (n === 4) {
      grid[0] = chars[0]; grid[1] = chars[1]; grid[2] = chars[2]; grid[3] = chars[3];
    } else if (n === 3) {
      grid[0] = chars[0]; grid[1] = chars[1]; grid[2] = chars[2];
    } else if (n === 2) {
      // قانون التناظر: الأول في الركن العلوي الأيسر، الثاني في الركن السفلي الأيمن
      grid[0] = chars[0]; 
      grid[3] = chars[1];
    } else if (n === 1) {
      grid[0] = chars[0];
    }

    return (
      <div 
        style={{ width: size, height: size }}
        className={cn(
          "rounded-full bg-white flex items-center justify-center select-none shrink-0 p-1 transition-all duration-500 hover:scale-110",
          className
        )}
      >
        <div className="grid grid-cols-2 grid-rows-2 w-full h-full gap-0">
          {grid.map((char, i) => (
            <div 
              key={i} 
              className="flex items-center justify-center font-black leading-none text-black"
              style={{ fontSize: size * 0.34 }}
            >
              {char}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderIconWithChain = (libIndex: number): React.ReactNode => {
    if (libIndex >= libraries.length) return renderTextFallback();
    const currentIcon = `${libraries[libIndex]}:${symbol}`;
    return (
      <Icon 
        icon={currentIcon}
        width={size}
        height={size}
        style={color ? { color } : undefined}
        fallback={renderIconWithChain(libIndex + 1)}
      />
    );
  };

  return (
    <div className={cn("shrink-0 flex items-center justify-center", className)} style={{ width: size, height: size }}>
      {renderIconWithChain(0)}
    </div>
  );
}
