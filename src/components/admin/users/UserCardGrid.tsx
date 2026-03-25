
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  User, 
  Edit, 
  UserSearch, 
  Wallet, 
  Trash2, 
  ShieldCheck, 
  Shield, 
  ShieldAlert, 
  Award, 
  Loader2,
  TrendingUp,
  Coins,
  ChevronRight,
  Phone,
  Zap,
  KeyRound,
  Globe,
  Clock
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { ar } from "date-fns/locale/ar";

interface UserCardGridProps {
  users: any[];
  isLoading: boolean;
  onEdit: (user: any) => void;
  onAdjustBalance: (user: any) => void;
  onDelete: (user: any) => void;
  onResetCredentials: (user: any) => void;
  getUserTier: (user: any) => any;
  checkVerification: (user: any) => boolean;
}

export function UserCardGrid({ 
  users, 
  isLoading, 
  onEdit, 
  onAdjustBalance, 
  onDelete, 
  onResetCredentials,
  getUserTier, 
  checkVerification 
}: UserCardGridProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-gray-200" />
        <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">جاري جرد قاعدة الهويات...</p>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="text-center py-40 opacity-20 flex flex-col items-center gap-6 border-2 border-dashed border-gray-100 rounded-[64px]">
         <User className="h-24 w-24 text-[#002d4d]" />
         <p className="text-xs font-black uppercase tracking-[0.5em]">لا يوجد مستثمرون يطابقون معايير البحث</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {users.map((user) => {
        const tier = user.tier || getUserTier(user);
        const isVerified = checkVerification(user);
        
        // ONLINE DETECTION: Active within last 5 minutes
        const isOnline = user.lastActive && (new Date().getTime() - new Date(user.lastActive).getTime() < 300000);
        
        return (
          <Card key={user.id} className="border-none shadow-sm rounded-[56px] bg-white overflow-hidden group transition-all hover:shadow-2xl hover:-translate-y-2 flex flex-col relative">
            <CardContent className="p-8 space-y-8 flex-1">
              {/* Online Indicator Badge */}
              <div className="absolute top-8 right-8 z-20">
                {isOnline ? (
                  <div className="flex items-center gap-2 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 shadow-sm animate-in zoom-in duration-500">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span className="text-[8px] font-black text-emerald-600 uppercase tracking-widest">متصل الآن</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 bg-gray-50 px-3 py-1 rounded-full border border-gray-100 shadow-sm">
                    <span className="h-2 w-2 rounded-full bg-gray-300"></span>
                    <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">غير متصل</span>
                  </div>
                )}
              </div>

              {/* Header: Identity & Status */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-[28px] bg-gray-50 flex items-center justify-center text-xl font-black text-[#002d4d] shadow-inner group-hover:bg-[#002d4d] group-hover:text-[#f9a885] transition-all duration-500">
                    {user.displayName?.[0] || 'U'}
                  </div>
                  <div className="text-right space-y-0.5">
                    <h3 className="font-black text-lg text-[#002d4d] truncate max-w-[160px]">{user.displayName}</h3>
                    <div className="flex items-center gap-2">
                       <Phone className="h-2.5 w-2.5 text-gray-300" />
                       <span className="text-[9px] text-gray-400 font-bold tabular-nums" dir="ltr">{user.phoneNumber}</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2 pr-12">
                  {user.role === 'admin' ? (
                    <Badge className="bg-red-50 text-red-600 border-none font-black text-[7px] px-2.5 py-1 rounded-lg shadow-sm tracking-widest">ADMIN</Badge>
                  ) : (
                    <Badge className="bg-blue-50 text-blue-600 border-none font-black text-[7px] px-2.5 py-1 rounded-lg shadow-sm tracking-widest">INVESTOR</Badge>
                  )}
                  {isVerified ? (
                    <div className="h-5 w-5 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                      <ShieldCheck className="h-3 w-3 text-white fill-white" />
                    </div>
                  ) : (
                    <div className="h-5 w-5 rounded-full bg-orange-100 flex items-center justify-center">
                      <ShieldAlert className="h-3 w-3 text-orange-400" />
                    </div>
                  )}
                </div>
              </div>

              {/* Tier Banner */}
              <div className={cn(
                "p-4 rounded-[24px] flex items-center justify-between border shadow-inner transition-all",
                tier ? `bg-${tier.color}-50 border-${tier.color}-100` : "bg-gray-50 border-gray-100"
              )}>
                <div className="flex items-center gap-3">
                  <div className={cn("h-8 w-8 rounded-xl flex items-center justify-center shadow-sm", tier ? `bg-white text-${tier.color}-600` : "bg-white text-gray-300")}>
                    <Award className="h-4.5 w-4.5" />
                  </div>
                  <p className={cn("font-black text-xs", tier ? `text-${tier.color}-700` : "text-gray-400")}>
                    {tier?.name || "مستثمر جديد"}
                  </p>
                </div>
                <span className="text-[8px] font-black text-gray-300 uppercase tracking-widest">Membership Rank</span>
              </div>

              {/* Financial Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-5 bg-gray-50 rounded-[32px] border border-gray-100 space-y-1.5 shadow-inner group/stat">
                  <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                    <Wallet className="h-2.5 w-2.5" /> الرصيد الجاري
                  </p>
                  <p className="text-lg font-black text-[#002d4d] tabular-nums tracking-tighter">
                    ${user.totalBalance?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <div className="p-5 bg-emerald-50/30 rounded-[32px] border border-emerald-100/50 space-y-1.5 shadow-inner group/stat">
                  <p className="text-[8px] font-black text-emerald-600/60 uppercase tracking-widest flex items-center gap-1.5">
                    <TrendingUp className="h-2.5 w-2.5" /> صافي الأرباح
                  </p>
                  <p className="text-lg font-black text-emerald-600 tabular-nums tracking-tighter">
                    +${user.totalProfits?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>

              {/* Node Info & Last Active */}
              <div className="flex items-center justify-between px-2 pt-2 border-t border-gray-50">
                 <div className="flex items-center gap-2">
                    <Zap className="h-3 w-3 text-purple-400" />
                    <span className="text-[8px] font-black text-gray-300 uppercase tracking-widest">Node: {user.id?.slice(-8).toUpperCase()}</span>
                 </div>
                 <div className="flex items-center gap-2">
                    <Clock className="h-3 w-3 text-gray-300" />
                    <span className="text-[8px] font-bold text-gray-400">
                      {isOnline ? "نشط الآن" : user.lastActive ? `منذ ${formatDistanceToNow(new Date(user.lastActive), { locale: ar })}` : "غير معروف"}
                    </span>
                 </div>
              </div>
            </CardContent>

            {/* Actions Grid */}
            <div className="p-6 bg-gray-50/50 border-t border-gray-50 grid grid-cols-5 gap-2">
              <Link href={`/admin/users/${user.id}`} className="contents">
                <Button variant="ghost" className="h-12 rounded-2xl bg-white border border-gray-100 text-emerald-600 hover:bg-emerald-50 shadow-sm transition-all" title="معاينة البصمة المالية">
                  <UserSearch className="h-5 w-5" />
                </Button>
              </Link>
              <Button onClick={() => onEdit(user)} variant="ghost" className="h-12 rounded-2xl bg-white border border-gray-100 text-blue-500 hover:bg-blue-50 shadow-sm transition-all" title="تعديل الهوية">
                <Edit className="h-5 w-5" />
              </Button>
              <Button onClick={() => onAdjustBalance(user)} variant="ghost" className="h-12 rounded-2xl bg-white border border-gray-100 text-orange-500 hover:bg-orange-50 shadow-sm transition-all" title="هندسة الرصيد">
                <Wallet className="h-5 w-5" />
              </Button>
              <Button onClick={() => onResetCredentials(user)} variant="ghost" className="h-12 rounded-2xl bg-white border border-gray-100 text-purple-500 hover:bg-purple-50 shadow-sm transition-all" title="إعادة تعيين الأمان">
                <KeyRound className="h-5 w-5" />
              </Button>
              <Button onClick={() => onDelete(user)} variant="ghost" className="h-12 rounded-2xl bg-white border border-gray-100 text-red-400 hover:bg-red-50 shadow-sm transition-all" title="حذف سيادي">
                <Trash2 className="h-5 w-5" />
              </Button>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
