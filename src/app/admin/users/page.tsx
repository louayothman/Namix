
"use client";

import { useState, useMemo, useEffect } from "react";
import { Shell } from "@/components/layout/Shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Loader2, Download, Activity, ChevronDown, Globe, Users, Sparkles } from "lucide-react";
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

/**
 * @fileOverview إدارة قاعدة المستثمرين v10.0 - Integrated Identity Console
 * تم توحيد الإحصائيات في كتلة برمجية واحدة وتنسيق أزرار الإجراءات بشكل عرضي متكامل.
 */
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
  const [visibleCount, setVisibleCount] = useState(12);

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

    const sortedTiers = [...tiersData.list].sort((a,b) => Number(b.minBalance || 0) - Number(a.minBalance || 0));
    const achieved = sortedTiers.find(t => userStats.balance >= Number(t.minBalance || 0));
    return achieved || null;
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
      await updateDoc(doc(db, "users", selectedUser.id), { ...editData, updatedAt: new Date().toISOString() });
      toast({ title: "تم التحديث بنجاح" });
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
      await updateDoc(doc(db, "users", selectedUser.id), { totalBalance: increment(adjustment) });
      toast({ title: "تم تعديل المركز المالي" });
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
      toast({ title: "اكتمل بروتوكول الأمان" });
      setIsResetOpen(false);
    } catch (e) {
      toast({ variant: "destructive", title: "فشل التحديث" });
    } finally {
      setProcessing(false);
    }
  };

  const handleDeleteUser = async (user: any) => {
    if (!confirm(`حذف نهائي للمستثمر ${user.displayName}؟`)) return;
    try {
      await deleteDoc(doc(db, "users", user.id));
      toast({ title: "تم الحذف النهائي" });
    } catch (e) {
      toast({ variant: "destructive", title: "خطأ في تنفيذ الحذف" });
    }
  };

  return (
    <Shell isAdmin>
      <div className="max-w-[1600px] mx-auto space-y-10 px-6 pt-10 pb-24 font-body">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-gray-100 pb-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-purple-500 font-black text-[10px] uppercase tracking-[0.4em]">
              <div className="h-2 w-2 rounded-full bg-purple-500 animate-pulse" />
              Investor Identity Nexus
            </div>
            <h1 className="text-4xl font-black text-[#002d4d] tracking-tight">إدارة قاعدة المستثمرين</h1>
            <p className="text-muted-foreground font-bold text-xs">تحكم مركزي في الهويات، المراكز المالية، وصلاحيات الوصول السيادية.</p>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="relative w-80">
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input 
                  placeholder="ابحث بالاسم، الهاتف، أو المعرف..." 
                  value={searchQuery}
                  onChange={e => { setSearchQuery(e.target.value); setVisibleCount(12); }}
                  className="h-14 rounded-[22px] bg-white border-gray-100 shadow-sm pr-11 font-bold text-xs focus-visible:ring-2 focus-visible:ring-purple-500 text-right" 
                />
             </div>
             <div className="flex items-center gap-2 bg-gray-50 p-1.5 rounded-[22px] border border-gray-100">
                <Button 
                  variant="ghost" 
                  onClick={() => setFilterOnlineOnly(!filterOnlineOnly)}
                  className={cn(
                    "rounded-xl h-11 px-6 font-black text-[10px] gap-2 transition-all",
                    filterOnlineOnly ? "bg-[#002d4d] text-[#f9a885] shadow-lg" : "text-gray-400"
                  )}
                >
                   <Globe className={cn("h-4 w-4", filterOnlineOnly && "animate-pulse")} />
                   المتصلون
                </Button>
                <Button variant="ghost" className="rounded-xl h-11 w-11 p-0 text-gray-300 hover:text-[#002d4d]">
                   <Download size={18} />
                </Button>
             </div>
          </div>
        </div>

        {/* Unified Statistics Block */}
        <UserStatsCards stats={stats} totalBalances={totalBalances} />

        <div className="space-y-8">
           <div className="flex items-center justify-between px-6">
              <div className="flex items-center gap-3">
                 <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-inner">
                    <Activity size={20} />
                 </div>
                 <div className="text-right">
                    <h3 className="text-xl font-black text-[#002d4d]">جرد الهويات النشطة</h3>
                    <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Active Identity Repository</p>
                 </div>
              </div>
              <Badge className="bg-blue-50 text-blue-600 border-none font-black text-[8px] px-4 py-1.5 rounded-full shadow-inner tracking-widest">
                 {filteredUsers.length} MATCHES FOUND
              </Badge>
           </div>

           <UserCardGrid 
             users={displayedUsers} 
             isLoading={isLoading} 
             onEdit={handleOpenEdit}
             onAdjustBalance={(user) => { setSelectedUser(user); setIsBalanceOpen(true); }}
             onResetCredentials={(user) => { setSelectedUser(user); setIsResetOpen(true); }}
             onDelete={handleDeleteUser}
             getUserTier={getUserTier}
             checkVerification={(u) => !!(u.displayName && u.email && u.birthDate)}
           />

           {filteredUsers.length > visibleCount && (
             <div className="flex justify-center pt-12">
                <Button 
                  onClick={() => setVisibleCount(v => v + 12)}
                  className="h-16 px-12 rounded-full bg-[#002d4d] hover:bg-[#001d33] text-white font-black text-xs shadow-2xl transition-all active:scale-95 group"
                >
                  <ChevronDown className="ml-3 h-5 w-5 text-[#f9a885] transition-transform group-hover:translate-y-1" />
                  تحميل المزيد من المستثمرين
                </Button>
             </div>
           )}
        </div>
      </div>

      <EditUserDialog open={isEditOpen} onOpenChange={setIsEditOpen} user={selectedUser} editData={editData} onDataChange={setEditData} onSave={handleSaveEdit} processing={processing} />
      <BalanceAdjustmentDialog open={isBalanceOpen} onOpenChange={setIsBalanceOpen} user={selectedUser} action={balanceAction} onActionChange={setBalanceAction} amount={balanceAmount} onAmountChange={setBalanceAmount} onConfirm={handleAdjustBalance} processing={processing} />
      <CredentialResetDialog open={isResetOpen} onOpenChange={setIsResetOpen} user={selectedUser} onConfirm={handleResetCredential} processing={processing} />
    </Shell>
  );
}
