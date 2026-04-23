
"use client";

import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Variable, ChevronDown, User, Wallet, Hash, Mail } from "lucide-react";

interface VariablePickerProps {
  onSelect: (variable: string) => void;
}

const VARIABLES = [
  { id: '{{NAME}}', label: 'اسم المستثمر الكامل', icon: User },
  { id: '{{BALANCE}}', label: 'الرصيد الحالي ($)', icon: Wallet },
  { id: '{{ID}}', label: 'المعرف الرقمي (ID)', icon: Hash },
  { id: '{{EMAIL}}', label: 'البريد الإلكتروني', icon: Mail },
];

export function VariablePicker({ onSelect }: VariablePickerProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="h-8 rounded-lg bg-white border-gray-200 text-[#002d4d] font-black text-[9px] gap-2 shadow-sm">
           <Variable size={12} className="text-blue-500" />
           إدراج متغير ذكي
           <ChevronDown size={10} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="rounded-2xl border-none shadow-2xl p-2 min-w-[200px]" dir="rtl">
        {VARIABLES.map((v) => (
          <DropdownMenuItem 
            key={v.id} 
            onClick={() => onSelect(v.id)}
            className="rounded-xl py-3 cursor-pointer flex items-center justify-between group"
          >
             <div className="flex items-center gap-3">
                <v.icon size={14} className="text-gray-400 group-hover:text-blue-500 transition-colors" />
                <span className="font-bold text-[11px] text-[#002d4d]">{v.label}</span>
             </div>
             <code className="text-[9px] bg-gray-100 px-1.5 py-0.5 rounded font-mono text-blue-600">{v.id}</code>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
