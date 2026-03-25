
"use client";

import Link from "next/link";
import { 
  Compass, 
  ChevronLeft,
  Sparkles
} from "lucide-react";

/**
 * GuidanceCenter Component
 * 
 * المكون الظاهر في الصفحة الرئيسية الذي يعمل كبوابة دخول لصفحة التوجيه المالي المستقلة.
 */
export function GuidanceCenter() {
  return (
    <div className="pt-2">
      <div className="max-w-2xl mx-auto px-4">
        <Link href="/guidance" className="block">
          <div className="w-full p-5 bg-white rounded-[32px] border border-gray-100 shadow-sm hover:shadow-lg transition-all group flex items-center justify-between relative overflow-hidden active:scale-[0.98]">
            <div className="absolute top-0 right-0 p-4 opacity-[0.02] pointer-events-none group-hover:scale-125 transition-transform duration-1000">
               <Compass className="h-20 w-20 text-[#002d4d]" />
            </div>
            
            <div className="flex items-center gap-4 relative z-10">
              <div className="h-10 w-10 rounded-[14px] bg-blue-50 text-blue-600 flex items-center justify-center shadow-inner group-hover:bg-[#002d4d] group-hover:text-[#f9a885] transition-all duration-500">
                <Compass className="h-5 w-5" />
              </div>
              <div className="text-right">
                <h3 className="text-base font-black text-[#002d4d]">من أين أبدأ؟</h3>
                <p className="text-[7px] text-gray-400 font-bold uppercase tracking-[0.3em] mt-0.5">Sovereign Guidance Compass</p>
              </div>
            </div>

            <div className="h-8 w-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-200 group-hover:bg-[#f9a885] group-hover:text-[#002d4d] transition-all">
              <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
