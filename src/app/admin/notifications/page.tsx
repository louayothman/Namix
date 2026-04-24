
"use client";

import { useState } from "react";
import { Shell } from "@/components/layout/Shell";
import { AnimatePresence, motion } from "framer-motion";
import { DashboardMenu } from "@/components/admin/notifications/DashboardMenu";
import { ChannelSelector } from "@/components/admin/notifications/ChannelSelector";
import { AppBroadcastForm } from "@/components/admin/notifications/AppBroadcastForm";
import { PushBroadcastForm } from "@/components/admin/notifications/PushBroadcastForm";
import { GlobalBroadcastForm } from "@/components/admin/notifications/GlobalBroadcastForm";
import { HistoryLedgerView } from "@/components/admin/notifications/HistoryLedgerView";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

/**
 * @fileOverview مركز إدارة الاتصال المؤسساتي v17.0
 * دعم القنوات الأربع: داخلي، بريد، بوش، وشامل.
 */

type ViewState = 'menu' | 'channels' | 'form_app' | 'form_push' | 'form_global' | 'history';

export default function AdminNotificationsPage() {
  const [view, setView] = useState<ViewState>('menu');
  const router = useRouter();

  const handleBack = () => {
    if (view === 'channels' || view === 'history') setView('menu');
    else if (view.startsWith('form_')) setView('channels');
    else setView('menu');
  };

  const handleChannelSelect = (id: string) => {
    if (id === 'form_email') {
      router.push("/admin/notifications/email-builder");
    } else {
      setView(id as any);
    }
  };

  return (
    <Shell isAdmin>
      <div className="max-w-[1600px] mx-auto space-y-10 px-6 pt-10 pb-32 font-body text-right" dir="rtl">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-gray-100 pb-10">
          <div className="space-y-2 text-right">
            <div className="flex items-center gap-2 text-blue-500 font-black text-[10px] uppercase tracking-[0.4em] justify-start">
              <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
              Communication Operations Center
            </div>
            <h1 className="text-4xl font-black text-[#002d4d] tracking-tight">
              {view === 'menu' && "إدارة الاتصال المؤسساتي"}
              {view === 'channels' && "تحديد قناة البث"}
              {view === 'form_app' && "بث إشعارات التطبيق"}
              {view === 'form_push' && "بث التنبيهات الخارجية (Push)"}
              {view === 'form_global' && "البث الموحد الشامل"}
              {view === 'history' && "أرشيف العمليات التاريخي"}
            </h1>
            <p className="text-muted-foreground font-bold text-xs">تحكم مركزي في تدفق المعلومات عبر القنوات الأربع المعتمدة.</p>
          </div>
          
          {view !== 'menu' && (
            <Button 
              variant="ghost" 
              onClick={handleBack}
              className="rounded-full h-14 px-8 bg-white border border-gray-100 shadow-sm hover:shadow-md font-black text-[11px] text-[#002d4d] gap-3"
            >
              <ChevronRight className="h-5 w-5" /> العودة للمحطة السابقة
            </Button>
          )}
        </div>

        <div className="relative min-h-[600px]">
          <AnimatePresence mode="wait">
            {view === 'menu' && (
              <motion.div key="menu" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}>
                <DashboardMenu onSelect={setView} />
              </motion.div>
            )}

            {view === 'channels' && (
              <motion.div key="channels" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}>
                <ChannelSelector onSelect={handleChannelSelect} />
              </motion.div>
            )}

            {view === 'form_app' && (
              <motion.div key="app" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                <AppBroadcastForm onSuccess={() => setView('history')} />
              </motion.div>
            )}

            {view === 'form_push' && (
              <motion.div key="push" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                <PushBroadcastForm onSuccess={() => setView('history')} />
              </motion.div>
            )}

            {view === 'form_global' && (
              <motion.div key="global" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                <GlobalBroadcastForm onSuccess={() => setView('history')} />
              </motion.div>
            )}

            {view === 'history' && (
              <motion.div key="history" initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 50 }}>
                <HistoryLedgerView />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex flex-col items-center gap-4 pt-24 opacity-20 select-none">
           <p className="text-[10px] font-black text-[#002d4d] uppercase tracking-[0.8em]">Namix Messaging Infrastructure</p>
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
