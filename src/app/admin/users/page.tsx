
"use client";

import { useState, useMemo, useEffect } from "react";
import { Shell } from "@/components/layout/Shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, Loader2, Download, Activity, ChevronDown, Globe, Users } from "lucide-react";
import { useFirestore, useCollection, useDoc, useMemoFirebase } from "@/firebase";
import { collection, query, orderBy, doc, updateDoc, increment, deleteDoc } from "firebase/firestore";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

// Modular Components
import { UserStatsCards } from "@/components/admin/users/UserStatsCards";
import { UserCardGrid } from "@/components/admin/users/UserCardGrid";
import { EditUserDialog } from "@/components/admin/users/EditUserDialog";
import { BalanceAdjustmentDialog } from "@/components/admin/users/BalanceAdjustmentDialog";
import { CredentialResetDialog } from "@/components/admin/users/CredentialResetDialog";

export default function AdminUsersPage() {
  const db = useFirestore();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterOnlineOnly, setFilterOnlineOnly] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isBalanceOpen, setIsBalanceOpen] = useState(false);
  const [isResetOpen, setIsResetOpen] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [now, setNow] = useState(new Date());
  
  // Pagination State
  const [visibleCount, setVisibleCount] = useState(10);

  // Balance Adjustment State
  const [balanceAction, setBalanceAction] = useState<"add" | "deduct">("add");
  const [balanceAmount, setBalanceAmount] = useState("");

  // Edit User State
  const [editData, setEditData] = useState({
    displayName: "",
    phoneNumber: "",
    password: "",
    role: "user"
  });

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 10000);
    return () => clearInterval(timer);
  }, []);

  const usersQuery = useMemoFirebase(() => query(collection(db, "users"), orderBy("createdAt", "desc")), [db]);
  const { data: users, isLoading } = useCollection(usersQuery);

  const tiersDocRef = useMemoFirebase(() => doc(db, "system_settings", "investor_tiers"), [db]);
  const { data: tiersData } = useDoc(tiersDocRef);

  const filteredUsers = useMemo(() => {
    if (!users) return [];
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    
    let result = users.filter(u => 
      u.displayName?.toLowerCase().includes(searchQuery.toLowerCase()) || 
      u.phoneNumber?.includes(searchQuery) ||
      u.id?.includes(searchQuery)
    );

    if (filterOnlineOnly) {
      result = result.filter(u => u.lastActive && new Date(u.lastActive) > fiveMinutesAgo);
    }

    return result;
  }, [users, searchQuery, filterOnlineOnly, now]);

  const displayedUsers = useMemo(() => {
    return filteredUsers.slice(0, visibleCount);
  }, [filteredUsers, visibleCount]);

  const stats = useMemo(() => {
    if (!users) return { total: 0, active: 0, admins: 0, online: 0 };
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    return {
      total: users.length,
      active: users.filter(u => (u.activeInvestmentsTotal || 0) > 0).length,
      admins: users.filter(u => u.role === 'admin').length,
      online: users.filter(u => u.lastActive && new Date(u.lastActive) > fiveMinutesAgo).length
    };
  }, [users, now]);

  const totalBalances = useMemo(() => users?.reduce((sum, u) => sum + (u.totalBalance || 0), 0) || 0, [users]);

  const getUserTier = (user: any) => {
    if (user.tier && typeof user.tier === 'object') return user.tier;
    if (!tiersData?.list || tiersData.list.length === 0) return null;
    
    const userStats = {
      balance: Number(user.totalBalance || 0),
      profits: Number(user.totalProfits || 0),
      historical: Number(user.activeInvestmentsTotal || 0) + Number(user.totalProfits || 0),
    };

    const sortedTiers = [...tiersData.list].sort((a,b) => {
      const balDiff = Number(b.minBalance || 0) - Number(a.minBalance || 0);
      if (balDiff !== 0) return balDiff;
      return Number(b.minTotalProfits || 0) - Number(a.minTotalProfits || 0);
    });
    
    const achieved = sortedTiers.find(t => {
      return userStats.balance >= Number(t.minBalance || 0) &&
             userStats.profits >= Number(t.minTotalProfits || 0) &&
             userStats.historical >= Number(t.minHistoricalInvest || 0);
    });

    return achieved || null;
  };

  const checkVerification = (user: any) => {
    return !!(user.displayName && user.email && user.birthDate);
  };

  const handleOpenEdit = (user: any) => {
    setSelectedUser(user);
    setEditData({
      displayName: user.displayName || "",
      phoneNumber: user.phoneNumber || "",
      password: user.password || "",
      role: user.role || "user"
    });
    setIsEditOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!selectedUser || processing) return;
    setProcessing(true);
    try {
      await updateDoc(doc(db, "users", selectedUser.id), {
        ...editData,
        updatedAt: new Date().toISOString()
      });
      toast({ title: "تم التحديث بنجاح", description: "تم تعديل بيانات المستثمر في القاعدة السيادية." });
      setIsEditOpen(false);
    } catch (e) {
      toast({ variant: "destructive", title: "خطأ في البروتوكول" });
    } finally {
      setProcessing(false);
    }
  };

  const handleAdjustBalance = async () => {
    if (!selectedUser || !balanceAmount || processing) return;
    setProcessing(true);
    try {
      const amount = Number(balanceAmount);
      const adjustment = balanceAction === "add" ? amount : -amount;
      
      await updateDoc(doc(db, "users", selectedUser.id), {
        totalBalance: increment(adjustment)
      });

      toast({ 
        title: balanceAction === "add" ? "تم حقن الرصيد" : "تم سحب الرصيد", 
        description: `تم تعديل المركز المالي لـ ${selectedUser.displayName} بمقدار $${amount}` 
      });
      setIsBalanceOpen(false);
      setBalanceAmount("");
    } catch (e) {
      toast({ variant: "destructive", title: "فشل التعديل المالي" });
    } finally {
      setProcessing(false);
    }
  };

  const handleResetCredential = async (type: 'password' | 'pin', newValue: string) => {
    if (!selectedUser || processing) return;
    setProcessing(true);
    try {
      const updateData: any = { updatedAt: new Date().toISOString() };
      if (type === 'password') updateData.password = newValue;
      else updateData.securityPin = newValue;

      await updateDoc(doc(db, "users", selectedUser.id), updateData);
      toast({ 
        title: "اكتمل بروتوكول الأمان", 
        description: `تم تحديث ${type === 'password' ? 'كلمة المرور' : 'رمز PIN'} بنجاح.` 
      });
      setIsResetOpen(false);
    } catch (e) {
      toast({ variant: "destructive", title: "فشل التحديث الأمني" });
    } finally {
      setProcessing(false);
    }
  };

  const handleDeleteUser = async (user: any) => {
    if (!confirm(`هل أنت متأكد من حذف المستثمر ${user.displayName}؟ لا يمكن التراجع عن هذا الإجراء السيادي.`)) return;
    try {
      await deleteDoc(doc(db, "users", user.id));
      toast({ title: "تم الحذف النهائي", description: "تم إزالة الهوية الرقمية من قاعدة البيانات." });
    } catch (e) {
      toast({ variant: "destructive", title: "خطأ في تنفيذ الحذف" });
    }
  };

  const loadMore = () => {
    setVisibleCount(prev => prev + 10);
  };

  return (
    <Shell isAdmin>
      <div className="space-y-10 px-6 pt-10 pb-24 max-w-[1600px] mx-auto font-body">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-gray-100 pb-8">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-purple-500 font-black text-[10px] uppercase tracking-[0.4em]">
              <div className="h-2 w-2 rounded-full bg-purple-500 animate-pulse" />
              Investor Identity Repository
            </div>
            <h1 className="text-4xl font-black text-[#002d4d] tracking-tight">إدارة قاعدة المستثمرين</h1>
            <p className="text-muted-foreground font-bold text-xs">تحكم مركزي متقدم في هويات المستثمرين، مراكزهم المالية، وصلاحيات الوصول السيادية.</p>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="relative w-80">
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input 
                  placeholder="ابحث بالاسم، الهاتف، أو المعرف..." 
                  value={searchQuery}
                  onChange={e => { setSearchQuery(e.target.value); setVisibleCount(10); }}
                  className="h-12 rounded-full bg-white border-gray-100 shadow-sm pr-11 font-bold text-xs focus-visible:ring-2 focus-visible:ring-purple-500 text-right" 
                />
             </div>
             <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setFilterOnlineOnly(!filterOnlineOnly)}
                  className={cn(
                    "rounded-full h-12 px-6 border-gray-100 shadow-sm transition-all font-black text-[10px] gap-2",
                    filterOnlineOnly ? "bg-emerald-50 text-emerald-600 border-emerald-200" : "bg-white text-gray-400 hover:bg-gray-50"
                  )}
                >
                   <Globe className={cn("h-4 w-4", filterOnlineOnly && "animate-pulse")} />
                   {filterOnlineOnly ? "عرض الكل" : "المتصلون الآن"}
                </Button>
                <Button variant="outline" className="rounded-full h-12 w-12 p-0 border-gray-100 bg-white shadow-sm hover:bg-gray-50">
                   <Download className="h-4 w-4 text-gray-400" />
                </Button>
             </div>
          </div>
        </div>

        <UserStatsCards stats={stats} totalBalances={totalBalances} />

        <div className="space-y-10">
           <div className="flex items-center justify-between px-4">
              <div className="flex items-center gap-2">
                 <Activity className="h-4 w-4 text-emerald-500" />
                 <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Active Database Nodes</span>
              </div>
              <p className="text-[10px] font-bold text-gray-300">يتم عرض {displayedUsers.length} من إجمالي {filteredUsers.length} مستثمر مطابق</p>
           </div>

           <UserCardGrid 
             users={displayedUsers} 
             isLoading={isLoading} 
             onEdit={handleOpenEdit}
             onAdjustBalance={(user) => { setSelectedUser(user); setIsBalanceOpen(true); }}
             onResetCredentials={(user) => { setSelectedUser(user); setIsResetOpen(true); }}
             onDelete={handleDeleteUser}
             getUserTier={getUserTier}
             checkVerification={checkVerification}
           />

           {filteredUsers.length > visibleCount && (
             <div className="flex justify-center pt-8">
                <Button 
                  onClick={loadMore}
                  className="h-14 px-12 rounded-full bg-[#002d4d] hover:bg-[#001d33] text-white font-black text-xs shadow-2xl transition-all active:scale-95 group"
                >
                  <ChevronDown className="ml-3 h-5 w-5 text-[#f9a885] transition-transform group-hover:translate-y-1" />
                  استكشاف المزيد من المستثمرين
                </Button>
             </div>
           )}
        </div>
      </div>

      <EditUserDialog 
        open={isEditOpen} 
        onOpenChange={setIsEditOpen} 
        user={selectedUser}
        editData={editData}
        onDataChange={setEditData}
        onSave={handleSaveEdit}
        processing={processing}
      />

      <BalanceAdjustmentDialog 
        open={isBalanceOpen}
        onOpenChange={setIsBalanceOpen}
        user={selectedUser}
        action={balanceAction}
        onActionChange={setBalanceAction}
        amount={balanceAmount}
        onAmountChange={setBalanceAmount}
        onConfirm={handleAdjustBalance}
        processing={processing}
      />

      <CredentialResetDialog 
        open={isResetOpen}
        onOpenChange={setIsResetOpen}
        user={selectedUser}
        onConfirm={handleResetCredential}
        processing={processing}
      />
    </Shell>
  );
}
