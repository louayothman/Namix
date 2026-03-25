
"use client";

import { ChevronLeft, LucideIcon, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface NavItem {
  title: string;
  desc: string;
  icon: LucideIcon;
  href: string;
  color: string;
  bg: string;
  type: 'link' | 'dialog' | 'action-button';
  action?: () => void;
  buttonText?: string;
}

interface NavSection {
  title: string;
  icon: LucideIcon;
  items: NavItem[];
}

interface ProfileNavigationProps {
  sections: NavSection[];
  onNavigate: (item: NavItem) => void;
}

export function ProfileNavigation({ sections, onNavigate }: ProfileNavigationProps) {
  return (
    <div className="space-y-12 pb-10">
      {sections.map((section, idx) => (
        <div key={idx} className="space-y-6">
          <div className="flex items-center justify-between px-6">
            <div className="flex items-center gap-3">
              <div className="h-6 w-1 bg-gradient-to-b from-[#002d4d] to-transparent rounded-full" />
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{section.title}</p>
            </div>
            <section.icon className="h-3.5 w-3.5 text-gray-200" />
          </div>
          
          <div className="grid gap-3">
            {section.items.map((item, i) => (
              <motion.button
                key={i}
                whileTap={{ scale: 0.98 }}
                onClick={() => onNavigate(item)}
                className="w-full text-right outline-none group"
              >
                <Card className="border-none shadow-none rounded-[36px] bg-white border border-gray-50/50 hover:bg-gray-50 transition-all duration-500 overflow-hidden relative">
                  <CardContent className="p-5 flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-5">
                      <div className={cn(
                        "h-14 w-14 rounded-[22px] flex items-center justify-center shadow-inner transition-all duration-700 group-hover:scale-110 group-hover:shadow-lg", 
                        item.bg, item.color
                      )}>
                        <item.icon className="h-7 w-7" />
                      </div>
                      <div className="text-right space-y-0.5">
                        <p className="font-black text-sm text-[#002d4d] group-hover:text-blue-600 transition-colors">{item.title}</p>
                        <p className="text-[10px] text-gray-400 font-bold leading-relaxed max-w-[200px] truncate">{item.desc}</p>
                      </div>
                    </div>

                    {item.type === 'action-button' ? (
                      <div className={cn(
                        "px-4 py-1.5 rounded-xl font-black text-[9px] transition-all border-2",
                        item.buttonText === 'إلغاء' ? "bg-red-50 text-red-500 border-red-100" : "bg-blue-50 text-blue-600 border-blue-100"
                      )}>
                        {item.buttonText}
                      </div>
                    ) : (
                      <div className="h-9 w-9 rounded-full bg-gray-50 flex items-center justify-center text-gray-200 group-hover:bg-[#002d4d] group-hover:text-[#f9a885] transition-all shadow-sm">
                        <ChevronLeft className="h-5 w-5 transition-transform group-hover:-translate-x-0.5" />
                      </div>
                    )}
                  </CardContent>
                  
                  {/* Subtle hover spark */}
                  <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                     <Sparkles size={10} className="text-[#f9a885] animate-pulse" />
                  </div>
                </Card>
              </motion.button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
