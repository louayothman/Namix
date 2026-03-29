
"use client";

import React, { useEffect, useState, useMemo, memo } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  TrendingUp, 
  ArrowUpCircle, 
  ArrowDownCircle, 
  LayoutDashboard,
  LogOut,
  Bell,
  Users,
  ShieldAlert,
  ArrowRight,
  Headset,
  Activity,
  Settings,
  BarChart3,
  Home,
  Zap,
  Target,
  UserCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useFirestore } from "@/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { Logo } from "./Logo";
import { Badge } from "@/components/ui/badge";

const NavItem = memo(({ item, active }: { item: any, active: boolean }) => (
  <Link 
    href={item.href}
    className={cn(
      "flex items-center gap-1.5 px-4 py-2 rounded-full text-[9px] font-black transition-all whitespace-nowrap shadow-sm",
      active 
        ? "bg-[#002d4d] text-[#f9a885] shadow-md scale-105" 
        : "bg-white/10 text-white hover:bg-white/20"
    )}
  >
    <item.icon className="h-3 w-3" />
    {item.name}
  </Link>
));

NavItem.displayName = "NavItem";

export function Shell({ 
  children, 
  isAdmin = false,
  managedUserId = null,
  managedUserName = "",
  hideMobileNav = false
}: { 
  children: React.ReactNode; 
  isAdmin?: boolean;
  managedUserId?: string | null;
  managedUserName?: string;
  hideMobileNav?: boolean;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [mounted, setMounted] = useState(false);
  const db = useFirestore();

  useEffect(() => {
    setMounted(true);
    const userSession = localStorage.getItem("namix_user");
    if (userSession) {
      const parsedUser = JSON.parse(userSession);
      setUser(parsedUser);

      const uid = managedUserId || parsedUser.id;
      if (uid) {
        const updatePulse = () => updateDoc(doc(db, "users", uid), { lastActive: new Date().toISOString() }).catch(() => {});
        updatePulse();
        const interval = setInterval(updatePulse, 60000);
        return () => clearInterval(interval);
      }
    }
  }, [db, managedUserId]);

  const adminNav = useMemo(() => [
    { name: "الرئيسية", href: "/admin", icon: LayoutDashboard },
    { name: "التقارير المالية", href: "/admin/reports", icon: BarChart3 },
    { name: "طلبات الإيداع", href: "/admin/deposits", icon: ArrowUpCircle },
    { name: "طلبات السحب", href: "/admin/withdrawals", icon: ArrowDownCircle },
    { name: "الدعم الفني", href: "/admin/support", icon: Headset },
    { name: "الخطط الاستثمارية", href: "/admin/plans", icon: TrendingUp },
    { name: "تداول ناميكس", href: "/admin/trade", icon: Activity },
    { name: "المستخدمين", href: "/admin/users", icon: Users },
    { name: "الإشعارات", href: "/admin/notifications", icon: Bell },
    { name: "الإعدادات", href: "/admin/settings", icon: Settings },
  ], []);

  if (!mounted) return <div className="min-h-screen bg-white" />;

  return (
    <div className="flex min-h-screen flex-col bg-[#fcfdfe] font-body text-[12px] selection:bg-[#f9a885]/30" dir="rtl">
      {managedUserId && (
        <div className="w-full bg-orange-500 text-white px-6 py-2 flex items-center justify-between sticky top-0 z-[200] shadow-md border-b border-white/10">
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 animate-pulse" />
            <span className="font-black text-[10px] tracking-tight">إدارة الهوية الاحترافية: {managedUserName || managedUserId}</span>
          </div>
          <Link href="/admin/users">
            <button className="bg-white/20 hover:bg-white/30 px-4 py-1 rounded-full font-black text-[9px] flex items-center gap-1 transition-all shadow-inner">
              <ArrowRight className="h-3 w-3" /> لوحة الإدارة
            </button>
          </Link>
        </div>
      )}

      {isAdmin && !managedUserId && (
        <header className="w-full bg-[#8899AA] px-4 py-3 shadow-sm sticky top-0 z-[150] backdrop-blur-md bg-opacity-95">
          <div className="container mx-auto flex flex-col lg:flex-row items-center justify-between gap-4">
            <div className="flex items-center justify-between w-full lg:w-auto">
              <Logo size="sm" className="text-white scale-90 shrink-0" />
              <Badge className="lg:hidden bg-[#002d4d] text-[#f9a885] border-none text-[8px] font-black uppercase tracking-widest">Admin Console</Badge>
            </div>
            
            <nav className="flex-1 w-full overflow-x-auto scrollbar-none py-1">
              <div className="flex items-center gap-1.5 min-w-max px-2">
                 {adminNav.map((item) => (
                   <NavItem key={item.href} item={item} active={pathname === item.href} />
                 ))}
                 <button 
                   onClick={() => { localStorage.removeItem("namix_user"); router.push("/login"); }}
                   className="flex items-center gap-1.5 px-5 py-2 rounded-full text-[9px] font-black bg-red-500/20 text-red-100 hover:bg-red-500 hover:text-white transition-all whitespace-nowrap shadow-sm"
                 >
                   <LogOut className="h-3 w-3" /> خروج
                 </button>
              </div>
            </nav>
          </div>
        </header>
      )}

      <main className="flex-1 flex flex-col relative">
        {children}
      </main>
    </div>
  );
}
