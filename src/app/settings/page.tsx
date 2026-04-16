
"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import { Shell } from "@/components/layout/Shell";
import { 
  Settings, 
  UserCircle, 
  KeyRound, 
  Fingerprint, 
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
    { id: 'profile', title: "توثيق الهوية", desc: "تحديث البيانات الشخصية", icon: UserCircle, color: "text-blue-500" },
    { id: 'password', title: "كلمة المرور", desc: "تحديث شفرة الدخول", icon: KeyRound, color: "text-orange-500" },
    { id: 'pin', title: "رمز الخزنة", desc: "تأمين العمليات المالية", icon: Fingerprint, color: "text-emerald-500" },
  ];

  const getTitle = () => {
    if (activeView === 'profile') return "توثيق الهوية المعتمد";
    if (activeView === 'password') return "تحديث كلمة المرور";
    if (activeView === 'pin') return "بروتوكول PIN الخزنة";
    return "إعدادات الحساب";
  };

  const handleBack = () => {
    if (activeView === 'menu') {
      router.push("/profile");
    } else {
      setActiveView('menu');
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto space-y-10 px-6 pt-10 pb-32 font-body text-right select-none" dir="rtl">
      
      {/* Integrated Sovereign Header */}
      <div className="flex flex-row items-center justify-between border-b border-gray-50 pb-8">
         <div className="text-right">
            <h1 className="text-2xl font-black text-[#002d4d] leading-none">{getTitle()}</h1>
            <p className="text-[9px] font-bold text-gray-300 mt-2">Security Hub Node</p>
         </div>

         <button 
           onClick={handleBack}
           className="h-12 w-12 rounded-2xl bg-gray-50 flex items-center justify-center text-[#002d4d] active:scale-90 border border-gray-100 shadow-sm transition-all"
         >
           <ChevronLeft className="h-6 w-6" />
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
                    className="w-full relative overflow-hidden flex items-center justify-between p-8 bg-white hover:bg-gray-50 border border-gray-100 rounded-[40px] transition-all group active:scale-[0.98] shadow-sm"
                  >
                     <div className={cn("absolute -bottom-6 -left-6 opacity-5 transition-all duration-700 pointer-events-none", item.color)}>
                        <item.icon size={120} />
                     </div>
                     <div className="relative z-10 text-right">
                        <h3 className="font-black text-lg text-[#002d4d] group-hover:text-blue-600 transition-colors">{item.title}</h3>
                        <p className="text-[11px] text-gray-400 font-bold">{item.desc}</p>
                     </div>
                     <div className="relative z-10 h-10 w-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-200 group-hover:bg-[#002d4d] group-hover:text-[#f9a885] transition-all shadow-inner">
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
                exit={{ opacity: 0, y: 10 }}
                className="relative pt-2"
              >
                {activeView === 'profile' && (
                  <EditProfileDialog 
                    open={true} 
                    onOpenChange={() => setActiveView('menu')} 
                    user={user} 
                    dbUser={dbUser} 
                    onSuccess={() => setActiveView('menu')} 
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

      <div className="flex flex-col items-center gap-2 pt-16 opacity-10">
         <p className="text-[8px] font-black text-[#002d4d] text-center">NAMIX SECURITY CORE</p>
         <div className="h-[1px] w-12 bg-gray-300" />
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
