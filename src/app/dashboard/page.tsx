
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function DashboardRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/home");
  }, [router]);

  return (
    <div className="h-screen flex items-center justify-center bg-white">
      <Loader2 className="h-8 w-8 animate-spin text-[#002d4d]" />
    </div>
  );
}
