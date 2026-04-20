"use client";

import { useState, useMemo } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Type, 
  MousePointer2, 
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
  ChevronDown
} from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * @fileOverview مفاعل هندسة القوالب البريدية الاحترافي v5.0
 * محرر نصوص متقدم يسمح بتخصيص كل كتلة نصية بشكل مستقل مع معاينة حية.
 */

export interface EmailBlock {
  id: string;
  type: 'text' | 'button' | 'spacer';
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
      id: Date.now().toString(),
      type,
      content: type === 'text' ? "ادخل النص هنا..." : type === 'button' ? "اضغط هنا" : "",
      style: {
        fontSize: "14px",
        fontWeight: "normal",
        color: type === 'button' ? "#ffffff" : "#445566",
        textAlign: "right",
        italic: false,
        underline: false,
        backgroundColor: type === 'button' ? "#002d4d" : "transparent",
        borderRadius: "12px",
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
    <div className="grid gap-8 lg:grid-cols-12 font-body text-right" dir="rtl">
      
      {/* Editor Controls Column */}
      <div className="lg:col-span-5 space-y-6">
        <Card className="rounded-[40px] border-none shadow-xl bg-white overflow-hidden">
          <CardHeader className="bg-gray-50/80 p-8 border-b border-gray-100 flex flex-row items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-blue-600">
                <Settings2 size={20} />
              </div>
              <CardTitle className="text-base font-black text-[#002d4d]">أدوات التصميم</CardTitle>
            </div>
            <div className="flex items-center gap-2">
               <Button onClick={() => addBlock('text')} size="sm" variant="ghost" className="h-8 rounded-lg bg-blue-50 text-blue-600 font-black text-[9px]">نص +</Button>
               <Button onClick={() => addBlock('button')} size="sm" variant="ghost" className="h-8 rounded-lg bg-orange-50 text-orange-600 font-black text-[9px]">زر +</Button>
            </div>
          </CardHeader>

          <CardContent className="p-8 space-y-8 max-h-[600px] overflow-y-auto scrollbar-none">
            {activeBlock ? (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-2">
                <div className="flex items-center justify-between">
                   <Badge className="bg-[#002d4d] text-white border-none font-black text-[8px] px-3 py-1 rounded-full uppercase">تعديل الكتلة: {activeBlock.type}</Badge>
                   <Button onClick={() => setActiveBlockId(null)} variant="ghost" className="h-8 text-gray-300 font-black text-[9px]">إغلاق التعديل</Button>
                </div>

                <div className="space-y-4">
                  <Label className="text-[10px] font-black text-gray-400 uppercase pr-2 tracking-widest">المحتوى</Label>
                  <Input 
                    value={activeBlock.content} 
                    onChange={e => updateBlock(activeBlock.id, { content: e.target.value })}
                    className="h-12 rounded-xl bg-gray-50 border-none font-bold text-xs shadow-inner"
                  />
                  {activeBlock.type === 'button' && (
                    <div className="pt-2">
                       <Label className="text-[10px] font-black text-gray-400 uppercase pr-2 tracking-widest">رابط التوجيه</Label>
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

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-[9px] font-black text-gray-400 uppercase pr-2">الحجم</Label>
                    <Select value={activeBlock.style.fontSize} onValueChange={v => updateStyle(activeBlock.id, { fontSize: v })}>
                       <SelectTrigger className="h-10 rounded-xl bg-gray-50 border-none font-black text-[10px]"><SelectValue /></SelectTrigger>
                       <SelectContent className="rounded-xl border-none shadow-2xl">
                          {['12px', '14px', '16px', '18px', '20px', '24px', '28px'].map(s => <SelectItem key={s} value={s} className="font-bold text-right">{s}</SelectItem>)}
                       </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[9px] font-black text-gray-400 uppercase pr-2">اللون</Label>
                    <div className="flex items-center gap-2">
                       <Input type="color" value={activeBlock.style.color} onChange={e => updateStyle(activeBlock.id, { color: e.target.value })} className="h-10 w-12 p-1 rounded-xl bg-gray-50 border-none cursor-pointer" />
                       <Input value={activeBlock.style.color} onChange={e => updateStyle(activeBlock.id, { color: e.target.value })} className="h-10 flex-1 rounded-xl bg-gray-50 border-none font-mono text-[10px] text-center" />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                   <Label className="text-[9px] font-black text-gray-400 uppercase pr-2">تنسيق النص</Label>
                   <div className="flex items-center gap-2 p-1 bg-gray-50 rounded-xl border border-gray-100 shadow-inner">
                      <button onClick={() => updateStyle(activeBlock.id, { fontWeight: activeBlock.style.fontWeight === 'bold' ? 'normal' : 'bold' })} className={cn("flex-1 h-9 rounded-lg flex items-center justify-center transition-all", activeBlock.style.fontWeight === 'bold' ? "bg-white text-blue-600 shadow-sm" : "text-gray-400")}><Bold size={14}/></button>
                      <button onClick={() => updateStyle(activeBlock.id, { italic: !activeBlock.style.italic })} className={cn("flex-1 h-9 rounded-lg flex items-center justify-center transition-all", activeBlock.style.italic ? "bg-white text-blue-600 shadow-sm" : "text-gray-400")}><Italic size={14}/></button>
                      <button onClick={() => updateStyle(activeBlock.id, { underline: !activeBlock.style.underline })} className={cn("flex-1 h-9 rounded-lg flex items-center justify-center transition-all", activeBlock.style.underline ? "bg-white text-blue-600 shadow-sm" : "text-gray-400")}><Underline size={14}/></button>
                   </div>
                   <div className="flex items-center gap-2 p-1 bg-gray-50 rounded-xl border border-gray-100 shadow-inner">
                      <button onClick={() => updateStyle(activeBlock.id, { textAlign: 'right' })} className={cn("flex-1 h-9 rounded-lg flex items-center justify-center transition-all", activeBlock.style.textAlign === 'right' ? "bg-white text-blue-600 shadow-sm" : "text-gray-400")}><AlignRight size={14}/></button>
                      <button onClick={() => updateStyle(activeBlock.id, { textAlign: 'center' })} className={cn("flex-1 h-9 rounded-lg flex items-center justify-center transition-all", activeBlock.style.textAlign === 'center' ? "bg-white text-blue-600 shadow-sm" : "text-gray-400")}><AlignCenter size={14}/></button>
                      <button onClick={() => updateStyle(activeBlock.id, { textAlign: 'left' })} className={cn("flex-1 h-9 rounded-lg flex items-center justify-center transition-all", activeBlock.style.textAlign === 'left' ? "bg-white text-blue-600 shadow-sm" : "text-gray-400")}><AlignLeft size={14}/></button>
                   </div>
                </div>

                {activeBlock.type === 'button' && (
                  <div className="space-y-4 pt-4 border-t border-gray-50">
                    <Label className="text-[9px] font-black text-gray-400 uppercase pr-2">خلفية الزر</Label>
                    <div className="flex items-center gap-3">
                       <Input type="color" value={activeBlock.style.backgroundColor} onChange={e => updateStyle(activeBlock.id, { backgroundColor: e.target.value })} className="h-12 w-20 p-1 rounded-xl bg-gray-50 border-none cursor-pointer" />
                       <Input value={activeBlock.style.backgroundColor} onChange={e => updateStyle(activeBlock.id, { backgroundColor: e.target.value })} className="h-12 flex-1 rounded-xl bg-gray-50 border-none font-mono text-[10px] text-center" />
                    </div>
                  </div>
                )}

                <Button onClick={() => removeBlock(activeBlock.id)} variant="ghost" className="w-full h-12 rounded-xl bg-red-50 text-red-500 font-black text-[10px] hover:bg-red-100">حذف هذه الكتلة</Button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="p-8 bg-blue-50/50 rounded-[32px] border-2 border-dashed border-blue-100 text-center space-y-4">
                  <Layout className="h-10 w-10 text-blue-200 mx-auto" />
                  <p className="text-[11px] font-bold text-blue-800/60 leading-relaxed">يرجى إضافة كتل نصية أو أزرار لبناء محتوى الرسالة، ثم اضغط على الكتلة لتخصيصها.</p>
                </div>
                <div className="space-y-3">
                  <Label className="text-[10px] font-black text-gray-400 uppercase pr-4">تذييل الرسالة الموحد</Label>
                  <Input value={footer} onChange={e => onFooterChange(e.target.value)} className="h-12 rounded-xl bg-gray-50 border-none font-bold text-[10px] px-6 shadow-inner" />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Preview Column */}
      <div className="lg:col-span-7">
        <Card className="rounded-[48px] border-none shadow-2xl bg-gray-50 overflow-hidden flex flex-col min-h-[600px] border border-gray-100">
          <CardHeader className="bg-white p-6 border-b border-gray-100 flex flex-row items-center justify-between shrink-0">
             <div className="flex items-center gap-3">
                <Sparkles className="h-4 w-4 text-[#f9a885] animate-pulse" />
                <span className="text-[10px] font-black text-[#002d4d] uppercase tracking-widest">Live Visual Preview</span>
             </div>
             <div className="flex gap-2">
                {[...Array(3)].map((_, i) => <div key={i} className="h-1.5 w-1.5 rounded-full bg-gray-200" />)}
             </div>
          </CardHeader>
          <div className="flex-1 p-10 overflow-y-auto scrollbar-none bg-white/40">
             <div className="max-w-[500px] mx-auto bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden p-10 space-y-8 flex flex-col">
                <div className="text-center mb-10">
                   <h1 className="text-2xl font-black text-[#002d4d]">Namix</h1>
                </div>

                <div className="space-y-6 flex flex-col">
                   {blocks.map((block) => (
                     <div key={block.id} className="relative group">
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
                             padding: '12px 32px',
                             borderRadius: block.style.borderRadius,
                             fontSize: block.style.fontSize,
                             fontWeight: block.style.fontWeight,
                             display: 'inline-block',
                             cursor: 'pointer'
                           }}>
                             {block.content}
                           </span>
                         </div>
                       )}
                       <button 
                         onClick={() => setActiveBlockId(block.id)}
                         className={cn(
                           "absolute -right-6 top-0 h-4 w-4 rounded-full bg-blue-500 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all",
                           activeBlockId === block.id && "opacity-100 scale-125"
                         )}
                       >
                         <Settings2 size={8} />
                       </button>
                     </div>
                   ))}
                </div>

                <div className="mt-20 pt-10 border-t border-gray-100 text-center">
                   <p className="text-[10px] text-gray-400 font-bold leading-relaxed">{footer}</p>
                   <p className="text-[8px] text-gray-300 font-black uppercase mt-4 tracking-widest">© 2024 Namix Universal Network</p>
                </div>
             </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
