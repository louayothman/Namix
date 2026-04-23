
"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Plus, 
  Trash2, 
  GripVertical, 
  Type, 
  Image as ImageIcon, 
  Square, 
  Minus, 
  Layout, 
  Settings2,
  ChevronUp,
  ChevronDown,
  Palette,
  AlignRight,
  AlignCenter,
  AlignLeft,
  Link as LinkIcon,
  Variable
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Reorder, motion, AnimatePresence } from "framer-motion";
import { VariablePicker } from "./VariablePicker";

/**
 * @fileOverview محرك بناء الكتل البريدية v1.0
 * يدير إضافة وتعديل وترتيب كتل البريد الإلكتروني مع دعم حقن المتغيرات.
 */

export type BlockType = 'header' | 'hero' | 'text' | 'button' | 'divider' | 'footer';

export interface EmailBlock {
  id: string;
  type: BlockType;
  content: any;
}

interface EmailBlockBuilderProps {
  blocks: EmailBlock[];
  onChange: (blocks: EmailBlock[]) => void;
  previewMode: 'desktop' | 'mobile';
}

export function EmailBlockBuilder({ blocks, onChange, previewMode }: EmailBlockBuilderProps) {
  const [activeBlockId, setActiveBlockId] = useState<string | null>(null);

  const addBlock = (type: BlockType) => {
    const newBlock: EmailBlock = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      content: getInitialContent(type)
    };
    onChange([...blocks, newBlock]);
    setActiveBlockId(newBlock.id);
  };

  const getInitialContent = (type: BlockType) => {
    switch(type) {
      case 'header': return { title: 'Namix', fontSize: '24px', color: '#002d4d' };
      case 'hero': return { imageUrl: 'https://picsum.photos/seed/1/600/300', alt: 'Hero Image' };
      case 'text': return { text: 'مرحباً {{NAME}}، يسعدنا انضمامك إلينا...', fontSize: '14px', color: '#445566', align: 'right' };
      case 'button': return { label: 'فتح المحفظة', link: 'https://namix.pro', bgColor: '#002d4d', color: '#ffffff', align: 'center' };
      case 'divider': return { color: '#f1f5f9', thickness: '1px' };
      case 'footer': return { text: 'جميع الحقوق محفوظة © 2024 ناميكس', fontSize: '10px', color: '#94a3b8' };
    }
  };

  const updateBlockContent = (id: string, updates: any) => {
    onChange(blocks.map(b => b.id === id ? { ...b, content: { ...b.content, ...updates } } : b));
  };

  const removeBlock = (id: string) => {
    onChange(blocks.filter(b => b.id !== id));
    if (activeBlockId === id) setActiveBlockId(null);
  };

  return (
    <div className="space-y-10 font-body text-right" dir="rtl">
      
      {/* Block Palette */}
      <div className="flex flex-wrap items-center gap-3 p-2 bg-gray-100 rounded-3xl border border-gray-200">
         {[
           { type: 'header', label: 'ترويسة', icon: Layout },
           { type: 'hero', label: 'صورة غلاف', icon: ImageIcon },
           { type: 'text', label: 'فقرة نصية', icon: Type },
           { type: 'button', label: 'زر إجراء', icon: Square },
           { type: 'divider', label: 'فاصل', icon: Minus },
           { type: 'footer', label: 'تذييل', icon: Settings2 },
         ].map((item) => (
           <Button 
             key={item.type}
             onClick={() => addBlock(item.type as BlockType)}
             variant="ghost"
             className="h-10 px-4 rounded-xl bg-white border border-gray-200 text-[#002d4d] font-black text-[10px] gap-2 hover:bg-[#002d4d] hover:text-white transition-all shadow-sm"
           >
              <item.icon size={14} />
              {item.label}
           </Button>
         ))}
      </div>

      {/* Editor Canvas Area */}
      <div className="flex justify-center w-full py-10 bg-gray-50 rounded-[64px] border border-gray-100 shadow-inner">
         <div className={cn(
           "bg-white rounded-[40px] shadow-2xl transition-all duration-700 overflow-hidden flex flex-col",
           previewMode === 'desktop' ? "w-full max-w-[650px]" : "w-[360px]"
         )}>
            <Reorder.Group axis="y" values={blocks} onReorder={onChange} className="flex-1 divide-y divide-gray-50">
               {blocks.map((block) => (
                 <Reorder.Item 
                   key={block.id} 
                   value={block}
                   className={cn(
                     "relative group transition-all",
                     activeBlockId === block.id ? "bg-blue-50/20" : "hover:bg-gray-50/30"
                   )}
                 >
                    {/* Control Handles */}
                    <div className="absolute right-2 top-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-50">
                       <button className="h-7 w-7 rounded-lg bg-white border border-gray-100 shadow-sm flex items-center justify-center text-gray-300 cursor-grab active:cursor-grabbing"><GripVertical size={12}/></button>
                       <button onClick={() => removeBlock(block.id)} className="h-7 w-7 rounded-lg bg-white border border-gray-100 shadow-sm flex items-center justify-center text-red-400 hover:bg-red-50"><Trash2 size={12}/></button>
                       <button onClick={() => setActiveBlockId(activeBlockId === block.id ? null : block.id)} className="h-7 w-7 rounded-lg bg-white border border-gray-100 shadow-sm flex items-center justify-center text-blue-500 hover:bg-blue-50"><Settings2 size={12}/></button>
                    </div>

                    {/* Block View Rendering */}
                    <div className="p-6">
                       <BlockView block={block} />
                    </div>

                    {/* Block Settings Overlay */}
                    <AnimatePresence>
                       {activeBlockId === block.id && (
                         <motion.div 
                           initial={{ height: 0, opacity: 0 }} 
                           animate={{ height: 'auto', opacity: 1 }} 
                           exit={{ height: 0, opacity: 0 }}
                           className="bg-gray-50 border-t border-gray-100 p-6 space-y-6 overflow-hidden"
                         >
                            <BlockSettings block={block} update={updateBlockContent} />
                         </motion.div>
                       )}
                    </AnimatePresence>
                 </Reorder.Item>
               ))}
            </Reorder.Group>
            
            {blocks.length === 0 && (
              <div className="py-32 text-center opacity-20 flex flex-col items-center gap-4">
                 <Layout size={64} />
                 <p className="text-xs font-black uppercase">اسحب الكتل لبدء بناء الرسالة</p>
              </div>
            )}
         </div>
      </div>
    </div>
  );
}

