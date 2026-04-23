
'use server';

import { Resend } from 'resend';

const resend = new Resend('re_GJABmije_GN8S3yKMsCxjNkhm3YvWMnLk');

/**
 * @fileOverview NAMIX AUTH ACTIONS v31.0 - Modular Broadcast Engine
 * تم تحديث المحرك ليدعم معالجة الكتل المتجاوبة وحقن المتغيرات الذكية.
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
          </div>
          <div style="background-color: #fcfdfe; padding: 30px; border-radius: 15px; text-align: center;">
            <p style="color: #444; font-size: 16px;">يرجى استخدام الرمز التالي لتأمين دخولك للمنصة:</p>
            <h2 style="color: #002d4d; font-size: 42px; letter-spacing: 10px; margin: 20px 0;">${otp}</h2>
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
  options?: {
    htmlOverride?: string;
    blocks?: any[];
    variables?: Record<string, string>;
  }
) {
  try {
    let finalHtml = options?.htmlOverride || "";

    // إذا كان هناك كتل مودولار، نقوم بتحويلها إلى HTML
    if (options?.blocks) {
      finalHtml = renderBlocksToHtml(options.blocks);
    }

    // حقن المتغيرات الذكية
    if (options?.variables) {
      Object.entries(options.variables).forEach(([key, val]) => {
        const regex = new RegExp(`{{${key}}}`, 'g');
        finalHtml = finalHtml.replace(regex, val);
        title = title.replace(regex, val);
      });
    }

    // إذا لم يتوفر HTML، نستخدم القالب الافتراضي المحدث
    if (!finalHtml) {
      finalHtml = `
        <div dir="rtl" style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; border: 1px solid #f0f0f0; border-radius: 32px; background-color: #ffffff;">
          <div style="text-align: center; margin-bottom: 40px;">
            <h1 style="color: #002d4d; margin: 0; font-size: 28px;">Namix</h1>
          </div>
          <div style="background-color: #fcfdfe; padding: 40px; border-radius: 24px;">
            <h2 style="color: #002d4d; font-size: 20px; margin-bottom: 20px;">${title}</h2>
            <p style="color: #445566; line-height: 1.8; font-size: 15px;">${message.replace(/\n/g, '<br>')}</p>
          </div>
        </div>
      `;
    }

    const { data, error } = await resend.emails.send({
      from: 'Namix Official <info@namix.pro>',
      to: email,
      subject: title,
      html: finalHtml,
    });
    
    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

/**
 * محرك تحويل الكتل البرمجية إلى HTML متوافق مع تطبيقات البريد
 */
function renderBlocksToHtml(blocks: any[]): string {
  let html = `<div dir="rtl" style="font-family: sans-serif; background-color: #f8fafc; padding: 20px 0;">`;
  html += `<div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 32px; overflow: hidden; border: 1px solid #e2e8f0;">`;

  blocks.forEach(block => {
    const { type, content } = block;
    switch(type) {
      case 'header':
        html += `<div style="padding: 40px 20px; text-align: center; border-bottom: 1px solid #f1f5f9;">
          <h1 style="margin: 0; color: ${content.color || '#002d4d'}; font-size: ${content.fontSize || '24px'}; font-weight: 900; font-style: italic;">${content.title}</h1>
        </div>`;
        break;
      case 'hero':
        html += `<div style="width: 100%;">
          <img src="${content.imageUrl}" alt="${content.alt}" style="width: 100%; display: block; border-bottom: 1px solid #f1f5f9;">
        </div>`;
        break;
      case 'text':
        html += `<div style="padding: 40px; text-align: ${content.align || 'right'}; color: ${content.color || '#445566'}; font-size: ${content.fontSize || '14px'}; line-height: 2; font-weight: bold;">
          ${content.text.replace(/\n/g, '<br>')}
        </div>`;
        break;
      case 'button':
        html += `<div style="padding: 20px 40px; text-align: ${content.align || 'center'};">
          <a href="${content.link || '#'}" style="display: inline-block; padding: 16px 48px; background-color: ${content.bgColor || '#002d4d'}; color: ${content.color || '#ffffff'}; border-radius: 28px; text-decoration: none; font-weight: 900; font-size: 14px; box-shadow: 0 10px 30px rgba(0,45,77,0.15);">${content.label}</a>
        </div>`;
        break;
      case 'divider':
        html += `<div style="padding: 20px 40px;"><div style="height: ${content.thickness || '1px'}; background-color: ${content.color || '#f1f5f9'}; width: 100%;"></div></div>`;
        break;
      case 'footer':
        html += `<div style="padding: 40px; text-align: center; background-color: #fcfdfe; border-top: 1px solid #f1f5f9;">
          <p style="margin: 0; color: ${content.color || '#94a3b8'}; font-size: ${content.fontSize || '10px'}; font-weight: bold; line-height: 1.6;">${content.text}</p>
          <p style="margin-top: 20px; color: #cbd5e1; font-size: 8px; font-weight: 900; letter-spacing: 2px;">NAMIX UNIVERSAL NETWORK</p>
        </div>`;
        break;
    }
  });

  html += `</div></div>`;
  return html;
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
