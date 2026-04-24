
"use client";

import { useState } from "react";
import { Shell } from "@/components/layout/Shell";
import { BotsInventory } from "@/components/admin/telegram/BotsInventory";
import { SignalHistory } from "@/components/admin/telegram/SignalHistory";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronRight, Send, History, Sparkles, Zap, Bot } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * @fileOverview مركز إدارة أوركسترا تلغرام v1.0
 * قمرة قيادة موحدة لإدارة بوتات البث المتعددة وسجلات الإشارات اللحظية.
 */

type ViewState = 'inventory' | 'history';

export default function AdminTelegramHub() {
  const [view, setView] = useState<ViewState>('inventory');

  return (
    <Shell isAdmin>
      <div className="max-w-[1600px] mx-auto space-y-10 px-6 pt-10 pb-32 font-body text-right" dir="rtl">
        
        {/* Hub Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-gray-100 pb-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-blue-500 font-black text-[10px] uppercase tracking-[0.4em] justify-end">
              <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
              Telegram Matrix Command
            </div>
            <h1 className="text-4xl font-black text-[#002d4d] tracking-tight">
              {view === 'inventory' ? "إدارة مصفوفة البوتات" : "سجل البث الاستراتيجي"}
            </h1>
            <p className="text-muted-foreground font-bold text-xs">التحكم في بوتات تلغرام، إدارة التوكنات، ومراقبة تدفق الإشارات العالمية.</p>
          </div>
          
          <div className="flex items-center gap-3">
             <Button 
               variant="ghost" 
               onClick={() => setView(view === 'inventory' ? 'history' : 'inventory')}
               className="rounded-full h-14 px-8 bg-white border border-gray-100 shadow-sm hover:shadow-md font-black text-[11px] text-[#002d4d] gap-3"
             >
                {view === 'inventory' ? (
                  <><History className="h-5 w-5 text-orange-500" /> سجل البث</>
                ) : (
                  <><Bot className="h-5 w-5 text-blue-500" /> مصفوفة البوتات</>
                )}
             </Button>
             <Button 
               variant="ghost" 
               onClick={() => window.location.href = '/admin/trade'}
               className="rounded-full h-14 px-8 bg-white border border-gray-100 shadow-sm hover:shadow-md font-black text-[11px] text-[#002d4d] gap-3"
             >
               <ChevronRight className="h-5 w-5" /> العودة للقمرة
             </Button>
          </div>
        </div>

        <div className="relative min-h-[600px]">
          <AnimatePresence mode="wait">
            {view === 'inventory' ? (
              <motion.div key="inv" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}>
                <BotsInventory />
              </motion.div>
            ) : (
              <motion.div key="hist" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}>
                <SignalHistory />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sovereign Footer */}
        <div className="flex flex-col items-center gap-4 pt-24 opacity-20 select-none">
           <p className="text-[10px] font-black text-[#002d4d] uppercase tracking-[0.8em]">Namix Telegram Infrastructure v1.0</p>
           <div className="flex gap-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-1.5 w-1.5 rounded-full bg-gray-300" />
              ))}
           </div>
        </div>
      </div>
    </Shell>
  );
}
