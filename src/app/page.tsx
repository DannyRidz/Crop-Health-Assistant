import { Screening } from "@/components/screening";

export const dynamic = "force-dynamic";

export default function HomePage() {
  return <Screening screeningAvailable={process.env.SCREENING_ENABLED === "true" && !!process.env.GEMINI_API_KEY && !!process.env.SESSION_SIGNING_SECRET}
    serviceTier={process.env.GEMINI_SERVICE_TIER === "paid" ? "paid" : "demo"} />;
}
