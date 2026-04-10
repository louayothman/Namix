
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  User, Edit, UserSearch, Wallet, Trash2, ShieldCheck, Award, Loader2,
  TrendingUp, Phone, Zap, KeyRound, Globe, Clock, ShieldAlert, Cpu
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { ar } from "date-fns/locale/ar";
import { generateBaseUserWallets } from "@/app/actions/nowpayments-actions";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

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
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {users.map((user) => {
        const tier = user.tier || getUserTier(user);
        const isVerified = checkVerification(user);
        const isOnline = user.lastActive && (new Date().getTime() - new Date(user.lastActive).getTime() < 300000);
        const assignedWalletsCount = user.assignedWallets ? Object.keys(user.assignedWallets).length : 0;
        const hasWallets = assignedWalletsCount > 0;
        
        return (
          <Card key={user.id} className="border-none shadow-sm rounded-[56px] bg-white overflow-hidden group transition-all hover:shadow-2xl hover:-translate-y-2 flex flex-col relative">
            <CardContent className="p-8 space-y-8 flex-1">
              <div className="absolute top-8 right-8 z-20">
                {isOnline ? (
                  <Badge className="bg-emerald-50 text-emerald-600 border-none font-black text-[8px] animate-pulse">متصل الآن</Badge>
                ) : (
                  <Badge className="bg-gray-50 text-gray-300 border-none font-black text-[8px]">غير متصل</Badge>
                )}
              </div>

              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-[28px] bg-gray-50 flex items-center justify-center text-xl font-black text-[#002d4d] shadow-inner group-hover:bg-[#002d4d] group-hover:text-[#f9a885] transition-all duration-500">
                  {user.displayName?.[0] || 'U'}
                </div>
                <div className="text-right">
                  <h3 className="font-black text-lg text-[#002d4d] truncate max-w-[160px]">{user.displayName}</h3>
                  <div className="flex items-center gap-2 opacity-40">
                     <Phone size={10} />
                     <span className="text-[9px] font-bold tabular-nums" dir="ltr">{user.phoneNumber}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-5 bg-gray-50 rounded-[32px] border border-gray-100 space-y-1.5 shadow-inner">
                  <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">الرصيد الجاري</p>
                  <p className="text-lg font-black text-[#002d4d] tabular-nums tracking-tighter">
                    ${user.totalBalance?.toLocaleString()}
                  </p>
                </div>
                <div className="p-5 bg-emerald-50/30 rounded-[32px] border border-emerald-100/50 space-y-1.5 shadow-inner">
                  <p className="text-[8px] font-black text-emerald-600/60 uppercase tracking-widest">صافي الأرباح</p>
                  <p className="text-lg font-black text-emerald-600 tabular-nums tracking-tighter">
                    +${user.totalProfits?.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-[24px] border border-gray-100">
                 <div className="flex items-center gap-3">
                    <div className={cn(
                      "h-8 w-8 rounded-xl flex items-center justify-center shadow-inner transition-all", 
                      hasWallets ? "bg-blue-50 text-blue-600" : "bg-orange-50 text-orange-400"
                    )}>
                       {hasWallets ? <ShieldCheck size={16} /> : <ShieldAlert size={16} />}
                    </div>
                    <div className="text-right">
                       <p className="text-[9px] font-black text-[#002d4d]">محافظ المزامنة الآلية</p>
                       <p className="text-[7px] font-bold text-gray-400 uppercase">
                         {hasWallets ? `${assignedWalletsCount} Nodes Connected` : 'No Assigned Nodes'}
                       </p>
                    </div>
                 </div>
                 {syncingId === user.id ? (
                   <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-lg shadow-sm border border-gray-100">
                      <Loader2 className="animate-spin size-3 text-blue-500" />
                      <span className="text-[7px] font-black text-blue-500 uppercase">Syncing...</span>
                   </div>
                 ) : (
                   <button 
                     onClick={() => handleGenerateWallets(user.id)}
                     className="text-[8px] font-black text-blue-600 hover:text-[#002d4d] uppercase tracking-widest flex items-center gap-1.5 transition-colors"
                   >
                      <Zap size={10} className="fill-current" /> {hasWallets ? "تحديث" : "توليد"}
                   </button>
                 )}
              </div>
            </CardContent>

            <div className="p-6 bg-gray-50/50 border-t border-gray-100 grid grid-cols-6 gap-2">
              <Link href={`/admin/users/${user.id}`} className="contents"><Button variant="ghost" title="عرض الملف الكامل" className="h-12 rounded-2xl bg-white border border-gray-100 text-emerald-600"><UserSearch size={18} /></Button></Link>
              <Button onClick={() => onEdit(user)} variant="ghost" title="تعديل البيانات" className="h-12 rounded-2xl bg-white border border-gray-100 text-blue-500"><Edit size={18} /></Button>
              <Button onClick={() => onAdjustBalance(user)} variant="ghost" title="تعديل الرصيد يدوياً" className="h-12 rounded-2xl bg-white border border-gray-100 text-orange-500"><Wallet size={18} /></Button>
              <Button 
                onClick={() => handleGenerateWallets(user.id)} 
                variant="ghost" 
                title="مزامنة وتوليد محافظ NOWPayments"
                disabled={syncingId === user.id}
                className="h-12 rounded-2xl bg-white border border-gray-100 text-cyan-600"
              >
                {syncingId === user.id ? <Loader2 className="animate-spin size-[18px]" /> : <Cpu size={18} />}
              </Button>
              <Button onClick={() => onResetCredentials(user)} variant="ghost" title="تصفير الأمان" className="h-12 rounded-2xl bg-white border border-gray-100 text-purple-500"><KeyRound size={18} /></Button>
              <Button onClick={() => onDelete(user)} variant="ghost" title="حذف المستثمر" className="h-12 rounded-2xl bg-white border border-gray-100 text-red-400"><Trash2 size={18} /></Button>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
