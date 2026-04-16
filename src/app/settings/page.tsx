
"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import { Shell } from "@/components/layout/Shell";
import { 
  ChevronRight, 
  Settings, 
  UserCircle, 
  KeyRound, 
  Fingerprint, 
  Sparkles,
  Loader2,
  ChevronLeft
} from "lucide-react";
import { useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { doc } from "firebase/firestore";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

import { EditProfileDialog } from "@/components/profile/EditProfileDialog";
import { ChangePasswordDialog } from "@/components/profile/ChangePasswordDialog";
import { PinSetupDialog } from "@/components/profile/PinSetupDialog";

/**
 * @fileOverview صفحة إعدادات الحساب المستقلة v2.0 - Stability Edition
 * تم إزالة كافة قيم tracking الاعتباطية لمنع تعطل المحرك (RangeError).
 */

type SettingsView = 'menu' | 'profile' | 'password' | 'pin';

function SettingsContent() {
  const [activeView, setActiveView] = useState<SettingsView>('menu');
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const db = useFirestore();

  useEffect(() => {
    const userSession = localStorage.getItem("namix_user");
    if (userSession) {
      setUser(JSON.parse(userSession));
    } else {
      router.push("/login");
    }
  }, [router]);

  const userDocRef = useMemoFirebase(() => user?.id ? doc(db, "users", user.id) : null, [db, user?.id]);
  const { data: dbUser } = useDoc(userDocRef);

  const menuItems = [
    { id: 'profile', title: "توثيق الهوية المعتمد", desc: "تحديث البيانات الشخصية والمستندات", icon: UserCircle, color: "text-blue-500" },
    { id: 'password', title: "تغيير كلمة المرور", desc: "تحديث شفرة الدخول وبروتوكولات الأمان", icon: KeyRound, color: "text-[#f9a885]" },
    { id: 'pin', title: "رمز PIN الخزنة", desc: "تأمين العمليات المالية برمز حماية حيوي", icon: Fingerprint, color: "text-emerald-500" },
  ];

  const getTitle = () => {
    switch(activeView) {
      case 'profile': return "توثيق الهوية";
      case 'password': return "تغيير كلمة المرور";
      case 'pin': return "رمز حماية الخزنة";
      default: return "إعدادات الحساب";
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto space-y-10 px-6 pt-10 pb-32 font-body text-right" dir="rtl">
      
      {/* Header Strip */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-8">
         <div className="flex items-center gap-4 text-right">
            <div className="h-12 w-12 rounded-[22px] bg-[#002d4d] text-[#f9a885] flex items-center justify-center shadow-xl">
               {activeView === 'menu' ? <Settings size={24} /> : <ChevronRight size={24} onClick={() => setActiveView('menu')} className="cursor-pointer" />}
            </div>
            <div className="space-y-0.5">
               <h1 className="text-2xl font-black text-[#002d4d] tracking-tight">{getTitle()}</h1>
               <div className="flex items-center gap-2 text-blue-500 font-black text-[9px] uppercase tracking-widest mt-1">
                  <Sparkles size={10} className="text-[#f9a885]" />
                  Security Protocol Hub
               </div>
            </div>
         </div>
         <button 
           onClick={() => activeView === 'menu' ? router.push("/profile") : setActiveView('menu')}
           className="h-10 w-10 rounded-2xl bg-gray-50 flex items-center justify-center text-[#002d4d] active:scale-90 border border-gray-100 shadow-sm"
         >
           <ChevronLeft size={20} className="rotate-180" />
         </button>
      </div>

      <div className="relative min-h-[400px]">
         <AnimatePresence mode="wait">
            {activeView === 'menu' ? (
              <motion.div 
                key="menu" 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                {menuItems.map((item) => (
                  <button 
                    key={item.id}
                    onClick={() => setActiveView(item.id as any)}
                    className="w-full relative overflow-hidden flex items-center justify-between p-8 bg-white hover:bg-gray-50/50 border border-gray-100 rounded-[44px] transition-all group active:scale-[0.98] shadow-sm hover:shadow-xl"
                  >
                     <div className={cn("absolute -bottom-6 -left-6 opacity-5 transition-all duration-700 pointer-events-none", item.color)}>
                        <item.icon size={120} />
                     </div>

                     <div className="relative z-10 text-right space-y-1">
                        <h3 className="font-black text-lg text-[#002d4d] group-hover:text-blue-600 transition-colors">{item.title}</h3>
                        <p className="text-[11px] text-gray-400 font-bold">{item.desc}</p>
                     </div>

                     <div className="relative z-10 h-10 w-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-300 group-hover:bg-[#002d4d] group-hover:text-[#f9a885] transition-all shadow-inner">
                        <ChevronLeft className="h-5 w-5" />
                     </div>
                  </button>
                ))}
              </motion.div>
            ) : (
              <motion.div 
                key="form-view" 
                initial={{ opacity: 0, x: 20 }} 
                animate={{ opacity: 1, x: 0 }} 
                exit={{ opacity: 0, x: -20 }}
                className="bg-white p-10 rounded-[56px] border border-gray-100 shadow-xl"
              >
                {activeView === 'profile' && (
                  <EditProfileDialog 
                    open={true} 
                    onOpenChange={() => setActiveView('menu')} 
                    user={user} 
                    dbUser={dbUser} 
                    onSuccess={() => { router.push("/profile"); }} 
                  />
                )}
                {activeView === 'password' && (
                  <ChangePasswordDialog 
                    open={true} 
                    onOpenChange={() => setActiveView('menu')} 
                    userId={user.id} 
                    dbUser={dbUser} 
                  />
                )}
                {activeView === 'pin' && (
                  <PinSetupDialog 
                    open={true} 
                    onOpenChange={() => setActiveView('menu')} 
                    dbUser={dbUser} 
                  />
                )}
              </motion.div>
            )}
         </AnimatePresence>
      </div>

      <div className="flex flex-col items-center gap-4 pt-16 opacity-20 select-none">
         <p className="text-[10px] font-black text-[#002d4d] uppercase tracking-widest text-center">Namix Security Nexus v2.0</p>
         <div className="flex gap-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-1.5 w-1.5 rounded-full bg-gray-300" />
            ))}
         </div>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <Shell>
      <Suspense fallback={<div className="h-screen flex items-center justify-center bg-white"><Loader2 className="animate-spin text-[#002d4d]" /></div>}>
        <SettingsContent />
      </Suspense>
    </Shell>
  );
}
