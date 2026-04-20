
"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, Zap, TrendingUp, Award, UserMinus, ShieldCheck, 
  Wallet, UserX, User, Search, Loader2, X, CheckCircle2 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { searchUsers } from "@/app/actions/user-actions";
import { motion, AnimatePresence } from "framer-motion";

interface TargetAudienceSelectorProps {
  value: string;
  onChange: (val: string) => void;
  onUserSelect?: (userId: string | null) => void;
  className?: string;
}

const AUDIENCE_OPTIONS = [
  { id: 'all', label: 'جميع المسجلين', icon: Users, color: 'text-blue-500' },
  { id: 'single_user', label: 'مستثمر محدد (بحث)', icon: User, color: 'text-orange-500' },
  { id: 'active_investors', label: 'المستثمرون النشطون (لديهم عقود)', icon: Zap, color: 'text-emerald-500' },
  { id: 'new_users', label: 'المسجلون الجدد (آخر 7 أيام)', icon: TrendingUp, color: 'text-blue-600' },
  { id: 'whales', label: 'كبار المستثمرين (إيداع > 5000$)', icon: Wallet, color: 'text-purple-500' },
  { id: 'tier_bronze', label: 'رتبة المستوى البرونزي', icon: Award, color: 'text-orange-400' },
  { id: 'tier_silver', label: 'رتبة الفئة الفضية', icon: Award, color: 'text-gray-400' },
  { id: 'tier_gold', label: 'رتبة العضوية الذهبية', icon: Award, color: 'text-yellow-500' },
  { id: 'tier_diamond', label: 'رتبة الصك الماسي', icon: Award, color: 'text-blue-600' },
  { id: 'zero_balance', label: 'مستخدمون برصيد صفر', icon: UserX, color: 'text-red-400' },
  { id: 'no_investments', label: 'مستخدمون لم يفعّلوا عقوداً', icon: UserMinus, color: 'text-gray-500' },
  { id: 'admins', label: 'الطاقم الإداري فقط', icon: ShieldCheck, color: 'text-[#002d4d]' },
];

