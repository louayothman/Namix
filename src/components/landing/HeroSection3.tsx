
"use client";

import React from "react";
import { motion } from "framer-motion";
import { Users, Globe, Award, Sparkles } from "lucide-react";

export function HeroSection3() {
  return (
    <section className="relative min-h-[80vh] flex flex-col items-center justify-center px-6 py-20 bg-white overflow-hidden">
      <div className="container mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          <motion.div 
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5 }}
            className="space-y-8 text-center lg:text-right"
            dir="rtl"
          >
            <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-purple-50 rounded-full border border-purple-100">
               <Sparkles size={14} className="text-purple-600" />
               <span className="text-[#002d4d] font-black text-[10px] uppercase tracking-widest">مجتمع النخبة العالمي <span className="opacity-30 mx-1">•</span> Global Elite</span>
            </div>
            
            <h2 className="text-4xl md:text-6xl font-black text-[#002d4d] leading-tight tracking-tight">
              انضم إلى شبكة <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">المستثمرين الأذكياء.</span>
            </h2>
            
            <p className="text-sm md:text-lg text-gray-400 font-medium max-w-lg mx-auto lg:mr-0 leading-relaxed">
              اكتشف فرصاً لا محدودة في مجتمع يضم نخبة المستثمرين حول العالم، حيث نتبادل الرؤى لتحقيق أفضل مستويات النمو.
            </p>

            <div className="flex justify-center lg:justify-start -space-x-4 space-x-reverse">
               {[1, 2, 3, 4, 5].map((i) => (
                 <div key={i} className="h-12 w-12 rounded-full border-4 border-white bg-gray-100 flex items-center justify-center text-gray-300 font-black text-[10px] shadow-lg">
                    U{i}
                 </div>
               ))}
               <div className="h-12 w-12 rounded-full border-4 border-white bg-[#002d4d] text-white flex items-center justify-center font-black text-[10px] shadow-lg">
                  +50K
               </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5 }}
            className="flex justify-center"
          >
             <div className="grid grid-cols-2 gap-6">
                <div className="p-8 bg-gray-50 rounded-[48px] border border-gray-100 space-y-4 shadow-inner text-center">
                   <Globe size={32} className="text-blue-500 mx-auto" />
                   <p className="text-xl font-black text-[#002d4d]">12+</p>
                   <p className="text-[9px] font-black text-gray-400 uppercase">Countries</p>
                </div>
                <div className="p-8 bg-gray-50 rounded-[48px] border border-gray-100 space-y-4 shadow-inner text-center translate-y-10">
                   <Award size={32} className="text-[#f9a885] mx-auto" />
                   <p className="text-xl font-black text-[#002d4d]">Elite</p>
                   <p className="text-[9px] font-black text-gray-400 uppercase">Membership</p>
                </div>
             </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
