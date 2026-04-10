"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
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
  FileText
} from "lucide-react";
import { useFirestore, useCollection } from "@/firebase";
import { collection, doc, addDoc, deleteDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { useMemoFirebase } from "@/firebase";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
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

/**
 * @fileOverview مركز هندسة بوابات الإيداع الشمولية v6.1
 * تم إضافة حقل "الوصف" عند إنشاء الأقسام لتعزيز التوجيه الإستراتيجي للمستثمرين.
 */

export function DepositPortalsSection() {
  const db = useFirestore();
  const [isAddCatOpen, setIsAddCatOpen] = useState(false);
  const [isAddPortalOpen, setIsAddPortalOpen] = useState(false);
  const [activeCatId, setActiveCatId] = useState<string | null>(null);
  const [newCatName, setNewCatName] = useState("");
  const [newCatDescription, setNewCatDescription] = useState("");
  const [newCatType, setNewCatType] = useState<"manual" | "nowpayments" | "binance">("manual");
  const [expandedCat, setExpandedCat] = useState<string | null>(null);

  const [portalToDelete, setPortalToDelete] = useState<{ catId: string, portal: any } | null>(null);
  const [catToDeleteId, setCatToDeleteId] = useState<string | null>(null);

  const [newPortal, setNewPortal] = useState({
    name: "",
    walletAddress: "",
    instructions: "",
    icon: "USDT"
  });

  const categoriesQuery = useMemoFirebase(() => collection(db, "deposit_methods"), [db]);
  const { data: categories } = useCollection(categoriesQuery);

  const handleAddCategory = async () => {
    if (!newCatName.trim()) return;
    try {
      await addDoc(collection(db, "deposit_methods"), { 
        name: newCatName, 
        description: newCatDescription,
        type: newCatType,
        isActive: true,
        portals: [] 
      });
      setNewCatName("");
      setNewCatDescription("");
      setNewCatType("manual");
      setIsAddCatOpen(false);
      toast({ title: "تم إنشاء القسم الاستراتيجي" });
    } catch (e) { toast({ variant: "destructive", title: "خطأ في الشبكة" }); }
  };

  const handleAddPortal = async () => {
    if (!activeCatId || !newPortal.name.trim()) return;
    try {
      const portalData = {
        id: Math.random().toString(36).substr(2, 9),
        name: newPortal.name,
        walletAddress: newPortal.walletAddress,
        instructions: newPortal.instructions,
        icon: newPortal.icon,
        isActive: true,
        automationType: "none",
        fields: [{ label: "معرف العملية (TXID)", placeholder: "أدخل رقم العملية هنا...", type: "text", isTxid: true, hasPasteButton: true }]
      };
      await updateDoc(doc(db, "deposit_methods", activeCatId), {
        portals: arrayUnion(portalData)
      });
      setNewPortal({ name: "", walletAddress: "", instructions: "", icon: "USDT" });
      setIsAddPortalOpen(false);
      toast({ title: "تمت إضافة البوابة اليدوية" });
    } catch (e) { toast({ variant: "destructive", title: "فشل الإرسال" }); }
  };

  const handleTogglePortal = async (catId: string, portalId: string, newVal: boolean) => {
    try {
      const cat = categories?.find(c => c.id === catId);
      if (!cat) return;
      const updatedPortals = cat.portals.map((p: any) => p.id === portalId ? { ...p, isActive: newVal } : p);
      await updateDoc(doc(db, "deposit_methods", catId), { portals: updatedPortals });
    } catch (e) {}
  };

  const updatePortalConfig = async (catId: string, portalId: string, field: string, val: any) => {
    const cat = categories?.find(c => c.id === catId);
    if (!cat) return;
    const updatedPortals = cat.portals.map((p: any) => p.id === portalId ? { ...p, [field]: val } : p);
    await updateDoc(doc(db, "deposit_methods", catId), { portals: updatedPortals });
  };

  const confirmRemovePortal = async () => {
    if (!portalToDelete) return;
    try {
      await updateDoc(doc(db, "deposit_methods", portalToDelete.catId), {
        portals: arrayRemove(portalToDelete.portal)
      });
      toast({ title: "تم حذف البوابة بنجاح" });
    } catch (e) {
      toast({ variant: "destructive", title: "فشل حذف البوابة" });
    } finally {
      setPortalToDelete(null);
    }
  };

  const confirmRemoveCategory = async () => {
    if (!catToDeleteId) return;
    try {
      await deleteDoc(doc(db, "deposit_methods", catToDeleteId));
      toast({ title: "تم حذف القسم بالكامل" });
    } catch (e) {
      toast({ variant: "destructive", title: "فشل حذف القسم" });
    } finally {
      setCatToDeleteId(null);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-left-6 duration-700 font-body text-right">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-4">
         <div className="space-y-1">
           <h2 className="text-2xl font-black text-[#002d4d] flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-inner">
                <Layers className="h-6 w-6" />
              </div>
              هندسة أقسام وبوابات الإيداع الشاملة
           </h2>
           <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Multi-Source Inflow Architecture</p>
         </div>
         <Button onClick={() => setIsAddCatOpen(true)} className="rounded-full h-14 px-8 bg-[#002d4d] text-white font-black text-xs shadow-xl active:scale-95 group">
           <Plus className="ml-2 h-5 w-5 text-[#f9a885] group-hover:rotate-90 transition-transform" /> إنشاء قسم إيداع جديد
         </Button>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {categories?.map(category => (
          <Card key={category.id} className="border-none shadow-sm rounded-[48px] bg-white overflow-hidden group">
            <CardContent className="p-0">
              <div className="p-8 flex items-center justify-between bg-gray-50/50 border-b border-gray-100" dir="rtl">
                <div className="flex items-center gap-5">
                  <div className="h-14 w-14 rounded-[22px] bg-white shadow-sm flex items-center justify-center text-[#002d4d]">
                    {category.type === 'manual' ? <Wallet size={28}/> : category.type === 'nowpayments' ? <Zap size={28} className="text-purple-500 fill-current" /> : <Cpu size={28} className="text-orange-500"/>}
                  </div>
                  <div className="space-y-0.5 text-right">
                    <h3 className="font-black text-xl text-[#002d4d]">{category.name}</h3>
                    <div className="flex items-center gap-3">
                       <Badge className={cn(
                         "text-[8px] font-black border-none px-3 py-1 rounded-full", 
                         category.isActive ? "bg-emerald-50 text-emerald-600" : "bg-gray-100 text-gray-400"
                       )}>
                         {category.isActive ? "ACTIVE" : "DISABLED"}
                       </Badge>
                       <Badge className={cn(
                         "text-[8px] font-black border-none px-3 py-1 rounded-full",
                         category.type === 'nowpayments' ? "bg-purple-50 text-purple-600" : 
                         category.type === 'binance' ? "bg-orange-50 text-orange-600" : "bg-blue-50 text-blue-600"
                       )}>
                         {category.type?.toUpperCase() || 'MANUAL'} MODE
                       </Badge>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Switch 
                    checked={!!category.isActive} 
                    onCheckedChange={async (val) => await updateDoc(doc(db, "deposit_methods", category.id), { isActive: val })}
                    className="data-[state=checked]:bg-emerald-500"
                  />
                  
                  {category.type === 'manual' && (
                    <Button variant="ghost" size="icon" onClick={() => { setActiveCatId(category.id); setIsAddPortalOpen(true); }} className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 shadow-sm" title="إضافة بوابة يدوية لهذا القسم">
                      <Plus className="h-5 w-5" />
                    </Button>
                  )}

                  <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl bg-red-50 text-red-400 hover:bg-red-100" onClick={() => setCatToDeleteId(category.id)}>
                    <Trash2 className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl bg-gray-100 text-gray-400" onClick={() => setExpandedCat(expandedCat === category.id ? null : category.id)}>
                    {expandedCat === category.id ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                  </Button>
                </div>
              </div>

              {expandedCat === category.id && (
                <div className="p-8 space-y-6 animate-in slide-in-from-top-2 duration-500" dir="rtl">
                  
                  {category.description && (
                    <div className="p-6 bg-gray-50/50 rounded-[32px] border border-gray-100 shadow-inner">
                       <p className="text-[11px] font-bold text-gray-500 leading-relaxed">{category.description}</p>
                    </div>
                  )}

                  {category.type !== 'manual' ? (
                    <div className="p-10 bg-blue-50/30 rounded-[48px] border-2 border-dashed border-blue-100 flex flex-col items-center justify-center text-center gap-6">
                       <div className="h-20 w-20 rounded-[32px] bg-white flex items-center justify-center shadow-xl">
                          <Radio size={40} className="text-blue-600 animate-pulse" />
                       </div>
                       <div className="space-y-2">
                          <h4 className="text-xl font-black text-[#002d4d]">بروتوكول المزامنة الآلي فعال</h4>
                          <p className="text-[13px] font-bold text-blue-800/60 leading-[2.2] max-w-md mx-auto">
                            هذا القسم يعتمد على جلب البيانات (العناوين، التعليمات، والحقول) بشكل آلي عبر الـ API الخاص بـ <strong>{category.type?.toUpperCase()}</strong>. لا يتطلب هذا الوضع إضافة بوابات يدوية من قبلك.
                          </p>
                       </div>
                       <Badge className="bg-[#002d4d] text-[#f9a885] border-none font-black text-[9px] px-6 py-2 rounded-full tracking-widest shadow-xl">SOVEREIGN SYNC ACTIVE</Badge>
                    </div>
                  ) : category.portals?.length > 0 ? (
                    <div className="grid gap-6 md:grid-cols-2">
                      {category.portals.map((portal: any) => (
                        <div key={portal.id} className="p-8 bg-gray-50 rounded-[40px] border border-gray-100 shadow-inner space-y-6 relative group/portal">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="h-12 w-12 rounded-[18px] bg-white flex items-center justify-center shadow-sm">
                                <CryptoIcon name={portal.icon} size={24} />
                              </div>
                              <p className="font-black text-base text-[#002d4d]">{portal.name}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Switch 
                                checked={!!portal.isActive} 
                                onCheckedChange={(val) => handleTogglePortal(category.id, portal.id, val)}
                                className="data-[state=checked]:bg-emerald-500 scale-75"
                              />
                              <button onClick={() => setPortalToDelete({ catId: category.id, portal })} className="h-8 w-8 rounded-lg bg-white text-red-400 flex items-center justify-center hover:bg-red-50 shadow-sm opacity-0 group-hover/portal:opacity-100 transition-opacity">
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>

                          <div className="space-y-6">
                            <div className="space-y-1.5 text-right">
                               <Label className="text-[9px] font-black text-gray-400 uppercase pr-4">اسم البوابة</Label>
                               <Input 
                                 value={portal.name} 
                                 onChange={(e) => updatePortalConfig(category.id, portal.id, 'name', e.target.value)}
                                 className="h-11 rounded-xl bg-white border-none font-black text-sm px-8 shadow-sm text-right" 
                               />
                            </div>

                            <div className="space-y-1.5 text-right">
                              <Label className="text-[9px] font-black text-gray-400 uppercase pr-2">عنوان محفظة الاستلام (ثابت)</Label>
                              <Input 
                                value={portal.walletAddress} 
                                onChange={(e) => updatePortalConfig(category.id, portal.id, 'walletAddress', e.target.value)}
                                className="h-11 rounded-xl bg-white border-none font-mono text-[10px] font-black px-4 shadow-sm text-left" 
                                dir="ltr"
                              />
                            </div>

                            <div className="space-y-1.5 text-right">
                              <Label className="text-[9px] font-black text-gray-400 uppercase pr-2">تعليمات وتوجيهات المستثمر</Label>
                              <Textarea 
                                value={portal.instructions} 
                                onChange={(e) => updatePortalConfig(category.id, portal.id, 'instructions', e.target.value)}
                                className="min-h-[80px] rounded-[20px] bg-white border-none font-bold text-[10px] p-4 leading-relaxed text-right scrollbar-none shadow-inner" 
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-16 opacity-20 flex flex-col items-center gap-4">
                       <CryptoIcon name="CreditCard" size={48} />
                       <p className="text-[10px] font-black uppercase tracking-widest">لا توجد بوابات مضافة لهذا القسم</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <AlertDialog open={!!portalToDelete} onOpenChange={(open) => !open && setPortalToDelete(null)}>
        <AlertDialogContent className="rounded-[48px] border-none shadow-2xl p-10 max-w-[420px] font-body text-right" dir="rtl">
          <AlertDialogHeader className="items-center gap-6">
            <div className="h-20 w-20 rounded-[32px] bg-red-50 text-red-500 flex items-center justify-center animate-bounce shadow-inner">
              <Trash2 className="h-10 w-10" />
            </div>
            <AlertDialogTitle className="text-2xl font-black text-[#002d4d]">حذف بوابة الدفع</AlertDialogTitle>
            <AlertDialogDescription className="text-[13px] font-bold text-gray-500 leading-[2.2] px-2 text-center">
              أنت على وشك حذف بوابة <strong>{portalToDelete?.portal.name}</strong> نهائياً. هل أنت متأكد؟
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex flex-col gap-3 mt-8">
            <AlertDialogAction onClick={confirmRemovePortal} className="w-full h-14 rounded-full bg-red-500 hover:bg-red-600 text-white font-black text-base shadow-xl">تأكيد الحذف</AlertDialogAction>
            <AlertDialogCancel className="w-full h-14 rounded-full bg-gray-50 text-gray-400 border-none font-black text-xs hover:bg-gray-100">إلغاء</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!catToDeleteId} onOpenChange={(open) => !open && setCatToDeleteId(null)}>
        <AlertDialogContent className="rounded-[48px] border-none shadow-2xl p-10 max-w-[420px] font-body text-right" dir="rtl">
          <AlertDialogHeader className="items-center gap-6">
            <div className="h-20 w-20 rounded-[32px] bg-red-50 text-red-500 flex items-center justify-center animate-pulse shadow-inner">
              <Trash2 className="h-10 w-10" />
            </div>
            <AlertDialogTitle className="text-2xl font-black text-[#002d4d]">حذف القسم بالكامل</AlertDialogTitle>
            <AlertDialogDescription className="text-[13px] font-bold text-gray-500 leading-[2.2] px-2 text-center">
              سيؤدي هذا إلى حذف القسم وكافة البوابات المدرجة تحته. لا يمكن التراجع.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex flex-col gap-3 mt-8">
            <AlertDialogAction onClick={confirmRemoveCategory} className="w-full h-14 rounded-full bg-red-600 hover:bg-red-700 text-white font-black text-base shadow-xl">حذف شامل</AlertDialogAction>
            <AlertDialogCancel className="w-full h-14 rounded-full bg-gray-50 text-gray-400 border-none font-black text-xs hover:bg-gray-100">إلغاء</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={isAddCatOpen} onOpenChange={setIsAddCatOpen}>
        <DialogContent className="rounded-[48px] border-none p-10 max-w-[480px] font-body text-right flex flex-col outline-none overflow-hidden max-h-[90vh]" dir="rtl">
          <DialogHeader className="items-center gap-4 shrink-0">
            <div className="h-16 w-16 rounded-[24px] bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-inner">
               <Layers size={32} />
            </div>
            <DialogTitle className="text-2xl font-black text-[#002d4d]">تأسيس قسم إيداع</DialogTitle>
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto space-y-8 py-8 text-right scrollbar-none">
            <div className="space-y-2">
               <Label className="text-[10px] font-black text-gray-400 pr-4 uppercase tracking-widest">اسم القسم الاستراتيجي</Label>
               <Input placeholder="مثلاً: عملات رقمية (آلي)..." value={newCatName} onChange={e => setNewCatName(e.target.value)} className="h-14 rounded-[24px] bg-gray-50 border-none font-black text-center text-lg shadow-inner" />
            </div>

            <div className="space-y-2">
               <Label className="text-[10px] font-black text-gray-400 pr-4 uppercase tracking-widest">وصف القسم وتوجيهات الشحن</Label>
               <Textarea placeholder="اكتب وصفاً مختصراً يظهر للمستثمر عند اختيار هذا القسم..." value={newCatDescription} onChange={e => setNewCatDescription(e.target.value)} className="min-h-[100px] rounded-[32px] bg-gray-50 border-none font-bold text-xs p-6 shadow-inner leading-relaxed" />
            </div>

            <div className="space-y-2">
               <Label className="text-[10px] font-black text-gray-400 pr-4 uppercase tracking-widest">نمط التشغيل (Operational Mode)</Label>
               <Select value={newCatType} onValueChange={(val: any) => setNewCatType(val)}>
                  <SelectTrigger className="h-14 rounded-[24px] bg-[#002d4d] text-white border-none font-black text-xs px-8 shadow-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-none shadow-2xl">
                     <SelectItem value="manual" className="font-bold text-right py-3"><div className="flex items-center gap-3 justify-end"><span>يدوي (بوابات مخصصة)</span><Wallet size={14}/></div></SelectItem>
                     <SelectItem value="nowpayments" className="font-bold text-right py-3"><div className="flex items-center gap-3 justify-end"><span>آلي (NOWPayments Sync)</span><Zap size={14} className="text-purple-500 fill-current"/></div></SelectItem>
                     <SelectItem value="binance" className="font-bold text-right py-3"><div className="flex items-center gap-3 justify-end"><span>شبه آلي (Binance Sync)</span><Cpu size={14} className="text-orange-500"/></div></SelectItem>
                  </SelectContent>
               </Select>
            </div>

            <div className="p-6 bg-gray-50 rounded-[32px] border border-gray-100 flex items-start gap-4">
               <Info size={16} className="text-blue-500 shrink-0 mt-1" />
               <p className="text-[10px] font-bold text-gray-400 leading-relaxed">
                 عند اختيار "آلي" أو "شبه آلي"، سيقوم النظام بجلب العناوين والتعليمات مباشرة من الـ API المربوط في قمرة القيادة، ولن تحتاج لإضافة بوابات داخل القسم يدوياً.
               </p>
            </div>
          </div>

          <DialogFooter className="shrink-0 pt-6 border-t border-gray-100">
            <Button onClick={handleAddCategory} className="w-full h-16 rounded-full bg-[#002d4d] text-white font-black text-base shadow-xl active:scale-95 transition-all group">
               تفعيل القسم الجديد
               <ChevronLeft size={18} className="mr-2 group-hover:-translate-x-1 transition-transform" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isAddPortalOpen} onOpenChange={setIsAddPortalOpen}>
        <DialogContent className="rounded-[48px] border-none p-10 max-w-[480px] font-body text-right flex flex-col max-h-[90vh]" dir="rtl">
          <DialogHeader className="items-center gap-4 shrink-0">
            <div className="h-14 w-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-inner">
               <CryptoIcon name="CreditCard" size={28} />
            </div>
            <DialogTitle className="text-2xl font-black text-[#002d4d]">إضافة بوابة يدوية</DialogTitle>
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto space-y-8 py-8 scrollbar-none px-2 text-right">
            <div className="space-y-6">
               <div className="space-y-2">
                  <Label className="text-[10px] font-black text-gray-400 pr-4 uppercase tracking-widest">تسمية البوابة</Label>
                  <Input value={newPortal.name} onChange={e => setNewPortal({...newPortal, name: e.target.value})} className="h-14 rounded-[24px] bg-gray-50 border-none font-black px-8 text-right shadow-inner" />
               </div>

               <div className="space-y-2">
                  <Label className="text-[10px] font-black text-gray-400 pr-4 uppercase tracking-widest">أيقونة الواجهة</Label>
                  <Select value={newPortal.icon} onValueChange={val => setNewPortal({...newPortal, icon: val})}>
                     <SelectTrigger className="h-14 rounded-2xl bg-gray-50 border-none font-black text-xs px-8 shadow-inner">
                       <SelectValue />
                     </SelectTrigger>
                     <SelectContent className="rounded-2xl border-none shadow-2xl">
                       {ICON_OPTIONS.map(opt => (
                         <SelectItem key={opt.id} value={opt.id} className="font-bold text-right py-2">
                           <div className="flex items-center gap-3 justify-end">
                             <span>{opt.label}</span>
                             <CryptoIcon name={opt.id} size={16} />
                           </div>
                         </SelectItem>
                       ))}
                     </SelectContent>
                  </Select>
               </div>

               <div className="space-y-2">
                  <Label className="text-[10px] font-black text-gray-400 pr-4 uppercase tracking-widest">عنوان الإيداع / رقم الحساب</Label>
                  <Input 
                    value={newPortal.walletAddress} 
                    onChange={e => setNewPortal({...newPortal, walletAddress: e.target.value})} 
                    className="h-14 rounded-[24px] bg-gray-50 border-none font-mono text-xs font-black px-8 shadow-inner text-left" 
                    dir="ltr"
                  />
               </div>

               <div className="space-y-2">
                  <Label className="text-[10px] font-black text-gray-400 pr-4 uppercase tracking-widest">تعليمات وتوجيهات المستثمر</Label>
                  <Textarea value={newPortal.instructions} onChange={e => setNewPortal({...newPortal, instructions: e.target.value})} className="min-h-[120px] rounded-[32px] bg-gray-50 border-none font-bold text-xs p-8 leading-loose shadow-inner text-right" />
               </div>
            </div>
          </div>

          <DialogFooter className="shrink-0 pt-6 border-t border-gray-100">
            <Button onClick={handleAddPortal} disabled={!newPortal.name} className="w-full h-16 rounded-full bg-[#002d4d] text-white font-black text-base shadow-xl group">
               تفعيل البوابة المعتمدة
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
