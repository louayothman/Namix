
"use client";

import { useState } from "react";
import { Shell } from "@/components/layout/Shell";
import { DepositsHeader } from "@/components/admin/deposits/DepositsHeader";
import { DepositsMenu } from "@/components/admin/deposits/DepositsMenu";
import { PaymentApiSection } from "@/components/admin/deposits/PaymentApiSection";
import { DepositPortalsSection } from "@/components/admin/deposits/DepositPortalsSection";
import { RequestsLedgerSection } from "@/components/admin/deposits/RequestsLedgerSection";
import { AnimatePresence, motion } from "framer-motion";

/**
 * @fileOverview مركز إدارة تدفقات الخزينة v3.0 - Unified Sovereign Hub
 * قمرة قيادة موحدة تجمع بين ضبط الـ API، بوابات الدفع، وسجلات التدقيق اليدوي والآلي.
 */

type DepositsView = 'menu' | 'api' | 'portals' | 'ledger';

export default function AdminDepositsHub() {
  const [activeView, setActiveView] = useState<DepositsView>('menu');

  return (
    <Shell isAdmin>
      <div className="max-w-[1600px] mx-auto space-y-10 px-6 pt-10 pb-32 font-body text-right" dir="rtl">
        
        <DepositsHeader 
          activeView={activeView} 
          onBack={() => setActiveView('menu')} 
        />

        <div className="relative min-h-[600px]">
          <AnimatePresence mode="wait">
            {activeView === 'menu' && (
              <motion.div key="menu" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}>
                <DepositsMenu onSelect={setActiveView} />
              </motion.div>
            )}

            {activeView === 'api' && (
              <motion.div key="api" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="w-full">
                <PaymentApiSection />
              </motion.div>
            )}

            {activeView === 'portals' && (
              <motion.div key="portals" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="w-full">
                <DepositPortalsSection />
              </motion.div>
            )}

            {activeView === 'ledger' && (
              <motion.div key="ledger" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="w-full">
                <RequestsLedgerSection />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex flex-col items-center gap-4 pt-20 opacity-20 select-none">
           <p className="text-[10px] font-black text-[#002d4d] uppercase tracking-[0.8em]">Namix Treasury Infrastructure v3.0</p>
           <div className="flex gap-3">
              {[...Array(3)].map((_, i) => (<div key={i} className="h-1.5 w-1.5 rounded-full bg-gray-300" />))}
           </div>
        </div>
      </div>
    </Shell>
  );
}
