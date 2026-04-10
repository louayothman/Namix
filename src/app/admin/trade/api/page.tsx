
"use client";

import { useState, useEffect } from "react";
import { Shell } from "@/components/layout/Shell";
import { useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { doc, setDoc } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  Cpu, 
  ChevronRight, 
  Zap, 
  ShieldCheck, 
  Loader2, 
  Plus,
  Trash2,
  Database,
  RotateCcw
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface ApiNode {
  id: string;
  provider: 'binance' | 'custom';
  label: string;
  apiKey: string;
  apiSecret?: string;
  isActive: boolean;
}

export default function APIManagementPage() {
  const router = useRouter();
  const db = useFirestore();
  const [saving, setSaving] = useState(false);

  const connectivityRef = useMemoFirebase(() => doc(db, "system_settings", "connectivity"), [db]);
  const { data: remoteConnectivity, isLoading } = useDoc(connectivityRef);
  
  const [nodes, setNodes] = useState<ApiNode[]>([]);

  useEffect(() => {
    if (remoteConnectivity?.nodes) {
      setNodes(remoteConnectivity.nodes.filter((n: any) => n.provider !== 'finnhub'));
    }
  }, [remoteConnectivity]);

  const handleAddNode = (provider: ApiNode['provider']) => {
    const newNode: ApiNode = {
      id: Math.random().toString(36).substr(2, 9),
      provider,
      label: provider === 'binance' ? 'Binance Node' : 'Custom Node',
      apiKey: "",
      apiSecret: "",
      isActive: true
    };
    setNodes([...nodes, newNode]);
  };

  const updateNode = (id: string, field: keyof ApiNode, value: any) => {
    setNodes(nodes.map(n => n.id === id ? { ...n, [field]: value } : n));
  };

  const removeNode = (id: string) => {
    setNodes(nodes.filter(n => n.id !== id));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await setDoc(connectivityRef, { 
        nodes, 
        binanceApiKey: nodes.find(n => n.provider === 'binance' && n.isActive)?.apiKey || "",
        binanceApiSecret: nodes.find(n => n.provider === 'binance' && n.isActive)?.apiSecret || "",
        updatedAt: new Date().toISOString() 
      }, { merge: true });
      toast({ title: "تم تحديث مصفوفة العقد" });
    } catch (e) {
      toast({ variant: "destructive", title: "فشل التحديث" });
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) return <div className="h-screen w-full flex flex-col items-center justify-center bg-white gap-4"><Loader2 className="h-10 w-10 animate-spin text-[#002d4d]" /></div>;

  return (
    <Shell isAdmin>
      <div className="max-w-5xl mx-auto space-y-10 px-6 pt-10 pb-32 font-body text-right" dir="rtl">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-gray-100 pb-8">
          <div className="space-y-1">
            <h1 className="text-3xl font-black text-[#002d4d] flex items-center gap-3">
              <Database className="h-8 w-8 text-blue-600" />
              مصفوفة الربط الخارجية
            </h1>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Binance API Infrastructure</p>
          </div>
          
          <div className="flex items-center gap-3">
             <Button onClick={() => handleAddNode('binance')} className="rounded-xl h-11 px-6 bg-orange-50 text-orange-600 hover:bg-orange-100 font-black text-[10px] border border-orange-100 shadow-sm">
                <Plus size={14} className="ml-2" /> إضافة عقدة BINANCE
             </Button>
             <Button onClick={() => router.back()} variant="ghost" className="rounded-full bg-white border border-gray-100 h-11 px-8 font-black text-[10px]"><ChevronRight className="ml-2 h-4 w-4" /> العودة</Button>
          </div>
        </div>

        <div className="p-6 bg-emerald-50 rounded-[32px] border border-emerald-100 flex items-start gap-5">
           <div className="h-10 w-10 rounded-2xl bg-white flex items-center justify-center shadow-sm shrink-0">
              <RotateCcw className="h-6 w-6 text-emerald-600 animate-spin-slow" />
           </div>
           <div className="space-y-1">
              <p className="text-xs font-black text-emerald-900">بروتوكول موازنة الأحمال</p>
              <p className="text-[11px] font-bold text-emerald-800/60 leading-relaxed">
                يمكنك تفعيل أكثر من مفتاح Binance لتجاوز قيود الطلبات (Rate Limits). سيقوم النظام بالتبديل آلياً بين العقد النشطة لضمان استقرار تدفق الأسعار والتحقق من الإيداعات.
              </p>
           </div>
        </div>

        <div className="grid gap-8">
          <AnimatePresence mode="popLayout">
            {nodes.map((node) => (
              <motion.div key={node.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}>
                <Card className={cn("rounded-[48px] border-none shadow-sm overflow-hidden bg-white transition-all duration-500", node.isActive ? "ring-2 ring-emerald-500/20 shadow-xl" : "opacity-60 grayscale")}>
                  <CardHeader className="p-8 border-b border-gray-50 flex flex-row items-center justify-between bg-orange-50/20">
                    <div className="flex items-center gap-5">
                      <div className="h-14 w-14 rounded-[22px] bg-white text-orange-500 flex items-center justify-center shadow-inner">
                        <Cpu className={cn("h-7 w-7", node.isActive && "animate-pulse")} />
                      </div>
                      <div className="text-right">
                        <Input value={node.label} onChange={e => updateNode(node.id, 'label', e.target.value)} className="h-8 w-48 bg-transparent border-none font-black text-lg p-0 text-[#002d4d] focus-visible:ring-0" />
                        <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">{node.provider} Node Config</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                       <div className="flex flex-col items-end gap-1">
                          <span className="text-[8px] font-black text-gray-400 uppercase">الحالة</span>
                          <Switch checked={node.isActive} onCheckedChange={val => updateNode(node.id, 'isActive', val)} className="data-[state=checked]:bg-emerald-500" />
                       </div>
                       <button onClick={() => removeNode(node.id)} className="h-10 w-10 rounded-xl bg-white text-red-400 flex items-center justify-center hover:bg-red-50 hover:text-red-600 transition-all shadow-sm"><Trash2 size={18} /></button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-8 md:p-10 space-y-8">
                    <div className="grid gap-8 md:grid-cols-2">
                       <div className="space-y-3">
                          <Label className="text-[10px] font-black text-gray-400 uppercase pr-4">API Key</Label>
                          <Input value={node.apiKey} onChange={e => updateNode(node.id, 'apiKey', e.target.value)} className="h-14 rounded-2xl bg-gray-50 border-none font-mono text-sm px-8 shadow-inner text-left" dir="ltr" />
                       </div>
                       <div className="space-y-3">
                          <Label className="text-[10px] font-black text-gray-400 uppercase pr-4">Secret Key</Label>
                          <Input type="password" value={node.apiSecret || ""} onChange={e => updateNode(node.id, 'apiSecret', e.target.value)} className="h-14 rounded-2xl bg-gray-50 border-none font-mono text-sm px-8 shadow-inner text-left" dir="ltr" />
                       </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
          {nodes.length === 0 && (
            <div className="py-20 text-center opacity-20 flex flex-col items-center gap-4">
               <Cpu size={48} />
               <p className="text-xs font-black uppercase tracking-widest">لا توجد عقد ربط نشطة</p>
            </div>
          )}
        </div>

        <Button onClick={handleSave} disabled={saving} className="w-full h-20 rounded-full bg-[#002d4d] hover:bg-[#001d33] text-white font-black text-xl shadow-2xl transition-all active:scale-[0.98] group">
          {saving ? <Loader2 className="animate-spin h-8 w-8" /> : (
            <div className="flex items-center gap-4">
              <span>تثبيت مصفوفة الربط السيادية</span>
              <ShieldCheck className="h-6 w-6 text-[#f9a885] group-hover:rotate-12 transition-transform" />
            </div>
          )}
        </Button>
      </div>
    </Shell>
  );
}
