
'use server';

import { Resend } from 'resend';

const resend = new Resend('re_GJABmije_GN8S3yKMsCxjNkhm3YvWMnLk');

/**
 * @fileOverview NAMIX AUTH ACTIONS v28.0 - Dynamic Template Engine
 * تم تحديث المحرك ليدعم تخصيص الهوية البصرية للرسائل البريدية (ألوان، أزرار، روابط).
 */

export async function sendOTPEmail(email: string, otp: string) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Namix <auth@namix.pro>',
      to: email,
      subject: 'رمز التحقق من الهوية | Verification Code',
      html: `
        <div dir="rtl" style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; border: 1px solid #f0f0f0; border-radius: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #002d4d; margin: 0;">Namix</h1>
            <p style="color: #f9a885; font-size: 12px; text-transform: uppercase; letter-spacing: 2px;">Advanced Financial Services</p>
          </div>
          <div style="background-color: #fcfdfe; padding: 30px; border-radius: 15px; text-align: center;">
            <p style="color: #444; font-size: 16px;">يرجى استخدام الرمز التالي لتأمين دخولك للمنصة:</p>
            <h2 style="color: #002d4d; font-size: 42px; letter-spacing: 10px; margin: 20px 0;">${otp}</h2>
            <p style="color: #888; font-size: 12px;">هذا الرمز صالح لمدة 5 دقائق لضمان الحماية القصوى.</p>
          </div>
          <div style="margin-top: 30px; text-align: center; color: #aaa; font-size: 10px;">
            <p>© 2024 Namix Universal Network. All rights reserved.</p>
          </div>
        </div>
      `,
    });
    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

export async function sendBroadcastEmail(
  email: string, 
  title: string, 
  message: string, 
  templateOptions?: {
    primaryColor?: string;
    textColor?: string;
    buttonText?: string;
    buttonLink?: string;
    footerText?: string;
  }
) {
  try {
    const pColor = templateOptions?.primaryColor || '#002d4d';
    const tColor = templateOptions?.textColor || '#445566';
    const btnText = templateOptions?.buttonText;
    const btnLink = templateOptions?.buttonLink;
    const footer = templateOptions?.footerText || 'هذا البريد مرسل إليك بصفتك مستثمراً مسجلاً في منصة ناميكس.';

    const htmlContent = `
      <div dir="rtl" style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; border: 1px solid #f0f0f0; border-radius: 32px; background-color: #ffffff;">
        <div style="text-align: center; margin-bottom: 40px;">
          <h1 style="color: ${pColor}; margin: 0; font-size: 28px;">Namix</h1>
        </div>
        <div style="background-color: #fcfdfe; padding: 40px; border-radius: 24px;">
          <h2 style="color: ${pColor}; font-size: 20px; margin-bottom: 20px;">${title}</h2>
          <p style="color: ${tColor}; line-height: 1.8; font-size: 15px; margin-bottom: 30px;">${message.replace(/\n/g, '<br>')}</p>
          
          ${btnText && btnLink ? `
            <div style="text-align: center; margin: 40px 0;">
              <a href="${btnLink}" style="background-color: ${pColor}; color: #ffffff; padding: 16px 40px; border-radius: 12px; text-decoration: none; font-weight: bold; font-size: 14px; display: inline-block;">
                ${btnText}
              </a>
            </div>
          ` : ''}
        </div>
        <div style="margin-top: 40px; text-align: center; color: #99aabb; font-size: 11px; line-height: 1.6;">
          <p>${footer}</p>
          <p style="margin-top: 10px; opacity: 0.5;">© 2024 Namix Universal Network</p>
        </div>
      </div>
    `;

    const { data, error } = await resend.emails.send({
      from: 'Namix Official <info@namix.pro>',
      to: email,
      subject: title,
      html: htmlContent,
    });
    
    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

export async function sendAdminResetEmail(email: string, type: 'password' | 'pin', value: string) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Namix Security <security@namix.pro>',
      to: email,
      subject: 'تحديث بيانات الأمان | Security Update',
      html: `
        <div dir="rtl" style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; border: 1px solid #f0f0f0; border-radius: 20px;">
          <h2 style="color: #002d4d;">تنبيه أمني: إعادة تعيين البيانات</h2>
          <p style="color: #444;">قام المشرف بإعادة تعيين ${type === 'password' ? 'كلمة المرور' : 'رمز PIN'} الخاصة بك:</p>
          <div style="background: #f9fafb; padding: 20px; border-radius: 12px; text-align: center; margin: 20px 0;">
            <h3 style="color: #002d4d; font-size: 24px; margin: 0;">${value}</h3>
          </div>
          <p style="color: #888; font-size: 12px;">يرجى تغيير هذه البيانات فور تسجيل دخولك لضمان خصوصيتك.</p>
        </div>
      `,
    });
    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}
