
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

/**
 * @fileOverview صفحة التحويل الذكي v1.0
 * تم استبدال الرابط القديم dashboard بـ home لضمان توحيد المسارات السيادية.
 */
export default function DashboardRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/home");
  }, [router]);

  return (
    <div className="h-screen flex items-center justify-center bg-[#001a2d]">
      <Loader2 className="h-8 w-8 animate-spin text-[#f9a885]" />
    </div>
  );
}
