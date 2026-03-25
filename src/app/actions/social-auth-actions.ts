
'use server';

/**
 * @fileOverview بروتوكول التحقق السيادي للهويات الاجتماعية v22.0
 * تم تحديث آلية التحقق لتستخدم Google UserInfo API المباشرة لضمان الأمان والخصوصية.
 */

/**
 * يتحقق من توكن جوجل ويستخرج بيانات الهوية الحقيقية
 * يستخدم Access Token المعتمد من النافذة المنبثقة الرسمية
 */
export async function verifyGoogleIdToken(accessToken: string) {
  try {
    // 1. استدعاء واجهة بيانات المستخدم الرسمية من جوجل باستخدام Access Token
    // هذه الخطوة تضمن أن جوجل هي من تعيد البيانات ولا يمكن تزويرها
    const response = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    
    if (!response.ok) {
      throw new Error("فشل التحقق من صحة التوكن لدى خوادم جوجل.");
    }

    const payload = await response.json();
    
    if (!payload || !payload.email) {
      throw new Error("بيانات جوجل غير مكتملة أو انتهت صلاحية الجلسة.");
    }

    // تعيد البيانات المرتبطة بالحساب الذي اختاره المستخدم فعلياً
    return {
      success: true,
      data: {
        email: payload.email,
        name: payload.name || "مستثمر ناميكس",
        sub: payload.sub, // المعرف الفريد الثابت للحساب لدى جوجل
        picture: payload.picture,
        email_verified: payload.email_verified
      }
    };
  } catch (e: any) {
    console.error("Google Server Verification Error:", e);
    return { success: false, error: e.message };
  }
}
