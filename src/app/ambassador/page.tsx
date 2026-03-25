
"use client";

import { useEffect, useState, useMemo } from "react";
import { Shell } from "@/components/layout/Shell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Logo } from "@/components/layout/Logo";
import { 
  Share2, 
  Users, 
  Copy, 
  Check, 
  ChevronRight, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  Coins,
  Info,
  Loader2,
  QrCode,
  Trophy,
  Crown,
  Medal,
  Target,
  ChevronLeft,
  Gift,
  Timer,
  Activity,
  Globe
} from "lucide-react";
import { useFirestore, useDoc, useCollection, useMemoFirebase } from "@/firebase";
import { doc, collection, query, where, onSnapshot, orderBy, limit } from "firebase/firestore";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";

/**
 * @fileOverview مركز الشركاء السيادي v5100.0 - الإصدار الانسيابي الكامل
 * تم إصلاح مشاكل التجاوز الأفقي لضمان ملاءمة مثالية لشاشات الموبايل دون الحاجة لعمل Zoom out.
 */
export default function AmbassadorPage() {
  const [localUser, setLocalUser] = useState<any>(null);
  const [dbUser, setDbUser] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [networkStats, setNetworkStats] = useState({ totalInvites: 0, networkYield: 0 });
  const [isChallengeOpen, setIsChallengeOpen] = useState(false);
  
  const db = useFirestore();
  const partnershipDocRef = useMemoFirebase(() => doc(db, "system_settings", "partnership"), [db]);
  const { data: partnershipConfig, isLoading: loadingConfig } = useDoc(partnershipDocRef);

  const topPartnersQuery = useMemoFirebase(() => query(collection(db, "users"), orderBy("referralEarnings", "desc"), limit(5)), [db]);
  const { data: realPartners } = useCollection(topPartnersQuery);

  useEffect(() => {
    const session = localStorage.getItem("namix_user");
    if (session) {
      const parsed = JSON.parse(session);
      setLocalUser(parsed);
      const userRef = doc(db, "users", parsed.id);
      const unsub = onSnapshot(userRef, (snap) => {
        if (snap.exists()) {
          const userData = snap.data();
          setDbUser({ ...userData, id: snap.id });
          setNetworkStats(prev => ({ ...prev, networkYield: userData.referralEarnings || 0 }));
        }
      });
      
      const q = query(collection(db, "users"), where("referredBy", "==", parsed.id));
      const unsubInvites = onSnapshot(q, (snap) => {
        setNetworkStats(prev => ({ ...prev, totalInvites: snap.size }));
      });

      return () => { unsub(); unsubInvites(); };
    }
  }, [db]);

  const leaderboardMode = partnershipConfig?.leaderboardMode || 'real';
  const leaderboardData = leaderboardMode === 'manual' ? (partnershipConfig?.manualLeaderboard || []) : (realPartners || []);

  const userRank = useMemo(() => {
    if (!leaderboardData || !dbUser) return null;
    const index = leaderboardData.findIndex((p: any) => (p.id === dbUser.id || p.displayName === dbUser.displayName || p.name === dbUser.displayName));
    return index !== -1 ? index + 1 : null;
  }, [leaderboardData, dbUser]);

  const invitationCode = dbUser?.referralCode || "...";
  const referralLink = typeof window !== "undefined" ? `${window.location.origin}/login?ref=${invitationCode}` : "";

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  if (loadingConfig) return <div className="min-h-screen flex items-center justify-center bg-white"><Loader2 className="animate-spin text-[#002d4d]" /></div>;

  return (
    <Shell>
      <div className="max-w-6xl mx-auto space-y-8 md:space-y-10 px-4 md:px-6 pt-10 pb-32 font-body text-right overflow-x-hidden" dir="rtl">
        
        {/* Responsive Header Group */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-gray-100 pb-8">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-orange-500 font-black text-[9px] uppercase tracking-[0.4em] justify-start">
              <div className="h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
              Sovereign Ambassador Hub
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-[#002d4d] tracking-tight">مركز الشركاء والقادة</h1>
            <p className="text-muted-foreground font-bold text-[11px] md:text-xs leading-relaxed">قم بتوسيع محفظتك الاستراتيجية من خلال تنمية شبكتك العالمية.</p>
          </div>
          <Link href="/profile" className="w-full md:w-auto">
            <Button variant="ghost" className="w-full md:w-auto rounded-full bg-white shadow-sm h-12 md:h-14 px-8 border border-gray-50 active:scale-95 transition-all hover:shadow-md font-black text-[10px] text-[#002d4d]">
              <ChevronRight className="ml-2 h-5 w-5" /> العودة للملف الشخصي
            </Button>
          </Link>
        </div>

        <div className="grid gap-8 lg:gap-10 lg:grid-cols-12 items-start">
          
          {/* Main Controls & Identity - Column 1 */}
          <div className="lg:col-span-7 space-y-8 md:space-y-10 min-w-0">
            
            {/* Identity & Link Card - Fluid Scaling */}
            <Card className="border-none shadow-2xl rounded-[48px] md:rounded-[56px] bg-[#002d4d] text-white overflow-hidden relative group">
              <div className="absolute top-0 right-0 p-12 opacity-[0.03] -rotate-12 pointer-events-none group-hover:scale-110 transition-transform duration-1000">
                 <QrCode className="h-64 w-64 md:h-80 md:w-80" />
              </div>
              <CardContent className="p-6 md:p-12 space-y-10 md:space-y-12 relative z-10">
                <div className="flex items-center justify-between">
                   <div className="h-14 w-14 md:h-16 md:w-16 rounded-2xl md:rounded-[28px] bg-white/10 flex items-center justify-center backdrop-blur-2xl border border-white/20 shadow-inner">
                      <Share2 className="h-6 w-6 md:h-8 md:w-8 text-[#f9a885]" />
                   </div>
                   <Logo size="sm" className="brightness-200 opacity-40 scale-90 md:scale-100" />
                </div>

                <div className="space-y-8 text-center md:text-right">
                   <div className="space-y-2">
                      <p className="text-[9px] md:text-[10px] text-blue-200/60 font-black uppercase tracking-[0.4em]">Sovereign Invitation Identity</p>
                      <h3 className="text-3xl md:text-5xl font-black text-white tracking-[0.1em] md:tracking-[0.2em]">{invitationCode}</h3>
                   </div>
                   
                   <div className="bg-white/5 border border-white/10 rounded-[32px] md:rounded-[40px] p-2 flex flex-col items-center gap-3 backdrop-blur-md min-w-0">
                        <div className="flex-1 w-full px-4 font-mono text-[10px] md:text-[11px] text-blue-100/80 break-all text-left" dir="ltr">{referralLink}</div>
                        <Button onClick={handleCopyLink} className="h-12 md:h-14 w-full md:w-auto px-8 md:px-10 rounded-[24px] md:rounded-[32px] bg-[#f9a885] hover:bg-white text-[#002d4d] font-black text-[10px] md:text-xs shadow-xl transition-all active:scale-95 flex items-center justify-center gap-3 shrink-0">
                          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                          <span>{copied ? "تم النسخ" : "نسخ الرابط"}</span>
                        </Button>
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-6 md:gap-10 pt-8 border-t border-white/5">
                   <div className="text-right space-y-1 min-w-0">
                      <p className="text-[8px] md:text-[9px] text-white/40 font-black uppercase tracking-widest flex items-center gap-2 truncate">
                        <Coins className="h-2.5 w-2.5 shrink-0" /> Yield
                      </p>
                      <p className="text-xl md:text-3xl font-black text-[#f9a885] tabular-nums truncate">${networkStats.networkYield.toLocaleString()}</p>
                   </div>
                   <div className="text-right space-y-1 min-w-0">
                      <p className="text-[8px] md:text-[9px] text-white/40 font-black uppercase tracking-widest flex items-center gap-2 truncate">
                        <Users className="h-2.5 w-2.5 shrink-0" /> Partners
                      </p>
                      <p className="text-xl md:text-3xl font-black text-white tabular-nums truncate">{networkStats.totalInvites}</p>
                   </div>
                </div>
              </CardContent>
            </Card>

            {/* Strategic Overview Grid */}
            <div className="grid gap-4 md:gap-6 md:grid-cols-2">
               <div className="p-6 md:p-8 bg-white rounded-[40px] md:rounded-[48px] border border-gray-100 shadow-sm space-y-4 group transition-all relative overflow-hidden">
                  <div className="absolute top-0 left-0 p-8 opacity-[0.02] transition-transform"><Sparkles className="h-32 w-32 text-[#002d4d]" /></div>
                  <div className="flex items-center gap-4 relative z-10">
                     <div className="h-10 w-10 md:h-12 md:w-12 rounded-xl md:rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center shadow-inner"><Medal className="h-5 w-5 md:h-6 md:w-6" /></div>
                     <h3 className="text-base md:text-lg font-black text-[#002d4d]">استراتيجية الصدارة</h3>
                  </div>
                  <p className="text-[11px] md:text-[12px] font-bold text-gray-500 leading-loose relative z-10">
                    يتم احتساب الترتيب بناءً على إجمالي عمولات الشركاء. كلما زاد نشاط شبكتك، ارتفعت مكانتك عالمياً.
                  </p>
               </div>

               <div className="p-6 md:p-8 bg-[#002d4d]/[0.02] border-2 border-dashed border-gray-100 rounded-[40px] md:rounded-[48px] flex flex-col items-center justify-center text-center gap-4 group hover:bg-white transition-all">
                  <div className="h-12 w-12 md:h-14 md:w-14 rounded-full bg-white flex items-center justify-center shadow-sm text-blue-500">
                     <Info className="h-6 w-6 md:h-7 md:w-7" />
                  </div>
                  <div className="space-y-1">
                     <p className="text-sm font-black text-[#002d4d]">هل تحتاج مساعدة؟</p>
                     <p className="text-[10px] text-gray-400 font-bold">تعرف على بروتوكول العمولات من الأكاديمية.</p>
                  </div>
                  <Link href="/academy">
                     <Button variant="ghost" className="h-9 rounded-xl bg-blue-50 text-blue-600 font-black text-[10px] px-6">
                        فتح الأكاديمية
                     </Button>
                  </Link>
               </div>
            </div>
          </div>

          {/* Leaderboard & Rank - Column 2 */}
          <div className="lg:col-span-5 space-y-6 md:space-y-8 min-w-0">
            <div className="flex items-center justify-between px-4">
               <div className="space-y-1">
                  <h2 className="text-lg md:text-xl font-black text-[#002d4d] flex items-center gap-3">
                     <Trophy className="h-5 w-5 md:h-6 md:w-6 text-orange-500" />
                     لوحة المتصدرين
                  </h2>
                  <p className="text-[8px] md:text-[9px] text-gray-400 font-bold uppercase tracking-widest">Global Leadership Pulse</p>
               </div>
               <Badge className="bg-orange-50 text-orange-600 border-none font-black text-[7px] md:text-[8px] px-3 py-1 rounded-full shadow-inner">
                  LIVE CHALLENGE
               </Badge>
            </div>

            <Card className="border-none shadow-sm rounded-[40px] md:rounded-[48px] bg-white overflow-hidden border border-gray-50/50">
              <CardContent className="p-0">
                 <div className="p-5 md:p-6 bg-gray-50/50 border-b border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-3 min-w-0">
                       <div className="h-9 w-9 rounded-xl bg-white flex items-center justify-center shadow-sm text-emerald-500 shrink-0">
                          <Gift className="h-4 w-4" />
                       </div>
                       <p className="text-[9px] md:text-[10px] font-black text-emerald-600 uppercase tracking-widest truncate">Weekly Pool: ${partnershipConfig?.challengePrizePool || 1000}</p>
                    </div>
                    <Badge variant="outline" className="text-[6px] md:text-[7px] font-black text-gray-400 border-gray-200 shrink-0">RESETS WEEKLY</Badge>
                 </div>

                 <div className="divide-y divide-gray-50 max-h-[400px] md:max-h-[480px] overflow-y-auto scrollbar-none">
                    {leaderboardData?.map((partner: any, idx: number) => (
                      <div key={partner.id || idx} className={cn(
                        "p-5 md:p-6 flex items-center justify-between transition-all hover:bg-gray-50 group/row",
                        idx === 0 && "bg-orange-50/20"
                      )}>
                        <div className="flex items-center gap-3 md:gap-4 min-w-0">
                           <div className="relative shrink-0">
                              <div className={cn(
                                "h-10 w-10 md:h-11 md:w-11 rounded-xl md:rounded-2xl flex items-center justify-center text-xs md:text-sm font-black shadow-inner transition-all",
                                idx === 0 ? "bg-[#002d4d] text-[#f9a885] scale-105" : "bg-gray-100 text-[#002d4d]"
                              )}>
                                 {idx + 1}
                              </div>
                              {idx === 0 && <Crown className="absolute -top-2 -right-2 h-4 w-4 md:h-5 md:w-5 text-orange-500 -rotate-12 drop-shadow-md" />}
                           </div>
                           <div className="text-right min-w-0">
                              <p className="font-black text-xs md:text-[13px] text-[#002d4d] truncate">{partner.displayName || partner.name}</p>
                              <p className="text-[7px] md:text-[8px] font-bold text-gray-300 uppercase tracking-tighter mt-0.5 truncate">ID: {partner.id?.slice(-6).toUpperCase() || 'HUB'}</p>
                           </div>
                        </div>
                        <div className="text-left space-y-0.5 shrink-0 pl-2">
                           <p className="text-xs md:text-sm font-black text-emerald-600 tabular-nums tracking-tighter">${(partner.referralEarnings || partner.yield || 0).toLocaleString()}</p>
                           <p className="text-[6px] md:text-[7px] font-black text-gray-300 uppercase tracking-widest">Yield</p>
                        </div>
                      </div>
                    ))}
                 </div>

                 {/* User's Position Plate */}
                 <div className="p-6 md:p-8 bg-[#002d4d] text-white border-t border-white/5 relative overflow-hidden">
                    <div className="absolute top-0 left-0 p-6 opacity-[0.05] pointer-events-none"><Target className="h-24 w-24 md:h-32 md:w-32" /></div>
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10">
                       <div className="flex items-center gap-4 text-right w-full sm:w-auto">
                          <div className="h-12 w-12 md:h-14 md:w-14 rounded-xl md:rounded-[22px] bg-white/10 flex items-center justify-center backdrop-blur-xl border border-white/20 shadow-inner shrink-0">
                             {userRank ? <Medal className="h-6 w-6 md:h-7 md:w-7 text-[#f9a885]" /> : <Activity className="h-6 w-6 md:h-7 md:w-7 text-white/20" />}
                          </div>
                          <div className="space-y-0.5">
                             <p className="text-[8px] md:text-[9px] font-black text-blue-200/40 uppercase tracking-widest">Your Position</p>
                             <h4 className="text-lg md:text-xl font-black">{userRank ? `المركز ${userRank} عالمياً` : "خارج التصنيف"}</h4>
                          </div>
                       </div>
                       <Button 
                         onClick={() => setIsChallengeOpen(true)}
                         className="w-full sm:w-auto rounded-full bg-[#f9a885] hover:bg-white text-[#002d4d] font-black text-[9px] h-10 md:h-11 px-8 md:px-10 shadow-xl active:scale-95 transition-all"
                       >
                          ميثاق التحدي
                       </Button>
                    </div>
                 </div>
              </CardContent>
           </Card>
          </div>
        </div>

        {/* System Branding Footer */}
        <div className="flex flex-col items-center gap-4 py-12 opacity-20 select-none">
           <p className="text-[9px] md:text-[10px] font-black text-[#002d4d] uppercase tracking-[0.6em]">Namix Network Protocol v5.1.0</p>
           <div className="flex gap-2">
              {[...Array(3)].map((_, i) => (<div key={i} className="h-1.5 w-1.5 rounded-full bg-gray-300" />))}
           </div>
        </div>
      </div>

      {/* Challenge Info Dialog - Responsive Width Fix */}
      <Dialog open={isChallengeOpen} onOpenChange={setIsChallengeOpen}>
        <DialogContent className="w-[95vw] max-w-[480px] rounded-[40px] md:rounded-[56px] border-none shadow-2xl p-0 overflow-hidden font-body text-right outline-none" dir="rtl">
          <div className="bg-[#002d4d] p-8 md:p-10 text-white relative shrink-0">
             <div className="absolute top-0 right-0 p-8 opacity-[0.03] -rotate-12 pointer-events-none"><Trophy className="h-32 w-32 md:h-40 md:w-40" /></div>
             <div className="flex items-center gap-5 md:gap-6 relative z-10">
                <div className="h-14 w-14 md:h-16 md:w-16 rounded-[20px] md:rounded-[28px] bg-white/10 flex items-center justify-center backdrop-blur-xl border border-white/20 shadow-inner">
                   <Target className="h-7 w-7 md:h-8 md:w-8 text-[#f9a885]" />
                </div>
                <div className="space-y-0.5">
                   <DialogTitle className="text-xl md:text-2xl font-black">ميثاق التحدي</DialogTitle>
                   <p className="text-[9px] md:text-[10px] font-black text-blue-200/60 uppercase tracking-[0.3em]">Sovereign Reward Protocol</p>
                </div>
             </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 md:space-y-8 bg-white scrollbar-none max-h-[60vh]">
             <div className="p-5 md:p-6 bg-orange-50 rounded-[28px] md:rounded-[32px] border border-orange-100 flex items-start gap-4">
                <Gift className="h-5 w-5 md:h-6 md:w-6 text-orange-500 shrink-0 mt-1" />
                <div className="space-y-1 min-w-0">
                   <p className="text-xs font-black text-orange-900">مجموع الجوائز: ${partnershipConfig?.challengePrizePool || 1000}</p>
                   <p className="text-[10px] md:text-[11px] font-bold text-orange-800/60 leading-relaxed">يتم توزيعها على أفضل {partnershipConfig?.challengeTopWinners || 5} سفراء حققوا أعلى عائد شبكة.</p>
                </div>
             </div>

             <div className="grid gap-4">
                {[
                  { icon: Timer, title: partnershipConfig?.challengeRule1Title || "دورة التجديد", desc: partnershipConfig?.challengeRule1Desc || "يتم تصفير النتائج وبدء دورة سباق جديدة كل يوم أحد الساعة 00:00 GMT." },
                  { icon: ShieldCheck, title: partnershipConfig?.challengeRule2Title || "النزاهة والعدالة", desc: partnershipConfig?.challengeRule2Desc || "يتم تدقيق كافة الإحالات برمجياً لضمان عدم وجود تلاعب." },
                  { icon: Zap, title: partnershipConfig?.challengeRule3Title || "صرف المكافآت", desc: partnershipConfig?.challengeRule3Desc || "تضاف مبالغ الجوائز مباشرة للمحفظة الجارية للفائزين فوراً." }
                ].map((rule, i) => (
                  <div key={i} className="flex items-start gap-4 p-4 md:p-5 bg-gray-50 rounded-[24px] md:rounded-[28px] border border-gray-100">
                     <div className="h-9 w-9 md:h-10 md:w-10 rounded-xl bg-white flex items-center justify-center shadow-inner shrink-0">
                        <rule.icon className="h-4 w-4 md:h-5 md:w-5 text-[#002d4d]" />
                     </div>
                     <div className="space-y-1 text-right flex-1 min-w-0">
                        <p className="text-[10px] md:text-[11px] font-black text-[#002d4d]">{rule.title}</p>
                        <p className="text-[9px] md:text-[10px] text-gray-400 font-bold leading-relaxed">{rule.desc}</p>
                     </div>
                  </div>
                ))}
             </div>
          </div>

          <div className="p-6 md:p-8 bg-gray-50 border-t border-gray-100 flex justify-center shrink-0">
             <Button onClick={() => setIsChallengeOpen(false)} className="w-full h-12 md:h-14 rounded-full bg-[#002d4d] text-white font-black text-sm md:text-base shadow-xl active:scale-95 transition-all">
                فهمت، لنبدأ التحدي
             </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Shell>
  );
}
