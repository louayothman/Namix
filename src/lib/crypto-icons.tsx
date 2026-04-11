
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
  Flag, Anchor, Navigation2, Compass, Cpu as AIProcessor, Trophy,
  MousePointerClick, MessageSquare
} from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * @fileOverview ترسانة أيقونات ناميكس السيادية v40.0
 * تم التوسع لتشمل كافة العملات الرقمية والأسهم العالمية (150+ أيقونة ملونة ونظامية).
 */

export const CRYPTO_ICONS_MAP: Record<string, any> = {
  // --- 1. TOP 100+ CRYPTO ASSETS (Dynamic Iconify Mapping) ---
  BTC: "cryptocurrency:btc",
  ETH: "cryptocurrency:eth",
  USDT: "cryptocurrency:usdt",
  BNB: "cryptocurrency:bnb",
  SOL: "cryptocurrency:sol",
  XRP: "cryptocurrency:xrp",
  USDC: "cryptocurrency:usdc",
  ADA: "cryptocurrency:ada",
  AVAX: "cryptocurrency:avax",
  DOGE: "cryptocurrency:doge",
  DOT: "cryptocurrency:dot",
  TRX: "cryptocurrency:trx",
  LINK: "cryptocurrency:link",
  MATIC: "cryptocurrency:matic",
  WBTC: "cryptocurrency:wbtc",
  SHIB: "cryptocurrency:shib",
  DAI: "cryptocurrency:dai",
  LTC: "cryptocurrency:ltc",
  BCH: "cryptocurrency:bch",
  ATOM: "cryptocurrency:atom",
  UNI: "cryptocurrency:uni",
  LEO: "cryptocurrency:leo",
  ETC: "cryptocurrency:etc",
  OKB: "cryptocurrency:okb",
  TON: "cryptocurrency:ton",
  XMR: "cryptocurrency:xmr",
  XLM: "cryptocurrency:xlm",
  KAS: "cryptocurrency:kas",
  ICP: "cryptocurrency:icp",
  HBAR: "cryptocurrency:hbar",
  APT: "cryptocurrency:apt",
  FIL: "cryptocurrency:fil",
  OP: "cryptocurrency:op",
  NEAR: "cryptocurrency:near",
  ARB: "cryptocurrency:arb",
  VET: "cryptocurrency:vet",
  MKR: "cryptocurrency:mkr",
  RNDR: "cryptocurrency:rndr",
  STX: "cryptocurrency:stx",
  LDO: "cryptocurrency:ldo",
  CRO: "cryptocurrency:cro",
  TIA: "cryptocurrency:tia",
  GRT: "cryptocurrency:grt",
  SEI: "cryptocurrency:sei",
  FLOW: "cryptocurrency:flow",
  ALGO: "cryptocurrency:algo",
  EGLD: "cryptocurrency:egld",
  SAND: "cryptocurrency:sand",
  THETA: "cryptocurrency:theta",
  QNT: "cryptocurrency:qnt",
  AAVE: "cryptocurrency:uni",
  STX_COLOR: "cryptocurrency:stx",
  FET: "cryptocurrency:fet",
  RUNE: "cryptocurrency:rune",
  IMX: "cryptocurrency:imx",
  PEPE: "cryptocurrency:pepe",
  BONK: "cryptocurrency:bonk",
  WIF: "cryptocurrency:wif",
  FLOKI: "cryptocurrency:floki",
  JASMY: "cryptocurrency:jasmy",
  INJ: "cryptocurrency:inj",
  SEI_COLOR: "cryptocurrency:sei",
  BEAM: "cryptocurrency:beam",
  PYTH: "cryptocurrency:pyth",
  JUP: "cryptocurrency:jup",
  W: "cryptocurrency:w",
  ENA: "cryptocurrency:ena",
  SUI: "cryptocurrency:sei",
  TAO: "cryptocurrency:fet",

  // --- 2. GLOBAL STOCKS & ASSETS ---
  APPLE: "logos:apple",
  GOOGLE: "logos:google-icon",
  MICROSOFT: "logos:microsoft-icon",
  AMAZON: "logos:amazon-icon",
  TSLA: "logos:tesla",
  NVIDIA: "logos:nvidia",
  META: "logos:meta-icon",
  NFLX: "logos:netflix-icon",
  ADBE: "logos:adobe",
  CRM: "logos:salesforce",
  PYPL: "logos:paypal",
  INTC: "logos:intel",
  CSCO: "logos:cisco",
  PEP: "logos:pepsico",
  KO: "logos:coca-cola",
  GOLD: "lucide:gem",
  OIL: "lucide:droplets",
  SILVER: "lucide:coins",
  GAS: "lucide:flame",
  STOCK: "lucide:building-2",
  FOREX: "lucide:globe",
  INDEX: "lucide:bar-chart-3",
  WTI: "lucide:droplets",
  XAU: "lucide:gem",
  XAG: "lucide:coins",
  BRN: "lucide:droplets",
  BMW: "logos:bmw",
  FERRARI: "logos:ferrari",
  VISA: "logos:visa",
  MASTERCARD: "logos:mastercard",
  DISNEY: "logos:disney",
  SAMSUNG: "logos:samsung",
  TOYOTA: "logos:toyota",
  MERCEDES: "logos:mercedes-benz",
  NIKE: "logos:nike",
  ADIDAS: "logos:adidas",
  STARBUCKS: "logos:starbucks",
  MCDONALDS: "logos:mcdonalds",
  BOEING: "logos:boeing",
  AIRBUS: "logos:airbus",
  SPACEX: "logos:spacex-icon",
  SONY: "logos:sony",
  PANASONIC: "logos:panasonic",
  IBM: "logos:ibm",
  ORACLE: "logos:oracle",
  SAP: "logos:sap",
  UBER: "logos:uber",
  AIRBNB: "logos:airbnb-icon",
  SPOTIFY: "logos:spotify-icon",
  ZOOM: "logos:zoom-icon",

  // --- 3. NAMIX CORE SYSTEM ICONS ---
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
  NAMIX_SCALE: Scale,
  NAMIX_GAVEL: Gavel,
  NAMIX_HISTORY: History,
  NAMIX_CHART: LineChart,
  NAMIX_BARS: BarChart3,
  NAMIX_PIE: PieChart,
  NAMIX_WAVES: Waves,
  NAMIX_LOCK: Lock,
  NAMIX_EYE: Eye,
  NAMIX_SCAN: Scan,
  NAMIX_FINGERPRINT: Fingerprint,
  NAMIX_UP: TrendingUp,
  NAMIX_DOWN: TrendingDown,
  NAMIX_BRIEFCASE: Briefcase,
  NAMIX_GIFT: Gift,
  NAMIX_TIMER: Timer,
  NAMIX_NAV: Navigation,
  NAMIX_KEY: KeyRound,
  NAMIX_FILE: FileText,
  NAMIX_USER: UserCheck,
  NAMIX_SEARCH: Search,
  NAMIX_CHECK: CheckCircle2,
  NAMIX_ALERT: AlertTriangle,
  NAMIX_HEART: Heart,
  NAMIX_TARGET: Target,
  NAMIX_FLAME: Flame,
  NAMIX_ROCKET: Rocket,
  NAMIX_CROWN: Crown,
  NAMIX_MEDAL: Medal,
  NAMIX_FLAG: Flag,
  NAMIX_ANCHOR: Anchor,
  NAMIX_COMPASS: Compass,
  NAMIX_AI: AIProcessor,
  NAMIX_CLICK: MousePointerClick,
  NAMIX_CHAT: MessageSquare
};

