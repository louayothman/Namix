
"use client";

import { useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Bold, 
  Italic, 
  Underline, 
  AlignRight, 
  AlignCenter, 
  AlignLeft,
  Plus,
  Trash2,
  Link as LinkIcon,
  Palette,
  Sparkles,
  MousePointer2,
  GripVertical,
  Type as TypeIcon,
  Heading1,
  Type
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Reorder, motion, AnimatePresence } from "framer-motion";

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
  headerTitle: string;
  onHeaderTitleChange: (val: string) => void;
  blocks: EmailBlock[];
  onChange: (blocks: EmailBlock[]) => void;
  footer: string;
  onFooterChange: (val: string) => void;
}

export function EmailTemplateForge({ 
  headerTitle, 
  onHeaderTitleChange, 
  blocks, 
  onChange, 
  footer, 
  onFooterChange 
}: EmailTemplateForgeProps) {
  const [activeBlockId, setActiveBlockId] = useState<string | null>(null);

  const addBlock = (type: EmailBlock['type']) => {
    const newBlock: EmailBlock = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      content: type === 'text' ? "ابدأ بكتابة محتوى الرسالة هنا..." : "اضغط للتوجيه",
      style: {
        fontSize: "3", 
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

  const handleLink = () => {
    const url = prompt("أدخل الرابط (URL):", "https://");
    if (url) execCommand('createLink', url);
  };

  return (
    <div className="w-full space-y-10 font-body text-right select-none" dir="rtl">
      
      {/* TACTICAL TOOLBAR */}
      <Card className="rounded-[32px] border-none shadow-2xl bg-white/90 backdrop-blur-xl sticky top-24 z-[150] border border-gray-100 p-2 max-w-4xl mx-auto">
         <div className="flex flex-wrap items-center justify-between gap-4 px-4 py-2">
            
            <div className="flex items-center gap-1 p-1 bg-gray-50 rounded-2xl border border-gray-100 shadow-inner">
               <button onClick={() => execCommand('bold')} className="h-9 w-9 rounded-xl flex items-center justify-center text-[#002d4d] hover:bg-white hover:shadow-sm transition-all active:scale-90" title="عريض"><Bold size={16}/></button>
               <button onClick={() => execCommand('italic')} className="h-9 w-9 rounded-xl flex items-center justify-center text-[#002d4d] hover:bg-white hover:shadow-sm transition-all active:scale-90" title="مائل"><Italic size={16}/></button>
               <button onClick={() => execCommand('underline')} className="h-9 w-9 rounded-xl flex items-center justify-center text-[#002d4d] hover:bg-white hover:shadow-sm transition-all active:scale-90" title="تسطير"><Underline size={16}/></button>
            </div>

            <div className="h-6 w-px bg-gray-200 hidden md:block" />

            <div className="flex items-center gap-1 p-1 bg-gray-50 rounded-2xl border border-gray-100 shadow-inner">
               <button onClick={() => execCommand('justifyRight')} className="h-9 w-9 rounded-xl flex items-center justify-center text-[#002d4d] hover:bg-white hover:shadow-sm transition-all" title="يمين"><AlignRight size={16}/></button>
               <button onClick={() => execCommand('justifyCenter')} className="h-9 w-9 rounded-xl flex items-center justify-center text-[#002d4d] hover:bg-white hover:shadow-sm transition-all" title="وسط"><AlignCenter size={16}/></button>
               <button onClick={() => execCommand('justifyLeft')} className="h-9 w-9 rounded-xl flex items-center justify-center text-[#002d4d] hover:bg-white hover:shadow-sm transition-all" title="يسار"><AlignLeft size={16}/></button>
            </div>

            <div className="h-6 w-px bg-gray-200 hidden md:block" />

            <div className="flex items-center gap-4">
               <div className="flex items-center gap-2">
                  <TypeIcon size={14} className="text-gray-400" />
                  <Select onValueChange={(v) => execCommand('fontSize', v)}>
                    <SelectTrigger className="h-9 w-24 rounded-xl bg-gray-50 border-none font-black text-[9px] shadow-inner">
                      <SelectValue placeholder="حجم الخط" />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-none shadow-2xl">
                      {[
                        {v: '1', l: 'صغير جداً'},
                        {v: '2', l: 'صغير'},
                        {v: '3', l: 'عادي'},
                        {v: '4', l: 'متوسط'},
                        {v: '5', l: 'كبير'},
                        {v: '6', l: 'ضخم'},
                        {v: '7', l: 'عملاق'}
                      ].map(opt => (
                        <SelectItem key={opt.v} value={opt.v} className="font-bold text-right py-2">{opt.l}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
               </div>
               
               <div className="flex items-center gap-2" title="لون النص">
                  <Palette size={14} className="text-gray-400" />
                  <input 
                    type="color" 
                    onChange={(e) => execCommand('foreColor', e.target.value)}
                    className="h-8 w-8 rounded-lg bg-gray-100 border-none cursor-pointer p-0.5 shadow-sm" 
                  />
               </div>

               <button onClick={handleLink} className="h-9 w-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100 transition-all shadow-sm" title="إضافة رابط">
                  <LinkIcon size={16} />
               </button>
            </div>

            <div className="flex items-center gap-2 mr-auto">
               <Button onClick={() => addBlock('text')} size="sm" variant="ghost" className="h-10 rounded-xl bg-[#002d4d] text-white font-black text-[10px] px-6 shadow-xl active:scale-95 transition-all">
                  إضافة فقرة +
               </Button>
               <Button onClick={() => addBlock('button')} size="sm" variant="ghost" className="h-10 rounded-xl bg-orange-50 text-orange-600 font-black text-[10px] px-6 border border-orange-100 shadow-sm active:scale-95 transition-all">
                  إضافة زر +
               </Button>
            </div>
         </div>
      </Card>

      {/* THE SOVEREIGN CANVAS */}
      <div className="flex justify-center w-full px-4 py-10 bg-gray-100/40 rounded-[64px] border border-gray-100 shadow-inner min-h-[900px]">
         <div className="w-full max-w-[650px] bg-white rounded-[56px] shadow-[0_40px_100px_-20px_rgba(0,45,77,0.12)] border border-gray-100 overflow-hidden flex flex-col p-12 md:p-20 space-y-12 relative animate-in fade-in zoom-in-95 duration-1000">
            
            <div className="absolute top-0 right-0 p-8 opacity-[0.02] -rotate-12 pointer-events-none"><Sparkles size={200} /></div>

            {/* Editable Header Title */}
            <div className="text-center mb-16 relative z-10">
               <h1 
                 contentEditable
                 suppressContentEditableWarning
                 onBlur={(e) => onHeaderTitleChange(e.currentTarget.innerText)}
                 className="text-4xl font-black text-[#002d4d] tracking-tighter italic outline-none hover:text-blue-500 transition-colors focus:text-blue-600 cursor-text"
               >
                 {headerTitle}
               </h1>
            </div>

            {/* Main Content Area */}
            <Reorder.Group axis="y" values={blocks} onReorder={onChange} className="space-y-6 flex-1 relative z-10">
               <AnimatePresence initial={false}>
                  {blocks.map((block) => (
                    <Reorder.Item 
                      key={block.id} 
                      value={block}
                      className={cn(
                        "relative group cursor-default rounded-3xl p-2 transition-all duration-500",
                        activeBlockId === block.id ? "bg-blue-50/20 ring-1 ring-blue-100/50" : "hover:bg-gray-50/40"
                      )}
                      onDragStart={() => setActiveBlockId(block.id)}
                    >
                      <div className="absolute right-[-50px] top-1/2 -translate-y-1/2 h-10 w-10 flex items-center justify-center text-gray-200 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing">
                         <GripVertical size={20} />
                      </div>

                      <div className="absolute left-[-20px] top-0 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all">
                         <button onClick={() => removeBlock(block.id)} className="h-8 w-8 rounded-xl bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100 shadow-sm transition-all"><Trash2 size={14}/></button>
                      </div>

                      {block.type === 'text' ? (
                        <div 
                          contentEditable
                          suppressContentEditableWarning
                          onBlur={(e) => updateBlock(block.id, { content: e.currentTarget.innerHTML })}
                          onFocus={() => setActiveBlockId(block.id)}
                          style={{
                            textAlign: block.style.textAlign,
                            lineHeight: '2.2',
                            minHeight: '2em',
                            outline: 'none'
                          }}
                          className="font-bold text-gray-600 text-right whitespace-pre-wrap px-4 py-2 cursor-text focus:ring-0"
                          dangerouslySetInnerHTML={{ __html: block.content }}
                        />
                      ) : (
                        <div className={cn("py-8 w-full flex", 
                          block.style.textAlign === 'center' ? 'justify-center' : 
                          block.style.textAlign === 'left' ? 'justify-start' : 'justify-end'
                        )}>
                           <div className="flex flex-col gap-4 max-w-xs w-full">
                              <div className="relative group/btn-inner">
                                 <span 
                                   contentEditable
                                   suppressContentEditableWarning
                                   onBlur={(e) => updateBlock(block.id, { content: e.currentTarget.innerText })}
                                   onFocus={() => setActiveBlockId(block.id)}
                                   style={{
                                     backgroundColor: block.style.backgroundColor,
                                     color: block.style.color,
                                     padding: '16px 48px',
                                     borderRadius: '28px',
                                     fontSize: '14px',
                                     fontWeight: 900,
                                     display: 'inline-block',
                                     boxShadow: '0 15px 35px rgba(0,45,77,0.15)',
                                     outline: 'none',
                                     cursor: 'text'
                                   }}
                                   className="text-center whitespace-nowrap min-w-[200px]"
                                 >
                                   {block.content}
                                 </span>
                              </div>
                              
                              {activeBlockId === block.id && (
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-gray-50 rounded-[28px] border border-gray-100 space-y-4 shadow-inner">
                                   <div className="space-y-1.5">
                                      <Label className="text-[8px] font-black text-gray-400 uppercase tracking-widest pr-2">رابط التوجيه (Action URL)</Label>
                                      <div className="relative">
                                         <Input 
                                           value={block.style.link || ""} 
                                           onChange={e => updateBlock(block.id, { style: { ...block.style, link: e.target.value } })}
                                           className="h-10 rounded-xl bg-white border-none font-mono text-[9px] shadow-sm text-left pr-10" 
                                           dir="ltr"
                                           placeholder="https://namix.pro/..."
                                         />
                                         <LinkIcon size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-200" />
                                      </div>
                                   </div>
                                   <div className="flex items-center justify-between px-2">
                                      <Label className="text-[8px] font-black text-gray-400 uppercase">خلفية الزر</Label>
                                      <input 
                                        type="color" 
                                        value={block.style.backgroundColor} 
                                        onChange={e => updateBlock(block.id, { style: { ...block.style, backgroundColor: e.target.value } })}
                                        className="h-7 w-7 rounded-lg bg-transparent border-none cursor-pointer p-0" 
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

            <div className="mt-24 pt-12 border-t border-gray-50 text-center relative z-10 group/footer">
               <div 
                 contentEditable
                 suppressContentEditableWarning
                 onBlur={(e) => onFooterChange(e.currentTarget.innerText)}
                 className="text-[11px] text-gray-400 font-bold leading-relaxed px-12 outline-none focus:text-blue-500 transition-colors cursor-text"
               >
                 {footer}
               </div>
               <div className="mt-10 flex flex-col items-center gap-3 opacity-20 group-hover/footer:opacity-50 transition-opacity">
                  <div className="h-px w-10 bg-gray-300" />
                  <p className="text-[9px] font-black uppercase tracking-[0.5em]">© 2024 Namix Universal Network</p>
               </div>
            </div>

            <div className="absolute bottom-6 right-1/2 translate-x-1/2 flex items-center gap-4 opacity-5 select-none pointer-events-none">
               <div className="h-[0.5px] w-12 bg-[#002d4d]" />
               <div className="flex items-center gap-3">
                  <MousePointer2 size={16} />
                  <span className="text-[10px] font-black uppercase tracking-[0.5em]">Tactical Canvas v5.0</span>
               </div>
               <div className="h-[0.5px] w-12 bg-[#002d4d]" />
            </div>
         </div>
      </div>
      
      <div className="flex flex-col items-center gap-4 py-8 opacity-20 select-none">
         <p className="text-[10px] font-black text-[#002d4d] uppercase tracking-[0.8em]">Namix Sovereign Design Hub</p>
         <div className="flex gap-2">
            {[...Array(3)].map((_, i) => (<div key={i} className="h-1.5 w-1.5 rounded-full bg-gray-300" />))}
         </div>
      </div>
    </div>
  );
}