export function TargetAudienceSelector({ 
  value, 
  onChange, 
  onUserSelect,
  className 
}: TargetAudienceSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [foundUser, setFoundUser] = useState<{id: string, displayName: string, email?: string} | null>(null);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchError, setSearchError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    setIsSearching(true);
    setSearchError(null);
    setSearchResults([]);
    
    try {
      const res = await searchUsers(searchTerm);
      if (res.success && res.users && res.users.length > 0) {
        if (res.users.length === 1) {
          selectUser(res.users[0]);
        } else {
          setSearchResults(res.users);
        }
      } else {
        setSearchError("لم يتم العثور على نتائج تطابق معايير البحث.");
      }
    } catch (e) {
      setSearchError("خطأ في الاتصال بالخادم الرئيسي.");
    } finally {
      setIsSearching(false);
    }
  };

  const selectUser = (user: any) => {
    setFoundUser({ id: user.id, displayName: user.displayName, email: user.email });
    setSearchResults([]);
    setSearchTerm(user.displayName);
    if (onUserSelect) onUserSelect(user.id);
  };

  const clearUser = () => {
    setFoundUser(null);
    setSearchResults([]);
    setSearchTerm("");
    if (onUserSelect) onUserSelect(null);
  };

  return (
    <div className={cn("space-y-6", className)}>
      <div className="space-y-3">
        <Label className="text-[10px] font-black text-gray-400 uppercase pr-4 tracking-widest">تحديد الفئة المستهدفة</Label>
        <Select value={value} onValueChange={(val) => { onChange(val); if(val !== 'single_user') clearUser(); }}>
          <SelectTrigger className="h-14 rounded-2xl bg-gray-50 border-none font-black text-xs px-8 shadow-inner text-right">
            <SelectValue placeholder="اختر الفئة المراد استهدافها..." />
          </SelectTrigger>
          <SelectContent className="rounded-[28px] border-none shadow-2xl p-2 min-w-[300px]" dir="rtl">
            {AUDIENCE_OPTIONS.map((opt) => (
              <SelectItem key={opt.id} value={opt.id} className="rounded-xl py-3 cursor-pointer">
                <div className="flex items-center gap-3 justify-end text-right">
                  <span className="font-bold text-xs">{opt.label}</span>
                  <opt.icon className={cn("h-4 w-4", opt.color)} />
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <AnimatePresence>
        {value === 'single_user' && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -10 }}
            className="p-6 bg-blue-50/50 rounded-[32px] border border-blue-100/50 space-y-6"
          >
            <div className="space-y-3">
               <Label className="text-[9px] font-black text-blue-600 uppercase pr-2">البحث عن مستثمر محدد</Label>
               <div className="flex items-center gap-3">
                  <div className="relative flex-1">
                     <Input 
                       placeholder="ابحث بكلمة من الاسم، البريد، أو الـ ID..." 
                       value={searchTerm}
                       onChange={e => {setSearchTerm(e.target.value); if(foundUser) clearUser();}}
                       className="h-12 rounded-xl bg-white border-none font-bold text-xs pr-10 shadow-sm text-right"
                     />
                     <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-300" />
                  </div>
                  {!foundUser ? (
                    <Button 
                      onClick={handleSearch} 
                      disabled={isSearching || !searchTerm.trim()}
                      className="h-12 px-6 rounded-xl bg-[#002d4d] text-white font-black text-[10px] shadow-lg active:scale-95"
                    >
                      {isSearching ? <Loader2 className="animate-spin h-4 w-4" /> : "بحث"}
                    </Button>
                  ) : (
                    <Button onClick={clearUser} variant="ghost" className="h-12 w-12 rounded-xl bg-red-50 text-red-500 p-0 shadow-sm">
                      <X size={18} />
                    </Button>
                  )}
               </div>
               {searchError && <p className="text-[9px] font-bold text-red-500 pr-2">{searchError}</p>}
            </div>

            {/* قائمة نتائج البحث المتعددة */}
            <AnimatePresence>
               {searchResults.length > 0 && !foundUser && (
                 <motion.div 
                   initial={{ opacity: 0, height: 0 }} 
                   animate={{ opacity: 1, height: 'auto' }} 
                   exit={{ opacity: 0, height: 0 }}
                   className="space-y-2 max-h-[220px] overflow-y-auto scrollbar-none pr-1"
                 >
                    {searchResults.map((u) => (
                      <button 
                        key={u.id}
                        onClick={() => selectUser(u)}
                        className="w-full p-4 bg-white hover:bg-gray-100 border border-gray-100 rounded-2xl flex items-center justify-between transition-all group/res active:scale-[0.98]"
                      >
                         <div className="h-8 w-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-300 group-hover/res:bg-blue-50 group-hover/res:text-blue-500">
                            <User size={14} />
                         </div>
                         <div className="text-right flex-1 pr-4">
                            <p className="text-[11px] font-black text-[#002d4d]">{u.displayName}</p>
                            <p className="text-[8px] font-bold text-gray-400 truncate max-w-[200px]">{u.email}</p>
                         </div>
                         <Badge className="bg-gray-50 text-gray-400 border-none font-black text-[7px] px-2 py-0.5 rounded-md">ID: {u.namixId?.slice(-6)}</Badge>
                      </button>
                    ))}
                 </motion.div>
               )}
            </AnimatePresence>

            {foundUser && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-emerald-100 shadow-sm">
                 <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-inner">
                       <CheckCircle2 size={20} />
                    </div>
                    <div className="text-right">
                       <p className="text-[11px] font-black text-[#002d4d]">{foundUser.displayName}</p>
                       <p className="text-[8px] font-bold text-gray-400">تم تحديد المستثمر المستهدف</p>
                    </div>
                 </div>
                 <Badge className="bg-emerald-500 text-white border-none font-black text-[7px] px-2 py-0.5 rounded-md">SELECTED</Badge>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
