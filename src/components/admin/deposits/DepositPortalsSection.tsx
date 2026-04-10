"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Plus, 
  Trash2, 
  ChevronDown, 
  ChevronUp, 
  ChevronLeft,
  Layers, 
  Cpu,
  ShieldCheck,
  Hash,
  Loader2,
  Sparkles,
  X,
  ClipboardPaste,
  Type,
  ListFilter,
  Zap,
  Wallet,
  Settings2,
  Globe,
  Radio,
  Info,
  FileText,
  Edit3,
  Save,
  ArrowRight,
  Activity
} from "lucide-react";
import { useFirestore, useCollection } from "@/firebase";
import { collection, doc, addDoc, deleteDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { useMemoFirebase } from "@/firebase";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { CryptoIcon, ICON_OPTIONS } from "@/lib/crypto-icons";
import { motion, AnimatePresence } from "framer-motion";

/**
 * @fileOverview مركز هندسة بوابات الإيداع الشمولية v7.0
 * تم إصلاح خطأ استيراد الأيقونات وإلغاء الـ Dialogs لصالح واجهة مفاعلات مدمجة.
 */

export function DepositPortalsSection() {
  const db = useFirestore();
  const [isCreatorOpen, setIsCreatorOpen] = useState(false);
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  
  // Create State
  const [newCat, setNewCat] = useState({ name: "", description: "", type: "manual" as any });
  const [creating, setCreating] = useState(false);

  // Categories Hook
  const categoriesQuery = useMemoFirebase(() => collection(db, "deposit_methods"), [db]);
  const { data: categories, isLoading } = useCollection(categoriesQuery);

  const editingCategory = categories?.find(c => c.id === editingCatId);

  const handleAddCategory = async () => {
    if (!newCat.name.trim()) return;
    setCreating(true);
    try {
      await addDoc(collection(db, "deposit_methods"), { 
        name: newCat.name, 
        description: newCat.description,
        type: newCat.type,
        isActive: true,
        portals: [] 
      });
      setNewCat({ name: "", description: "", type: "manual" });
      setIsCreatorOpen(false);
      toast({ title: "تم تأسيس القسم بنجاح" });
    } catch (e) { 
      toast({ variant: "destructive", title: "خطأ في القاعدة" }); 
    } finally {
      setCreating(false);
    }
  };

  const handleRemoveCategory = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا القسم وكافة بواباته نهائياً؟")) return;
    try {
      await deleteDoc(doc(db, "deposit_methods", id));
      toast({ title: "تم حذف القسم" });
    } catch (e) {}
  };

  if (editingCatId && editingCategory) {
    return (
      <CategoryEditor 
        category={editingCategory} 
        onBack={() => setEditingCatId(null)} 
      />
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-700 font-body text-right" dir="rtl">
      
      {/* 1. Integrated Creator Forge */}
      <Card className="rounded-[48px] border-none shadow-xl bg-white overflow-hidden group transition-all">
        <CardHeader className="bg-[#002d4d] p-8 text-white relative flex flex-row items-center justify-between border-b border-white/5">
           <div className="absolute top-0 right-0 p-4 opacity-[0.03] -rotate-12 pointer-events-none transition-transform group-hover:rotate-0 duration-1000">
              <Layers size={120} />
           </div>
           <div className="flex items-center gap-5 relative z-10">
              <div className="h-14 w-14 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-xl border border-white/20 shadow-inner group-hover:rotate-12 transition-transform">
                 <Plus className="h-7 w-7 text-[#f9a885]" />
              </div>
              <div className="text-right">
                 <CardTitle className="text-xl font-black">تأسيس فئة إيداع</CardTitle>
                 <p className="text-[9px] font-bold text-blue-200/40 uppercase tracking-widest mt-1">Sovereign Section Forge</p>
              </div>
           </div>
           <Button 
             variant="ghost" 
             onClick={() => setIsCreatorOpen(!isCreatorOpen)}
             className="rounded-full bg-white/10 hover:bg-white/20 text-white font-black text-[10px] px-6 h-10 border border-white/10 transition-all"
           >
              {isCreatorOpen ? "إخفاء المفاعل" : "إضافة قسم جديد"}
           </Button>
        </CardHeader>

        <AnimatePresence>
          {isCreatorOpen && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.5, ease: "circOut" }}>
              <CardContent className="p-10 space-y-8 border-t border-gray-50">
                 <div className="grid gap-8 md:grid-cols-2">
                    <div className="space-y-6">
                       <div className="space-y-2">
                          <Label className="text-[10px] font-black text-gray-400 pr-4 uppercase tracking-widest">اسم القسم الاستراتيجي</Label>
                          <Input value={newCat.name} onChange={e => setNewCat({...newCat, name: e.target.value})} className="h-14 rounded-[24px] bg-gray-50 border-none font-black text-center text-lg shadow-inner" placeholder="مثلاً: عملات رقمية (آلي)..." />
                       </div>
                       <div className="space-y-2">
                          <Label className="text-[10px] font-black text-gray-400 pr-4 uppercase tracking-widest">نمط التشغيل (Operational Mode)</Label>
                          <Select value={newCat.type} onValueChange={(val: any) => setNewCat({...newCat, type: val})}>
                             <SelectTrigger className="h-14 rounded-[24px] bg-white border border-gray-100 font-black text-xs px-8 shadow-sm">
                               <SelectValue />
                             </SelectTrigger>
                             <SelectContent className="rounded-2xl border-none shadow-2xl">
                                <SelectItem value="manual" className="font-bold text-right py-3"><div className="flex items-center gap-3 justify-end"><span>يدوي (بوابات مخصصة)</span><Wallet size={14}/></div></SelectItem>
                                <SelectItem value="nowpayments" className="font-bold text-right py-3"><div className="flex items-center gap-3 justify-end"><span>آلي (NOWPayments Sync)</span><Zap size={14} className="text-purple-500 fill-current"/></div></SelectItem>
                                <SelectItem value="binance" className="font-bold text-right py-3"><div className="flex items-center gap-3 justify-end"><span>شبه آلي (Binance Sync)</span><Cpu size={14} className="text-orange-500"/></div></SelectItem>
                             </SelectContent>
                          </Select>
                       </div>
                    </div>
                    <div className="space-y-2">
                       <Label className="text-[10px] font-black text-gray-400 pr-4 uppercase tracking-widest">وصف القسم وتوجيهات الشحن</Label>
                       <Textarea value={newCat.description} onChange={e => setNewCat({...newCat, description: e.target.value})} className="min-h-[140px] rounded-[32px] bg-gray-50 border-none font-bold text-xs p-6 shadow-inner leading-relaxed" placeholder="اكتب وصفاً مختصراً يظهر للمستثمر..." />
                    </div>
                 </div>
                 <div className="flex justify-end pt-4">
                    <Button onClick={handleAddCategory} disabled={creating || !newCat.name} className="h-16 px-12 rounded-full bg-[#002d4d] hover:bg-[#001d33] text-white font-black text-base shadow-xl active:scale-95 group transition-all">
                       {creating ? <Loader2 className="animate-spin h-6 w-6" /> : (
                         <div className="flex items-center gap-4">
                            <span>تفعيل القسم في المنظومة</span>
                            <ChevronLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
                         </div>
                       )}
                    </Button>
                 </div>
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>

      {/* 2. Active Sections Ledger */}
      <div className="space-y-6">
         <div className="flex items-center gap-3 px-4">
            <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-inner">
               <ListFilter size={20} />
            </div>
            <div className="text-right">
               <h3 className="text-xl font-black text-[#002d4d]">جرد الأقسام النشطة</h3>
               <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Live Categories Matrix</p>
            </div>
         </div>

         {isLoading ? (
           <div className="py-20 text-center flex flex-col items-center gap-4">
              <Loader2 className="h-10 w-10 animate-spin text-gray-200" />
              <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Scanning Repository...</p>
           </div>
         ) : categories && categories.length > 0 ? (
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {categories.map(category => (
                <Card key={category.id} className={cn("rounded-[48px] border-none shadow-sm overflow-hidden bg-white group transition-all duration-500 hover:shadow-2xl", !category.isActive && "opacity-60 saturate-0")}>
                   <CardContent className="p-8 space-y-6">
                      <div className="flex items-start justify-between">
                         <div className="flex items-center gap-5">
                            <div className="h-14 w-14 rounded-[22px] bg-gray-50 flex items-center justify-center text-[#002d4d] shadow-inner group-hover:bg-[#002d4d] group-hover:text-[#f9a885] transition-all duration-500">
                               {category.type === 'manual' ? <Wallet size={28}/> : category.type === 'nowpayments' ? <Zap size={28} className="text-purple-500 fill-current" /> : <Cpu size={28} className="text-orange-500"/>}
                            </div>
                            <div className="text-right space-y-1">
                               <h4 className="font-black text-lg text-[#002d4d]">{category.name}</h4>
                               <div className="flex items-center gap-2">
                                  <Badge className={cn(
                                    "text-[7px] font-black border-none px-2.5 py-0.5 rounded-full",
                                    category.type === 'nowpayments' ? "bg-purple-50 text-purple-600" : 
                                    category.type === 'binance' ? "bg-orange-50 text-orange-600" : "bg-blue-50 text-blue-600"
                                  )}>
                                    {category.type?.toUpperCase()}
                                  </Badge>
                                  {category.isActive && (
                                    <div className="flex items-center gap-1 opacity-40">
                                       <div className="h-1 w-1 rounded-full bg-emerald-500 animate-pulse" />
                                       <span className="text-[7px] font-black text-gray-400 uppercase">Operational</span>
                                    </div>
                                  )}
                               </div>
                            </div>
                         </div>
                         <Switch 
                           checked={!!category.isActive} 
                           onCheckedChange={async (val) => await updateDoc(doc(db, "deposit_methods", category.id), { isActive: val })}
                           className="data-[state=checked]:bg-emerald-500"
                         />
                      </div>

                      <div className="p-5 bg-gray-50 rounded-[32px] border border-gray-100 shadow-inner min-h-[80px]">
                         <p className="text-[11px] font-bold text-gray-400 leading-relaxed line-clamp-3">
                            {category.description || "لا يوجد وصف محدد لهذا القسم."}
                         </p>
                      </div>

                      <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
                         <div className="flex items-center gap-2 text-gray-300">
                            <span className="text-[10px] font-black tabular-nums">{category.portals?.length || 0}</span>
                            <span className="text-[8px] font-bold uppercase tracking-widest">Nodes Configured</span>
                         </div>
                         <div className="flex items-center gap-2">
                            <Button onClick={() => setEditingCatId(category.id)} variant="ghost" className="h-10 px-6 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 font-black text-[10px] shadow-sm">
                               <Edit3 size={14} className="ml-2" /> تعديل وتخصيص
                            </Button>
                            <Button onClick={() => handleRemoveCategory(category.id)} variant="ghost" size="icon" className="h-10 w-10 rounded-xl bg-red-50 text-red-400 hover:bg-red-100">
                               <Trash2 size={16} />
                            </Button>
                         </div>
                      </div>
                   </CardContent>
                </Card>
              ))}
           </div>
         ) : (
           <div className="py-24 text-center opacity-20 flex flex-col items-center gap-4 border-2 border-dashed border-gray-100 rounded-[64px]">
              <Activity size={48} />
              <p className="text-xs font-black uppercase tracking-widest">لا توجد أقسام مدرجة حالياً</p>
           </div>
         )}
      </div>
    </div>
  );
}

