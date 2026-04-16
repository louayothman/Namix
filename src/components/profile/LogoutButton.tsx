
"use client";

import { LogOut, ChevronLeft, ShieldAlert } from "lucide-react";
import { motion } from "framer-motion";

interface LogoutButtonProps {
  onLogout: () => void;
}

export function LogoutButton({ onLogout }: LogoutButtonProps) {
  return (
    <div className="pt-8 pb-12">
      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={onLogout}
        className="w-full flex items-center justify-between p-8 bg-red-50 border border-red-100 rounded-[48px] hover:bg-red-100/50 transition-all group active:scale-[0.98] relative overflow-hidden shadow-sm"
      >
        <div className="absolute top-0 right-0 p-10 opacity-5 -rotate-12 pointer-events-none group-hover:rotate-0 group-hover:scale-125 transition-transform duration-1000">
           <LogOut className="h-32 w-32 text-red-600" />
        </div>
        
        <div className="flex items-center gap-6 relative z-10">
          <div className="h-14 w-14 rounded-2xl bg-white text-red-500 flex items-center justify-center shadow-lg shadow-red-900/10 group-hover:scale-110 transition-transform duration-500">
            <LogOut className="h-7 w-7" />
          </div>
          <div className="text-right space-y-0.5">
            <p className="font-black text-lg text-red-600">إنهاء الجلسة الآمنة</p>
            <div className="flex items-center gap-2 text-red-400 font-black text-[8px] uppercase tracking-widest">
               <ShieldAlert size={10} />
               Secure Exit Protocol
            </div>
          </div>
        </div>

        <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center text-red-200 group-hover:bg-red-500 group-hover:text-white transition-all shadow-sm">
          <ChevronLeft className="h-5 w-5 transition-transform group-hover:-translate-x-0.5" />
        </div>
      </motion.button>
      
      <div className="mt-10 flex flex-col items-center gap-4 opacity-20 select-none">
         <p className="text-[10px] font-black text-[#002d4d] uppercase tracking-widest text-center">Namix Sovereign Core v5.0</p>
         <div className="flex gap-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-1.5 w-1.5 rounded-full bg-gray-300" />
            ))}
         </div>
      </div>
    </div>
  );
}
