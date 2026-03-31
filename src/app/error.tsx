'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertTriangle, RotateCcw, Home } from 'lucide-react'

/**
 * @fileOverview واجهة معالجة الأخطاء التشغيلية v1.0
 * تقوم هذه الصفحة بالقبض على أعطال الخادم وعرضها بأسلوب ناميكس الاحترافي.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // تسجيل الخطأ في قنصل النظام للتدقيق
    console.error("System Runtime Error:", error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center bg-white font-body" dir="rtl">
      <div className="relative mb-10">
        <div className="h-24 w-24 bg-red-50 rounded-[32px] flex items-center justify-center shadow-inner border border-red-100">
          <AlertTriangle className="h-12 w-12 text-red-500 animate-pulse" />
        </div>
        <div className="absolute -bottom-2 -right-2 h-8 w-8 bg-[#002d4d] rounded-xl flex items-center justify-center shadow-lg">
           <div className="h-1.5 w-1.5 rounded-full bg-red-500 animate-ping" />
        </div>
      </div>

      <div className="space-y-3 max-w-md">
        <h2 className="text-3xl font-black text-[#002d4d] tracking-tight">حدث عطل في المفاعل</h2>
        <p className="text-gray-500 font-bold leading-loose text-sm">
          نعتذر، واجه النظام خطأ غير متوقع أثناء معالجة البيانات. بروتوكول الأمان قام بتجميد الجلسة لحماية أصولك.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-12 w-full max-w-sm">
        <Button
          onClick={() => reset()}
          className="h-14 rounded-full bg-[#002d4d] hover:bg-[#001d33] text-white font-black shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          <RotateCcw className="h-4 w-4" />
          إعادة تشغيل النظام
        </Button>
        <Button
          variant="outline"
          onClick={() => window.location.href = '/'}
          className="h-14 rounded-full border-gray-100 bg-gray-50 text-[#002d4d] font-black hover:bg-white transition-all flex items-center justify-center gap-2"
        >
          <Home className="h-4 w-4" />
          العودة للرئيسية
        </Button>
      </div>

      {/* تفاصيل تقنية للمشرف في بيئة التطوير */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-16 w-full max-w-2xl text-right">
           <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest mb-3">Debug Intelligence Node</p>
           <pre className="p-6 bg-gray-50 rounded-[32px] border border-gray-100 text-[10px] font-mono text-red-400 overflow-auto max-h-[200px] scrollbar-none shadow-inner">
             {error.message}
             {"\n\nStack Trace:\n"}
             {error.stack}
           </pre>
        </div>
      )}

      <div className="mt-auto pt-12 opacity-20">
         <p className="text-[9px] font-black text-[#002d4d] uppercase tracking-[0.6em]">Error Handling Protocol v1.0</p>
      </div>
    </div>
  )
}