/**
 * CategoryEditor - واجهة التعديل الشمولية المدمجة
 */
function CategoryEditor({ category, onBack }: { category: any, onBack: () => void }) {
  const db = useFirestore();
  const [data, setData] = useState({ ...category });
  const [saving, setSaving] = useState(false);
  const [newPortal, setNewPortal] = useState({ name: "USDT (TRC20)", walletAddress: "", instructions: "", icon: "USDT" });

  const handleSaveMain = async () => {
    setSaving(true);
    try {
      await updateDoc(doc(db, "deposit_methods", category.id), {
        name: data.name,
        description: data.description,
        type: data.type,
        updatedAt: new Date().toISOString()
      });
      toast({ title: "تم حفظ التعديلات الرئيسية" });
    } catch (e) { toast({ variant: "destructive", title: "فشل الحفظ" }); }
    finally { setSaving(false); }
  };

  const addPortal = async () => {
    if (!newPortal.name.trim()) return;
    try {
      const portalData = {
        id: Math.random().toString(36).substr(2, 9),
        ...newPortal,
        isActive: true,
        fields: [{ label: "معرف العملية (TXID)", placeholder: "أدخل رقم العملية هنا...", type: "text", isTxid: true, hasPasteButton: true }]
      };
      await updateDoc(doc(db, "deposit_methods", category.id), {
        portals: arrayUnion(portalData)
      });
      setNewPortal({ name: "USDT (TRC20)", walletAddress: "", instructions: "", icon: "USDT" });
      toast({ title: "تمت إضافة البوابة بنجاح" });
    } catch (e) {}
  };

  const removePortal = async (portal: any) => {
    if (!confirm("حذف هذه البوابة نهائياً؟")) return;
    try {
      await updateDoc(doc(db, "deposit_methods", category.id), {
        portals: arrayRemove(portal)
      });
    } catch (e) {}
  };

  return (
    <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} className="space-y-10 text-right font-body" dir="rtl">
      
      {/* Editor Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-100 pb-8">
         <div className="flex items-center gap-5">
            <div className="h-16 w-16 rounded-[28px] bg-[#002d4d] text-[#f9a885] flex items-center justify-center shadow-2xl">
               <Settings2 size={32} />
            </div>
            <div className="space-y-1">
               <h2 className="text-3xl font-black text-[#002d4d]">تعديل القسم: {category.name}</h2>
               <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Sovereign Editor Console</p>
            </div>
         </div>
         <Button onClick={onBack} variant="ghost" className="h-14 px-8 rounded-full bg-white border border-gray-100 shadow-sm hover:shadow-md font-black text-[11px] gap-3 group transition-all">
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            الرجوع لقائمة الأقسام
         </Button>
      </div>

      <div className="grid gap-10 lg:grid-cols-12">
         
         {/* LEFT: Main Settings */}
         <div className="lg:col-span-7 space-y-8">
            <Card className="rounded-[48px] border-none shadow-sm bg-white overflow-hidden">
               <CardHeader className="bg-gray-50/50 p-8 border-b border-gray-100">
                  <CardTitle className="text-lg font-black flex items-center gap-3 text-[#002d4d]">
                     <Globe size={20} className="text-blue-500" /> الإعدادات الجوهرية للقسم
                  </CardTitle>
               </CardHeader>
               <CardContent className="p-8 space-y-8">
                  <div className="grid grid-cols-2 gap-6">
                     <div className="space-y-2">
                        <Label className="text-[10px] font-black text-gray-400 pr-4 uppercase">اسم الفئة</Label>
                        <Input value={data.name} onChange={e => setData({...data, name: e.target.value})} className="h-12 rounded-xl bg-gray-50 border-none font-black px-6 shadow-inner" />
                     </div>
                     <div className="space-y-2">
                        <Label className="text-[10px] font-black text-gray-400 pr-4 uppercase">نمط التشغيل</Label>
                        <Select value={data.type} onValueChange={val => setData({...data, type: val})}>
                           <SelectTrigger className="h-12 rounded-xl bg-gray-50 border-none font-black text-xs px-6 shadow-inner">
                              <SelectValue />
                           </SelectTrigger>
                           <SelectContent className="rounded-2xl border-none shadow-2xl">
                              <SelectItem value="manual" className="font-bold text-right py-3">يدوي (Manual)</SelectItem>
                              <SelectItem value="nowpayments" className="font-bold text-right py-3">آلي (NOWPayments)</SelectItem>
                              <SelectItem value="binance" className="font-bold text-right py-3">شبه آلي (Binance)</SelectItem>
                           </SelectContent>
                        </Select>
                     </div>
                  </div>
                  <div className="space-y-2">
                     <Label className="text-[10px] font-black text-gray-400 pr-4 uppercase">الوصف الاستراتيجي</Label>
                     <Textarea value={data.description} onChange={e => setData({...data, description: e.target.value})} className="min-h-[120px] rounded-[32px] bg-gray-50 border-none font-bold text-xs p-6 shadow-inner leading-relaxed scrollbar-none" />
                  </div>
                  <Button onClick={handleSaveMain} disabled={saving} className="w-full h-16 rounded-full bg-[#002d4d] text-white font-black shadow-xl active:scale-[0.98] transition-all">
                     {saving ? <Loader2 className="animate-spin" /> : "حفظ التعديلات الرئيسية"}
                  </Button>
               </CardContent>
            </Card>

            {data.type === 'manual' && (
              <Card className="rounded-[48px] border-none shadow-sm bg-white overflow-hidden animate-in fade-in duration-700">
                 <CardHeader className="bg-emerald-50/20 p-8 border-b border-gray-50">
                    <CardTitle className="text-lg font-black flex items-center gap-3 text-emerald-700">
                       <Zap size={20} className="text-emerald-500" /> إضافة بوابة استلام يدوية
                    </CardTitle>
                 </CardHeader>
                 <CardContent className="p-8 space-y-8">
                    <div className="grid grid-cols-2 gap-6">
                       <div className="space-y-2">
                          <Label className="text-[10px] font-black text-gray-400 pr-4 uppercase">تسمية البوابة</Label>
                          <Input value={newPortal.name} onChange={e => setNewPortal({...newPortal, name: e.target.value})} className="h-12 rounded-xl bg-gray-50 border-none font-black px-6" placeholder="مثلاً: USDT (TRC20)" />
                       </div>
                       <div className="space-y-2">
                          <Label className="text-[10px] font-black text-gray-400 pr-4 uppercase">أيقونة الواجهة</Label>
                          <Select value={newPortal.icon} onValueChange={val => setNewPortal({...newPortal, icon: val})}>
                             <SelectTrigger className="h-12 rounded-xl bg-gray-50 border-none font-black text-xs px-6 shadow-inner"><SelectValue /></SelectTrigger>
                             <SelectContent className="rounded-2xl border-none shadow-2xl">
                                {ICON_OPTIONS.slice(0, 30).map(opt => (
                                  <SelectItem key={opt.id} value={opt.id} className="font-bold text-right py-2"><div className="flex items-center gap-3 justify-end"><span>{opt.label}</span><CryptoIcon name={opt.id} size={16}/></div></SelectItem>
                                ))}
                             </SelectContent>
                          </Select>
                       </div>
                    </div>
                    <div className="space-y-2">
                       <Label className="text-[10px] font-black text-gray-400 pr-4 uppercase">عنوان المحفظة / رقم الحساب</Label>
                       <Input value={newPortal.walletAddress} onChange={e => setNewPortal({...newPortal, walletAddress: e.target.value})} className="h-12 rounded-xl bg-gray-50 border-none font-mono text-[10px] font-black px-6 text-left" dir="ltr" />
                    </div>
                    <div className="space-y-2">
                       <Label className="text-[10px] font-black text-gray-400 pr-4 uppercase">تعليمات الدفع للمستثمر</Label>
                       <Textarea value={newPortal.instructions} onChange={e => setNewPortal({...newPortal, instructions: e.target.value})} className="min-h-[100px] rounded-[24px] bg-gray-50 border-none font-bold text-[10px] p-6 leading-loose" />
                    </div>
                    <Button onClick={addPortal} className="w-full h-14 rounded-full bg-emerald-600 text-white font-black shadow-lg">تثبيت البوابة في القسم</Button>
                 </CardContent>
              </Card>
            )}
         </div>

         {/* RIGHT: Active Portals List (Inventory) */}
         <div className="lg:col-span-5 space-y-8">
            <Card className="rounded-[48px] border-none shadow-sm bg-white overflow-hidden flex flex-col h-full min-h-[600px]">
               <CardHeader className="bg-gray-50/50 p-8 border-b border-gray-100 flex flex-row items-center justify-between">
                  <div className="flex items-center gap-3">
                     <div className="h-10 w-10 rounded-xl bg-white shadow-inner flex items-center justify-center text-blue-600">
                        <ListFilter size={20} />
                     </div>
                     <CardTitle className="text-base font-black text-[#002d4d]">جرد بوابات القسم</CardTitle>
                  </div>
                  <Badge className="bg-blue-50 text-blue-600 border-none font-black text-[8px] px-3 py-1 rounded-full shadow-inner">{category.portals?.length || 0} NODES</Badge>
               </CardHeader>
               <CardContent className="p-0 flex-1 overflow-y-auto scrollbar-none">
                  <div className="divide-y divide-gray-50">
                     {category.portals?.map((p: any, i: number) => (
                       <div key={i} className="p-8 flex flex-col gap-6 hover:bg-gray-50/50 transition-all group/item">
                          <div className="flex items-center justify-between">
                             <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-[18px] bg-white shadow-sm flex items-center justify-center text-blue-600 group-hover/item:scale-110 transition-transform">
                                   <CryptoIcon name={p.icon} size={24} />
                                </div>
                                <div className="text-right">
                                   <p className="font-black text-sm text-[#002d4d]">{p.name}</p>
                                   <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">{p.id}</p>
                                </div>
                             </div>
                             <div className="flex items-center gap-2">
                                <Switch checked={!!p.isActive} onCheckedChange={async (val) => {
                                   const updated = category.portals.map((item: any) => item.id === p.id ? { ...item, isActive: val } : item);
                                   await updateDoc(doc(db, "deposit_methods", category.id), { portals: updated });
                                }} className="data-[state=checked]:bg-emerald-500 scale-75" />
                                <button onClick={() => removePortal(p)} className="h-8 w-8 rounded-lg bg-white text-red-400 flex items-center justify-center hover:bg-red-50 opacity-0 group-hover/item:opacity-100 transition-all shadow-sm">
                                   <Trash2 size={14} />
                                </button>
                             </div>
                          </div>
                          
                          <div className="p-4 bg-gray-100/50 rounded-[20px] border border-gray-100 space-y-2">
                             <div className="flex justify-between items-center text-[8px] font-black text-gray-400 uppercase tracking-widest">
                                <span>Wallet Address</span>
                                <ClipboardPaste size={10} />
                             </div>
                             <p className="text-[10px] font-mono font-black text-[#002d4d] break-all leading-relaxed" dir="ltr">{p.walletAddress || "N/A"}</p>
                          </div>
                       </div>
                     ))}
                     {(!category.portals || category.portals.length === 0) && (
                       <div className="py-24 text-center opacity-20 flex flex-col items-center gap-4">
                          <Activity size={48} />
                          <p className="text-[10px] font-black uppercase tracking-widest">هذا القسم لا يحتوي على بوابات حالياً</p>
                       </div>
                     )}
                  </div>
               </CardContent>
            </Card>
         </div>

      </div>

      {/* Sovereign Signature */}
      <div className="flex flex-col items-center gap-4 pt-10 opacity-20 select-none">
         <p className="text-[10px] font-black text-[#002d4d] uppercase tracking-[0.8em]">Category Governance Node v7.0</p>
         <div className="flex gap-2">
            {[...Array(3)].map((_, i) => (<div key={i} className="h-1.5 w-1.5 rounded-full bg-gray-300" />))}
         </div>
      </div>
    </motion.div>
  );
}