function BlockView({ block }: { block: EmailBlock }) {
  const { type, content } = block;
  
  switch(type) {
    case 'header':
      return (
        <div className="text-center py-4">
           <h1 style={{ color: content.color, fontSize: content.fontSize }} className="font-black italic tracking-tighter">
             {content.title}
           </h1>
        </div>
      );
    case 'hero':
      return (
        <div className="rounded-2xl overflow-hidden border border-gray-100">
           <img src={content.imageUrl} alt={content.alt} className="w-full h-auto object-cover" />
        </div>
      );
    case 'text':
      return (
        <div 
          style={{ color: content.color, fontSize: content.fontSize, textAlign: content.align as any }}
          className="font-bold leading-[2] whitespace-pre-wrap"
        >
           {content.text}
        </div>
      );
    case 'button':
      return (
        <div className={cn("py-6 flex", content.align === 'center' ? 'justify-center' : content.align === 'left' ? 'justify-start' : 'justify-end')}>
           <div 
             style={{ backgroundColor: content.bgColor, color: content.color }}
             className="px-10 py-3.5 rounded-full font-black text-sm shadow-xl"
           >
              {content.label}
           </div>
        </div>
      );
    case 'divider':
      return (
        <div className="py-4">
           <div style={{ backgroundColor: content.color, height: content.thickness }} className="w-full rounded-full" />
        </div>
      );
    case 'footer':
      return (
        <div className="pt-8 border-t border-gray-50 text-center">
           <p style={{ color: content.color, fontSize: content.fontSize }} className="font-bold">
              {content.text}
           </p>
        </div>
      );
    default: return null;
  }
}

