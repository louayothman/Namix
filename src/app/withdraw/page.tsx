
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

/**
 * صفحة السحب - تقوم بتوجيه المستخدم للصفحة الرئيسية مع فتح نموذج السحب تلقائياً
 */
export default function WithdrawPage() {
  const router = useRouter();

  useEffect(() => {
    // توجيه للرئيسية مع معامل لفتح السحب
    router.push("/?action=withdraw");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-[#002d4d]" />
        <p className="font-bold text-gray-400 text-sm">جاري تحويلك لمركز السحب...</p>
      </div>
    </div>
  );
}
