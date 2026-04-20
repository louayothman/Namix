
"use client";

import { useState, useCallback } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Type, 
  Settings2, 
  Sparkles, 
  Bold, 
  Italic, 
  Underline, 
  AlignRight, 
  AlignCenter, 
  AlignLeft,
  Plus,
  Trash2,
  Layout,
  GripVertical
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Reorder, motion, AnimatePresence } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";

export interface EmailBlock {
  id: string;
  type: 'text' | 'button';
  content: string;
  style: {
    fontSize: string;
    fontWeight: string;
    color: string;
    textAlign: 'right' | 'center' | 'left';
    italic: boolean;
    underline: boolean;
    backgroundColor?: string;
    borderRadius?: string;
    link?: string;
  };
}

interface EmailTemplateForgeProps {
  blocks: EmailBlock[];
  onChange: (blocks: EmailBlock[]) => void;
  footer: string;
  onFooterChange: (val: string) => void;
}

export function EmailTemplateForge({ blocks, onChange, footer, onFooterChange }: EmailTemplateForgeProps) {
  const [activeBlockId, setActiveBlockId] = useState<string | null>(null);

  const addBlock = (type: EmailBlock['type']) => {
    const newBlock: EmailBlock = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      content: type === 'text' ? "أدخل النص الجديد هنا..." : "اضغط هنا للمتابعة",
      style: {
        fontSize: "14px",
        fontWeight: "normal",
        color: type === 'button' ? "#ffffff" : "#445566",
        textAlign: "right",
        italic: false,
        underline: false,
        backgroundColor: type === 'button' ? "#002d4d" : "transparent",
        borderRadius: "14px",
        link: ""
      }
    };
    onChange([...blocks, newBlock]);
    setActiveBlockId(newBlock.id);
  };

  const updateBlock = (id: string, updates: Partial<EmailBlock>) => {
    onChange(blocks.map(b => b.id === id ? { ...b, ...updates } : b));
  };

  const updateStyle = (id: string, styleUpdates: Partial<EmailBlock['style']>) => {
    const block = blocks.find(b => b.id === id);
    if (!block) return;
    updateBlock(id, { style: { ...block.style, ...styleUpdates } });
  };

  const removeBlock = (id: string) => {
    onChange(blocks.filter(b => b.id !== id));
    if (activeBlockId === id) setActiveBlockId(null);
  };

  const activeBlock = blocks.find(b => b.id === activeBlockId);

  return (
    <div className="grid gap-10 lg:grid-cols-12 font-body text-right" dir="rtl">
      
      {/* 1. Control & Customization Window */}
      <div className="lg:col-span-5 space-y-6">
        <Card className="rounded-[48px] border-none shadow-xl bg-white overflow-hidden flex flex-col h-full min-h-[600px]">
          <CardHeader className="bg-gray-50/80 p-8 border-b border-gray-100 flex flex-row items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-blue-600">
                <Settings2 size={20} />
              </div>
              <div className="text-right">
                 <CardTitle className="text-base font-black text-[#002d4d]">منصة التحكم</CardTitle>
                 <p className="text-[7px] font-bold text-gray-400 uppercase tracking-widest">Logic Engine</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
               <Button onClick={() => addBlock('text')} size="sm" variant="ghost" className="h-9 rounded-xl bg-blue-50 text-blue-600 font-black text-[10px] px-4">نص +</Button>
               <Button onClick={() => addBlock('button')} size="sm" variant="ghost" className="h-9 rounded-xl bg-orange-50 text-orange-600 font-black text-[10px] px-4">زر +</Button>
            </div>
          </CardHeader>

          <CardContent className="p-8 space-y-8 flex-1 overflow-y-auto scrollbar-none">
            <AnimatePresence mode="wait">
              {activeBlock ? (
                <motion.div key="editor" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-8">
                  <div className="flex items-center justify-between">
                     <Badge className="bg-[#002d4d] text-white border-none font-black text-[8px] px-4 py-1.5 rounded-full uppercase">تعديل: {activeBlock.type === 'text' ? 'كتلة نصية' : 'زر تفاعلي'}</Badge>
                     <Button onClick={() => setActiveBlockId(null)} variant="ghost" className="h-8 text-gray-300 font-black text-[9px] hover:text-[#002d4d]">إتمام التعديل</Button>
                  </div>

                  <div className="space-y-4">
                    <Label className="text-[10px] font-black text-gray-400 uppercase pr-4 tracking-widest">المحتوى الظاهر</Label>
                    <Input 
                      value={activeBlock.content} 
                      onChange={e => updateBlock(activeBlock.id, { content: e.target.value })}
                      className="h-14 rounded-2xl bg-gray-50 border-none font-bold text-xs shadow-inner px-6"
                    />
                    {activeBlock.type === 'button' && (
                      <div className="pt-2">
                         <Label className="text-[10px] font-black text-gray-400 uppercase pr-4 tracking-widest">رابط التوجيه</Label>
                         <Input 
                           value={activeBlock.style.link || ""} 
                           onChange={e => updateStyle(activeBlock.id, { link: e.target.value })}
                           className="h-12 rounded-xl bg-gray-50 border-none font-mono text-[10px] shadow-inner text-left" 
                           dir="ltr"
                           placeholder="https://..."
                         />
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-[9px] font-black text-gray-400 uppercase pr-4">حجم الخط</Label>
                      <Select value={activeBlock.style.fontSize} onValueChange={v => updateStyle(activeBlock.id, { fontSize: v })}>
                         <SelectTrigger className="h-12 rounded-2xl bg-gray-50 border-none font-black text-xs px-6 shadow-inner"><SelectValue /></SelectTrigger>
                         <SelectContent className="rounded-2xl border-none shadow-2xl">
                            {['12px', '14px', '16px', '18px', '20px', '24px', '28px'].map(s => <SelectItem key={s} value={s} className="font-bold text-right">{s}</SelectItem>)}
                         </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[9px] font-black text-gray-400 uppercase pr-4">لون المحتوى</Label>
                      <div className="flex items-center gap-2">
                         <Input type="color" value={activeBlock.style.color} onChange={e => updateStyle(activeBlock.id, { color: e.target.value })} className="h-12 w-16 p-1 rounded-2xl bg-gray-50 border-none cursor-pointer" />
                         <Input value={activeBlock.style.color} onChange={e => updateStyle(activeBlock.id, { color: e.target.value })} className="h-12 flex-1 rounded-2xl bg-gray-50 border-none font-mono text-[10px] text-center" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                     <Label className="text-[9px] font-black text-gray-400 uppercase pr-4">نمط التنسيق والمحاذاة</Label>
                     <div className="flex items-center gap-2 p-1 bg-gray-50 rounded-2xl border border-gray-100 shadow-inner">
                        <button onClick={() => updateStyle(activeBlock.id, { fontWeight: activeBlock.style.fontWeight === 'bold' ? 'normal' : 'bold' })} className={cn("flex-1 h-10 rounded-xl flex items-center justify-center transition-all", activeBlock.style.fontWeight === 'bold' ? "bg-white text-blue-600 shadow-sm" : "text-gray-400")}><Bold size={16}/></button>
                        <button onClick={() => updateStyle(activeBlock.id, { italic: !activeBlock.style.italic })} className={cn("flex-1 h-10 rounded-xl flex items-center justify-center transition-all", activeBlock.style.italic ? "bg-white text-blue-600 shadow-sm" : "text-gray-400")}><Italic size={16}/></button>
                        <button onClick={() => updateStyle(activeBlock.id, { underline: !activeBlock.style.underline })} className={cn("flex-1 h-10 rounded-xl flex items-center justify-center transition-all", activeBlock.style.underline ? "bg-white text-blue-600 shadow-sm" : "text-gray-400")}><Underline size={16}/></button>
                     </div>
                     <div className="flex items-center gap-2 p-1 bg-gray-50 rounded-2xl border border-gray-100 shadow-inner">
                        <button onClick={() => updateStyle(activeBlock.id, { textAlign: 'right' })} className={cn("flex-1 h-10 rounded-xl flex items-center justify-center transition-all", activeBlock.style.textAlign === 'right' ? "bg-white text-[#002d4d] shadow-sm" : "text-gray-400")}><AlignRight size={16}/></button>
                        <button onClick={() => updateStyle(activeBlock.id, { textAlign: 'center' })} className={cn("flex-1 h-10 rounded-xl flex items-center justify-center transition-all", activeBlock.style.textAlign === 'center' ? "bg-white text-[#002d4d] shadow-sm" : "text-gray-400")}><AlignCenter size={16}/></button>
                        <button onClick={() => updateStyle(activeBlock.id, { textAlign: 'left' })} className={cn("flex-1 h-10 rounded-xl flex items-center justify-center transition-all", activeBlock.style.textAlign === 'left' ? "bg-white text-[#002d4d] shadow-sm" : "text-gray-400")}><AlignLeft size={16}/></button>
                     </div>
                  </div>

                  {activeBlock.type === 'button' && (
                    <div className="space-y-4 pt-4 border-t border-gray-50">
                      <Label className="text-[9px] font-black text-gray-400 uppercase pr-4">خلفية الزر</Label>
                      <div className="flex items-center gap-3">
                         <Input type="color" value={activeBlock.style.backgroundColor} onChange={e => updateStyle(activeBlock.id, { backgroundColor: e.target.value })} className="h-14 w-20 p-1 rounded-2xl bg-gray-50 border-none cursor-pointer" />
                         <Input value={activeBlock.style.backgroundColor} onChange={e => updateStyle(activeBlock.id, { backgroundColor: e.target.value })} className="h-14 flex-1 rounded-2xl bg-gray-50 border-none font-mono text-xs text-center" />
                      </div>
                    </div>
                  )}

                  <Button onClick={() => removeBlock(activeBlock.id)} variant="ghost" className="w-full h-14 rounded-2xl bg-red-50 text-red-500 font-black text-xs hover:bg-red-100 mt-4">حذف الكتلة نهائياً</Button>
                </motion.div>
              ) : (
                <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                  <div className="p-10 bg-blue-50/50 rounded-[40px] border-2 border-dashed border-blue-100 text-center space-y-4">
                    <Layout className="h-12 w-12 text-blue-200 mx-auto" />
                    <div className="space-y-1">
                       <p className="text-sm font-black text-[#002d4d]">المحرر جاهز للعمل</p>
                       <p className="text-[11px] font-bold text-gray-400 leading-relaxed">أضف كتل نصوص أو أزرار لبدء التصميم؛ يمكنك تغيير أماكن تموضعها في نافذة المعاينة عبر السحب والإفلات.</p>
                    </div>
                  </div>
                  <div className="space-y-3 px-2">
                    <Label className="text-[10px] font-black text-gray-400 uppercase pr-4">تذييل الرسالة (Footer)</Label>
                    <Input value={footer} onChange={e => onFooterChange(e.target.value)} className="h-14 rounded-2xl bg-gray-50 border-none font-bold text-[11px] px-6 shadow-inner" placeholder="مثلاً: هذا البريد مرسل بصفتك مستثمراً..." />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </div>

      {/* 2. LIVE PREVIEW & DRAG-AND-DROP WINDOW */}
      <div className="lg:col-span-7">
        <Card className="rounded-[56px] border-none shadow-2xl bg-gray-50/50 overflow-hidden flex flex-col min-h-[600px] border border-gray-100">
          <CardHeader className="bg-white p-8 border-b border-gray-100 flex flex-row items-center justify-between shrink-0">
             <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-inner">
                   <Sparkles className="h-6 w-6 animate-pulse" />
                </div>
                <div className="text-right">
                   <CardTitle className="text-base font-black text-[#002d4d]">المعاينة المباشرة (التفاعلية)</CardTitle>
                   <p className="text-[7px] font-bold text-gray-400 uppercase tracking-widest">Interactive Canvas</p>
                </div>
             </div>
             <Badge className="bg-emerald-50 text-emerald-600 border-none font-black text-[8px] px-3 py-1 rounded-full uppercase">Drag & Drop Active</Badge>
          </CardHeader>
          
          <ScrollArea className="flex-1 p-10 bg-white/40">
             <div className="max-w-[550px] mx-auto bg-white rounded-[48px] shadow-sm border border-gray-100 overflow-hidden p-12 space-y-10 flex flex-col">
                <div className="text-center mb-10">
                   <h1 className="text-3xl font-black text-[#002d4d] tracking-tight">Namix</h1>
                </div>

                <Reorder.Group axis="y" values={blocks} onReorder={onChange} className="space-y-4">
                   {blocks.map((block) => (
                     <Reorder.Item 
                       key={block.id} 
                       value={block}
                       className={cn(
                         "relative group cursor-grab active:cursor-grabbing rounded-3xl p-4 transition-all border border-transparent",
                         activeBlockId === block.id ? "bg-blue-50/30 border-blue-100 ring-1 ring-blue-100" : "hover:bg-gray-50/50 hover:border-gray-100"
                       )}
                     >
                       <div className="absolute right-[-40px] top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-20 transition-opacity">
                          <GripVertical size={16} />
                       </div>

                       {block.type === 'text' && (
                         <p style={{
                           fontSize: block.style.fontSize,
                           fontWeight: block.style.fontWeight,
                           color: block.style.color,
                           textAlign: block.style.textAlign,
                           fontStyle: block.style.italic ? 'italic' : 'normal',
                           textDecoration: block.style.underline ? 'underline' : 'none',
                           lineHeight: '1.8'
                         }}>
                           {block.content}
                         </p>
                       )}
                       
                       {block.type === 'button' && (
                         <div style={{ textAlign: block.style.textAlign }} className="py-4">
                           <span style={{
                             backgroundColor: block.style.backgroundColor,
                             color: block.style.color,
                             padding: '14px 40px',
                             borderRadius: block.style.borderRadius,
                             fontSize: block.style.fontSize,
                             fontWeight: block.style.fontWeight,
                             display: 'inline-block',
                             cursor: 'pointer',
                             boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                           }}>
                             {block.content}
                           </span>
                         </div>
                       )}

                       <button 
                         onClick={() => setActiveBlockId(block.id)}
                         className={cn(
                           "absolute left-4 top-4 h-8 w-8 rounded-xl bg-white shadow-sm flex items-center justify-center text-blue-500 opacity-0 group-hover:opacity-100 transition-all",
                           activeBlockId === block.id && "opacity-100 scale-110 border border-blue-100"
                         )}
                       >
                         <Settings2 size={14} />
                       </button>
                     </Reorder.Item>
                   ))}
                </Reorder.Group>

                <div className="mt-20 pt-10 border-t border-gray-100 text-center">
                   <p className="text-[10px] text-gray-400 font-bold leading-relaxed px-6">{footer}</p>
                   <p className="text-[8px] text-gray-300 font-black uppercase mt-6 tracking-widest">© 2024 Namix Universal Network</p>
                </div>
             </div>
             <div className="h-20" />
          </ScrollArea>
        </Card>
      </div>
    </div>
  );
}
