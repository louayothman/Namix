
"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Bold, 
  Italic, 
  Underline, 
  AlignRight, 
  AlignCenter, 
  AlignLeft,
  Plus,
  Trash2,
  Layout,
  GripVertical,
  Type,
  Link as LinkIcon,
  Palette,
  Sparkles,
  Settings2,
  MousePointer2,
  Save
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
    color: string;
    textAlign: 'right' | 'center' | 'left';
    backgroundColor?: string;
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
      content: type === 'text' ? "اكتب محتوى الرسالة هنا..." : "زر تفاعلي جديد",
      style: {
        fontSize: "16px",
        color: type === 'button' ? "#ffffff" : "#445566",
        textAlign: "right",
        backgroundColor: type === 'button' ? "#002d4d" : "transparent",
        link: ""
      }
    };
    onChange([...blocks, newBlock]);
    setActiveBlockId(newBlock.id);
  };

  const updateBlock = (id: string, updates: Partial<EmailBlock>) => {
    onChange(blocks.map(b => b.id === id ? { ...b, ...updates } : b));
  };

  const removeBlock = (id: string) => {
    onChange(blocks.filter(b => b.id !== id));
    if (activeBlockId === id) setActiveBlockId(null);
  };

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
  };

  return (
    <div className="w-full space-y-10 font-body text-right" dir="rtl">
      
      {/* 1. TACTICAL TOOLBAR - المحرك المركزي للتنسيق */}
      <Card className="rounded-[32px] border-none shadow-xl bg-white/90 backdrop-blur-xl sticky top-24 z-[100] border border-gray-100 p-2">
         <div className="flex flex-wrap items-center justify-between gap-4 px-4 py-2">
            <div className="flex items-center gap-1.5 p-1 bg-gray-50 rounded-2xl border border-gray-100">
               <button onClick={() => execCommand('bold')} className="h-9 w-9 rounded-xl flex items-center justify-center text-[#002d4d] hover:bg-white hover:shadow-sm transition-all"><Bold size={16}/></button>
               <button onClick={() => execCommand('italic')} className="h-9 w-9 rounded-xl flex items-center justify-center text-[#002d4d] hover:bg-white hover:shadow-sm transition-all"><Italic size={16}/></button>
               <button onClick={() => execCommand('underline')} className="h-9 w-9 rounded-xl flex items-center justify-center text-[#002d4d] hover:bg-white hover:shadow-sm transition-all"><Underline size={16}/></button>
            </div>

            <div className="h-6 w-px bg-gray-200 hidden md:block" />

            <div className="flex items-center gap-3">
               <div className="flex items-center gap-2">
                  <Type size={14} className="text-gray-400" />
                  <Select onValueChange={(v) => execCommand('fontSize', v)}>
                    <SelectTrigger className="h-9 w-24 rounded-xl bg-gray-50 border-none font-black text-[10px]">
                      <SelectValue placeholder="حجم الخط" />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-none shadow-2xl">
                      {['1', '2', '3', '4', '5', '6', '7'].map(v => (
                        <SelectItem key={v} value={v} className="font-bold text-right">المستوى {v}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
               </div>
               
               <div className="flex items-center gap-2">
                  <Palette size={14} className="text-gray-400" />
                  <input 
                    type="color" 
                    onChange={(e) => execCommand('foreColor', e.target.value)}
                    className="h-8 w-8 rounded-lg bg-gray-50 border-none cursor-pointer p-0.5" 
                  />
               </div>
            </div>

            <div className="h-6 w-px bg-gray-200 hidden md:block" />

            <div className="flex items-center gap-1.5 p-1 bg-gray-50 rounded-2xl border border-gray-100">
               <button onClick={() => execCommand('justifyRight')} className="h-9 w-9 rounded-xl flex items-center justify-center text-[#002d4d] hover:bg-white hover:shadow-sm transition-all"><AlignRight size={16}/></button>
               <button onClick={() => execCommand('justifyCenter')} className="h-9 w-9 rounded-xl flex items-center justify-center text-[#002d4d] hover:bg-white hover:shadow-sm transition-all"><AlignCenter size={16}/></button>
               <button onClick={() => execCommand('justifyLeft')} className="h-9 w-9 rounded-xl flex items-center justify-center text-[#002d4d] hover:bg-white hover:shadow-sm transition-all"><AlignLeft size={16}/></button>
            </div>

            <div className="flex items-center gap-2 mr-auto">
               <Button onClick={() => addBlock('text')} size="sm" variant="ghost" className="h-10 rounded-xl bg-blue-50 text-blue-600 font-black text-[10px] px-6 border border-blue-100 shadow-sm active:scale-95 transition-all">نص +</Button>
               <Button onClick={() => addBlock('button')} size="sm" variant="ghost" className="h-10 rounded-xl bg-orange-50 text-orange-600 font-black text-[10px] px-6 border border-orange-100 shadow-sm active:scale-95 transition-all">زر +</Button>
            </div>
         </div>
      </Card>

      {/* 2. THE SOVEREIGN PAPER - مساحة التحرير البصري المباشر */}
      <div className="flex justify-center w-full px-4 py-10 bg-gray-100/50 rounded-[64px] border border-gray-100 shadow-inner min-h-[800px]">
         <div className="w-full max-w-[600px] bg-white rounded-[48px] shadow-2xl border border-gray-100 overflow-hidden flex flex-col p-12 md:p-16 space-y-12 relative animate-in fade-in zoom-in-95 duration-1000">
            
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] -rotate-12 pointer-events-none"><Sparkles size={160} /></div>

            {/* Email Header Brand */}
            <div className="text-center mb-12 relative z-10">
               <h1 className="text-4xl font-black text-[#002d4d] tracking-tighter italic">Namix</h1>
            </div>

            {/* Blocks Area with Reorder (Drag & Drop) */}
            <Reorder.Group axis="y" values={blocks} onReorder={onChange} className="space-y-6 flex-1 relative z-10">
               <AnimatePresence initial={false}>
                  {blocks.map((block) => (
                    <Reorder.Item 
                      key={block.id} 
                      value={block}
                      className={cn(
                        "relative group cursor-default rounded-3xl p-4 transition-all duration-500",
                        activeBlockId === block.id ? "bg-blue-50/20 ring-1 ring-blue-100/50" : "hover:bg-gray-50/40"
                      )}
                      onDragStart={() => setActiveBlockId(block.id)}
                    >
                      {/* Drag Handle */}
                      <div className="absolute right-[-45px] top-1/2 -translate-y-1/2 h-10 w-10 flex items-center justify-center text-gray-200 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing">
                         <GripVertical size={20} />
                      </div>

                      {/* Block Controls - Floating Label */}
                      <div className="absolute left-4 top-2 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                         <Badge className="bg-[#002d4d] text-white border-none font-black text-[6px] px-2 py-0.5 rounded-md">{block.type.toUpperCase()}</Badge>
                         <button onClick={() => removeBlock(block.id)} className="h-7 w-7 rounded-lg bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100 shadow-sm transition-all"><Trash2 size={12}/></button>
                      </div>

                      {/* Content Area */}
                      {block.type === 'text' ? (
                        <div 
                          contentEditable
                          suppressContentEditableWarning
                          onBlur={(e) => updateBlock(block.id, { content: e.currentTarget.innerHTML })}
                          onFocus={() => setActiveBlockId(block.id)}
                          style={{
                            fontSize: block.style.fontSize,
                            color: block.style.color,
                            textAlign: block.style.textAlign,
                            lineHeight: '2',
                            minHeight: '1.5em',
                            outline: 'none'
                          }}
                          className="font-bold text-gray-600 text-right whitespace-pre-wrap px-4 py-2"
                          dangerouslySetInnerHTML={{ __html: block.content }}
                        />
                      ) : (
                        <div className={cn("py-6 w-full flex", 
                          block.style.textAlign === 'center' ? 'justify-center' : 
                          block.style.textAlign === 'left' ? 'justify-start' : 'justify-end'
                        )}>
                           <div className="flex flex-col gap-4 max-w-xs">
                              <span 
                                contentEditable
                                suppressContentEditableWarning
                                onBlur={(e) => updateBlock(block.id, { content: e.currentTarget.innerText })}
                                onFocus={() => setActiveBlockId(block.id)}
                                style={{
                                  backgroundColor: block.style.backgroundColor,
                                  color: block.style.color,
                                  padding: '14px 44px',
                                  borderRadius: '24px',
                                  fontSize: '14px',
                                  fontWeight: 900,
                                  display: 'inline-block',
                                  boxShadow: '0 15px 35px rgba(0,45,77,0.15)',
                                  outline: 'none',
                                  cursor: 'text'
                                }}
                                className="text-center whitespace-nowrap min-w-[180px]"
                              >
                                {block.content}
                              </span>
                              
                              {activeBlockId === block.id && (
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-3 bg-gray-50 rounded-2xl border border-gray-100 space-y-3">
                                   <div className="space-y-1">
                                      <Label className="text-[8px] font-black text-gray-400 uppercase tracking-widest pr-2">رابط الزر</Label>
                                      <div className="relative">
                                         <Input 
                                           value={block.style.link || ""} 
                                           onChange={e => updateBlock(block.id, { style: { ...block.style, link: e.target.value } })}
                                           className="h-8 rounded-lg bg-white border-none font-mono text-[9px] shadow-inner text-left" 
                                           dir="ltr"
                                           placeholder="https://..."
                                         />
                                         <LinkIcon size={10} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-300" />
                                      </div>
                                   </div>
                                   <div className="flex items-center justify-between px-1">
                                      <Label className="text-[8px] font-black text-gray-400 uppercase">خلفية الزر</Label>
                                      <input 
                                        type="color" 
                                        value={block.style.backgroundColor} 
                                        onChange={e => updateBlock(block.id, { style: { ...block.style, backgroundColor: e.target.value } })}
                                        className="h-6 w-6 rounded-md bg-transparent border-none cursor-pointer" 
                                      />
                                   </div>
                                </motion.div>
                              )}
                           </div>
                        </div>
                      )}
                    </Reorder.Item>
                  ))}
               </AnimatePresence>
            </Reorder.Group>

            {/* Footer Management */}
            <div className="mt-20 pt-10 border-t border-gray-50 text-center relative z-10 group/footer">
               <div 
                 contentEditable
                 suppressContentEditableWarning
                 onBlur={(e) => onFooterChange(e.currentTarget.innerText)}
                 className="text-[11px] text-gray-400 font-bold leading-relaxed px-10 outline-none focus:text-blue-500 transition-colors"
               >
                 {footer}
               </div>
               <div className="mt-8 flex flex-col items-center gap-2 opacity-30 group-hover/footer:opacity-60 transition-opacity">
                  <div className="h-px w-8 bg-gray-300" />
                  <p className="text-[9px] font-black uppercase tracking-[0.4em]">© 2024 Namix Universal Network</p>
               </div>
            </div>

            {/* Drag Hint */}
            <div className="absolute bottom-4 right-1/2 translate-x-1/2 flex items-center gap-3 opacity-10 select-none">
               <div className="h-[0.5px] w-8 bg-[#002d4d]" />
               <div className="flex items-center gap-2">
                  <MousePointer2 size={12} />
                  <span className="text-[8px] font-black uppercase tracking-widest">Interactive Canvas v2.5</span>
               </div>
               <div className="h-[0.5px] w-8 bg-[#002d4d]" />
            </div>
         </div>
      </div>
      
      {/* Save Reminder */}
      <div className="flex flex-col items-center gap-4 py-6 opacity-30 select-none">
         <p className="text-[10px] font-black text-[#002d4d] uppercase tracking-[0.8em]">Namix Sovereign Editor Node</p>
         <div className="flex gap-2">
            {[...Array(3)].map((_, i) => (<div key={i} className="h-1.5 w-1.5 rounded-full bg-gray-300" />))}
         </div>
      </div>
    </div>
  );
}

