
"use client";

import { useEffect, useState, useMemo } from "react";
import { Shell } from "@/components/layout/Shell";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, query, where, orderBy, doc, onSnapshot } from "firebase/firestore";
import { 
  PieChart, 
  Clock, 
  CheckCircle2, 
  TrendingUp, 
  Calendar, 
  AlertCircle, 
  ExternalLink, 
  Loader2, 
  ChevronRight, 
  Sparkles, 
  Zap,
  Filter,
  ArrowUpDown,
  ShieldCheck,
  Coins,
  Search,
  Activity,
  History,
  ChevronDown
} from "lucide-react";
import { format, parseISO, differenceInMilliseconds } from "date-fns";
import { ar } from "date-fns/locale/ar";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

/**
 * AnimatedDigit - محرك الخانة الرقمية المنزلقة
 */
function AnimatedDigit({ digit }: { digit: string }) {
  if (digit === "." || digit === "$" || digit === ",") {
    return <span className="inline-block px-0.5">{digit}</span>;
  }
  const num = parseInt(digit);
  if (isNaN(num)) return <span className="inline-block">{digit}</span>;
  return (
    <div className="relative h-[20px] w-[10px] overflow-hidden inline-block leading-none">
      <motion.div
        animate={{ y: -num * 20 }}
        transition={{ type: "spring", stiffness: 400, damping: 35 }}
        className="absolute top-0 left-0 flex flex-col items-center"
      >
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
          <div key={n} className="h-[20px] flex items-center justify-center font-black">
            {n}
          </div>
        ))}
      </motion.div>
    </div>
  );
}

/**
 * InvestmentNode - بطاقة العقد الاستثماري المطور
 */
