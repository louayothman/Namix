"use client";

interface NewsTickerProps {
  marketingConfig: any;
}

export function NewsTicker({ marketingConfig }: NewsTickerProps) {
  if (marketingConfig?.isTickerEnabled === false) return null;

  return (
    <div className="pt-4">
       <div className="bg-[#002d4d] rounded-full h-12 flex items-center overflow-hidden shadow-2xl border border-white/10 backdrop-blur-md">
          <div className="bg-[#f9a885] h-full px-6 flex items-center gap-3 shrink-0 relative overflow-hidden">
             <div className="h-1.5 w-1.5 rounded-full bg-[#002d4d] animate-pulse" />
             <span className="text-[9px] font-black text-[#002d4d] uppercase tracking-[0.2em] relative z-10">البث المباشر</span>
             <div className="absolute inset-0 bg-white/10 skew-x-12 translate-x-4" />
          </div>
          <div className="flex-1 px-6 overflow-hidden whitespace-nowrap">
             <p className="text-[10px] font-bold text-blue-100/70 animate-marquee-reverse inline-block">
                {marketingConfig?.tickerText || "بروتوكول ناميكس العالمي: جاري تهيئة تدفق البيانات الاستراتيجية..."}
             </p>
          </div>
       </div>
       
       <style jsx global>{`
        @keyframes marquee-reverse {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-marquee-reverse {
          animation: marquee-reverse 45s linear infinite;
        }
      `}</style>
    </div>
  );
}