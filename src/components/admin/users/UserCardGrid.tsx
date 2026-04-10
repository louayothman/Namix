
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  User, Edit, UserSearch, Wallet, Trash2, ShieldCheck, Award, Loader2,
  TrendingUp, Phone, Zap, KeyRound, Globe, Clock, ShieldAlert, Cpu,
  ExternalLink
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { generateBaseUserWallets } from "@/app/actions/nowpayments-actions";
import { CryptoIcon } from "@/lib/crypto-icons";

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
  users, isLoading, onEdit, onAdjustBalance, onDelete, onResetCredentials, getUserTier, checkVerification 
}: UserCardGridProps) {
  const [syncingId, setSyncingId] = useState<string | null>(null);

  const handleGenerateWallets = async (userId: string) => {
    setSyncingId(userId);
    try {
      await generateBaseUserWallets(userId);
      toast({ title: "تم توليد الهوية المالية", description: "المستثمر الآن يمتلك حزمة محافظ مؤتمتة وجاهزة للإيداع." });
    } catch (e) {
      toast({ variant: "destructive", title: "فشل بروتوكول التوليد" });
    } finally {
      setSyncingId(null);
    }
  };

  if (isLoading) return <div className="py-40 text-center"><Loader2 className="animate-spin h-10 w-10 mx-auto text-gray-200" /></div>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {users.map((user) => {
        const tier = getUserTier(user);
        const isOnline = user.lastActive && (new Date().getTime() - new Date(user.lastActive).getTime() < 300000);
        const assignedWalletsCount = user.assignedWallets ? Object.keys(user.assignedWallets).length : 0;
        const hasWallets = assignedWalletsCount > 0;
        
        return (
          <Card key={user.id} className="border-none shadow-sm rounded-[40px] md:rounded-[56px] bg-white overflow-hidden group transition-all hover:shadow-2xl hover:-translate-y-2 flex flex-col relative border border-gray-50/50">
            <CardContent className="p-6 md:p-8 space-y-6 md:space-y-8 flex-1">
              <div className="absolute top-6 right-6 md:top-8 md:right-8 z-20">
                {isOnline ? (
                  <Badge className="bg-emerald-50 text-emerald-600 border-none font-black text-[7px] md:text-[8px] px-3 py-1 rounded-full animate-pulse shadow-sm">متصل الآن</Badge>
                ) : (
                  <Badge className="bg-gray-50 text-gray-300 border-none font-black text-[7px] md:text-[8px] px-3 py-1 rounded-full">غير متصل</Badge>
                )}
              </div>

              <div className="flex items-center gap-4 md:gap-5">
                <div className="h-12 w-12 md:h-16 md:w-16 rounded-[18px] md:rounded-[24px] bg-gray-50 flex items-center justify-center text-lg md:text-xl font-black text-[#002d4d] shadow-inner group-hover:bg-[#002d4d] group-hover:text-[#f9a885] transition-all duration-500 shrink-0">
                  {user.displayName?.[0] || 'U'}
                </div>
                <div className="text-right min-w-0">
                  <h3 className="font-black text-base md:text-lg text-[#002d4d] truncate">{user.displayName}</h3>
                  <div className="flex items-center gap-2 opacity-40 mt-1">
                     <Phone size={10} className="text-blue-500" />
                     <span className="text-[8px] md:text-[9px] font-bold tabular-nums" dir="ltr">{user.phoneNumber}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 md:gap-4">
                <div className="p-4 md:p-5 bg-gray-50/50 rounded-[24px] md:rounded-[32px] border border-gray-100/50 space-y-1.5 shadow-inner">
                  <p className="text-[7px] md:text-[8px] font-black text-gray-400 uppercase tracking-widest">الرصيد الجاري</p>
                  <p className="text-base md:text-lg font-black text-[#002d4d] tabular-nums tracking-tighter">
                    ${user.totalBalance?.toLocaleString()}
                  </p>
                </div>
                <div className="p-4 md:p-5 bg-emerald-50/20 rounded-[24px] md:rounded-[32px] border border-emerald-100/20 space-y-1.5 shadow-inner">
                  <p className="text-[7px] md:text-[8px] font-black text-emerald-600/60 uppercase tracking-widest">صافي الأرباح</p>
                  <p className="text-base md:text-lg font-black text-emerald-600 tabular-nums tracking-tighter">
                    +${user.totalProfits?.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="p-4 md:p-5 bg-gray-50 rounded-[24px] md:rounded-[28px] border border-gray-100 flex items-center justify-between">
                 <div className="flex items-center gap-2 md:gap-3">
                    <div className={cn(
                      "h-8 w-8 md:h-9 md:w-9 rounded-xl flex items-center justify-center shadow-inner transition-all", 
                      hasWallets ? "bg-blue-50 text-blue-600" : "bg-orange-50 text-orange-400"
                    )}>
                       {hasWallets ? <ShieldCheck size={16} /> : <ShieldAlert size={16} />}
                    </div>
                    <div className="text-right">
                       <p className="text-[8px] md:text-[9px] font-black text-[#002d4d]">الهوية المالية</p>
                       <p className="text-[6px] md:text-[7px] font-bold text-gray-400 uppercase">
                         {hasWallets ? `${assignedWalletsCount} Wallets Active` : 'No Nodes Found'}
                       </p>
                    </div>
                 </div>
                 {syncingId === user.id ? (
                   <div className="h-7 md:h-8 px-2 md:px-3 rounded-lg bg-white border border-gray-100 flex items-center gap-2">
                      <Loader2 className="animate-spin size-2.5 md:size-3 text-blue-500" />
                      <span className="text-[6px] md:text-[7px] font-black text-blue-500 uppercase">Syncing</span>
                   </div>
                 ) : (
                   <button 
                     onClick={() => handleGenerateWallets(user.id)}
                     className="h-7 md:h-8 px-2 md:px-3 rounded-lg bg-white border border-gray-100 text-[7px] md:text-[8px] font-black text-blue-600 hover:bg-blue-50 uppercase tracking-widest flex items-center gap-1.5 transition-all shadow-sm"
                   >
                      <Zap size={10} className="fill-current" /> {hasWallets ? "تحديث" : "توليد"}
                   </button>
                 )}
              </div>
            </CardContent>

            <div className="p-3 md:p-4 bg-gray-50/80 border-t border-gray-100 grid grid-cols-6 gap-1.5 md:gap-2">
              <Link href={`/admin/users/${user.id}`} className="contents">
                <Button variant="ghost" title="الملف الكامل" className="h-10 md:h-11 rounded-xl md:rounded-2xl bg-white border border-gray-100 text-emerald-600 hover:bg-emerald-50 shadow-sm transition-all active:scale-95 px-0">
                  <UserSearch size={16} className="md:size-5" />
                </Button>
              </Link>
              
              <Button onClick={() => onEdit(user)} variant="ghost" title="تعديل" className="h-10 md:h-11 rounded-xl md:rounded-2xl bg-white border border-gray-100 text-blue-500 hover:bg-blue-50 shadow-sm transition-all active:scale-95 px-0">
                <Edit size={16} className="md:size-5" />
              </Button>
              
              <Button onClick={() => onAdjustBalance(user)} variant="ghost" title="الرصيد" className="h-10 md:h-11 rounded-xl md:rounded-2xl bg-white border border-gray-100 text-orange-500 hover:bg-orange-50 shadow-sm transition-all active:scale-95 px-0">
                <Wallet size={16} className="md:size-5" />
              </Button>
              
              <Button 
                onClick={() => handleGenerateWallets(user.id)} 
                variant="ghost" 
                title="مزامنة"
                disabled={syncingId === user.id}
                className="h-10 md:h-11 rounded-xl md:rounded-2xl bg-white border border-gray-100 text-cyan-600 hover:bg-cyan-50 shadow-sm transition-all active:scale-95 px-0"
              >
                {syncingId === user.id ? <Loader2 className="animate-spin size-[16px] md:size-[18px]" /> : <Cpu size={16} className="md:size-5" />}
              </Button>
              
              <Button onClick={() => onResetCredentials(user)} variant="ghost" title="الأمان" className="h-10 md:h-11 rounded-xl md:rounded-2xl bg-white border border-gray-100 text-purple-500 hover:bg-purple-50 shadow-sm transition-all active:scale-95 px-0">
                <KeyRound size={16} className="md:size-5" />
              </Button>
              
              <Button onClick={() => onDelete(user)} variant="ghost" title="حذف" className="h-10 md:h-11 rounded-xl md:rounded-2xl bg-white border border-gray-100 text-red-400 hover:bg-red-50 shadow-sm transition-all active:scale-95 px-0">
                <Trash2 size={16} className="md:size-5" />
              </Button>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
