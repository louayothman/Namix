
"use client";

import { useState } from "react";
import { Shell } from "@/components/layout/Shell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Settings2, 
  History, 
  ChevronLeft,
  Zap,
  ShieldCheck,
  LayoutGrid
} from "lucide-react";
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, query, orderBy } from "firebase/firestore";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

// مكونات مستقلة لمنع تكرار التعريفات والتعارضات
import { WithdrawSettingsSection } from "./WithdrawSettingsSection";
import { WithdrawPortalsSection } from "./WithdrawPortalsSection";
import { RequestsLedgerSection } from "./RequestsLedgerSection";

/**
 * @fileOverview مركز إدارة تدفقات الخروج السيادية v6.0 - modular Architecture
 * تم تقسيم الصفحة لثلاثة مكونات رئيسية معزولة لضمان سهولة الإدارة وتجنب أخطاء البناء.
 */

type WithdrawView = 'menu' | 'settings' | 'portals' | 'ledger';

export default function AdminWithdrawalsHub() {
  const [activeView, setActiveView] = useState<WithdrawView>('menu');
  const db = useFirestore();

  const withdrawalsQuery = useMemoFirebase(() => query(collection(db, "withdraw_requests"), orderBy("createdAt", "desc")), [db]);
  const { data: allWithdrawals } = useCollection(withdrawalsQuery);

  const pendingCount = allWithdrawals?.filter(w => w.status === 'pending').length || 0;

  const menuItems = [
    { id: 'settings', title: "ضبط إعدادات السحب", desc: "حوكمة العمولات وقوانين حماية الرصيد الترحيبي", icon: Settings2, color: "text-blue-600", bg: "bg-blue-50" },
    { id: 'portals', title: "هندسة بوابات السحب", desc: "تخصيص قنوات صرف الأرباح وتعليمات الاستلام", icon: Zap, color: "text-emerald-600", bg: "bg-emerald-50" },
    { id: 'ledger', title: "سجل العمليات والتدقيق", desc: "مراجعة واعتماد طلبات سحب السيولة الحية", icon: History, color: "text-orange-500", bg: "bg-orange-50", badge: pendingCount },
  ];

  return (
    <Shell isAdmin>
      <div className="max-w-[1600px] mx-auto space-y-10 px-6 pt-10 pb-32 font-body text-right" dir="rtl">
        
        {/* Dynamic Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-gray-100 pb-8">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-orange-500 font-black text-[10px] uppercase tracking-[0.4em] justify-end">
              <div className="h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
              Liquidity Outflow Command
            </div>
            <h1 className="text-4xl font-black text-[#002d4d] tracking-tight">
              {activeView === 'menu' ? 'إدارة سحب الأرباح' : menuItems.find(m => m.id === activeView)?.title}
            </h1>
            <p className="text-muted-foreground font-bold text-xs">المركز السيادي الموحد لإدارة خروج الأموال وحوكمة السيولة.</p>
          </div>
          
          {activeView !== 'menu' && (
            <Button 
              variant="ghost" 
              onClick={() => setActiveView('menu')}
              className="rounded-full h-14 px-8 bg-white border border-gray-100 shadow-sm hover:shadow-md font-black text-[11px] text-[#002d4d] gap-3"
            >
              <ChevronLeft className="h-5 w-5" /> العودة للقائمة
            </Button>
          )}
        </div>

        <div className="relative min-h-[600px]">
          <AnimatePresence mode="wait">
            {activeView === 'menu' && (
              <motion.div key="menu" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="grid gap-8 md:grid-cols-3">
                 {menuItems.map((item) => (
                    <motion.button
                      key={item.id}
                      whileHover={{ y: -8, scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setActiveView(item.id as any)}
                      className="text-right outline-none block h-full group"
                    >
                      <div className="h-full bg-white rounded-[56px] border border-gray-50 shadow-sm p-10 flex flex-col gap-10 relative overflow-hidden">
                        <div className={cn("absolute -top-10 -left-10 p-10 opacity-[0.02] group-hover:rotate-12 transition-transform duration-1000", item.color)}>
                           <item.icon size={200} />
                        </div>
                        <div className="flex items-center justify-between relative z-10">
                           <div className={cn("h-20 w-20 rounded-[28px] flex items-center justify-center shadow-inner", item.bg, item.color)}>
                              <item.icon size={32} />
                           </div>
                           {item.badge ? <Badge className="bg-red-500 text-white border-none px-3 py-1 rounded-full text-xs font-black">{item.badge}</Badge> : <div className="h-10 w-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-300 group-hover:bg-[#002d4d] group-hover:text-[#f9a885] transition-all"><ChevronLeft size={20} /></div>}
                        </div>
                        <div className="space-y-3 relative z-10 flex-1">
                           <h3 className="text-2xl font-black text-[#002d4d]">{item.title}</h3>
                           <p className="text-[13px] font-bold text-gray-400 leading-relaxed">{item.desc}</p>
                        </div>
                      </div>
                    </motion.button>
                 ))}
              </motion.div>
            )}

            {activeView === 'settings' && (
              <motion.div key="settings" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}>
                <WithdrawSettingsSection />
              </motion.div>
            )}

            {activeView === 'portals' && (
              <motion.div key="portals" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}>
                <WithdrawPortalsSection />
              </motion.div>
            )}

            {activeView === 'ledger' && (
              <motion.div key="ledger" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}>
                <RequestsLedgerSection />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex flex-col items-center gap-4 pt-20 opacity-20 select-none">
           <p className="text-[10px] font-black text-[#002d4d] uppercase tracking-[0.8em]">Namix Treasury Infrastructure v6.0</p>
           <div className="flex gap-3">
              {[...Array(3)].map((_, i) => (<div key={i} className="h-1.5 w-1.5 rounded-full bg-gray-300" />))}
           </div>
        </div>
      </div>
    </Shell>
  );
}
