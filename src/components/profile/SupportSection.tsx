
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Headset, ChevronLeft, BookOpen, Gavel, Info } from "lucide-react";
import Link from "next/link";

export function SupportSection() {
  const links = [
    { title: "مركز المساعدة", desc: "الدعم الفني المباشر والأسئلة الشائعة", href: "/faq", color: "text-blue-500" },
    { title: "أكاديمية ناميكس", desc: "تعلم استراتيجيات الاستثمار الناجحة", href: "/academy", color: "text-purple-500" },
    { title: "من نحن", desc: "تعرف على رؤية ناميكس في عالم الاقتصاد الرقمي", href: "/about", color: "text-[#f9a885]" },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 px-6">
        <div className="h-1 w-1 rounded-full bg-purple-500" />
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">الدعم والبروتوكولات</p>
      </div>

      <Card className="border-none shadow-sm rounded-[40px] bg-white overflow-hidden relative group">
        <div className="absolute top-0 right-0 p-8 opacity-[0.02] pointer-events-none group-hover:scale-110 transition-transform duration-1000">
           <Headset className="h-40 w-40 text-blue-600" />
        </div>
        
        <CardContent className="p-0 divide-y divide-gray-50 relative z-10">
          {links.map((link, i) => (
            <Link key={i} href={link.href} className="block p-8 hover:bg-gray-50/50 transition-all group/item">
              <div className="flex items-center justify-between">
                <div className="text-right">
                  <p className="font-black text-base text-[#002d4d] group-hover/item:text-blue-600 transition-colors">{link.title}</p>
                  <p className="text-[10px] text-gray-400 font-bold">{link.desc}</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-300 group-hover/item:bg-[#002d4d] group-hover/item:text-[#f9a885] transition-all">
                  <ChevronLeft className="h-5 w-5" />
                </div>
              </div>
            </Link>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
