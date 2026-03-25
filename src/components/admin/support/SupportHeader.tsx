"use client";

import { Input } from "@/components/ui/input";
import { Search, Inbox, Archive, History } from "lucide-react";
import { cn } from "@/lib/utils";

interface SupportHeaderProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  filterStatus: 'active' | 'closed' | 'all';
  onFilterChange: (status: 'active' | 'closed' | 'all') => void;
}

export function SupportHeader({ 
  searchQuery, 
  onSearchChange, 
  filterStatus, 
  onFilterChange 
}: SupportHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 shrink-0 bg-white/40 p-6 rounded-[40px] border border-white/60 backdrop-blur-sm shadow-sm">
      <div className="space-y-1 text-right">
        <div className="flex items-center gap-2 text-[#002d4d] font-black text-[9px] uppercase tracking-[0.3em] justify-end md:justify-start">
          <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
          Intelligence Support Command
        </div>
        <h1 className="text-2xl font-black text-[#002d4d]">مركز عمليات الدعم المباشر</h1>
      </div>
      
      <div className="flex items-center gap-4">
         <div className="relative w-80">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="ابحث عن تذكرة، اسم، أو رقم هاتف..." 
              value={searchQuery}
              onChange={e => onSearchChange(e.target.value)}
              className="h-12 rounded-full bg-white border-none shadow-inner pr-11 font-bold text-xs focus-visible:ring-2 focus-visible:ring-blue-500 text-right" 
            />
         </div>
         
         <div className="h-10 p-1.5 bg-gray-100/50 rounded-full flex items-center gap-1">
            {[
              { id: 'active', label: 'النشطة', icon: Inbox },
              { id: 'closed', label: 'المغلقة', icon: Archive },
              { id: 'all', label: 'الكل', icon: History }
            ].map((btn) => (
              <button
                key={btn.id}
                onClick={() => onFilterChange(btn.id as any)}
                className={cn(
                  "flex items-center gap-2 px-4 py-1.5 rounded-full text-[9px] font-black transition-all",
                  filterStatus === btn.id ? "bg-white text-[#002d4d] shadow-sm" : "text-gray-400 hover:text-gray-600"
                )}
              >
                <btn.icon className="h-3 w-3" />
                {btn.label}
              </button>
            ))}
         </div>
      </div>
    </div>
  );
}
