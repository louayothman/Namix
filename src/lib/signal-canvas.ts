
import sharp from 'sharp';

/**
 * @fileOverview Namix Signal Image Generator v2.0 - Sharp Edition
 * محرك توليد بطاقات الإشارات الاحترافية باستخدام Sharp لضمان الاستقرار في بيئة Next.js.
 * تم استخدام تقنية SVG Overlay لرسم العناصر التكتيكية فوق الرسم البياني الحقيقي.
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

  const isBuy = signal.decision === 'BUY';
  const typeLabel = isBuy ? "LONG" : "SHORT";
  const typeColor = isBuy ? COLORS.green : COLORS.red;

  // بناء الطبقة الرسومية بنظام SVG لضمان أعلى جودة للنصوص والأشكال
  const svgOverlay = `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="10"/>
          <feOffset dx="0" dy="10" result="offsetblur"/>
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.5"/>
          </feComponentTransfer>
          <feMerge>
            <feMergeNode/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      <!-- الكرت الرئيسي -->
      <rect x="40" y="40" width="${width - 80}" height="${height - 80}" fill="${COLORS.card}" rx="32" filter="url(#shadow)" />
      
      <!-- الترويسة -->
      <text x="70" y="105" font-family="sans-serif" font-size="44" font-weight="900" fill="${COLORS.text}">${signal.pair}</text>
      <text x="${width - 70}" y="105" font-family="sans-serif" font-size="44" font-weight="900" fill="${typeColor}" text-anchor="end">${typeLabel}</text>
      
      <!-- مصفوفة البيانات الرقمية -->
      <g transform="translate(70, 640)">
        <text y="0" font-family="sans-serif" font-size="24" font-weight="bold" fill="${COLORS.gray}">الدخول (Entry):</text>
        <text x="${width - 140}" y="0" font-family="sans-serif" font-size="28" font-weight="900" fill="${COLORS.blue}" text-anchor="end">${signal.entry_range}</text>

        <text y="75" font-family="sans-serif" font-size="24" font-weight="bold" fill="${COLORS.gray}">الهدف 1 (TP1):</text>
        <text x="${width - 140}" y="75" font-family="sans-serif" font-size="28" font-weight="900" fill="${COLORS.green}" text-anchor="end">$${signal.targets.tp1.toLocaleString()}</text>

        <text y="150" font-family="sans-serif" font-size="24" font-weight="bold" fill="${COLORS.gray}">الهدف 2 (TP2):</text>
        <text x="${width - 140}" y="150" font-family="sans-serif" font-size="28" font-weight="900" fill="${COLORS.green}" text-anchor="end">$${signal.targets.tp2.toLocaleString()}</text>

        <text y="225" font-family="sans-serif" font-size="24" font-weight="bold" fill="${COLORS.gray}">وقف الخسارة (SL):</text>
        <text x="${width - 140}" y="225" font-family="sans-serif" font-size="28" font-weight="900" fill="${COLORS.red}" text-anchor="end">$${signal.targets.sl.toLocaleString()}</text>

        <text y="300" font-family="sans-serif" font-size="24" font-weight="bold" fill="${COLORS.gray}">درجة الثقة:</text>
        <text x="${width - 140}" y="300" font-family="sans-serif" font-size="28" font-weight="900" fill="${COLORS.text}" text-anchor="end">%${signal.confidence}</text>
      </g>

      <!-- التذييل والعلامة التجارية -->
      <g transform="translate(70, 1020)">
        <!-- شعار ناميكس 2x2 -->
        <circle cx="0" cy="0" r="8" fill="white" />
        <circle cx="20" cy="20" r="8" fill="white" />
        <circle cx="20" cy="0" r="8" fill="#f9a885" />
        <circle cx="0" cy="20" r="8" fill="#f9a885" />
        
        <text x="45" y="18" font-family="sans-serif" font-size="28" font-weight="900" fill="${COLORS.text}">NAMIX</text>
        <text x="${width - 140}" y="18" font-family="sans-serif" font-size="20" fill="${COLORS.gray}" text-anchor="end">Powered by Namix AI Intelligence</text>
      </g>
    </svg>
  `;

  try {
    const symbolClean = signal.pair.replace('/', '').toUpperCase();
    const chartUrl = `https://chart-img.com/v1/tradingview/advanced-chart?symbol=BINANCE:${symbolClean}&theme=dark&width=800&height=450&interval=1h&style=1`;
    
    const chartRes = await fetch(chartUrl);
    if (!chartRes.ok) throw new Error("Chart Fetch Fail");
    const chartBuffer = Buffer.from(await chartRes.arrayBuffer());

    // عملية الدمج النهائية (Compositing)
    return await sharp({
      create: {
        width,
        height,
        channels: 4,
        background: COLORS.bg
      }
    })
    .composite([
      { input: chartBuffer, top: 140, left: 50 },
      { input: Buffer.from(svgOverlay), top: 0, left: 0 }
    ])
    .png()
    .toBuffer();

  } catch (e) {
    // في حالة فشل جلب الشارت، ننتج البطاقة المعلوماتية فقط
    return await sharp({
      create: {
        width,
        height,
        channels: 4,
        background: COLORS.bg
      }
    })
    .composite([
      { input: Buffer.from(svgOverlay), top: 0, left: 0 }
    ])
    .png()
    .toBuffer();
  }
}
