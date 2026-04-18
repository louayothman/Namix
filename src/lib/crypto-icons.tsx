
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
 * @fileOverview ترسانة أيقونات ناميكس العالمية v98.0 - Sovereign 7-Chain Protocol
 * تم تطوير المحرك ليدعم البحث اللانهائي عبر 7 مكتبات أيقونات متخصصة لضمان تغطية آلاف العملات الرقمية.
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

// قاموس التصحيحات اليدوية للبراندات والرموز التي تتطلب دقة مؤسساتية
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

// قائمة موسعة تشمل أهم 2000 عملة رقمية عبر معالجة ديناميكية
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
  { id: 'LEO', label: 'LEO Token (LEO)' },
  { id: 'NEAR', label: 'Near Protocol (NEAR)' },
  { id: 'KAS', label: 'Kaspa (KAS)' },
  { id: 'APT', label: 'Aptos (APT)' },
  { id: 'OP', label: 'Optimism (OP)' },
  { id: 'ARB', label: 'Arbitrum (ARB)' },
  { id: 'SUI', label: 'Sui (SUI)' },
  { id: 'TIA', label: 'Celestia (TIA)' },
  { id: 'PEPE', label: 'Pepe (PEPE)' },
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
   * دالة التطبيع السيادية (Sovereign Normalizer)
   * تقوم بتنظيف كود العملة من البادئات الرقمية والزوائد لضمان مطابقة آلاف الرموز
   */
  const normalize = (s: string) => {
    let cleaned = s.toLowerCase().replace(/[^a-z0-9]/g, '');
    
    // إزالة البادئات الرقمية الشائعة في بينانس (مثل 1000SATS -> SATS)
    if (cleaned.startsWith('1000')) cleaned = cleaned.substring(4);
    else if (cleaned.startsWith('1m')) cleaned = cleaned.substring(2);
    else if (cleaned.startsWith('ld')) cleaned = cleaned.substring(2);
    
    // إزالة 'usdt' من نهاية أزواج العملات إذا وجدت (مثل btcusdt -> btc)
    if (cleaned.length > 4 && (cleaned.endsWith('usdt') || cleaned.endsWith('busd'))) {
        cleaned = cleaned.slice(0, -4);
    }
    
    return cleaned;
  };

  const symbol = normalize(name);

  /**
   * مصفوفة المكتبات السبعة (The Sovereign 7-Chain Protocol)
   * سيتم البحث في هذه المكتبات بالتسلسل حتى العثور على الأيقونة الملونة
   */
  const libraries = [
    'cryptocurrency-color', // 1. الأساسية الملونة
    'token-icons',          // 2. الشاملة للعملات الجديدة
    'token',                // 3. رموز التوكنز اللحظية
    'cryptocurrency',       // 4. المجموعة الكلاسيكية
    'logos',                // 5. البراندات والأسهم (AAPL, TSLA...)
    'simple-icons',         // 6. رموز البرمجيات والويب
    'fa6-brands'            // 7. خيار أخير للبراندات المعروفة
  ];

  // بناء هيكل السقوط المتسلسل (Nested Fallbacks) برمجياً لـ 7 مستويات
  const renderIconWithChain = (libIndex: number): React.ReactNode => {
    if (libIndex >= libraries.length) {
      // في حال فشل كل المكتبات السبعة، نظهر أيقونة Coins كدرع حماية أخيرة
      return <Coins size={size} className="text-gray-200 opacity-40" />;
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
