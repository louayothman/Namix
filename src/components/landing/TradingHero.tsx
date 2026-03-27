
"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Activity, Zap, BarChart3, Globe } from "lucide-react";

/**
 * @fileOverview هيرو التداول - إصدار النقاء
 */
export function TradingHero() {
  return (
    <section id="trading" className="relative min-h-screen w-full flex items-center px-6 md:px-24 bg-gray-50/50 overflow-hidden">
      <div className="container mx-auto grid lg:grid-cols-2 gap-16 items-center relative z-10">
        
        {/* Simulation Side */}
        <div className="order-2 lg:order-1 flex justify-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="w-full max-w-md bg-white rounded-[48px] border border-gray-100 shadow-2xl p-8"
          >
             <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                   <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                   <span className="text-[10px] font-black text-[#002d4d] uppercase tracking-widest">Global Market Feed</span>
                </div>
                <Badge className="bg-gray-50 text-gray-400 border-none font-black text-[8px]">STABLE</Badge>
             </div>

             <div className="h-40 flex items-end justify-around gap-2 px-4">
                {[40, 70, 50, 90, 60, 80, 45, 100, 75].map((h, i) => (
                  <motion.div 
                    key={i}
                    animate={{ height: [`${h}%`, `${h+10}%`, `${h}%`] }}
                    transition={{ duration: 3 + i*0.2, repeat: Infinity }}
                    className={`w-4 rounded-t-lg ${i % 3 === 0 ? "bg-red-100" : "bg-emerald-100"}`}
                  >
                     <div className={`absolute top-[-5px] left-1/2 -translate-x-1/2 w-0.5 h-full ${i % 3 === 0 ? "bg-red-400" : "bg-emerald-400"}`} />
                  </motion.div>
                ))}
             </div>

             <div className="mt-8 p-6 bg-gray-50 rounded-3xl flex items-center justify-between shadow-inner">
                <div className="space-y-1">
                   <p className="text-[8px] font-black text-gray-400 uppercase">Latency</p>
                   <p className="text-xl font-black text-[#002d4d] tabular-nums">0.02ms</p>
                </div>
                <Zap size={24} className="text-[#f9a885] fill-current" />
             </div>
          </motion.div>
        </div>

        {/* Content Side */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="text-center lg:text-left space-y-8 order-1 lg:order-2"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-50 rounded-full border border-emerald-100">
             <Activity size={14} className="text-emerald-600" />
             <span className="text-emerald-600 font-black text-[10px] uppercase tracking-widest">محرك التداول الوميضي</span>
          </div>
          <h2 className="text-5xl md:text-7xl font-black text-[#002d4d] leading-[1.1] tracking-tight">
            سرعة الاتصال <br/> <span className="text-gray-300">بدقة التنفيذ.</span>
          </h2>
          <p className="text-gray-500 text-base md:text-lg font-medium leading-loose max-w-xl lg:mr-auto">
            اربط تداولاتك بأضخم البورصات العالمية عبر محركنا المتطور. استمتع بتنفيذ فوري وفروق أسعار منخفضة تضعك في المقدمة دوماً.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
            <Link href="/login" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto h-16 px-12 rounded-2xl bg-emerald-600 text-white hover:bg-emerald-700 font-black text-lg shadow-xl transition-all">
                دخول الأسواق
              </Button>
            </Link>
            <div className="flex items-center gap-3 text-gray-300 text-[10px] font-black uppercase">
               <Globe size={14} />
               <span>Global Infrastructure</span>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}

import { cn } from "@/lib/utils";
import { Badge } from "../ui/badge";
