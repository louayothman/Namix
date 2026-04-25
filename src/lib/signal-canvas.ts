
import sharp from 'sharp';

/**
 * @fileOverview Namix Signal Image Generator v5.0 - Sovereign Card Edition (PNG)
 * محرك رسم "بطاقة الهوية المالية" - تصميم بنكي نخبوية مع خلفية موجية.
 * تم حل مشكلة المربعات عبر استخدام الخطوط القياسية والمخرجات النقطية PNG.
 */

const COLORS = {
  bg: "#0B0F1A",
  card: "#121826",
  text: "#FFFFFF",
  green: "#00C896",
  red: "#FF4D4F",
  blue: "#3A86FF",
  gray: "#8A94A6",
  accent: "#f9a885"
};

export async function generateSignalImage(signal: any) {
  const width = 900;
  const height = 1100;

  const isBuy = signal.decision === 'BUY';
  const typeLabel = isBuy ? "LONG / BUY" : "SHORT / SELL";
  const typeColor = isBuy ? COLORS.green : COLORS.red;

  // توليد مسار الأمواج الرقيقة
  const wavePath = `
    <path d="M0 100 Q 225 50 450 100 T 900 100" fill="none" stroke="white" stroke-width="0.5" opacity="0.05" />
    <path d="M0 150 Q 225 100 450 150 T 900 150" fill="none" stroke="white" stroke-width="0.5" opacity="0.03" />
    <path d="M0 200 Q 225 150 450 200 T 900 200" fill="none" stroke="white" stroke-width="0.5" opacity="0.02" />
  `;

  // بناء طبقة الـ SVG بأسلوب البطاقة المصرفية النخبوية
  const svgOverlay = `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <!-- Outer Background -->
      <rect width="100%" height="100%" fill="${COLORS.bg}" />
      
      <!-- Sovereign Card Chassis -->
      <rect x="40" y="40" width="${width - 80}" height="${height - 80}" fill="${COLORS.card}" rx="60" />
      
      <!-- Tactical Wave Pattern -->
      <g transform="translate(0, 400)">
        ${wavePath}
        <g transform="translate(0, 100)">${wavePath}</g>
        <g transform="translate(0, 200)">${wavePath}</g>
      </g>

      <!-- Top Branding Hub -->
      <g transform="translate(100, 120)">
        <!-- Namix 2x2 Dots Logo -->
        <circle cx="0" cy="0" r="12" fill="white" />
        <circle cx="35" cy="0" r="12" fill="${COLORS.accent}" />
        <circle cx="0" cy="35" r="12" fill="${COLORS.accent}" />
        <circle cx="35" cy="35" r="12" fill="white" />
        
        <text x="75" y="28" font-family="sans-serif" font-size="44" font-weight="900" fill="${COLORS.text}" style="letter-spacing: 4px;">NAMIX PRO</text>
        <text x="75" y="65" font-family="sans-serif" font-size="18" font-weight="800" fill="${COLORS.accent}" opacity="0.6" style="letter-spacing: 8px;">INTELLIGENCE NODE</text>
      </g>

      <!-- Asset Title & Decision -->
      <g transform="translate(100, 280)">
        <text font-family="sans-serif" font-size="64" font-weight="900" fill="${COLORS.text}">${signal.pair}</text>
        <text x="${width - 200}" y="5" font-family="sans-serif" font-size="42" font-weight="900" fill="${typeColor}" text-anchor="end">${typeLabel}</text>
        <rect y="35" width="150" height="4" fill="${typeColor}" opacity="0.4" rx="2" />
      </g>

      <!-- Main Intelligence Matrix -->
      <g transform="translate(100, 480)">
        <!-- Entry Section -->
        <text y="0" font-family="sans-serif" font-size="24" font-weight="800" fill="${COLORS.gray}" style="letter-spacing: 2px;">ENTRY RANGE</text>
        <text y="65" font-family="sans-serif" font-size="52" font-weight="900" fill="${COLORS.blue}">${signal.entry_range}</text>

        <!-- TP / SL Matrix -->
        <g transform="translate(0, 180)">
          <!-- TP 1 -->
          <text y="0" font-family="sans-serif" font-size="22" font-weight="800" fill="${COLORS.gray}" style="letter-spacing: 2px;">TARGET 1 (TP1)</text>
          <text y="50" font-family="sans-serif" font-size="42" font-weight="900" fill="${COLORS.green}">$${signal.targets.tp1.toLocaleString()}</text>

          <!-- TP 2 -->
          <text x="350" y="0" font-family="sans-serif" font-size="22" font-weight="800" fill="${COLORS.gray}" style="letter-spacing: 2px;">TARGET 2 (TP2)</text>
          <text x="350" y="50" font-family="sans-serif" font-size="42" font-weight="900" fill="${COLORS.green}">$${signal.targets.tp2.toLocaleString()}</text>

          <!-- Stop Loss -->
          <text y="160" font-family="sans-serif" font-size="22" font-weight="800" fill="${COLORS.gray}" style="letter-spacing: 2px;">STOP LOSS (SL)</text>
          <text y="210" font-family="sans-serif" font-size="42" font-weight="900" fill="${COLORS.red}">$${signal.targets.sl.toLocaleString()}</text>

          <!-- Confidence -->
          <text x="350" y="160" font-family="sans-serif" font-size="22" font-weight="800" fill="${COLORS.gray}" style="letter-spacing: 2px;">CONFIDENCE</text>
          <text x="350" y="210" font-family="sans-serif" font-size="42" font-weight="900" fill="${COLORS.text}">${signal.confidence}%</text>
        </g>
      </g>

      <!-- Footer Strategic Branding -->
      <g transform="translate(100, 950)">
        <rect width="${width - 200}" height="90" fill="white" opacity="0.03" rx="25" />
        <text x="40" y="55" font-family="sans-serif" font-size="22" font-weight="800" fill="${COLORS.gray}" style="letter-spacing: 2px;">ANALYSIS BY</text>
        <text x="210" y="56" font-family="sans-serif" font-size="28" font-weight="900" fill="${COLORS.accent}">NAMIX AI ENGINE</text>
        <text x="${width - 240}" y="55" font-family="sans-serif" font-size="18" font-weight="900" fill="${COLORS.text}" text-anchor="end" opacity="0.3">V5.0 SECURE NODE</text>
      </g>
      
      <!-- Holographic Chip Placeholder (Bottom Left) -->
      <rect x="100" y="820" width="80" height="60" fill="${COLORS.blue}" opacity="0.05" rx="12" />
      <rect x="110" y="830" width="60" height="40" fill="${COLORS.accent}" opacity="0.1" rx="8" />
    </svg>
  `;

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
  .png({ quality: 95 })
  .toBuffer();
}
