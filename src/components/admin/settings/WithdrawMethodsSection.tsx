
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
  Layers, 
  ShieldAlert, 
  ListFilter, 
  Type,
  ClipboardPaste,
  Hash,
  Zap,
  Globe,
  Settings2
} from "lucide-react";
import { useFirestore, useCollection } from "@/firebase";
import { collection, doc, addDoc, deleteDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { useMemoFirebase } from "@/firebase";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { CryptoIcon, ICON_OPTIONS } from "@/lib/crypto-icons";

/**
 * @fileOverview هندسة بوابات السحب السيادية v10.0
 * دعم كامل لنظام "Namix Internal Payout" عبر المعرف الرقمي ID.
 */

export function WithdrawMethodsSection() {
  const db = useFirestore();
  const [isAddCatOpen, setIsAddCatOpen] = useState(false);
  const [isAddPortalOpen, setIsAddPortalOpen] = useState(false);
  const [activeCatId, setActiveCatId] = useState<string | null>(null);
  const [newCatName, setNewCatName] = useState("");
  const [expandedCat, setExpandedCat] = useState<string | null>(null);

  const [newPortal, setNewPortal] = useState({
    name: "Namix Internal Payout",
    instructions: "يرجى إدخال Namix ID الخاص بالمستلم والمكون من 10 أرقام.",
    icon: "NAMIX_ID"
  });

  const categoriesQuery = useMemoFirebase(() => collection(db, "withdraw_methods"), [db]);
  const { data: categories } = useCollection(categoriesQuery);

  const handleAddCategory = async () => {
    if (!newCatName.trim()) return;
    try {
      await addDoc(collection(db, "withdraw_methods"), { 
        name: newCatName, 
        isActive: true,
        portals: [] 
      });
      setNewCatName("");
      setIsAddCatOpen(false);
      toast({ title: "تم تفعيل القسم بنجاح" });
    } catch (e) { toast({ variant: "destructive", title: "خطأ" }); }
  };

  const handleAddPortal = async () => {
    if (!activeCatId || !newPortal.name.trim()) return;
    try {
      const portalData = {
        id: Math.random().toString(36).substr(2, 9),
        name: newPortal.name,
        instructions: newPortal.instructions,
        icon: newPortal.icon,
        isActive: true,
        fields: [
          { label: "Namix ID المستلم", placeholder: "أدخل الـ ID المكون من 10 أرقام...", type: "text", hasPasteButton: true }
        ]
      };
      await updateDoc(doc(db, "withdraw_methods", activeCatId), {
        portals: arrayUnion(portalData)
      });
      setNewPortal({ name: "Namix Internal Payout", instructions: "يرجى إدخال Namix ID الخاص بالمستلم والمكون من 10 أرقام.", icon: "NAMIX_ID" });
      setIsAddPortalOpen(true);
      toast({ title: "تمت إضافة البوابة بنجاح" });
    } catch (e) { toast({ variant: "destructive", title: "خطأ" }); }
  };

  const handleToggleStatus = async (catId: string, current: boolean) => {
    await updateDoc(doc(db, "withdraw_methods", catId), { isActive: !current });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 text-right" dir="rtl">
      
      <div className="p-8 bg-[#002d4d] rounded-[48px] text-white relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6 group">
         <div className="absolute top-0 right-0 p-4 opacity-[0.05] -rotate-12 group-hover:rotate-0 transition-transform duration-1000"><Zap size={120} /></div>
         <div className="flex items-center gap-5 relative z-10">
            <div className="h-14 w-14 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20 shadow-inner">
               <Settings2 className="h-7 w-7 text-[#f9a885]" />
            </div>
            <div className="space-y-1">
               <h3 className="text-xl font-black">مفاعل بوابات الصرف</h3>
               <p className="text-[9px] font-bold text-blue-200/40 uppercase tracking-widest">Portal Engineering Console</p>
            </div>
         </div>
         <Button onClick={() => setIsAddCatOpen(true)} className="rounded-full h-12 px-8 bg-[#f9a885] hover:bg-white text-[#002d4d] font-black text-[10px] shadow-xl relative z-10">
            <Plus className="ml-2 h-4 w-4" /> إضافة فئة سحب جديدة
         </Button>
      </div>

      <div className="grid gap-6">
        {categories?.map(category => (
          <Card key={category.id} className="border-none shadow-sm rounded-[44px] bg-white overflow-hidden border border-gray-50">
            <CardContent className="p-0">
              <div className="p-6 md:p-8 flex items-center justify-between border-b border-gray-50">
                <div className="flex items-center gap-5">
                  <div className="h-14 w-14 rounded-[22px] bg-gray-50 flex items-center justify-center text-blue-600 shadow-inner">
                    <Landmark size={28} />
                  </div>
                  <div className="text-right space-y-1">
                    <h4 className="font-black text-lg text-[#002d4d]">{category.name}</h4>
                    <div className="flex items-center gap-3">
                       <Badge className={cn("text-[8px] font-black border-none px-3 py-1 rounded-full", category.isActive ? "bg-emerald-50 text-emerald-600" : "bg-gray-100 text-gray-400")}>
                         {category.isActive ? "ACTIVE" : "DISABLED"}
                       </Badge>
                       <span className="text-[9px] font-bold text-gray-400 uppercase">{category.portals?.length || 0} Portals</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Switch checked={!!category.isActive} onCheckedChange={() => handleToggleStatus(category.id, category.isActive)} className="data-[state=checked]:bg-blue-600" />
                  <Button variant="ghost" size="icon" onClick={() => { setActiveCatId(category.id); setIsAddPortalOpen(true); }} className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100"><Plus size={18}/></Button>
                  <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl bg-red-50 text-red-400" onClick={async () => { if(confirm("حذف القسم؟")) await deleteDoc(doc(db, "withdraw_methods", category.id)); }}><Trash2 size={18}/></Button>
                  <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl bg-gray-50 text-gray-400" onClick={() => setExpandedCat(expandedCat === category.id ? null : category.id)}>
                    {expandedCat === category.id ? <ChevronUp size={18}/> : <ChevronDown size={18}/>}
                  </Button>
                </div>
              </div>

              {expandedCat === category.id && (
                <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-top-2">
                  {category.portals?.map((portal: any) => (
                    <div key={portal.id} className="p-6 bg-gray-50 rounded-[32px] border border-gray-100 shadow-inner flex items-center justify-between group">
                       <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-[18px] bg-white shadow-sm flex items-center justify-center text-blue-600">
                             <CryptoIcon name={portal.icon} size={24} />
                          </div>
                          <div className="text-right">
                             <p className="font-black text-sm text-[#002d4d]">{portal.name}</p>
                             <p className="text-[8px] font-bold text-gray-400 uppercase">{portal.id}</p>
                          </div>
                       </div>
                       <button onClick={async () => {
                         const updated = category.portals.filter((p: any) => p.id !== portal.id);
                         await updateDoc(doc(db, "withdraw_methods", category.id), { portals: updated });
                       }} className="h-10 w-10 rounded-xl bg-white text-red-400 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-sm">
                          <Trash2 size={16} />
                       </button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Dialogs remain similar but ensure icons work */}
      <Dialog open={isAddCatOpen} onOpenChange={setIsAddCatOpen}>
        <DialogContent className="rounded-[40px] border-none p-10 max-w-[380px] font-body text-right" dir="rtl">
          <DialogHeader className="items-center"><DialogTitle className="text-2xl font-black text-[#002d4d]">إنشاء فئة سحب</DialogTitle></DialogHeader>
          <div className="py-6"><Input placeholder="اسم القسم..." value={newCatName} onChange={e => setNewCatName(e.target.value)} className="h-14 rounded-2xl bg-gray-50 border-none font-black text-center" /></div>
          <Button onClick={handleAddCategory} className="w-full h-14 rounded-full bg-[#002d4d] text-white font-black shadow-xl">تفعيل القسم</Button>
        </DialogContent>
      </Dialog>

      <Dialog open={isAddPortalOpen} onOpenChange={setIsAddPortalOpen}>
        <DialogContent className="rounded-[48px] border-none p-10 max-w-[420px] font-body text-right" dir="rtl">
          <DialogHeader className="items-center gap-4">
            <div className="h-14 w-14 rounded-[22px] bg-blue-50 text-blue-600 flex items-center justify-center"><CryptoIcon name={newPortal.icon} size={28} /></div>
            <DialogTitle className="text-2xl font-black text-[#002d4d]">إضافة بوابة سحب</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-6">
            <div className="space-y-2">
               <Label className="text-[10px] font-black text-gray-400 uppercase pr-4">أيقونة البوابة</Label>
               <Select value={newPortal.icon} onValueChange={val => setNewPortal({...newPortal, icon: val})}>
                  <SelectTrigger className="h-12 rounded-2xl bg-gray-50 border-none font-black text-xs px-6"><SelectValue /></SelectTrigger>
                  <SelectContent className="rounded-2xl border-none shadow-2xl">
                    {ICON_OPTIONS.slice(0, 40).map(opt => (
                      <SelectItem key={opt.id} value={opt.id} className="font-bold text-right py-2"><div className="flex items-center gap-3 justify-end"><span>{opt.label}</span><CryptoIcon name={opt.id} size={16}/></div></SelectItem>
                    ))}
                  </SelectContent>
               </Select>
            </div>
            <div className="space-y-2">
               <Label className="text-[10px] font-black text-gray-400 uppercase pr-4">تسمية القناة</Label>
               <Input value={newPortal.name} onChange={e => setNewPortal({...newPortal, name: e.target.value})} className="h-12 rounded-2xl bg-gray-50 border-none font-black px-6" />
            </div>
            <div className="space-y-2">
               <Label className="text-[10px] font-black text-gray-400 uppercase pr-4">تعليمات الاستلام</Label>
               <Textarea value={newPortal.instructions} onChange={e => setNewPortal({...newPortal, instructions: e.target.value})} className="min-h-[100px] rounded-[24px] bg-gray-50 border-none font-bold text-xs p-6" />
            </div>
          </div>
          <Button onClick={handleAddPortal} className="w-full h-14 rounded-full bg-[#002d4d] text-white font-black shadow-xl">تثبيت القناة</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
