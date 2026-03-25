
"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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
  Loader2 
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface UserTableProps {
  users: any[];
  isLoading: boolean;
  onEdit: (user: any) => void;
  onAdjustBalance: (user: any) => void;
  onDelete: (user: any) => void;
  getUserTier: (user: any) => any;
  checkVerification: (user: any) => boolean;
}

export function UserTable({ 
  users, 
  isLoading, 
  onEdit, 
  onAdjustBalance, 
  onDelete, 
  getUserTier, 
  checkVerification 
}: UserTableProps) {
  return (
    <div className="bg-white rounded-[48px] overflow-hidden shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50/50 hover:bg-gray-50/50 border-none">
            <TableHead className="pr-10 py-6 text-[10px] font-black uppercase text-gray-400 tracking-widest text-right">الملف الشخصي</TableHead>
            <TableHead className="text-[10px] font-black uppercase text-gray-400 tracking-widest text-right">التوثيق</TableHead>
            <TableHead className="text-[10px] font-black uppercase text-gray-400 tracking-widest text-right">الرتبة الحالية</TableHead>
            <TableHead className="text-[10px] font-black uppercase text-gray-400 tracking-widest text-right">الرصيد الجاري</TableHead>
            <TableHead className="text-[10px] font-black uppercase text-gray-400 tracking-widest text-right">صافي الأرباح</TableHead>
            <TableHead className="text-[10px] font-black uppercase text-gray-400 tracking-widest text-right">الصلاحيات</TableHead>
            <TableHead className="text-center text-[10px] font-black uppercase text-gray-400 tracking-widest">التحكم السيادي</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow><TableCell colSpan={7} className="text-center py-32"><Loader2 className="h-8 w-8 animate-spin text-gray-200 mx-auto" /></TableCell></TableRow>
          ) : users.length > 0 ? (
            users.map((user) => {
              const tier = getUserTier(user);
              const isVerified = checkVerification(user);
              return (
                <TableRow key={user.id} className="hover:bg-gray-50/30 transition-all border-gray-50 group/row">
                  <TableCell className="pr-10 py-5">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-[20px] bg-gray-50 flex items-center justify-center text-sm font-black text-[#002d4d] shadow-inner group-hover/row:bg-white transition-all">
                        {user.displayName?.[0] || 'U'}
                      </div>
                      <div className="space-y-0.5">
                        <span className="font-black text-sm text-[#002d4d] block">{user.displayName}</span>
                        <span className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter">ID: {user.id?.slice(-8)}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {isVerified ? (
                      <Badge className="bg-emerald-50 text-emerald-600 border-none font-black text-[8px] px-3 py-1 rounded-full shadow-inner flex items-center gap-1.5">
                        <ShieldCheck className="h-2.5 w-2.5" /> موثق
                      </Badge>
                    ) : (
                      <Badge className="bg-orange-50 text-orange-400 border-none font-black text-[8px] px-3 py-1 rounded-full shadow-inner flex items-center gap-1.5">
                        <ShieldAlert className="h-2.5 w-2.5" /> غير مكتمل
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {tier ? (
                      <Badge className={cn("text-[8px] font-black border-none px-3 py-1 rounded-full shadow-sm", `bg-${tier.color}-50 text-${tier.color}-600`)}>
                        <Award className="h-2.5 w-2.5 ml-1" />
                        {tier.name}
                      </Badge>
                    ) : (
                      <span className="text-[9px] text-gray-300 font-bold">بدون رتبة</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className="font-black text-sm text-[#002d4d] tabular-nums">${user.totalBalance?.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                  </TableCell>
                  <TableCell>
                    <span className="font-black text-sm text-emerald-600 tabular-nums">+${user.totalProfits?.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                  </TableCell>
                  <TableCell>
                    {user.role === 'admin' ? (
                      <Badge className="bg-red-50 text-red-600 border-none font-black text-[8px] px-3 py-1 rounded-full shadow-inner flex items-center gap-1.5">
                        <Shield className="h-2.5 w-2.5" /> مشرف النظام
                      </Badge>
                    ) : (
                      <Badge className="bg-gray-50 text-gray-400 border-none font-black text-[8px] px-3 py-1 rounded-full shadow-inner flex items-center gap-1.5">
                        <User className="h-2.5 w-2.5" /> مستثمر
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-2">
                      <Link href={`/admin/users/${user.id}`}>
                        <Button size="icon" variant="ghost" className="h-9 w-9 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-100 shadow-sm" title="معاينة المحفظة">
                          <UserSearch className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        onClick={() => onEdit(user)}
                        className="h-9 w-9 rounded-xl bg-blue-50 text-blue-500 hover:bg-blue-100 shadow-sm"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        onClick={() => onAdjustBalance(user)}
                        className="h-9 w-9 rounded-xl bg-orange-50 text-orange-500 hover:bg-orange-100 shadow-sm"
                        title="تعديل الرصيد"
                      >
                        <Wallet className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        onClick={() => onDelete(user)}
                        className="h-9 w-9 rounded-xl bg-red-50 text-red-400 hover:bg-red-100 shadow-sm"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-40">
                <div className="flex flex-col items-center gap-4 opacity-20">
                   <User className="h-16 w-16 text-[#002d4d]" />
                   <p className="text-xs font-black uppercase tracking-[0.4em]">لا يوجد مستثمرون يطابقون البحث</p>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
