
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
  Settings2
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
import { ScrollArea } from "@/components/ui/scroll-area";

/**
 * @fileOverview مركز هندسة بوابات الإيداع الشامل v5.0
 * يدعم الآن ثلاثة أنماط للتشغيل: (يدوي، أتمتة NOWPayments، أتمتة Binance).
 */

export function DepositPortalsSection() {
  const db = useFirestore();
  const [isAddCatOpen, setIsAddCatOpen] = useState(false);
  const [isAddPortalOpen, setIsAddPortalOpen] = useState(false);
  const [activeCatId, setActiveCatId] = useState<string | null>(null);
  const [newCatName, setNewCatName] = useState("");
  const [expandedCat, setExpandedCat] = useState<string | null>(null);

  const [portalToDelete, setPortalToDelete] = useState<{ catId: string, portal: any } | null>(null);
  const [catToDeleteId, setCatToDeleteId] = useState<string | null>(null);

  const [newPortal, setNewPortal] = useState({
    name: "",
    walletAddress: "",
    instructions: "",
    icon: "USDT",
    automationType: "none" as "none" | "binance" | "nowpayments",
    nowPaymentsCurrency: "usdttrc20",
    binanceAsset: "USDT",
    binanceNetwork: "TRX"
  });

  const categoriesQuery = useMemoFirebase(() => collection(db, "deposit_methods"), [db]);
  const { data: categories } = useCollection(categoriesQuery);

  const handleAddCategory = async () => {
    if (!newCatName.trim()) return;
    try {
      await addDoc(collection(db, "deposit_methods"), { 
        name: newCatName, 
        isActive: true,
        portals: [] 
      });
      setNewCatName("");
      setIsAddCatOpen(false);
      toast({ title: "تم إنشاء القسم بنجاح" });
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
        automationType: newPortal.automationType,
        nowPaymentsCurrency: newPortal.nowPaymentsCurrency,
        binanceAsset: newPortal.binanceAsset,
        binanceNetwork: newPortal.binanceNetwork,
        fields: newPortal.automationType === 'nowpayments' ? [] : [{ 
          label: "معرف العملية (TXID)", 
          placeholder: "أدخل رقم العملية هنا...", 
          type: "text", 
          isTxid: true, 
          hasPasteButton: true 
        }]
      };
      await updateDoc(doc(db, "deposit_methods", activeCatId), {
        portals: arrayUnion(portalData)
      });
      setNewPortal({ name: "", walletAddress: "", instructions: "", icon: "USDT", automationType: "none", nowPaymentsCurrency: "usdttrc20", binanceAsset: "USDT", binanceNetwork: "TRX" });
      setIsAddPortalOpen(false);
      toast({ title: "تمت إضافة البوابة للقسم" });
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
           <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Sovereign Inflow Architecture</p>
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
                    <CryptoIcon name="Wallet" size={28} />
                  </div>
                  <div className="space-y-0.5 text-right">
                    <h3 className="font-black text-xl text-[#002d4d]">{category.name}</h3>
                    <div className="flex items-center gap-3">
                       <Badge className={cn("text-[8px] font-black border-none px-3 py-1 rounded-full", category.isActive ? "bg-emerald-50 text-emerald-600" : "bg-gray-100 text-gray-400")}>
                         {category.isActive ? "ACTIVE SECTION" : "DISABLED"}
                       </Badge>
                       <span className="text-[9px] font-bold text-gray-300 uppercase tracking-widest">{category.portals?.length || 0} Portals Configured</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Switch 
                    checked={!!category.isActive} 
                    onCheckedChange={async (val) => await updateDoc(doc(db, "deposit_methods", category.id), { isActive: val })}
                    className="data-[state=checked]:bg-emerald-500"
                  />
                  <Button variant="ghost" size="icon" onClick={() => { setActiveCatId(category.id); setIsAddPortalOpen(true); }} className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 shadow-sm" title="إضافة بوابة لهذا القسم">
                    <Plus className="h-5 w-5" />
                  </Button>
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
                  {category.portals?.length > 0 ? (
                    <div className="grid gap-6 md:grid-cols-2">
                      {category.portals.map((portal: any) => (
                        <div key={portal.id} className="p-8 bg-gray-50 rounded-[40px] border border-gray-100 shadow-inner space-y-6 relative group/portal">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="h-12 w-12 rounded-[18px] bg-white flex items-center justify-center shadow-sm">
                                <CryptoIcon name={portal.icon} size={24} />
                              </div>
                              <div className="text-right">
                                <p className="font-black text-base text-[#002d4d]">{portal.name}</p>
                                <Badge className={cn(
                                  "text-[7px] font-black border-none px-2 py-0.5 rounded-md",
                                  portal.automationType === 'nowpayments' ? "bg-purple-100 text-purple-600" :
                                  portal.automationType === 'binance' ? "bg-orange-100 text-orange-600" : "bg-blue-100 text-blue-600"
                                )}>
                                  {portal.automationType?.toUpperCase() || 'MANUAL'}
                                </Badge>
                              </div>
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
                            <div className="grid gap-4">
                               <div className="space-y-1.5 text-right">
                                  <Label className="text-[9px] font-black text-gray-400 uppercase pr-4">اسم البوابة</Label>
                                  <Input 
                                    value={portal.name} 
                                    onChange={(e) => updatePortalConfig(category.id, portal.id, 'name', e.target.value)}
                                    className="h-11 rounded-xl bg-white border-none font-black text-sm px-8 shadow-sm text-right" 
                                  />
                               </div>

                               <div className="space-y-1.5 text-right">
                                  <Label className="text-[9px] font-black text-gray-400 uppercase pr-4">نمط التشغيل (Automation Mode)</Label>
                                  <Select 
                                    value={portal.automationType || "none"} 
                                    onValueChange={(val) => updatePortalConfig(category.id, portal.id, 'automationType', val)}
                                  >
                                    <SelectTrigger className="h-11 rounded-xl bg-[#002d4d] text-white border-none font-black text-xs px-6 shadow-xl">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-2xl border-none shadow-2xl">
                                       <SelectItem value="none" className="font-bold text-right py-2.5">يدوي (تحكم المشرف)</SelectItem>
                                       <SelectItem value="nowpayments" className="font-bold text-right py-2.5">آلي (NOWPayments)</SelectItem>
                                       <SelectItem value="binance" className="font-bold text-right py-2.5">شبه آلي (Binance Verify)</SelectItem>
                                    </SelectContent>
                                  </Select>
                               </div>
                            </div>

                            {/* NOWPayments Settings */}
                            {portal.automationType === 'nowpayments' && (
                              <div className="p-6 bg-purple-50 rounded-3xl border border-purple-100 space-y-4 animate-in zoom-in-95">
                                 <div className="flex items-center gap-3 text-purple-600">
                                    <Zap size={16} className="fill-current" />
                                    <span className="text-[10px] font-black uppercase">إعدادات NOWPayments</span>
                                 </div>
                                 <div className="space-y-1.5">
                                    <Label className="text-[8px] font-black text-purple-400 pr-2">Currency ID (e.g. usdttrc20)</Label>
                                    <Input 
                                      value={portal.nowPaymentsCurrency || ""} 
                                      onChange={(e) => updatePortalConfig(category.id, portal.id, 'nowPaymentsCurrency', e.target.value.toLowerCase())}
                                      className="h-9 rounded-xl bg-white border-none font-black text-[10px] px-4 shadow-sm"
                                      placeholder="usdttrc20"
                                    />
                                 </div>
                              </div>
                            )}

                            {/* Binance Settings */}
                            {portal.automationType === 'binance' && (
                              <div className="p-6 bg-orange-50 rounded-3xl border border-orange-100 space-y-4 animate-in zoom-in-95">
                                 <div className="flex items-center gap-3 text-orange-600">
                                    <Cpu size={16} />
                                    <span className="text-[10px] font-black uppercase">إعدادات Binance SAPI</span>
                                 </div>
                                 <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1">
                                       <Label className="text-[8px] font-black text-orange-400">Asset</Label>
                                       <Input value={portal.binanceAsset || ""} onChange={e => updatePortalConfig(category.id, portal.id, 'binanceAsset', e.target.value.toUpperCase())} className="h-9 rounded-xl bg-white border-none font-black text-[10px]" placeholder="USDT" />
                                    </div>
                                    <div className="space-y-1">
                                       <Label className="text-[8px] font-black text-orange-400">Network</Label>
                                       <Input value={portal.binanceNetwork || ""} onChange={e => updatePortalConfig(category.id, portal.id, 'binanceNetwork', e.target.value.toUpperCase())} className="h-9 rounded-xl bg-white border-none font-black text-[10px]" placeholder="TRX" />
                                    </div>
                                 </div>
                              </div>
                            )}

                            {/* Wallet Address (Only if NOT nowpayments) */}
                            {portal.automationType !== 'nowpayments' && (
                              <div className="space-y-1.5 text-right">
                                <Label className="text-[9px] font-black text-gray-400 uppercase pr-2">عنوان محفظة الاستلام (ثابت)</Label>
                                <Input 
                                  value={portal.walletAddress} 
                                  onChange={(e) => updatePortalConfig(category.id, portal.id, 'walletAddress', e.target.value)}
                                  className="h-11 rounded-xl bg-white border-none font-mono text-[10px] font-black px-4 shadow-sm text-left" 
                                  dir="ltr"
                                />
                              </div>
                            )}

                            <div className="space-y-1.5 text-right">
                              <Label className="text-[9px] font-black text-gray-400 uppercase pr-2">أيقونة الواجهة</Label>
                              <Select 
                                value={portal.icon || "USDT"} 
                                onValueChange={(val) => updatePortalConfig(category.id, portal.id, 'icon', val)}
                              >
                                <SelectTrigger className="h-11 rounded-xl bg-white border-none font-black text-xs px-4 shadow-sm text-right">
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
        <DialogContent className="rounded-[40px] border-none p-10 max-w-[380px] font-body text-right" dir="rtl">
          <DialogHeader className="items-center">
            <DialogTitle className="text-2xl font-black text-[#002d4d]">إنشاء قسم إيداع</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-6 text-right">
            <div className="space-y-2">
               <Label className="text-[10px] font-black text-gray-400 pr-4 uppercase">اسم القسم (مثلاً: عملات رقمية)</Label>
               <Input placeholder="أدخل اسم القسم..." value={newCatName} onChange={e => setNewCatName(e.target.value)} className="h-14 rounded-[24px] bg-gray-50 border-none font-black text-center" />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleAddCategory} className="w-full h-14 rounded-full bg-[#002d4d] text-white font-black text-base shadow-xl">تنشيط القسم</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isAddPortalOpen} onOpenChange={setIsAddPortalOpen}>
        <DialogContent className="rounded-[48px] border-none p-10 max-w-[480px] font-body text-right flex flex-col max-h-[90vh]" dir="rtl">
          <DialogHeader className="items-center gap-4 shrink-0">
            <div className="h-14 w-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-inner">
               <CryptoIcon name="CreditCard" size={28} />
            </div>
            <DialogTitle className="text-2xl font-black text-[#002d4d]">إضافة بوابة جديدة</DialogTitle>
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto space-y-8 py-8 scrollbar-none px-2 text-right">
            <div className="space-y-6">
               <div className="space-y-2">
                  <Label className="text-[10px] font-black text-gray-400 pr-4 uppercase">اسم البوابة</Label>
                  <Input value={newPortal.name} onChange={e => setNewPortal({...newPortal, name: e.target.value})} className="h-14 rounded-[24px] bg-gray-50 border-none font-black px-8 text-right" />
               </div>

               <div className="space-y-2">
                  <Label className="text-[10px] font-black text-gray-400 pr-4 uppercase">نمط التشغيل</Label>
                  <Select value={newPortal.automationType} onValueChange={(val: any) => setNewPortal({...newPortal, automationType: val})}>
                     <SelectTrigger className="h-12 rounded-2xl bg-gray-50 border-none font-black text-xs px-6 shadow-inner text-right">
                       <SelectValue />
                     </SelectTrigger>
                     <SelectContent className="rounded-2xl border-none shadow-2xl">
                        <SelectItem value="none" className="font-bold text-right py-2.5">يدوي (تحكم المشرف)</SelectItem>
                        <SelectItem value="nowpayments" className="font-bold text-right py-2.5">آلي (NOWPayments)</SelectItem>
                        <SelectItem value="binance" className="font-bold text-right py-2.5">شبه آلي (Binance Verify)</SelectItem>
                     </SelectContent>
                  </Select>
               </div>

               <div className="space-y-2">
                  <Label className="text-[10px] font-black text-gray-400 pr-4 uppercase">أيقونة الواجهة</Label>
                  <Select value={newPortal.icon} onValueChange={val => setNewPortal({...newPortal, icon: val})}>
                     <SelectTrigger className="h-12 rounded-2xl bg-gray-50 border-none font-black text-xs px-6 shadow-inner">
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

               {newPortal.automationType !== 'nowpayments' && (
                 <div className="space-y-2">
                    <Label className="text-[10px] font-black text-gray-400 pr-4 uppercase">عنوان الإيداع / رقم الحساب</Label>
                    <Input 
                      value={newPortal.walletAddress} 
                      onChange={e => setNewPortal({...newPortal, walletAddress: e.target.value})} 
                      className="h-14 rounded-[24px] bg-gray-50 border-none font-mono text-xs font-black px-8 shadow-inner text-left" 
                      dir="ltr"
                    />
                 </div>
               )}

               <div className="space-y-2">
                  <Label className="text-[10px] font-black text-gray-400 pr-4 uppercase">تعليمات وتوجيهات المستثمر</Label>
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
