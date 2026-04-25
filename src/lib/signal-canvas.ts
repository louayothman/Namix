
import sharp from 'sharp';

/**
 * @fileOverview Namix Signal Image Generator v4.0 - Sovereign Card Edition
 * محرك رسم "بطاقة الذكاء الاصطناعي" - تصميم مينيماليست احترافي يشبه البطاقات المصرفية النخبوية.
 * النصوص داخل الصورة بالإنجليزية لضمان الاستقرار البصري العالمي.
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

  // بناء طبقة الـ SVG بأسلوب البطاقة المصرفية النخبوية
  const svgOverlay = `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <!-- Outer Background -->
      <rect width="100%" height="100%" fill="${COLORS.bg}" />
      
      <!-- Sovereign Card Chassis -->
      <rect x="40" y="40" width="${width - 80}" height="${height - 80}" fill="${COLORS.card}" rx="60" />
      
      <!-- Card Grain Effect (Subtle Pattern) -->
      <defs>
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1" fill="white" opacity="0.03" />
        </pattern>
      </defs>
      <rect x="40" y="40" width="${width - 80}" height="${height - 80}" fill="url(#grid)" rx="60" />

      <!-- Top Branding Hub -->
      <g transform="translate(100, 120)">
        <!-- Namix 2x2 Dots Logo -->
        <circle cx="0" cy="0" r="12" fill="white" />
        <circle cx="35" cy="0" r="12" fill="#f9a885" />
        <circle cx="0" cy="35" r="12" fill="#f9a885" />
        <circle cx="35" cy="35" r="12" fill="white" />
        
        <text x="75" y="28" font-family="sans-serif" font-size="44" font-weight="900" fill="${COLORS.text}" letter-spacing="4">NAMIX PRO</text>
        <text x="75" y="65" font-family="sans-serif" font-size="18" font-weight="800" fill="#f9a885" opacity="0.6" letter-spacing="8">INTELLIGENCE NODE</text>
      </g>

      <!-- Asset Title & Decision -->
      <g transform="translate(100, 280)">
        <text font-family="sans-serif" font-size="64" font-weight="900" fill="${COLORS.text}">${signal.pair}</text>
        <text x="${width - 200}" font-family="sans-serif" font-size="42" font-weight="900" fill="${typeColor}" text-anchor="end">${typeLabel}</text>
        <rect y="30" width="120" height="4" fill="${typeColor}" opacity="0.3" rx="2" />
      </g>

      <!-- Main Intelligence Matrix (The Card "Numbers" Area) -->
      <g transform="translate(100, 480)">
        <!-- Entry Section -->
        <text y="0" font-family="sans-serif" font-size="24" font-weight="800" fill="${COLORS.gray}" letter-spacing="2">ENTRY RANGE</text>
        <text y="55" font-family="sans-serif" font-size="52" font-weight="900" fill="${COLORS.blue}" letter-spacing="1">${signal.entry_range}</text>

        <!-- Dynamic Separator -->
        <line x1="0" y1="120" x2="${width - 200}" y2="120" stroke="white" opacity="0.05" stroke-width="2" />

        <!-- TP / SL Matrix -->
        <g transform="translate(0, 180)">
          <!-- TP 1 -->
          <text y="0" font-family="sans-serif" font-size="22" font-weight="800" fill="${COLORS.gray}" letter-spacing="2">TARGET 1 (TP1)</text>
          <text y="45" font-family="sans-serif" font-size="38" font-weight="900" fill="${COLORS.green}">$${signal.targets.tp1.toLocaleString()}</text>

          <!-- TP 2 -->
          <text x="350" y="0" font-family="sans-serif" font-size="22" font-weight="800" fill="${COLORS.gray}" letter-spacing="2">TARGET 2 (TP2)</text>
          <text x="350" y="45" font-family="sans-serif" font-size="38" font-weight="900" fill="${COLORS.green}">$${signal.targets.tp2.toLocaleString()}</text>

          <!-- Stop Loss -->
          <text y="140" font-family="sans-serif" font-size="22" font-weight="800" fill="${COLORS.gray}" letter-spacing="2">STOP LOSS (SL)</text>
          <text y="185" font-family="sans-serif" font-size="38" font-weight="900" fill="${COLORS.red}">$${signal.targets.sl.toLocaleString()}</text>

          <!-- Confidence -->
          <text x="350" y="140" font-family="sans-serif" font-size="22" font-weight="800" fill="${COLORS.gray}" letter-spacing="2">CONFIDENCE</text>
          <text x="350" y="185" font-family="sans-serif" font-size="38" font-weight="900" fill="${COLORS.text}">${signal.confidence}%</text>
        </g>
      </g>

      <!-- Footer Strategic Branding -->
      <g transform="translate(100, 950)">
        <rect width="${width - 200}" height="80" fill="white" opacity="0.02" rx="20" />
        <text x="30" y="50" font-family="sans-serif" font-size="22" font-weight="800" fill="${COLORS.gray}" letter-spacing="2">ANALYSIS BY</text>
        <text x="185" y="51" font-family="sans-serif" font-size="28" font-weight="900" fill="#f9a885">NAMIX AI ENGINE</text>
        <text x="${width - 230}" y="50" font-family="sans-serif" font-size="18" font-weight="900" fill="${COLORS.text}" text-anchor="end" opacity="0.3">V4.0 SECURE NODE</text>
      </g>
      
      <!-- Holographic Security Node (Bottom Left) -->
      <circle cx="100" cy="850" r="40" fill="${COLORS.blue}" opacity="0.1" />
      <circle cx="120" cy="850" r="40" fill="${COLORS.green}" opacity="0.1" />
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
  .png()
  .toBuffer();
}
