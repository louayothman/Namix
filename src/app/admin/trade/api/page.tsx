
"use client";

import { useState, useEffect, useMemo } from "react";
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
  Globe, 
  Zap, 
  ShieldCheck, 
  Loader2, 
  Sparkles,
  RefreshCcw,
  Activity,
  Plus,
  Trash2,
  Lock,
  KeyRound,
  Database,
  Layers,
  AlertTriangle
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

/**
 * @fileOverview مركز إدارة بروتوكولات الربط الديناميكي v2.0
 * يسمح للمشرف بإدارة مصفوفة من مفاتيح الـ API مع دعم التسمية والمفاتيح السرية.
 */

interface ApiNode {
  id: string;
  provider: 'binance' | 'finnhub' | 'custom';
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
      setNodes(remoteConnectivity.nodes);
    } else if (remoteConnectivity) {
      // Migrate legacy structure to nodes array
      const initialNodes: ApiNode[] = [];
      if (remoteConnectivity.binanceApiKey) {
        initialNodes.push({
          id: 'legacy-binance',
          provider: 'binance',
          label: 'Default Binance Node',
          apiKey: remoteConnectivity.binanceApiKey,
          apiSecret: remoteConnectivity.binanceApiSecret || "",
          isActive: true
        });
      }
      if (remoteConnectivity.finnhubApiKey) {
        initialNodes.push({
          id: 'legacy-finnhub',
          provider: 'finnhub',
          label: remoteConnectivity.finnhubLabel || 'Default Finnhub Node',
          apiKey: remoteConnectivity.finnhubApiKey,
          isActive: true
        });
      }
      setNodes(initialNodes);
    }
  }, [remoteConnectivity]);

  const handleAddNode = (provider: ApiNode['provider']) => {
    const newNode: ApiNode = {
      id: Math.random().toString(36).substr(2, 9),
      provider,
      label: provider === 'binance' ? 'Binance Account' : provider === 'finnhub' ? 'Finnhub Node' : 'Custom Node',
      apiKey: "",
      apiSecret: "",
      isActive: false
    };
    setNodes([...nodes, newNode]);
  };

  const updateNode = (id: string, field: keyof ApiNode, value: any) => {
    setNodes(nodes.map(n => {
      if (n.id === id) {
        // If activating, deactivate others of the same provider
        if (field === 'isActive' && value === true) {
          // This is optional, but usually you want one active provider at a time
          // However, we allow multiple for redundancy if the actions handle it.
          // For now, let's just update the specific node.
        }
        return { ...n, [field]: value };
      }
      return n;
    }));
  };

  const removeNode = (id: string) => {
    setNodes(nodes.filter(n => n.id !== id));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await setDoc(connectivityRef, { 
        nodes, 
        // Sync legacy fields for backward compatibility
        binanceApiKey: nodes.find(n => n.provider === 'binance' && n.isActive)?.apiKey || "",
        binanceApiSecret: nodes.find(n => n.provider === 'binance' && n.isActive)?.apiSecret || "",
        finnhubApiKey: nodes.find(n => n.provider === 'finnhub' && n.isActive)?.apiKey || "",
        updatedAt: new Date().toISOString() 
      }, { merge: true });
      toast({ title: "تم تحديث مصفوفة الربط بنجاح" });
    } catch (e) {
      toast({ variant: "destructive", title: "فشل تحديث البيانات" });
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-white gap-4">
         <Loader2 className="h-10 w-10 animate-spin text-[#002d4d]" />
         <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">جاري جرد مصفوفة الاتصال...</p>
      </div>
    );
  }

  return (
    <Shell isAdmin>
      <div className="max-w-5xl mx-auto space-y-10 px-6 pt-10 pb-32 font-body text-right" dir="rtl">
        
        {/* Header Strip */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-gray-100 pb-8">
          <div className="space-y-1">
            <h1 className="text-3xl font-black text-[#002d4d] flex items-center gap-3">
              <Database className="h-8 w-8 text-blue-600" />
              مصفوفة الاتصال الديناميكية
            </h1>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Multi-Provider Connectivity Hub</p>
          </div>
          
          <div className="flex items-center gap-3">
             <div className="flex items-center gap-2 p-1.5 bg-gray-100 rounded-2xl shadow-inner">
                <button 
                  onClick={() => handleAddNode('binance')}
                  className="px-4 h-9 rounded-xl bg-white text-orange-600 font-black text-[9px] shadow-sm hover:bg-orange-50 transition-all flex items-center gap-2"
                >
                   <Plus size={12} /> BINANCE NODE
                </button>
                <button 
                  onClick={() => handleAddNode('finnhub')}
                  className="px-4 h-9 rounded-xl bg-white text-blue-600 font-black text-[9px] shadow-sm hover:bg-blue-50 transition-all flex items-center gap-2"
                >
                   <Plus size={12} /> FINNHUB NODE
                </button>
             </div>
             <Button onClick={() => router.back()} variant="ghost" className="rounded-full bg-white border border-gray-100 h-12 px-8 font-black text-[10px]">
                <ChevronRight className="ml-2 h-4 w-4" /> العودة للقمرة
             </Button>
          </div>
        </div>

        {/* Nodes Grid */}
        <div className="grid gap-8">
          <AnimatePresence mode="popLayout">
            {nodes.length > 0 ? nodes.map((node) => (
              <motion.div 
                key={node.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative"
              >
                <Card className={cn(
                  "rounded-[48px] border-none shadow-sm overflow-hidden bg-white transition-all duration-500",
                  node.isActive ? "ring-2 ring-emerald-500/20 shadow-xl" : "opacity-80 grayscale-[0.3]"
                )}>
                  <CardHeader className={cn(
                    "p-8 border-b border-gray-50 flex flex-row items-center justify-between",
                    node.provider === 'binance' ? "bg-orange-50/30" : "bg-blue-50/30"
                  )}>
                    <div className="flex items-center gap-5">
                      <div className={cn(
                        "h-14 w-14 rounded-[22px] flex items-center justify-center shadow-inner",
                        node.provider === 'binance' ? "bg-white text-orange-500" : "bg-white text-blue-600"
                      )}>
                        <Cpu className={cn("h-7 w-7", node.isActive && "animate-pulse")} />
                      </div>
                      <div className="text-right">
                        <Input 
                          value={node.label} 
                          onChange={e => updateNode(node.id, 'label', e.target.value)}
                          className="h-8 w-48 bg-transparent border-none font-black text-lg p-0 text-[#002d4d] focus-visible:ring-0"
                        />
                        <p className="text-[8px] font-bold text-gray-400 uppercase tracking-[0.2em]">{node.provider} Protocol Node</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                       <div className="flex flex-col items-end gap-1">
                          <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">تنشيط العقدة</span>
                          <Switch 
                            checked={node.isActive} 
                            onCheckedChange={val => updateNode(node.id, 'isActive', val)}
                            className="data-[state=checked]:bg-emerald-500"
                          />
                       </div>
                       <div className="h-10 w-px bg-gray-200/50 mx-2" />
                       <button 
                         onClick={() => removeNode(node.id)}
                         className="h-10 w-10 rounded-xl bg-white text-red-400 flex items-center justify-center hover:bg-red-50 hover:text-red-600 transition-all shadow-sm"
                       >
                          <Trash2 size={18} />
                       </button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-8 md:p-10 space-y-8">
                    <div className="grid gap-8 md:grid-cols-2">
                       <div className="space-y-3">
                          <Label className="text-[10px] font-black text-gray-400 uppercase pr-4">API Key (المفتاح العام)</Label>
                          <div className="relative group">
                             <Input 
                               value={node.apiKey} 
                               onChange={e => updateNode(node.id, 'apiKey', e.target.value)}
                               className="h-14 rounded-2xl bg-gray-50 border-none font-mono text-sm px-8 shadow-inner text-left"
                               dir="ltr"
                               placeholder="أدخل المفتاح هنا..."
                             />
                             <KeyRound className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-200 group-hover:text-blue-400 transition-colors" />
                          </div>
                       </div>

                       <div className="space-y-3">
                          <Label className="text-[10px] font-black text-gray-400 uppercase pr-4">Secret Key (المفتاح السري)</Label>
                          <div className="relative group">
                             <Input 
                               type="password"
                               value={node.apiSecret || ""} 
                               onChange={e => updateNode(node.id, 'apiSecret', e.target.value)}
                               className="h-14 rounded-2xl bg-gray-50 border-none font-mono text-sm px-8 shadow-inner text-left"
                               dir="ltr"
                               placeholder="••••••••••••••••"
                             />
                             <Lock className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-200 group-hover:text-red-400 transition-colors" />
                          </div>
                       </div>
                    </div>

                    {node.isActive && (
                      <div className="p-6 bg-emerald-50/50 rounded-[32px] border border-emerald-100 flex items-start gap-5">
                         <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center shadow-sm shrink-0">
                            <ShieldCheck className="h-6 w-6 text-emerald-600" />
                         </div>
                         <p className="text-[11px] font-bold text-emerald-800/60 leading-relaxed pt-1">
                           هذه العقدة هي المصدر "النشط" حالياً لبيانات {node.provider}. سيقوم النظام بمزامنة الأسعار اللحظية بناءً على هذه البيانات فور الحفظ.
                         </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )) : (
              <div className="py-32 text-center flex flex-col items-center gap-6 opacity-20 border-2 border-dashed border-gray-100 rounded-[64px]">
                 <Layers className="h-20 w-20 text-[#002d4d]" />
                 <p className="text-xs font-black uppercase tracking-[0.5em]">لا توجد عقد ربط معرفة حالياً</p>
              </div>
            )}
          </AnimatePresence>
        </div>

        {nodes.length > 0 && (
          <div className="space-y-6 pt-10">
            <div className="p-8 bg-blue-50/50 rounded-[48px] border border-blue-100 flex items-start gap-6">
               <div className="h-12 w-12 rounded-2xl bg-white flex items-center justify-center shadow-sm shrink-0">
                  <Sparkles className="h-7 w-7 text-blue-600" />
               </div>
               <div className="space-y-1">
                  <p className="text-xs font-black text-[#002d4d]">بروتوكول المزامنة الهجين</p>
                  <p className="text-[11px] font-bold text-blue-800/60 leading-relaxed">
                    تسمح مصفوفة العقد بالتبديل السريع بين حسابات الـ API المختلفة لتجنب قيود الطلبات (Rate Limits) أو في حالة صيانة أحد المصادر. تأكد من تفعيل عقدة واحدة على الأقل لكل مزود خدمة.
                  </p>
               </div>
            </div>

            <Button 
              onClick={handleSave} 
              disabled={saving} 
              className="w-full h-20 rounded-full bg-[#002d4d] hover:bg-[#001d33] text-white font-black text-xl shadow-2xl transition-all active:scale-[0.98] group"
            >
              {saving ? <Loader2 className="animate-spin h-8 w-8" /> : (
                <div className="flex items-center gap-4">
                  <span>تثبيت مصفوفة الاتصال المحدثة</span>
                  <ShieldCheck className="h-6 w-6 text-[#f9a885] group-hover:rotate-12 transition-transform" />
                </div>
              )}
            </Button>
          </div>
        )}

        <div className="flex items-center justify-center gap-3 opacity-20 pt-10 select-none">
           <Activity size={12} className="text-[#002d4d] animate-pulse" />
           <p className="text-[8px] font-black uppercase tracking-[0.6em] text-[#002d4d]">Hybrid Connectivity Matrix Node v2.0</p>
        </div>
      </div>
    </Shell>
  );
}
