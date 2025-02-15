import { NextRequest, NextResponse } from "next/server";
import twilio from "twilio";

export async function GET(req: NextRequest) {
  const accountSid = req.headers.get("x-account-sid") || "";
  const authToken = req.headers.get("x-auth-token") || "";

  console.log("Received Account SID:", accountSid);
  console.log("Received Auth Token:", authToken ? "Present" : "Missing");

  if (!accountSid.startsWith("AC") || !authToken) {
    return NextResponse.json(
      { error: "Invalid or missing Twilio credentials" },
      { status: 400 }
    );
  }

  const client = twilio(accountSid, authToken);

  async function fetchDailyCostReport(date: string): Promise<number> {
    let totalCost = 0;

    try {
      const formattedDate = new Date(date);

      const records = await client.usage.records.daily.list({
        startDate: formattedDate,
        endDate: formattedDate,
      });

      totalCost = records.reduce(
        (sum, record) =>
          sum +
          (typeof record.price === "number"
            ? record.price
            : parseFloat(record.price || "0")),
        0
      );
    } catch (error) {
      console.error("Error fetching usage records:", error);
    }

    return totalCost;
  }

  const today = new Date().toISOString().split("T")[0];
  const totalCost = await fetchDailyCostReport(today);

  return NextResponse.json({ date: today, totalCost: totalCost.toFixed(2) });
}
