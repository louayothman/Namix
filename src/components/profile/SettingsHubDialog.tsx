"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogPortal, DialogOverlay } from "@/components/ui/dialog";
import { Settings, UserCircle, ChevronLeft, Fingerprint, KeyRound, Sparkles, ChevronRight, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

import { EditProfileDialog } from "./EditProfileDialog";
import { ChangePasswordDialog } from "./ChangePasswordDialog";
import { PinSetupDialog } from "./PinSetupDialog";

interface SettingsHubDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: any;
  dbUser: any;
  onProfileUpdate: () => void;
}

type SettingsView = 'menu' | 'profile' | 'password' | 'pin';

export function SettingsHubDialog({ open, onOpenChange, user, dbUser, onProfileUpdate }: SettingsHubDialogProps) {
  const [activeView, setActiveView] = useState<SettingsView>('menu');

  useEffect(() => {
    if (open) setActiveView('menu');
  }, [open]);

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1100]" />
        <DialogContent className="fixed left-[50%] top-[50%] z-[1101] translate-x-[-50%] translate-y-[-50%] rounded-[56px] border-none shadow-2xl p-0 max-w-[420px] w-[94vw] overflow-hidden font-body text-right flex flex-col max-h-[85vh] outline-none bg-white" dir="rtl">
          
          <div className="bg-[#002d4d] p-8 text-white relative shrink-0 overflow-hidden text-center">
             <div className="absolute top-0 right-0 p-4 opacity-5 -rotate-12 pointer-events-none">
                <Settings className="h-32 w-32" />
             </div>
             
             <div className="relative z-10 flex items-center justify-between">
                {activeView !== 'menu' ? (
                  <button 
                    onClick={() => setActiveView('menu')}
                    className="h-10 w-10 rounded-2xl bg-white/10 flex items-center justify-center text-white active:scale-90 transition-all"
                  >
                    <ChevronRight size={20} />
                  </button>
                ) : (
                  <div className="h-10 w-10" /> 
                )}
                
                <div className="space-y-0.5">
                   <DialogTitle className="text-xl font-black tracking-normal leading-none">{getTitle()}</DialogTitle>
                   <div className="flex items-center justify-center gap-1.5 text-blue-200/40 font-black text-[7px] uppercase tracking-widest mt-1">
                      <Sparkles className="h-2 w-2" />
                      Sovereign Identity Hub
                   </div>
                </div>

                <button onClick={() => onOpenChange(false)} className="h-10 w-10 rounded-2xl bg-white/10 flex items-center justify-center text-white active:scale-90">
                  <X size={18} />
                </button>
             </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-white scrollbar-none min-h-[350px]">
             <AnimatePresence mode="wait">
                {activeView === 'menu' ? (
                  <motion.div 
                    key="menu" 
                    initial={{ opacity: 0, x: 20 }} 
                    animate={{ opacity: 1, x: 0 }} 
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-3"
                  >
                    {menuItems.map((item) => (
                      <button 
                        key={item.id}
                        onClick={() => setActiveView(item.id as any)}
                        className="w-full relative overflow-hidden flex items-center justify-between p-6 bg-gray-50/50 hover:bg-white border border-gray-100 rounded-[32px] transition-all group active:scale-[0.98] hover:shadow-xl"
                      >
                         <div className={cn("absolute -bottom-4 -left-4 opacity-[0.03] transition-all duration-700 pointer-events-none", item.color)}>
                            <item.icon size={80} />
                         </div>

                         <div className="relative z-10 text-right">
                            <h3 className="font-black text-[14px] text-[#002d4d]">{item.title}</h3>
                            <p className="text-[10px] text-gray-400 font-bold mt-1">{item.desc}</p>
                         </div>

                         <div className="relative z-10 h-8 w-8 rounded-full bg-white flex items-center justify-center text-gray-200 group-hover:bg-[#002d4d] group-hover:text-[#f9a885] transition-all shadow-sm">
                            <ChevronLeft className="h-4 w-4" />
                         </div>
                      </button>
                    ))}
                  </motion.div>
                ) : (
                  <motion.div 
                    key="form-view" 
                    initial={{ opacity: 0, x: -20 }} 
                    animate={{ opacity: 1, x: 0 }} 
                    exit={{ opacity: 0, x: 20 }}
                  >
                    {activeView === 'profile' && (
                      <EditProfileDialog 
                        open={true} 
                        onOpenChange={() => { setActiveView('menu'); onProfileUpdate(); }} 
                        user={user} 
                        dbUser={dbUser} 
                        onSuccess={() => { setActiveView('menu'); onProfileUpdate(); }} 
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
          
          <div className="p-5 bg-gray-50/50 border-t border-gray-100 text-center shrink-0">
             <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest">Namix Sovereign Identity Protocol</p>
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
