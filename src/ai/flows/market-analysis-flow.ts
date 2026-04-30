'use server';
/**
 * @fileOverview محرك التوليد الاستنتاجي v1.0
 * يستخدم Gemini 2.5 Flash لصياغة تحليلات فنية مبتكرة بناءً على البيانات الرقمية.
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
});

export type MarketAnalysisInput = z.infer<typeof MarketAnalysisInputSchema>;

const prompt = ai.definePrompt({
  name: 'marketAnalysisPrompt',
  input: { schema: MarketAnalysisInputSchema },
  output: { schema: z.string() },
  prompt: `أنت محلل تقني محترف في منصة ناميكس.
قم بصياغة رؤية فنية مبتكرة وذكية في سطر واحد فقط (لا يتجاوز 15 كلمة).
يجب أن يكون النص مبنياً على البيانات التالية:
العملة: {{symbol}}
السعر: {{price}}
RSI: {{rsi}}
الثقة: %{{confidence}}
القرار: {{decision}}
الاتجاه: {{trend}}

قواعد هامة:
1. استخدم لغة هادئة واحترافية (مثل ChatGPT).
2. اجعل النص يبدو وكأنه تحليل بشري عميق وليس قالباً.
3. تجنب الكلمات التالية تماماً: سيادة، بروتوكول، ميثاق، استخبارات، مفاعل.
4. ادمج السعر أو الثقة داخل الجملة بأسلوب طبيعي.`,
});

export async function generateAILogic(input: MarketAnalysisInput): Promise<string> {
  try {
    const { output } = await prompt(input);
    return output || "";
  } catch (e) {
    console.error("Genkit Flow Error:", e);
    throw e;
  }
}
