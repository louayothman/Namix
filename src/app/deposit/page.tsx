
"use client";

import { Shell } from "@/components/layout/Shell";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Wallet, Upload, Info, Copy, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

export default function DepositPage() {
  const [copied, setCopied] = useState(false);
  const walletAddress = "0x1234567890abcdef1234567890abcdef12345678";

  const copyToClipboard = () => {
    navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({ title: "تم النسخ", description: "تم نسخ عنوان المحفظة للمحفظة الخاصة بك." });
  };

  return (
    <Shell>
      <div className="max-w-4xl mx-auto grid gap-8 md:grid-cols-5">
        <div className="md:col-span-3 space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">إيداع جديد</h1>
            <p className="text-muted-foreground">يرجى تحويل المبلغ المطلوب وإرفاق إثبات التحويل أدناه.</p>
          </div>

          <Card className="border-none shadow-md overflow-hidden">
            <CardHeader className="bg-primary text-white">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Info className="h-5 w-5" />
                تعليمات الإيداع
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-4">
                <div className="p-4 bg-muted rounded-xl space-y-2 border">
                  <Label className="text-xs text-muted-foreground uppercase">عنوان محفظة USDT (TRC20)</Label>
                  <div className="flex items-center gap-2">
                    <code className="text-sm break-all font-mono font-bold bg-white p-2 rounded block flex-1 border">
                      {walletAddress}
                    </code>
                    <Button size="icon" variant="ghost" onClick={copyToClipboard} className="shrink-0 h-10 w-10">
                      {copied ? <Check className="h-5 w-5 text-emerald-600" /> : <Copy className="h-5 w-5" />}
                    </Button>
                  </div>
                </div>

                <div className="grid gap-4 text-sm">
                  <div className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 font-bold text-xs">1</div>
                    <p>قم بتحويل المبلغ إلى العنوان الموضح أعلاه (تأكد من اختيار شبكة TRC20).</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 font-bold text-xs">2</div>
                    <p>التقط صورة لإيصال التحويل الناجح أو انسخ رقم العملية (Transaction ID).</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 font-bold text-xs">3</div>
                    <p>املأ النموذج على اليسار وسيقوم فريقنا بمراجعة طلبك خلال 24 ساعة.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Card className="border-none shadow-lg border-t-4 border-t-primary">
            <CardHeader>
              <CardTitle className="text-xl">تأكيد الإيداع</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="amount">المبلغ المودع ($)</Label>
                <div className="relative">
                  <Input id="amount" type="number" placeholder="0.00" className="pl-10 h-12 rounded-xl" />
                  <Wallet className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="plan">الخطة المختارة</Label>
                <Select>
                  <SelectTrigger className="h-12 rounded-xl">
                    <SelectValue placeholder="اختر خطة استثمار" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bronze">البرونزية (15%)</SelectItem>
                    <SelectItem value="silver">الفضية (25%)</SelectItem>
                    <SelectItem value="gold">الذهبية (40%)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="txid">رقم العملية (Transaction ID)</Label>
                <Input id="txid" placeholder="أدخل رقم العملية هنا" className="h-12 rounded-xl" />
              </div>

              <div className="space-y-2">
                <Label>إثبات التحويل (صورة الإيصال)</Label>
                <div className="border-2 border-dashed rounded-2xl p-6 text-center space-y-2 transition-colors hover:border-primary cursor-pointer bg-muted/20">
                  <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
                    <Upload className="h-6 w-6" />
                  </div>
                  <p className="text-sm font-bold">اضغط هنا لرفع الملف</p>
                  <p className="text-[10px] text-muted-foreground">PNG, JPG, PDF (بحد أقصى 5MB)</p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full h-12 rounded-xl font-bold text-lg">إرسال الطلب للمراجعة</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </Shell>
  );
}
