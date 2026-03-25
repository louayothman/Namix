
"use client";

import React from "react";
import { 
  Bitcoin, 
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
  Banknote
} from "lucide-react";

/**
 * NAMIX STABLE ICONS v2.1
 * Updated to support currentColor for dynamic styling within card groups.
 */

export const CRYPTO_ICONS_MAP: Record<string, any> = {
  Bitcoin,
  Ethereum: Diamond,
  Tether: Coins,
  Solana: Zap,
  Xrp: Activity,
  Coins,
  Zap,
  Globe,
  Activity,
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
  Banknote
};

export function CryptoIcon({ name, color = "currentColor", size = 24 }: { name: string, color?: string, size?: number }) {
  const Icon = CRYPTO_ICONS_MAP[name] || CRYPTO_ICONS_MAP.Coins;
  return (
    <div style={{ width: size, height: size }} className="flex items-center justify-center">
      <Icon color={color} size={size} strokeWidth={2.5} />
    </div>
  );
}
