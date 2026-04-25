
import sharp from 'sharp';

/**
 * @fileOverview Namix Signal Image Generator v6.0 - Pure JPG Sovereign Card
 * محرك توليد بطاقات الإشارات بصيغة JPG الصافية.
 * تصميم يحاكي البطاقات المصرفية الفاخرة مع خلفية موجية وشعار ناميكس المعتمد.
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

  // نمط الأمواج الرقيقة جداً للخلفية
  const waves = `
    <g opacity="0.05">
      <path d="M0 200 Q 225 150 450 200 T 900 200" fill="none" stroke="white" stroke-width="0.5" />
      <path d="M0 300 Q 225 250 450 300 T 900 300" fill="none" stroke="white" stroke-width="0.5" />
      <path d="M0 400 Q 225 350 450 400 T 900 400" fill="none" stroke="white" stroke-width="0.5" />
      <path d="M0 500 Q 225 450 450 500 T 900 500" fill="none" stroke="white" stroke-width="0.5" />
      <path d="M0 600 Q 225 550 450 600 T 900 600" fill="none" stroke="white" stroke-width="0.5" />
    </g>
  `;

  // بناء الطبقة الرسومية (SVG لـ Sharp ليعالجها كـ JPG)
  const svgOverlay = `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <!-- الخلفية الرئيسية -->
      <rect width="100%" height="100%" fill="${COLORS.bg}" />
      
      <!-- جسم البطاقة السيادية -->
      <rect x="40" y="40" width="${width - 80}" height="${height - 80}" fill="${COLORS.card}" rx="60" />
      
      <!-- طبقة الأمواج -->
      ${waves}

      <!-- ترويسة الهوية: شعار ناميكس 2x2 -->
      <g transform="translate(100, 120)">
        <circle cx="0" cy="0" r="12" fill="white" />
        <circle cx="35" cy="0" r="12" fill="${COLORS.accent}" />
        <circle cx="0" cy="35" r="12" fill="${COLORS.accent}" />
        <circle cx="35" cy="35" r="12" fill="white" />
        
        <text x="75" y="28" font-family="sans-serif" font-size="46" font-weight="900" fill="${COLORS.text}" style="letter-spacing: 2px;">NAMIX PRO</text>
        <text x="75" y="65" font-family="sans-serif" font-size="16" font-weight="800" fill="${COLORS.accent}" opacity="0.6" style="letter-spacing: 6px;">INTELLIGENCE CARD</text>
      </g>

      <!-- بيانات العملة والقرار -->
      <g transform="translate(100, 300)">
        <text font-family="sans-serif" font-size="72" font-weight="900" fill="${COLORS.text}">${signal.pair}</text>
        <text x="${width - 200}" y="5" font-family="sans-serif" font-size="44" font-weight="900" fill="${typeColor}" text-anchor="end">${typeLabel}</text>
      </g>

      <!-- مصفوفة البيانات التكتيكية -->
      <g transform="translate(100, 500)">
        <!-- الدخول -->
        <text y="0" font-family="sans-serif" font-size="24" font-weight="800" fill="${COLORS.gray}" style="letter-spacing: 2px;">ENTRY ZONE</text>
        <text y="70" font-family="sans-serif" font-size="56" font-weight="900" fill="${COLORS.blue}">${signal.entry_range}</text>

        <g transform="translate(0, 200)">
          <!-- الهدف الأول -->
          <text y="0" font-family="sans-serif" font-size="22" font-weight="800" fill="${COLORS.gray}" style="letter-spacing: 2px;">TARGET 1 (TP1)</text>
          <text y="55" font-family="sans-serif" font-size="46" font-weight="900" fill="${COLORS.green}">$${signal.targets.tp1.toLocaleString()}</text>

          <!-- الهدف الثاني -->
          <text x="360" y="0" font-family="sans-serif" font-size="22" font-weight="800" fill="${COLORS.gray}" style="letter-spacing: 2px;">TARGET 2 (TP2)</text>
          <text x="360" y="55" font-family="sans-serif" font-size="46" font-weight="900" fill="${COLORS.green}">$${signal.targets.tp2.toLocaleString()}</text>

          <!-- وقف الخسارة -->
          <text y="170" font-family="sans-serif" font-size="22" font-weight="800" fill="${COLORS.gray}" style="letter-spacing: 2px;">STOP LOSS (SL)</text>
          <text y="225" font-family="sans-serif" font-size="46" font-weight="900" fill="${COLORS.red}">$${signal.targets.sl.toLocaleString()}</text>

          <!-- الثقة -->
          <text x="360" y="170" font-family="sans-serif" font-size="22" font-weight="800" fill="${COLORS.gray}" style="letter-spacing: 2px;">CONFIDENCE</text>
          <text x="360" y="225" font-family="sans-serif" font-size="46" font-weight="900" fill="${COLORS.text}">${signal.confidence}%</text>
        </g>
      </g>

      <!-- تذييل البطاقة -->
      <g transform="translate(100, 980)">
        <rect width="${width - 200}" height="80" fill="white" opacity="0.04" rx="20" />
        <text x="30" y="50" font-family="sans-serif" font-size="20" font-weight="800" fill="${COLORS.gray}" style="letter-spacing: 2px;">POWERED BY</text>
        <text x="180" y="52" font-family="sans-serif" font-size="26" font-weight="900" fill="${COLORS.accent}">NAMIX AI CORE</text>
        <text x="${width - 240}" y="50" font-family="sans-serif" font-size="16" font-weight="900" fill="${COLORS.text}" text-anchor="end" opacity="0.3">V6.0 DEPLOYMENT</text>
      </g>
      
      <!-- رقاقة البطاقة الشبحية -->
      <rect x="100" y="840" width="80" height="60" fill="${COLORS.blue}" opacity="0.06" rx="15" />
    </svg>
  `;

  // تحويل الرسم إلى JPG عالي الجودة
  return await sharp(Buffer.from(svgOverlay))
    .jpeg({ quality: 95, chromaSubsampling: '4:4:4' })
    .toBuffer();
}
