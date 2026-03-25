
"use client";

import { Shell } from "@/components/layout/Shell";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, Eye, User, FileText, Download } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const mockRequests = [
  { id: "1", user: "ياسين الكردي", amount: "$1,200", type: "DEPOSIT", date: "2024-05-20", ref: "TX-99212" },
  { id: "2", user: "ليلى حسن", amount: "$300", type: "WITHDRAWAL", date: "2024-05-21", ref: "WD-1102" },
  { id: "3", user: "محمد علي", amount: "$5,000", type: "DEPOSIT", date: "2024-05-21", ref: "TX-44510" },
  { id: "4", user: "سارة خالد", amount: "$150", type: "WITHDRAWAL", date: "2024-05-22", ref: "WD-2291" },
];

export default function AdminRequestsPage() {
  const handleApprove = (id: string) => {
    toast({ title: "تم قبول الطلب", description: `تمت الموافقة على العملية بنجاح.` });
  };

  const handleReject = (id: string) => {
    toast({ variant: "destructive", title: "تم رفض الطلب", description: `تم إلغاء العملية.` });
  };

  return (
    <Shell isAdmin>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">مركز الموافقة</h1>
            <p className="text-muted-foreground">إدارة ومعالجة طلبات الإيداع والسحب المقدمة من المستخدمين.</p>
          </div>
          <div className="flex gap-4 items-center">
            <div className="text-left">
              <p className="text-xs text-muted-foreground">طلبات معلقة</p>
              <p className="text-xl font-bold text-orange-500">12 طلب</p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="w-full max-w-md grid grid-cols-3 h-12 rounded-xl bg-white p-1 shadow-sm mb-6">
            <TabsTrigger value="all" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white">الكل</TabsTrigger>
            <TabsTrigger value="deposits" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white">الإيداعات</TabsTrigger>
            <TabsTrigger value="withdrawals" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white">السحوبات</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <Card className="border-none shadow-md">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent bg-muted/30">
                      <TableHead className="w-[250px]">المستخدم</TableHead>
                      <TableHead>النوع</TableHead>
                      <TableHead>المبلغ</TableHead>
                      <TableHead>التاريخ</TableHead>
                      <TableHead>المرجع</TableHead>
                      <TableHead className="text-center">الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockRequests.map((req) => (
                      <TableRow key={req.id} className="group transition-colors hover:bg-muted/50">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center">
                              <User className="h-5 w-5 text-muted-foreground" />
                            </div>
                            <span className="font-bold text-sm">{req.user}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={cn(
                            "font-bold",
                            req.type === 'DEPOSIT' ? "border-emerald-200 text-emerald-700 bg-emerald-50" : "border-orange-200 text-orange-700 bg-orange-50"
                          )}>
                            {req.type === 'DEPOSIT' ? "إيداع" : "سحب"}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-mono font-bold">{req.amount}</TableCell>
                        <TableCell className="text-muted-foreground text-xs">{req.date}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-xs font-mono bg-muted/50 px-2 py-1 rounded w-fit">
                            <FileText className="h-3 w-3" />
                            {req.ref}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-center gap-2">
                            <Button size="icon" variant="ghost" className="h-8 w-8 text-primary" title="عرض التفاصيل">
                              <Eye className="h-4 w-4" />
                            </Button>
                            {req.type === 'DEPOSIT' && (
                              <Button size="icon" variant="ghost" className="h-8 w-8 text-blue-600" title="تحميل الإيصال">
                                <Download className="h-4 w-4" />
                              </Button>
                            )}
                            <div className="h-4 w-px bg-border mx-1" />
                            <Button 
                              onClick={() => handleApprove(req.id)}
                              size="icon" 
                              variant="ghost" 
                              className="h-8 w-8 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700" 
                              title="موافقة"
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button 
                              onClick={() => handleReject(req.id)}
                              size="icon" 
                              variant="ghost" 
                              className="h-8 w-8 text-destructive hover:bg-destructive/10" 
                              title="رفض"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="deposits">
             {/* Similar table filtered for deposits */}
             <div className="text-center py-20 text-muted-foreground">لا توجد إيداعات معلقة حالياً.</div>
          </TabsContent>
          <TabsContent value="withdrawals">
             {/* Similar table filtered for withdrawals */}
             <div className="text-center py-20 text-muted-foreground">لا توجد سحوبات معلقة حالياً.</div>
          </TabsContent>
        </Tabs>
      </div>
    </Shell>
  );
}
