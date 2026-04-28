'use client';

import React, { use, useEffect, useState, useMemo } from "react";
import { Shell } from "@/components/layout/Shell";
import { runNamix } from "@/lib/namix-orchestrator";
import { CryptoIcon } from "@/lib/crypto-icons";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Zap, 
  ShieldCheck, 
  ArrowUpRight,
  Globe,
  Sparkles,
  BarChart3,
  Loader2
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * @fileOverview صفحة التحليل العام (SEO Hub) - ميزة Namix AI Prophet
 * بوابة عامة مصممة لجذب الزوار من محركات البحث عبر تقديم تحليلات حية مجانية.
 */
export default function PublicMarketPage({ params }: { params: Promise<{ symbol: string }> }) {
  const { symbol } = use(params);
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const data = await runNamix(symbol);
        setAnalysis(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalysis();
  }, [symbol]);

  const isBuy = analysis?.decision === 'BUY';
  const isUp = analysis?.trend === 'صاعد';

  if (loading) return (
    <Shell isPublic>
      <div className="h-screen w-full flex flex-col items-center justify-center gap-6 bg-white font-body">
        <Loader2 className="h-10 w-10 animate-spin text-[#002d4d]" />
        <p className="text-xs font-black text-gray-400 uppercase tracking-widest">مزامنة بيانات السوق الحية...</p>
      </div>
    </Shell>
  );

  return (
    <Shell isPublic>
      <div className="max-w-4xl mx-auto px-6 pt-12 pb-32 font-body text-right" dir="rtl">
        
        {/* SEO Structure: JSON-LD for Rich Snippets */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "AnalysisNewsArticle",
              "headline": `تحليل عملة ${analysis?.pair} بالذكاء الاصطناعي اليوم`,
              "description": analysis?.reasoning,
              "author": { "@type": "Organization", "name": "Namix" },
              "datePublished": analysis?.timestamp,
              "image": "https://namix.pro/og-image.png"
            })
          }}
        />

        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-1000">
          
          {/* Main Identity Header */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 border-b border-gray-100 pb-10">
            <div className="flex items-center gap-6">
              <div className="h-20 w-20 rounded-[32px] bg-gray-50 flex items-center justify-center shadow-inner">
                <CryptoIcon name={symbol.split('USDT')[0]} size={48} />
              </div>
              <div className="space-y-1 text-right">
                <h1 className="text-3xl font-black text-[#002d4d] tracking-tight">{analysis?.pair} / USDT</h1>
                <div className="flex items-center gap-3">
                   <Badge className={cn("font-black text-[10px] px-3 py-1 rounded-full", isBuy ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600")}>
                      توصية {isBuy ? 'شراء' : 'بيع'}
                   </Badge>
                   <span className="text-[11px] font-bold text-gray-400">تحديث لحظي: {new Date().toLocaleTimeString('ar-EG')}</span>
                </div>
              </div>
            </div>
            
            <div className="text-center md:text-left">
               <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Live Market Price</p>
               <h2 className="text-4xl font-black text-[#002d4d] tabular-nums tracking-tighter">
                 ${analysis?.agents.tech.last.toLocaleString()}
               </h2>
            </div>
          </div>

          {/* AI Reasoning (The Prophet Logic) */}
          <div className="grid gap-8 lg:grid-cols-12">
            <div className="lg:col-span-8 space-y-8">
               <Card className="rounded-[48px] border-none shadow-2xl bg-[#002d4d] text-white overflow-hidden relative group">
                  <div className="absolute top-0 right-0 p-10 opacity-[0.03] -rotate-12 group-hover:rotate-0 transition-transform duration-1000">
                     <Sparkles size={160} />
                  </div>
                  <CardContent className="p-10 space-y-6 relative z-10">
                     <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-xl border border-white/20 shadow-inner">
                           <Activity size={24} className="text-[#f9a885]" />
                        </div>
                        <h3 className="text-xl font-black">الرؤية الاستراتيجية لناميكس</h3>
                     </div>
                     <p className="text-base font-bold text-blue-100/70 leading-[2.2]">
                        {analysis?.reasoning} يقدر نظام الذكاء الاصطناعي درجة الثقة في هذا التحليل بنسبة <span className="text-[#f9a885] font-black">%{analysis?.confidence}</span> بناءً على معايير الزخم والسيولة الحالية.
                     </p>
                  </CardContent>
               </Card>

               <div className="grid grid-cols-2 gap-4">
                  <div className="p-8 bg-white rounded-[40px] border border-gray-100 shadow-sm space-y-4">
                     <div className="flex items-center gap-3">
                        <TrendingUp size={20} className="text-emerald-500" />
                        <span className="text-[10px] font-black text-gray-400 uppercase">الأهداف المقترحة</span>
                     </div>
                     <p className="text-xl font-black text-emerald-600 tabular-nums">${analysis?.targets.tp1.toLocaleString()}</p>
                  </div>
                  <div className="p-8 bg-white rounded-[40px] border border-gray-100 shadow-sm space-y-4">
                     <div className="flex items-center gap-3">
                        <ShieldCheck size={20} className="text-red-500" />
                        <span className="text-[10px] font-black text-gray-400 uppercase">نقطة الأمان</span>
                     </div>
                     <p className="text-xl font-black text-red-600 tabular-nums">${analysis?.targets.sl.toLocaleString()}</p>
                  </div>
               </div>
            </div>

            {/* CTA Sidebar */}
            <div className="lg:col-span-4 space-y-6">
               <div className="p-8 bg-gray-50 rounded-[48px] border border-gray-100 space-y-8 shadow-inner text-center">
                  <div className="space-y-2">
                     <h4 className="text-lg font-black text-[#002d4d]">ابدأ التداول الآن</h4>
                     <p className="text-[11px] font-bold text-gray-400 leading-loose">استفد من هذه الإشارة ونفذ صفقتك الأولى بلمسة واحدة عبر نظام ناميكس المعتمد.</p>
                  </div>
                  <Link href="/login" className="block">
                     <Button className="w-full h-16 rounded-full bg-[#f9a885] text-[#002d4d] font-black text-base shadow-xl active:scale-95 transition-all group">
                        فتح حساب مجاني
                        <ArrowUpRight className="mr-2 h-5 w-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                     </Button>
                  </Link>
                  <div className="flex items-center justify-center gap-3 opacity-30 pt-2">
                     <Globe size={12} />
                     <p className="text-[8px] font-black uppercase tracking-widest">Global Asset System</p>
                  </div>
               </div>

               <div className="p-6 bg-blue-50 rounded-[32px] border border-blue-100 flex items-start gap-4">
                  <Zap size={18} className="text-blue-500 mt-1 shrink-0" />
                  <p className="text-[10px] font-bold text-blue-800/60 leading-loose">
                    هل تعلم؟ أرباح التداول في ناميكس تصل إلى %80 لكل عملية ناجحة مع حماية كاملة للمحفظة.
                  </p>
               </div>
            </div>
          </div>
        </div>
      </div>
    </Shell>
  );
}
