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
  ChevronLeft,
  X
} from "lucide-react";
import { useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { doc } from "firebase/firestore";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

import { EditProfileDialog } from "@/components/profile/EditProfileDialog";
import { ChangePasswordDialog } from "@/components/profile/ChangePasswordDialog";
import { PinSetupDialog } from "@/components/profile/PinSetupDialog";

/**
 * @fileOverview صفحة إعدادات الحساب المستقلة v4.0 - Critical Stability Fix
 * تم تجريد كافة قيم التباعد (Letter Spacing) والعمليات الحسابية المسببة لخطأ RangeError.
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
      try {
        setUser(JSON.parse(userSession));
      } catch (e) {
        router.push("/login");
      }
    } else {
      router.push("/login");
    }
  }, [router]);

  const userDocRef = useMemoFirebase(() => user?.id ? doc(db, "users", user.id) : null, [db, user?.id]);
  const { data: dbUser } = useDoc(userDocRef);

  const menuItems = [
    { id: 'profile', title: "توثيق الهوية المعتمد", desc: "تحديث البيانات الشخصية والمستندات", icon: UserCircle, color: "text-blue-500", bg: "bg-blue-50" },
    { id: 'password', title: "تغيير كلمة المرور", desc: "تحديث شفرة الدخول وبروتوكولات الأمان", icon: KeyRound, color: "text-orange-500", bg: "bg-orange-50" },
    { id: 'pin', title: "رمز PIN الخزنة", desc: "تأمين العمليات المالية برمز حماية حيوي", icon: Fingerprint, color: "text-emerald-500", bg: "bg-emerald-50" },
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
    <div className="max-w-2xl mx-auto space-y-10 px-6 pt-10 pb-32 font-body text-right select-none" dir="rtl">
      
      {/* Clean Header */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-8">
         <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-[22px] bg-[#002d4d] text-white flex items-center justify-center shadow-xl">
               {activeView === 'menu' ? <Settings size={24} /> : <ChevronRight size={24} onClick={() => setActiveView('menu')} className="cursor-pointer" />}
            </div>
            <div className="space-y-0.5">
               <h1 className="text-2xl font-black text-[#002d4d]">{getTitle()}</h1>
               <div className="flex items-center gap-2 text-blue-500 font-bold text-[10px] mt-1">
                  <Sparkles size={10} className="text-[#f9a885]" />
                  <span>Security Control</span>
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
                exit={{ opacity: 0, scale: 0.95 }}
                className="space-y-4"
              >
                {menuItems.map((item) => (
                  <button 
                    key={item.id}
                    onClick={() => setActiveView(item.id as any)}
                    className="w-full relative overflow-hidden flex items-center justify-between p-8 bg-white hover:bg-gray-50 border border-gray-100 rounded-[40px] transition-all group active:scale-[0.98] shadow-sm hover:shadow-xl"
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
                initial={{ opacity: 0, scale: 0.98 }} 
                animate={{ opacity: 1, scale: 1 }} 
                exit={{ opacity: 0, scale: 0.98 }}
                className="bg-white p-8 md:p-12 rounded-[56px] border border-gray-100 shadow-2xl relative"
              >
                <div className="absolute top-6 left-6 z-20">
                   <button 
                     onClick={() => setActiveView('menu')}
                     className="h-8 w-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-red-500 transition-all"
                   >
                     <X size={16} />
                   </button>
                </div>

                <div className="relative z-10">
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
                </div>
              </motion.div>
            )}
         </AnimatePresence>
      </div>

      <div className="flex flex-col items-center gap-4 pt-16 opacity-20">
         <p className="text-[10px] font-black text-[#002d4d] text-center uppercase">Namix Security Hub</p>
         <div className="flex gap-2">
            <div className="h-1 w-1 rounded-full bg-gray-300" />
            <div className="h-1 w-1 rounded-full bg-gray-300" />
            <div className="h-1 w-1 rounded-full bg-gray-300" />
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
