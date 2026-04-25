
import sharp from 'sharp';

/**
 * @fileOverview Namix Signal Image Generator v3.0 - Robust Multi-Layer Engine
 * تم تحويل نصوص الصورة للإنجليزية لضمان التوافق مع محركات الرسم السحابية (تجنب المربعات).
 * الشرح التفصيلي يظل بالعربية في الكابشن أسفل الصورة.
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
  const typeLabel = isBuy ? "LONG / BUY" : "SHORT / SELL";
  const typeColor = isBuy ? COLORS.green : COLORS.red;

  // SVG Overlay - استخدام خطوط النظام القياسية لضمان عدم ظهور مربعات
  const svgOverlay = `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <!-- Main Card Container -->
      <rect x="30" y="30" width="${width - 60}" height="${height - 60}" fill="${COLORS.card}" rx="40" />
      
      <!-- Top Branding & Pair -->
      <text x="70" y="110" font-family="sans-serif" font-size="48" font-weight="900" fill="${COLORS.text}">${signal.pair}</text>
      <text x="${width - 70}" y="110" font-family="sans-serif" font-size="38" font-weight="900" fill="${typeColor}" text-anchor="end">${typeLabel}</text>
      
      <!-- Chart Placeholder/Background -->
      <rect x="60" y="160" width="${width - 120}" height="450" fill="#161C2E" rx="20" />

      <!-- Data Matrix Section -->
      <g transform="translate(80, 680)">
        <text y="0" font-family="sans-serif" font-size="28" font-weight="800" fill="${COLORS.gray}">ENTRY ZONE</text>
        <text x="${width - 160}" y="0" font-family="sans-serif" font-size="32" font-weight="900" fill="${COLORS.blue}" text-anchor="end">${signal.entry_range}</text>

        <line x1="0" y1="40" x2="${width - 160}" y2="40" stroke="#1E2638" stroke-width="2" />

        <text y="100" font-family="sans-serif" font-size="28" font-weight="800" fill="${COLORS.gray}">TARGET 1 (TP1)</text>
        <text x="${width - 160}" y="100" font-family="sans-serif" font-size="32" font-weight="900" fill="${COLORS.green}" text-anchor="end">$${signal.targets.tp1.toLocaleString()}</text>

        <text y="180" font-family="sans-serif" font-size="28" font-weight="800" fill="${COLORS.gray}">TARGET 2 (TP2)</text>
        <text x="${width - 160}" y="180" font-family="sans-serif" font-size="32" font-weight="900" fill="${COLORS.green}" text-anchor="end">$${signal.targets.tp2.toLocaleString()}</text>

        <text y="260" font-family="sans-serif" font-size="28" font-weight="800" fill="${COLORS.gray}">STOP LOSS (SL)</text>
        <text x="${width - 160}" y="260" font-family="sans-serif" font-size="32" font-weight="900" fill="${COLORS.red}" text-anchor="end">$${signal.targets.sl.toLocaleString()}</text>

        <text y="340" font-family="sans-serif" font-size="28" font-weight="800" fill="${COLORS.gray}">CONFIDENCE</text>
        <text x="${width - 160}" y="340" font-family="sans-serif" font-size="32" font-weight="900" fill="${COLORS.text}" text-anchor="end">${signal.confidence}%</text>
      </g>

      <!-- Footer Branding -->
      <g transform="translate(80, 1040)">
        <circle cx="10" cy="-10" r="10" fill="white" />
        <circle cx="35" cy="15" r="10" fill="white" />
        <circle cx="35" cy="-10" r="10" fill="#f9a885" />
        <circle cx="10" cy="15" r="10" fill="#f9a885" />
        <text x="65" y="10" font-family="sans-serif" font-size="32" font-weight="900" fill="${COLORS.text}">NAMIX PRO</text>
        <text x="${width - 160}" y="10" font-family="sans-serif" font-size="20" font-weight="600" fill="${COLORS.gray}" text-anchor="end">LIVE INTELLIGENCE FEED</text>
      </g>
    </svg>
  `;

  try {
    const symbolClean = signal.pair.replace('/', '').toUpperCase();
    // استخدام رابط شارت أكثر استقراراً يدعم التخصيص المباشر
    const chartUrl = `https://www.tradingview.com/chart/?symbol=BINANCE:${symbolClean}`;
    // ملاحظة: جلب صور الشارتات يتطلب أحياناً Puppeteer، سنستخدم صورة تمثيلية فخمة حالياً لضمان عدم العطل
    // أو رابط مباشر إذا توفر. لضمان الاستقرار، سنعتمد على التصميم المعلوماتي القوي أولاً.
    
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

  } catch (e) {
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
