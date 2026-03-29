
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Layout, 
  Sparkles, 
  Loader2, 
  Save, 
  Type, 
  Plus, 
  Trash2, 
  Link as LinkIcon, 
  Facebook, 
  Instagram, 
  Twitter, 
  Send, 
  Linkedin, 
  Youtube, 
  Github, 
  Mail, 
  Phone, 
  MessageSquare,
  Globe
} from "lucide-react";
import { cn } from "@/lib/utils";

const ICON_OPTIONS = [
  { id: 'Facebook', icon: Facebook },
  { id: 'Send', icon: Send, label: 'Telegram' },
  { id: 'Twitter', icon: Twitter },
  { id: 'Instagram', icon: Instagram },
  { id: 'Linkedin', icon: Linkedin },
  { id: 'Youtube', icon: Youtube },
  { id: 'Github', icon: Github },
  { id: 'Mail', icon: Mail },
  { id: 'Phone', icon: Phone },
  { id: 'MessageSquare', icon: MessageSquare, label: 'WhatsApp/Chat' },
  { id: 'Globe', icon: Globe }
];

interface LandingPageSectionProps {
  data: any;
  onChange: (newData: any) => void;
  onSave: () => void;
  saving: boolean;
}

export function LandingPageSection({ data, onChange, onSave, saving }: LandingPageSectionProps) {
  
  const addLink = (target: 'socialLinks' | 'contactLinks') => {
    const links = data[target] || [];
    onChange({
      ...data,
      [target]: [...links, { id: Date.now().toString(), icon: 'Globe', label: 'رابط جديد', url: 'https://' }]
    });
  };

  const updateLink = (target: 'socialLinks' | 'contactLinks', id: string, field: string, val: string) => {
    const links = (data[target] || []).map((l: any) => l.id === id ? { ...l, [field]: val } : l);
    onChange({ ...data, [target]: links });
  };

  const removeLink = (target: 'socialLinks' | 'contactLinks', id: string) => {
    const links = (data[target] || []).filter((l: any) => l.id !== id);
    onChange({ ...data, [target]: links });
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-left-6 duration-700 text-right font-body" dir="rtl">
      
      {/* 1. Header & Intro Text */}
      <Card className="rounded-[48px] border-none shadow-xl overflow-hidden bg-white">
        <CardHeader className="bg-[#002d4d] p-10 text-white relative">
          <div className="absolute top-0 right-0 p-8 opacity-5"><Layout className="h-32 w-32" /></div>
          <CardTitle className="text-2xl font-black flex items-center gap-4 relative z-10">
            <div className="h-14 w-14 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-md shadow-inner">
              <Layout className="h-8 w-8 text-[#f9a885]" />
            </div>
            إدارة واجهة صفحة الهبوط
          </CardTitle>
        </CardHeader>
        <CardContent className="p-10 space-y-10">
          <div className="space-y-8">
            <div className="space-y-3">
              <Label className="font-black text-[11px] text-gray-400 uppercase tracking-widest pr-4 flex items-center gap-2 justify-end">
                نص الانترو الترحيبي
                <Type className="h-3.5 w-3.5 text-blue-500" />
              </Label>
              <Input 
                value={data.introText || ""} 
                onChange={e => onChange({...data, introText: e.target.value})}
                className="h-14 rounded-2xl bg-blue-50/30 border-blue-100 font-black px-8 shadow-inner text-right text-blue-900"
                placeholder="أدخل النص الذي يظهر تحت الشعار في الانترو..."
              />
            </div>

            <div className="grid gap-8 md:grid-cols-2">
              <div className="space-y-3">
                <Label className="font-black text-[11px] text-gray-400 uppercase tracking-widest pr-4">العنوان الرئيسي (Hero Title)</Label>
                <Input value={data.welcomeTitle || ""} onChange={e => onChange({...data, welcomeTitle: e.target.value})} className="h-14 rounded-2xl bg-gray-50 border-none font-black px-8 shadow-inner text-right" />
              </div>
              <div className="space-y-3">
                <Label className="font-black text-[11px] text-gray-400 uppercase tracking-widest pr-4">العنوان الترحيبي (Subtitle)</Label>
                <Input value={data.welcomeSubtitle || ""} onChange={e => onChange({...data, welcomeSubtitle: e.target.value})} className="h-14 rounded-2xl bg-gray-50 border-none font-black px-8 shadow-inner text-right" />
              </div>
            </div>

            <div className="space-y-3">
              <Label className="font-black text-[11px] text-gray-400 uppercase tracking-widest pr-4">الوصف التعريفي (Description)</Label>
              <Textarea value={data.welcomeDescription || ""} onChange={e => onChange({...data, welcomeDescription: e.target.value})} className="min-h-[120px] rounded-[32px] bg-gray-50 border-none font-bold text-sm p-8 leading-loose shadow-inner text-right" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. SOCIAL & CONTACT LINKS MANAGEMENT */}
      <div className="grid gap-10 lg:grid-cols-2">
        
        {/* Section: تابعنا على */}
        <Card className="border-none shadow-sm rounded-[48px] bg-white overflow-hidden flex flex-col">
          <CardHeader className="p-8 border-b border-gray-50 flex flex-row items-center justify-between">
             <CardTitle className="text-lg font-black text-[#002d4d] flex items-center gap-3">
                <Globe className="h-5 w-5 text-blue-500" /> إدارة "تابعنا على"
             </CardTitle>
             <Button onClick={() => addLink('socialLinks')} variant="ghost" size="sm" className="h-10 rounded-xl bg-blue-50 text-blue-600 text-[10px] font-black px-4 active:scale-95">
                <Plus size={14} className="ml-1" /> إضافة منصة
             </Button>
          </CardHeader>
          <CardContent className="p-8 space-y-4">
             {(data.socialLinks || []).map((link: any) => (
               <div key={link.id} className="p-5 bg-gray-50 rounded-[28px] border border-gray-100 shadow-inner space-y-4 relative group">
                  <button onClick={() => removeLink('socialLinks', link.id)} className="absolute top-4 left-4 h-8 w-8 rounded-lg bg-white text-red-400 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:bg-red-50">
                     <Trash2 size={14} />
                  </button>
                  <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-1">
                        <Label className="text-[8px] font-black text-gray-400 pr-2 uppercase">الأيقونة</Label>
                        <Select value={link.icon} onValueChange={(val) => updateLink('socialLinks', link.id, 'icon', val)}>
                           <SelectTrigger className="h-10 rounded-xl bg-white border-none font-black text-[10px] shadow-sm">
                              <SelectValue />
                           </SelectTrigger>
                           <SelectContent className="rounded-2xl border-none shadow-2xl">
                              {ICON_OPTIONS.map(opt => (
                                <SelectItem key={opt.id} value={opt.id} className="font-bold text-right py-2.5">
                                   <div className="flex items-center gap-2">
                                      <opt.icon size={14} />
                                      <span>{opt.label || opt.id}</span>
                                   </div>
                                </SelectItem>
                              ))}
                           </SelectContent>
                        </Select>
                     </div>
                     <div className="space-y-1">
                        <Label className="text-[8px] font-black text-gray-400 pr-2 uppercase">التسمية</Label>
                        <Input value={link.label} onChange={e => updateLink('socialLinks', link.id, 'label', e.target.value)} className="h-10 rounded-xl bg-white border-none font-black text-[10px]" />
                     </div>
                  </div>
                  <div className="space-y-1">
                     <Label className="text-[8px] font-black text-gray-400 pr-2 uppercase">الرابط (URL)</Label>
                     <Input value={link.url} onChange={e => updateLink('socialLinks', link.id, 'url', e.target.value)} className="h-10 rounded-xl bg-white border-none font-mono text-[10px] text-left" dir="ltr" />
                  </div>
               </div>
             ))}
             {(!data.socialLinks || data.socialLinks.length === 0) && (
               <div className="py-12 text-center opacity-20 flex flex-col items-center gap-3">
                  <Send size={32} />
                  <p className="text-[10px] font-black uppercase">لم يتم إضافة روابط تواصل اجتماعي</p>
               </div>
             )}
          </CardContent>
        </Card>

        {/* Section: تواصل معنا */}
        <Card className="border-none shadow-sm rounded-[48px] bg-white overflow-hidden flex flex-col">
          <CardHeader className="p-8 border-b border-gray-100 flex flex-row items-center justify-between">
             <CardTitle className="text-lg font-black text-[#002d4d] flex items-center gap-3">
                <MessageSquare className="h-5 w-5 text-emerald-500" /> إدارة "تواصل معنا"
             </CardTitle>
             <Button onClick={() => addLink('contactLinks')} variant="ghost" size="sm" className="h-10 rounded-xl bg-emerald-50 text-emerald-600 text-[10px] font-black px-4 active:scale-95">
                <Plus size={14} className="ml-1" /> إضافة قناة تواصل
             </Button>
          </CardHeader>
          <CardContent className="p-8 space-y-4">
             {(data.contactLinks || []).map((link: any) => (
               <div key={link.id} className="p-5 bg-gray-50 rounded-[28px] border border-gray-100 shadow-inner space-y-4 relative group">
                  <button onClick={() => removeLink('contactLinks', link.id)} className="absolute top-4 left-4 h-8 w-8 rounded-lg bg-white text-red-400 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:bg-red-50">
                     <Trash2 size={14} />
                  </button>
                  <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-1">
                        <Label className="text-[8px] font-black text-gray-400 pr-2 uppercase">الأيقونة</Label>
                        <Select value={link.icon} onValueChange={(val) => updateLink('contactLinks', link.id, 'icon', val)}>
                           <SelectTrigger className="h-10 rounded-xl bg-white border-none font-black text-[10px] shadow-sm">
                              <SelectValue />
                           </SelectTrigger>
                           <SelectContent className="rounded-2xl border-none shadow-2xl">
                              {ICON_OPTIONS.map(opt => (
                                <SelectItem key={opt.id} value={opt.id} className="font-bold text-right py-2.5">
                                   <div className="flex items-center gap-2">
                                      <opt.icon size={14} />
                                      <span>{opt.label || opt.id}</span>
                                   </div>
                                </SelectItem>
                              ))}
                           </SelectContent>
                        </Select>
                     </div>
                     <div className="space-y-1">
                        <Label className="text-[8px] font-black text-gray-400 pr-2 uppercase">التسمية</Label>
                        <Input value={link.label} onChange={e => updateLink('contactLinks', link.id, 'label', e.target.value)} className="h-10 rounded-xl bg-white border-none font-black text-[10px]" />
                     </div>
                  </div>
                  <div className="space-y-1">
                     <Label className="text-[8px] font-black text-gray-400 pr-2 uppercase">الرابط المباشر</Label>
                     <Input value={link.url} onChange={e => updateLink('contactLinks', link.id, 'url', e.target.value)} className="h-10 rounded-xl bg-white border-none font-mono text-[10px] text-left" dir="ltr" />
                  </div>
               </div>
             ))}
             {(!data.contactLinks || data.contactLinks.length === 0) && (
               <div className="py-12 text-center opacity-20 flex flex-col items-center gap-3">
                  <Mail size={32} />
                  <p className="text-[10px] font-black uppercase">لم يتم إضافة قنوات تواصل إضافية</p>
               </div>
             )}
          </CardContent>
        </Card>
      </div>

      <div className="p-10 bg-blue-50/50 rounded-[48px] border border-blue-100 flex items-start gap-6">
         <div className="h-12 w-12 rounded-2xl bg-white flex items-center justify-center shadow-sm shrink-0">
            <Sparkles className="h-7 w-7 text-blue-600" />
         </div>
         <p className="text-[11px] font-bold text-blue-800/60 leading-[2] pt-1">
           تعديل الروابط والمنصات سيؤثر فوراً على تذييل الصفحة (Footer). يتم عرض "تابعنا على" و "تواصل معنا" بشكل تلقائي بناءً على القوائم المدارة أعلاه لتعزيز تجربة التواصل مع المستثمرين.
         </p>
      </div>

      <Button onClick={onSave} disabled={saving} className="w-full h-20 rounded-full bg-[#002d4d] hover:bg-[#001d33] text-white font-black text-xl shadow-2xl transition-all active:scale-95 group">
        {saving ? <Loader2 className="animate-spin h-8 w-8" /> : (
          <div className="flex items-center gap-4">
            <span>حفظ ميثاق واجهة الترحيب والروابط</span>
            <Save className="h-6 w-6 text-[#f9a885] group-hover:rotate-12 transition-transform" />
          </div>
        )}
      </Button>
    </div>
  );
}
