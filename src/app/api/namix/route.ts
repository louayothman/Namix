import { NextResponse } from "next/server";
import { runNamix } from "@/lib/namix-orchestrator";

/**
 * @fileOverview NAMIX AI API Route
 * Exposes the orchestrator logic to the frontend with duration awareness.
 */

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const symbol = searchParams.get("symbol") || "BTCUSDT";
    const duration = searchParams.get("duration") ? Number(searchParams.get("duration")) : undefined;

    const result = await runNamix(symbol, duration);

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
