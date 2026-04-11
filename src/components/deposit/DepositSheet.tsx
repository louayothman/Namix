
"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerPortal, DrawerOverlay } from "@/components/ui/drawer";
import { Badge } from "@/components/ui/badge";
import { useFirestore, useMemoFirebase, useCollection, useDoc } from "@/firebase";
import { doc, collection, query, where } from "firebase/firestore";
import { Icon } from "@iconify/react";
import { 
  ArrowUpCircle, 
  ChevronLeft,
  Sparkles,
  Gift,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DepositSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const NamixDotsIcon = () => (
  <div className="grid grid-cols-2 gap-1 scale-110">
    <div className="h-2 w-2 rounded-full bg-[#002d4d]" />
    <div className="h-2 w-2 rounded-full bg-[#f9a885]" />
    <div className="h-2 w-2 rounded-full bg-[#f9a885]" />
    <div className="h-2 w-2 rounded-full bg-[#002d4d]" />
  </div>
);

export function DepositSheet({ open, onOpenChange }: DepositSheetProps) {
  const router = useRouter();
  const db = useFirestore();

  const categoriesQuery = useMemoFirebase(() => query(collection(db, "deposit_methods"), where("isActive", "==", true)), [db]);
  const { data: categories, isLoading: loadingCats } = useCollection(categoriesQuery);

  const vaultBonusRef = useMemoFirebase(() => doc(db, "system_settings", "vault_bonus"), [db]);
  const { data: vaultBonus } = useDoc(vaultBonusRef);

  const maxBonus = useMemo(() => {
    if (!vaultBonus?.depositBonuses || vaultBonus.depositBonuses.length === 0) return 0;
    return Math.max(...vaultBonus.depositBonuses.map((b: any) => b.percent));
  }, [vaultBonus]);

  const handleSelectCategory = (categoryId: string) => {
    onOpenChange(false);
    router.push(`/deposit/${categoryId}`);
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerPortal>
        <DrawerOverlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1000]" />
        <DrawerContent className="fixed bottom-0 left-0 right-0 h-[80vh] outline-none flex flex-col bg-white rounded-t-[44px] border-none shadow-2xl z-[1001] font-body" dir="rtl">
          
          <DrawerHeader className="px-8 pt-6 shrink-0 flex flex-row items-center justify-between border-b border-gray-50 pb-4">
            <div className="flex items-center gap-4 text-right">
               <div className="h-11 w-11 rounded-2xl bg-[#002d4d] text-[#f9a885] flex items-center justify-center shadow-xl"><ArrowUpCircle size={24} /></div>
               <div className="space-y-0">
                 <DrawerTitle className="text-xl font-black text-[#002d4d]">إضافة رصيد</DrawerTitle>
                 <p className="text-gray-400 font-black text-[8px] uppercase tracking-widest mt-1">Capital Inflow Gateway</p>
               </div>
            </div>
          </DrawerHeader>

          <div className="flex-1 overflow-y-auto px-6 py-6 scrollbar-none">
            {loadingCats ? (
              <div className="h-full flex flex-col items-center justify-center py-20 gap-6">
                 <Loader2 className="h-10 w-10 animate-spin text-[#002d4d] opacity-20" />
                 <p className="text-[10px] font-black text-gray-300 uppercase animate-pulse">Scanning Nodes...</p>
              </div>
            ) : (
              <div className="space-y-8 animate-in fade-in duration-700">
                
                {maxBonus > 0 && (
                  <div className="p-6 bg-emerald-600 rounded-[32px] text-white relative overflow-hidden shadow-xl group">
                     <div className="absolute top-0 right-0 p-6 opacity-[0.1] -rotate-12 pointer-events-none group-hover:scale-125 transition-transform duration-1000">
                        <Sparkles size={100} />
                     </div>
                     <div className="flex items-center gap-5 relative z-10">
                        <div className="h-14 w-14 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-xl border border-white/20 shadow-inner">
                           <Gift className="h-7 w-7 text-[#f9a885] animate-bounce" />
                        </div>
                        <div className="text-right space-y-1">
                           <h4 className="font-black text-lg leading-tight">حوافز الإيداع نشطة</h4>
                           <p className="text-[11px] font-bold text-emerald-100 leading-relaxed">
                             مكافأة إضافية تصل إلى <span className="text-[#f9a885] font-black">%{maxBonus}</span> عند تعزيز رصيدك الآن.
                           </p>
                        </div>
                     </div>
                  </div>
                )}

                <div className="space-y-4">
                  <div className="flex items-center justify-between px-2">
                     <h3 className="text-base font-black text-[#002d4d]">حدد مسار الإيداع</h3>
                     <Badge variant="outline" className="bg-blue-50 text-blue-600 border-none font-black text-[8px] px-3 py-1 rounded-full uppercase">Select Node</Badge>
                  </div>

                  <div className="grid gap-3">
                    {categories?.map((cat) => (
                      <button 
                        key={cat.id} 
                        onClick={() => handleSelectCategory(cat.id)} 
                        className="w-full p-6 rounded-[32px] border border-gray-100 bg-white hover:border-[#002d4d] hover:shadow-xl transition-all duration-500 flex items-center gap-6 text-right group active:scale-[0.99] relative overflow-hidden"
                      >
                        <div className="h-14 w-14 rounded-[22px] bg-gray-50 flex items-center justify-center shadow-inner group-hover:bg-white transition-all shrink-0 overflow-hidden">
                          {cat.type === 'binance' ? (
                            <Icon icon="cryptocurrency-color:bnb" width={32} height={32} />
                          ) : (
                            <NamixDotsIcon />
                          )}
                        </div>
                        <div className="flex-1 space-y-1">
                           <p className="font-black text-base text-[#002d4d] group-hover:text-blue-600 transition-colors">{cat.name}</p>
                           <p className="text-[10px] font-bold text-gray-400 leading-relaxed line-clamp-2">{cat.description || "استخدم هذا المسار لإضافة الرصيد بذكاء وأمان."}</p>
                        </div>
                        <ChevronLeft className="h-5 w-5 text-gray-200 group-hover:text-[#002d4d] transition-all shrink-0 rotate-180" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </DrawerContent>
      </DrawerPortal>
    </Drawer>
  );
}