function BlockSettings({ block, update }: { block: EmailBlock, update: (id: string, updates: any) => void }) {
  const { type, content } = block;

  return (
    <div className="grid gap-6 md:grid-cols-2 text-right">
       {type === 'text' && (
         <>
            <div className="space-y-3 md:col-span-2">
               <div className="flex items-center justify-between px-2">
                  <Label className="text-[9px] font-black text-gray-400 uppercase">المحتوى النصي</Label>
                  <VariablePicker onSelect={(v) => update(block.id, { text: content.text + v })} />
               </div>
               <textarea 
                 value={content.text} 
                 onChange={e => update(block.id, { text: e.target.value })}
                 className="w-full h-32 rounded-2xl bg-white border-none p-5 font-bold text-xs leading-loose shadow-sm"
               />
            </div>
            <div className="space-y-3">
               <Label className="text-[9px] font-black text-gray-400 uppercase pr-2">حجم الخط</Label>
               <input type="text" value={content.fontSize} onChange={e => update(block.id, { fontSize: e.target.value })} className="h-10 w-full rounded-xl bg-white border-none text-center font-black text-xs" />
            </div>
            <div className="space-y-3">
               <Label className="text-[9px] font-black text-gray-400 uppercase pr-2">لون النص</Label>
               <div className="flex items-center gap-3 bg-white p-2 rounded-xl">
                  <input type="color" value={content.color} onChange={e => update(block.id, { color: e.target.value })} className="h-6 w-full bg-transparent border-none cursor-pointer" />
               </div>
            </div>
         </>
       )}

       {type === 'button' && (
         <>
            <div className="space-y-3">
               <Label className="text-[9px] font-black text-gray-400 uppercase pr-2">تسمية الزر</Label>
               <input value={content.label} onChange={e => update(block.id, { label: e.target.value })} className="h-10 w-full rounded-xl bg-white border-none px-4 font-black text-xs" />
            </div>
            <div className="space-y-3">
               <Label className="text-[9px] font-black text-gray-400 uppercase pr-2">رابط التوجيه</Label>
               <input value={content.link} onChange={e => update(block.id, { link: e.target.value })} className="h-10 w-full rounded-xl bg-white border-none px-4 font-mono text-[9px] text-left" dir="ltr" />
            </div>
            <div className="space-y-3">
               <Label className="text-[9px] font-black text-gray-400 uppercase pr-2">لون الخلفية</Label>
               <input type="color" value={content.bgColor} onChange={e => update(block.id, { bgColor: e.target.value })} className="h-10 w-full rounded-xl bg-white border-none p-1" />
            </div>
            <div className="space-y-3">
               <Label className="text-[9px] font-black text-gray-400 uppercase pr-2">لون النص</Label>
               <input type="color" value={content.color} onChange={e => update(block.id, { color: e.target.value })} className="h-10 w-full rounded-xl bg-white border-none p-1" />
            </div>
         </>
       )}

       {type === 'hero' && (
         <div className="md:col-span-2 space-y-3">
            <Label className="text-[9px] font-black text-gray-400 uppercase pr-2">رابط الصورة (URL)</Label>
            <input value={content.imageUrl} onChange={e => update(block.id, { imageUrl: e.target.value })} className="h-10 w-full rounded-xl bg-white border-none px-4 font-mono text-[9px] text-left" dir="ltr" />
         </div>
       )}

       {type === 'header' && (
         <div className="md:col-span-2 grid grid-cols-2 gap-4">
            <div className="space-y-3">
               <Label className="text-[9px] font-black text-gray-400 uppercase pr-2">اسم المنصة</Label>
               <input value={content.title} onChange={e => update(block.id, { title: e.target.value })} className="h-10 w-full rounded-xl bg-white border-none px-4 font-black text-xs" />
            </div>
            <div className="space-y-3">
               <Label className="text-[9px] font-black text-gray-400 uppercase pr-2">اللون</Label>
               <input type="color" value={content.color} onChange={e => update(block.id, { color: e.target.value })} className="h-10 w-full rounded-xl bg-white border-none p-1" />
            </div>
         </div>
       )}
    </div>
  );
}
