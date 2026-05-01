
"use client";

import { useState } from "react";
import { Shell } from "@/components/layout/Shell";
import { BotsInventory } from "@/components/admin/telegram/BotsInventory";
import { SignalHistory } from "@/components/admin/telegram/SignalHistory";
import { BotSettingsView } from "@/components/admin/telegram/BotSettingsView";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  ChevronRight, 
  History, 
  Bot, 
  Settings2,
  Loader2 
} from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * @fileOverview مركز إدارة أوركسترا تلغرام v4.0 - Individual Bot Customization
 * تم إصلاح خطأ Activity وتمكين المشرف من تخصيص كل بوت بشكل مستقل تماماً.
 */

type ViewState = 'inventory' | 'history' | 'bot_settings';

export default function AdminTelegramHub() {
  const [view, setView] = useState<ViewState>('inventory');
  const [selectedBotId, setSelectedBotId] = useState<string | null>(null);

  const handleOpenBotSettings = (botId: string) => {
    setSelectedBotId(botId);
    setView('bot_settings');
  };

  const handleBack = () => {
    if (view === 'bot_settings') {
      setView('inventory');
      setSelectedBotId(null);
    } else {
      setView('inventory');
    }
  };

  return (
    <Shell isAdmin>
      <div className="max-w-[1600px] mx-auto space-y-10 px-6 pt-10 pb-32 font-body text-right" dir="rtl">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-gray-100 pb-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-blue-500 font-black text-[10px] uppercase tracking-[0.4em] justify-end">
              <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
              Telegram Matrix Command v4.0
            </div>
            <h1 className="text-4xl font-black text-[#002d4d] tracking-tight">
              {view === 'inventory' ? "مصفوفة البوتات" : view === 'history' ? "سجل البث" : "تخصيص العقدة المستقلة"}
            </h1>
            <p className="text-muted-foreground font-bold text-xs">إدارة البوتات بشكل فردي، معايرة التوكنات، وهندسة النبض الاستباقي لكل محطة.</p>
          </div>
          
          <div className="flex items-center gap-3">
             {view !== 'inventory' && (
               <Button 
                 onClick={handleBack}
                 variant="ghost" 
                 className="rounded-full h-14 px-8 bg-white border border-gray-100 shadow-sm hover:shadow-md font-black text-[11px] text-[#002d4d] gap-3"
               >
                  <ChevronRight className="h-5 w-5" /> العودة للمصفوفة
               </Button>
             )}
             {view === 'inventory' && (
               <button 
                 onClick={() => setView('history')}
                 className="rounded-full h-14 px-8 bg-white border border-gray-100 shadow-sm hover:shadow-md font-black text-[11px] text-[#002d4d] gap-3 flex items-center transition-all"
               >
                  <History className="h-5 w-5 text-orange-500" />
                  سجل البث العالمي
               </button>
             )}
          </div>
        </div>

        <div className="relative min-h-[600px]">
          <AnimatePresence mode="wait">
            {view === 'inventory' && (
              <motion.div key="inv" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}>
                <BotsInventory onOpenSettings={handleOpenBotSettings} />
              </motion.div>
            )}

            {view === 'history' && (
              <motion.div key="hist" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}>
                <SignalHistory />
              </motion.div>
            )}

            {view === 'bot_settings' && selectedBotId && (
              <motion.div key="cust" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                <BotSettingsView botId={selectedBotId} onBack={handleBack} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex flex-col items-center gap-4 pt-24 opacity-20 select-none">
           <p className="text-[10px] font-black text-[#002d4d] uppercase tracking-[0.8em]">Namix Telegram Infrastructure v4.0</p>
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
