
"use client";

import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Globe, UserCircle, Activity, Sparkles, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface UserIntelligenceReactorProps {
  newUsersCount: number;
  onlineUsersCount: number;
}

export function UserIntelligenceReactor({
  newUsersCount,
  onlineUsersCount
}: UserIntelligenceReactorProps) {
  return (
    <Card className="border-none shadow-sm rounded-[44px] bg-white overflow-hidden border-r-[8px] border-r-purple-500 group transition-all hover:shadow-xl">
      <CardContent className="p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-purple-50 rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
              <Users className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <CardTitle className="text-base font-black text-[#002d4d]">استخبارات الحضور</CardTitle>
              <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Geo-Whale Pulse</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
             <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
             <span className="text-[8px] font-black text-emerald-600 uppercase tracking-widest">Live</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
           <div className="p-5 bg-purple-50/30 rounded-[32px] border border-purple-100/50 space-y-1.5 text-center">
              <Globe size={16} className="text-purple-500 mx-auto" />
              <p className="text-[8px] font-black text-gray-400 uppercase">Online Now</p>
              <p className="text-2xl font-black text-purple-600 tabular-nums">{onlineUsersCount}</p>
           </div>
           <div className="p-5 bg-blue-50/30 rounded-[32px] border border-blue-100/50 space-y-1.5 text-center">
              <UserCircle size={16} className="text-blue-500 mx-auto" />
              <p className="text-[8px] font-black text-gray-400 uppercase">New (7D)</p>
              <p className="text-2xl font-black text-blue-600 tabular-nums">+{newUsersCount}</p>
           </div>
        </div>

        <div className="p-5 bg-gray-50 rounded-[32px] border border-gray-100 flex items-center justify-between">
           <div className="flex items-center gap-3">
              <Activity size={14} className="text-orange-400 animate-pulse" />
              <p className="text-[10px] font-black text-[#002d4d]">Session Intensity</p>
           </div>
           <Badge className="bg-white text-[#002d4d] border-gray-100 font-black text-[8px] px-2 py-0.5">HIGH DENSITY</Badge>
        </div>
      </CardContent>
    </Card>
  );
}
