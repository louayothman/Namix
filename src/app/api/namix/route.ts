
import { NextResponse } from "next/server";
import { runNamix } from "@/lib/namix-orchestrator";

/**
 * @fileOverview NAMIX AI API Route
 * Exposes the orchestrator logic to the frontend via server-side execution.
 */

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const symbol = searchParams.get("symbol") || "BTCUSDT";

    // Since runNamix is logic-only and currently client-marked, 
    // but we need it here, we'll ensure it runs effectively.
    const result = await runNamix(symbol);

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
