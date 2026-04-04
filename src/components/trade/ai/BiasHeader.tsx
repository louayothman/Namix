
"use client";

import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface BiasHeaderProps {
  bias: 'Long' | 'Short' | 'Neutral';
}

/**
 * LiquidMorphCore - المفاعل السائل المورفي
 * كائن حي يتنفس ويتغير شكله ولونه بناءً على حالة السوق
 */
function LiquidMorphCore({ bias }: { bias: string }) {
  const isLong = bias === 'Long';
  const isShort = bias === 'Short';
  const isNeutral = bias === 'Neutral';

  return (
    <div className="relative h-14 w-14 flex items-center justify-center shrink-0 group">
      {/* هالة التوهج المحيطي */}
      <motion.div
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className={cn(
          "absolute inset-0 rounded-full blur-xl",
          isLong ? "bg-emerald-500/20" : isShort ? "bg-red-500/20" : "bg-blue-500/20"
        )}
      />

      {/* الكيان السائل المورفي */}
      <motion.div
        animate={{ 
          borderRadius: isNeutral 
            ? ["40% 60% 70% 30% / 40% 40% 60% 60%", "60% 40% 30% 70% / 60% 30% 70% 40%", "40% 60% 70% 30% / 40% 40% 60% 60%"]
            : isLong 
            ? ["50% 50% 70% 30% / 30% 30% 70% 70%", "30% 70% 50% 50% / 50% 50% 30% 70%", "50% 50% 70% 30% / 30% 30% 70% 70%"]
            : ["70% 30% 30% 70% / 70% 70% 30% 30%", "30% 70% 70% 30% / 30% 30% 70% 70%", "70% 30% 30% 70% / 70% 70% 30% 30%"],
          rotate: isNeutral ? [0, 360] : isLong ? [-15, 15, -15] : [15, -15, 15],
          scale: [1, 1.05, 1]
        }}
        transition={{ 
          duration: isNeutral ? 10 : 4, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
        className={cn(
          "h-10 w-10 border-2 shadow-inner transition-colors duration-1000 relative z-10",
          isLong ? "bg-emerald-500/10 border-emerald-400 shadow-emerald-500/20" : 
          isShort ? "bg-red-500/10 border-red-400 shadow-red-500/20" : 
          "bg-blue-500/10 border-blue-400 shadow-blue-500/20"
        )}
      >
        {/* جزيئات الطاقة الداخلية */}
        <AnimatePresence>
          {isLong && (
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: -20, opacity: [0, 1, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
              className="absolute inset-0 flex items-center justify-center text-emerald-400"
            >
              <div className="h-1 w-1 rounded-full bg-current shadow-[0_0_8px_currentColor]" />
            </motion.div>
          )}
          {isShort && (
            <motion.div 
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 20, opacity: [0, 1, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeIn" }}
              className="absolute inset-0 flex items-center justify-center text-red-400"
            >
              <div className="h-1 w-1 rounded-full bg-current shadow-[0_0_8px_currentColor]" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* حلقات النبض */}
      <motion.div 
        animate={{ scale: [1, 1.8], opacity: [0.5, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className={cn(
          "absolute h-8 w-8 rounded-full border border-current opacity-20",
          isLong ? "text-emerald-500" : isShort ? "text-red-500" : "text-blue-500"
        )}
      />
    </div>
  );
}

export function BiasHeader({ bias }: BiasHeaderProps) {
  const labelMap = {
    Long: 'صعود استراتيجي',
    Short: 'هبوط استراتيجي',
    Neutral: 'تذبذب عرضي'
  };

  const textMap = {
    Long: 'text-emerald-500',
    Short: 'text-red-500',
    Neutral: 'text-gray-400'
  };

  const badgeMap = {
    Long: 'bg-emerald-500 text-white',
    Short: 'bg-red-500 text-white',
    Neutral: 'bg-gray-100 text-gray-400'
  };

  return (
    <section className="flex items-center justify-between px-2 font-body select-none" dir="rtl">
      <div className="flex items-center gap-4">
        <LiquidMorphCore bias={bias} />
        <div className="space-y-0.5 text-right">
          <div className="flex items-center gap-2">
            <h4 className={cn("text-xl font-black tracking-normal transition-colors duration-1000", textMap[bias])}>
              {labelMap[bias]}
            </h4>
            <Badge className={cn("font-black text-[8px] px-2 py-0.5 border-none shadow-sm transition-all duration-1000", badgeMap[bias])}>
              {bias.toUpperCase()}
            </Badge>
          </div>
          <p className="text-[8px] font-black text-gray-300 uppercase tracking-widest leading-none">Market Intelligence Bias</p>
        </div>
      </div>
      
      <div className="opacity-20 hidden md:block">
         <div className="flex flex-col items-end gap-1">
            <div className="h-0.5 w-8 bg-gray-200 rounded-full" />
            <div className="h-0.5 w-12 bg-gray-100 rounded-full" />
         </div>
      </div>
    </section>
  );
}
