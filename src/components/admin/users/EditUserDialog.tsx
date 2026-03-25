"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Edit, Globe, Lock, Loader2 } from "lucide-react";

interface EditUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: any;
  editData: any;
  onDataChange: (data: any) => void;
  onSave: () => void;
  processing: boolean;
}

export function EditUserDialog({ 
  open, 
  onOpenChange, 
  user, 
  editData, 
  onDataChange, 
  onSave, 
  processing 
}: EditUserDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-[56px] border-none shadow-2xl p-0 max-w-[420px] overflow-hidden text-right" dir="rtl">
        <div className="bg-[#002d4d] p-8 text-white relative">
           <div className="absolute top-0 right-0 p-6 opacity-[0.03] -rotate-12 pointer-events-none">
              <Globe className="h-32 w-32" />
           </div>
           <div className="flex items-center gap-4 relative z-10">
              <div className="h-14 w-14 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-xl border border-white/20 shadow-inner">
                 <Edit className="h-6 w-6 text-[#f9a885]" />
              </div>
              <div className="space-y-0.5">
                 <DialogTitle className="text-xl font-black">تعديل هوية المستثمر</DialogTitle>
                 <p className="text-[9px] font-black text-blue-200/60 uppercase tracking-[0.3em]">Identity Management Protocol</p>
              </div>
           </div>
        </div>

        <div className="p-10 space-y-6 bg-white">
          <div className="space-y-2">
            <Label className="font-black text-[10px] text-gray-400 pr-4 uppercase">الاسم المعتمد</Label>
            <Input 
              value={editData.displayName}
              onChange={e => onDataChange({...editData, displayName: e.target.value})}
              className="h-12 rounded-2xl bg-gray-50 border-none font-black text-sm shadow-inner px-6"
            />
          </div>
          <div className="space-y-2">
            <Label className="font-black text-[10px] text-gray-400 pr-4 uppercase">رقم الهاتف للهوية</Label>
            <Input 
              value={editData.phoneNumber}
              onChange={e => onDataChange({...editData, phoneNumber: e.target.value})}
              className="h-12 rounded-2xl bg-gray-50 border-none font-black text-sm shadow-inner px-6"
              dir="ltr"
            />
          </div>
          <div className="space-y-2">
            <Label className="font-black text-[10px] text-gray-400 pr-4 uppercase">كلمة المرور المشفرة</Label>
            <div className="relative">
              <Input 
                value={editData.password}
                onChange={e => onDataChange({...editData, password: e.target.value})}
                className="h-12 rounded-2xl bg-gray-50 border-none font-black text-sm shadow-inner px-6"
              />
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-200" />
            </div>
          </div>
          <div className="space-y-2">
            <Label className="font-black text-[10px] text-gray-400 pr-4 uppercase">الدور الوظيفي</Label>
            <Select value={editData.role} onValueChange={val => onDataChange({...editData, role: val})}>
              <SelectTrigger className="h-12 rounded-2xl bg-gray-50 border-none font-black text-sm shadow-inner px-6">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-2xl">
                <SelectItem value="user" className="font-bold">مستثمر عادي</SelectItem>
                <SelectItem value="admin" className="font-bold">مشرف نظام (صلاحية كاملة)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="p-8 bg-gray-50 border-t border-gray-100">
          <Button 
            onClick={onSave} 
            disabled={processing}
            className="w-full h-14 rounded-full bg-[#002d4d] text-white font-black text-base shadow-xl active:scale-95"
          >
            {processing ? <Loader2 className="animate-spin h-5 w-5" /> : "حفظ التعديلات المعتمدة"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
