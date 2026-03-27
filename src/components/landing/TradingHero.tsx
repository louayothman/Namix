
"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Activity, Zap, BarChart3, Globe } from "lucide-react";

/**
 * @fileOverview هيرو التداول الفوري - السرعة والاتصال
 */
export function TradingHero() {
  return (
    <section id="trading" className="relative min-h-screen w-full flex items-center px-6 md:px-24 overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 z-0">
        <div className="absolute bottom-[10%] left-[-5%] w-[50%] h-[50%] bg-emerald-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto grid lg:grid-cols-2 gap-16 items-center relative z-10">
        
        {/* Simulation Side (Order 2 on Mobile) */}
        <div className="order-2 lg:order-1 relative flex justify-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2 }}
            className="w-full max-w-md bg-[#0a0e17] rounded-[48px] border border-white/5 shadow-2xl p-6 overflow-hidden relative"
          >
             <div className="flex items-center justify-between mb-8 px-4">
                <div className="flex items-center gap-3">
                   <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                   <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Binance Cloud Feed</span>
                </div>
                <div className="flex gap-1.5">
                   <div className="h-1 w-4 bg-white/10 rounded-full" />
                   <div className="h-1 w-8 bg-[#00d1ff] rounded-full" />
                </div>
             </div>

             {/* Candlestick Mockup */}
             <div className="h-48 flex items-end justify-around gap-2 px-4 opacity-60">
                {[40, 70, 50, 90, 60, 80, 45, 100, 75].map((h, i) => (
                  <motion.div 
                    key={i}
                    animate={{ height: [`${h}%`, `${h+10}%`, `${h}%`] }}
                    transition={{ duration: 2 + i*0.2, repeat: Infinity }}
                    className={cn(
                      "w-4 rounded-t-md relative",
                      i % 3 === 0 ? "bg-red-500/40" : "bg-emerald-500/40"
                    )}
                  >
                     <div className={cn("absolute top-[-10px] left-1/2 -translate-x-1/2 w-0.5 h-full", i % 3 === 0 ? "bg-red-500/20" : "bg-emerald-500/20")} />
                  </motion.div>
                ))}
             </div>

             <div className="mt-10 p-6 bg-white/5 rounded-3xl border border-white/5 flex items-center justify-between">
                <div className="space-y-1">
                   <p className="text-[8px] font-black text-white/20 uppercase">Execution Speed</p>
                   <p className="text-lg font-black text-white tabular-nums">0.02ms</p>
                </div>
                <Zap size={24} className="text-[#f9a885] fill-current" />
             </div>
          </motion.div>
        </div>

        {/* Content Side (Order 1 on Mobile) */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2 }}
          className="text-center lg:text-left space-y-8 order-1 lg:order-2"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-500/10 rounded-full border border-emerald-500/20">
             <Activity size={14} className="text-emerald-400" />
             <span className="text-emerald-400 font-black text-[10px] uppercase tracking-widest tracking-normal">محرك التداول الوميضي</span>
          </div>
          <h2 className="text-5xl md:text-7xl font-black text-white leading-[1.1]">
            نبض السوق <br/> <span className="text-white/30 text-emerald-500/40">بين يديك.</span>
          </h2>
          <p className="text-gray-400 text-base md:text-lg font-medium leading-loose max-w-xl lg:mr-auto">
            اربط تداولاتك بأضخم بورصات العالم. تنفيذ فوري، فروق أسعار منخفضة، وأدوات تحليلية مدعومة بالذكاء الاصطناعي لاقتناص كل فرصة.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
            <Link href="/login" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto h-16 px-12 rounded-2xl bg-[#00d1ff] text-[#0a0e17] hover:bg-white font-black text-lg shadow-xl transition-all">
                ابدأ التداول
              </Button>
            </Link>
            <div className="flex items-center gap-3 text-white/20 text-[10px] font-black uppercase">
               <Globe size={14} />
               <span>Global Connectivity</span>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}

import { cn } from "@/lib/utils";
