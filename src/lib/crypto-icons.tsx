
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
 * @fileOverview ترسانة أيقونات ناميكس العالمية v102.0 - Sovereign Intelligence & 2x2 Grid Fallback
 * تم تطوير المحرك بذكاء فائق ونظام بديل نصي (شبكة 2*2) بالأسود المتدرج على خلفية بيضاء.
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
  
  // 1. فحص الأيقونات المخصصة (Lucide)
  const LucideIcon = CRYPTO_ICONS_MAP[iconKey];
  if (LucideIcon && typeof LucideIcon !== 'string') {
    return (
      <div style={{ width: size, height: size }} className={cn("flex items-center justify-center shrink-0", className)}>
        <LucideIcon color={color || "currentColor"} size={size} strokeWidth={2.5} />
      </div>
    );
  }

  // 2. فحص الـ Overrides اليدوية المباشرة
  if (ICON_OVERRIDES[iconKey]) {
    return (
      <div className={cn("shrink-0 flex items-center justify-center", className)} style={{ width: size, height: size }}>
        <Icon icon={ICON_OVERRIDES[iconKey]} width={size} height={size} style={color ? { color } : undefined} />
      </div>
    );
  }

  /**
   * دالة التطبيع فائقة الذكاء (Ultra-Smart Normalizer)
   * تم تحسينها لقص البادئات واللاحقات المعقدة لضمان دقة البحث.
   */
  const normalize = (s: string) => {
    let cleaned = s.toLowerCase().replace(/[^a-z0-9]/g, '');
    
    // إزالة البادئات الرقمية واللاحقات المنصية
    const junk = ['1000', '1m', 'ld', 'usdt', 'busd', 'up', 'down', 'bull', 'bear', 'st'];
    
    junk.forEach(prefix => {
      if (cleaned.startsWith(prefix) && cleaned.length > prefix.length) {
        cleaned = cleaned.substring(prefix.length);
      }
    });

    junk.forEach(suffix => {
      if (cleaned.endsWith(suffix) && cleaned.length > suffix.length) {
        cleaned = cleaned.slice(0, -suffix.length);
      }
    });
    
    return cleaned;
  };

  const symbol = normalize(name);

  /**
   * مصفوفة السقوط السباعية المتخصصة
   */
  const libraries = [
    'cryptocurrency-color', 
    'token-icons',          
    'token',                
    'cryptocurrency',       
    'logos',                
    'simple-icons',         
    'fa6-brands'            
  ];

  /**
   * مُفاعل الهوية الشبكية 2x2 (Grid Identity Protocol)
   * تصميم فخم: 4 عناصر (أحرف/أرقام) بالأسود المتدرج على خلفية بيضاء نقية.
   */
  const renderTextFallback = () => {
    // استخراج أول 4 خانات وملء الفراغات بمسافات لضمان توازن الشبكة
    const rawChars = symbol.toUpperCase().slice(0, 4).split('');
    const chars = [...rawChars];
    while (chars.length < 4) chars.push(' ');

    return (
      <div 
        style={{ width: size, height: size }}
        className={cn(
          "rounded-full bg-white flex items-center justify-center select-none shrink-0 p-1 transition-transform duration-500 hover:scale-110",
          className
        )}
      >
        <div className="grid grid-cols-2 grid-rows-2 gap-[1px] w-full h-full">
          {chars.map((char, i) => (
            <div 
              key={i} 
              className="flex items-center justify-center font-black leading-none bg-gradient-to-br from-black via-neutral-800 to-neutral-500 bg-clip-text text-transparent"
              style={{ fontSize: size * 0.32 }}
            >
              {char}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderIconWithChain = (libIndex: number): React.ReactNode => {
    if (libIndex >= libraries.length) {
      return renderTextFallback();
    }

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