export const ICON_OPTIONS = Object.keys(CRYPTO_ICONS_MAP).map(key => ({
  id: key,
  label: key.replace('NAMIX_', '').replace('_', ' ')
}));

export function CryptoIcon({ name, color, size = 24, className }: { name: string, color?: string, size?: number, className?: string }) {
  const iconKey = (name || "").toUpperCase();
  
  // محرك التعرف الذكي: يحاول مطابقة الرمز مباشرة مع مكتبة cryptocurrency-icons
  const iconData = CRYPTO_ICONS_MAP[iconKey] || `cryptocurrency:${iconKey.toLowerCase()}`;
  
  if (typeof iconData === 'string') {
    return (
      <Icon 
        icon={iconData} 
        width={size} 
        height={size} 
        className={cn("shrink-0", className)}
        style={color ? { color } : undefined}
        // Fallback في حال لم يتم العثور على أيقونة العملة المحددة
        onError={(e) => {
          (e.target as any).src = `https://api.iconify.design/lucide:coins.svg?color=%2394a3b8`;
        }}
      />
    );
  }

  const LucideIcon = iconData || Coins;
  return (
    <div style={{ width: size, height: size }} className={cn("flex items-center justify-center shrink-0", className)}>
      <LucideIcon color={color || "currentColor"} size={size} strokeWidth={2.5} />
    </div>
  );
}