function InvestmentNode({ inv, now }: { inv: any, now: Date }) {
  const getProgressData = () => {
    try {
      const start = parseISO(inv.startTime);
      const end = parseISO(inv.endTime);
      const totalMs = differenceInMilliseconds(end, start);
      const elapsedMs = differenceInMilliseconds(now, start);
      const percent = Math.min(Math.max(Math.floor((elapsedMs / totalMs) * 100), 0), 100);
      const accrued = (Math.min(Math.max(elapsedMs / totalMs, 0), 1) * inv.expectedProfit);
      return { percent, accrued };
    } catch (e) { return { percent: 0, accrued: 0 }; }
  };

  const { percent, accrued } = getProgressData();
  const isActive = inv.status === 'active';
  const targetReturn = inv.amount + inv.expectedProfit;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-full"
    >
      <Card className={cn(
        "border-none shadow-sm rounded-[44px] overflow-hidden bg-white transition-all duration-700 hover:shadow-2xl hover:-translate-y-1 relative group flex flex-col h-full border border-gray-50/50",
        !isActive && "opacity-80"
      )}>
        {/* Sovereign Watermark Icon */}
        <div className="absolute -bottom-6 -left-6 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity duration-1000 pointer-events-none text-[#002d4d]">
           {isActive ? <TrendingUp size={160} /> : <CheckCircle2 size={160} />}
        </div>

        <CardContent className="p-7 space-y-6 flex-1 flex flex-col relative z-10">
          {/* Header Node */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4 text-right">
              <div className={cn(
                "h-12 w-12 rounded-[18px] flex items-center justify-center shadow-inner transition-transform group-hover:rotate-12",
                isActive ? "bg-blue-50 text-blue-600" : "bg-emerald-50 text-emerald-600"
              )}>
                {isActive ? <Zap size={22} className="fill-current" /> : <ShieldCheck size={22} />}
              </div>
              <div className="text-right">
                <h4 className="font-black text-[15px] text-[#002d4d] leading-none">{inv.planTitle}</h4>
                <p className="text-[8px] font-black text-gray-300 uppercase tracking-widest mt-1.5">NODE ID: {inv.id.slice(-6).toUpperCase()}</p>
              </div>
            </div>
            <Badge className={cn(
              "font-black text-[8px] border-none px-3 py-1 rounded-full shadow-sm tracking-widest uppercase",
              isActive ? "bg-blue-500 text-white" : "bg-emerald-500 text-white"
            )}>
              {isActive ? "ACTIVE" : "COMPLETED"}
            </Badge>
          </div>

          {/* Value Matrix */}
          <div className="grid grid-cols-2 gap-3">
             <div className="p-4 bg-gray-50/50 rounded-[24px] border border-gray-100/50 space-y-1 shadow-inner text-right">
                <p className="text-[7px] font-black text-gray-400 uppercase tracking-widest">Principal Capital</p>
                <p className="text-sm font-black text-[#002d4d] tabular-nums">${inv.amount.toLocaleString()}</p>
             </div>
             <div className="p-4 bg-emerald-50/30 rounded-[24px] border border-emerald-100/20 space-y-1 shadow-inner text-right">
                <p className="text-[7px] font-black text-emerald-600/60 uppercase tracking-widest">Total Yield</p>
                <p className="text-sm font-black text-emerald-600 tabular-nums">${targetReturn.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
             </div>
          </div>

          {/* Live Yield Engine (Only for Active) */}
          {isActive && (
            <div className="p-5 bg-[#002d4d] rounded-[32px] space-y-3 relative overflow-hidden group/yield shadow-xl">
               <div className="flex justify-between items-center relative z-10">
                  <span className="text-[8px] font-black text-blue-200/40 uppercase tracking-widest">Real-time Yield Stream</span>
                  <div className="flex items-center text-lg font-black text-[#f9a885] tabular-nums tracking-tighter h-[20px]" dir="ltr">
                    <span>+</span>
                    <span>$</span>
                    {accrued.toFixed(3).split("").map((char, i) => (
                      <AnimatedDigit key={i} digit={char} />
                    ))}
                  </div>
               </div>
               
               {/* Progress Rail with Shimmer */}
               <div className="relative h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${percent}%` }}
                    className="absolute right-0 h-full bg-white rounded-full overflow-hidden"
                  >
                     <motion.div 
                        animate={{ x: ['100%', '-100%'] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[-20deg]"
                     />
                  </motion.div>
               </div>
               <div className="flex justify-between items-center px-1 opacity-40">
                  <span className="text-[7px] font-black text-white tabular-nums">%{percent} Progress</span>
                  <Activity size={8} className="text-[#f9a885] animate-pulse" />
               </div>
            </div>
          )}

          {/* Static Metadata Footer */}
          <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
             <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-full bg-gray-50 flex items-center justify-center text-blue-500 shadow-sm">
                   <Clock size={12} />
                </div>
                <div className="text-right">
                   <p className="text-[7px] font-black text-gray-300 uppercase">Settlement Date</p>
                   <p className="text-[10px] font-black text-[#002d4d]">{format(parseISO(inv.endTime), "dd MMM yyyy", { locale: ar })}</p>
                </div>
             </div>
             <Badge variant="outline" className="text-[7px] font-black border-gray-100 text-gray-400 rounded-md">
                YIELD %{inv.profitPercent}
             </Badge>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function MyInvestmentsPage() {
  const [localUser, setLocalUser] = useState<any>(null);
  const [filter, setFilter] = useState<'newest' | 'oldest' | 'highest'>('newest');
  const [now, setNow] = useState(new Date());
  const db = useFirestore();
  const router = useRouter();

  useEffect(() => {
    const session = localStorage.getItem("namix_user");
    if (session) setLocalUser(JSON.parse(session));
    const timer = setInterval(() => setNow(new Date()), 100);
    return () => clearInterval(timer);
  }, []);

  const investmentsQuery = useMemoFirebase(() => {
    if (!localUser?.id) return null;
    return query(
      collection(db, "investments"),
      where("userId", "==", localUser.id),
      orderBy("createdAt", filter === 'oldest' ? 'asc' : 'desc')
    );
  }, [db, localUser?.id, filter]);

  const { data: investments, isLoading, error } = useCollection(investmentsQuery);

  const sortedInvestments = useMemo(() => {
    if (!investments) return [];
    if (filter === 'highest') {
      return [...investments].sort((a, b) => b.amount - a.amount);
    }
    return investments;
  }, [investments, filter]);

  return (
    <Shell>
      <div className="max-w-6xl mx-auto space-y-10 px-6 pt-10 pb-32 font-body text-right" dir="rtl">
        
        {/* Luxury Header Control - Realigned to Top */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-gray-100 pb-8">
          <div className="flex items-center gap-3">
             <button 
               onClick={() => router.back()} 
               className="h-12 w-12 rounded-[20px] bg-white shadow-sm border border-gray-100 flex items-center justify-center text-[#002d4d] hover:shadow-xl transition-all active:scale-90 group"
             >
               <ChevronRight className="h-6 w-6 transition-transform group-hover:translate-x-1" />
             </button>
             
             <DropdownMenu>
                <DropdownMenuTrigger asChild>
                   <Button variant="outline" className="h-12 px-6 rounded-full border-gray-100 bg-white shadow-sm font-black text-[10px] gap-3 hover:bg-gray-50 transition-all active:scale-95">
                      <Filter className="h-4 w-4 text-blue-500" />
                      <span>تصفية الأصول</span>
                   </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="rounded-[28px] border-none shadow-2xl p-2 min-w-[200px] font-body bg-white/95 backdrop-blur-xl z-[1002]" dir="rtl">
                   {[
                     { id: 'newest', label: 'الأحدث أولاً', icon: Clock },
                     { id: 'oldest', label: 'الأقدم أولاً', icon: History },
                     { id: 'highest', label: 'الأعلى مبلغاً', icon: Coins }
                   ].map((opt) => (
                     <DropdownMenuItem 
                       key={opt.id} 
                       onClick={() => setFilter(opt.id as any)}
                       className={cn(
                         "flex items-center justify-between py-3 px-5 rounded-2xl cursor-pointer transition-all mb-1 font-black text-[11px]",
                         filter === opt.id ? "bg-blue-50 text-blue-600" : "text-gray-500 hover:bg-gray-50"
                       )}
                     >
                        <div className="flex items-center gap-3">
                           <opt.icon className="h-3.5 w-3.5" />
                           {opt.label}
                        </div>
                        {filter === opt.id && <div className="h-1.5 w-1.5 rounded-full bg-blue-600" />}
                     </DropdownMenuItem>
                   ))}
                </DropdownMenuContent>
             </DropdownMenu>

             <Link href="/invest">
                <Button className="h-12 px-6 rounded-full bg-[#002d4d] text-[#f9a885] hover:bg-[#001d33] shadow-lg font-black text-[10px] gap-3 transition-all active:scale-95 group/invest">
                   <Zap className="h-4 w-4 fill-current transition-transform group-hover/invest:scale-125" />
                   <span>استثمر المزيد</span>
                </Button>
             </Link>
          </div>

          <div className="space-y-1 text-right">
            <div className="flex items-center gap-2 text-blue-500 font-black text-[9px] uppercase tracking-[0.4em] justify-start md:justify-end">
              <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
              Sovereign Asset Ledger
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-[#002d4d] tracking-tight">استثماراتي</h1>
            <p className="text-muted-foreground font-bold text-[11px] flex items-center gap-2 justify-start md:justify-end">
               <Sparkles className="h-3.5 w-3.5 text-[#f9a885]" /> مراجعة كافة عقود التشغيل والبصمة المالية المحققة.
            </p>
          </div>
        </div>

        {error && (
          <Alert variant="destructive" className="rounded-[40px] border-none bg-red-50 text-red-900 p-8 shadow-xl animate-in zoom-in-95">
            <div className="flex items-start gap-6">
               <div className="h-14 w-14 rounded-2xl bg-white flex items-center justify-center shadow-inner shrink-0">
                  <AlertCircle className="h-8 w-8 text-red-500" />
               </div>
               <div className="space-y-2">
                  <AlertTitle className="font-black text-lg">مطلوب إنشاء فهرس للبيانات</AlertTitle>
                  <AlertDescription className="text-[12px] font-bold leading-relaxed opacity-80">
                    يرجى إنشاء الفهرس المطلوب في Firebase Console لضمان جلب وتصفية سجلات استثماراتك.
                  </AlertDescription>
                  <div className="pt-4">
                    {error.message.includes("https://") && (
                      <a 
                        href={"https://" + error.message.split("https://")[1].split(" ")[0]} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-[#002d4d] text-[#f9a885] px-6 py-3 rounded-full font-black text-[10px] uppercase tracking-widest shadow-xl"
                      >
                        <ExternalLink className="h-4 w-4" />
                        إنشاء الفهرس الآن
                      </a>
                    )}
                  </div>
               </div>
            </div>
          </Alert>
        )}

        {/* Dynamic Grid Layout */}
        <div className="space-y-10">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-40 gap-6">
              <div className="relative">
                 <div className="h-20 w-20 border-[3px] border-gray-50 border-t-blue-600 rounded-full animate-spin" />
                 <div className="absolute inset-0 flex items-center justify-center text-blue-600">
                    <TrendingUp className="h-8 w-8" />
                 </div>
              </div>
              <p className="text-[11px] font-black text-gray-400 uppercase tracking-[0.5em] animate-pulse">Syncing Asset Nodes...</p>
            </div>
          ) : sortedInvestments && sortedInvestments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {sortedInvestments.map((inv) => (
                <InvestmentNode key={inv.id} inv={inv} now={now} />
              ))}
            </div>
          ) : !error && (
            <div className="text-center py-48 bg-white/40 rounded-[64px] border-2 border-dashed border-gray-100 flex flex-col items-center gap-8 opacity-40">
              <div className="h-24 w-24 bg-gray-50 rounded-[48px] flex items-center justify-center shadow-inner">
                <PieChart className="h-12 w-12 text-gray-200" />
              </div>
              <div className="space-y-2">
                <p className="text-xl font-black text-[#002d4d] uppercase tracking-widest">No Active Contracts</p>
                <p className="text-sm font-bold text-gray-400">لم تقم بتفعيل أي عقود استثمارية في النظام بعد.</p>
              </div>
              <Link href="/invest">
                 <Button className="h-14 px-10 rounded-full bg-[#002d4d] text-white font-black text-sm shadow-xl active:scale-95">تفعيل أول عقد الآن</Button>
              </Link>
            </div>
          )}
        </div>

        {/* Global Branding Footer */}
        <div className="flex flex-col items-center gap-4 pt-20 opacity-20 select-none">
           <p className="text-[10px] font-black text-[#002d4d] uppercase tracking-[0.8em]">Namix Sovereign Ledger v2.0</p>
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
