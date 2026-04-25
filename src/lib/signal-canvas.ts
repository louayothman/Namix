
import { createCanvas, loadImage } from 'canvas';

/**
 * @fileOverview Namix Signal Canvas Generator v1.0
 * يقوم بتوليد صورة احترافية للإشارة تحتوي على شارت ومعلومات تكتيكية وشعار المنصة.
 */

const COLORS = {
  bg: "#0B0F1A",
  card: "#121826",
  text: "#FFFFFF",
  green: "#00C896",
  red: "#FF4D4F",
  blue: "#3A86FF",
  gray: "#8A94A6"
};

export async function generateSignalImage(signal: any) {
  const width = 900;
  const height = 1100;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // 1. الخلفية الأساسية
  ctx.fillStyle = COLORS.bg;
  ctx.fillRect(0, 0, width, height);

  // 2. كرت المحتوى الرئيسي
  ctx.fillStyle = COLORS.card;
  ctx.shadowColor = "rgba(0,0,0,0.5)";
  ctx.shadowBlur = 40;
  ctx.fillRect(40, 40, width - 80, height - 80);
  ctx.shadowBlur = 0;

  // 3. جلب الشارت الحقيقي (استخدام خدمة صور TradingView)
  try {
    const symbolClean = signal.pair.replace('/', '');
    const chartUrl = `https://chart-img.com/v1/tradingview/advanced-chart?symbol=BINANCE:${symbolClean}&theme=dark&width=800&height=450&interval=1h&style=1`;
    const chartImage = await loadImage(chartUrl);
    ctx.drawImage(chartImage, 50, 120, 800, 450);
    
    // رسم إطار نانوي للشارت
    ctx.strokeStyle = "rgba(255,255,255,0.05)";
    ctx.lineWidth = 1;
    ctx.strokeRect(50, 120, 800, 450);
  } catch (e) {
    // في حال فشل الشارت، نرسم مساحة رمادية أنيقة
    ctx.fillStyle = "rgba(255,255,255,0.02)";
    ctx.fillRect(50, 120, 800, 450);
  }

  // 4. ترويسة البطاقة
  ctx.fillStyle = COLORS.text;
  ctx.font = "900 42px sans-serif";
  ctx.fillText(signal.pair, 70, 90);

  const typeColor = signal.decision === 'BUY' ? COLORS.green : COLORS.red;
  ctx.fillStyle = typeColor;
  ctx.textAlign = "left";
  ctx.fillText(signal.decision === 'BUY' ? "LONG" : "SHORT", 830, 90);
  ctx.textAlign = "right";

  // 5. مصفوفة البيانات (Data Grid)
  let startY = 630;
  function drawRow(label: string, value: string, color: string) {
    ctx.fillStyle = COLORS.gray;
    ctx.font = "bold 24px sans-serif";
    ctx.fillText(label, 830, startY);

    ctx.fillStyle = color;
    ctx.font = "900 28px sans-serif";
    ctx.fillText(value, 600, startY);
    startY += 65;
  }

  drawRow("الدخول (Entry):", signal.entry_range, COLORS.blue);
  drawRow("الهدف 1 (TP1):", `$${signal.targets.tp1.toLocaleString()}`, COLORS.green);
  drawRow("الهدف 2 (TP2):", `$${signal.targets.tp2.toLocaleString()}`, COLORS.green);
  drawRow("وقف الخسارة (SL):", `$${signal.targets.sl.toLocaleString()}`, COLORS.red);
  drawRow("درجة الثقة:", `%${signal.confidence}`, COLORS.text);

  // 6. السبب الفني (Reasoning)
  ctx.fillStyle = COLORS.gray;
  ctx.font = "bold 22px sans-serif";
  ctx.fillText("التحليل الاستنتاجي:", 830, startY + 20);
  
  ctx.fillStyle = "rgba(255,255,255,0.7)";
  ctx.font = "24px sans-serif";
  ctx.fillText(signal.reason, 830, startY + 60);

  // 7. رسم الشعار (Namix 2x2 Grid)
  const logoX = 70;
  const logoY = 980;
  const dotSize = 8;
  const gap = 12;

  // النقاط
  ctx.fillStyle = "#FFFFFF";
  ctx.beginPath();
  ctx.arc(logoX, logoY, dotSize, 0, Math.PI * 2);
  ctx.arc(logoX + gap, logoY + gap, dotSize, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#f9a885";
  ctx.beginPath();
  ctx.arc(logoX + gap, logoY, dotSize, 0, Math.PI * 2);
  ctx.arc(logoX, logoY + gap, dotSize, 0, Math.PI * 2);
  ctx.fill();

  // اسم المنصة بجانب الشعار
  ctx.fillStyle = COLORS.text;
  ctx.font = "900 24px sans-serif";
  ctx.fillText("NAMIX", logoX + 40, logoY + 12);

  // 8. التوقيع السفلي
  ctx.fillStyle = COLORS.gray;
  ctx.font = "18px sans-serif";
  ctx.fillText("Powered by Namix AI Intelligence", 830, 1050);

  return canvas.toBuffer("image/png");
}
