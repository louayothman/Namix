'use server';
/**
 * @fileOverview محرك التوليد الاستنتاجي الموحد v2.0
 * يقوم بصياغة التحليل الفني وإدارة مناقشة محركات NAMIX بناءً على البيانات اللحظية.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const MarketAnalysisInputSchema = z.object({
  symbol: z.string().describe('رمز العملة'),
  price: z.number().describe('السعر الحالي'),
  rsi: z.number().describe('مؤشر القوة النسبية'),
  confidence: z.number().describe('نسبة الثقة %'),
  decision: z.enum(['BUY', 'SELL', 'HOLD']).describe('القرار الفني'),
  trend: z.string().describe('الاتجاه العام'),
  duration: z.string().optional().describe('المدة الزمنية المقترحة'),
});

const MarketAnalysisOutputSchema = z.object({
  reasoning: z.string().describe('التحليل الفني المختصر شامل السعر والثقة'),
  dialogue: z.array(z.object({
    agent: z.string(),
    icon: z.string(),
    color: z.string(),
    message: z.string()
  })).describe('مناقشة محركات NAMIX بين وكلاء النمو والمخاطر والقرار'),
});

export type MarketAnalysisInput = z.infer<typeof MarketAnalysisInputSchema>;
export type MarketAnalysisOutput = z.infer<typeof MarketAnalysisOutputSchema>;

const prompt = ai.definePrompt({
  name: 'marketAnalysisPrompt',
  input: { schema: MarketAnalysisInputSchema },
  output: { schema: MarketAnalysisOutputSchema },
  prompt: `أنت محلل تقني ومسؤول أتمتة في منظومة NAMIX.
بناءً على البيانات التالية:
العملة: {{symbol}}
السعر الحالي: {{price}}$
RSI: {{rsi}}
نسبة الثقة: {{confidence}}%
القرار: {{decision}}
الاتجاه اللحظي: {{trend}}

المطلوب منك توليد رد احترافي يتكون من جزئين:

1. الـ reasoning: صغ رؤية فنية مبتكرة في سطر واحد فقط. 
   - يجب إدراج السعر {{price}}$ ونسبة الثقة {{confidence}}% بشكل طبيعي داخل النص.
   - مثال: "نلاحظ تماسك السعر عند {{price}}$ مع زخم إيجابي قوي يرفع نسبة الثقة لـ {{confidence}}%."

2. الـ dialogue: قم بتوليد 3 رسائل تمثل "مناقشة محركات NAMIX" بين:
   - وكيل النمو (icon: Zap, color: bg-emerald-500): يركز على فرص الربح والزخم.
   - وكيل المخاطر (icon: Target, color: bg-red-500): يركز على مستويات الحماية والسيولة.
   - محرك القرار (icon: Cpu, color: bg-[#002d4d]): يعطي الخلاصة النهائية بناءً على التوافق التقني.

قواعد هامة جداً:
- لا تستخدم أبداً الكلمات التالية: سيادة، بروتوكول، ميثاق، استخبارات، مفاعل.
- استخدم لغة هادئة واحترافية وبشرية.
- اجعل الحوار يبدو كنقاش تقني حقيقي بين أنظمة ذكية وليس نصوصاً مكررة.`,
});

export async function generateAILogic(input: MarketAnalysisInput): Promise<MarketAnalysisOutput> {
  try {
    const { output } = await prompt(input);
    if (!output) throw new Error("AI failed to generate content");
    return output;
  } catch (e) {
    console.error("Genkit Flow Error:", e);
    throw e;
  }
}
