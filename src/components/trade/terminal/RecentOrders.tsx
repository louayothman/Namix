
"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, query, where, orderBy, limit } from "firebase/firestore";
import { TrendingUp, TrendingDown, Clock, AlertCircle, Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ar } from "date-fns/locale/ar";
import { cn } from "@/lib/utils";

interface RecentOrdersProps {
  assetId: string;
}

export function RecentOrders({ assetId }: RecentOrdersProps) {
  const [localUser, setLocalUser] = useState<any>(null);
  const db = useFirestore();

  useEffect(() => {
    const session = localStorage.getItem("namix_user");
    if (session) setLocalUser(JSON.parse(session));
  }, []);

  const tradesQuery = useMemoFirebase(() => {
    if (!localUser?.id) return null;
    return query(
      collection(db, "trades"),
      where("userId", "==", localUser.id),
      where("symbolId", "==", assetId),
      orderBy("createdAt", "desc"),
      limit(5)
    );
  }, [db, localUser?.id, assetId]);

  const { data: trades, isLoading } = useCollection(tradesQuery);

  if (isLoading) return <div className="py-6 text-center"><Loader2 className="h-5 w-5 animate-spin mx-auto text-gray-200" /></div>;

  return (
    <div className="grid gap-2">
      {trades?.map((trade) => (
        <Card key={trade.id} className="border-none shadow-sm rounded-[24px] bg-white overflow-hidden group transition-all hover:shadow-md">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={cn(
                "h-10 w-10 rounded-[14px] flex items-center justify-center shadow-inner",
                trade.tradeType === 'buy' ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"
              )}>
                {trade.tradeType === 'buy' ? <TrendingUp size={18}/> : <TrendingDown size={18}/>}
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2">
                   <h4 className="font-black text-xs text-[#002d4d]">${trade.amount.toLocaleString()}</h4>
                   <Badge className={cn(
                     "text-[6px] font-black border-none px-1.5 py-0.5 rounded-md",
                     trade.result === 'win' ? "bg-emerald-500 text-white" : trade.result === 'lose' ? "bg-red-500 text-white" : "bg-gray-100 text-gray-400"
                   )}>
                     {trade.result === 'win' ? 'WIN' : trade.result === 'lose' ? 'LOSS' : 'PENDING'}
                   </Badge>
                </div>
                <div className="flex items-center gap-1 text-[7px] font-bold text-gray-300 mt-0.5">
                   <Clock size={8} />
                   <span>{trade.createdAt && formatDistanceToNow(new Date(trade.createdAt), { addSuffix: true, locale: ar })}</span>
                </div>
              </div>
            </div>

            <div className="text-left">
               <p className={cn(
                 "text-[9px] font-black tabular-nums tracking-tighter break-all",
                 trade.result === 'win' ? "text-emerald-600" : trade.result === 'lose' ? "text-red-600" : "text-gray-400"
               )}>
                 {trade.result === 'win' ? `+$${trade.expectedProfit.toFixed(2)}` : trade.result === 'lose' ? `-$${trade.amount.toFixed(2)}` : '...'}
               </p>
               <p className="text-[6px] font-black text-gray-300 uppercase tracking-widest leading-none mt-0.5">Result</p>
            </div>
          </CardContent>
        </Card>
      ))}
      {(!trades || trades.length === 0) && (
        <div className="py-10 text-center opacity-20 flex flex-col items-center gap-2">
           <AlertCircle className="h-6 w-6 text-[#002d4d]" />
           <p className="text-[8px] font-black uppercase tracking-widest text-gray-400">No trade activity detected</p>
        </div>
      )}
    </div>
  );
}
